# Day 17 — PCA & Dimensionality Reduction

## 1. Overview

**Dimensionality reduction** transforms data into a lower-dimensional representation while trying to preserve useful structure.

This lecture focuses on:
- Principal Component Analysis (PCA)
- Centering, covariance, eigenvectors, and eigenvalues
- Explained variance and component selection
- When PCA can help or hurt
- t-SNE and UMAP as visualisation techniques

## 2. Why Reduce Dimensions?

High-dimensional data can create practical problems:
- More computation and memory
- Redundant or correlated features
- Difficulty visualising data
- Noise that may interfere with downstream models
- More complex models and overfitting risk in some settings

Potential benefits:
- Compress features into fewer components.
- Reduce redundancy.
- Make exploratory visualisations easier.
- Speed up some downstream workflows.

Dimensionality reduction is not automatically beneficial. It can remove predictive information and make features harder to interpret.

## 3. Feature Selection vs Feature Extraction

| Feature selection | Feature extraction |
|---|---|
| Selects a subset of original columns | Creates new transformed features |
| Original feature meaning is retained | New features may combine many original features |
| Examples: SelectKBest, RFE | Examples: PCA, some embeddings |

PCA is a feature-extraction method, not a method that simply chooses the most important original columns.

## 4. PCA Intuition

PCA finds orthogonal directions in feature space along which the data varies the most.

- First principal component: direction of maximum variance.
- Second component: direction of maximum remaining variance, constrained to be orthogonal to the first.
- Further components follow the same principle.

The data is projected onto the selected directions to create fewer features.

```text
Original features (many dimensions)
              |
        Center the data
              |
      Find principal directions
              |
        Rank by variance
              |
       Keep top components
              |
   Project data to smaller space
```

## 5. Centering and Scaling

### Centering

PCA is based on variation around feature means. Center each feature:

\[
X_c=X-\mu
\]

where \(\mu\) is the vector of training-set feature means.

### Scaling

scikit-learn PCA centers input features but does not automatically scale each feature to unit variance.

If features have different units or ranges, a high-variance feature can dominate the principal components. Standardisation is commonly appropriate when feature scales are not comparable.

However, scaling is a modelling decision. If absolute variance differences are meaningful, blindly standardising can remove useful information.

Fit centering and scaling on training data only in a predictive workflow.

## 6. Covariance Matrix, Eigenvectors, and Eigenvalues

For a centered data matrix \(X_c\) with \(n\) rows, the sample covariance matrix is:

\[
\Sigma=\frac{1}{n-1}X_c^TX_c
\]

An eigenvector \(v\) and eigenvalue \(\lambda\) satisfy:

\[
\Sigma v=\lambda v
\]

Interpretation:
- Eigenvectors give principal directions.
- Eigenvalues measure variance along those directions.
- Larger eigenvalues correspond to directions explaining more variance.

In practice, PCA is often computed using Singular Value Decomposition (SVD), which is numerically useful and avoids requiring a manual eigen-decomposition of the covariance matrix.

## 7. Principal Components and Projection

Let \(V_k\) contain the top \(k\) principal directions as columns.

The lower-dimensional representation is:

\[
Z=X_cV_k
\]

If scaling is used, \(X_c\) here represents the centered and scaled training representation.

The transformed components are linear combinations of original features. A component can combine many columns, so component interpretation may require inspecting its loadings.

## 8. Explained Variance Ratio

The explained variance ratio for component \(j\) is:

\[
r_j=\frac{\lambda_j}{\sum_{i=1}^{p}\lambda_i}
\]

Cumulative explained variance for the first \(k\) components:

\[
R_k=\sum_{j=1}^{k}r_j
\]

Example:
- PC1 explains 50%.
- PC2 explains 25%.
- PC3 explains 15%.

The first two components explain 75% of the variance.

A cumulative threshold such as 90% or 95% can be a starting point, not a universal rule. The right number depends on the downstream task and validation performance.

## 9. Scree Plot and Component Selection

A scree plot displays the explained variance per component or eigenvalue by component index.

Look for:
- A sharp drop followed by a flatter region.
- Cumulative explained variance.
- Downstream model performance at different component counts.
- Stability and interpretability of the retained representation.

Do not select components only by an arbitrary threshold if prediction is the goal. Evaluate the complete pipeline on validation data.

## 10. PCA with scikit-learn

### Exploratory PCA

```python
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

X_scaled = StandardScaler().fit_transform(X)

pca = PCA(n_components=0.95, random_state=42)
X_reduced = pca.fit_transform(X_scaled)

print("Components:", pca.n_components_)
print("Explained variance:", pca.explained_variance_ratio_)
print("Cumulative:", pca.explained_variance_ratio_.sum())
```

This is an exploratory transformation fitted to the supplied dataset. For model evaluation, do not fit the scaler or PCA before splitting.

### Leakage-safe predictive pipeline

```python
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression

model = make_pipeline(
    StandardScaler(),
    PCA(n_components=0.95),
    LogisticRegression(max_iter=2000)
)

model.fit(X_train, y_train)
print("Test score:", model.score(X_test, y_test))
```

The pipeline fits scaling and PCA on each training fold during cross-validation and applies the learned transformation to held-out data.

## 11. When PCA Can Hurt More Than Help

PCA may hurt when:
- Low-variance directions contain important target information.
- The downstream model already handles correlated or high-dimensional data well.
- Interpretability of original variables is essential.
- The relationship is strongly nonlinear and a linear projection is inadequate.
- A small dataset makes the estimated principal directions unstable.
- Scaling choices distort meaningful domain variance.
- Components are fitted using validation or test data.

PCA preserves directions of high **unlabelled variance**, not necessarily directions that best predict the target.

## 12. t-SNE for Visualisation

t-SNE is a nonlinear dimensionality-reduction method often used to visualise high-dimensional data in two or three dimensions.

High-level idea:
- Model similarities between points in the original space.
- Model similarities in a low-dimensional representation.
- Optimise the low-dimensional representation to preserve local neighbourhood relationships.

Important cautions:
- Mainly useful for visualisation and local-neighbourhood exploration.
- Global distances between separated visual clusters can be misleading.
- Results depend on hyperparameters, random initialisation, and data preprocessing.
- Different runs can produce different-looking maps.
- Do not treat a 2D t-SNE plot as proof of true discrete clusters.

## 13. UMAP for Visualisation

UMAP is another nonlinear manifold-learning technique used for dimensionality reduction and visualisation.

Common controls include:
- `n_neighbors`: local vs broader neighbourhood structure.
- `min_dist`: how tightly points can be packed in the low-dimensional space.
- `n_components`: output dimensions.

UMAP can be useful for exploring local structure and is often efficient, but visual separation is still not proof of cluster validity. Interpret results with domain knowledge and quantitative checks.

## 14. PCA vs t-SNE vs UMAP

| Method | Main character | Typical use | Important caution |
|---|---|---|---|
| PCA | Linear, variance-maximising, orthogonal components | Compression and preprocessing | May discard low-variance predictive information |
| t-SNE | Nonlinear, local-neighbourhood visualisation | 2D/3D exploratory plots | Global distances and cluster sizes can mislead |
| UMAP | Nonlinear manifold representation | Visualisation and some embedding workflows | Structure depends on parameters and data |

For many predictive workflows, PCA can be placed inside a model pipeline. t-SNE and UMAP are more commonly used for exploration or specialised representation workflows; do not assume their plotted coordinates are suitable predictive features without validation.

## 15. Common Mistakes

- Saying PCA selects the most important original features.
- Forgetting that PCA centers but does not automatically scale features.
- Fitting PCA before the train/test split.
- Choosing components only from explained variance without checking predictive performance.
- Assuming high variance means high predictive value.
- Treating eigenvectors as individual feature rankings.
- Interpreting t-SNE global distances as reliable.
- Comparing t-SNE plots from different runs as if axes were aligned.
- Treating visual groups as proof of meaningful clusters.

## 16. Placement and Interview Questions

**Q1. What is PCA?**  
A linear dimensionality-reduction method that projects data onto orthogonal directions of maximum variance.

**Q2. What are principal components?**  
Orthogonal directions in feature space; each component is a linear combination of original features.

**Q3. What do eigenvectors and eigenvalues represent in PCA?**  
Eigenvectors give principal directions; eigenvalues measure variance along those directions.

**Q4. What is explained variance ratio?**  
The fraction of total variance represented by a component.

**Q5. Why scale before PCA?**  
Features with larger units can dominate variance and therefore dominate components.

**Q6. Is PCA supervised?**  
Standard PCA is unsupervised; it does not use target labels when selecting components.

**Q7. Why can PCA reduce accuracy?**  
It can discard low-variance directions that contain useful target information.

**Q8. PCA vs feature selection?**  
Feature selection retains original columns; PCA creates new linear combinations.

**Q9. Why use t-SNE or UMAP?**  
They help explore local structure in high-dimensional data in a low-dimensional visualisation.

## 17. Practice

### Paper exercise

Suppose the eigenvalues of a covariance matrix are:

`[6, 3, 1]`

1. Calculate the total variance.
2. Calculate the explained variance ratio for each component.
3. Calculate cumulative variance after the first two components.
4. How many components are needed to retain at least 85% of variance?

### Coding exercise

Use a dataset with several numeric features:
- Build a StandardScaler + PCA pipeline.
- Plot explained variance and cumulative variance.
- Compare model performance with and without PCA.
- Try different component counts.
- Record training time and interpretability trade-offs.
- Create a 2D t-SNE or UMAP plot for exploratory analysis and clearly label it as a visualisation.

## 18. Quick Revision

- **Dimensionality reduction:** represent data with fewer dimensions.
- **Feature selection:** keep original columns.
- **PCA:** creates orthogonal linear combinations.
- **Centering:** subtract feature means.
- **Eigenvector:** principal direction.
- **Eigenvalue:** variance along that direction.
- **Explained variance ratio:** fraction of variance captured.
- **SVD:** common computational route for PCA.
- **t-SNE/UMAP:** nonlinear visualisation methods.
- **Main warning:** preserving variance or local neighbourhoods is not the same as preserving target-predictive information.

## 19. Final Checklist

- [ ] Explain feature selection vs feature extraction.
- [ ] Explain PCA centering and the role of scaling.
- [ ] Define covariance, eigenvectors, and eigenvalues.
- [ ] Explain principal component projection.
- [ ] Calculate explained and cumulative variance.
- [ ] Explain why PCA can hurt model performance.
- [ ] Distinguish PCA, t-SNE, and UMAP.
- [ ] Fit PCA inside a leakage-safe pipeline.

## 20. Recommended Resources

- [StatQuest: PCA Step-by-Step](https://www.youtube.com/watch?v=FgakZw6K1QQ)
- [StatQuest: t-SNE](https://www.youtube.com/watch?v=NEaUSP4YerM)
- [scikit-learn: Decomposing signals / PCA](https://scikit-learn.org/stable/modules/decomposition.html)
- [scikit-learn: PCA API](https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html)
