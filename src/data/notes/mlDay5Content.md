# Logistic Regression + Gradient Descent

**Day 5 — ML Foundations**

> **Learning goal:** Understand why classification needs a different prediction model from linear regression, explain the sigmoid and log-loss functions, and implement logistic regression's gradient-descent update rule by hand using NumPy.

## Learning Flow

1. [Classification: The Problem](#1-classification-the-problem)
2. [Why Linear Regression Is Not Enough](#2-why-linear-regression-is-not-enough-for-classification)
3. [Logistic Regression Model](#3-logistic-regression-model)
4. [Sigmoid Function](#4-sigmoid-function)
5. [Decision Boundary and Class Prediction](#5-decision-boundary-and-class-prediction)
6. [Binary Cross-Entropy / Log-Loss](#6-binary-cross-entropy-log-loss)
7. [Gradient Descent for Logistic Regression](#7-gradient-descent-for-logistic-regression)
8. [Implement Logistic Regression from Scratch](#8-implement-logistic-regression-from-scratch)
9. [Evaluate Classification Predictions](#9-evaluate-classification-predictions)
10. [Use scikit-learn](#10-use-scikit-learn)
11. [Assumptions, Limitations, and Common Mistakes](#11-assumptions-limitations-and-common-mistakes)
12. [Placement Interview Questions](#12-placement-interview-questions)
13. [Practice Exercises](#13-practice-exercises)
14. [Quick Revision Sheet](#14-quick-revision-sheet)
15. [Further Learning Resources](#15-further-learning-resources)

---

## 1. Classification: The Problem

**Classification** is a supervised learning task in which the target represents a class or category rather than a continuous numerical quantity.

Examples:
- Predict whether an email is spam or not spam.
- Predict whether a transaction is fraudulent.
- Predict whether a customer will churn.
- Predict whether a tumour is benign or malignant.

For binary classification, the target is commonly encoded as:

\[
y \in \{0,1\}
\]

- `0`: negative class, such as not spam.
- `1`: positive class, such as spam.

A training dataset contains features \(X\) and known labels \(y\). The model learns from labelled examples and estimates the probability that a new example belongs to the positive class.

### Regression vs classification

| Aspect | Regression | Classification |
|---|---|---|
| Target | Continuous value | Class/category |
| Example | House price | Spam / not spam |
| Typical output | Predicted number | Class probability or label |
| Common loss | MSE | Log-loss / cross-entropy |
| Example algorithm | Linear regression | Logistic regression |

**Important:** Logistic regression is a classification algorithm despite having the word *regression* in its name.

## 2. Why Linear Regression Is Not Enough for Classification

Linear regression predicts an unrestricted real-valued output:

\[
\hat y = \mathbf{x}^{T}\mathbf{w}+b
\]

That output can be less than 0 or greater than 1. It therefore cannot directly be interpreted as a probability.

For a binary target, we want a probability in the interval:

\[
0 \leq P(y=1\mid \mathbf{x}) \leq 1
\]

A common but problematic approach is to fit a linear regression model and apply a threshold. This can produce values outside the probability range and can be sensitive to outliers and class-label arrangement.

Logistic regression solves this by applying a sigmoid function to a linear score.

### Key distinction

- **Linear regression:** estimates a continuous target directly.
- **Logistic regression:** estimates a class probability from a linear combination of features, then applies a decision threshold to obtain a class label.

The decision boundary can still be linear in the original feature space. The probability output, however, is transformed by the sigmoid.

## 3. Logistic Regression Model

Logistic regression first calculates a linear score, also called the logit:

\[
z = \mathbf{w}^{T}\mathbf{x}+b
\]

Then it transforms the score into a probability:

\[
\hat p=P(y=1\mid\mathbf{x})=\sigma(z)
\]

Here:
- \(\mathbf{x}\): input feature vector.
- \(\mathbf{w}\): learned weight vector.
- \(b\): bias/intercept.
- \(z\): linear score or logit.
- \(\sigma\): sigmoid function.
- \(\hat p\): predicted probability of the positive class.

For multiple examples in matrix form:

\[
\mathbf{z}=X\mathbf{w}+b
\]

\[
\hat{\mathbf p}=\sigma(\mathbf{z})
\]

If `X` has shape `(m, n)`, then `w` has shape `(n,)`, and predictions have shape `(m,)`.

### Example

Suppose a model predicts a 0.82 probability that a transaction is fraudulent. With a threshold of 0.5, it predicts class `1`. This does not mean the model is 82% certain in a calibrated sense; it is the model's estimated probability, whose reliability should be evaluated.

## 4. Sigmoid Function

The sigmoid, also called the logistic function, maps any real-valued input to a value strictly between 0 and 1.

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

### Behaviour

- If \(z\) is a large positive number, sigmoid approaches 1.
- If \(z=0\), sigmoid equals 0.5.
- If \(z\) is a large negative number, sigmoid approaches 0.

| \(z\) | \(\sigma(z)\), approximately |
|---:|---:|
| -5 | 0.0067 |
| -2 | 0.1192 |
| 0 | 0.5000 |
| 2 | 0.8808 |
| 5 | 0.9933 |

### NumPy implementation

```python
import numpy as np

def sigmoid(z):
    # Clip values to reduce overflow in exp for extreme inputs.
    z = np.clip(z, -500, 500)
    return 1 / (1 + np.exp(-z))

scores = np.array([-5, -2, 0, 2, 5], dtype=float)
print(np.round(sigmoid(scores), 4))
```

### Derivative of sigmoid

The derivative has a useful compact form:

\[
\sigma'(z)=\sigma(z)(1-\sigma(z))
\]

This derivative is useful in neural networks. For the standard binary logistic-regression model with cross-entropy loss, the combined derivative simplifies to the prediction error \(\hat p-y\), which makes the parameter gradients particularly convenient.

## 5. Decision Boundary and Class Prediction

A probability becomes a class prediction after applying a threshold.

For the usual threshold of 0.5:

\[
\hat y =
\begin{cases}
1 & \text{if } \hat p \geq 0.5\\
0 & \text{if } \hat p < 0.5
\end{cases}
\]

Because sigmoid is 0.5 when \(z=0\), the default decision boundary is:

\[
\mathbf{w}^{T}\mathbf{x}+b=0
\]

### Threshold is a choice

A threshold of 0.5 is not mandatory:
- Lower threshold: usually increases positive predictions and recall, but may reduce precision.
- Higher threshold: usually reduces positive predictions and may increase precision, but can reduce recall.

Choose a threshold based on the costs of false positives and false negatives, validation data, and the task's requirements. Do not tune it on the test set.

### Example

In disease screening, missing a true positive may be much more costly than sending a healthy person for an additional test. A lower threshold may therefore be appropriate, depending on clinical requirements and validation.

## 6. Binary Cross-Entropy / Log-Loss

Logistic regression commonly uses **binary cross-entropy**, also called **log-loss**, to measure how well predicted probabilities match binary labels.

For one example:

\[
L(y,\hat p)=-\left[y\log(\hat p)+(1-y)\log(1-\hat p)\right]
\]

For \(m\) examples:

\[
J(\mathbf w,b)=-\frac{1}{m}\sum_{i=1}^{m}
\left[
y_i\log(\hat p_i)+(1-y_i)\log(1-\hat p_i)
\right]
\]

### Intuition

- If the true label is `1`, the loss is \(-\log(\hat p)\). A high predicted probability for class 1 gives a small loss.
- If the true label is `0`, the loss is \(-\log(1-\hat p)\). A low predicted probability for class 1 gives a small loss.
- Confident but incorrect predictions receive a very large penalty.

### Worked example

For a true positive label \(y=1\):
- Prediction \(\hat p=0.9\): loss is \(-\log(0.9)\approx0.105\).
- Prediction \(\hat p=0.1\): loss is \(-\log(0.1)\approx2.303\).

The second prediction is much worse because it assigns a low probability to the correct class.

### Why not MSE?

MSE is not impossible to use for classification, but it is generally not the standard objective for logistic regression. Log-loss is derived from the Bernoulli likelihood, strongly penalizes confident mistakes, and pairs naturally with the sigmoid model. With the standard logistic model, the binary cross-entropy objective is convex in the parameters.

### Numerically safe implementation

Probabilities of exactly 0 or 1 can make logarithms undefined. Clip predictions slightly away from those endpoints:

```python
import numpy as np

def binary_cross_entropy(y_true, y_prob):
    epsilon = 1e-15
    y_prob = np.clip(y_prob, epsilon, 1 - epsilon)

    loss = -np.mean(
        y_true * np.log(y_prob)
        + (1 - y_true) * np.log(1 - y_prob)
    )
    return loss

y_true = np.array([1, 0, 1, 1])
y_prob = np.array([0.9, 0.2, 0.7, 0.4])

print("Log-loss:", binary_cross_entropy(y_true, y_prob))
```

## 7. Gradient Descent for Logistic Regression

Gradient Descent finds weights and bias that minimize the average log-loss.

For \(m\) training examples and \(n\) features:

\[
\frac{\partial J}{\partial \mathbf w}
=\frac{1}{m}X^T(\hat{\mathbf p}-\mathbf y)
\]

\[
\frac{\partial J}{\partial b}
=\frac{1}{m}\sum_{i=1}^{m}(\hat p_i-y_i)
\]

The update rules are:

\[
\mathbf w \leftarrow \mathbf w-\alpha
\frac{\partial J}{\partial \mathbf w}
\]

\[
b \leftarrow b-\alpha
\frac{\partial J}{\partial b}
\]

- \(\alpha\): learning rate.
- \(X\): feature matrix.
- \(\hat{\mathbf p}\): predicted probabilities.
- \(\mathbf y\): actual labels.

### Why does the gradient simplify?

The chain rule combines the sigmoid derivative and binary cross-entropy derivative. For one example, the derivative of the loss with respect to the linear score \(z\) simplifies to:

\[
\frac{\partial L}{\partial z}=\hat p-y
\]

That is why the weight gradient is the feature vector multiplied by the prediction error, averaged over the dataset.

### One update by hand

Suppose:
- One feature value \(x=2\).
- Actual label \(y=1\).
- Initial weight \(w=0\), bias \(b=0\).
- Learning rate \(\alpha=0.1\).

First calculate the score and probability:

\[
z=wx+b=0
\]

\[
\hat p=\sigma(0)=0.5
\]

For this single example:

\[
\frac{\partial J}{\partial w}=x(\hat p-y)=2(0.5-1)=-1
\]

\[
\frac{\partial J}{\partial b}=\hat p-y=-0.5
\]

Update:

\[
w_{\text{new}}=0-0.1(-1)=0.1
\]

\[
b_{\text{new}}=0-0.1(-0.5)=0.05
\]

The updated parameters increase the score for this positive example.

### Learning-rate behaviour

- Too small: training may progress very slowly.
- Too large: loss may oscillate or diverge.
- Reasonable: loss generally decreases and eventually stabilizes.

Feature scaling often helps gradient-based optimization converge more reliably.

## 8. Implement Logistic Regression from Scratch

This implementation uses batch Gradient Descent and NumPy. It intentionally does not use scikit-learn for training.

### 8.1 Prepare a small dataset

```python
import numpy as np

# Two features: hours studied and practice tests completed.
X = np.array([
    [1, 0],
    [2, 1],
    [2, 0],
    [3, 1],
    [4, 2],
    [5, 2],
    [6, 3],
    [7, 3]
], dtype=float)

# 1 = passed, 0 = did not pass
y = np.array([0, 0, 0, 0, 1, 1, 1, 1], dtype=float)

# Standardize features for more stable gradient descent.
mean = X.mean(axis=0)
std = X.std(axis=0)
std[std == 0] = 1
X_scaled = (X - mean) / std

print("Feature means:", mean)
print("Feature standard deviations:", std)
```

### 8.2 Define sigmoid and log-loss

```python
def sigmoid(z):
    z = np.clip(z, -500, 500)
    return 1 / (1 + np.exp(-z))


def compute_loss(y_true, y_prob):
    epsilon = 1e-15
    y_prob = np.clip(y_prob, epsilon, 1 - epsilon)

    return -np.mean(
        y_true * np.log(y_prob)
        + (1 - y_true) * np.log(1 - y_prob)
    )
```

### 8.3 Train using batch Gradient Descent

```python
def train_logistic_regression(X, y, learning_rate=0.1, epochs=2000):
    m, n = X.shape
    weights = np.zeros(n)
    bias = 0.0
    loss_history = []

    for epoch in range(epochs):
        # Forward pass
        scores = X @ weights + bias
        probabilities = sigmoid(scores)

        # Calculate gradients
        error = probabilities - y
        dw = (X.T @ error) / m
        db = np.mean(error)

        # Parameter updates
        weights -= learning_rate * dw
        bias -= learning_rate * db

        # Record loss
        if epoch % 100 == 0:
            current_probabilities = sigmoid(X @ weights + bias)
            loss_history.append(compute_loss(y, current_probabilities))

    return weights, bias, loss_history


weights, bias, loss_history = train_logistic_regression(
    X_scaled, y, learning_rate=0.1, epochs=2000
)

print("Weights:", weights)
print("Bias:", bias)
print("Recorded losses:", loss_history)
```

### 8.4 Predict probabilities and classes

```python
def predict_proba(X, weights, bias):
    return sigmoid(X @ weights + bias)


def predict(X, weights, bias, threshold=0.5):
    probabilities = predict_proba(X, weights, bias)
    return (probabilities >= threshold).astype(int)


probabilities = predict_proba(X_scaled, weights, bias)
predictions = predict(X_scaled, weights, bias)

print("Probabilities:", np.round(probabilities, 3))
print("Predictions:", predictions)
print("Actual labels:", y.astype(int))
```

### 8.5 Understand the training loop

Each epoch performs these steps:

1. Compute the linear score \(Xw+b\).
2. Apply sigmoid to obtain probabilities.
3. Subtract true labels to calculate prediction errors.
4. Calculate weight and bias gradients.
5. Update weights and bias using the learning rate.
6. Recalculate and record the loss for monitoring.

**Batch Gradient Descent** uses all training examples to calculate each update. Stochastic Gradient Descent updates from one example at a time; mini-batch Gradient Descent uses a subset.

## 9. Evaluate Classification Predictions

Do not evaluate a classifier using only its predicted probabilities or training loss. Evaluate its class predictions on data not used for fitting.

### Confusion matrix

| | Predicted positive | Predicted negative |
|---|---:|---:|
| Actual positive | True Positive (TP) | False Negative (FN) |
| Actual negative | False Positive (FP) | True Negative (TN) |

- **TP:** Correctly predicted positive.
- **TN:** Correctly predicted negative.
- **FP:** Predicted positive when actual class is negative.
- **FN:** Predicted negative when actual class is positive.

### Core metrics

\[
Accuracy=\frac{TP+TN}{TP+TN+FP+FN}
\]

\[
Precision=\frac{TP}{TP+FP}
\]

\[
Recall=\frac{TP}{TP+FN}
\]

\[
F1=2\cdot\frac{Precision\cdot Recall}{Precision+Recall}
\]

- Accuracy: fraction of all predictions that are correct.
- Precision: among predicted positives, how many are truly positive?
- Recall: among actual positives, how many did the model find?
- F1: harmonic mean of precision and recall.

For imbalanced datasets, accuracy can be misleading. Inspect precision, recall, F1, the confusion matrix, and the precision-recall curve as appropriate.

### Probability metrics

**Log-loss** evaluates predicted probabilities, not just thresholded labels. A model can have the same accuracy as another model but worse log-loss if its probabilities are less reliable.

## 10. Use scikit-learn

After understanding the from-scratch implementation, use scikit-learn's `LogisticRegression` for practical workflows.

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
    log_loss
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.25,
    random_state=42,
    stratify=y
)

model = make_pipeline(
    StandardScaler(),
    LogisticRegression(max_iter=1000)
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]

print("Accuracy:", accuracy_score(y_test, y_pred))
print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred, zero_division=0))
print("Log-loss:", log_loss(y_test, y_prob))
```

### Important implementation notes

- `predict_proba(X)[:, 1]` returns the estimated probability for class `1` in a binary classification task.
- `predict(X)` returns class labels using the estimator's decision rule.
- Scaling is placed inside a pipeline so the scaler is fitted only on training data during `fit`.
- `stratify=y` helps preserve class proportions in the train/test split when possible.
- `max_iter` sets the maximum number of solver iterations; it is not the same as the learning-rate parameter in the manual implementation.

## 11. Assumptions, Limitations, and Common Mistakes

### Useful assumptions and properties

- The model is linear in its log-odds: the logit is a linear combination of the input features.
- Observations are generally assumed to be independent for the usual statistical interpretation.
- Severe multicollinearity can make coefficient estimates unstable.
- Sufficiently informative features and appropriate data quality are important.
- Logistic regression does not require normally distributed features.

### Limitations

- A standard logistic-regression model has a linear decision boundary in feature space.
- It may underfit complex nonlinear relationships unless features are transformed or nonlinear terms are added.
- Outliers and influential observations can affect the fitted coefficients.
- Class imbalance and poor probability calibration need deliberate handling.
- Correlation in observational data does not establish causation.

### Common mistakes

1. Calling logistic regression a regression algorithm for continuous target prediction.
2. Treating the sigmoid output as a class label instead of a probability.
3. Assuming 0.5 is always the best threshold.
4. Using MSE by default instead of binary cross-entropy for standard logistic regression.
5. Forgetting to average gradients over the number of training examples.
6. Updating weights before calculating all gradients from the same parameter values.
7. Ignoring feature scaling when gradient descent is unstable or slow.
8. Evaluating only on training data.
9. Scaling the complete dataset before the train/test split, causing data leakage.
10. Interpreting a high accuracy as sufficient evidence on an imbalanced dataset.

## 12. Placement Interview Questions

### Beginner Level

**Q1. Why is logistic regression used for classification?**

**Answer:** It applies the sigmoid function to a linear score, producing a value between 0 and 1 that can be interpreted as an estimated probability for the positive class.

**Q2. Why is logistic regression called regression if it is used for classification?**

**Answer:** It models the log-odds of the positive class as a linear function of the features. The resulting probability is converted into a class using a threshold.

**Q3. What is the range of the sigmoid function?**

**Answer:** It is strictly between 0 and 1 for finite real inputs. At an input of zero, its value is 0.5.

**Q4. What is the default decision threshold in binary logistic regression?**

**Answer:** Commonly 0.5, although the threshold can be changed to reflect the costs of false positives and false negatives.

### Intermediate Level

**Q5. Why is binary cross-entropy used instead of MSE?**

**Answer:** Binary cross-entropy is the natural negative log-likelihood for a Bernoulli target, penalizes confident incorrect probabilities strongly, and works naturally with the sigmoid model.

**Q6. What is the gradient of logistic-regression loss with respect to the weights?**

**Answer:** For average binary cross-entropy without regularization, it is \(X^T(\hat p-y)/m\).

**Q7. What happens if the learning rate is too high?**

**Answer:** Updates can overshoot the minimum, causing loss to oscillate or diverge. A smaller learning rate or a suitable optimization strategy may be needed.

**Q8. What is the decision boundary?**

**Answer:** It is the set of feature values where the model's predicted probability equals the selected threshold. At threshold 0.5, it is \(w^Tx+b=0\).

### Advanced Level

**Q9. Is the logistic-regression loss convex?**

**Answer:** For standard binary logistic regression with linear logits and binary cross-entropy, the objective is convex in the parameters. With suitable regularization it remains convex. This does not mean every practical optimization setup converges instantly; numerical conditioning and solver settings still matter.

**Q10. What is the difference between `predict()` and `predict_proba()`?**

**Answer:** `predict()` returns class labels. `predict_proba()` returns estimated class probabilities, which can be used for threshold selection and probability-based evaluation.

**Q11. Why can accuracy be misleading on an imbalanced dataset?**

**Answer:** A model can predict the majority class for almost every example and still achieve high accuracy while failing to identify the minority class. Precision, recall, F1, confusion matrix, and suitable curves provide more insight.

**Q12. What does a logistic-regression coefficient mean?**

**Answer:** Holding other features constant, a one-unit increase in a feature changes the log-odds of the positive class by that feature's coefficient. Exponentiating the coefficient gives the corresponding odds ratio.

## 13. Practice Exercises

### Conceptual

1. Explain why a linear-regression output is not automatically a valid probability.
2. Calculate sigmoid values for \(z=-3,0,3\).
3. Explain how changing the classification threshold affects precision and recall.
4. Compare MSE and binary cross-entropy for binary classification.
5. Explain the difference between a logit, probability, and predicted class.

### Coding

1. Implement sigmoid using NumPy and test it on positive, negative, and zero inputs.
2. Implement binary cross-entropy with numerical clipping.
3. For a single labelled example, calculate one weight and bias update by hand.
4. Implement batch Gradient Descent for logistic regression without using scikit-learn.
5. Add a loss-history list and verify that training loss generally decreases with a suitable learning rate.
6. Implement `predict_proba` and `predict` with a configurable threshold.
7. Compare thresholds 0.3, 0.5, and 0.7 using a confusion matrix.
8. Train scikit-learn's `LogisticRegression` and compare its predictions with your implementation on a simple dataset.

### Expected understanding

You should be able to explain every line of the forward pass, gradient calculation, and parameter update without copying the code.

## 14. Quick Revision Sheet

| Concept | Remember |
|---|---|
| Task | Binary classification |
| Linear score | \(z=w^Tx+b\) |
| Sigmoid | \(\sigma(z)=1/(1+e^{-z})\) |
| Probability | \(\hat p=\sigma(z)\) |
| Default threshold | 0.5 |
| Log-loss | Binary cross-entropy |
| Weight gradient | \(X^T(\hat p-y)/m\) |
| Bias gradient | \(\sum(\hat p-y)/m\) |
| Weight update | \(w\leftarrow w-\alpha\,dw\) |
| Bias update | \(b\leftarrow b-\alpha\,db\) |
| Metrics | Precision, recall, F1, accuracy, log-loss |
| Library | `sklearn.linear_model.LogisticRegression` |

### Core formulas

**Sigmoid**

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

**Binary cross-entropy**

\[
J=-\frac{1}{m}\sum_{i=1}^{m}
[y_i\log(\hat p_i)+(1-y_i)\log(1-\hat p_i)]
\]

**Gradients**

\[
dw=\frac{X^T(\hat p-y)}{m}
\qquad
db=\frac{1}{m}\sum_{i=1}^{m}(\hat p_i-y_i)
\]

**Updates**

\[
w\leftarrow w-\alpha dw
\qquad
b\leftarrow b-\alpha db
\]

## 15. Further Learning Resources

1. [StatQuest: Logistic Regression](https://www.youtube.com/watch?v=yIYKR4sgzI8)
2. [3Blue1Brown: Gradient Descent](https://www.youtube.com/watch?v=IHZwWFHW-a-w)
3. [Andrew Ng: Supervised Machine Learning — Course 1, Week 3](https://www.coursera.org/learn/machine-learning)
4. [scikit-learn: Logistic Regression Documentation](https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression)

---

## Final Takeaways

- Logistic regression is a classification model that estimates probabilities.
- The sigmoid maps a linear score to a probability between 0 and 1.
- A threshold converts probability into a predicted class.
- Binary cross-entropy measures the quality of predicted probabilities.
- The gradient simplifies to the average feature-weighted prediction error.
- Implement the forward pass, loss, gradients, and updates yourself before relying on a library.
- Use validation data and task-specific metrics to choose thresholds and evaluate performance.
