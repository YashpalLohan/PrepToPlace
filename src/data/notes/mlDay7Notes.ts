/**
 * PrepToPlace — AI/ML → ML Foundations → Day 7
 * Consolidation + Start the Week-1 ML Project
 *
 * Companion metadata for mlDay7Content.md.
 * Flowchart nodes target the top-level Markdown sections.
 */

export const mlDay7Notes = {
  id: "ml-foundations-day-7-consolidation-week1-project",
  day: 7,
  title: "Consolidation + Start the Project",
  track: "AI / ML",
  section: "ML Foundations",
  overview:
    "Re-do Days 1–6 in one clean notebook, then begin a Week-1 end-to-end ML project.",
  learningGoal:
    "Connect Python, NumPy, Pandas, EDA, linear algebra, regression, Gradient Descent, and evaluation into a reproducible notebook and start a scoped ML project.",
  status: "not-started",
  contentFile: "mlDay7Content.md",
  resources: [
    {
      title: "Hands-on Machine Learning — GitHub notebooks",
      url: "https://github.com/ageron/handson-ml3",
    },
    {
      title: "Kaggle: Intro to Machine Learning",
      url: "https://www.kaggle.com/learn/intro-to-machine-learning",
    },
  ],
  flowchart: {
    title: "Day 7 Consolidation & Project Flow",
    description:
      "Review the foundations, organize a clean notebook, and begin an end-to-end Week-1 project.",
    nodes: [
      { id: "why-consolidate", label: "Why Consolidate", targetSectionId: "1-why-consolidate-before-moving-on", order: 1 },
      { id: "notebook-setup", label: "Notebook Setup", targetSectionId: "2-consolidation-notebook-environment-and-structure", order: 2 },
      { id: "numpy", label: "Python & NumPy Review", targetSectionId: "3-review-python-and-numpy-essentials", order: 3 },
      { id: "pandas-eda", label: "Pandas & EDA Review", targetSectionId: "4-review-pandas-and-eda", order: 4 },
      { id: "math", label: "Math Review", targetSectionId: "5-review-linear-algebra-and-statistics", order: 5 },
      { id: "linear-regression", label: "Linear Regression Review", targetSectionId: "6-review-linear-regression", order: 6 },
      { id: "logistic-regression", label: "Logistic Regression Review", targetSectionId: "7-review-logistic-regression", order: 7 },
      { id: "evaluation", label: "Evaluation Review", targetSectionId: "8-review-model-evaluation", order: 8 },
      { id: "project-start", label: "Start Week-1 Project", targetSectionId: "9-week-1-project-start-an-end-to-end-ml-problem", order: 9 },
      { id: "workflow", label: "Project Workflow", targetSectionId: "10-project-workflow", order: 10 },
      { id: "deliverable", label: "Project Deliverable", targetSectionId: "11-project-deliverable-and-folder-structure", order: 11 },
      { id: "mistakes", label: "Common Mistakes", targetSectionId: "12-common-mistakes-to-avoid", order: 12 },
      { id: "interview", label: "Interview Questions", targetSectionId: "13-placement-and-interview-questions", order: 13 },
      { id: "checklist", label: "Revision Checklist", targetSectionId: "14-final-revision-checklist", order: 14 },
      { id: "resources", label: "Resources", targetSectionId: "15-recommended-resources", order: 15 },
    ],
  },
} as const;

export type MLDay7Notes = typeof mlDay7Notes;
