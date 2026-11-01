export const mlDay19Notes = {
  id: "ml-foundations-day-19-sklearn-pipelines-imbalanced-data",
  day: 19,
  title: "End-to-end sklearn Pipelines + Imbalanced Data",
  track: "AI / ML",
  section: "ML Foundations",
  contentFile: "mlDay19Content.md",
  status: "not-started",
  overview: "Pipeline + ColumnTransformer = no more data leakage. Combine preprocessing + model in one object you can save and ship.",
  resources: [
    { title: "sklearn Pipeline tutorial", url: "https://scikit-learn.org/stable/modules/compose.html", type: "documentation" },
    { title: "Krish Naik: sklearn Pipelines", url: "https://www.youtube.com/results?search_query=Krish+Naik+sklearn+Pipeline", type: "video" },
    { title: "Imbalanced-learn pipelines", url: "https://imbalanced-learn.org/stable/references/pipeline.html", type: "documentation" },
    { title: "Imbalanced-learn User Guide", url: "https://imbalanced-learn.org/stable/user_guide.html", type: "documentation" }
  ],
  flowchart: [
    { id: "1-overview", title: "Overview", sectionId: "1-overview" },
    { id: "2-why-use-a-pipeline", title: "Why Pipeline", sectionId: "2-why-use-a-pipeline" },
    { id: "3-pipeline-and-columntransformer", title: "Pipeline + ColumnTransformer", sectionId: "3-pipeline-and-columntransformer" },
    { id: "4-what-is-class-imbalance", title: "Class Imbalance", sectionId: "4-what-is-class-imbalance" },
    { id: "5-confusion-matrix", title: "Confusion Matrix", sectionId: "5-confusion-matrix" },
    { id: "6-baseline-before-resampling", title: "Baseline", sectionId: "6-baseline-before-resampling" },
    { id: "7-class-weighting", title: "Class Weighting", sectionId: "7-class-weighting" },
    { id: "8-resampling-strategies", title: "Resampling", sectionId: "8-resampling-strategies" },
    { id: "9-critical-rule-resample-only-inside-the-training-fold", title: "Resample Training Folds Only", sectionId: "9-critical-rule-resample-only-inside-the-training-fold" },
    { id: "10-cross-validation-with-an-imbalanced-learn-pipeline", title: "CV + Imblearn Pipeline", sectionId: "10-cross-validation-with-an-imbalanced-learn-pipeline" },
    { id: "11-threshold-tuning", title: "Threshold Tuning", sectionId: "11-threshold-tuning" },
    { id: "12-a-full-leakage-safe-workflow", title: "Full Workflow", sectionId: "12-a-full-leakage-safe-workflow" },
    { id: "13-common-mistakes", title: "Common Mistakes", sectionId: "13-common-mistakes" },
    { id: "14-placement-and-interview-questions", title: "Interview Questions", sectionId: "14-placement-and-interview-questions" },
    { id: "15-practice", title: "Practice", sectionId: "15-practice" },
    { id: "16-quick-revision", title: "Quick Revision", sectionId: "16-quick-revision" },
    { id: "17-final-checklist", title: "Checklist", sectionId: "17-final-checklist" },
    { id: "18-recommended-resources", title: "Resources", sectionId: "18-recommended-resources" }
  ]
};
