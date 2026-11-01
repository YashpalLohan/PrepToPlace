/**
 * PrepToPlace — AI/ML → ML Foundations → Day 5
 * Logistic Regression + Gradient Descent
 *
 * Companion structure for mlDay5Content.md.
 * Every flowchart targetSectionId matches a Markdown heading anchor.
 * If a heading changes, update its matching targetSectionId as well.
 */

export const mlDay5Notes = {
  id: "ml-foundations-day-5-logistic-regression-gradient-descent",
  day: 5,
  title: "Logistic Regression + Gradient Descent",
  track: "AI / ML",
  section: "ML Foundations",
  overview:
    "Sigmoid, binary cross-entropy (log-loss), why classification differs from regression, and a from-scratch Gradient Descent implementation.",
  learningGoal:
    "Understand logistic regression as a probability-based classification model and implement its sigmoid, log-loss, gradients, and parameter updates by hand using NumPy.",
  status: "not-started",
  markdownFile: "mlDay5Content.md",
  resources: [
    {
      title: "StatQuest: Logistic Regression",
      url: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
    },
    {
      title: "3Blue1Brown: Gradient Descent",
      url: "https://www.youtube.com/watch?v=IHZwWFHW-a-w",
    },
    {
      title: "Andrew Ng: Supervised Machine Learning — Course 1, Week 3",
      url: "https://www.coursera.org/learn/machine-learning",
    },
  ],
  flowchart: {
    title: "Logistic Regression Learning Flow",
    description:
      "Follow the progression from classification and probability modelling through loss, gradient updates, implementation, evaluation, and revision.",
    nodes: [
      {
        id: "classification-problem",
        label: "Classification Problem",
        targetSectionId: "1-classification-the-problem",
        order: 1,
      },
      {
        id: "why-not-linear-regression",
        label: "Why Not Linear Regression?",
        targetSectionId: "2-why-linear-regression-is-not-enough-for-classification",
        order: 2,
      },
      {
        id: "logistic-model",
        label: "Logistic Model",
        targetSectionId: "3-logistic-regression-model",
        order: 3,
      },
      {
        id: "sigmoid",
        label: "Sigmoid Function",
        targetSectionId: "4-sigmoid-function",
        order: 4,
      },
      {
        id: "decision-boundary",
        label: "Decision Boundary",
        targetSectionId: "5-decision-boundary-and-class-prediction",
        order: 5,
      },
      {
        id: "log-loss",
        label: "Binary Cross-Entropy",
        targetSectionId: "6-binary-cross-entropy-log-loss",
        order: 6,
      },
      {
        id: "gradient-descent",
        label: "Gradient Descent",
        targetSectionId: "7-gradient-descent-for-logistic-regression",
        order: 7,
      },
      {
        id: "scratch-implementation",
        label: "From-Scratch Implementation",
        targetSectionId: "8-implement-logistic-regression-from-scratch",
        order: 8,
      },
      {
        id: "evaluation",
        label: "Classification Evaluation",
        targetSectionId: "9-evaluate-classification-predictions",
        order: 9,
      },
      {
        id: "sklearn",
        label: "scikit-learn",
        targetSectionId: "10-use-scikit-learn",
        order: 10,
      },
      {
        id: "limitations",
        label: "Assumptions & Limitations",
        targetSectionId: "11-assumptions-limitations-and-common-mistakes",
        order: 11,
      },
      {
        id: "interview",
        label: "Interview Questions",
        targetSectionId: "12-placement-interview-questions",
        order: 12,
      },
      {
        id: "practice",
        label: "Practice Exercises",
        targetSectionId: "13-practice-exercises",
        order: 13,
      },
      {
        id: "revision",
        label: "Quick Revision",
        targetSectionId: "14-quick-revision-sheet",
        order: 14,
      },
      {
        id: "resources",
        label: "Further Resources",
        targetSectionId: "15-further-learning-resources",
        order: 15,
      },
    ],
  },
} as const;

export type MLDay5Notes = typeof mlDay5Notes;
