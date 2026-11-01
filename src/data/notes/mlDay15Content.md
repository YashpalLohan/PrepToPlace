# Day 15 — K-Means Clustering

## 1. Overview

**K-Means** is an unsupervised clustering algorithm that partitions observations into \(K\) groups. Each point is assigned to the cluster whose centroid is nearest under the chosen distance metric (standard K-Means uses Euclidean distance).

This lecture covers:
- Centroids and the K-Means optimisation objective
- The assign/update loop
- Choosing K with elbow and silhouette analysis
- Why initialisation matters
- Scaling, limitations, and scikit-learn implementation

## 2. What Is Clustering?

Clustering tries to group observations based on similarity without using known target labels.

Examples:
- Segmenting customers by behaviour
- Grouping similar documents or products
- Finding patterns in sensor measurements
- Exploring structure before building a supervised model

Clustering output is a grouping, not automatically a meaningful business explanation. You must inspect and interpret the clusters.

## 3. Centroid Intuition

A **centroid** is the mean position of the points assigned to a cluster.

For cluster \(C_k\), its centroid is:

\[
\mu_k=\frac{1}{|C_k|}\sum_{x\in C_k}x
\]

K-Means repeatedly assigns points to their closest centroid and recalculates each centroid as the mean of the assigned points.

```text
Start with K centroids
        |
Assign each point to its nearest centroid
        |
Recalculate each centroid as its cluster mean
        |
Repeat assignment and update
        |
Stop when assignments/centroids stabilise
```

## 4. K-Means Objective: Within-Cluster Sum of Squares

K-Means aims to minimise the total squared distance from each point to its assigned centroid:

\[
J=\sum_{k=1}^{K}\sum_{x\in C_k}\|x-\mu_k\|_2^2
\]

This objective is commonly called inertia or within-cluster sum of squares (WCSS).

Important:
- Lower inertia is expected as K increases.
- Inertia alone cannot choose K because it usually decreases as more clusters are added.
- K-Means finds a local solution; initialisation can change the final result.

## 5. The K-Means Algorithm

1. Choose the number of clusters \(K\).
2. Initialise \(K\) centroids.
3. Assign each point to its nearest centroid.
4. Recompute each centroid as the mean of its assigned points.
5. Repeat steps 3–4 until convergence or an iteration limit.

The assignment step and centroid update step each reduce or maintain the K-Means objective for the standard formulation. But the overall algorithm can converge to different local minima depending on initialisation.

## 6. Why Initialisation Matters

Poor starting centroids can lead to:
- Slow convergence
- Empty or unbalanced clusters
- A worse local minimum
- Different results across runs

### Random initialisation

Selects initial centers randomly. Different seeds can produce different outcomes.

### K-Means++

K-Means++ spreads initial centers out probabilistically, reducing the chance that all initial centers are placed close together.

It does not guarantee the globally optimal clustering, but is a strong default initialisation strategy.

In scikit-learn, `init="k-means++"` is commonly used. Use multiple initialisations (`n_init`) to reduce sensitivity to one unlucky start.

## 7. Choosing K: The Elbow Method

Run K-Means for several values of K and plot inertia against K.

- Inertia decreases as K increases.
- Look for a point where the rate of improvement slows noticeably.
- That bend is the “elbow”.

The elbow can be ambiguous or absent. Treat it as a heuristic, not a mathematically guaranteed best K.

## 8. Choosing K: Silhouette Score

Silhouette analysis compares how close a sample is to its own cluster versus the nearest alternative cluster.

For sample \(i\):

\[
s(i)=\frac{b(i)-a(i)}{\max(a(i),b(i))}
\]

Where:
- \(a(i)\): mean distance from the sample to other points in its own cluster.
- \(b(i)\): lowest mean distance from the sample to points in another cluster.

Interpretation:
- Near +1: sample is much closer to its own cluster.
- Around 0: sample lies near a cluster boundary or clusters overlap.
- Near −1: sample may be assigned to the wrong cluster.

The average silhouette score summarises the partition. A high score is not proof that the clusters are useful for the business task. Silhouette can favour compact, convex clusters and may be less suitable for complex density-based shapes.

## 9. Feature Scaling and Distance

K-Means is distance-based. Features with large numeric scales can dominate Euclidean distance.

Example:
- Annual income may range from thousands to millions.
- Age may range from 18 to 80.

Without scaling, income may dominate the distance calculation even if age is meaningful.

Common options:
- StandardScaler: centers features and scales to unit variance.
- MinMaxScaler: maps values into a specified range.
- RobustScaler: uses robust statistics and may help when outliers are present.

Fit the scaler only on training data, or keep it inside a pipeline for a leakage-safe workflow.

## 10. K-Means with scikit-learn

### Fit one model

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

model = make_pipeline(
    StandardScaler(),
    KMeans(
        n_clusters=4,
        init="k-means++",
        n_init=10,
        random_state=42
    )
)

labels = model.fit_predict(X)
```

For exploratory clustering on one dataset, fitting on all available rows can be reasonable because there may be no supervised target. For predictive evaluation or deployment, learn preprocessing and cluster centers from the training portion only, then apply them to future data.

### Compare K values with inertia and silhouette

```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

X_scaled = StandardScaler().fit_transform(X)

results = []

for k in range(2, 11):
    model = KMeans(
        n_clusters=k,
        init="k-means++",
        n_init=10,
        random_state=42
    )
    labels = model.fit_predict(X_scaled)

    results.append({
        "k": k,
        "inertia": model.inertia_,
        "silhouette": silhouette_score(X_scaled, labels)
    })

for row in results:
    print(row)
```

This compact exploration fits the scaler on all rows. If the code is part of a formal train/test evaluation, fit scaling on the training partition and apply it to validation/test data.

## 11. Assumptions and Limitations

K-Means tends to work best when:
- Features are numeric and distances are meaningful.
- Clusters are reasonably compact and roughly spherical/convex in the chosen feature space.
- Cluster sizes and densities are not extremely different.
- Outliers are limited or handled thoughtfully.

Limitations:
- K must be chosen in advance.
- Sensitive to initialisation.
- Sensitive to feature scales and outliers.
- Struggles with nested, elongated, or irregularly shaped clusters.
- Mean centroids are not suitable for arbitrary categorical values.
- A cluster label does not tell you what the cluster means.

## 12. K-Means vs Other Clustering Methods

| Method | Main idea | Useful when |
|---|---|---|
| K-Means | Assign to nearest centroid | Compact numeric clusters and scalable baseline |
| Hierarchical | Build nested clusters | You want a hierarchy or dendrogram |
| DBSCAN | Find dense regions separated by sparse areas | Irregular shapes and noise points |
| Gaussian Mixture Model | Model clusters as probability distributions | Soft/probabilistic membership is useful |

## 13. Common Mistakes

- Choosing K only because inertia is lowest.
- Forgetting to scale distance-based features.
- Running only one initialisation.
- Treating the silhouette score as a universal truth.
- Interpreting cluster IDs as ordered categories.
- Expecting K-Means to handle outliers and arbitrary shapes well.
- Including identifiers that distort distance.
- Evaluating on data that was transformed using statistics from the held-out set.

## 14. Placement and Interview Questions

**Q1. What is K-Means?**  
An unsupervised algorithm that partitions observations into K clusters by iteratively assigning points to nearest centroids and updating centroid means.

**Q2. What does K represent?**  
The number of clusters to create.

**Q3. What does inertia measure?**  
The sum of squared distances from samples to their assigned cluster centers.

**Q4. Why does inertia decrease as K increases?**  
More centroids provide more flexibility to reduce within-cluster distances; therefore inertia alone cannot select K.

**Q5. What is K-Means++?**  
An initialisation strategy that spreads starting centroids probabilistically to improve the starting configuration.

**Q6. What is a silhouette score?**  
A measure comparing within-cluster cohesion with separation from the nearest alternative cluster.

**Q7. Why scale features?**  
Because Euclidean distance can be dominated by high-range features.

**Q8. When would K-Means fail?**  
When clusters are irregular, strongly overlapping, have very different densities, contain severe outliers, or are represented by unsuitable distance features.

## 15. Practice

### Paper exercise

Points on a line are: 1, 2, 3, 10, 11, 12. Assume K = 2 and starting centroids are 2 and 10.

1. Assign each point to its nearest centroid.
2. Calculate the new centroid of each cluster.
3. Repeat the assignment step.
4. Calculate the final within-cluster sum of squares.

### Coding exercise

Run K-Means on a tabular dataset:
- Remove IDs and non-feature columns.
- Scale numeric features.
- Try K from 2 to 10.
- Plot inertia and mean silhouette score.
- Compare results across different random seeds.
- Describe each cluster using original feature summaries.

## 16. Quick Revision

- **Unsupervised learning:** no target labels are supplied.
- **Centroid:** mean position of points in a cluster.
- **K:** number of clusters.
- **Inertia/WCSS:** total squared distance to assigned centroids.
- **K-Means++:** improved centroid initialisation.
- **Elbow:** heuristic using the inertia curve.
- **Silhouette:** compares cohesion and separation.
- **Scaling:** important because K-Means uses distances.
- **Main limitation:** prefers compact, roughly convex clusters and is sensitive to outliers.

## 17. Final Checklist

- [ ] Explain centroid and assignment/update steps.
- [ ] Write the K-Means objective.
- [ ] Explain why inertia alone cannot choose K.
- [ ] Explain K-Means++.
- [ ] Interpret silhouette values.
- [ ] Explain why scaling matters.
- [ ] Identify situations where K-Means is unsuitable.
- [ ] Implement and compare several K values in scikit-learn.

## 18. Recommended Resources

- [StatQuest: K-Means](https://www.youtube.com/watch?v=4b5d3muPQmA)
- [scikit-learn: Clustering guide](https://scikit-learn.org/stable/modules/clustering.html)
- [Krish Naik: K-Means, Hierarchical Clustering, and DBSCAN (Hindi)](https://www.youtube.com/watch?v=Aa4MACKaDC0)
