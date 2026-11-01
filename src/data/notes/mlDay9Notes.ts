/**
 * PrepToPlace — AI/ML → ML Foundations → Day 9
 * Decision Trees
 *
 * Companion metadata for mlDay9Content.md.
 * Flowchart targets correspond to the Markdown section headings.
 */

export const mlDay9Notes = {
  id: "ml-foundations-day-9-decision-trees",
  day: 9,
  title: "Decision Trees",
  track: "AI / ML",
  section: "ML Foundations",
  overview:
    "Understand Gini impurity, entropy, information gain, recursive splitting, and how to build and control decision trees.",
  learningGoal:
    "Calculate classification impurity and information gain by hand, build a small tree, and implement classification and regression trees with scikit-learn.",
  status: "not-started",
  contentFile: "mlDay9Content.md",
  resources: [
    {
      title: "StatQuest: Decision Trees",
      url: "https://www.youtube.com/watch?v=_L39rN6gz7Y",
    },
    {
      title: "StatQuest: Regression Trees",
      url: "https://www.youtube.com/watch?v=g9c66TUylZ4",
    },
    {
      title: "Krish Naik: Decision Tree",
      url: "https://www.youtube.com/watch?v=PHxYNGo8NcI",
    },
    {
      title: "scikit-learn: Decision Trees Documentation",
      url: "https://scikit-learn.org/stable/modules/tree.html",
    },
  ],
  flowchart: {
    title: "Decision Trees Learning Flow",
    description:
      "Follow the path from tree structure and impurity measures through split selection, manual construction, regularization, and implementation.",
    nodes: [
      { id: "intro", label: "Decision Tree Basics", targetSectionId: "1-what-is-a-decision-tree", order: 1 },
      { id: "anatomy", label: "Tree Structure", targetSectionId: "2-anatomy-of-a-decision-tree", order: 2 },
      { id: "learning", label: "Recursive Splitting", targetSectionId: "3-how-a-decision-tree-learns", order: 3 },
      { id: "purity", label: "Pure vs Impure Nodes", targetSectionId: "4-pure-and-impure-nodes", order: 4 },
      { id: "gini", label: "Gini Impurity", targetSectionId: "5-gini-impurity", order: 5 },
      { id: "entropy", label: "Entropy", targetSectionId: "6-entropy", order: 6 },
      { id: "information-gain", label: "Information Gain", targetSectionId: "7-information-gain", order: 7 },
      { id: "paper-tree", label: "Build a Tree by Hand", targetSectionId: "8-build-a-decision-tree-on-paper", order: 8 },
      { id: "thresholds", label: "Numerical Splits", targetSectionId: "9-how-numerical-features-are-split", order: 9 },
      { id: "complexity", label: "Stopping & Pruning", targetSectionId: "10-stopping-criteria-and-tree-complexity", order: 10 },
      { id: "regression", label: "Regression Trees", targetSectionId: "11-regression-trees", order: 11 },
      { id: "implementation", label: "scikit-learn Implementation", targetSectionId: "12-decision-trees-with-scikit-learn", order: 12 },
      { id: "importance", label: "Feature Importance", targetSectionId: "13-feature-importance-and-interpretability", order: 13 },
      { id: "mistakes", label: "Common Mistakes", targetSectionId: "14-common-mistakes", order: 14 },
      { id: "interview", label: "Interview Questions", targetSectionId: "15-placement-and-interview-questions", order: 15 },
      { id: "practice", label: "Paper & Coding Practice", targetSectionId: "16-coding-and-paper-practice", order: 16 },
      { id: "revision", label: "Quick Revision", targetSectionId: "17-quick-revision-sheet", order: 17 },
      { id: "checklist", label: "Final Checklist", targetSectionId: "18-final-checklist", order: 18 },
      { id: "resources", label: "Recommended Resources", targetSectionId: "19-recommended-resources", order: 19 },
    ],
  },
} as const;

export type MLDay9Notes = typeof mlDay9Notes;
