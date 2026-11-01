export const mlDay17Notes = {
  id: "ml-foundations-day-17-pca-dimensionality-reduction",
  day: 17,
  title: "PCA & Dimensionality Reduction",
  track: "AI / ML",
  section: "ML Foundations",
  contentFile: "mlDay17Content.md",
  status: "not-started",
  overview: "Eigenvectors, variance explained, when PCA hurts more than helps. Bonus: t-SNE / UMAP for visualisation.",
  resources: [
    { title: "StatQuest: PCA", url: "https://www.youtube.com/watch?v=FgakZw6K1QQ", type: "video" },
    { title: "StatQuest: t-SNE", url: "https://www.youtube.com/watch?v=NEaUSP4YerM", type: "video" },
    { title: "scikit-learn Decomposition", url: "https://scikit-learn.org/stable/modules/decomposition.html", type: "documentation" },
    { title: "scikit-learn PCA API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html", type: "documentation" }
  ],
  flowchart: [
    { id: "1-overview", title: "Overview", sectionId: "1-overview" },
    { id: "2-why-reduce-dimensions", title: "Why Reduce Dimensions", sectionId: "2-why-reduce-dimensions" },
    { id: "3-feature-selection-vs-feature-extraction", title: "Selection vs Extraction", sectionId: "3-feature-selection-vs-feature-extraction" },
    { id: "4-pca-intuition", title: "PCA Intuition", sectionId: "4-pca-intuition" },
    { id: "5-centering-and-scaling", title: "Centering & Scaling", sectionId: "5-centering-and-scaling" },
    { id: "6-covariance-matrix-eigenvectors-and-eigenvalues", title: "Covariance & Eigenvectors", sectionId: "6-covariance-matrix-eigenvectors-and-eigenvalues" },
    { id: "7-principal-components-and-projection", title: "Projection", sectionId: "7-principal-components-and-projection" },
    { id: "8-explained-variance-ratio", title: "Explained Variance", sectionId: "8-explained-variance-ratio" },
    { id: "9-scree-plot-and-component-selection", title: "Scree Plot", sectionId: "9-scree-plot-and-component-selection" },
    { id: "10-pca-with-scikit-learn", title: "PCA in Python", sectionId: "10-pca-with-scikit-learn" },
    { id: "11-when-pca-can-hurt-more-than-help", title: "PCA Limitations", sectionId: "11-when-pca-can-hurt-more-than-help" },
    { id: "12-t-sne-for-visualisation", title: "t-SNE", sectionId: "12-t-sne-for-visualisation" },
    { id: "13-umap-for-visualisation", title: "UMAP", sectionId: "13-umap-for-visualisation" },
    { id: "14-pca-vs-t-sne-vs-umap", title: "Compare Methods", sectionId: "14-pca-vs-t-sne-vs-umap" },
    { id: "15-common-mistakes", title: "Common Mistakes", sectionId: "15-common-mistakes" },
    { id: "16-placement-and-interview-questions", title: "Interview Questions", sectionId: "16-placement-and-interview-questions" },
    { id: "17-practice", title: "Practice", sectionId: "17-practice" },
    { id: "18-quick-revision", title: "Quick Revision", sectionId: "18-quick-revision" },
    { id: "19-final-checklist", title: "Checklist", sectionId: "19-final-checklist" },
    { id: "20-recommended-resources", title: "Resources", sectionId: "20-recommended-resources" }
  ]
};
