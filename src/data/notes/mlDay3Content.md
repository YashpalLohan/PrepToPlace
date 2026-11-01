# Math for Machine Learning: Linear Algebra, Probability & Statistics

**Day 3 — AI/ML → ML Foundations**

**Learning goal:** Build practical intuition for representing data, measuring variation, reasoning about uncertainty, and understanding where these ideas appear in machine learning. Focus on intuition and applications rather than formal proofs.

## Overview

Machine learning represents real-world information numerically. Linear algebra explains how data is represented and transformed; statistics summarizes data; probability describes uncertainty.

This lecture covers:
- Scalars, vectors, matrices, tensors, dimensions, and shapes.
- Vector operations, norms, and dot products.
- Matrix operations and matrix multiplication.
- Mean, median, variance, standard deviation, covariance, and correlation.
- Probability rules, conditional probability, independence, and distributions.
- Bayes' rule and its use in classification.
- Practical connections to datasets, feature scaling, and linear models.

## Learning flow

Mathematical objects → Vector operations → Matrix operations → Descriptive statistics → Probability rules → Distributions → Bayes' rule → ML applications and practice.

---

# 1. Why Mathematics Matters in ML

A model receives numerical representations, not human concepts directly. A house might be represented by `[area, bedrooms, age]`; an image by pixel values; a text passage by a numerical embedding.

| Area | What it helps explain | ML connection |
|---|---|---|
| Linear algebra | Representing and transforming numbers | Features, weights, embeddings, neural networks |
| Statistics | Summarizing and understanding data | EDA, scaling, evaluation |
| Probability | Reasoning about uncertainty | Classification, Naive Bayes |

Example dataset with two features:

\[
X=\begin{bmatrix}2&70\\4&80\\6&90\end{bmatrix}
\]

Rows are samples; columns are features. Its shape is `(3, 2)`. If the target values are `[55, 70, 85]`, they form the target vector \(y\).

---

# 2. Linear Algebra Foundations

## 2.1 Scalar

A scalar is one numerical value, such as `5`, `-2.4`, or `0.75`. In ML it may represent a learning rate, loss value, or one model parameter.

## 2.2 Vector

A vector is an ordered collection of numbers:

\[
\mathbf{x}=\begin{bmatrix}2\\70\end{bmatrix}
\]

It can represent one observation, a feature set, a direction, or model weights. The dimension is the number of elements. A row vector `[2, 70]` and column vector above contain the same values but have different orientations, which matters in matrix operations.

## 2.3 Matrix

A matrix is a rectangular arrangement of numbers:

\[
A=\begin{bmatrix}1&2&3\\4&5&6\end{bmatrix}
\]

It has 2 rows and 3 columns, so its shape is `(2, 3)`. For \(m\) rows and \(n\) columns, \(A\in\mathbb{R}^{m\times n}\). In a conventional ML dataset, rows are samples and columns are features.

## 2.4 Tensor

A tensor generalizes scalars, vectors, and matrices to multiple dimensions:
- Scalar: 0D.
- Vector: 1D.
- Matrix: 2D.
- Higher-dimensional tensor: 3D or more.

A batch of 32 RGB images of size 64 × 64 might have shape `(32, 64, 64, 3)` (some frameworks use a different channel order). Tensors are fundamental in PyTorch and TensorFlow.

## 2.5 Dimensions and shape

Shape describes the size along each axis. `(100, 5)` commonly means 100 samples and 5 features, not 100 total values. Always check shapes before combining arrays or multiplying matrices.

---

# 3. Vector Operations

Let \(\mathbf{a}=[2,3]\) and \(\mathbf{b}=[4,1]\).

## 3.1 Addition and subtraction

\[
\mathbf{a}+\mathbf{b}=[6,4]
\qquad
\mathbf{a}-\mathbf{b}=[-2,2]
\]

Add or subtract corresponding elements. The vectors must have compatible dimensions.

## 3.2 Scalar multiplication

\[
3\mathbf{a}=[6,9]
\]

Every element is multiplied by the scalar. A negative scalar also reverses direction.

## 3.3 Element-wise multiplication

\[
\mathbf{a}\odot\mathbf{b}=[8,3]
\]

This returns a vector. It is not the dot product.

## 3.4 L2 norm (vector magnitude)

\[
\|\mathbf{x}\|_2=\sqrt{\sum_{i=1}^{n}x_i^2}
\]

For `[2, 3]`, the magnitude is \(\sqrt{13}\). Norms are used in distance calculations, normalization, and regularization.

## 3.5 L1 norm

\[
\|\mathbf{x}\|_1=\sum_{i=1}^{n}|x_i|
\]

For `[2, -3]`, the L1 norm is 5. L1 regularization can encourage sparse model weights.

## 3.6 Dot product

Multiply corresponding elements and sum:

\[
\mathbf{a}\cdot\mathbf{b}=2(4)+3(1)=11
\]

In general:

\[
\mathbf{a}\cdot\mathbf{b}=\sum_{i=1}^{n}a_i b_i
\]

The result is a scalar.

Geometric interpretation:

\[
\mathbf{a}\cdot\mathbf{b}=\|\mathbf{a}\|_2\|\mathbf{b}\|_2\cos\theta
\]

A positive dot product indicates an acute angle, zero indicates orthogonality (for nonzero vectors), and a negative value indicates an obtuse angle.

### Why it matters in ML

A linear model combines features and weights:

\[
\hat y=\mathbf{w}\cdot\mathbf{x}+b
\]

For features `[3, 80]`, weights `[4, 0.5]`, and bias `2`:

\[
\hat y=3(4)+80(0.5)+2=54
\]

This is an illustrative weighted score, not a trained model.

---

# 4. Matrix Operations

## 4.1 Addition and scalar multiplication

Matrices can be added only when their shapes match. Add corresponding entries.

\[
\begin{bmatrix}1&2\\3&4\end{bmatrix}
+
\begin{bmatrix}5&6\\7&8\end{bmatrix}
=
\begin{bmatrix}6&8\\10&12\end{bmatrix}
\]

Scalar multiplication multiplies every entry by that scalar.

## 4.2 Transpose

Transpose swaps rows and columns:

\[
A=\begin{bmatrix}1&2&3\\4&5&6\end{bmatrix},
\quad
A^T=\begin{bmatrix}1&4\\2&5\\3&6\end{bmatrix}
\]

A matrix of shape `(m, n)` becomes `(n, m)`.

## 4.3 Matrix multiplication

If A has shape `(m, n)` and B has shape `(n, p)`, then AB has shape `(m, p)`. The inner dimensions must match.

\[
A=\begin{bmatrix}1&2\\3&4\end{bmatrix},
\quad
B=\begin{bmatrix}5&6\\7&8\end{bmatrix}
\]

\[
AB=\begin{bmatrix}19&22\\43&50\end{bmatrix}
\]

Matrix multiplication is not generally commutative: \(AB\ne BA\). In NumPy, `@` performs matrix multiplication while `*` performs element-wise multiplication.

## 4.4 Identity matrix

\[
I=\begin{bmatrix}1&0\\0&1\end{bmatrix}
\]

For compatible square matrices, \(AI=IA=A\). It plays a role similar to 1 in ordinary multiplication.

## 4.5 Inverse: intuition

For a square matrix A, its inverse (if it exists) satisfies:

\[
AA^{-1}=A^{-1}A=I
\]

Not every matrix has an inverse. It must be square and nonsingular. In practical numerical code, solving a linear system is often more stable than explicitly calculating an inverse.

## 4.6 Matrix form of a linear model

For m samples and n features:

- X has shape `(m, n)`.
- w has shape `(n, 1)`.
- Xw has shape `(m, 1)`.

\[
\hat y=Xw+b
\]

This calculates predictions for many samples in one operation.

---

# 5. Descriptive Statistics

Statistics summarizes a dataset. Consider:

\[
[2,\ 4,\ 4,\ 6,\ 9]
\]

## 5.1 Mean

\[
\bar{x}=\frac{1}{n}\sum_{i=1}^{n}x_i
\]

Mean = `(2 + 4 + 4 + 6 + 9) / 5 = 5`. It uses every value but is sensitive to outliers.

## 5.2 Median

The median is the middle value after sorting. Here it is 4. With an even number of values, take the average of the two middle values. Median is often more representative than mean for skewed data.

## 5.3 Mode

The mode is the most frequent value. Here it is 4. A dataset can have one mode, multiple modes, or no repeated value.

## 5.4 Range and quartiles

\[
\text{Range}=\max(x)-\min(x)
\]

Here range = 7. Quartiles divide sorted data into sections: Q1 is the 25th percentile, Q2 the median, and Q3 the 75th percentile.

\[
IQR=Q3-Q1
\]

IQR describes the spread of the middle 50% and is less affected by extreme values than the full range.

## 5.5 Variance

Variance measures average squared deviation from the mean.

Population variance:

\[
\sigma^2=\frac{1}{N}\sum_{i=1}^{N}(x_i-\mu)^2
\]

Sample variance (usual unbiased estimator):

\[
s^2=\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2
\]

For `[2, 4, 4, 6, 9]`, mean = 5 and squared deviations are `9, 1, 1, 1, 16`, whose sum is 28. Population variance = `28/5 = 5.6`; sample variance = `28/4 = 7`.

Use population variance when the data is the entire population of interest. Use sample variance when estimating population variability from a sample.

## 5.6 Standard deviation

\[
\sigma=\sqrt{\sigma^2}
\]

Population standard deviation for the example is \(\sqrt{5.6}\approx2.37\). It measures spread in the original units, unlike variance which uses squared units.

## 5.7 Covariance

Covariance describes how two variables vary together:

\[
\operatorname{Cov}(X,Y)=\frac{1}{N}\sum_{i=1}^{N}(x_i-\mu_X)(y_i-\mu_Y)
\]

Positive covariance means the variables tend to move in the same direction; negative means opposite directions. Its magnitude depends on units and scale. Sample covariance commonly uses denominator `n - 1`.

## 5.8 Correlation

Pearson correlation measures the strength and direction of a linear relationship:

\[
r=\frac{\operatorname{Cov}(X,Y)}{s_Xs_Y}
\]

It ranges from -1 to +1. `+1` is perfect positive linear correlation, `-1` perfect negative linear correlation, and `0` means no linear correlation. Correlation does not prove causation.

---

# 6. Probability Foundations

Probability measures how likely an event is, from 0 (impossible) to 1 (certain).

## 6.1 Experiment, outcome, sample space, event

For a die roll:
- Experiment: roll the die.
- Outcome: one result, such as 4.
- Sample space: `{1, 2, 3, 4, 5, 6}`.
- Event: a set of outcomes, such as an even result `{2, 4, 6}`.

For equally likely outcomes:

\[
P(A)=\frac{\text{Favourable outcomes}}{\text{Total outcomes}}
\]

This ratio is valid only when outcomes are equally likely.

## 6.2 Complement rule

\[
P(A^c)=1-P(A)
\]

If rain probability is 0.3, no-rain probability is 0.7.

## 6.3 Addition rule

\[
P(A\cup B)=P(A)+P(B)-P(A\cap B)
\]

Subtract the intersection because it was counted twice. If events are mutually exclusive, their intersection is zero and the probabilities simply add.

## 6.4 Multiplication rule

\[
P(A\cap B)=P(A)P(B|A)
\]

For independent events:

\[
P(A\cap B)=P(A)P(B)
\]

## 6.5 Conditional probability

\[
P(A|B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
\]

This is the probability of A when B is already known to have happened. From a 52-card deck, given that the selected card is a face card, the probability it is a king is `4/12 = 1/3`.

## 6.6 Independent vs mutually exclusive

**Independent:** Knowing B happened does not change the probability of A: \(P(A|B)=P(A)\).

**Mutually exclusive:** A and B cannot happen together: \(P(A\cap B)=0\).

These are not synonyms. If two events both have nonzero probability and are mutually exclusive, they are not independent.

## 6.7 Random variables

A random variable assigns a numerical value to each outcome. Discrete variables take countable values (e.g. number of clicks); continuous variables can take values over a range (e.g. time or height).

---

# 7. Common Probability Distributions

A probability distribution describes how probability is assigned to possible values.

## 7.1 Bernoulli distribution

One trial with two outcomes: success (1) and failure (0). Let success probability be p.

\[
P(X=x)=p^x(1-p)^{1-x},\quad x\in\{0,1\}
\]

Mean = p; variance = p(1-p). Examples: one email is spam/not spam, or one user clicks/does not click.

## 7.2 Binomial distribution

Counts successes in a fixed number n of independent Bernoulli trials with the same success probability p.

\[
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}
\]

Mean = np; variance = np(1-p). Conditions: fixed trial count, two outcomes per trial, independence, and constant success probability.

## 7.3 Uniform distribution

For a discrete uniform distribution, listed outcomes are equally likely (such as a fair die). For continuous uniform distribution on `[a, b]`:

\[
f(x)=\frac{1}{b-a},\quad a\le x\le b
\]

For a continuous variable, probability at one exact point is zero; probability is measured over an interval.

## 7.4 Normal distribution

A continuous, symmetric, bell-shaped distribution described by mean μ and standard deviation σ:

\[
X\sim\mathcal{N}(\mu,\sigma^2)
\]

Mean = median = mode = μ. The total area under its density curve is 1.

Approximate empirical rule:
- 68% within 1 standard deviation of the mean.
- 95% within 2 standard deviations.
- 99.7% within 3 standard deviations.

This approximation applies to normally distributed data, not arbitrary datasets.

## 7.5 Z-score and standard normal

A standard normal distribution has mean 0 and standard deviation 1.

\[
z=\frac{x-\mu}{\sigma}
\]

A positive z-score is above the mean; a negative score is below it. A z-score of 2 means two standard deviations above the mean. Standardization does not prove the original data is normally distributed.

| Distribution | Type | Typical use |
|---|---|---|
| Bernoulli | Discrete | One binary trial |
| Binomial | Discrete | Success count in n trials |
| Uniform | Discrete/continuous | Equally likely outcomes / constant density |
| Normal | Continuous | Symmetric measurements and statistical models |

Choose a distribution based on the process and its assumptions, not simply because it is familiar.

---

# 8. Bayes' Rule

Bayes' rule updates the probability of a hypothesis after observing evidence.

\[
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
\]

- Prior \(P(A)\): belief before evidence.
- Likelihood \(P(B|A)\): probability of evidence if A is true.
- Evidence \(P(B)\): overall probability of observing B.
- Posterior \(P(A|B)\): updated probability after evidence.

## 8.1 Worked example: medical screening

Suppose:
- 1% of a population has a condition.
- A test is positive in 90% of people who have it.
- A test is positive in 5% of people who do not have it.

Let A = condition present, B = positive test.

\[
P(A)=0.01,\quad P(B|A)=0.90,\quad P(B|A^c)=0.05
\]

First calculate total positive probability:

\[
P(B)=0.90(0.01)+0.05(0.99)=0.0585
\]

Then:

\[
P(A|B)=\frac{0.90(0.01)}{0.0585}\approx0.1538
\]

The probability of the condition after a positive result is about **15.38%**, under these assumptions.

Why not 90%? Because 90% is \(P(\text{positive}|\text{condition})\), not \(P(\text{condition}|\text{positive})\). The condition is rare, so false positives from the much larger unaffected population matter.

## 8.2 Bayes in ML: Naive Bayes

Naive Bayes applies Bayes' rule with a conditional-independence assumption about features given the class:

\[
P(C|x_1,\ldots,x_n)\propto P(C)\prod_{i=1}^{n}P(x_i|C)
\]

The assumption may not be perfectly true, but the classifier can still work well in practice. Applications include spam filtering and text classification.

---

# 9. Connecting Mathematics to ML

## 9.1 Feature matrix and target vector

For m samples and n features:

\[
X\in\mathbb{R}^{m\times n},\qquad y\in\mathbb{R}^{m}
\]

Rows of X are samples; columns are features.

## 9.2 Linear prediction

\[
\hat y=Xw+b
\]

The dot product combines features with learned weights. Matrix multiplication performs predictions for many samples efficiently.

## 9.3 Feature standardization

\[
z=\frac{x-\mu}{\sigma}
\]

Standardization shifts a feature to mean approximately 0 and standard deviation approximately 1 using the statistics of the data used to fit the scaler. It can help distance-based and gradient-based algorithms.

**Prevent data leakage:** Fit the scaler on training data only, then use those learned parameters to transform validation and test data.

## 9.4 Distance and similarity

Euclidean distance:

\[
d(\mathbf{a},\mathbf{b})=\sqrt{\sum_i(a_i-b_i)^2}
\]

Cosine similarity:

\[
\operatorname{cosine}(a,b)=\frac{a\cdot b}{\|a\|_2\|b\|_2}
\]

These are used in KNN, clustering, and embedding similarity. Cosine similarity is undefined if either vector has zero norm.

## 9.5 Probabilities in classification

A binary classifier may estimate `P(spam | input) = 0.92`. A threshold can turn this score into a class decision. Treat the score as a calibrated probability only when calibration is appropriate and verified.

---

# 10. Python and NumPy Practical Work

## 10.1 Create vectors and matrices

```python
import numpy as np

x = np.array([2, 70])

X = np.array([
    [2, 70],
    [4, 80],
    [6, 90]
])

print(x.shape)  # (2,)
print(X.shape)  # (3, 2)
print(X.ndim)   # 2
```

## 10.2 Vector operations and dot product

```python
a = np.array([2, 3])
b = np.array([4, 1])

print(a + b)               # [6 4]
print(a - b)               # [-2  2]
print(a * b)               # [8 3], element-wise
print(np.dot(a, b))        # 11
print(np.linalg.norm(a))  # sqrt(13)
```

## 10.3 Matrix multiplication and transpose

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print(A.T)
print(A @ B)
```

Use `@` or `np.matmul()` for matrix multiplication. Use `*` for element-wise multiplication.

## 10.4 Mean, variance, and standard deviation

```python
values = np.array([2, 4, 4, 6, 9])

print(np.mean(values))          # 5.0
print(np.median(values))        # 4.0
print(np.var(values))           # population variance: 5.6
print(np.std(values))           # population std: about 2.366
print(np.var(values, ddof=1))   # sample variance: 7.0
```

NumPy defaults to `ddof=0`. Use `ddof=1` for the usual sample-variance calculation.

## 10.5 Covariance and correlation

```python
study_hours = np.array([1, 2, 3, 4, 5])
scores = np.array([45, 50, 60, 65, 80])

print(np.cov(study_hours, scores))
print(np.corrcoef(study_hours, scores))
```

`np.cov` returns a covariance matrix; `np.corrcoef` returns a correlation matrix.

## 10.6 Simulate Bernoulli trials

```python
rng = np.random.default_rng(seed=42)

trials = rng.binomial(n=1, p=0.3, size=1000)
print(trials[:10])
print("Observed success rate:", trials.mean())
```

The observed rate may differ from 0.3, especially for a small number of trials.

## 10.7 Simulate a normal distribution

```python
rng = np.random.default_rng(seed=42)

samples = rng.normal(loc=50, scale=10, size=1000)
print(samples.mean())
print(samples.std())
```

`loc` is the mean and `scale` is the standard deviation.

## 10.8 Calculate z-scores

```python
scores = np.array([40, 50, 60, 70, 80])

mean = scores.mean()
std = scores.std()

z_scores = (scores - mean) / std
print(np.round(z_scores, 2))
```

For real ML pipelines, use a fitted preprocessing transformer and fit it on training data only.

---

# 11. Common Mistakes

1. Confusing shape `(3, 2)` with three total values.
2. Confusing NumPy `*` (element-wise) with `@` (matrix multiplication).
3. Multiplying matrices without checking inner dimensions.
4. Thinking a vector dot product returns a vector; it returns a scalar.
5. Confusing variance with standard deviation.
6. Mixing population variance (divide by N) and sample variance (divide by n−1).
7. Using mean blindly when data contains strong outliers.
8. Treating correlation as proof of causation.
9. Confusing independent events with mutually exclusive events.
10. Reversing conditional probability: \(P(A|B)\ne P(B|A)\) in general.
11. Ignoring base rates in Bayes' rule.
12. Assuming every dataset follows a normal distribution.
13. Scaling before train/test split and causing data leakage.
14. Treating every classifier score as a calibrated probability.

---

# 12. Placement and Interview Questions

## Beginner Level

### Q1. What is the difference between a scalar, vector, and matrix?

**Answer:** A scalar is one number, a vector is an ordered one-dimensional collection, and a matrix is a two-dimensional arrangement of values.

### Q2. What does shape `(100, 5)` mean in an ML dataset?

**Answer:** Conventionally, 100 samples and 5 features.

### Q3. What is a dot product?

**Answer:** Multiply corresponding vector elements and sum them. It returns a scalar and appears in weighted sums such as linear model predictions.

### Q4. Mean vs median?

**Answer:** Mean is the arithmetic average and is sensitive to extreme values. Median is the middle sorted value and is more robust to outliers.

### Q5. What does variance measure?

**Answer:** Average squared deviation from the mean; it describes data spread.

## Intermediate Level

### Q6. Why do matrix dimensions matter?

**Answer:** For A `(m, n)` and B `(n, p)`, the inner dimensions must match and the result is `(m, p)`.

### Q7. Population variance vs sample variance?

**Answer:** Population variance divides by N. The usual unbiased sample-variance estimator divides by n−1 because the mean is estimated from the sample.

### Q8. Can events be mutually exclusive and independent?

**Answer:** Not if both have nonzero probability. Mutually exclusive events have intersection probability zero, while independence requires the intersection probability to equal the product of their probabilities.

### Q9. Why is standardization useful?

**Answer:** It places features on comparable scales and can help distance-based and gradient-based algorithms. It is not required for every model.

### Q10. Why does correlation not imply causation?

**Answer:** The relationship may be coincidental, reversed, or explained by a third variable. Correlation alone does not establish cause.

## Advanced / Applied Level

### Q11. Why can a positive medical test still imply a low disease probability?

**Answer:** When a condition is rare, false positives from the much larger unaffected population can outnumber true positives. Bayes' rule accounts for prevalence and test characteristics.

### Q12. Covariance vs correlation?

**Answer:** Covariance indicates direction of joint variation but depends on units. Correlation is normalized, unitless, and lies between -1 and +1.

### Q13. Why fit a scaler only on training data?

**Answer:** Fitting on all data leaks information from validation/test samples. Fit on training data and transform other splits using the same learned parameters.

### Q14. What assumptions does binomial distribution make?

**Answer:** Fixed number of trials, two outcomes, independent trials, and constant success probability.

### Q15. What role does probability play in classification?

**Answer:** A probabilistic classifier estimates class likelihoods given input. A threshold or decision rule converts estimates into a predicted class.

---

# 13. Practice Exercises

Attempt each before reading its solution.

## Exercise 1 — Vector operations

Given \(a=[3,4]\), \(b=[1,2]\), calculate addition, subtraction, dot product, and L2 norm of a.

**Solution:** Addition `[4, 6]`; subtraction `[2, 2]`; dot product `3(1)+4(2)=11`; L2 norm `sqrt(3²+4²)=5`.

## Exercise 2 — Matrix shape

A dataset has 250 rows and 8 feature columns. Find X shape, transpose shape, and number of feature values.

**Solution:** `(250, 8)`, `(8, 250)`, and `250 × 8 = 2000`.

## Exercise 3 — Matrix multiplication

A has shape `(4, 3)` and B has shape `(3, 2)`. Is AB valid and what is its shape?

**Solution:** Yes. Inner dimensions match; output shape is `(4, 2)`.

## Exercise 4 — Statistics

For `[2, 4, 4, 6, 9]`, find mean, median, population variance, and population standard deviation.

**Solution:** Mean 5; median 4; population variance 5.6; population standard deviation approximately 2.37.

## Exercise 5 — Conditional probability

A card is selected from a standard deck. Given it is a heart, what is the probability it is a king?

**Solution:** One king among 13 hearts, so `1/13`.

## Exercise 6 — Bayes' rule

A condition affects 2% of a population. A test has 95% sensitivity and 10% false-positive rate. Find the probability of the condition given a positive result.

**Solution:**

\[
P(B)=0.95(0.02)+0.10(0.98)=0.117
\]

\[
P(A|B)=\frac{0.95(0.02)}{0.117}\approx0.1624
\]

Posterior probability is approximately 16.24%.

## Exercise 7 — NumPy implementation

Create `[10, 20, 30, 40, 50]` and calculate mean, median, variance, standard deviation, and z-scores. Use NumPy functions from Section 10.

## Exercise 8 — Z-score

A feature has mean 100 and standard deviation 15. Find the z-score of 130.

**Solution:** `(130 - 100) / 15 = 2`, so the value is two standard deviations above the mean.

---

# 14. Quick Revision Sheet

## Linear algebra

| Concept | Remember |
|---|---|
| Scalar | One value |
| Vector | Ordered 1D collection |
| Matrix | 2D rows and columns |
| Tensor | Multi-dimensional array |
| Shape | Size along each dimension |
| Dot product | Multiply corresponding values and sum |
| L1 norm | Sum of absolute values |
| L2 norm | Square root of sum of squares |
| Transpose | Swap rows and columns |
| Matrix multiplication | Inner dimensions must match |

## Statistics

| Concept | Remember |
|---|---|
| Mean | Arithmetic average |
| Median | Middle sorted value |
| Mode | Most frequent value |
| Range | Maximum − minimum |
| Variance | Average squared deviation |
| Standard deviation | Square root of variance |
| Covariance | Direction of joint variation |
| Correlation | Standardized linear relationship |
| IQR | Q3 − Q1 |

## Probability

| Concept | Remember |
|---|---|
| Probability | Between 0 and 1 |
| Complement | `1 - P(A)` |
| Conditional probability | Probability under known evidence |
| Independent events | One does not change the other's probability |
| Mutually exclusive | Cannot occur together |
| Bernoulli | One binary trial |
| Binomial | Success count in fixed independent trials |
| Normal | Symmetric bell-shaped continuous distribution |
| Bayes' rule | Update prior using evidence |

## Essential formulas

\[
\bar{x}=\frac{1}{n}\sum_{i=1}^{n}x_i
\]

\[
\sigma^2=\frac{1}{N}\sum_{i=1}^{N}(x_i-\mu)^2
\qquad
\sigma=\sqrt{\sigma^2}
\]

\[
\mathbf{a}\cdot\mathbf{b}=\sum_i a_i b_i
\]

\[
P(A|B)=\frac{P(A\cap B)}{P(B)}
\]

\[
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
\]

\[
z=\frac{x-\mu}{\sigma}
\]

---

# 15. Day 3 Completion Checklist

- [ ] Represent an ML dataset as a feature matrix and target vector.
- [ ] Explain scalar, vector, matrix, tensor, dimensions, and shape.
- [ ] Perform vector addition, scalar multiplication, norms, and dot products.
- [ ] Distinguish element-wise multiplication from matrix multiplication.
- [ ] Check matrix multiplication dimensions and output shape.
- [ ] Explain mean, median, variance, standard deviation, covariance, and correlation.
- [ ] Distinguish population and sample variance.
- [ ] Explain conditional probability, independence, and mutually exclusive events.
- [ ] Identify Bernoulli, binomial, uniform, and normal distributions.
- [ ] Interpret a z-score and apply Bayes' rule.
- [ ] Explain where these concepts appear in preprocessing, linear models, and classification.

---

# 16. Recommended Resources

1. [3Blue1Brown — Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab) — visual intuition for vectors, matrices, and transformations.
2. [StatQuest — Statistics Fundamentals](https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9) — approachable explanations of statistical concepts.
3. [Khan Academy — Probability and Statistics](https://www.khanacademy.org/math/statistics-probability) — guided probability and statistics practice.

**Study strategy:** Prioritize intuition, small numerical examples, and explaining when a concept is useful. Formal proofs are outside this introductory lecture's scope.

---

**End of Day 3 — Math for Machine Learning**

**Next topic:** Linear Regression.
