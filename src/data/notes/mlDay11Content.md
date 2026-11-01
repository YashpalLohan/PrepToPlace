# Day 11 — Gradient Boosting + XGBoost + LightGBM

## 1. Overview

**Boosting** builds an ensemble sequentially. Each new model focuses on reducing the errors or loss left by the current ensemble.

This lecture covers:
- Boosting intuition and how it differs from bagging
- Gradient boosting as optimisation of a loss function
- Learning rate and number of estimators
- Decision-tree weak learners
- XGBoost and LightGBM
- Practical training, evaluation, and tuning

## 2. Bagging vs Boosting

| Aspect | Bagging | Boosting |
|---|---|---|
| Training | Models can be trained independently | Models are built sequentially |
| Main intuition | Average diverse models | Add models to correct current errors |
| Common effect | Reduces variance | Can reduce bias and variance |
| Parallelism | Base models are easier to parallelise | Sequential dependency limits parallelism |
| Examples | Random Forest | Gradient Boosting, XGBoost, LightGBM |

Boosting is not simply “a stronger Random Forest.” It follows a different training strategy.

## 3. Boosting Intuition

Imagine a model makes predictions and has residual errors. A later learner is trained to improve the current ensemble, paying attention to what it still gets wrong.

For regression with squared-error loss, the residual for row \(i\) is:

\[
r_i=y_i-\hat{y}_i
\]

A simple conceptual sequence:

```text
Initial prediction
       |
Calculate current errors
       |
Train a small tree to predict the errors
       |
Add a scaled version of that tree
       |
Recalculate errors
       |
Repeat for more trees
```

Real gradient boosting generalises this idea by fitting learners to the **negative gradient of the loss**, not always ordinary residuals.

## 4. Gradient Boosting as Optimisation

Let the current ensemble prediction after \(m\) stages be \(F_m(x)\). At each stage, gradient boosting calculates pseudo-residuals from the loss:

\[
r_{im}=-\left[\frac{\partial L(y_i,F(x_i))}{\partial F(x_i)}\right]_{F=F_{m-1}}
\]

A weak learner \(h_m(x)\), often a shallow decision tree, is fitted to approximate these negative gradients.

The model is updated:

\[
F_m(x)=F_{m-1}(x)+\eta\gamma_m h_m(x)
\]

where:
- \(\eta\) is the learning rate.
- \(\gamma_m\) is a stage-specific step size.
- \(h_m(x)\) is the new learner.

The exact fitting and step-size procedure depends on the loss and implementation.

## 5. Learning Rate and Number of Estimators

### Learning rate (`learning_rate`)

Controls how strongly each new learner changes the ensemble.

- Smaller learning rate: each tree contributes less; often needs more trees.
- Larger learning rate: learns faster but may overfit or miss a good generalisation point.

### Number of estimators (`n_estimators`)

The number of boosting stages or trees.

- Too few: underfitting.
- Too many: can overfit, depending on learning rate, tree complexity, and regularisation.
- More trees increase training and prediction cost.

These parameters interact. A smaller learning rate often works well with more estimators, but validate rather than relying on a fixed rule.

## 6. Tree Complexity and Regularisation

Boosted trees are often deliberately shallow.

Important controls include:
- Maximum depth or number of leaves
- Minimum samples or child weight required in a leaf
- Minimum loss reduction required for a split
- Row subsampling
- Column/feature subsampling
- L1 and L2 regularisation in implementations that support them

Shallow trees capture limited interactions at each stage. The sequence of many learners builds a more complex function.

## 7. XGBoost

**XGBoost** is an optimised gradient-boosted tree library. It adds regularisation and engineering improvements to gradient boosting.

Key ideas:
- Uses first- and second-order gradient information for optimisation.
- Supports L1 and L2 regularisation.
- Supports row and column subsampling.
- Includes efficient tree construction and missing-value handling.
- Provides classification, regression, and ranking objectives.

### Important parameters

| Parameter | Meaning |
|---|---|
| `n_estimators` | Number of boosting rounds |
| `learning_rate` / `eta` | Shrinkage applied to each round |
| `max_depth` | Maximum tree depth |
| `min_child_weight` | Minimum child Hessian weight needed for a split |
| `subsample` | Fraction of training rows sampled per boosting round |
| `colsample_bytree` | Fraction of features sampled per tree |
| `gamma` | Minimum loss reduction required for a split |
| `reg_alpha` | L1 regularisation |
| `reg_lambda` | L2 regularisation |

### XGBoost classification example

```python
from xgboost import XGBClassifier
from sklearn.metrics import classification_report

model = XGBClassifier(
    n_estimators=400,
    learning_rate=0.05,
    max_depth=4,
    subsample=0.8,
    colsample_bytree=0.8,
    reg_lambda=1.0,
    eval_metric="logloss",
    random_state=42
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))
```

For multiclass tasks, check the installed XGBoost version and set the objective and label encoding appropriately. Keep preprocessing and evaluation leakage-free.

## 8. LightGBM

**LightGBM** is a gradient-boosting framework designed for efficiency and scalability, particularly on larger and higher-dimensional datasets.

Important ideas:
- Histogram-based split finding groups continuous feature values into bins.
- Leaf-wise growth chooses the leaf with the greatest loss reduction.
- It can grow trees efficiently, but leaf-wise growth may overfit on small datasets unless constrained.

### Key parameters

| Parameter | Meaning |
|---|---|
| `n_estimators` | Number of boosting iterations |
| `learning_rate` | Contribution of each iteration |
| `num_leaves` | Maximum number of leaves |
| `max_depth` | Depth limit; useful to constrain complexity |
| `min_child_samples` | Minimum data points in a leaf |
| `feature_fraction` | Fraction of features used per iteration/tree |
| `bagging_fraction` | Fraction of rows sampled |
| `lambda_l1`, `lambda_l2` | Regularisation strengths |

### LightGBM classification example

```python
from lightgbm import LGBMClassifier
from sklearn.metrics import classification_report

model = LGBMClassifier(
    n_estimators=400,
    learning_rate=0.05,
    num_leaves=15,
    max_depth=-1,
    min_child_samples=20,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    verbosity=-1
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
print(classification_report(y_test, predictions))
```

Parameter names and accepted values can vary across versions. Consult the installed version's documentation.

## 9. XGBoost vs LightGBM vs Classical Gradient Boosting

| Dimension | Classical Gradient Boosting | XGBoost | LightGBM |
|---|---|---|---|
| Core method | Gradient-boosted trees | Regularised, optimised gradient boosting | Efficient gradient-boosted trees |
| Tree growth | Commonly depth-wise | Commonly depth-wise | Leaf-wise by default |
| Split strategy | Implementation-dependent | Efficient split algorithms | Histogram-based |
| Regularisation | Available controls vary | Explicit L1/L2 and split controls | Regularisation and leaf constraints |
| Practical strength | Conceptually clear baseline | Strong general-purpose tabular model | Efficiency on many large datasets |
| Caution | Can be slower | Requires tuning | Leaf-wise growth can overfit small data |

No library is always best. Compare them on the same data split, metric, and tuning budget.

## 10. Early Stopping

Early stopping monitors a validation metric and stops training when it no longer improves for a chosen number of rounds.

Benefits:
- Limits unnecessary boosting rounds.
- Helps control overfitting.
- Can save training time.

Use a validation set that is separate from the final test set. API syntax differs between XGBoost, LightGBM, and scikit-learn versions; follow the version-specific documentation.

## 11. Evaluation and Tuning Workflow

1. Split data into train, validation, and test sets (or use cross-validation).
2. Establish a simple baseline.
3. Choose a metric aligned with the task and class balance.
4. Tune learning rate and estimator count together.
5. Constrain tree depth/leaves and minimum leaf data.
6. Add row/feature subsampling and regularisation.
7. Use early stopping where supported.
8. Evaluate once on the untouched test set.
9. Inspect errors, calibration needs, and feature importance.

For imbalanced classification, do not rely on accuracy alone. Consider precision, recall, F1, PR-AUC, or ROC-AUC as appropriate.

## 12. Common Mistakes

- Confusing boosting with bagging.
- Assuming every boosting algorithm uses the same residual calculation.
- Increasing `n_estimators` without considering learning rate and overfitting.
- Using very deep trees with too many boosting rounds.
- Tuning repeatedly against the test set.
- Ignoring class imbalance.
- Assuming LightGBM is always faster or XGBoost is always more accurate.
- Treating feature importance as proof of causality.
- Failing to pin library versions or check API changes.

## 13. Placement and Interview Questions

**Q1. What is boosting?**  
A sequential ensemble approach in which each new learner improves the current ensemble by focusing on the remaining loss.

**Q2. How is boosting different from bagging?**  
Bagging trains models independently on bootstrap samples and aggregates them. Boosting builds learners sequentially.

**Q3. What does the learning rate do?**  
It shrinks each learner's contribution to the ensemble.

**Q4. What happens if the learning rate is very small?**  
Training usually needs more boosting rounds; performance may improve or worsen depending on validation results and regularisation.

**Q5. What is a weak learner?**  
A relatively simple model that performs better than a trivial baseline and contributes to the ensemble.

**Q6. Why are shallow trees common in boosting?**  
They limit the contribution of each stage and help control complexity.

**Q7. What does XGBoost add?**  
An efficient, regularised gradient-boosting implementation using first- and second-order gradient information, among other engineering features.

**Q8. What is LightGBM's leaf-wise growth?**  
It expands the leaf with the greatest loss reduction rather than growing all leaves level by level.

**Q9. What is early stopping?**  
Stopping when a validation metric fails to improve for a specified patience period.

## 14. Practice

### Paper exercise
A boosting model starts with prediction 10 for a row whose true target is 18.

1. Calculate the squared-error residual.
2. If a new learner predicts a correction of 4 and the learning rate is 0.1, what correction is added under a simple residual-update illustration?
3. Why is this illustration not the full general gradient-boosting algorithm?

### Coding exercise
On one tabular dataset, compare:
- `GradientBoostingClassifier` or `HistGradientBoostingClassifier`
- `XGBClassifier`
- `LGBMClassifier`

Use identical train/validation/test partitions and a suitable metric. Record training time, validation score, test score, and model complexity. Do not tune on the test set.

## 15. Quick Revision

- **Boosting:** sequentially adds learners to reduce loss.
- **Pseudo-residual:** negative gradient of the loss.
- **Learning rate:** shrinks each learner's contribution.
- **Estimators:** number of boosting rounds.
- **XGBoost:** regularised and optimised gradient-boosting library.
- **LightGBM:** efficient histogram-based framework with leaf-wise tree growth by default.
- **Early stopping:** uses validation performance to decide when to stop.
- **Key risk:** overfitting through excessive rounds or complex trees.

## 16. Final Checklist

- [ ] Explain bagging vs boosting.
- [ ] Explain residual-based boosting intuition.
- [ ] Describe negative gradients in gradient boosting.
- [ ] Explain learning rate and number of estimators.
- [ ] Identify key XGBoost parameters.
- [ ] Explain LightGBM histogram and leaf-wise growth.
- [ ] Explain early stopping and leakage-safe evaluation.
- [ ] Train and compare at least two boosting implementations.

## 17. Recommended Resources

- [StatQuest: Gradient Boosting](https://www.youtube.com/watch?v=3CC4N4z3GJc)
- [XGBoost official tutorial](https://xgboost.readthedocs.io/en/stable/tutorials/index.html)
- [Krish Naik: XGBoost](https://www.youtube.com/results?search_query=Krish+Naik+XGBoost)
- [LightGBM documentation](https://lightgbm.readthedocs.io/en/stable/)
- [scikit-learn: Gradient Boosting](https://scikit-learn.org/stable/modules/ensemble.html#gradient-boosting)
