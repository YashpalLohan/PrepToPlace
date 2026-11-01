# K-Nearest Neighbours + Naive Bayes

**Day 8 — ML Foundations**

> **Goal:** Understand two foundational classification algorithms, learn how they make predictions, implement them with scikit-learn, and recognize when distance-based or probability-based methods are appropriate.

---

## Learning Flow

1. Understand why KNN and Naive Bayes are useful classifiers.
2. Learn the K-Nearest Neighbours intuition and prediction process.
3. Understand distance metrics and choosing K.
4. Learn why scaling matters for distance-based models.
5. Understand the curse of dimensionality.
6. Learn the Naive Bayes probability foundation.
7. Compare Gaussian, Multinomial, and Bernoulli Naive Bayes.
8. Build leakage-safe scikit-learn pipelines.
9. Evaluate and compare both classifiers.
10. Practice interview questions and identify common mistakes.

---

# 1. Why Learn KNN and Naive Bayes?

K-Nearest Neighbours (KNN) and Naive Bayes are simple, fast-to-understand algorithms that teach two different ways to classify data.

- **KNN:** Predicts using the labels of nearby training examples.
- **Naive Bayes:** Predicts using Bayes' theorem and a simplifying conditional-independence assumption.

They are useful because they:
- Provide strong conceptual foundations for classification.
- Can act as baselines for more complex models.
- Have relatively few modelling assumptions to understand.
- Appear frequently in ML interviews.
- Behave differently, making them useful for model comparison.

| Aspect | KNN | Naive Bayes |
|---|---|---|
| Main idea | Nearby examples vote | Calculate class probabilities |
| Learning style | Instance-based / lazy learning | Probabilistic learning |
| Training | Mostly stores training data | Estimates class and feature probabilities |
| Prediction cost | Can be high as data grows | Usually fast |
| Scaling | Usually important | Depends on feature model; not generally distance-based |
| Main limitation | Distance becomes less informative in high dimensions | Independence assumption may be unrealistic |

---

# 2. K-Nearest Neighbours: Intuition and Prediction

## 2.1 Core intuition

Imagine a new data point whose class is unknown. KNN looks at the `K` closest labelled training examples and predicts the class that appears most often among them.

For example, if `K = 5` and the five nearest neighbours contain:
- 3 examples from Class A
- 2 examples from Class B

The predicted class is Class A.

KNN does not learn a conventional parameterized decision function during training. It stores the training examples and uses them when a prediction is requested.

## 2.2 The KNN prediction process

1. Store the labelled training dataset.
2. Receive a new sample.
3. Calculate its distance from each training sample.
4. Sort or identify the nearest samples.
5. Select the closest `K` neighbours.
6. Count their class labels.
7. Predict the majority class.

<AsyncImage query="K nearest neighbors classification diagram two classes colored points query point circle nearest neighbors educational illustration" />

## 2.3 What does K control?

- Small K: More flexible decision boundaries; sensitive to noise and individual samples.
- Large K: Smoother decision boundaries; may ignore local patterns.
- K = 1: The nearest single training point decides the prediction.

There is no universally correct K. Select it using validation or cross-validation on the training data.

For binary classification, an odd K is sometimes used to reduce ties, but this is not a substitute for validation. Multiclass classification and weighted voting can still produce ties.

## 2.4 Majority voting

For a classification task, the predicted class is:

\[
\hat{y}=\operatorname{mode}\{y_i:i\in N_K(x)\}
\]

Here, \(N_K(x)\) is the set of K nearest training samples to the query point \(x\).

### Distance-weighted voting

Instead of giving every neighbour an equal vote, closer neighbours can receive more influence.

A common weighting idea is:

\[
w_i=\frac{1}{d(x,x_i)+\epsilon}
\]

The predicted class is the class with the largest total neighbour weight. Implementations may use their own weighting conventions and safeguards for zero distance.

---

# 3. Distance Metrics

KNN depends on how distance or similarity is measured. Different metrics can produce different neighbours and therefore different predictions.

## 3.1 Euclidean distance

Straight-line distance between two points:

\[
d(x,y)=\sqrt{\sum_{i=1}^{n}(x_i-y_i)^2}
\]

Best understood as ordinary geometric distance. It is commonly used for continuous numerical features.

## 3.2 Manhattan distance

Sum of absolute coordinate differences:

\[
d(x,y)=\sum_{i=1}^{n}|x_i-y_i|
\]

It measures distance along coordinate-aligned paths and can behave differently from Euclidean distance when feature differences are distributed across dimensions.

## 3.3 Minkowski distance

A generalized distance:

\[
d(x,y)=\left(\sum_{i=1}^{n}|x_i-y_i|^p\right)^{1/p}
\]

- \(p=1\): Manhattan distance.
- \(p=2\): Euclidean distance.

## 3.4 Hamming distance

Counts the number of positions at which two equal-length categorical or binary representations differ.

\[
d_H(x,y)=\sum_{i=1}^{n}\mathbb{1}(x_i\neq y_i)
\]

Use a metric appropriate to the representation. Do not blindly apply Euclidean distance to arbitrary category labels encoded as integers.

## 3.5 Small numerical example

Let:

\[
A=(1,2), \qquad B=(4,6)
\]

Euclidean distance:

\[
d(A,B)=\sqrt{(4-1)^2+(6-2)^2}
=\sqrt{9+16}=5
\]

Manhattan distance:

\[
d_1(A,B)=|4-1|+|6-2|=7
\]

The numerical distance depends on the selected metric.

---

# 4. Why Feature Scaling Matters in KNN

KNN compares distances. Features with large numerical ranges can dominate those distances.

Example:
- Age: values from 18 to 70.
- Annual income: values from 20,000 to 2,000,000.

Without scaling, income differences may dominate the distance even when age is also important.

## 4.1 Standardization

\[
z=\frac{x-\mu}{\sigma}
\]

Transforms a feature using its mean and standard deviation. It centres the training feature around zero and scales it by its standard deviation.

## 4.2 Min-max scaling

\[
x'=\frac{x-x_{\min}}{x_{\max}-x_{\min}}
\]

Maps training values to a specified range, commonly [0, 1]. Values outside the training range can fall outside that range when transforming new data.

## 4.3 Correct scaling workflow

1. Split the data into training and test sets.
2. Fit the scaler on training features only.
3. Transform training features.
4. Transform test features using the already-fitted scaler.
5. Fit KNN on transformed training features.
6. Evaluate on transformed test features.

**Never fit a scaler on the complete dataset before splitting.** That leaks information from the test set into preprocessing.

The safest approach is to place scaling and KNN in one scikit-learn Pipeline.

## 4.4 When scaling may not be necessary

Tree-based models generally do not require standardization because their split decisions are based on feature thresholds rather than distance calculations. KNN is different: scale is directly involved in neighbour selection.

---

# 5. The Curse of Dimensionality

## 5.1 Meaning

As the number of feature dimensions increases, the space that contains the data grows rapidly. With a fixed amount of training data, examples become sparse and the idea of a clearly close neighbour becomes less useful.

This is called the **curse of dimensionality**.

## 5.2 Why it affects KNN

- Distances between points can become less distinguishable.
- Data becomes sparse in the feature space.
- A much larger number of samples may be needed to represent the space adequately.
- Irrelevant features can distort neighbour selection.
- Computation and memory costs may increase.

## 5.3 Practical ways to reduce the problem

- Remove irrelevant or redundant features.
- Use domain knowledge for feature selection.
- Apply dimensionality reduction when appropriate.
- Collect more representative training examples.
- Validate performance as feature count changes.
- Compare KNN with models that may be more suitable for high-dimensional data.

Dimensionality reduction is not guaranteed to improve performance. Fit any learned feature-selection or dimensionality-reduction step on training data only, preferably inside a Pipeline.

---

# 6. KNN with scikit-learn

## 6.1 Basic implementation

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score, classification_report

X, y = load_breast_cancer(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

knn_pipeline = Pipeline([
    ("scaler", StandardScaler()),
    ("model", KNeighborsClassifier(n_neighbors=5))
])

knn_pipeline.fit(X_train, y_train)

predictions = knn_pipeline.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))
```

The dataset is loaded from scikit-learn for a reproducible demonstration. It is a learning example, not a substitute for understanding the dataset's context and limitations.

## 6.2 Tune K using cross-validation

```python
from sklearn.model_selection import GridSearchCV, StratifiedKFold

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

param_grid = {
    "model__n_neighbors": [3, 5, 7, 9, 11, 15],
    "model__weights": ["uniform", "distance"],
    "model__p": [1, 2]
}

search = GridSearchCV(
    knn_pipeline,
    param_grid=param_grid,
    scoring="f1",
    cv=cv,
    n_jobs=-1
)

search.fit(X_train, y_train)

print("Best parameters:", search.best_params_)
print("Best CV F1:", search.best_score_)
```

The scoring metric should match the task. For imbalanced classification, F1, recall, precision, or ROC-AUC may be more informative than accuracy.

The test set remains untouched during parameter search.

## 6.3 KNN strengths and limitations

**Strengths**
- Easy to understand.
- No conventional model-fitting stage.
- Can model nonlinear decision boundaries.
- Naturally supports multiclass classification.
- Useful as a baseline.

**Limitations**
- Prediction can be slow for large training datasets.
- Requires storing training examples.
- Sensitive to feature scale and irrelevant features.
- Performance can degrade in high dimensions.
- Sensitive to the distance metric and K choice.
- Missing values and mixed data types require suitable preprocessing.

---

# 7. Naive Bayes: Probability-Based Classification

## 7.1 Core intuition

Naive Bayes uses Bayes' theorem to estimate the probability that a sample belongs to each class, given its observed features.

It is called **naive** because it assumes that features are conditionally independent given the class.

This assumption is often not perfectly true in real datasets, but Naive Bayes can still work well, especially for some text-classification tasks.

## 7.2 Bayes' theorem

\[
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
\]

Where:
- \(P(A|B)\): Posterior probability — probability of A after observing B.
- \(P(B|A)\): Likelihood — probability of observing B when A is true.
- \(P(A)\): Prior — probability of A before observing B.
- \(P(B)\): Evidence — overall probability of B.

## 7.3 Applying Bayes' theorem to classification

Let \(C\) be a class and \(X\) the observed feature vector.

\[
P(C|X)=\frac{P(X|C)P(C)}{P(X)}
\]

For classification, compare posterior probabilities across classes. Since \(P(X)\) is the same for every candidate class:

\[
\hat{C}=\arg\max_C P(X|C)P(C)
\]

## 7.4 The conditional-independence assumption

For features \(x_1,x_2,\ldots,x_n\), Naive Bayes assumes:

\[
P(X|C)=\prod_{i=1}^{n}P(x_i|C)
\]

This factorization makes probability estimation simpler.

The assumption is that features are independent **conditioned on the class**, not necessarily independent in the entire dataset.

## 7.5 A simple intuition example: spam detection

Suppose an email contains words such as:
- `free`
- `offer`
- `win`

A Naive Bayes classifier estimates:
- How common the spam class is (prior).
- How often each word appears in spam emails (likelihood).
- How often each word appears in non-spam emails.

It combines this evidence to estimate which class is more probable.

The word probabilities are learned from training examples. The classifier does not understand the semantic meaning of the words.

---

# 8. Types of Naive Bayes

Different variants model different feature distributions. Choosing the correct variant matters.

## 8.1 Gaussian Naive Bayes

Assumes each numerical feature follows a Gaussian (normal) distribution within each class.

\[
P(x_i|C)=
\frac{1}{\sqrt{2\pi\sigma_C^2}}
\exp\left(-\frac{(x_i-\mu_C)^2}{2\sigma_C^2}\right)
\]

Use when numerical features can be reasonably modelled by class-conditional Gaussian distributions.

scikit-learn: `GaussianNB`

## 8.2 Multinomial Naive Bayes

Commonly used for non-negative count features, especially word counts in text classification.

Examples:
- Document word counts.
- Term-frequency vectors.
- Other non-negative count data.

scikit-learn: `MultinomialNB`

## 8.3 Bernoulli Naive Bayes

Models binary features, often representing whether a word or attribute is present or absent.

Examples:
- Word appears / does not appear.
- Feature enabled / disabled.
- Binary indicators.

scikit-learn: `BernoulliNB`

## 8.4 Variant comparison

| Variant | Feature representation | Typical use |
|---|---|---|
| GaussianNB | Continuous numerical features | Sensor or measurement classification |
| MultinomialNB | Non-negative counts or count-like values | Text classification |
| BernoulliNB | Binary features | Word presence/absence classification |

Do not use MultinomialNB with arbitrary negative standardized features. Its input requirements differ from GaussianNB.

---

# 9. Laplace Smoothing and Zero-Probability Problem

## 9.1 The problem

Suppose a word never appeared in spam training examples. A basic frequency estimate may assign it probability zero.

When likelihoods are multiplied, one zero probability can make the entire class likelihood zero.

## 9.2 Laplace smoothing

Add a small count, commonly \(\alpha=1\), to avoid zero estimates.

For a categorical/count setting:

\[
P(w|C)=\frac{\operatorname{count}(w,C)+\alpha}
{\operatorname{total}(C)+\alpha V}
\]

Where:
- \(\alpha\): smoothing parameter.
- \(V\): vocabulary size.
- \(\operatorname{count}(w,C)\): count of word \(w\) in class \(C\).
- \(\operatorname{total}(C)\): total feature count for class \(C\).

In scikit-learn, `MultinomialNB` and `BernoulliNB` expose the `alpha` parameter.

Smoothing prevents unseen events from receiving an exact zero estimate. It does not guarantee that the model is well calibrated or accurate.

---

# 10. Naive Bayes with scikit-learn

## 10.1 Gaussian Naive Bayes example

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, classification_report

X, y = load_breast_cancer(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = GaussianNB()
model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))
```

GaussianNB does not require distance-based scaling in the way KNN does. Scaling may still affect numerical behaviour in some circumstances, but it is not a standard distance requirement.

## 10.2 Multinomial Naive Bayes for text

```python
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report

data = fetch_20newsgroups(
    subset="all",
    categories=["sci.space", "rec.sport.baseball"],
    remove=("headers", "footers", "quotes")
)

X_train, X_test, y_train, y_test = train_test_split(
    data.data,
    data.target,
    test_size=0.2,
    random_state=42,
    stratify=data.target
)

text_model = Pipeline([
    ("vectorizer", CountVectorizer()),
    ("classifier", MultinomialNB(alpha=1.0))
])

text_model.fit(X_train, y_train)
predictions = text_model.predict(X_test)

print(classification_report(y_test, predictions, target_names=data.target_names))
```

The Pipeline ensures that the vocabulary is learned from training documents only. The example may download the dataset the first time it is run.

## 10.3 Naive Bayes strengths and limitations

**Strengths**
- Fast to train and predict.
- Works well for many text-classification tasks.
- Handles high-dimensional sparse word-count features effectively.
- Supports multiclass classification.
- Produces class probability estimates.

**Limitations**
- Conditional independence is often unrealistic.
- Probability estimates may be poorly calibrated.
- Performance depends on selecting a suitable variant.
- Gaussian assumptions may not fit every numerical feature.
- Multinomial and Bernoulli variants have input constraints.

---

# 11. KNN vs Naive Bayes

| Comparison | KNN | Naive Bayes |
|---|---|---|
| Prediction basis | Nearby labelled samples | Posterior probabilities |
| Main requirement | Meaningful distance | Suitable probability model |
| Scaling | Usually important | Not generally required for distance |
| Training cost | Low | Low to moderate |
| Prediction cost | Can be high | Usually low |
| High-dimensional sparse text | Often challenging | Often effective |
| Main hyperparameters | K, metric, weights | Variant, smoothing |
| Interpretability | Explain through neighbours | Explain through priors and likelihoods |

## 11.1 When should you try KNN?

Try KNN when:
- The dataset is small or medium-sized.
- Features are numerical and meaningfully scaled.
- Similar samples are expected to have similar labels.
- You want a simple nonlinear baseline.

## 11.2 When should you try Naive Bayes?

Try Naive Bayes when:
- You need a fast classification baseline.
- You are working with text or sparse word-count data.
- Training data is limited.
- A simple probabilistic classifier is useful for comparison.

Neither algorithm is always better. Compare them using the same training split and an appropriate validation strategy.

---

# 12. Practical Comparison Exercise

Use one classification dataset and compare:
1. A majority-class baseline.
2. Scaled KNN.
3. A suitable Naive Bayes variant.

For a numerical dataset, GaussianNB is a reasonable starting point. For text counts, use MultinomialNB.

## 12.1 Suggested evaluation

Report:
- Accuracy.
- Precision.
- Recall.
- F1-score.
- Confusion matrix.
- ROC-AUC where probability scores and the task make it appropriate.
- Cross-validation performance.
- Training and prediction time if comparing efficiency.

Do not compare models using different test sets.

## 12.2 Questions to answer

- Did scaling improve KNN?
- Which value of K performed best in cross-validation?
- Did distance weighting help?
- Did KNN struggle as features increased?
- Which Naive Bayes variant matched the feature representation?
- Was Naive Bayes faster at prediction?
- Did either model show a precision/recall trade-off?
- Did the best cross-validation model also perform well on the held-out test set?

---

# 13. Common Mistakes

1. Using KNN without considering feature scales.
2. Choosing K based only on test-set performance.
3. Assuming a larger K is always better.
4. Using Euclidean distance for arbitrary integer-encoded categories.
5. Ignoring irrelevant features and high dimensionality.
6. Fitting a scaler before the train/test split.
7. Confusing conditional independence with unconditional independence.
8. Assuming Naive Bayes requires all features to be independent in reality.
9. Using MultinomialNB with negative-valued standardized features.
10. Choosing GaussianNB for every numerical dataset without checking assumptions.
11. Treating predicted probabilities as automatically calibrated.
12. Comparing models on inconsistent splits or metrics.

---

# 14. Placement and Interview Questions

### Q1. What is KNN?

**Answer:** KNN is an instance-based supervised learning algorithm that predicts a sample's class using the majority label among its K nearest training examples.

### Q2. Why is KNN called a lazy learner?

**Answer:** It does not build a conventional generalized model during training. It mainly stores the training examples and performs much of its work at prediction time.

### Q3. What happens when K is too small?

**Answer:** The model becomes sensitive to noise and individual training samples, which can lead to overfitting.

### Q4. What happens when K is too large?

**Answer:** Neighbourhoods become broader and local patterns can be lost, potentially causing underfitting.

### Q5. Why is feature scaling important for KNN?

**Answer:** KNN uses distances. Features with larger numerical ranges can dominate distance calculations and disproportionately influence which samples are considered neighbours.

### Q6. Explain the curse of dimensionality.

**Answer:** As dimensions increase, data becomes sparse and distance measures become less discriminative unless the amount of data grows substantially. This can make nearest-neighbour relationships less meaningful.

### Q7. What is the difference between Euclidean and Manhattan distance?

**Answer:** Euclidean distance is the square root of summed squared coordinate differences. Manhattan distance is the sum of absolute coordinate differences.

### Q8. What is Naive Bayes?

**Answer:** It is a probabilistic classifier based on Bayes' theorem that uses a conditional-independence assumption to simplify the likelihood calculation.

### Q9. Why is it called naive?

**Answer:** It assumes that features are conditionally independent given the class. Real-world features can be correlated, so the assumption is often an approximation.

### Q10. What is Laplace smoothing?

**Answer:** It adds a small count to feature frequencies so unseen events do not receive zero probability estimates.

### Q11. When would you use MultinomialNB?

**Answer:** For non-negative count-like features, particularly word-count vectors in text classification.

### Q12. Does Naive Bayes need feature scaling?

**Answer:** Not for the same distance-based reason as KNN. Its variants model feature likelihoods rather than calculating distances. Preprocessing should still match the selected variant and data.

### Q13. Why can Naive Bayes work well for text classification?

**Answer:** Text data is often represented as high-dimensional sparse word counts. MultinomialNB can estimate class-conditional word frequencies efficiently.

### Q14. Which is faster: KNN or Naive Bayes?

**Answer:** Naive Bayes generally has faster prediction because it uses learned probability parameters. KNN may need to compare a query with many stored training samples, although indexing structures and approximate-neighbour methods can help.

---

# 15. Coding Practice

## Exercise 1 — Distance calculation

Write Python functions to calculate:
- Euclidean distance.
- Manhattan distance.

Test both using two-dimensional points.

## Exercise 2 — KNN from scratch

Implement a basic KNN classifier:
1. Calculate the distance from a query point to each training point.
2. Sort by distance.
3. Select K neighbours.
4. Count labels.
5. Return the majority label.

Start with a small two-dimensional dataset.

## Exercise 3 — K selection

Train KNN models using K values of 1, 3, 5, 7, 9, and 11. Compare cross-validation scores and explain the pattern.

## Exercise 4 — Scaling experiment

Run KNN:
- Without scaling.
- With StandardScaler inside a Pipeline.

Compare validation results and explain why they differ.

## Exercise 5 — Naive Bayes from scratch

For a tiny categorical dataset, calculate:
- Class priors.
- Conditional feature probabilities.
- Posterior scores for a new example.

Use smoothing for unseen feature values.

## Exercise 6 — Text classification

Build a text-classification Pipeline using:
- CountVectorizer.
- MultinomialNB.

Evaluate with precision, recall, F1, and a confusion matrix.

---

# 16. Quick Revision Sheet

| Concept | Remember |
|---|---|
| KNN | Classifies using nearby labelled samples |
| K | Number of neighbours considered |
| Small K | More sensitive to noise |
| Large K | Smoother, potentially underfit |
| Euclidean | Square root of squared differences |
| Manhattan | Sum of absolute differences |
| Scaling | Important for distance-based methods |
| Curse of dimensionality | Sparse space and less informative distances |
| Naive Bayes | Bayes' theorem plus conditional independence |
| Prior | Probability of a class before observing features |
| Likelihood | Probability of features given a class |
| Posterior | Probability of a class after observing features |
| Laplace smoothing | Avoids zero-frequency probability estimates |
| GaussianNB | Continuous features modelled with Gaussian likelihoods |
| MultinomialNB | Non-negative count-like features |
| BernoulliNB | Binary features |

---

# 17. Final Checklist

- [ ] I can explain how KNN classifies a new sample.
- [ ] I can calculate Euclidean and Manhattan distance.
- [ ] I understand how K affects bias, variance, and sensitivity to noise.
- [ ] I can explain why scaling matters for KNN.
- [ ] I can explain the curse of dimensionality.
- [ ] I understand Bayes' theorem, prior, likelihood, and posterior.
- [ ] I can explain the conditional-independence assumption.
- [ ] I can distinguish Gaussian, Multinomial, and Bernoulli Naive Bayes.
- [ ] I understand Laplace smoothing.
- [ ] I can build KNN and Naive Bayes models using scikit-learn.
- [ ] I can use Pipelines and cross-validation without data leakage.
- [ ] I can compare classifiers using appropriate metrics.

---

# 18. Recommended Resources

1. [StatQuest: K-Nearest Neighbours](https://www.youtube.com/watch?v=HVXime0nQeI)
   - Visual explanation of the KNN algorithm and how neighbours determine predictions.

2. [StatQuest: Naive Bayes](https://www.youtube.com/watch?v=O2L2Uv9pdDA)
   - Intuitive walkthrough of probability-based classification.

3. [scikit-learn: Nearest Neighbours Guide](https://scikit-learn.org/stable/modules/neighbors.html)
   - Official documentation for neighbour algorithms, distance metrics, and implementation details.

**Study strategy:** First understand the prediction logic with a tiny dataset. Then implement the algorithm using scikit-learn and compare its behaviour under different preprocessing and validation choices.

---

**End of Day 8 — K-Nearest Neighbours + Naive Bayes**

**Next:** Continue to Decision Trees and learn how models create rule-based splits to classify or predict values.
