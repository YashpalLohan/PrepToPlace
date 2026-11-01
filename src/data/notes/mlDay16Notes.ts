export const mlDay16Notes = {
  id: "ml-foundations-day-16-hierarchical-clustering-dbscan",
  day: 16,
  title: "Hierarchical Clustering + DBSCAN",
  track: "AI / ML",
  section: "ML Foundations",
  contentFile: "mlDay16Content.md",
  status: "not-started",
  overview: "When K-Means fails. Density-based vs distance-based clustering. Dendrograms.",
  resources: [
    { title: "StatQuest: Hierarchical Clustering", url: "https://www.youtube.com/watch?v=7xHsRkOdVwo", type: "video" },
    { title: "StatQuest: DBSCAN", url: "https://www.youtube.com/watch?v=RDZUdRSDOok", type: "video" },
    { title: "scikit-learn Clustering guide", url: "https://scikit-learn.org/stable/modules/clustering.html", type: "documentation" }
  ],
  flowchart: [
    { id: "1-overview", title: "Overview", sectionId: "1-overview" },
    { id: "2-why-k-means-can-fail", title: "K-Means Limitations", sectionId: "2-why-k-means-can-fail" },
    { id: "3-hierarchical-clustering", title: "Hierarchical Clustering", sectionId: "3-hierarchical-clustering" },
    { id: "4-linkage-how-cluster-to-cluster-distance-is-defined", title: "Linkage", sectionId: "4-linkage-how-cluster-to-cluster-distance-is-defined" },
    { id: "5-dendrograms", title: "Dendrograms", sectionId: "5-dendrograms" },
    { id: "6-hierarchical-clustering-with-python", title: "Hierarchical in Python", sectionId: "6-hierarchical-clustering-with-python" },
    { id: "7-dbscan-density-based-clustering", title: "DBSCAN", sectionId: "7-dbscan-density-based-clustering" },
    { id: "8-core-border-and-noise-points", title: "Core / Border / Noise", sectionId: "8-core-border-and-noise-points" },
    { id: "9-dbscan-with-scikit-learn", title: "DBSCAN in Python", sectionId: "9-dbscan-with-scikit-learn" },
    { id: "10-choosing-dbscan-parameters", title: "DBSCAN Parameters", sectionId: "10-choosing-dbscan-parameters" },
    { id: "11-hierarchical-clustering-vs-dbscan-vs-k-means", title: "Compare Methods", sectionId: "11-hierarchical-clustering-vs-dbscan-vs-k-means" },
    { id: "12-scaling-and-distance-are-still-important", title: "Scaling & Distance", sectionId: "12-scaling-and-distance-are-still-important" },
    { id: "13-common-mistakes", title: "Common Mistakes", sectionId: "13-common-mistakes" },
    { id: "14-placement-and-interview-questions", title: "Interview Questions", sectionId: "14-placement-and-interview-questions" },
    { id: "15-practice", title: "Practice", sectionId: "15-practice" },
    { id: "16-quick-revision", title: "Quick Revision", sectionId: "16-quick-revision" },
    { id: "17-final-checklist", title: "Checklist", sectionId: "17-final-checklist" },
    { id: "18-recommended-resources", title: "Resources", sectionId: "18-recommended-resources" }
  ]
};
