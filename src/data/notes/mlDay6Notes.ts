/**
 * PrepToPlace — AI/ML > ML Foundations > Day 6
 * Topic: Model Evaluation
 *
 * Keep section IDs synchronized with the headings in mlDay6Content.md.
 * Flowchart nodes target these exact section IDs.
 */

export const mlDay6Notes = {
  id: "ml-day-6-model-evaluation",
  day: 6,
  title: "Model Evaluation",
  track: "AI / ML",
  section: "ML Foundations",
  overview:
    "MAE/MSE/RMSE/R² for regression; accuracy, precision, recall, F1, ROC-AUC, confusion matrix for classification. Train/validation/test split and k-fold cross-validation.",
  status: "not-started",
  contentFile: "mlDay6Content.md",
  resources: [
    {
      title: "StatQuest: ROC and AUC",
      url: "https://www.youtube.com/watch?v=4jRBRDbJemM",
    },
    {
      title: "StatQuest: Confusion Matrix",
      url: "https://www.youtube.com/watch?v=Kdsp6soqA7o",
    },
    {
      title: "Scikit-learn: Model Evaluation",
      url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
    },
    {
      title: "Krish Naik: Cross Validation",
      url: "https://www.youtube.com/watch?v=fSytzGwwBVw",
    },
  ],
  flowchart: {
    title: "Model Evaluation",
    subtitle: "Beginner to Placement",
    nodes: [
      { id: "overview", label: "Why Model Evaluation Matters", targetSectionId: "1-overview-why-model-evaluation-matters", order: 1 },
      { id: "splitting", label: "Train / Validation / Test Split", targetSectionId: "2-dataset-splitting-train-validation-and-test", order: 2 },
      { id: "regression", label: "Regression Metrics", targetSectionId: "3-regression-evaluation-metrics", order: 3 },
      { id: "classification", label: "Classification Metrics", targetSectionId: "4-classification-evaluation-metrics", order: 4 },
      { id: "thresholds", label: "Decision Thresholds", targetSectionId: "5-decision-thresholds-change-classification-results", order: 5 },
      { id: "cross-validation", label: "K-Fold Cross-Validation", targetSectionId: "6-k-fold-cross-validation", order: 6 },
      { id: "leakage", label: "Avoiding Data Leakage", targetSectionId: "7-avoiding-data-leakage", order: 7 },
      { id: "workflow", label: "Scikit-Learn Workflow", targetSectionId: "8-practical-scikit-learn-evaluation-workflow", order: 8 },
      { id: "mistakes", label: "Common Mistakes", targetSectionId: "9-common-mistakes", order: 9 },
      { id: "interview", label: "Interview Questions", targetSectionId: "10-interview-questions-and-answers", order: 10 },
      { id: "practice", label: "Practice Exercises", targetSectionId: "11-practice-exercises", order: 11 },
      { id: "revision", label: "Quick Revision", targetSectionId: "12-quick-revision-sheet", order: 12 },
      { id: "takeaways", label: "Key Takeaways", targetSectionId: "13-key-takeaways", order: 13 },
      { id: "resources", label: "Recommended Resources", targetSectionId: "14-recommended-resources", order: 14 },
    ],
  },
};

export default mlDay6Notes;
