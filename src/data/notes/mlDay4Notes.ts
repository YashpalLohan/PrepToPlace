/**
 * PrepToPlace — AI/ML → ML Foundations → Day 4
 * Linear Regression
 *
 * Companion structure for mlDay4Content.md.
 * Every flowchart targetSectionId matches a Markdown heading anchor.
 * If a heading changes, update its matching targetSectionId as well.
 */

export const mlDay4Notes = {
  id: "ml-foundations-day-4-linear-regression",
  day: 4,
  title: "Linear Regression",
  track: "AI / ML",
  section: "ML Foundations",
  overview:
    "Cost function (MSE), Normal Equation, and Gradient Descent. Implement linear regression from scratch before using scikit-learn.",
  learningGoal:
    "Understand linear regression mathematically, compare its main optimization methods, and implement a working model from scratch before using scikit-learn.",
  status: "not-started",
  markdownFile: "mlDay4Content.md",
  resources: [
    {
      title: "StatQuest: Linear Regression",
      url: "https://www.youtube.com/watch?v=nk2CQITm_eo",
    },
    {
      title: "Andrew Ng: Supervised Machine Learning — Course 1, Weeks 1–2",
      url: "https://www.coursera.org/learn/machine-learning",
    },
    {
      title: "Krish Naik: Linear Regression from Scratch",
      url: "https://www.youtube.com/watch?v=1-OGRohmH2s",
    },
    {
      title: "scikit-learn: Linear Models Documentation",
      url: "https://scikit-learn.org/stable/modules/linear_model.html",
    },
  ],
  flowchart: {
    title: "Linear Regression Learning Flow",
    description:
      "Progress from the supervised-learning problem to the model, optimization methods, implementation, and evaluation.",
    nodes: [
      {
        id: "problem-setup",
        label: "Problem Setup",
        targetSectionId: "1-problem-setup-supervised-learning",
        order: 1,
      },
      {
        id: "linear-model",
        label: "Linear Model",
        targetSectionId: "2-linear-model-and-predictions",
        order: 2,
      },
      {
        id: "residuals-cost",
        label: "Residuals & Cost",
        targetSectionId: "3-residuals-and-the-cost-function",
        order: 3,
      },
      {
        id: "mse",
        label: "Mean Squared Error",
        targetSectionId: "4-mean-squared-error-mse",
        order: 4,
      },
      {
        id: "normal-equation",
        label: "Normal Equation",
        targetSectionId: "5-normal-equation-closed-form-solution",
        order: 5,
      },
      {
        id: "gradient-descent",
        label: "Gradient Descent",
        targetSectionId: "6-gradient-descent",
        order: 6,
      },
      {
        id: "scratch-implementation",
        label: "From-Scratch Implementation",
        targetSectionId: "7-implement-linear-regression-from-scratch",
        order: 7,
      },
      {
        id: "evaluation",
        label: "Evaluation",
        targetSectionId: "8-evaluate-and-interpret-the-model",
        order: 8,
      },
      {
        id: "sklearn",
        label: "scikit-learn",
        targetSectionId: "9-use-scikit-learn",
        order: 9,
      },
      {
        id: "assumptions-limitations",
        label: "Assumptions & Limitations",
        targetSectionId: "10-assumptions-limitations-and-common-mistakes",
        order: 10,
      },
      {
        id: "interview",
        label: "Interview Questions",
        targetSectionId: "11-placement-interview-questions",
        order: 11,
      },
      {
        id: "practice",
        label: "Practice",
        targetSectionId: "12-practice-exercises",
        order: 12,
      },
      {
        id: "revision",
        label: "Quick Revision",
        targetSectionId: "13-quick-revision-sheet",
        order: 13,
      },
    ],
  },
} as const;

export type MLDay4Notes = typeof mlDay4Notes;
