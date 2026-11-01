# Days 14–16 — Bias, Variance & Decision Trees

## 1. Overview

This block connects generalisation theory with decision-tree models.

You will learn:
- Bias and variance.
- The bias–variance trade-off.
- Underfitting and overfitting patterns.
- Decision-tree structure and split selection.
- Gini impurity, entropy, and information gain.
- Regression-tree split criteria.
- Tree complexity controls.

## 2. Bias and Variance

**Bias** is systematic error from assumptions that are too restrictive. A high-bias model may fail to capture important patterns.

**Variance** is sensitivity to the specific training sample. A high-variance model can change substantially when trained on a different sample.

A simplified squared-error decomposition is:

\[
Expected\ Error=Bias^2+Variance+Irreducible\ Noise
\]

This decomposition applies under particular statistical assumptions; it is an intuition for why model complexity and data variability affect generalisation.

## 3. Bias–Variance Trade-Off

Increasing model flexibility can:
- Reduce bias by fitting more complex patterns.
- Increase variance by making the model more sensitive to individual training samples.

Reducing model flexibility can:
- Improve stability.
- Increase systematic error if important patterns cannot be represented.

The objective is not to minimise one term in isolation. It is to achieve good performance on representative unseen data.

## 4. Underfitting vs Overfitting

| Pattern | Training error | Validation error | Likely issue |
|---|---:|---:|---|
| Both high | High | High | Underfitting / high bias |
| Train low, validation much higher | Low | High | Overfitting / high variance |
| Both low and close | Low | Low | Potentially good generalisation |
| Both implausibly perfect | Very low | Very low | Investigate leakage or split quality |

### Remedies

Underfitting:
- Increase useful model complexity.
- Add informative features.
- Reduce excessive regularisation.
- Improve optimisation.

Overfitting:
- Limit complexity.
- Increase training data.
- Add appropriate regularisation.
- Use early stopping or pruning.
- Improve validation design.

## 5. Decision Tree Basics

A decision tree makes predictions by applying a sequence of feature-based tests.

Components:
- Root node: first decision.
- Internal node: condition/split.
- Branch: outcome of a condition.
- Leaf: prediction.

```text
              Study hours > 3?
                /        \
              No          Yes
             /              \
        Attendance > 75?    Pass
           /      \
         No        Yes
        Fail       Pass
```

The model learns split conditions from training data.

## 6. How a Classification Tree Learns

At each node:
1. Consider candidate features and split thresholds/categories.
2. Divide examples into child groups.
3. Calculate impurity of each child.
4. Calculate weighted impurity after the split.
5. Choose a split that reduces impurity most.
6. Repeat recursively until a stopping condition is met.

A pure node contains examples from one class. An impure node contains a mixture of classes.

## 7. Gini Impurity

For a node with class proportions \(p_1,\ldots,p_K\):

\[
Gini=1-\sum_{k=1}^{K}p_k^2
\]

- Pure node: Gini = 0.
- Binary 50/50 node: Gini = 0.5.
- Higher values indicate more class mixture.

A split is evaluated using weighted child impurity:

\[
Gini_{split}=\sum_j\frac{N_j}{N}Gini_j
\]

Gini reduction is parent impurity minus weighted child impurity.

## 8. Entropy

Entropy measures class uncertainty:

\[
H=-\sum_{k=1}^{K}p_k\log_2p_k
\]

- Pure node: entropy 0.
- Binary 50/50 node: entropy 1 bit.
- Greater class diversity generally means higher entropy.

Entropy is another common classification-tree impurity measure.

## 9. Information Gain

Information Gain measures entropy reduction from a split:

\[
IG=H(parent)-\sum_j\frac{N_j}{N}H(child_j)
\]

The tree prefers splits that reduce uncertainty.

### Worked example

A parent node has 10 samples: 5 positive and 5 negative.

\[
H(parent)=1
\]

Suppose a split creates:
- Left: 4 positive, 1 negative.
- Right: 1 positive, 4 negative.

Each child has entropy approximately 0.722.

Weighted child entropy is also approximately 0.722 because each child has five samples.

\[
IG\approx1-0.722=0.278
\]

This split reduces entropy by about 0.278 bits.

## 10. Gini vs Entropy

| Property | Gini impurity | Entropy |
|---|---|---|
| Formula | \(1-\sum p_k^2\) | \(-\sum p_k\log_2p_k\) |
| Pure node | 0 | 0 |
| Maximum for K classes | \(1-1/K\) | \(\log_2 K\) |
| Computation | Often slightly simpler | Uses logarithms |
| Practical outcome | Often similar splits | Often similar splits |

Neither criterion is universally superior. Validate the final model.

## 11. Numerical Features and Thresholds

For a numerical feature, a tree considers candidate thresholds between sorted feature values.

Example values:

`[1.0, 2.0, 3.0, 5.0]`

Candidate thresholds may be between adjacent values:
- 1.5
- 2.5
- 4.0

Each threshold divides examples into left and right child nodes. The criterion selects the best split subject to constraints.

## 12. Regression Trees

Regression trees predict continuous values.

A leaf commonly predicts the mean target value of training examples in that leaf.

A common split objective minimises total squared error within children:

\[
SSE=\sum_j\sum_{i\in C_j}(y_i-\bar y_{C_j})^2
\]

The algorithm chooses splits that reduce weighted within-node variance / squared error.

Regression trees create piecewise-constant predictions. They generally do not extrapolate smoothly beyond the training target range.

## 13. Controlling Tree Complexity

Important parameters in scikit-learn:
- `max_depth`: maximum tree depth.
- `min_samples_split`: minimum examples needed to split.
- `min_samples_leaf`: minimum examples in each leaf.
- `max_leaf_nodes`: limit on number of leaves.
- `ccp_alpha`: cost-complexity pruning strength.
- `criterion`: impurity/split objective.

Increasing constraints tends to create simpler trees and can reduce variance, but too much restriction causes underfitting.

## 14. scikit-learn Example

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report

model = DecisionTreeClassifier(
    criterion="gini",
    max_depth=4,
    min_samples_leaf=5,
    random_state=42
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)

print(classification_report(y_test, predictions))
```

For regression:

```python
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error

regressor = DecisionTreeRegressor(
    max_depth=4,
    min_samples_leaf=5,
    random_state=42
)

regressor.fit(X_train, y_train)
predictions = regressor.predict(X_test)
print(mean_absolute_error(y_test, predictions))
```

## 15. Strengths and Limitations

### Strengths
- Easy to visualise and explain when small.
- Handles nonlinear relationships.
- Captures feature interactions.
- Little feature scaling required.
- Supports classification and regression.

### Limitations
- Deep trees can overfit.
- Small data changes can produce different structures.
- Greedy split selection may not find a globally optimal tree.
- A single tree may be less accurate/stable than ensembles.
- Piecewise-constant regression predictions can be rough.

## 16. Common Mistakes

- Confusing entropy with information gain.
- Comparing child impurities without weighting by child size.
- Treating all splits as equally useful.
- Assuming trees require standard scaling.
- Allowing a tree to grow without considering overfitting.
- Interpreting feature importance as causal.
- Assuming regression trees extrapolate linearly.
- Using only training performance to choose depth.

## 17. Placement and Interview Questions

**Q1. What is bias?**  
Systematic error from restrictive assumptions.

**Q2. What is variance?**  
Sensitivity of a fitted model to the training sample.

**Q3. What is a decision tree?**  
A model that recursively partitions examples using feature-based tests and predicts at leaves.

**Q4. What is Gini impurity?**  
A measure of class mixture in a node: \(1-\sum p_k^2\).

**Q5. What is entropy?**  
A measure of class uncertainty: \(-\sum p_k\log_2p_k\).

**Q6. What is information gain?**  
Parent entropy minus weighted child entropy.

**Q7. How does a regression tree choose a split?**  
It selects a feature/threshold that reduces weighted within-child prediction error, commonly squared error.

**Q8. How do you reduce overfitting in a tree?**  
Limit depth, increase minimum leaf size, constrain leaves, prune, or use ensembles.

## 18. Practice

### Paper exercises
1. Calculate Gini impurity for a node with class proportions 0.7 and 0.3.
2. Calculate entropy for the same node.
3. Explain why child impurity must be weighted by child sample count.
4. Calculate information gain for a small binary split.
5. Explain how max_depth and min_samples_leaf affect bias and variance.

### Coding exercise
Compare:
- Decision tree with no depth limit.
- Tree with max depth 3.
- Tree with minimum leaf size 10.
- Pruned tree.

Use the same split and report train/validation/test metrics. Inspect the resulting tree and explain its first two decisions.

## 19. Quick Revision

- Bias: systematic model error.
- Variance: sensitivity to training data.
- Trade-off: complexity vs generalisation.
- Tree: feature tests and leaves.
- Gini: \(1-\sum p_k^2\).
- Entropy: \(-\sum p_k\log p_k\).
- Information gain: parent entropy − weighted child entropy.
- Regression tree: reduce squared error/variance.
- Complexity controls: depth, leaf size, pruning.
- Deep tree: can overfit.

## 20. Final Checklist

- [ ] Explain bias–variance trade-off.
- [ ] Diagnose underfitting and overfitting.
- [ ] Draw a decision tree.
- [ ] Calculate Gini and entropy.
- [ ] Calculate weighted split impurity and information gain.
- [ ] Explain regression-tree split criteria.
- [ ] Tune tree complexity.
- [ ] Compare train and validation performance.

## 21. Recommended Resources

- [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [scikit-learn Model Evaluation](https://scikit-learn.org/stable/modules/model_evaluation.html)
- [scikit-learn Decision Trees](https://scikit-learn.org/stable/modules/tree.html)
- [StatQuest — Decision Trees](https://www.youtube.com/watch?v=_L39rN6gz7Y)
- [StatQuest — Bias and Variance](https://www.youtube.com/watch?v=EuBBz3bI-aA)
