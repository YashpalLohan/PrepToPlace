# Linear Regression

**Day 4 — ML Foundations**

> **Learning goal:** Understand linear regression mathematically, compare the Normal Equation and Gradient Descent, and implement a working model from scratch before using scikit-learn.

## Learning Flow

1. [Problem Setup: Supervised Learning](#1-problem-setup-supervised-learning)
2. [Linear Model and Predictions](#2-linear-model-and-predictions)
3. [Residuals and Cost Function](#3-residuals-and-cost-function)
4. [Mean Squared Error](#4-mean-squared-error-mse)
5. [Normal Equation](#5-normal-equation-closed-form-solution)
6. [Gradient Descent](#6-gradient-descent)
7. [From-Scratch Implementation](#7-implement-linear-regression-from-scratch)
8. [Evaluation](#8-evaluate-and-interpret-the-model)
9. [scikit-learn](#9-use-scikit-learn)
10. [Assumptions and Limitations](#10-assumptions-limitations-and-common-mistakes)
11. [Interview Questions](#11-placement-interview-questions)
12. [Practice](#12-practice-exercises)
13. [Quick Revision](#13-quick-revision-sheet)

---

## 1. Problem Setup: Supervised Learning

Linear regression is a **supervised learning** algorithm that predicts a continuous numerical target from one or more input features.

Examples:
- Predict house price from area, location score, and bedrooms.
- Predict marks from study hours.
- Predict delivery time from distance and traffic features.
- Predict sales from advertising spend.

A supervised dataset contains input features and known target values.

| Study hours (`x`) | Marks (`y`) |
|---:|---:|
| 1 | 35 |
| 2 | 40 |
| 3 | 50 |
| 4 | 55 |
| 5 | 65 |

The model learns a relationship from these examples and uses it to predict a target for a new input.

**Terminology**
- **Feature (`x`):** Input variable.
- **Target (`y`):** Actual value to predict.
- **Prediction (`ŷ`):** Model output.
- **Parameter:** Learned value such as a coefficient or intercept.
- **Training:** Learning parameters from data.
- **Inference:** Predicting for new inputs.

Regression predicts a numerical quantity; classification predicts a category.

## 2. Linear Model and Predictions

### 2.1 Simple linear regression

With one feature, the model is a straight-line equation:

\[
\hat{y} = b_0 + b_1x
\]

- \(\hat{y}\): predicted target.
- \(x\): input feature.
- \(b_0\): intercept, the prediction when \(x=0\).
- \(b_1\): slope/coefficient, the predicted change for a one-unit increase in \(x\).

Example:

\[
\hat{y} = 20 + 9x
\]

For \(x=4\), the prediction is \(20+9(4)=56\).

### 2.2 Interpreting coefficients

- Positive slope: prediction increases as the feature increases.
- Negative slope: prediction decreases as the feature increases.
- Slope near zero: the fitted prediction changes very little with that feature.
- The intercept may not have a useful real-world interpretation if zero is outside the relevant data range.

### 2.3 Multiple linear regression

For multiple features:

\[
\hat{y}=b_0+b_1x_1+b_2x_2+\cdots+b_nx_n
\]

For example, house price may be modeled using area, bedrooms, and age. Each coefficient describes the model's predicted change for a one-unit increase in that feature, **holding the other included features constant**.

### 2.4 Matrix representation

For \(m\) examples and \(n\) features:

\[
\hat{\mathbf y}=X\mathbf w+b
\]

- \(X\): feature matrix, shape `(m, n)`.
- \(\mathbf w\): coefficient vector, shape `(n,)`.
- \(b\): intercept.
- \(\hat{\mathbf y}\): vector of predictions.

Adding a leading column of ones to the feature matrix incorporates the intercept into the parameter vector:

\[
\hat{\mathbf y}=X_b\boldsymbol\theta
\]

Here, \(X_b\) has shape `(m, n+1)`.

## 3. Residuals and the Cost Function

A prediction is rarely exactly equal to the actual target. The residual for example \(i\) is:

\[
e_i=y_i-\hat{y}_i
\]

- Positive residual: the model underpredicted.
- Negative residual: the model overpredicted.
- Zero residual: prediction equals the actual value.

A **cost function** converts the errors across the dataset into one score. Training aims to find parameters that minimize this score.

## 4. Mean Squared Error (MSE)

Mean Squared Error is a common cost function for linear regression:

\[
MSE=\frac{1}{m}\sum_{i=1}^{m}(y_i-\hat{y}_i)^2
\]

Squaring residuals:
1. Makes positive and negative errors contribute positively.
2. Penalizes large errors more heavily.
3. Produces a smooth, differentiable objective useful for optimization.

### Worked example

Actual values: \(y=[3,5,7]\). Predictions: \(\hat y=[2,5,9]\).

Residuals: \([1,0,-2]\). Squared errors: \([1,0,4]\).

\[
MSE=\frac{1+0+4}{3}=\frac{5}{3}\approx1.667
\]

### MSE and RMSE

\[
RMSE=\sqrt{MSE}
\]

MSE uses squared target units; RMSE uses the same units as the target.

### NumPy implementation

```python
import numpy as np

y_actual = np.array([3, 5, 7])
y_predicted = np.array([2, 5, 9])

errors = y_actual - y_predicted
mse = np.mean(errors ** 2)
rmse = np.sqrt(mse)

print("MSE:", mse)
print("RMSE:", rmse)
```

## 5. Normal Equation: Closed-Form Solution

The **Normal Equation** calculates least-squares parameters directly using matrix operations; it does not require iterative gradient updates.

With the intercept included in the design matrix:

\[
\boldsymbol\theta=(X_b^TX_b)^{-1}X_b^T\mathbf y
\]

- \(X_b\): feature matrix with a leading column of ones.
- \(X_b^T\): transpose of the design matrix.
- \(\mathbf y\): actual target vector.
- \(\boldsymbol\theta\): least-squares parameters, when the inverse exists.

### Procedure

1. Add a column of ones for the intercept.
2. Form the least-squares expression.
3. Calculate coefficients and use them for predictions.

### NumPy implementation

```python
import numpy as np

X = np.array([[1.0], [2.0], [3.0]])
y = np.array([2.0, 3.0, 5.0])

X_b = np.c_[np.ones((X.shape[0], 1)), X]
theta = np.linalg.pinv(X_b) @ y

print("Intercept:", theta[0])
print("Coefficient:", theta[1])
print("Predictions:", X_b @ theta)
```

### Why use a pseudoinverse?

The ordinary inverse may fail if the matrix is singular or poorly conditioned, such as when features are redundant or linearly dependent. A pseudoinverse or least-squares solver is more robust:

```python
theta = np.linalg.pinv(X_b) @ y
```

Alternatively:

```python
theta, residuals, rank, singular_values = np.linalg.lstsq(
    X_b, y, rcond=None
)
```

**Advantages:** No learning rate to tune; no iterative convergence process; useful for small or moderate feature counts.

**Limitations:** Matrix operations can be expensive with many features; explicit inversion can be numerically unstable; not ideal for every large-scale or sparse dataset.

## 6. Gradient Descent

Gradient Descent is an iterative optimization algorithm. It repeatedly updates parameters in the direction that reduces the cost function.

### 6.1 Intuition

Think of the cost function as a landscape. Current parameters represent the current position. The gradient points in the direction of steepest increase, so moving in the negative-gradient direction reduces the cost locally.

### 6.2 Parameter update

\[
\theta_j:=\theta_j-\alpha\frac{\partial J(\boldsymbol\theta)}{\partial\theta_j}
\]

- \(\alpha\): learning rate.
- \(J\): cost function.
- The partial derivative measures how the cost changes with parameter \(\theta_j\).

For MSE and a linear model:

\[
\frac{\partial J}{\partial\theta_j}=\frac{2}{m}\sum_{i=1}^{m}(\hat y_i-y_i)x_{ij}
\]

For the intercept, the corresponding input is 1.

### 6.3 Vectorized gradient

\[
\nabla J(\boldsymbol\theta)=\frac{2}{m}X_b^T(X_b\boldsymbol\theta-\mathbf y)
\]

\[
\boldsymbol\theta:=\boldsymbol\theta-\alpha\frac{2}{m}X_b^T(X_b\boldsymbol\theta-\mathbf y)
\]

### 6.4 Learning rate

- Too small: training can be very slow.
- Appropriate: cost generally decreases toward a minimum.
- Too large: updates may overshoot, oscillate, or diverge.

Feature scaling is often useful for gradient-based optimization, especially when feature ranges differ substantially.

### 6.5 Variants

| Variant | Data used per update | Characteristic |
|---|---|---|
| Batch Gradient Descent | Entire training set | Full-dataset gradient; each update can be expensive |
| Stochastic Gradient Descent | One example | Frequent, noisy updates |
| Mini-batch Gradient Descent | Small batch | Balances update cost and gradient stability |

For this lecture, implement **Batch Gradient Descent** first.

### Batch Gradient Descent code

```python
import numpy as np

X = np.array([[1.0], [2.0], [3.0], [4.0]])
y = np.array([3.0, 5.0, 7.0, 9.0])

X_b = np.c_[np.ones((X.shape[0], 1)), X]
m = len(y)
theta = np.zeros(X_b.shape[1])
learning_rate = 0.05
epochs = 2000

for epoch in range(epochs):
    predictions = X_b @ theta
    errors = predictions - y
    gradients = (2 / m) * (X_b.T @ errors)
    theta = theta - learning_rate * gradients

print("Learned parameters:", theta)
print("Predictions:", X_b @ theta)
```

The dataset follows `y = 1 + 2x`; after convergence, the learned intercept and coefficient should be close to 1 and 2.

## 7. Implement Linear Regression from Scratch

This combines the linear model, MSE objective, and Batch Gradient Descent into a reusable implementation.

### Complete implementation

```python
import numpy as np


class LinearRegressionScratch:
    def __init__(self, learning_rate=0.01, epochs=1000):
        self.learning_rate = learning_rate
        self.epochs = epochs
        self.weights = None
        self.bias = 0.0
        self.loss_history = []

    def predict(self, X):
        return X @ self.weights + self.bias

    def fit(self, X, y):
        X = np.asarray(X, dtype=float)
        y = np.asarray(y, dtype=float).reshape(-1)

        m, n = X.shape
        self.weights = np.zeros(n)
        self.bias = 0.0
        self.loss_history = []

        for _ in range(self.epochs):
            predictions = self.predict(X)
            errors = predictions - y

            dw = (2 / m) * (X.T @ errors)
            db = (2 / m) * np.sum(errors)

            self.weights -= self.learning_rate * dw
            self.bias -= self.learning_rate * db

            self.loss_history.append(np.mean(errors ** 2))

        return self


# Study hours -> marks
X = np.array([[1], [2], [3], [4], [5]], dtype=float)
y = np.array([35, 40, 50, 55, 65], dtype=float)

model = LinearRegressionScratch(learning_rate=0.01, epochs=5000)
model.fit(X, y)

print("Weights:", model.weights)
print("Bias:", model.bias)
print("Prediction for 6 hours:", model.predict(np.array([[6.0]])))
print("Final recorded training MSE:", model.loss_history[-1])
```

### Understand the code

- `__init__`: stores the learning rate and number of iterations.
- `predict`: computes the linear model output.
- `fit`: initializes parameters and repeatedly updates them using the full dataset.
- `dw`: gradient for feature coefficients.
- `db`: gradient for the intercept.
- `loss_history`: records training loss during optimization.

**Implementation detail:** In this example, loss is recorded from predictions calculated immediately before the parameter update in each iteration. Recompute predictions after training if you need the exact post-update loss.

### Optional fitted-line plot

```python
import matplotlib.pyplot as plt

predictions = model.predict(X)
plt.scatter(X[:, 0], y, label="Actual data")
plt.plot(X[:, 0], predictions, label="Regression line")
plt.xlabel("Study hours")
plt.ylabel("Marks")
plt.title("Linear Regression from Scratch")
plt.legend()
plt.show()
```

### Validate your implementation

1. Input features are a two-dimensional matrix.
2. There is one target value per training row.
3. Predictions have the expected number of values.
4. Loss decreases for a suitable learning rate.
5. Coefficients are sensible for the dataset.
6. The model predicts unseen input rows.

## 8. Evaluate and Interpret the Model

Do not judge a regression model only by inspecting a few predictions.

### Mean Absolute Error (MAE)

\[
MAE=\frac{1}{m}\sum_{i=1}^{m}|y_i-\hat y_i|
\]

MAE is the average absolute prediction error in the target's original units. It is less sensitive to large errors than MSE.

### Mean Squared Error (MSE)

\[
MSE=\frac{1}{m}\sum_{i=1}^{m}(y_i-\hat y_i)^2
\]

MSE penalizes large errors more strongly because residuals are squared.

### Root Mean Squared Error (RMSE)

\[
RMSE=\sqrt{MSE}
\]

RMSE is in the target's units and penalizes large errors more strongly than MAE.

### R-squared

\[
R^2=1-\frac{\sum_{i=1}^{m}(y_i-\hat y_i)^2}{\sum_{i=1}^{m}(y_i-\bar y)^2}
\]

R-squared compares model squared error with the error from predicting the mean target for every example.

- `1`: perfect predictions on the evaluated data.
- `0`: no better in squared-error terms than predicting the target mean.
- Below `0`: worse than that mean-prediction baseline.

A high training R-squared does not guarantee good performance on unseen data.

### Train/test split

Evaluate generalization on examples not used to fit the model.

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Fit on X_train and y_train; evaluate predictions on X_test.
```

Do not repeatedly tune against the test set. Keep it for final evaluation.

## 9. Use scikit-learn

After implementing the algorithm yourself, compare your understanding with the standard library implementation.

### LinearRegression

```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

model = LinearRegression()
model.fit(X, y)
predictions = model.predict(X)

print("Intercept:", model.intercept_)
print("Coefficients:", model.coef_)
print("MSE:", mean_squared_error(y, predictions))
print("R-squared:", r2_score(y, predictions))
```

### Important API

| API | Purpose |
|---|---|
| `LinearRegression()` | Creates an estimator |
| `fit(X, y)` | Learns coefficients from training data |
| `predict(X)` | Predicts target values |
| `coef_` | Learned feature coefficients |
| `intercept_` | Learned intercept |
| `score(X, y)` | Returns R-squared on supplied data |

### Compare scratch and scikit-learn

- Use the same training examples and features.
- Use the same intercept convention.
- Ensure the scratch optimizer has converged.
- Compare predictions and metrics, not only coefficients.
- Small differences can arise from solver choices and numerical tolerances.

## 10. Assumptions, Limitations, and Common Mistakes

### Common assumptions and considerations

1. **Linearity:** The expected target is reasonably represented by a linear combination of features.
2. **Independent errors:** Error terms should not have problematic dependence, especially for inferential use.
3. **Constant error variance:** For standard inference, error spread should be reasonably stable across fitted values (homoscedasticity).
4. **No perfect multicollinearity:** A feature should not be an exact linear combination of other features.
5. **Error distribution for inference:** Normally distributed errors matter for some classical tests and confidence intervals; they are not required simply to calculate least-squares predictions.

These are modeling and inference considerations, not a requirement that every real dataset satisfy every condition perfectly.

### Limitations

- A linear model may underfit nonlinear patterns.
- Outliers can strongly influence squared-error fitting.
- Correlated features can make individual coefficients unstable or difficult to interpret.
- Extrapolating far outside the training range can be unreliable.
- A fitted association does not establish causation.

### Common mistakes

- Confusing actual values `y` with predictions `ŷ`.
- Forgetting to average squared errors when calculating MSE.
- Using the wrong sign in the gradient update.
- Choosing an excessively large learning rate.
- Ignoring feature and target shapes.
- Updating weights before calculating all gradients from the same parameter state.
- Evaluating only on training data.
- Scaling using the full dataset before splitting, causing data leakage.
- Assuming high R-squared proves the model is appropriate.

## 11. Placement Interview Questions

### Beginner Level

**Q1. What is linear regression?**

**Answer:** A supervised learning algorithm that models a continuous target as a linear combination of input features.

**Q2. What is the difference between slope and intercept?**

**Answer:** The slope is the predicted change in the target for a one-unit increase in a feature, holding other included features constant. The intercept is the prediction when all features are zero.

**Q3. What is a residual?**

**Answer:** The difference between the actual target and prediction: \(e_i=y_i-\hat y_i\).

**Q4. Why is MSE used?**

**Answer:** It is differentiable, treats positive and negative residuals symmetrically, and penalizes larger errors more heavily.

### Intermediate Level

**Q5. What is the Normal Equation?**

**Answer:** A closed-form least-squares solution that calculates parameters through matrix operations without iterative gradient updates.

**Q6. Normal Equation vs Gradient Descent?**

**Answer:** The Normal Equation calculates a least-squares solution directly using linear algebra. Gradient Descent iteratively updates parameters using the cost gradient.

**Q7. What happens when the learning rate is too high?**

**Answer:** Updates can overshoot the minimum, causing oscillation or divergence.

**Q8. Why is feature scaling useful for Gradient Descent?**

**Answer:** Features on very different scales can make optimization poorly conditioned and slow convergence. Scaling can make optimization more efficient.

### Advanced Level

**Q9. Why can the Normal Equation fail with an ordinary inverse?**

**Answer:** The matrix can be singular or poorly conditioned, for example because of redundant or linearly dependent features. A pseudoinverse or least-squares solver is more robust.

**Q10. Does linear regression require normally distributed input features?**

**Answer:** No. Normality of input features is not a general requirement for least-squares fitting. Error-distribution assumptions matter for certain statistical inference procedures.

**Q11. Can R-squared be negative?**

**Answer:** Yes. On evaluated data, a model can perform worse than the baseline that predicts the target mean.

**Q12. Does correlation imply causation?**

**Answer:** No. Association alone does not establish that changing a feature causes the target to change.

## 12. Practice Exercises

### Concept checks

1. Given \(\hat y=5+3x\), calculate the prediction for `x = 7`.
2. Actual values are `[4, 6, 8]` and predictions are `[5, 5, 10]`. Calculate residuals and MSE.
3. Explain why squared error penalizes a residual of 4 more than a residual of 2.
4. State one advantage and one limitation of the Normal Equation.
5. Explain what happens when the learning rate is too small.

### Coding exercises

1. Implement an MSE function using NumPy.
2. Implement the Normal Equation using `np.linalg.pinv`.
3. Implement Batch Gradient Descent for one feature.
4. Extend the implementation to multiple features.
5. Store loss after every epoch and inspect whether it decreases.
6. Compare scratch predictions with `sklearn.linear_model.LinearRegression`.
7. Evaluate using MAE, MSE, RMSE, and R-squared.

### Mini-project: Study Hours vs Marks Predictor

- Create a dataset containing study hours and marks.
- Split it into training and test sets.
- Train linear regression from scratch.
- Plot training points and the fitted line.
- Evaluate predictions on the test set.
- Train the scikit-learn version.
- Compare results and explain differences.

## 13. Quick Revision Sheet

| Concept | Remember |
|---|---|
| Linear model | \(\hat y=b_0+b_1x\) |
| Multiple features | \(\hat{\mathbf y}=X\mathbf w+b\) |
| Residual | \(y_i-\hat y_i\) |
| MSE | Average of squared residuals |
| RMSE | Square root of MSE |
| Normal Equation | Closed-form least-squares solution |
| Gradient Descent | Repeated negative-gradient updates |
| Learning rate | Controls update size |
| Batch GD | Uses the full dataset per update |
| MAE | Average absolute error |
| R-squared | Comparison with target-mean baseline |
| scikit-learn | `fit()`, `predict()`, `coef_`, `intercept_` |

**Essential workflow:** Understand data → define linear model → calculate predictions → measure MSE → optimize parameters → evaluate on unseen data → compare with scikit-learn.

### Completion checklist

- [ ] I can explain simple and multiple linear regression.
- [ ] I can calculate predictions using slope and intercept.
- [ ] I can calculate residuals and MSE by hand.
- [ ] I understand the Normal Equation and why a pseudoinverse is useful.
- [ ] I can explain the Gradient Descent update and learning rate.
- [ ] I have implemented Batch Gradient Descent from scratch.
- [ ] I have compared my implementation with scikit-learn.
- [ ] I can explain the major assumptions and limitations.

---

## Recommended Resources

1. [StatQuest: Linear Regression](https://www.youtube.com/watch?v=nk2CQITm_eo)
2. [Andrew Ng: Supervised Machine Learning — Course 1, Weeks 1–2](https://www.coursera.org/learn/machine-learning)
3. [Krish Naik: Linear Regression from Scratch](https://www.youtube.com/watch?v=1-OGRohmH2s)
4. [scikit-learn: Linear Models Documentation](https://scikit-learn.org/stable/modules/linear_model.html)

**Scope boundary:** This lecture covers ordinary linear regression, least-squares cost, the Normal Equation, Batch Gradient Descent, and a first implementation. Logistic regression, Ridge/Lasso, polynomial regression, and advanced statistical inference belong in later topics.
