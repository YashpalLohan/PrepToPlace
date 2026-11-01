# Day 12 — Support Vector Machines (SVM)

## 1. Overview

A **Support Vector Machine (SVM)** is a supervised learning algorithm commonly used for classification and also available for regression.

The central classification idea is to find a decision boundary that separates classes with the **maximum margin**. The closest training examples that define this boundary are called support vectors.

This lecture covers:
- Separating hyperplanes and margins
- Support vectors
- Hard-margin and soft-margin SVM
- The role of \(C\)
- Kernels and the kernel trick
- Feature scaling and practical scikit-learn usage
- When to choose SVM vs tree-based models

## 2. A Linear Decision Boundary

For two features, a linear decision boundary can be written as:

\[
w_1x_1+w_2x_2+b=0
\]

In \(d\) dimensions:

\[
w^Tx+b=0
\]

The model predicts a class based on which side of the hyperplane a point lies.

The signed decision value is:

\[
f(x)=w^Tx+b
\]

For binary labels represented as \(-1\) and \(+1\), prediction is based on the sign of \(f(x)\).

## 3. Margin and Support Vectors

The **margin** is the distance from the decision boundary to the closest training examples on either side.

SVM chooses a boundary that maximises this margin, subject to its constraints.

The closest points are the **support vectors**. They are especially important because they determine the position of the optimal boundary.

```text
Class +                         +     +
       +                + 
-------------------- decision boundary --------------------
       -       -       -
Class -              -

The closest points to the boundary are the support vectors.
The margin is the gap between the two supporting boundaries.
```

A larger margin can improve generalisation, but the model must balance margin size against classification errors when data is not perfectly separable.

## 4. Hard-Margin SVM

Hard-margin SVM assumes the training data is linearly separable and allows no training violations.

For labels \(y_i\in\{-1,+1\}\), the constraints are:

\[
y_i(w^Tx_i+b)\geq 1
\]

The optimisation objective is:

\[
\min_{w,b}\frac{1}{2}\|w\|^2
\]

Minimising the weight norm maximises the geometric margin under these constraints.

### Limitation

Real-world data often contains noise, overlapping classes, and outliers. A hard-margin model may not exist or may be too sensitive to individual observations.

## 5. Soft-Margin SVM and the C Parameter

Soft-margin SVM allows some points to violate the margin or be misclassified. It introduces slack variables \(\xi_i\):

\[
\min_{w,b,\xi}\frac{1}{2}\|w\|^2+C\sum_i\xi_i
\]

subject to:

\[
y_i(w^Tx_i+b)\geq 1-\xi_i,\quad \xi_i\geq0
\]

The parameter \(C\) controls the trade-off between a wide margin and training violations.

- **Large C:** penalises violations more strongly; may create a narrower margin and fit training data more closely.
- **Small C:** allows more violations; favours a wider margin and stronger regularisation.

C is a hyperparameter and should be selected using validation or cross-validation.

## 6. Kernels and Nonlinear Boundaries

A straight line or hyperplane cannot separate every dataset.

A kernel allows SVM to model nonlinear decision boundaries by computing similarity in an implicit higher-dimensional feature space, without explicitly constructing every transformed feature.

This is called the **kernel trick**.

### Common kernels

| Kernel | Intuition | Typical use |
|---|---|---|
| Linear | Straight hyperplane | High-dimensional sparse data or approximately linear separation |
| Polynomial | Models polynomial interactions | Curved boundaries with polynomial structure |
| RBF (Gaussian) | Flexible local similarity | General nonlinear boundaries |
| Sigmoid | Similarity inspired by a neural activation | Less commonly chosen as a default |

### RBF kernel

\[
K(x,z)=\exp(-\gamma\|x-z\|^2)
\]

The parameter \(\gamma\) controls how far the influence of a training example reaches.

- Large \(\gamma\): narrow influence; boundary can become highly complex.
- Small \(\gamma\): broad influence; boundary is smoother.

`C` and `gamma` interact and are commonly tuned together.

## 7. Feature Scaling Is Important

SVM relies on dot products and distances, especially with RBF and polynomial kernels. Features with large numeric ranges can dominate these calculations.

Use scaling inside a pipeline to avoid leakage:

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

model = make_pipeline(
    StandardScaler(),
    SVC(kernel="rbf", C=1.0, gamma="scale")
)

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

Fit the scaler only on training data. A pipeline handles this correctly during cross-validation.

## 8. SVM with scikit-learn

### Linear SVM classifier

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

linear_svm = make_pipeline(
    StandardScaler(),
    SVC(kernel="linear", C=1.0)
)

linear_svm.fit(X_train, y_train)
print("Test accuracy:", linear_svm.score(X_test, y_test))
```

### RBF SVM classifier

```python
rbf_svm = make_pipeline(
    StandardScaler(),
    SVC(kernel="rbf", C=1.0, gamma="scale")
)

rbf_svm.fit(X_train, y_train)
print("Test accuracy:", rbf_svm.score(X_test, y_test))
```

### Support Vector Regression

`SVR` uses a related margin-based idea for regression. Its `epsilon` parameter defines a tube around the prediction function in which errors are not penalised in the same way.

```python
from sklearn.svm import SVR
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

regressor = make_pipeline(
    StandardScaler(),
    SVR(kernel="rbf", C=10, epsilon=0.1)
)

regressor.fit(X_train, y_train)
```

For SVR, scale the target as well when its range makes optimisation difficult; use a target transformer or a careful train-only transformation.

## 9. SVM vs Decision Trees and Random Forests

| Property | SVM | Decision Tree | Random Forest |
|---|---|---|---|
| Main idea | Maximum-margin boundary | Recursive feature splits | Aggregate many trees |
| Nonlinear patterns | Via kernels | Naturally | Naturally |
| Feature scaling | Usually important | Usually unnecessary | Usually unnecessary |
| Interpretability | Limited for nonlinear kernels | Relatively high | Lower |
| Large datasets | Kernel SVM can be expensive | Often practical | Often practical but resource-dependent |
| Feature importance | Not the same built-in tree importance | Split-based measures | Aggregated tree measures |
| Good starting point | Scaled, moderate-sized data | Interpretable baseline | Strong tabular baseline |

### When to consider SVM
- Dataset is small or medium-sized.
- Features are scaled and informative.
- A maximum-margin classifier is appropriate.
- High-dimensional feature spaces are involved.
- A linear SVM is useful for sparse text features.

### When to consider trees
- Mixed feature scales or many nonlinear interactions.
- Missing values and tabular workflows where the chosen implementation handles them conveniently.
- Interpretability through individual rules is important.
- Large tabular datasets make kernel SVM impractical.

Always compare with validation results rather than choosing by algorithm reputation.

## 10. Multiclass Classification

The original SVM formulation is binary. Libraries extend it to multiclass tasks using strategies such as:
- One-vs-rest: one classifier per class against all other classes.
- One-vs-one: one classifier for each pair of classes.

The multiclass strategy depends on the estimator and configuration. Check the scikit-learn documentation for the selected SVM class.

## 11. Strengths and Limitations

### Strengths
- Clear maximum-margin principle.
- Effective in many high-dimensional settings.
- Kernels model nonlinear boundaries.
- Linear SVM can be strong for text classification.
- Depends primarily on support vectors in the fitted solution.

### Limitations
- Requires careful feature scaling.
- Kernel SVM training can be slow and memory-intensive on large datasets.
- `C`, `gamma`, and kernel choice require tuning.
- Nonlinear models are harder to interpret.
- Probabilities are not always directly available by default in every SVM estimator/configuration.

## 12. Common Mistakes

- Confusing margin with the distance between arbitrary points.
- Assuming every SVM uses a nonlinear kernel.
- Forgetting feature scaling.
- Using a very large `C` without checking overfitting.
- Using a very large `gamma` and creating an overly complex boundary.
- Scaling the complete dataset before splitting, causing leakage.
- Assuming support vectors are simply all correctly classified points.
- Comparing models with different splits or metrics.

## 13. Placement and Interview Questions

**Q1. What is an SVM?**  
A supervised algorithm that finds a decision boundary with a maximum margin; it can use kernels for nonlinear decision boundaries.

**Q2. What are support vectors?**  
Training examples closest to the separating boundary that determine the maximum-margin solution.

**Q3. What is the margin?**  
The distance from the decision boundary to the closest examples on either side.

**Q4. What is the role of C?**  
It controls the penalty for margin violations. Larger C penalises violations more; smaller C allows more violations.

**Q5. What is the kernel trick?**  
A way to compute inner products in an implicit transformed feature space using a kernel function.

**Q6. What does gamma do in an RBF kernel?**  
It controls the influence range of individual training points. Higher gamma creates more local influence.

**Q7. Why scale features for SVM?**  
Distance and dot-product calculations can be dominated by features with larger numeric ranges.

**Q8. Hard margin vs soft margin?**  
Hard margin allows no training violations and assumes separability. Soft margin permits violations and balances them against margin size.

**Q9. When might a tree be preferred over an SVM?**  
When interpretability, mixed-scale tabular data, or efficient handling of large nonlinear tabular datasets is important.

## 14. Practice

### Paper exercise
A binary linear SVM has:

\[
f(x)=2x_1-x_2-3
\]

For each point, calculate \(f(x)\) and predict the sign-based class:
- A = (2, 1)
- B = (1, 2)
- C = (3, 1)

Then identify which points lie on the decision boundary if any have \(f(x)=0\).

### Concept exercise
Explain what you expect to happen to an RBF SVM boundary when:
1. `gamma` is increased substantially.
2. `C` is reduced.
3. Features are not scaled.

### Coding exercise
Train linear and RBF SVM models and compare them with a Decision Tree and Random Forest using the same split. Use a pipeline for scaling, cross-validation for hyperparameters, and an untouched test set for final evaluation.

## 15. Quick Revision

- **SVM:** supervised maximum-margin method.
- **Hyperplane:** decision boundary \(w^Tx+b=0\).
- **Support vectors:** closest points that determine the boundary.
- **Hard margin:** no violations; assumes separability.
- **Soft margin:** allows violations using slack variables.
- **C:** penalty strength for violations.
- **Kernel trick:** implicit nonlinear feature mapping.
- **RBF gamma:** controls locality of influence.
- **Scaling:** generally essential for SVM.
- **SVM vs trees:** choose based on data, scale, interpretability, and validation.

## 16. Final Checklist

- [ ] Explain hyperplane, margin, and support vectors.
- [ ] Explain hard-margin and soft-margin SVM.
- [ ] Interpret the C parameter.
- [ ] Explain the kernel trick.
- [ ] Compare linear, polynomial, and RBF kernels.
- [ ] Interpret RBF gamma.
- [ ] Build a leakage-safe scaling pipeline.
- [ ] Compare SVM with tree-based models.

## 17. Recommended Resources

- [StatQuest: Support Vector Machines](https://www.youtube.com/watch?v=efR1C6CvhmE)
- [MIT 6.034: Support Vector Machines lecture materials](https://ocw.mit.edu/courses/6-034-artificial-intelligence-fall-2010/)
- [scikit-learn: Support Vector Machines guide](https://scikit-learn.org/stable/modules/svm.html)
- [scikit-learn: SVC API](https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVC.html)
