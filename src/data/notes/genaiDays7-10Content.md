# Days 7–10 — Classical ML Foundation

## 1. Overview

Classical machine learning provides simple, interpretable baselines and teaches the mathematics behind prediction.

This block covers:
- Linear regression.
- Logistic regression.
- Sigmoid function and probability interpretation.
- Model formulation and training objective.
- Assumptions and limitations.
- Basic scikit-learn implementation.

## 2. Linear Regression: Problem Setup

Linear regression predicts a continuous target from input features.

For one feature:

\[
\hat y=wx+b
\]

For multiple features:

\[
\hat y=w^Tx+b
\]

where:
- \(x\): input feature vector.
- \(w\): learned coefficients.
- \(b\): intercept.
- \(\hat y\): predicted value.

Example: predict house price from area, number of rooms, age, and location-derived features.

## 3. Least Squares Objective

A common training objective is Mean Squared Error:

\[
MSE=\frac{1}{N}\sum_{i=1}^{N}(y_i-\hat y_i)^2
\]

The model chooses coefficients that minimise the sum/average of squared residuals.

Residual:

\[
e_i=y_i-\hat y_i
\]

Large errors receive a quadratic penalty.

## 4. Interpreting Linear Regression Coefficients

A coefficient \(w_j\) represents the expected change in prediction for a one-unit increase in feature \(x_j\), holding other model features fixed.

Interpretation depends on:
- Feature units.
- Scaling.
- Correlation between inputs.
- Model specification.
- Whether the linear relationship is appropriate.

A coefficient is not automatically a causal effect.

## 5. Linear Regression Assumptions

For classical inference and ordinary least squares interpretation, common assumptions include:

1. Linearity in parameters / correctly specified conditional mean.
2. Independent observations/errors under the chosen sampling design.
3. Zero conditional mean of errors given predictors (exogeneity).
4. Constant error variance (homoscedasticity) for classical standard-error formulas.
5. No perfect multicollinearity.
6. Error normality may be used for exact small-sample inference, but is not required for computing OLS estimates or for prediction itself under all settings.

Assumptions should be checked in context. Predictive performance may remain useful even when some textbook assumptions are imperfect, but inference and uncertainty estimates can be affected.

## 6. Linear Regression Limitations

- Linear form may underfit nonlinear patterns.
- Outliers can strongly influence squared-error fitting.
- Correlated features can make coefficients unstable.
- Extrapolation beyond training data can be unreliable.
- Omitted variables or data leakage can distort results.
- Prediction accuracy depends on data quality and coverage.

Possible extensions include polynomial features, interactions, regularisation, tree-based models, or nonlinear models.

## 7. Logistic Regression: Classification

Despite its name, Logistic Regression is a classification algorithm.

For binary classification, first calculate a linear score:

\[
z=w^Tx+b
\]

Then apply the sigmoid function:

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

The output is interpreted as the estimated probability of the positive class:

\[
P(y=1\mid x)=\sigma(w^Tx+b)
\]

A threshold (often 0.5 by default) converts probability into a class label, but the threshold can be tuned based on error costs.

## 8. Sigmoid Function

Properties:
- Maps real-valued inputs to (0, 1).
- Monotonically increasing.
- \(\sigma(0)=0.5\).
- Large positive inputs approach 1.
- Large negative inputs approach 0.

The derivative is:

\[
\sigma'(z)=\sigma(z)(1-\sigma(z))
\]

In numerical implementations, use stable library functions rather than manually computing exponentials for extreme values.

## 9. Log-Odds Interpretation

For logistic regression:

\[
\log\frac{p}{1-p}=w^Tx+b
\]

The model is linear in the log-odds, not necessarily in probability.

For a one-unit increase in feature \(x_j\), holding other features fixed, the log-odds change by \(w_j\). The corresponding odds are multiplied by \(e^{w_j}\).

## 10. Logistic Regression Loss

Binary cross-entropy / negative log-likelihood:

\[
L=-\frac{1}{N}\sum_{i=1}^{N}
[y_i\log p_i+(1-y_i)\log(1-p_i)]
\]

This penalises assigning low probability to the true class.

Logistic regression learns parameters by minimising this objective, often with regularisation.

## 11. Linear vs Logistic Regression

| Aspect | Linear Regression | Logistic Regression |
|---|---|---|
| Task | Regression | Classification |
| Output | Continuous value | Class probability / class |
| Core score | \(w^Tx+b\) | \(\sigma(w^Tx+b)\) for binary |
| Common loss | MSE | Log loss / cross-entropy |
| Output range | Unbounded | (0, 1) probability |
| Example | Predict price | Predict churn probability |

## 12. Logistic Regression Assumptions and Limitations

Common modelling considerations:
- Observations should be independent under the evaluation design.
- The log-odds should be appropriately represented as a linear function of predictors unless nonlinear features/interactions are added.
- Multicollinearity can make coefficient interpretation unstable.
- Sufficient examples are needed for reliable estimates.
- Class imbalance may require metric and threshold care.
- It produces a linear decision boundary in the feature space unless features are transformed.

Logistic regression does not require predictors to be normally distributed. It is also not necessary for predictors to be uncorrelated, although strong multicollinearity can make estimates unstable.

## 13. scikit-learn Example: Linear Regression

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

model = LinearRegression()
model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("MAE:", mean_absolute_error(y_test, predictions))
print("MSE:", mean_squared_error(y_test, predictions))
print("R2:", r2_score(y_test, predictions))
```

Use a preprocessing pipeline when input data contains missing values, categorical variables, or features requiring scaling.

## 14. scikit-learn Example: Logistic Regression

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=2000)
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)

print(confusion_matrix(y_test, predictions))
print(classification_report(y_test, predictions))
```

The example assumes numeric features. For mixed numeric/categorical data, use a ColumnTransformer.

## 15. Common Mistakes

- Calling Logistic Regression a regression model for continuous targets.
- Assuming sigmoid alone makes a model nonlinear in its features.
- Treating a 0.5 probability threshold as always optimal.
- Interpreting coefficients as causal effects.
- Assuming linear regression residuals must be normally distributed for all predictive uses.
- Ignoring multicollinearity.
- Using MSE as the standard logistic classification objective.
- Evaluating with accuracy alone on an imbalanced dataset.

## 16. Placement and Interview Questions

**Q1. What does linear regression predict?**  
A continuous value using a linear combination of input features.

**Q2. What is the ordinary least squares objective?**  
Minimise the sum of squared residuals between observed and predicted targets.

**Q3. Why is logistic regression used for classification?**  
It maps a linear score through sigmoid to estimate a binary class probability.

**Q4. What does sigmoid do?**  
Maps a real-valued score into the interval (0, 1).

**Q5. What is the difference between probability and log-odds?**  
Probability lies between 0 and 1; log-odds is the log ratio \(p/(1-p)\), which logistic regression models linearly.

**Q6. Does logistic regression require normally distributed features?**  
No.

**Q7. What does a logistic coefficient mean?**  
A one-unit feature increase changes log-odds by that coefficient, holding other features fixed.

**Q8. Why might linear regression be unsuitable for a classification target?**  
Its predictions are unbounded and do not naturally represent class probabilities.

## 17. Practice

### Paper exercises
1. For \(\hat y=2x+3\), calculate predictions for x = 0, 2, and 5.
2. Calculate the sigmoid of z = 0 and interpret it.
3. If a logistic coefficient is 0.7, calculate the corresponding odds multiplier \(e^{0.7}\).
4. Explain why logistic regression is linear in log-odds rather than probability.
5. Identify two ways a linear regression model can underfit.

### Coding exercise
Use one regression dataset and one binary classification dataset:
- Create train/test splits.
- Fit LinearRegression and LogisticRegression respectively.
- Evaluate with appropriate metrics.
- Inspect residuals for regression.
- Inspect confusion matrix and precision/recall for classification.
- Compare to a simple baseline.

## 18. Quick Revision

- Linear regression: \(\hat y=w^Tx+b\).
- OLS: minimise squared residuals.
- Residual: actual − predicted.
- Logistic regression: classification.
- Sigmoid: \(1/(1+e^{-z})\).
- Logistic probability: \(P(y=1|x)=\sigma(w^Tx+b)\).
- Log-odds: \(\log(p/(1-p))=w^Tx+b\).
- Linear loss: often MSE.
- Logistic loss: binary cross-entropy.
- Coefficients: association in model, not causality.

## 19. Final Checklist

- [ ] Write linear regression formulation.
- [ ] Explain least squares and residuals.
- [ ] State key linear regression assumptions.
- [ ] Write logistic regression and sigmoid equations.
- [ ] Interpret log-odds and coefficients.
- [ ] Compare linear and logistic regression.
- [ ] Identify each model's limitations.
- [ ] Train and evaluate both with scikit-learn.

## 20. Recommended Resources

- [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Microsoft AI for Beginners](https://microsoft.github.io/AI-For-Beginners/)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Linear Models](https://scikit-learn.org/stable/modules/linear_model.html)
