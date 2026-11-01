# Day 19 — End-to-end sklearn Pipelines + Imbalanced Data

## 1. Overview

A production-ready ML workflow should treat preprocessing, sampling, and prediction as one reproducible process.

This lecture covers:
- Why an end-to-end scikit-learn Pipeline reduces data leakage
- Combining numeric and categorical preprocessing with ColumnTransformer
- Class imbalance and why accuracy can mislead
- Class weights, random over/under-sampling, and SMOTE
- Correct use of imbalanced-learn Pipeline during cross-validation
- Metrics, threshold tuning, and model evaluation

## 2. Why Use a Pipeline?

A Pipeline chains transformations and an estimator into one object.

Without a pipeline, a common mistake is:
1. Fit an imputer or scaler on the full dataset.
2. Split into train and test.
3. Train the model.
4. Evaluate on the test set.

The preprocessing step has already seen information from the held-out set. This is a form of leakage.

With a Pipeline, each cross-validation training fold fits its own preprocessing steps. Its validation fold receives only transformations learned from that fold's training data.

```text
Training fold
     |
Imputer.fit
     |
Scaler.fit
     |
Encoder.fit
     |
Model.fit
     |
Validation fold → transform using fitted steps → predict → score
```

A Pipeline does not automatically prevent every kind of leakage. You must still design valid splits, remove future-derived features, and keep target-derived transformations safe.

## 3. Pipeline and ColumnTransformer

### Pipeline

Chains steps in order. Each intermediate step usually transforms data; the final step is the estimator.

### ColumnTransformer

Applies different preprocessing to different column groups, then concatenates the transformed features.

Use both together when a dataset contains numeric and categorical columns.

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

numeric_features = ["age", "income", "account_days"]
categorical_features = ["city", "plan_type"]

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features)
])

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=2000))
])

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

Use your actual feature names. The example is for a binary or multiclass classification task supported by Logistic Regression.

## 4. What Is Class Imbalance?

A classification dataset is imbalanced when one class is much more frequent than another.

Example: a fraud dataset has:
- 99,000 non-fraud transactions
- 1,000 fraud transactions

A classifier that always predicts “not fraud” gets 99% accuracy, but detects no fraud.

The key question is not simply “How many predictions are correct?” It is “Which errors matter, and how costly are they?”

## 5. Confusion Matrix

For binary classification:

| | Predicted positive | Predicted negative |
|---|---:|---:|
| Actual positive | True Positive (TP) | False Negative (FN) |
| Actual negative | False Positive (FP) | True Negative (TN) |

Metrics:

\[
Precision=\frac{TP}{TP+FP}
\]

\[
Recall=\frac{TP}{TP+FN}
\]

\[
F1=2\cdot\frac{Precision\cdot Recall}{Precision+Recall}
\]

- Precision: among predicted positives, how many are truly positive?
- Recall: among actual positives, how many did the model find?
- F1: harmonic mean of precision and recall.

Also consider:
- Specificity: true negative rate.
- Balanced accuracy: average recall across classes.
- PR-AUC: useful to inspect precision–recall trade-offs, especially when the positive class is rare.
- ROC-AUC: measures ranking across false-positive/true-positive rates, but can look strong under severe imbalance even when positive precision is poor.

Choose the metric based on the cost of false positives and false negatives.

## 6. Baseline Before Resampling

Always establish a baseline first.

```python
from sklearn.dummy import DummyClassifier
from sklearn.metrics import classification_report

baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train, y_train)

baseline_predictions = baseline.predict(X_test)
print(classification_report(y_test, baseline_predictions, zero_division=0))
```

Then compare a real model against this baseline using metrics appropriate to the problem.

## 7. Class Weighting

Many classifiers support `class_weight="balanced"` or explicit class weights.

The balanced heuristic weights classes inversely to their observed frequencies.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

model = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(
        class_weight="balanced",
        max_iter=2000
    ))
])

model.fit(X_train, y_train)
```

Class weighting changes the training loss contribution of classes. It does not create synthetic samples.

Other estimators, including tree-based models, may expose their own class-weight controls. Check the estimator documentation.

## 8. Resampling Strategies

Resampling changes the class distribution of the training data.

### Random oversampling

Duplicates minority-class examples.

Advantages:
- Simple.
- Does not discard majority-class observations.

Limitations:
- Can increase overfitting because duplicated rows provide no new information.

### Random undersampling

Removes majority-class examples.

Advantages:
- Reduces training-set size.
- Can help when the majority class is extremely large.

Limitations:
- May discard useful information.

### SMOTE

SMOTE creates synthetic minority examples by interpolating between minority-class neighbours.

Simplified intuition:

\[
x_{new}=x_i+\delta(x_{neighbor}-x_i),\quad 0\leq\delta\leq1
\]

It can help some numeric classification problems, but:
- Synthetic points may be unrealistic.
- It can amplify noise or overlap.
- It is not automatically appropriate for categorical or mixed data.
- It must be applied only to training folds.

For mixed numeric/categorical data, investigate SMOTENC rather than applying ordinary SMOTE to one-hot encoded columns indiscriminately.

## 9. Critical Rule: Resample Only Inside the Training Fold

**Never run SMOTE or oversampling on the complete dataset before splitting.**

Why?
- Synthetic examples may be influenced by observations that later appear in validation/test.
- Validation data no longer represents an untouched evaluation sample.
- Scores can be misleading.

Use `imblearn.pipeline.Pipeline`, which applies samplers during `fit` and not when transforming/predicting held-out data.

```python
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = ImbPipeline([
    ("scaler", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("classifier", LogisticRegression(max_iter=2000))
])

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

For numerical data, scaling before SMOTE is often important because SMOTE uses neighbour distances. The correct order and preprocessing depend on the feature types.

## 10. Cross-Validation with an Imbalanced-Learn Pipeline

```python
from imblearn.pipeline import Pipeline as ImbPipeline
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipeline = ImbPipeline([
    ("scaler", StandardScaler()),
    ("smote", SMOTE(random_state=42)),
    ("classifier", LogisticRegression(max_iter=2000))
])

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

scoring = {
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "average_precision": "average_precision",
    "balanced_accuracy": "balanced_accuracy"
}

scores = cross_validate(
    pipeline,
    X_train,
    y_train,
    cv=cv,
    scoring=scoring,
    n_jobs=-1
)

for metric, values in scores.items():
    if metric.startswith("test_"):
        print(metric, values.mean(), values.std())
```

This example assumes binary labels and numeric features. For multiclass tasks, choose metrics such as macro-F1 and configure scoring accordingly.

## 11. Threshold Tuning

Many classifiers return probabilities or decision scores. The default classification threshold is not automatically optimal for the business task.

For a binary classifier, lowering the positive threshold often:
- Increases recall.
- Also increases false positives and may reduce precision.

Choose the threshold on validation data based on the operational cost or target metric. Do not tune it on the final test set.

```python
from sklearn.metrics import precision_recall_curve
import numpy as np

# Fit the model using training data only.
model.fit(X_train, y_train)

# Use validation probabilities to select a threshold.
valid_probabilities = model.predict_proba(X_valid)[:, 1]
precision, recall, thresholds = precision_recall_curve(
    y_valid,
    valid_probabilities
)

# Example policy: choose the threshold that reaches at least 0.90 recall
eligible = np.where(recall[:-1] >= 0.90)[0]

if len(eligible):
    best_index = eligible[np.argmax(precision[:-1][eligible])]
    chosen_threshold = thresholds[best_index]
    print("Chosen threshold:", chosen_threshold)
```

The target recall of 0.90 is only an example policy. Choose a target based on the actual task and costs.

After choosing the threshold and freezing the workflow, evaluate once on the untouched test set.

## 12. A Full Leakage-Safe Workflow

1. Define the positive class and prediction time.
2. Split into training, validation, and final test sets (or use a suitable CV design).
3. Put imputation, scaling, encoding, and model steps inside a Pipeline/ColumnTransformer.
4. Put any resampler inside an imbalanced-learn Pipeline.
5. Use stratified splitting for ordinary imbalanced classification; use group/time-aware splits when needed.
6. Compare against a dummy baseline.
7. Evaluate precision, recall, F1, PR-AUC, balanced accuracy, and business costs as appropriate.
8. Tune hyperparameters and threshold on training/validation data only.
9. Keep the final test set untouched.
10. Save the complete fitted pipeline, not just the final classifier.

## 13. Common Mistakes

- Using accuracy as the only metric.
- Oversampling or applying SMOTE before splitting.
- Applying a sampler to validation or test data.
- Forgetting that SMOTE is distance-based and may need scaling.
- Applying ordinary SMOTE blindly to categorical features.
- Choosing a threshold on the test set.
- Using random stratified splitting when rows are grouped or temporal.
- Saving only the model while forgetting preprocessing.
- Assuming class weighting and resampling are interchangeable.
- Assuming an imbalanced dataset always needs synthetic sampling.

## 14. Placement and Interview Questions

**Q1. Why can accuracy be misleading on imbalanced data?**  
A majority-class model can achieve high accuracy while failing to detect the minority class.

**Q2. Precision vs recall?**  
Precision measures correctness among predicted positives; recall measures how many actual positives are found.

**Q3. What is PR-AUC?**  
Area under the precision–recall curve; it summarises the precision/recall trade-off across thresholds.

**Q4. What is SMOTE?**  
A technique that creates synthetic minority samples by interpolating between minority-class neighbours.

**Q5. Why must SMOTE be inside cross-validation?**  
Each training fold must generate synthetic examples without using its validation fold.

**Q6. Class weighting vs resampling?**  
Class weighting changes the loss contribution of classes; resampling changes the training sample distribution.

**Q7. Why tune the classification threshold?**  
The default threshold may not match the costs or desired precision/recall balance.

**Q8. What should be saved for deployment?**  
The complete fitted preprocessing-plus-model pipeline and the metadata needed to reproduce its input contract.

## 15. Practice

### Paper exercise

A fraud model produces:
- TP = 80
- FP = 40
- FN = 20
- TN = 9,860

Calculate:
1. Precision
2. Recall
3. F1
4. Accuracy

Explain why accuracy alone is not sufficient.

### Coding exercise

On an imbalanced binary dataset, compare:
- DummyClassifier
- Logistic Regression without class weighting
- Logistic Regression with class weighting
- Logistic Regression with SMOTE inside an imbalanced-learn Pipeline

Report precision, recall, F1, average precision, balanced accuracy, and confusion matrix. Tune the threshold on validation data only.

## 16. Quick Revision

- **Imbalance:** one class is much less frequent.
- **Accuracy trap:** majority prediction can look good.
- **Precision:** TP / (TP + FP).
- **Recall:** TP / (TP + FN).
- **F1:** harmonic mean of precision and recall.
- **Class weight:** changes loss emphasis.
- **SMOTE:** synthesises minority examples from neighbours.
- **Critical rule:** resample training folds only.
- **imblearn Pipeline:** integrates samplers safely with CV.
- **Threshold:** choose on validation data based on cost/metric.
- **Deployment:** save preprocessing and model together.

## 17. Final Checklist

- [ ] Explain why accuracy fails under severe imbalance.
- [ ] Calculate precision, recall, F1, and balanced accuracy.
- [ ] Compare class weighting and resampling.
- [ ] Explain SMOTE and its limitations.
- [ ] Put SMOTE inside imbalanced-learn Pipeline.
- [ ] Use stratified or appropriate group/time-based validation.
- [ ] Tune threshold without touching the final test set.
- [ ] Save the complete fitted workflow.

## 18. Recommended Resources

- [scikit-learn: Pipeline tutorial](https://scikit-learn.org/stable/modules/compose.html)
- [Krish Naik: scikit-learn Pipelines](https://www.youtube.com/results?search_query=Krish+Naik+sklearn+Pipeline)
- [imbalanced-learn: Pipeline documentation](https://imbalanced-learn.org/stable/references/pipeline.html)
- [imbalanced-learn: User Guide](https://imbalanced-learn.org/stable/user_guide.html)
