# Day 10 — Random Forests + Bagging

## 1. Overview

A **Random Forest** is an ensemble learning method that combines many decision trees. Instead of trusting one tree, it trains multiple diverse trees and combines their predictions.

This lecture covers:
- Why ensembles can outperform a single model
- Bootstrap sampling and bagging
- Random feature selection
- Out-of-bag (OOB) evaluation
- Feature importance
- Practical use with scikit-learn

## 2. Why Use an Ensemble?

A single decision tree is easy to understand, but small changes in its training data can produce a very different tree. This instability is called **high variance**.

An ensemble combines predictions from multiple models. If the models make different errors, aggregation can reduce the effect of any one model's mistakes.

### Classification

For classification, a forest usually uses majority voting:

```text
Tree 1 → Class A
Tree 2 → Class B
Tree 3 → Class A
Tree 4 → Class A
Tree 5 → Class B

Forest prediction → Class A (3 votes out of 5)
```

### Regression

For regression, predictions are commonly averaged:

\[
\hat{y}_{forest}(x)=\frac{1}{B}\sum_{b=1}^{B}\hat{y}_b(x)
\]

where \(B\) is the number of trees.

**Important:** Ensembling does not guarantee better results. The models must be useful, and diversity between their errors matters.

## 3. Bagging: Bootstrap Aggregating

**Bagging** means training multiple models on different bootstrap samples and aggregating their predictions.

A bootstrap sample is created by randomly selecting \(n\) training examples **with replacement** from a dataset containing \(n\) rows.

With replacement means the same row can be selected more than once, while some rows may not be selected.

### Example

Original dataset:

| Row | Value |
|---|---:|
| A | 10 |
| B | 20 |
| C | 30 |
| D | 40 |
| E | 50 |

One possible bootstrap sample of size five:

`[B, D, B, E, A]`

- B appears twice.
- C is not selected.
- The sample still contains five entries.

Different bootstrap samples create different training sets, producing different models.

### Probability that a row is left out

For one draw, the probability of not selecting a particular row is \(1-\frac{1}{n}\).

After \(n\) independent draws:

\[
P(\text{row omitted})=\left(1-\frac{1}{n}\right)^n
\]

As \(n\) becomes large, this approaches:

\[
e^{-1}\approx 0.368
\]

So a bootstrap sample contains about 63.2% unique training rows on average, and leaves about 36.8% out.

## 4. How Bagging Reduces Variance

Suppose each model has prediction variance \(\sigma^2\), and pairwise correlation between model errors is \(\rho\). For an average of \(B\) equally variable models, a simplified variance expression is:

\[
Var(\bar{f})=\rho\sigma^2+\frac{1-\rho}{B}\sigma^2
\]

This illustrates two key ideas:
- Increasing the number of models reduces the uncorrelated part of variance.
- Correlated models limit the benefit of adding more models.

If every tree makes nearly identical errors, averaging them provides little improvement.

## 5. Random Forest: Bagging Plus Random Features

A Random Forest adds feature randomness to bagging.

At each split, a tree considers only a randomly selected subset of the available features rather than evaluating every feature.

This makes trees less correlated and can improve the ensemble's generalisation.

### Training process

1. Draw a bootstrap sample from the training data.
2. Grow a decision tree using that sample.
3. At each split, randomly select a subset of features.
4. Choose the best split among only those selected features.
5. Repeat for many trees.
6. Aggregate their predictions.

```text
                 Training dataset
                        |
          +-------------+-------------+
          |             |             |
      Bootstrap 1   Bootstrap 2   Bootstrap 3
          |             |             |
      Random tree   Random tree   Random tree
      + features    + features    + features
          |             |             |
          +-------------+-------------+
                        |
                Voting / Averaging
                        |
                  Final prediction
```

## 6. Important Random Forest Hyperparameters

| Parameter | Meaning | Practical effect |
|---|---|---|
| `n_estimators` | Number of trees | More trees can stabilise predictions but cost more time and memory |
| `max_features` | Features considered at each split | Lower values often increase tree diversity |
| `max_depth` | Maximum depth of each tree | Limits complexity |
| `min_samples_split` | Minimum samples needed to split a node | Larger values create more conservative trees |
| `min_samples_leaf` | Minimum samples in a leaf | Helps avoid tiny, noisy leaves |
| `bootstrap` | Whether bootstrap samples are used | Enables bagging-style sampling |
| `oob_score` | Whether OOB evaluation is computed | Estimates generalisation without a separate validation set |
| `class_weight` | Class weighting for classification | Can help with imbalanced classes |

Do not tune every parameter blindly. Start with a baseline and use cross-validation or a held-out validation set.

## 7. Out-of-Bag (OOB) Error

A tree is trained on its own bootstrap sample. Rows omitted from that sample are called **out-of-bag samples** for that tree.

Each training row is typically OOB for roughly 36.8% of the trees.

For a given training row:
1. Find the trees whose bootstrap samples did not contain that row.
2. Collect predictions from only those trees.
3. Aggregate those predictions.
4. Compare the aggregate prediction with the known label or target.

The resulting score is the **OOB score**; an OOB error can be expressed as one minus an appropriate score for classification accuracy.

### Why OOB is useful

- It provides an internal estimate of generalisation.
- It can reduce the need for a separate validation split during an initial assessment.
- It uses predictions from trees that did not train on the evaluated row.

### Limitations

- OOB is not a replacement for a final untouched test set.
- It may be noisy with small datasets or too few trees.
- The interpretation of `oob_score_` depends on the estimator's scoring behaviour.

In scikit-learn, OOB evaluation requires bootstrap sampling:

```python
from sklearn.ensemble import RandomForestClassifier

model = RandomForestClassifier(
    n_estimators=300,
    bootstrap=True,
    oob_score=True,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
print("OOB score:", model.oob_score_)
```

## 8. Feature Importance

Feature importance estimates how useful each feature was to the fitted forest.

### 8.1 Mean Decrease in Impurity (MDI)

In scikit-learn, `feature_importances_` is based on the total reduction in splitting impurity contributed by a feature, averaged across trees and normalised.

A feature used in splits that reduce impurity substantially can receive a higher score.

**Caution:** impurity-based importance can favour high-cardinality features and can be misleading when features are correlated.

### 8.2 Permutation Importance

Permutation importance measures how much a chosen evaluation score decreases when one feature's values are randomly shuffled.

Process:
1. Calculate a baseline score on validation data.
2. Shuffle one feature column.
3. Recalculate the score.
4. Measure the score decrease.
5. Repeat to estimate variability.

A large decrease suggests the model relies on that feature for the selected metric and dataset.

Permutation importance is model-agnostic, but correlated features can share importance and make individual scores appear small.

```python
from sklearn.inspection import permutation_importance

result = permutation_importance(
    model,
    X_valid,
    y_valid,
    n_repeats=10,
    random_state=42,
    scoring="accuracy"
)

for name, importance in zip(X_valid.columns, result.importances_mean):
    print(name, importance)
```

## 9. Random Forest with scikit-learn

### Classification example

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

model = RandomForestClassifier(
    n_estimators=300,
    max_features="sqrt",
    max_depth=None,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))
```

### Regression example

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, root_mean_squared_error

model = RandomForestRegressor(
    n_estimators=300,
    max_features=1.0,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, predictions))
print("RMSE:", root_mean_squared_error(y_test, predictions))
```

If the installed scikit-learn version does not provide `root_mean_squared_error`, use `mean_squared_error(y_test, predictions) ** 0.5`.

## 10. Random Forest vs Decision Tree vs Bagging

| Property | Decision Tree | Bagging | Random Forest |
|---|---|---|---|
| Models | One tree | Many base models | Many trees |
| Bootstrap samples | No | Yes | Yes by default |
| Random feature subset per split | No | Not necessarily | Yes |
| Main benefit | Interpretability | Variance reduction | Variance reduction plus tree diversity |
| Interpretability | Relatively high | Lower | Lower |
| Prediction | One model | Aggregation | Voting / averaging |

A Random Forest is a specialised bagging ensemble of decision trees with additional feature randomness.

## 11. Strengths, Limitations, and When to Use

### Strengths
- Captures nonlinear relationships and feature interactions.
- Usually works well with limited preprocessing.
- Supports classification and regression.
- Less sensitive to individual noisy observations than a single tree.
- Provides useful baseline feature-importance estimates.

### Limitations
- Less interpretable than one small decision tree.
- Can use substantial memory and inference time.
- Impurity-based importance can be biased.
- Very large forests may have diminishing returns.
- Often do not extrapolate well beyond the target range in regression.

### When to consider it
- Tabular datasets with nonlinear patterns.
- A strong baseline is needed quickly.
- You want less tuning than many boosting methods require.
- A single decision tree is unstable or overfits.

## 12. Common Mistakes

- Confusing bagging with boosting. Bagging trains models independently; boosting builds models sequentially to correct previous errors.
- Assuming bootstrap sampling means every row appears exactly once. Sampling is with replacement.
- Assuming OOB score is the final test score. Keep an untouched test set.
- Treating feature importance as causal evidence.
- Comparing feature-importance values across unrelated datasets as if they were universal.
- Believing more trees always improve performance substantially.
- Ignoring class imbalance and choosing accuracy without checking precision, recall, or F1.

## 13. Placement and Interview Questions

**Q1. What is an ensemble?**  
A combination of multiple models whose predictions are aggregated to produce a final prediction.

**Q2. What is bagging?**  
Bootstrap aggregating: train models on bootstrap samples and combine their predictions. It is commonly used to reduce variance.

**Q3. What is bootstrap sampling?**  
Random sampling with replacement, often creating a sample with the same number of rows as the original dataset.

**Q4. Why does Random Forest use random feature subsets?**  
To make trees less correlated so aggregation can reduce variance more effectively.

**Q5. What is OOB error?**  
An internal evaluation estimate formed by predicting each training row only with trees for which that row was not included in the bootstrap sample.

**Q6. What is the difference between MDI and permutation importance?**  
MDI aggregates impurity reductions from tree splits. Permutation importance measures evaluation-score deterioration after shuffling a feature.

**Q7. Does Random Forest require feature scaling?**  
Usually not. Tree split decisions depend on feature ordering and thresholds, so scaling is generally unnecessary.

**Q8. Can Random Forest overfit?**  
Yes, although averaging often reduces variance. Noisy data, leakage, unsuitable depth/leaf settings, or evaluation mistakes can still produce poor generalisation.

## 14. Practice

### Paper exercise
A dataset has 100 rows. A particular row is omitted from a bootstrap sample with probability approximately 0.368.

1. Approximately how many of 200 trees will leave this row out?
2. Which trees can contribute to this row's OOB prediction?
3. Why should the row not be evaluated using trees that trained on it?

### Coding exercise
Train a `DecisionTreeClassifier` and a `RandomForestClassifier` on the same train/test split. Compare:
- Accuracy, precision, recall, and F1
- Training time
- Test performance across several random seeds
- Feature importance using MDI and permutation importance

Do not claim one model is universally better; explain what the dataset shows.

## 15. Quick Revision

- **Ensemble:** combines multiple models.
- **Bagging:** bootstrap samples + aggregation.
- **Bootstrap:** sampling with replacement.
- **Random Forest:** bagged decision trees + random feature subsets at each split.
- **Classification:** majority vote.
- **Regression:** average predictions.
- **OOB:** evaluate a row using trees that did not train on it.
- **MDI:** importance from impurity reduction.
- **Permutation:** importance from score drop after shuffling.
- **Main goal:** reduce variance while maintaining useful predictive performance.

## 16. Final Checklist

- [ ] Explain why a single decision tree can have high variance.
- [ ] Explain bootstrap sampling with replacement.
- [ ] Distinguish bagging from Random Forest.
- [ ] Explain why random feature subsets reduce tree correlation.
- [ ] Calculate the approximate OOB fraction.
- [ ] Explain OOB scoring and its limitations.
- [ ] Compare impurity and permutation importance.
- [ ] Train and evaluate a Random Forest in scikit-learn.

## 17. Recommended Resources

- [StatQuest: Random Forests](https://www.youtube.com/watch?v=J4Wdy0Wc_xQ)
- [StatQuest: Bagging and Random Forests](https://www.youtube.com/watch?v=sQ870aTKmko)
- [scikit-learn: Ensemble methods](https://scikit-learn.org/stable/modules/ensemble.html)
- [scikit-learn: RandomForestClassifier](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestClassifier.html)
- [scikit-learn: Permutation feature importance](https://scikit-learn.org/stable/modules/permutation_importance.html)
