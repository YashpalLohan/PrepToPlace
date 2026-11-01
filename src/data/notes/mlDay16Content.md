# Day 16 — Hierarchical Clustering + DBSCAN

## 1. Overview

K-Means is useful for compact, centroid-based clusters, but it can struggle when clusters have irregular shapes, different densities, or substantial noise.

This lecture compares:
- **Hierarchical clustering:** builds a hierarchy of nested clusters.
- **DBSCAN:** identifies dense regions and labels isolated points as noise.

The central distinction is that hierarchical clustering builds a tree of merges/splits, while DBSCAN is density-based.

## 2. Why K-Means Can Fail

K-Means:
- Requires K in advance.
- Assigns each point to a centroid.
- Optimises squared distances to centroids.
- Can struggle with non-spherical shapes, varying density, and outliers.

Consider two crescent-shaped groups. A centroid-based partition may cut across the natural shapes, while density-based clustering can follow connected dense regions.

## 3. Hierarchical Clustering

Hierarchical clustering creates a hierarchy of clusters. The result can be visualised using a **dendrogram**.

Two main strategies:

### Agglomerative (bottom-up)

1. Start with every point as its own cluster.
2. Find the two closest clusters.
3. Merge them.
4. Recalculate distances between clusters.
5. Repeat until one cluster remains or a stopping rule is reached.

### Divisive (top-down)

1. Start with all points in one cluster.
2. Split a cluster into smaller groups.
3. Continue recursively.

Agglomerative clustering is more commonly used in introductory implementations.

## 4. Linkage: How Cluster-to-Cluster Distance Is Defined

When clusters contain multiple points, a distance rule is needed.

| Linkage | Distance between two clusters | Common behaviour |
|---|---|---|
| Single | Minimum pairwise distance | Can create chaining/elongated groups |
| Complete | Maximum pairwise distance | Favours compact groups; sensitive to outliers |
| Average | Average pairwise distance | Compromise between single and complete |
| Ward | Increase in within-cluster variance after merging | Often produces compact clusters; typically used with Euclidean geometry |

Different linkage choices can produce different dendrograms and cluster assignments.

## 5. Dendrograms

A dendrogram is a tree diagram showing the sequence and distance at which clusters are merged.

How to read it:
- Leaves at the bottom represent individual observations.
- Horizontal joins represent cluster merges.
- The vertical height represents the merge distance or linkage criterion.
- A horizontal cut through the dendrogram determines a set of clusters.

A large vertical gap between merges may suggest a plausible cut, but it is not a guarantee of a meaningful number of clusters.

## 6. Hierarchical Clustering with Python

### SciPy dendrogram

```python
from scipy.cluster.hierarchy import linkage, dendrogram
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

X_scaled = StandardScaler().fit_transform(X)

Z = linkage(X_scaled, method="ward")

plt.figure(figsize=(12, 5))
dendrogram(Z)
plt.title("Hierarchical Clustering Dendrogram")
plt.xlabel("Sample index")
plt.ylabel("Merge distance")
plt.tight_layout()
plt.show()
```

Ward linkage is appropriate with Euclidean distances. For other linkage methods, choose the distance metric intentionally.

For large datasets, a full dendrogram can become crowded and hierarchical algorithms can be computationally expensive. Consider sampling or a method designed for larger data.

### scikit-learn AgglomerativeClustering

```python
from sklearn.cluster import AgglomerativeClustering
from sklearn.preprocessing import StandardScaler

X_scaled = StandardScaler().fit_transform(X)

model = AgglomerativeClustering(
    n_clusters=4,
    metric="euclidean",
    linkage="ward"
)

labels = model.fit_predict(X_scaled)
```

The `metric`/parameter API has changed in some older scikit-learn versions; consult the documentation for the installed version.

## 7. DBSCAN: Density-Based Clustering

DBSCAN stands for **Density-Based Spatial Clustering of Applications with Noise**.

It groups points that are close enough and surrounded by enough nearby points. Points in sparse regions can be labelled as noise.

DBSCAN does not require the number of clusters in advance.

### Core parameters

- `eps`: neighbourhood radius.
- `min_samples`: minimum number of points in the epsilon-neighbourhood for a point to be considered a core point. The point itself is included in the neighbourhood count in scikit-learn.

## 8. Core, Border, and Noise Points

### Core point
Has at least `min_samples` observations within its `eps` neighbourhood.

### Border point
Is within the neighbourhood of a core point but does not itself have enough neighbours to be a core point.

### Noise point
Is not assigned to a cluster under the density-reachability rules.

Conceptual process:

```text
Choose an unvisited point
        |
Count neighbours within eps
        |
Is count >= min_samples?
        |
   +----+----+
  Yes       No
   |         |
Core point   Mark as provisional noise
   |
Expand cluster through density-reachable neighbours
   |
Continue until cluster cannot expand
```

A provisional noise point may later become a border point if it is reached from a core point.

## 9. DBSCAN with scikit-learn

```python
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler

X_scaled = StandardScaler().fit_transform(X)

model = DBSCAN(
    eps=0.5,
    min_samples=5,
    metric="euclidean"
)

labels = model.fit_predict(X_scaled)

# -1 denotes noise
print("Cluster labels:", set(labels))
print("Noise points:", (labels == -1).sum())
```

The values `eps=0.5` and `min_samples=5` are only starting values for demonstration. They must be chosen for the scale, density, and distance structure of the actual dataset.

Classic scikit-learn DBSCAN does not provide a general `predict` method for assigning arbitrary future points to learned clusters. This matters when designing a production workflow.

## 10. Choosing DBSCAN Parameters

### Choosing `eps`

A common exploratory technique is a k-distance plot:
1. Choose a neighbour count related to `min_samples`.
2. Calculate each point's distance to that neighbour.
3. Sort these distances.
4. Look for a change in slope or a knee.
5. Test plausible epsilon values and inspect cluster quality.

This is a heuristic. It can be difficult when data has multiple density levels.

### Choosing `min_samples`

A larger value generally requires denser support to form core points:
- More points may become noise.
- Small accidental groups are less likely to become clusters.
- Real small clusters may also be removed.

Parameter choice should use domain knowledge, distance scale, visualisation where possible, and sensitivity analysis.

## 11. Hierarchical Clustering vs DBSCAN vs K-Means

| Property | K-Means | Hierarchical | DBSCAN |
|---|---|---|---|
| Requires K first | Yes | Not necessarily; cut the hierarchy later | No |
| Core mechanism | Centroids | Repeated merges/splits | Density connectivity |
| Cluster shapes | Best for compact centroid-like groups | Depends on linkage | Can capture irregular dense shapes |
| Noise handling | Sensitive to outliers | No native noise label in basic agglomerative form | Explicit noise label |
| Main parameters | K, initialisation | Linkage, metric, cut/cluster count | `eps`, `min_samples` |
| Main limitation | Shape and outlier sensitivity | Can be expensive; linkage choice matters | Struggles with varying densities and feature scaling |

## 12. Scaling and Distance Are Still Important

Hierarchical methods and DBSCAN commonly use distance calculations. Feature scales can dominate distance if not handled.

- Standardise or otherwise transform numerical features where appropriate.
- Select a distance metric that matches the problem.
- Do not blindly scale one-hot or sparse representations without considering their geometry.
- Remove or treat identifiers that do not express similarity.
- Check how outliers influence neighbourhood distances.

## 13. Common Mistakes

- Assuming DBSCAN needs the number of clusters.
- Treating every DBSCAN noise point as a data error.
- Choosing `eps` without considering feature scale.
- Confusing a DBSCAN border point with a core point.
- Assuming all linkage methods produce the same hierarchy.
- Using Ward linkage with an incompatible metric.
- Expecting hierarchical clustering to scale effortlessly to very large datasets.
- Treating dendrogram height as a universal measure of cluster quality.
- Forgetting that classic DBSCAN has no general prediction method for new samples in scikit-learn.

## 14. Placement and Interview Questions

**Q1. What is hierarchical clustering?**  
A method that builds a nested hierarchy of clusters through repeated merging or splitting.

**Q2. Agglomerative vs divisive?**  
Agglomerative starts with individual points and merges upward. Divisive starts with one cluster and splits downward.

**Q3. What is a dendrogram?**  
A tree visualisation of cluster merges and their linkage distances.

**Q4. What is linkage?**  
The rule used to define distance between clusters, such as single, complete, average, or Ward.

**Q5. What is DBSCAN?**  
A density-based clustering algorithm that groups dense connected regions and identifies noise.

**Q6. What do `eps` and `min_samples` control?**  
`eps` defines the neighbourhood radius; `min_samples` sets the density requirement for a core point.

**Q7. Does DBSCAN require K?**  
No. It discovers clusters from density connectivity.

**Q8. Why might DBSCAN fail on data with varying densities?**  
A single epsilon and minimum-neighbour threshold may be too strict for sparse groups and too loose for dense groups.

## 15. Practice

### Paper exercise
Use one-dimensional points: 1.0, 1.1, 1.2, 5.0, 5.1, 9.0. Assume `eps = 0.25` and `min_samples = 2`.

1. Identify each point's epsilon-neighbours, counting the point itself.
2. Mark core points.
3. Identify density-connected groups.
4. Identify noise points.
5. Explain how the result might change if `eps` increased to 4.

### Coding exercise
Use one dataset and compare:
- K-Means
- Agglomerative clustering with at least two linkage methods
- DBSCAN with several `eps` and `min_samples` values

For each model, report cluster sizes, noise count where relevant, silhouette score only when defined and meaningful, and a short visual/domain interpretation.

## 16. Quick Revision

- **Hierarchical:** produces nested clusters.
- **Agglomerative:** merge from bottom-up.
- **Divisive:** split from top-down.
- **Dendrogram:** displays merges and merge distances.
- **Linkage:** defines cluster-to-cluster distance.
- **DBSCAN:** identifies dense connected regions.
- **Core:** enough neighbours within `eps`.
- **Border:** near a core point but not dense enough itself.
- **Noise:** not assigned to a cluster.
- **K-Means vs DBSCAN:** centroid-distance partitioning vs density connectivity.

## 17. Final Checklist

- [ ] Explain agglomerative and divisive clustering.
- [ ] Read a dendrogram and explain a horizontal cut.
- [ ] Compare single, complete, average, and Ward linkage.
- [ ] Define DBSCAN core, border, and noise points.
- [ ] Explain `eps` and `min_samples`.
- [ ] Explain how feature scaling affects density/distance.
- [ ] Identify when K-Means is a poor fit.
- [ ] Compare all three algorithms on one dataset.

## 18. Recommended Resources

- [StatQuest: Hierarchical Clustering](https://www.youtube.com/watch?v=7xHsRkOdVwo)
- [StatQuest: DBSCAN](https://www.youtube.com/watch?v=RDZUdRSDOok)
- [scikit-learn: Clustering guide](https://scikit-learn.org/stable/modules/clustering.html)
- [Krish Naik: K-Means, Hierarchical Clustering, and DBSCAN (Hindi)](https://www.youtube.com/watch?v=Aa4MACKaDC0)
