export const mlDay13Notes = {
  id: "ml-foundations-day-13-bias-variance-regularisation-tuning",
  day: 13,
  title: "Bias-Variance, Regularisation, Hyperparameter Tuning",
  track: "AI / ML",
  section: "ML Foundations",
  contentFile: "mlDay13Content.md",
  status: "not-started",
  overview: "Overfitting vs underfitting, L1/L2 regularisation, GridSearchCV vs RandomizedSearchCV vs Optuna.",
  resources: [
    { title: "StatQuest: Bias and Variance", url: "https://www.youtube.com/watch?v=EuBBz3bI-aA", type: "video" },
    { title: "StatQuest: Ridge Regression", url: "https://www.youtube.com/watch?v=Q81RR3yKn30", type: "video" },
    { title: "StatQuest: Lasso Regression", url: "https://www.youtube.com/watch?v=NGf0voTMlcs", type: "video" },
    { title: "Optuna quickstart", url: "https://optuna.readthedocs.io/en/stable/tutorial/10_key_features/001_first.html", type: "documentation" },
    { title: "scikit-learn GridSearchCV", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GridSearchCV.html", type: "documentation" },
    { title: "scikit-learn RandomizedSearchCV", url: "https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.RandomizedSearchCV.html", type: "documentation" }
  ],
  flowchart: [
    { id: "1-overview", title: "Overview", sectionId: "1-overview" },
    { id: "2-underfitting-and-overfitting", title: "Underfit vs Overfit", sectionId: "2-underfitting-and-overfitting" },
    { id: "3-bias-and-variance", title: "Bias & Variance", sectionId: "3-bias-and-variance" },
    { id: "4-model-complexity-and-learning-curves", title: "Learning Curves", sectionId: "4-model-complexity-and-learning-curves" },
    { id: "5-regularisation", title: "Regularisation", sectionId: "5-regularisation" },
    { id: "6-l2-regularisation-ridge", title: "L2 / Ridge", sectionId: "6-l2-regularisation-ridge" },
    { id: "7-l1-regularisation-lasso", title: "L1 / Lasso", sectionId: "7-l1-regularisation-lasso" },
    { id: "8-ridge-vs-lasso-vs-elastic-net", title: "Ridge vs Lasso", sectionId: "8-ridge-vs-lasso-vs-elastic-net" },
    { id: "9-hyperparameters-vs-model-parameters", title: "Parameters", sectionId: "9-hyperparameters-vs-model-parameters" },
    { id: "10-cross-validation-for-model-selection", title: "Cross-Validation", sectionId: "10-cross-validation-for-model-selection" },
    { id: "11-gridsearchcv-vs-randomizedsearchcv-vs-optuna", title: "Search Strategies", sectionId: "11-gridsearchcv-vs-randomizedsearchcv-vs-optuna" },
    { id: "12-a-leakage-safe-tuning-workflow", title: "Leakage-Safe Tuning", sectionId: "12-a-leakage-safe-tuning-workflow" },
    { id: "13-nested-cross-validation", title: "Nested CV", sectionId: "13-nested-cross-validation" },
    { id: "14-common-mistakes", title: "Common Mistakes", sectionId: "14-common-mistakes" },
    { id: "15-placement-and-interview-questions", title: "Interview Questions", sectionId: "15-placement-and-interview-questions" },
    { id: "16-practice", title: "Practice", sectionId: "16-practice" },
    { id: "17-quick-revision", title: "Quick Revision", sectionId: "17-quick-revision" },
    { id: "18-final-checklist", title: "Checklist", sectionId: "18-final-checklist" },
    { id: "19-recommended-resources", title: "Resources", sectionId: "19-recommended-resources" }
  ]
};
