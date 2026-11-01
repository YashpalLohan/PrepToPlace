# Days 11–13 — Model Evaluation

## 1. Overview

Model evaluation measures how well a trained model performs on data that was not used to fit it.

This block covers:
- Confusion matrix.
- Accuracy, precision, recall, specificity, and F1.
- MAE, MSE, and RMSE.
- R-squared and adjusted R-squared.
- Metric selection and evaluation pitfalls.

## 2. Why Evaluation Matters

A model can perform well on training data but poorly on unseen examples.

Use:
- Training data to fit parameters.
- Validation data to tune models and thresholds.
- Test data for final evaluation after decisions are frozen.

A metric must reflect the task and the cost of errors. There is no universally best metric.

## 3. Confusion Matrix

For binary classification:

| | Predicted positive | Predicted negative |
|---|---:|---:|
| Actual positive | True Positive (TP) | False Negative (FN) |
| Actual negative | False Positive (FP) | True Negative (TN) |

Interpretation:
- TP: correctly predicted positive.
- TN: correctly predicted negative.
- FP: false alarm.
- FN: missed positive.

## 4. Accuracy

\[
Accuracy=\frac{TP+TN}{TP+TN+FP+FN}
\]

Accuracy is the fraction of all predictions that are correct.

### Limitation under class imbalance

If 99% of samples are negative, a model predicting negative for every example achieves 99% accuracy but has zero recall for the positive class.

Always inspect class distribution and confusion matrix.

## 5. Precision

\[
Precision=\frac{TP}{TP+FP}
\]

Precision answers: among examples predicted positive, how many are actually positive?

High precision is useful when false positives are expensive.

Example: a costly manual investigation process may prefer fewer false alarms.

## 6. Recall / Sensitivity

\[
Recall=\frac{TP}{TP+FN}
\]

Recall answers: among all actual positive examples, how many did the model find?

High recall is useful when missing positive cases is expensive.

Example: screening for a potentially serious condition may prioritise recall, followed by confirmatory testing.

## 7. Specificity

\[
Specificity=\frac{TN}{TN+FP}
\]

Specificity measures the fraction of actual negatives correctly identified.

It is the true negative rate.

## 8. F1 Score

F1 is the harmonic mean of precision and recall:

\[
F1=2\cdot\frac{Precision\cdot Recall}{Precision+Recall}
\]

F1 is useful when both precision and recall matter, but it ignores true negatives and does not encode all business costs.

For multiclass tasks, choose macro, micro, or weighted averaging based on what matters.

## 9. Worked Classification Example

Suppose:
- TP = 80
- FP = 20
- FN = 10
- TN = 890

Then:

\[
Precision=\frac{80}{80+20}=0.80
\]

\[
Recall=\frac{80}{80+10}\approx0.889
\]

\[
F1\approx0.842
\]

\[
Accuracy=\frac{80+890}{1000}=0.97
\]

Accuracy is 97%, but precision and recall provide more detail about positive-class errors.

## 10. Threshold and Precision–Recall Trade-off

A classifier may output a probability. The threshold converts probability into a class label.

- Lower threshold often increases recall and can reduce precision.
- Higher threshold often increases precision and can reduce recall.

Choose thresholds on validation data based on costs, capacity, and intended metric. Do not tune thresholds on the final test set.

## 11. Regression Evaluation

Regression predicts continuous values. Common metrics measure the difference between actual \(y_i\) and predicted \(\hat y_i\).

### Mean Absolute Error (MAE)

\[
MAE=\frac{1}{N}\sum_{i=1}^{N}|y_i-\hat y_i|
\]

- Easy to interpret in target units.
- Less sensitive to large errors than MSE.
- Treats absolute deviations linearly.

### Mean Squared Error (MSE)

\[
MSE=\frac{1}{N}\sum_{i=1}^{N}(y_i-\hat y_i)^2
\]

- Penalises large errors more strongly.
- Units are squared target units.
- Sensitive to outliers.

### Root Mean Squared Error (RMSE)

\[
RMSE=\sqrt{MSE}
\]

- Returns to target units.
- Still penalises large errors more strongly than MAE.

## 12. R-Squared

R-squared measures improvement over predicting the target mean, for the usual regression evaluation setup:

\[
R^2=1-\frac{\sum_i(y_i-\hat y_i)^2}{\sum_i(y_i-\bar y)^2}
\]

Interpretation:
- 1: perfect predictions.
- 0: same squared-error performance as predicting the evaluation-set mean.
- Negative: worse squared-error performance than that mean baseline.

R-squared is not generally the percentage of causal variation explained by the model. It can be negative on held-out data.

## 13. Adjusted R-Squared

Adjusted R-squared penalises adding predictors that do not sufficiently improve fit.

\[
R^2_{adj}
=
1-(1-R^2)\frac{n-1}{n-p-1}
\]

where:
- \(n\): number of observations.
- \(p\): number of predictors (not counting intercept in the usual formula).

The formula assumes a standard regression setting with \(n>p+1\). Its use and interpretation depend on the model and data conditions.

Adjusted R-squared is often used for comparing linear regression models with different predictor counts, but it is not a substitute for held-out validation.

## 14. Comparing Regression Metrics

| Metric | Error emphasis | Units | Useful when |
|---|---|---|---|
| MAE | Linear penalty | Target units | Typical absolute error matters |
| MSE | Quadratic penalty | Squared units | Large errors need stronger penalty |
| RMSE | Quadratic penalty, square-rooted | Target units | Want MSE sensitivity in interpretable units |
| R² | Relative to mean baseline | Unitless | Compare fit against a baseline |
| Adjusted R² | Penalises predictor count | Unitless | Compare linear models with differing predictors |

## 15. Metric Selection by Use Case

| Scenario | Metrics to inspect |
|---|---|
| Balanced classification | Accuracy, precision, recall, F1 |
| Imbalanced fraud detection | Precision, recall, PR-AUC, confusion matrix |
| Medical screening | Recall/sensitivity, specificity, precision |
| Regression with costly large misses | RMSE, MAE, residual analysis |
| Regression needing typical absolute error | MAE |
| Linear model comparison | Adjusted R² plus validation metrics |

Consider calibration, decision thresholds, class-specific errors, and operational impact in addition to aggregate metrics.

## 16. scikit-learn Evaluation Example

```python
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

predictions = model.predict(X_test)

print(confusion_matrix(y_test, predictions))
print(classification_report(y_test, predictions, zero_division=0))
print("Accuracy:", accuracy_score(y_test, predictions))
print("Precision:", precision_score(y_test, predictions))
print("Recall:", recall_score(y_test, predictions))
print("F1:", f1_score(y_test, predictions))
```

For regression:

```python
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

predictions = regressor.predict(X_test)

mae = mean_absolute_error(y_test, predictions)
mse = mean_squared_error(y_test, predictions)
rmse = mse ** 0.5
r2 = r2_score(y_test, predictions)

print(mae, mse, rmse, r2)
```

## 17. Common Evaluation Pitfalls

- Evaluating on training data only.
- Tuning repeatedly on the test set.
- Reporting accuracy on imbalanced data without class-wise metrics.
- Comparing models using different test splits.
- Ignoring target scale when interpreting MAE/RMSE.
- Assuming R-squared cannot be negative.
- Treating adjusted R-squared as a universal model-selection metric.
- Reporting only one metric while ignoring operational error costs.
- Using random splits for temporal or grouped data where they are invalid.

## 18. Placement and Interview Questions

**Q1. What is a confusion matrix?**  
A table of actual vs predicted class counts that exposes TP, TN, FP, and FN.

**Q2. Precision vs recall?**  
Precision measures correctness among predicted positives; recall measures the fraction of actual positives found.

**Q3. When is F1 useful?**  
When both precision and recall matter and a single harmonic-mean summary is useful.

**Q4. Why can accuracy be misleading?**  
A majority-class classifier can score highly while missing the minority class.

**Q5. MAE vs MSE?**  
MAE penalises absolute error linearly; MSE squares errors and penalises large errors more.

**Q6. Why use RMSE?**  
It keeps the square-rooted error in target units while retaining greater sensitivity to large errors.

**Q7. Can R-squared be negative?**  
Yes, especially on held-out data when predictions are worse than the evaluation-set mean baseline.

**Q8. What does adjusted R-squared do?**  
It adds a penalty related to the number of predictors.

## 19. Practice

### Paper exercise
Given TP = 50, FP = 10, FN = 20, TN = 120:
1. Calculate accuracy.
2. Calculate precision.
3. Calculate recall.
4. Calculate F1.
5. Explain which metric matters if missing a positive case is expensive.

For regression, given actual `[3, 5, 7]` and predicted `[2, 5, 9]`, calculate MAE, MSE, and RMSE.

### Coding exercise
Train a classification and regression baseline:
- Print confusion matrix and classification report.
- Compare thresholds for classification.
- Calculate MAE, MSE, RMSE, R² for regression.
- Explain the metric choice in terms of task cost.

## 20. Quick Revision

- TP/TN: correct predictions.
- FP: false alarm.
- FN: missed positive.
- Accuracy: all correct / all samples.
- Precision: TP / (TP + FP).
- Recall: TP / (TP + FN).
- Specificity: TN / (TN + FP).
- F1: harmonic mean of precision and recall.
- MAE: average absolute error.
- MSE: average squared error.
- RMSE: square root of MSE.
- R²: relative squared-error improvement over mean baseline.
- Adjusted R²: accounts for predictor count.

## 21. Final Checklist

- [ ] Draw a confusion matrix.
- [ ] Calculate accuracy, precision, recall, specificity, and F1.
- [ ] Explain the effect of threshold changes.
- [ ] Calculate MAE, MSE, and RMSE.
- [ ] Interpret R² including negative values.
- [ ] Explain adjusted R² and its limits.
- [ ] Choose metrics based on business costs.
- [ ] Evaluate only on appropriate held-out data.

## 22. Recommended Resources

- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [scikit-learn Metrics API](https://scikit-learn.org/stable/api/sklearn.metrics.html)
