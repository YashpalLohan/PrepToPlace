# Decision Trees

**Day 9 — ML Foundations**

> **Goal:** Understand how decision trees recursively split data, calculate impurity using Gini and entropy, select splits using information gain, and build a small tree manually before implementing one with scikit-learn.

---

## Learning Flow

1. Understand decision trees and their prediction logic.
2. Learn nodes, branches, leaves, and recursive splitting.
3. Understand pure and impure nodes.
4. Calculate Gini impurity.
5. Calculate entropy.
6. Calculate information gain and select a split.
7. Build a tiny decision tree manually.
8. Understand stopping criteria and overfitting.
9. Implement classification and regression trees with scikit-learn.
10. Evaluate, tune, and interpret trees.

---

# 1. What Is a Decision Tree?

A **Decision Tree** is a supervised machine learning algorithm that makes predictions by repeatedly splitting data according to feature-based rules.

It can be used for:
- **Classification:** Predicting categories, such as spam or not spam.
- **Regression:** Predicting continuous values, such as house prices.

A decision tree resembles a flowchart:
- Ask a question about a feature.
- Follow the branch corresponding to the answer.
- Continue until reaching a leaf.
- Return the prediction stored in that leaf.

Example:
- Is study time greater than 3 hours?
- If yes, check attendance.
- If no, predict a different outcome.

<AsyncImage query="simple decision tree classification diagram root node branches leaf nodes yes no educational machine learning illustration" />

## 1.1 Why use decision trees?

- Easy to visualize and explain.
- Can model nonlinear relationships.
- Capture feature interactions.
- Usually do not require feature scaling.
- Handle numerical and categorical features after suitable preprocessing.
- Provide a foundation for Random Forests and Gradient Boosting.

## 1.2 Main limitations

- Deep trees can overfit.
- Small changes in data can produce a different tree.
- Greedy splitting does not guarantee a globally optimal tree.
- A single tree may be less accurate than an ensemble.
- Axis-aligned splits can require many branches to model some patterns.

---

# 2. Anatomy of a Decision Tree

A decision tree contains several structural elements.

| Element | Meaning |
|---|---|
| Root node | First node containing the complete training dataset |
| Decision/internal node | A feature-based test that splits data |
| Branch | Outcome of a decision test |
| Leaf/terminal node | Final node that stores a prediction |
| Parent node | Node that creates child nodes |
| Child node | Node created by a parent split |
| Depth | Number of edges from the root to a node |
| Subtree | A node and all of its descendants |

## 2.1 Classification example

Suppose a model predicts whether a student passes an exam.

Possible rules:
- Study hours greater than 3?
- Attendance greater than 75%?
- Previous score greater than 50?

A sample travels from the root through decisions until it reaches a leaf such as `Pass` or `Fail`.

The tree learns which questions and thresholds to use from the training data. The questions are not necessarily chosen manually.

---

# 3. How a Decision Tree Learns

A decision tree commonly uses a **greedy recursive splitting process**.

1. Start with all training examples at the root.
2. Consider candidate features and split points.
3. Calculate how good each candidate split is.
4. Select the split with the best impurity reduction according to the chosen criterion.
5. Divide the data into child nodes.
6. Repeat the process recursively for each child.
7. Stop when a stopping condition is met.
8. Store a prediction in each terminal leaf.

The algorithm is greedy because it selects the best split at the current node. It does not generally search all possible complete tree structures to find a globally optimal tree.

## 3.1 What makes a good split?

A good classification split creates child nodes that are more homogeneous than the parent.

For example:
- Parent: 6 Pass, 4 Fail.
- Left child: 5 Pass, 0 Fail.
- Right child: 1 Pass, 4 Fail.

The left child is completely pure. The right child is also more concentrated in one class than the parent.

To quantify impurity, common measures include:
- Gini impurity.
- Entropy.

---

# 4. Pure and Impure Nodes

A node is **pure** when all samples in it belong to one class.

Examples:
- 10 Pass, 0 Fail → pure.
- 0 Pass, 10 Fail → pure.
- 5 Pass, 5 Fail → impure.

For a classification node:
- Lower impurity means the node contains a more concentrated class distribution.
- Impurity is zero when the node is pure.
- Higher impurity indicates greater class mixture.

The splitting criterion helps the tree decide which candidate partition improves class purity.

---

# 5. Gini Impurity

## 5.1 Definition

Gini impurity measures the probability of incorrectly classifying a randomly selected sample if its label were assigned according to the class distribution in the node.

For \(K\) classes:

\[
Gini=1-\sum_{i=1}^{K}p_i^2
\]

Where:
- \(K\) is the number of classes.
- \(p_i\) is the proportion of samples belonging to class \(i\).

## 5.2 Binary classification example

Suppose a node contains:
- 6 Pass
- 4 Fail
- Total = 10

Therefore:

\[
p_{Pass}=\frac{6}{10}=0.6
\]

\[
p_{Fail}=\frac{4}{10}=0.4
\]

Calculate Gini:

\[
Gini=1-(0.6^2+0.4^2)
\]

\[
=1-(0.36+0.16)
\]

\[
=\boxed{0.48}
\]

## 5.3 Gini for a pure node

Suppose all 10 samples are Pass:

\[
Gini=1-(1^2+0^2)=0
\]

A pure node has Gini impurity of zero.

## 5.4 Gini for an evenly mixed binary node

Suppose:
- 5 Pass
- 5 Fail

\[
Gini=1-(0.5^2+0.5^2)
\]

\[
=1-(0.25+0.25)=0.5
\]

For binary classification, the maximum Gini impurity is 0.5, reached when both classes are equally represented.

For more than two classes, the maximum is \(1-\frac{1}{K}\), when all K classes are equally represented.

---

# 6. Entropy

## 6.1 Definition

Entropy measures uncertainty or disorder in the class distribution of a node.

For \(K\) classes:

\[
H(S)=-\sum_{i=1}^{K}p_i\log_2(p_i)
\]

Where:
- \(p_i\) is the proportion of class \(i\).
- \(\log_2\) is the base-2 logarithm.
- A term with \(p_i=0\) is treated as zero.

## 6.2 Example: 6 Pass and 4 Fail

\[
H(S)=-[0.6\log_2(0.6)+0.4\log_2(0.4)]
\]

\[
H(S)\approx 0.971
\]

This node has some uncertainty because both classes are present.

## 6.3 Entropy of a pure node

If all samples belong to one class:

\[
H(S)=-[1\log_2(1)+0]=0
\]

A pure node has zero entropy.

## 6.4 Entropy of an evenly mixed binary node

For 5 Pass and 5 Fail:

\[
H(S)=-[0.5\log_2(0.5)+0.5\log_2(0.5)]
\]

\[
H(S)=1
\]

For binary classification, entropy reaches its maximum of 1 bit when both classes are equally likely.

## 6.5 Gini vs Entropy

| Property | Gini impurity | Entropy |
|---|---|---|
| Formula | \(1-\sum p_i^2\) | \(-\sum p_i\log_2p_i\) |
| Measures | Impurity | Uncertainty |
| Pure node | 0 | 0 |
| Maximum for binary classes | 0.5 | 1 |
| Computation | Usually simpler | Uses logarithms |
| Typical scikit-learn criterion | `gini` | `entropy` or `log_loss` |

Both are used to evaluate classification splits. They often produce similar trees, but can rank candidate splits differently.

Do not compare their raw numerical values directly: they use different scales.

---

# 7. Information Gain

## 7.1 Core idea

Information Gain measures how much entropy decreases after a split.

A useful split creates child nodes with lower weighted uncertainty than the parent.

\[
IG=H(Parent)-H(Children)
\]

More precisely:

\[
IG=H(S)-\sum_{j=1}^{m}\frac{|S_j|}{|S|}H(S_j)
\]

Where:
- \(S\) is the parent dataset.
- \(S_j\) is child node \(j\).
- \(|S_j|/|S|\) is the fraction of parent samples sent to child \(j\).
- \(m\) is the number of child nodes.

The child entropies must be weighted by the number of samples in each child.

## 7.2 Worked example

A parent node contains 10 students:
- 6 Pass
- 4 Fail

Parent entropy:

\[
H(Parent)\approx 0.971
\]

A candidate split creates:

**Left child**
- 5 Pass
- 0 Fail
- 5 samples
- Entropy = 0

**Right child**
- 1 Pass
- 4 Fail
- 5 samples

\[
H(Right)=-[0.2\log_2(0.2)+0.8\log_2(0.8)]
\]

\[
H(Right)\approx 0.722
\]

Weighted child entropy:

\[
H(Children)=\frac{5}{10}(0)+\frac{5}{10}(0.722)
\]

\[
H(Children)=0.361
\]

Information gain:

\[
IG=0.971-0.361
\]

\[
\boxed{IG\approx 0.610}
\]

The split reduces entropy by approximately 0.610 bits.

## 7.3 Selecting the best split

1. Generate candidate feature/threshold splits.
2. Calculate the weighted child impurity for each split.
3. Calculate impurity reduction.
4. Choose the split with the greatest reduction.
5. Repeat at the child nodes.

When using Gini, the tree typically chooses the split with the greatest Gini impurity reduction. When using entropy, it chooses the split with the greatest information gain.

---

# 8. Build a Decision Tree on Paper

Consider this tiny dataset:

| Student | Study hours | Attendance | Result |
|---|---:|---:|---|
| A | 1 | 50% | Fail |
| B | 2 | 60% | Fail |
| C | 2 | 80% | Pass |
| D | 3 | 70% | Pass |
| E | 4 | 85% | Pass |
| F | 5 | 90% | Pass |

There are:
- 4 Pass
- 2 Fail

## 8.1 Parent entropy

\[
H(Parent)=-[\frac{4}{6}\log_2\frac{4}{6}+
\frac{2}{6}\log_2\frac{2}{6}]
\]

\[
H(Parent)\approx 0.918
\]

## 8.2 Candidate split: Study hours greater than 2

For this paper exercise, split the data into:
- Left: Study hours \(\leq 2\)
- Right: Study hours \(>2\)

Left child:
- A: Fail
- B: Fail
- C: Pass
- 2 Fail, 1 Pass

\[
H(Left)\approx 0.918
\]

Right child:
- D: Pass
- E: Pass
- F: Pass
- 3 Pass, 0 Fail

\[
H(Right)=0
\]

Weighted entropy:

\[
H(Children)=\frac{3}{6}(0.918)+\frac{3}{6}(0)
\]

\[
H(Children)=0.459
\]

Information gain:

\[
IG=0.918-0.459=\boxed{0.459}
\]

This is a useful split because the right child is pure.

## 8.3 Continue splitting the left child

The left child has:
- 2 Fail
- 1 Pass

A possible next question is:

**Is attendance greater than 70%?**

- Attendance \(\leq 70\%\): A and B → both Fail.
- Attendance \(>70\%\): C → Pass.

Both children are pure.

The resulting tree is:

```text
                 Study hours > 2?
                  /           \
                No             Yes
                /                \
       Attendance > 70?          Pass
          /       \
        No         Yes
       Fail        Pass
```

This tiny example demonstrates how recursive splitting can produce a sequence of understandable rules.

Note: This is a hand-worked teaching example. A real decision-tree implementation considers its available candidate thresholds and stopping settings.

---

# 9. How Numerical Features Are Split

For a numerical feature, a decision tree commonly tests thresholds between sorted distinct training values.

Example: Study hours

\[
[1,2,2,3,4,5]
\]

Possible threshold candidates may be based on midpoints between distinct adjacent values:

\[
1.5,\;2.5,\;3.5,\;4.5
\]

For a threshold \(t\), the split is typically:

- Left: \(x\leq t\)
- Right: \(x>t\)

The algorithm evaluates candidate thresholds and chooses one that gives the best impurity reduction.

For categorical features, the split representation depends on the algorithm and implementation. scikit-learn's standard DecisionTreeClassifier uses numerical input features; categorical values generally need appropriate encoding.

---

# 10. Stopping Criteria and Tree Complexity

A tree should not keep splitting indefinitely.

Common controls include:

| Parameter | Purpose |
|---|---|
| `max_depth` | Maximum depth of the tree |
| `min_samples_split` | Minimum samples required to split an internal node |
| `min_samples_leaf` | Minimum samples required in a leaf |
| `max_leaf_nodes` | Maximum number of leaf nodes |
| `min_impurity_decrease` | Minimum impurity reduction required for a split |
| `ccp_alpha` | Complexity parameter for cost-complexity pruning |

## 10.1 Why can a deep tree overfit?

A very deep tree may create rules that fit individual training examples, including noise.

Symptoms:
- Very high training performance.
- Much lower validation/test performance.
- Many narrow, highly specific leaves.

## 10.2 Underfitting

A tree that is too shallow may not capture important patterns.

Symptoms:
- Low training performance.
- Low validation performance.
- Too few splits to represent the relationships.

## 10.3 Pre-pruning

Stop the tree from growing too much by setting constraints such as:
- `max_depth`
- `min_samples_split`
- `min_samples_leaf`

## 10.4 Post-pruning

Grow a tree and then remove branches that do not provide enough benefit.

scikit-learn supports cost-complexity pruning through `ccp_alpha`.

Use cross-validation to select complexity settings. Do not select them based on the final test set.

---

# 11. Regression Trees

Decision trees can predict continuous numerical values as well as classes.

A **Regression Tree**:
- Splits data using feature thresholds.
- Groups similar target values into leaves.
- Predicts a numerical value in each leaf, commonly the mean of training targets in that leaf for squared-error criteria.

## 11.1 How does a regression split work?

Instead of classification impurity, a regression tree can use criteria based on squared error or absolute error.

For a leaf with target values \(y_1,\ldots,y_n\), the mean prediction is:

\[
\hat{y}=\frac{1}{n}\sum_{i=1}^{n}y_i
\]

The squared-error objective measures how far target values are from their leaf prediction:

\[
SSE=\sum_{i=1}^{n}(y_i-\hat{y})^2
\]

A candidate split is evaluated by the reduction in the weighted prediction error of its child nodes.

## 11.2 Classification vs Regression Trees

| Aspect | Classification Tree | Regression Tree |
|---|---|---|
| Target | Category/class | Continuous number |
| Prediction | Class or class probabilities | Numerical value |
| Common criterion | Gini, entropy, log loss | Squared error, absolute error |
| Split objective | Reduce class impurity | Reduce target prediction error |
| Example | Spam / not spam | House price |

---

# 12. Decision Trees with scikit-learn

## 12.1 Classification tree

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report

X, y = load_breast_cancer(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

tree_model = DecisionTreeClassifier(
    criterion="gini",
    max_depth=4,
    min_samples_leaf=3,
    random_state=42
)

tree_model.fit(X_train, y_train)

predictions = tree_model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))
```

The depth and leaf settings are illustrative starting values, not guaranteed optimal values.

## 12.2 Visualize the tree

```python
import matplotlib.pyplot as plt
from sklearn.tree import plot_tree

plt.figure(figsize=(20, 10))

plot_tree(
    tree_model,
    feature_names=load_breast_cancer().feature_names,
    class_names=load_breast_cancer().target_names,
    filled=True,
    rounded=True,
    proportion=True,
    fontsize=8
)

plt.show()
```

The visualization displays:
- The feature and threshold used at each split.
- The impurity value.
- The number or proportion of samples.
- The predicted class at a node.

## 12.3 Compare Gini and entropy

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import f1_score

for criterion in ["gini", "entropy", "log_loss"]:
    model = DecisionTreeClassifier(
        criterion=criterion,
        max_depth=4,
        random_state=42
    )

    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    print(
        criterion,
        "F1:",
        f1_score(y_test, predictions)
    )
```

For a fair comparison, keep the split and other hyperparameters identical. This is a demonstration, not a full hyperparameter search.

## 12.4 Regression tree

```python
from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

X, y = fetch_california_housing(return_X_y=True)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

regressor = DecisionTreeRegressor(
    max_depth=5,
    min_samples_leaf=5,
    random_state=42
)

regressor.fit(X_train, y_train)
predictions = regressor.predict(X_test)

print("MAE:", mean_absolute_error(y_test, predictions))
print("RMSE:", np.sqrt(mean_squared_error(y_test, predictions)))
print("R²:", r2_score(y_test, predictions))
```

The California Housing dataset may download the first time it is used.

---

# 13. Feature Importance and Interpretability

Decision trees can provide impurity-based feature importance.

A feature's importance is based on the total weighted impurity reduction attributed to splits using that feature, normalized across the tree.

```python
import pandas as pd

importance = pd.Series(
    tree_model.feature_importances_,
    index=load_breast_cancer().feature_names
).sort_values(ascending=False)

print(importance.head(10))
```

Important cautions:
- Impurity-based importance can favour features with many possible split points.
- Correlated features can share or distort importance.
- Importance does not prove causation.
- Use permutation importance or other validation-based methods when a more reliable comparison is needed.

---

# 14. Common Mistakes

1. Confusing Gini impurity with information gain.
2. Forgetting to weight child impurity by child sample count.
3. Assuming the split with the purest single child is always best.
4. Treating entropy and Gini values as directly comparable.
5. Assuming every decision tree uses entropy.
6. Allowing a tree to grow too deep without validation.
7. Tuning hyperparameters on the test set.
8. Assuming decision trees require standardization.
9. Treating feature importance as causal evidence.
10. Assuming a greedy tree finds the globally optimal tree.
11. Encoding categorical features as arbitrary integers without considering their meaning.
12. Assuming regression trees use Gini or entropy.

---

# 15. Placement and Interview Questions

### Q1. What is a decision tree?

**Answer:** A supervised learning algorithm that recursively splits data using feature-based rules to make classification or regression predictions.

### Q2. What is a root node?

**Answer:** The first node containing the complete training dataset before any split.

### Q3. What is a leaf node?

**Answer:** A terminal node that stores the final prediction for samples reaching it.

### Q4. What is Gini impurity?

**Answer:** A measure of class impurity calculated as \(1-\sum p_i^2\). It is zero for a pure node.

### Q5. What is entropy?

**Answer:** A measure of uncertainty in a class distribution, calculated as \(-\sum p_i\log_2p_i\).

### Q6. What is information gain?

**Answer:** The reduction in entropy achieved by a split, calculated as parent entropy minus weighted child entropy.

### Q7. Why must child impurity be weighted?

**Answer:** Because children may contain different numbers of samples. A child containing 90% of the data should contribute more to the overall post-split impurity than a child containing 10%.

### Q8. What is the difference between Gini and entropy?

**Answer:** Both measure class impurity but use different mathematical formulas and scales. They often produce similar splits, though not always identical ones.

### Q9. Why do decision trees overfit?

**Answer:** Deep trees can create highly specific rules that memorize noise and individual training examples rather than learning patterns that generalize.

### Q10. How can you control overfitting?

**Answer:** Limit depth, increase minimum samples per split or leaf, limit leaf nodes, or use cost-complexity pruning. Select settings through cross-validation.

### Q11. Do decision trees need feature scaling?

**Answer:** Usually not. Standard tree splits depend on feature ordering and thresholds, so changing a feature's scale generally does not change the possible partitions.

### Q12. Can decision trees handle nonlinear relationships?

**Answer:** Yes. Repeated feature-based splits can create nonlinear, piecewise decision boundaries.

### Q13. What is the difference between a classification tree and regression tree?

**Answer:** A classification tree predicts categories using class impurity criteria; a regression tree predicts numerical values using criteria such as squared error.

### Q14. What is pruning?

**Answer:** Removing branches that add complexity without enough predictive benefit, helping reduce overfitting.

### Q15. Are decision trees stable?

**Answer:** Individual trees can be sensitive to small changes in data. Ensemble methods such as Random Forests reduce variance by combining multiple trees.

---

# 16. Coding and Paper Practice

## Exercise 1 — Calculate Gini

A node contains:
- 8 Yes
- 2 No

Calculate its Gini impurity.

## Exercise 2 — Calculate entropy

A node contains:
- 3 Pass
- 3 Fail

Calculate entropy in bits.

## Exercise 3 — Information gain

A parent contains 10 examples:
- 6 Positive
- 4 Negative

A split produces:
- Left: 4 Positive, 1 Negative.
- Right: 2 Positive, 3 Negative.

Calculate:
1. Parent entropy.
2. Left entropy.
3. Right entropy.
4. Weighted child entropy.
5. Information gain.

## Exercise 4 — Build a tree by hand

Use the six-student dataset from Section 8:
- Identify a candidate root split.
- Calculate its weighted entropy.
- Calculate information gain.
- Draw the next split.
- Label all leaf predictions.

## Exercise 5 — Compare criteria

Train one classifier using Gini and another using entropy. Compare:
- Tree depth.
- Number of leaves.
- Training score.
- Validation score.
- Test score.

## Exercise 6 — Control overfitting

Train trees with:
- No depth limit.
- `max_depth=3`.
- `max_depth=5`.
- Different `min_samples_leaf` values.

Compare training and validation performance.

## Exercise 7 — Regression tree

Fit a DecisionTreeRegressor and compare MAE, RMSE, and R² for different maximum depths.

---

# 17. Quick Revision Sheet

| Concept | Key point |
|---|---|
| Decision Tree | Recursive feature-based splitting |
| Root | First node |
| Internal node | Decision/test |
| Branch | Split outcome |
| Leaf | Final prediction |
| Pure node | All samples belong to one class |
| Gini | \(1-\sum p_i^2\) |
| Entropy | \(-\sum p_i\log_2p_i\) |
| Information Gain | Parent entropy − weighted child entropy |
| Weighted impurity | Accounts for child sample counts |
| Greedy splitting | Best current split, not guaranteed global optimum |
| `max_depth` | Limits tree depth |
| `min_samples_leaf` | Requires a minimum number of samples per leaf |
| Pruning | Removes unnecessary branches |
| Classification tree | Predicts a class |
| Regression tree | Predicts a number |
| Feature importance | Based on impurity reduction; not causation |

---

# 18. Final Checklist

- [ ] I can explain how a decision tree makes a prediction.
- [ ] I can identify root, internal, branch, and leaf nodes.
- [ ] I can calculate Gini impurity.
- [ ] I can calculate entropy.
- [ ] I can calculate weighted child entropy.
- [ ] I can calculate information gain.
- [ ] I can choose a split by comparing impurity reduction.
- [ ] I can build a tiny decision tree on paper.
- [ ] I understand numerical threshold splits.
- [ ] I understand overfitting, underfitting, and pruning.
- [ ] I can distinguish classification and regression trees.
- [ ] I can train and visualize a tree with scikit-learn.
- [ ] I can explain why feature scaling is usually unnecessary.
- [ ] I can evaluate tree performance without test-set leakage.

---

# 19. Recommended Resources

1. [StatQuest: Decision Trees](https://www.youtube.com/watch?v=_L39rN6gz7Y)
   - Clear visual explanation of how classification trees make splits.

2. [StatQuest: Regression Trees](https://www.youtube.com/watch?v=g9c66TUylZ4)
   - Understand how trees predict continuous numerical targets.

3. [Krish Naik: Decision Tree](https://www.youtube.com/watch?v=PHxYNGo8NcI)
   - Additional practical explanation and implementation.

4. [scikit-learn: Decision Trees Documentation](https://scikit-learn.org/stable/modules/tree.html)
   - Official guide to classification trees, regression trees, criteria, and practical limitations.

**Study strategy:** First calculate Gini, entropy, and information gain by hand for a tiny dataset. Then train a scikit-learn tree and inspect its actual splits. This connects the mathematics to the implementation.

---

**End of Day 9 — Decision Trees**

**Next:** Random Forests + Bagging — learn how combining multiple trees can reduce variance and improve generalization.
