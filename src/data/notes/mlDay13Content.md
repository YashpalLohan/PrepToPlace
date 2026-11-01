# Day 13 — Bias-Variance, Regularisation, Hyperparameter Tuning

## 1. Overview

A model should learn patterns that generalise to unseen data, not merely memorise its training examples. This lecture connects three ideas:

- **Bias and variance:** why models underfit or overfit.
- **Regularisation:** how to control model complexity, including L1 and L2 penalties.
- **Hyperparameter tuning:** how to search for settings using GridSearchCV, RandomizedSearchCV, and Optuna.

The goal is to build a repeatable, leakage-safe model-selection process.

## 2. Underfitting and Overfitting

### Underfitting

A model underfits when it is too simple to capture important patterns.

Typical symptoms:
- Training error is high.
- Validation/test error is also high.
- Increasing model capacity or improving useful features may help.

Example: fitting a straight line to data with a strong nonlinear relationship.

### Overfitting

A model overfits when it learns training-specific noise or accidental patterns instead of general relationships.

Typical symptoms:
- Training performance is very good.
- Validation/test performance is much worse.
- The model may be too complex, insufficiently regularised, or trained with leakage.

Example: a very deep decision tree memorising individual training rows.

### Diagnostic pattern

| Situation | Training error | Validation error | Likely diagnosis |
|---|---:|---:|---|
| Both high | High | High | Underfitting / high bias |
| Train low, validation much higher | Low | High | Overfitting / high variance |
| Both low and close | Low | Low | Good fit, subject to a valid test |
| Both unexpectedly excellent | Very low | Very low | Check for leakage or an easy/duplicate split |

The train–validation gap is a diagnostic signal, not a complete mathematical definition of bias or variance.

## 3. Bias and Variance

**Bias** describes systematic error from assumptions that are too restrictive. A high-bias model may consistently miss the true pattern.

**Variance** describes how sensitive the fitted model is to the particular training sample. A high-variance model changes substantially when its training data changes.

Under the usual squared-error decomposition for a fixed input and a suitable repeated-sampling setup:

\[
\mathbb{E}\left[(Y-\hat f(X))^2\right]
=
\operatorname{Bias}(\hat f(X))^2
+
\operatorname{Var}(\hat f(X))
+
\sigma^2
\]

Here, \(\sigma^2\) represents irreducible noise under the assumptions of the decomposition.

### Trade-off intuition

- Increasing complexity can reduce bias but may increase variance.
- Restricting complexity can reduce variance but may increase bias.
- More data, better features, and appropriate regularisation can change the trade-off.

There is no universal rule that the simplest or most complex model is best. Validate on data that was not used to fit the model.

## 4. Model Complexity and Learning Curves

A **learning curve** plots training and validation performance as the training-set size changes.

Typical interpretations:
- Both curves perform poorly and remain close: model may have high bias.
- Training is strong but validation is weaker: variance or data mismatch may be present.
- Validation improves as more data is added: additional representative data may help.
- Curves plateau: more data alone may not fix a feature or model limitation.

A validation curve instead varies a hyperparameter, such as tree depth or regularisation strength, while measuring training and validation performance.

## 5. Regularisation

Regularisation adds a penalty to the objective so that the model is discouraged from using overly large or complex parameter values.

For a linear model with coefficients \(w\), a general form is:

\[
\text{Objective}=\text{Training Loss}+\lambda\cdot\text{Penalty}(w)
\]

- Training loss rewards fitting the training data.
- The penalty discourages complexity.
- \(\lambda\) controls the strength of regularisation.

A larger penalty usually creates a simpler fit, but too much regularisation can cause underfitting.

## 6. L2 Regularisation — Ridge

Ridge regression adds the squared magnitude of coefficients to the least-squares objective:

\[
J(w)=\sum_{i=1}^{n}(y_i-\hat y_i)^2+\lambda\sum_{j=1}^{p}w_j^2
\]

Effects:
- Shrinks coefficients toward zero.
- Usually does not make coefficients exactly zero.
- Can stabilise estimates when predictors are correlated.
- Distributes weight across correlated features more readily than Lasso.

Use Ridge when many features may contribute and you want to shrink their effect without automatically removing most of them.

## 7. L1 Regularisation — Lasso

Lasso adds the absolute values of coefficients:

\[
J(w)=\sum_{i=1}^{n}(y_i-\hat y_i)^2+\lambda\sum_{j=1}^{p}|w_j|
\]

Effects:
- Shrinks coefficients.
- Can set some coefficients exactly to zero.
- Can perform a form of embedded feature selection.
- May select one feature among a group of strongly correlated features somewhat unstably.

Use Lasso when a sparse model is useful, but do not interpret its selected features as causal discoveries.

## 8. Ridge vs Lasso vs Elastic Net

| Method | Penalty | Typical coefficient behaviour |
|---|---|---|
| Ridge (L2) | Sum of squared coefficients | Shrinks; generally retains features |
| Lasso (L1) | Sum of absolute coefficients | Can set coefficients to zero |
| Elastic Net | Combination of L1 and L2 | Combines sparsity with grouped shrinkage behaviour |

Elastic Net objective:

\[
J(w)=\text{Loss}+\lambda\left[\alpha\|w\|_1+\frac{1-\alpha}{2}\|w\|_2^2\right]
\]

The exact scaling conventions differ between libraries and estimators. In scikit-learn, use the estimator's documented `alpha` and `l1_ratio` parameters rather than assuming every library uses the same symbol or scaling.

### Why scale features?

Regularisation penalises coefficient magnitudes. If features use wildly different units, the penalty can affect them unevenly. Standardise numeric features inside a pipeline when using scale-sensitive linear models.

## 9. Hyperparameters vs Model Parameters

| Model parameters | Hyperparameters |
|---|---|
| Learned from training data | Chosen before or around training |
| Examples: linear coefficients, tree split thresholds | Examples: regularisation strength, tree depth, learning rate |
| Optimised by the estimator's fitting procedure | Selected using validation or cross-validation |

A hyperparameter search evaluates candidate configurations. It does not replace sound data splitting, feature design, or model evaluation.

## 10. Cross-Validation for Model Selection

In \(k\)-fold cross-validation:
1. Divide the training data into \(k\) folds.
2. Train on \(k-1\) folds.
3. Evaluate on the held-out fold.
4. Repeat until every fold has served as validation once.
5. Aggregate the scores.

For classification, stratified folds help preserve class proportions when appropriate.

Cross-validation is used for model and hyperparameter selection. Keep a final test set untouched until the selection process is complete.

## 11. GridSearchCV vs RandomizedSearchCV vs Optuna

| Method | How it searches | Strength | Limitation |
|---|---|---|---|
| GridSearchCV | Tries every combination in a specified grid | Exhaustive and easy to reproduce | Cost grows rapidly with combinations |
| RandomizedSearchCV | Samples a fixed number of configurations from lists/distributions | Fixed compute budget; explores continuous ranges efficiently | Does not guarantee trying the best region |
| Optuna | Runs an objective function and uses a sampler to propose trials | Flexible search spaces, pruning, and study analysis | Adds a dependency and requires a well-designed objective |

### GridSearchCV

Use when:
- The search space is small.
- Parameters have a few meaningful candidate values.
- Exhaustively comparing those combinations is affordable.

```python
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipeline = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=2000)
)

param_grid = {
    "logisticregression__C": [0.01, 0.1, 1, 10, 100]
}

search = GridSearchCV(
    estimator=pipeline,
    param_grid=param_grid,
    scoring="roc_auc",
    cv=5,
    n_jobs=-1,
    refit=True
)

search.fit(X_train, y_train)
print(search.best_params_)
print(search.best_score_)
best_model = search.best_estimator_
```

### RandomizedSearchCV

Use when:
- There are many parameters or continuous ranges.
- You have a fixed evaluation budget.
- You want broad coverage without evaluating every combination.

```python
from scipy.stats import loguniform
from sklearn.model_selection import RandomizedSearchCV

param_distributions = {
    "logisticregression__C": loguniform(1e-4, 1e2)
}

random_search = RandomizedSearchCV(
    estimator=pipeline,
    param_distributions=param_distributions,
    n_iter=30,
    scoring="roc_auc",
    cv=5,
    n_jobs=-1,
    random_state=42,
    refit=True
)

random_search.fit(X_train, y_train)
print(random_search.best_params_)
```

### Optuna

Optuna asks you to define an objective function. Each trial proposes hyperparameters, runs validation, and returns a score to minimise or maximise.

```python
import optuna
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

def objective(trial):
    c_value = trial.suggest_float("C", 1e-4, 1e2, log=True)

    model = make_pipeline(
        StandardScaler(),
        LogisticRegression(C=c_value, max_iter=2000)
    )

    scores = cross_val_score(
        model, X_train, y_train,
        cv=cv, scoring="roc_auc", n_jobs=-1
    )
    return scores.mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=40)

print(study.best_params)
print(study.best_value)
```

The example uses a single continuous parameter to keep the objective easy to understand. Real projects can search categorical, integer, and conditional parameters too.

## 12. A Leakage-Safe Tuning Workflow

1. Separate a final test set before model selection.
2. Put imputing, scaling, encoding, feature selection, and the estimator inside a Pipeline/ColumnTransformer.
3. Run cross-validation only on the training portion.
4. Choose the scoring metric before searching.
5. Inspect `best_params_` and cross-validation results, not only one score.
6. Refit the chosen workflow on all permitted training data.
7. Evaluate once on the untouched test set.
8. Record the split, random seed, metric, search space, and library versions.

**Data leakage** happens when information unavailable at prediction time influences training or model selection. Examples include fitting a scaler on the full dataset before splitting, using future information, and target encoding a row using its own target.

## 13. Nested Cross-Validation

Nested cross-validation uses:
- An inner loop to tune hyperparameters.
- An outer loop to estimate performance of the complete tuning process.

It is useful when data is limited and you need a less biased estimate of the model-selection procedure. It is computationally more expensive than a single cross-validation search.

## 14. Common Mistakes

- Choosing hyperparameters based on the final test set.
- Assuming the highest training score means the best model.
- Forgetting to scale features before Ridge/Lasso-style regularisation.
- Fitting preprocessing on all rows before cross-validation.
- Searching too many combinations without a compute budget.
- Using accuracy for a severely imbalanced problem without checking other metrics.
- Reporting only the best score and ignoring fold variation.
- Assuming Lasso identifies causal or universally important features.
- Treating one train–validation gap as a precise measurement of bias and variance.

## 15. Placement and Interview Questions

**Q1. What is underfitting?**  
The model is too restricted to capture important patterns, so training and validation performance are both poor.

**Q2. What is overfitting?**  
The model fits training-specific patterns or noise and generalises poorly to unseen data.

**Q3. Explain bias vs variance.**  
Bias is systematic error from restrictive assumptions; variance is sensitivity to the particular training sample.

**Q4. Ridge vs Lasso?**  
Ridge uses an L2 penalty and shrinks coefficients. Lasso uses an L1 penalty and can set coefficients to zero.

**Q5. Why scale before regularised linear models?**  
Coefficient penalties are affected by feature units; scaling makes penalty strength more comparable across features.

**Q6. GridSearchCV vs RandomizedSearchCV?**  
Grid search evaluates every specified combination. Randomized search samples a fixed number of configurations from specified distributions or lists.

**Q7. Why use Optuna?**  
It provides an objective-driven optimisation workflow with flexible search spaces, trial tracking, and optional pruning.

**Q8. Why keep a final test set?**  
Repeated tuning against validation data can overfit the selection process; a test set gives a final estimate after choices are frozen.

## 16. Practice

### Paper exercise
A model has 98% training accuracy and 72% validation accuracy. Another has 84% training accuracy and 82% validation accuracy.

1. Which model shows a larger generalisation gap?
2. Which model is more likely to generalise better based on these scores?
3. Name two changes you could test for the first model.
4. Why should you not choose using training accuracy alone?

### Coding exercise
Compare Logistic Regression with no penalty (where supported), Ridge-style L2, and L1 regularisation. Use a pipeline with scaling and stratified cross-validation. Record:
- Mean and standard deviation of CV score
- Best regularisation strength
- Number of non-zero coefficients for L1/L2
- Final untouched test score

Then compare GridSearchCV and RandomizedSearchCV using a similar compute budget.

## 17. Quick Revision

- **Underfitting:** high training and validation error.
- **Overfitting:** low training error, much worse validation error.
- **Bias:** systematic error from restrictive assumptions.
- **Variance:** sensitivity to the training sample.
- **Regularisation:** training loss plus complexity penalty.
- **Ridge:** L2, shrinkage.
- **Lasso:** L1, sparsity/zero coefficients.
- **GridSearchCV:** exhaustive specified grid.
- **RandomizedSearchCV:** fixed number of sampled configurations.
- **Optuna:** objective-driven trial optimisation.
- **Safe tuning:** preprocessing inside CV pipeline; final test set untouched.

## 18. Final Checklist

- [ ] Diagnose underfitting and overfitting from train/validation scores.
- [ ] Explain bias and variance.
- [ ] Write Ridge and Lasso objective functions.
- [ ] Explain why scaling matters for regularisation.
- [ ] Distinguish model parameters and hyperparameters.
- [ ] Compare GridSearchCV, RandomizedSearchCV, and Optuna.
- [ ] Build a leakage-safe search with a Pipeline.
- [ ] Explain why the final test set must remain untouched.

## 19. Recommended Resources

- [StatQuest: Bias and Variance](https://www.youtube.com/watch?v=EuBBz3bI-aA)
- [StatQuest: Ridge Regression](https://www.youtube.com/watch?v=Q81RR3yKn30)
- [StatQuest: Lasso Regression](https://www.youtube.com/watch?v=NGf0voTMlcs)
- [Optuna Quickstart](https://optuna.readthedocs.io/en/stable/tutorial/10_key_features/001_first.html)
- [scikit-learn: GridSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html)
- [scikit-learn: RandomizedSearchCV](https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html)
