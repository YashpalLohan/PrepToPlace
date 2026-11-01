/**
 * PrepToPlace — AI/ML → ML Foundations → Day 8
 * K-Nearest Neighbours + Naive Bayes
 *
 * Companion metadata for mlDay8Content.md.
 * Flowchart targets correspond to the Markdown section headings.
 */

export const mlDay8Notes = {
  id: "ml-foundations-day-8-knn-naive-bayes",
  day: 8,
  title: "K-Nearest Neighbours + Naive Bayes",
  track: "AI / ML",
  section: "ML Foundations",
  overview:
    "Understand two foundational classifiers, distance metrics, the curse of dimensionality, conditional probability, and why scaling matters for KNN.",
  learningGoal:
    "Explain, implement, evaluate, and compare KNN and Naive Bayes using appropriate preprocessing and leakage-safe validation.",
  status: "not-started",
  contentFile: "mlDay8Content.md",
  resources: [
    {
      title: "StatQuest: K-Nearest Neighbours",
      url: "https://www.youtube.com/watch?v=HVXime0nQeI",
    },
    {
      title: "StatQuest: Naive Bayes",
      url: "https://www.youtube.com/watch?v=O2L2Uv9pdDA",
    },
    {
      title: "scikit-learn: Nearest Neighbours Guide",
      url: "https://scikit-learn.org/stable/modules/neighbors.html",
    },
  ],
  flowchart: {
    title: "KNN + Naive Bayes Learning Flow",
    description:
      "Move from neighbour-based classification and distance geometry to probability-based classification, implementation, and comparison.",
    nodes: [
      { id: "why-algorithms", label: "Why These Classifiers", targetSectionId: "1-why-learn-knn-and-naive-bayes", order: 1 },
      { id: "knn-intuition", label: "KNN Intuition", targetSectionId: "2-k-nearest-neighbours-intuition-and-prediction", order: 2 },
      { id: "distances", label: "Distance Metrics", targetSectionId: "3-distance-metrics", order: 3 },
      { id: "scaling", label: "Feature Scaling", targetSectionId: "4-why-feature-scaling-matters-in-knn", order: 4 },
      { id: "dimensionality", label: "Curse of Dimensionality", targetSectionId: "5-the-curse-of-dimensionality", order: 5 },
      { id: "knn-code", label: "KNN Implementation", targetSectionId: "6-knn-with-scikit-learn", order: 6 },
      { id: "bayes", label: "Naive Bayes Foundation", targetSectionId: "7-naive-bayes-probability-based-classification", order: 7 },
      { id: "nb-types", label: "Naive Bayes Types", targetSectionId: "8-types-of-naive-bayes", order: 8 },
      { id: "smoothing", label: "Laplace Smoothing", targetSectionId: "9-laplace-smoothing-and-zero-probability-problem", order: 9 },
      { id: "nb-code", label: "Naive Bayes Implementation", targetSectionId: "10-naive-bayes-with-scikit-learn", order: 10 },
      { id: "comparison", label: "KNN vs Naive Bayes", targetSectionId: "11-knn-vs-naive-bayes", order: 11 },
      { id: "experiment", label: "Practical Comparison", targetSectionId: "12-practical-comparison-exercise", order: 12 },
      { id: "mistakes", label: "Common Mistakes", targetSectionId: "13-common-mistakes", order: 13 },
      { id: "interview", label: "Interview Questions", targetSectionId: "14-placement-and-interview-questions", order: 14 },
      { id: "practice", label: "Coding Practice", targetSectionId: "15-coding-practice", order: 15 },
      { id: "revision", label: "Quick Revision", targetSectionId: "16-quick-revision-sheet", order: 16 },
      { id: "checklist", label: "Final Checklist", targetSectionId: "17-final-checklist", order: 17 },
      { id: "resources", label: "Recommended Resources", targetSectionId: "18-recommended-resources", order: 18 },
    ],
  },
} as const;

export type MLDay8Notes = typeof mlDay8Notes;
