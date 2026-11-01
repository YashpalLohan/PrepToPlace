import { Section, Topic } from '../types';
import { ML_DAY_1_NOTE_MARKDOWN } from './notes/mlDay1Notes';
import { mlDay2Content } from './notes/mlDay2Notes';
import { mlDay3Content } from './notes/mlDay3Notes';
import mlDay4Content from './notes/mlDay4Content.md?raw';
import mlDay5Content from './notes/mlDay5Content.md?raw';
import mlDay6Content from './notes/mlDay6Content.md?raw';
import mlDay7Content from './notes/mlDay7Content.md?raw';
import mlDay8Content from './notes/mlDay8Content.md?raw';
import mlDay9Content from './notes/mlDay9Content.md?raw';
import mlDay10Content from './notes/mlDay10Content.md?raw';
import mlDay11Content from './notes/mlDay11Content.md?raw';
import mlDay12Content from './notes/mlDay12Content.md?raw';
import mlDay13Content from './notes/mlDay13Content.md?raw';
import mlDay14Content from './notes/mlDay14Content.md?raw';
import mlDay15Content from './notes/mlDay15Content.md?raw';
import mlDay16Content from './notes/mlDay16Content.md?raw';
import mlDay17Content from './notes/mlDay17Content.md?raw';
import mlDay18Content from './notes/mlDay18Content.md?raw';
import mlDay19Content from './notes/mlDay19Content.md?raw';
import mlDay20Content from './notes/mlDay20Content.md?raw';
import mlDay21Content from './notes/mlDay21Content.md?raw';
import dlDays13Content from './notes/dlDays1-3Content.md?raw';
import dlDays45Content from './notes/dlDays4-5Content.md?raw';
import dlDays610Content from './notes/dlDays6-10Content.md?raw';
import dlDays1114Content from './notes/dlDays11-14Content.md?raw';
import dlDays1518Content from './notes/dlDays15-18Content.md?raw';
import dlDays1922Content from './notes/dlDays19-22Content.md?raw';
import dlDays2330Content from './notes/dlDays23-30Content.md?raw';
import dlDays3135Content from './notes/dlDays31-35Content.md?raw';
import dlDays3640Content from './notes/dlDays36-40Content.md?raw';
import dlDays4144Content from './notes/dlDays41-44Content.md?raw';
import dlDays4551Content from './notes/dlDays45-51Content.md?raw';
import dlDays5255Content from './notes/dlDays52-55Content.md?raw';
import dlDays5657Content from './notes/dlDays56-57Content.md?raw';
import dlDays5859Content from './notes/dlDays58-59Content.md?raw';
import dlDay60Content from './notes/dlDay60Content.md?raw';
import genaiDays13Content from './notes/genaiDays1-3Content.md?raw';
import genaiDays46Content from './notes/genaiDays4-6Content.md?raw';
import genaiDays710Content from './notes/genaiDays7-10Content.md?raw';
import genaiDays1113Content from './notes/genaiDays11-13Content.md?raw';
import genaiDays1416Content from './notes/genaiDays14-16Content.md?raw';
import genaiDays1720Content from './notes/genaiDays17-20Content.md?raw';
import genaiDays2123Content from './notes/genaiDays21-23Content.md?raw';
import genaiDays2428Content from './notes/genaiDays24-28Content.md?raw';
import genaiDays2931Content from './notes/genaiDays29-31Content.md?raw';
import genaiDays3235Content from './notes/genaiDays32-35Content.md?raw';
import genaiDays3638Content from './notes/genaiDays36-38Content.md?raw';
import genaiDays3941Content from './notes/genaiDays39-41Content.md?raw';
import genaiDays4244Content from './notes/genaiDays42-44Content.md?raw';
import genaiDays4547Content from './notes/genaiDays45-47Content.md?raw';
import genaiDays4852Content from './notes/genaiDays48-52Content.md?raw';
import genaiDays5355Content from './notes/genaiDays53-55Content.md?raw';
import genaiDays5657Content from './notes/genaiDays56-57Content.md?raw';
import genaiDays5859Content from './notes/genaiDays58-59Content.md?raw';
import genaiDay60Content from './notes/genaiDay60Content.md?raw';

const deepLearningNote = (id: string, topicId: string, markdown: string) => ({
  id,
  topicId,
  markdown,
  keyTakeaways: [] as string[],
  relatedTopics: [] as string[],
  images: [],
  lastUpdated: new Date().toISOString(),
});

const generativeAINote = (id: string, topicId: string, markdown: string) => ({
  id,
  topicId,
  markdown,
  keyTakeaways: [] as string[],
  relatedTopics: [] as string[],
  images: [],
  lastUpdated: new Date().toISOString(),
});

export const ML_FOUNDATIONS_TOPICS: Topic[] = [
  {
    id: 'ml-day-1',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Python + NumPy for ML',
    dayRange: 'Day 1',
    description: 'Arrays, vectorisation, broadcasting — the language of every ML library.',
    order: 1,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Kaggle: Python micro-course', url: 'https://www.kaggle.com/learn/python' },
      { title: 'FreeCodeCamp: NumPy full course (1h)', url: 'https://www.youtube.com/watch?v=QUT1VHiLmmI' },
      { title: 'Krish Naik: NumPy in 1 hour', url: 'https://www.youtube.com/watch?v=8JfDAm9y_7s' }
    ],
    note: {
      id: 'note-ml-day-1',
      topicId: 'ml-day-1',
      markdown: ML_DAY_1_NOTE_MARKDOWN,
      keyTakeaways: [
        'NumPy arrays use contiguous C-memory layouts with strides for zero-copy views.',
        'Basic slicing produces a mutable view; fancy and boolean indexing produces a copy.',
        'Broadcasting aligns dimensions right-to-left where dimensions must match or equal 1.',
        'Vectorization eliminates CPython loop overhead and leverages contiguous memory layout and CPU SIMD hardware acceleration.',
        'Core ML design matrix formulation: predictions are $X W$, loss is $\\text{MSE}/\\text{BCE}$, and analytical gradient is $\\frac{2}{N} X^T (X W - y)$.'
      ],
      relatedTopics: ['Linear Algebra', 'Vectorization', 'Matrix Calculus', 'Pandas'],
      images: [],
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'ml-day-2',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Pandas + EDA',
    dayRange: 'Day 2',
    description: 'Loading, cleaning, joining, groupby, missing values. This IS most of the job.',
    order: 2,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Kaggle: Pandas micro-course', url: 'https://www.kaggle.com/learn/pandas' },
      { title: 'Corey Schafer: Pandas tutorials', url: 'https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS' },
      { title: 'Kaggle: Data Visualization', url: 'https://www.kaggle.com/learn/data-visualization' }
    ],
    note: {
      id: 'note-ml-day-2',
      topicId: 'ml-day-2',
      markdown: mlDay2Content,
      keyTakeaways: [
        'Pandas Series is 1D labelled data; DataFrame is 2D with multiple columns of different types.',
        'Read and write CSV, Excel, JSON, Parquet using read_csv(), read_excel(), etc.',
        'Inspect shape, columns, dtypes, and missing values with .info(), .describe(), and .isna().sum().',
        'Filter rows using boolean masks with &, |, ~ operators; avoid Python and/or on Series.',
        'Missing values: choose between drop, fill with mean/median/mode, or add missingness indicators.',
        'Remove exact duplicates with drop_duplicates(); standardize text with .str.strip().str.title().',
        'Combine tables: concat() for stacking, merge() for key-based joins (inner/left/right/outer), join() for index-based.',
        'GroupBy follows split–apply–combine: groupby(), agg(), transform(), filter() for row-level or group-level results.',
        'Pivot tables reshape data across row and column categories with aggregation.',
        'EDA workflow: understand problem → load → inspect → clean → validate ranges → study distributions → check relationships.'
      ],
      relatedTopics: ['NumPy', 'Data Cleaning', 'Missing Values', 'Feature Engineering', 'Data Visualization', 'Linear Algebra'],
      images: [],
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'ml-day-3',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Math: Linear Algebra & Probability/Stats',
    dayRange: 'Day 3',
    description: "Vectors, matrices, dot product, mean/variance, distributions, Bayes\\' rule. Intuition over proofs.",
    order: 3,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: '3Blue1Brown: Essence of Linear Algebra', url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab' },
      { title: 'StatQuest: Statistics Fundamentals', url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9' },
      { title: 'Khan Academy: Probability & Statistics', url: 'https://www.khanacademy.org/math/statistics-probability' }
    ],
    note: {
      id: 'note-ml-day-3',
      topicId: 'ml-day-3',
      markdown: mlDay3Content,
      keyTakeaways: [
        `Scalars are single numbers; vectors are 1D ordered collections; matrices are 2D rectangular arrays; tensors generalize to higher dimensions.`,
        `Shape describes size along each axis: (N, D) typically means N samples and D features in ML datasets.`,
        `Vector operations: addition/subtraction element-wise, dot product returns a scalar, L2 norm measures magnitude.`,
        `Matrix multiplication requires inner dimensions to match; result shape is (m, p) when multiplying (m, n) by (n, p).`,
        `Mean is the arithmetic average (sensitive to outliers); median is the middle value (more robust); variance measures squared deviation from mean.`,
        `Covariance describes joint variation; correlation is normalized covariance ranging from -1 to +1.`,
        `Probability ranges from 0 to 1; conditional probability updates based on evidence; Bayes' rule combines prior and likelihood.`,
        `Common distributions: Bernoulli (binary trial), Binomial (success count), Uniform (equally likely), Normal (bell-shaped).`,
        `Z-score standardization shifts data to mean ≈ 0, std ≈ 1 using training data parameters; prevents data leakage by fitting on training set only.`,
        `Linear prediction combines features and weights: ŷ = Xw + b; dot product computes weighted sums; distance metrics measure similarity.`,
        `Naive Bayes applies Bayes' rule with conditional independence; medical test posterior probability demonstrates importance of base rates.`,
        `Interview focus: understanding shapes, distinguishing operations, explaining when concepts appear in ML, recognizing common mistakes.`
      ],
      relatedTopics: ['NumPy', 'Linear Regression', 'Probability', 'Statistics', 'Feature Scaling', 'Model Fundamentals'],
      images: [],
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: 'ml-day-4',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Linear Regression',
    dayRange: 'Day 4',
    description: 'Cost function (MSE), normal equation, gradient descent. Implement it once before using sklearn.',
    order: 4,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Linear Regression', url: 'https://www.youtube.com/watch?v=nk2CQITm_eo' },
      { title: 'Andrew Ng: Supervised ML Course 1, Week 1–2', url: 'https://www.coursera.org/learn/machine-learning' },
      { title: 'Krish Naik: Linear Regression from scratch', url: 'https://www.youtube.com/watch?v=1-OGRohmH2s' },
      { title: 'sklearn LinearRegression docs', url: 'https://scikit-learn.org/stable/modules/linear_model.html' }
    ],
    note: { id: 'note-ml-day-4', topicId: 'ml-day-4', markdown: mlDay4Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-5',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Logistic Regression + Gradient Descent',
    dayRange: 'Day 5',
    description: 'Sigmoid, log-loss, why classification ≠ regression. Implement GD update rule by hand.',
    order: 5,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Logistic Regression', url: 'https://www.youtube.com/watch?v=yIYKR4sgzI8' },
      { title: '3Blue1Brown: Gradient Descent', url: 'https://www.youtube.com/watch?v=IHZwWFHWa-w' },
      { title: 'Andrew Ng: Supervised ML Course 1, Week 3', url: 'https://www.coursera.org/learn/machine-learning' }
    ],
    note: { id: 'note-ml-day-5', topicId: 'ml-day-5', markdown: mlDay5Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-6',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Model Evaluation',
    dayRange: 'Day 6',
    description: 'MAE/MSE/RMSE/R² for regression; accuracy, precision, recall, F1, ROC-AUC, confusion matrix for classification. Train/val/test split, k-fold CV.',
    order: 6,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: ROC and AUC', url: 'https://www.youtube.com/watch?v=4jRBRDbJemM' },
      { title: 'StatQuest: Confusion Matrix', url: 'https://www.youtube.com/watch?v=Kdsp6soqA7o' },
      { title: 'sklearn model evaluation', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
      { title: 'Krish Naik: Cross Validation', url: 'https://www.youtube.com/watch?v=fSytzGwwBVw' }
    ],
    note: { id: 'note-ml-day-6', topicId: 'ml-day-6', markdown: mlDay6Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-7',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Consolidation + Start the Project',
    dayRange: 'Day 7',
    description: 'Re-do everything in one clean notebook. Then begin the Week-1 project.',
    order: 7,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Hands-on ML GitHub notebooks', url: 'https://github.com/ageron/handson-ml3' },
      { title: 'Kaggle: Intro to ML', url: 'https://www.kaggle.com/learn/intro-to-machine-learning' }
    ],
    note: { id: 'note-ml-day-7', topicId: 'ml-day-7', markdown: mlDay7Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-8',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'K-Nearest Neighbours + Naive Bayes',
    dayRange: 'Day 8',
    description: 'Two simple but interview-loved classifiers. Understand distance metrics, the curse of dimensionality, and why scaling matters.',
    order: 8,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: K-Nearest Neighbours', url: 'https://www.youtube.com/watch?v=HVXime0nQeI' },
      { title: 'StatQuest: Naive Bayes', url: 'https://www.youtube.com/watch?v=O2L2Uv9pdDA' },
      { title: 'sklearn Neighbours guide', url: 'https://scikit-learn.org/stable/modules/neighbors.html' }
    ],
    note: { id: 'note-ml-day-8', topicId: 'ml-day-8', markdown: mlDay8Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-9',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Decision Trees',
    dayRange: 'Day 9',
    description: 'Gini, entropy, information gain, how a tree splits. Implement one on paper for a tiny dataset.',
    order: 9,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Decision Trees', url: 'https://www.youtube.com/watch?v=_L39rN6gz7Y' },
      { title: 'StatQuest: Regression Trees', url: 'https://www.youtube.com/watch?v=g9c66TUylZ4' },
      { title: 'Krish Naik: Decision Tree', url: 'https://www.youtube.com/watch?v=PHxYNGo8NcI' }
    ],
    note: { id: 'note-ml-day-9', topicId: 'ml-day-9', markdown: mlDay9Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-10',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Random Forests + Bagging',
    dayRange: 'Day 10',
    description: 'Why ensembles beat single models. Bootstrap, out-of-bag error, feature importance.',
    order: 10,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Random Forests', url: 'https://www.youtube.com/watch?v=J4Wdy0Wc_xQ' },
      { title: 'StatQuest: Bagging and Random Forests', url: 'https://www.youtube.com/watch?v=sQ870aTKqiM' },
      { title: 'sklearn Ensemble docs', url: 'https://scikit-learn.org/stable/modules/ensemble.html' }
    ],
    note: { id: 'note-ml-day-10', topicId: 'ml-day-10', markdown: mlDay10Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-11',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Gradient Boosting + XGBoost + LightGBM',
    dayRange: 'Day 11',
    description: 'Boosting intuition, learning rate, n_estimators and popular boosting algorithms.',
    order: 11,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Gradient Boosting', url: 'https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF' },
      { title: 'XGBoost official tutorial', url: 'https://xgboost.readthedocs.io/en/stable/tutorials/model.html' },
      { title: 'Krish Naik: XGBoost', url: 'https://www.youtube.com/watch?v=gPciUPwWJQQ' },
      { title: 'LightGBM docs', url: 'https://lightgbm.readthedocs.io/en/stable/Quick-Start.html' }
    ],
    note: { id: 'note-ml-day-11', topicId: 'ml-day-11', markdown: mlDay11Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-12',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Support Vector Machines (SVM)',
    dayRange: 'Day 12',
    description: 'Max-margin intuition, kernels, when to use SVM vs trees. Important for theory interviews.',
    order: 12,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: SVM', url: 'https://www.youtube.com/watch?v=efR1C6CvhmE' },
      { title: 'MIT 6.034 SVM lecture', url: 'https://www.youtube.com/watch?v=_PwhiWxHK8o' },
      { title: 'sklearn SVM guide', url: 'https://scikit-learn.org/stable/modules/svm.html' }
    ],
    note: { id: 'note-ml-day-12', topicId: 'ml-day-12', markdown: mlDay12Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-13',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Bias-Variance, Regularisation, Hyperparameter Tuning',
    dayRange: 'Day 13',
    description: 'Overfitting vs underfitting, L1/L2 regularisation, GridSearchCV vs RandomizedSearchCV vs Optuna.',
    order: 13,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Bias and Variance', url: 'https://www.youtube.com/watch?v=EuBBz3bI-aA' },
      { title: 'StatQuest: Ridge Regression', url: 'https://www.youtube.com/watch?v=Q81RR3yKn30' },
      { title: 'StatQuest: Lasso Regression', url: 'https://www.youtube.com/watch?v=NGf0voTMlcs' },
      { title: 'Optuna quickstart', url: 'https://optuna.org/#code_examples' }
    ],
    note: { id: 'note-ml-day-13', topicId: 'ml-day-13', markdown: mlDay13Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-14',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Mock Interview Drill + Start Project',
    dayRange: 'Day 14',
    description: "Pick 10 questions from Chip Huyen's ML Interviews book; answer out loud, in 2 minutes each.",
    order: 14,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Chip Huyen: ML Interviews Book', url: 'https://huyenchip.com/ml-interviews-book/' },
      { title: 'Krish Naik: ML Interview Questions', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPkl7oRvzyNnyj1HS4wt2K-' }
    ],
    note: { id: 'note-ml-day-14', topicId: 'ml-day-14', markdown: mlDay14Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-15',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'K-Means Clustering',
    dayRange: 'Day 15',
    description: 'Centroid intuition, elbow method, silhouette score, why initialisation matters.',
    order: 15,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: K-Means', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA' },
      { title: 'sklearn Clustering guide', url: 'https://scikit-learn.org/stable/modules/clustering.html' },
      { title: 'Krish Naik: K-Means', url: 'https://www.youtube.com/watch?v=4b5d3muPQmA' }
    ],
    note: { id: 'note-ml-day-15', topicId: 'ml-day-15', markdown: mlDay15Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-16',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Hierarchical Clustering + DBSCAN',
    dayRange: 'Day 16',
    description: 'When K-Means fails. Density-based vs distance-based clustering. Dendrograms.',
    order: 16,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: Hierarchical Clustering', url: 'https://www.youtube.com/watch?v=7xHsRkOdVwo' },
      { title: 'StatQuest: DBSCAN', url: 'https://www.youtube.com/watch?v=RDZUdRSDOok' }
    ],
    note: { id: 'note-ml-day-16', topicId: 'ml-day-16', markdown: mlDay16Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-17',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'PCA & Dimensionality Reduction',
    dayRange: 'Day 17',
    description: 'Eigenvectors, variance explained, when PCA hurts more than helps. Bonus: t-SNE / UMAP for visualisation.',
    order: 17,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'StatQuest: PCA', url: 'https://www.youtube.com/watch?v=FgakZw6K1QQ' },
      { title: 'StatQuest: t-SNE', url: 'https://www.youtube.com/watch?v=NEaUSP4YerM' },
      { title: 'sklearn Decomposition', url: 'https://scikit-learn.org/stable/modules/decomposition.html' }
    ],
    note: { id: 'note-ml-day-17', topicId: 'ml-day-17', markdown: mlDay17Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-18',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Feature Engineering & Feature Selection',
    dayRange: 'Day 18',
    description: 'Encoding (one-hot, target, frequency), binning, interactions, scaling, leakage prevention.',
    order: 18,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Kaggle: Feature Engineering', url: 'https://www.kaggle.com/learn/feature-engineering' },
      { title: 'Krish Naik: Feature Engineering', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVPwYGE2PXD3x0bfKnR0cJjN' },
      { title: 'sklearn Pipelines + ColumnTransformer', url: 'https://scikit-learn.org/stable/modules/compose.html' }
    ],
    note: { id: 'note-ml-day-18', topicId: 'ml-day-18', markdown: mlDay18Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-19',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'End-to-end sklearn Pipelines + Imbalanced Data',
    dayRange: 'Day 19',
    description: 'Pipeline + ColumnTransformer = no more data leakage. Combine preprocessing + model in one object you can save and ship.',
    order: 19,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'sklearn Pipeline tutorial', url: 'https://scikit-learn.org/stable/auto_examples/compose/plot_column_transformer_mixed_types.html' },
      { title: 'Krish Naik: sklearn Pipelines', url: 'https://www.youtube.com/watch?v=h1BnRBzYjYY' },
      { title: 'Imbalanced-learn pipelines', url: 'https://imbalanced-learn.org/stable/common_pitfalls.html' }
    ],
    note: { id: 'note-ml-day-19', topicId: 'ml-day-19', markdown: mlDay19Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-20',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'Model Deployment 101: FastAPI + Docker',
    dayRange: 'Day 20',
    description: 'Save a model with joblib, wrap it in a FastAPI endpoint, run it locally, optionally containerise.',
    order: 20,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'FastAPI official tutorial', url: 'https://fastapi.tiangolo.com/tutorial/' },
      { title: 'Krish Naik: Deploy ML model with FastAPI', url: 'https://www.youtube.com/watch?v=NWyx7s9FrUE' },
      { title: 'Made With ML', url: 'https://madewithml.com/' }
    ],
    note: { id: 'note-ml-day-20', topicId: 'ml-day-20', markdown: mlDay20Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  },
  {
    id: 'ml-day-21',
    sectionId: 'sec-aiml-ml-foundations',
    title: 'ML System Design + Interview Pattern Matching',
    dayRange: 'Day 21',
    description: 'Design a recommendation system or churn prediction service. Understand data → features → model → evaluation → serving → monitoring.',
    order: 21,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Chip Huyen: ML System Design', url: 'https://huyenchip.com/machine-learning-systems-design/toc.html' },
      { title: 'Stanford CS329S', url: 'https://stanford-cs329s.github.io/' },
      { title: 'Krish Naik: End-to-end ML lifecycle', url: 'https://www.youtube.com/playlist?list=PLZoTAELRMXVOAvUbePMxYJ4cF60E_a4w-' }
    ],
    note: { id: 'note-ml-day-21', topicId: 'ml-day-21', markdown: mlDay21Content, keyTakeaways: [], relatedTopics: [], images: [], lastUpdated: new Date().toISOString() }
  }
];

export const DEEP_LEARNING_TOPICS: Topic[] = [
  {
    id: 'dl-m-1',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Math for Deep Learning',
    dayRange: 'Days 1–3',
    description: 'Linear algebra basics, vectors, tensors, matrix operations, norms, eigenvalues, eigen decomposition, SVD.',
    order: 1,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: '3Blue1Brown – Linear Algebra' },
      { title: 'Understanding Deep Learning – Simon Prince' },
      { title: 'CS7015 / IIT Madras course page' }
    ],
    note: deepLearningNote('deep-learning-dldays-1-3-math-for-deep-learning', 'dl-m-1', dlDays13Content),
  },
  {
    id: 'dl-m-2',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Probability + Information Theory',
    dayRange: 'Days 4–5',
    description: 'Probability, probability distributions, chain rule, Bayes theorem, entropy, cross-entropy, information theory.',
    order: 2,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Probability + Statistics' },
      { title: 'MIT 6.S191 course' },
      { title: 'CS7015 / Mitesh Khapra NPTEL' }
    ],
    note: deepLearningNote('deep-learning-dldays-4-5-probability-information-theory', 'dl-m-2', dlDays45Content),
  },
  {
    id: 'dl-m-3',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Neural Network Basics',
    dayRange: 'Days 6–10',
    description: 'XOR, perceptron, shallow neural network, MLP, activation functions, forward propagation, PyTorch basics.',
    order: 3,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days of Deep Learning – Days 2–13' },
      { title: 'CampusX course page' },
      { title: 'Sachin Soni – PyTorch Neural Networks' },
      { title: 'MIT 6.S191 YouTube playlist' }
    ],
    note: deepLearningNote('deep-learning-dldays-6-10-neural-network-basics', 'dl-m-3', dlDays610Content),
  },
  {
    id: 'dl-m-4',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Loss, Backpropagation + Gradient Descent',
    dayRange: 'Days 11–14',
    description: 'Loss functions, backpropagation, chain rule in networks, gradient descent, stochastic/mini-batch GD, autograd.',
    order: 4,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days DL – Days 14–19' },
      { title: 'Sachin Soni – PyTorch Autograd' },
      { title: 'DeepLearning.AI Deep Learning Specialization' }
    ],
    note: deepLearningNote('deep-learning-dldays-11-14-loss-backpropagation-gradient-descent', 'dl-m-4', dlDays1114Content),
  },
  {
    id: 'dl-m-5',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Regularization + Generalization',
    dayRange: 'Days 15–18',
    description: 'Underfitting, overfitting, L1, L2, early stopping, dropout, vanishing/exploding gradients.',
    order: 5,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days DL – Days 20–26' },
      { title: 'CampusX notes' },
      { title: 'CS7015 / IIT Madras course page' }
    ],
    note: deepLearningNote('deep-learning-dldays-15-18-regularization-generalization', 'dl-m-5', dlDays1518Content),
  },
  {
    id: 'dl-m-6',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Initialization, Normalization + Optimization',
    dayRange: 'Days 19–22',
    description: 'Random/zero/Xavier/Kaiming initialization, batch normalization, layer normalization, learning rate, momentum, NAG, AdaGrad, RMSProp, Adam, hyperparameter tuning, double descent intuition.',
    order: 6,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days DL – Days 27–39' },
      { title: 'Understanding Deep Learning book' },
      { title: 'CS7015 / Mitesh Khapra NPTEL' }
    ],
    note: deepLearningNote('deep-learning-dldays-19-22-initialization-normalization-optimization', 'dl-m-6', dlDays1922Content),
  },
  {
    id: 'dl-m-7',
    sectionId: 'sec-aiml-deep-learning',
    title: 'CNN Fundamentals + Project',
    dayRange: 'Days 23–30',
    description: 'Convolution, padding, stride, pooling, receptive field, CNN architecture, CNN vs ANN, CNN backprop, data augmentation, transfer learning.',
    order: 7,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days DL – Days 40–53' },
      { title: 'Stanford CS231n course' },
      { title: 'Stanford CS231n notes' },
      { title: 'CS231n YouTube playlist' }
    ],
    note: deepLearningNote('deep-learning-dldays-23-30-cnn-fundamentals-project', 'dl-m-7', dlDays2330Content),
  },
  {
    id: 'dl-m-8',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Advanced CNN Architectures',
    dayRange: 'Days 31–35',
    description: 'AlexNet, VGG, ResNet, residual connections, batch normalization, semantic segmentation, UNet, R-CNN, Fast/Faster R-CNN.',
    order: 8,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CS231n YouTube playlist' },
      { title: 'CampusX CNN foundation videos' }
    ],
    note: deepLearningNote('deep-learning-dldays31-35-advanced-cnn-architectures', 'dl-m-8', dlDays3135Content),
  },
  {
    id: 'dl-m-9',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Sequence Modeling',
    dayRange: 'Days 36–40',
    description: 'Unfolding computational graphs, RNN, BPTT, bidirectional RNN, long-term dependency, LSTM, GRU/gated RNNs.',
    order: 9,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days DL – Days 55–66' },
      { title: 'Colah – Understanding LSTM Networks' },
      { title: 'MIT 6.S191 YouTube playlist' }
    ],
    note: deepLearningNote('deep-learning-dldays36-40-sequence-modeling', 'dl-m-9', dlDays3640Content),
  },
  {
    id: 'dl-m-10',
    sectionId: 'sec-aiml-deep-learning',
    title: 'NLP Fundamentals',
    dayRange: 'Days 41–44',
    description: 'Tokenization, BoW, TF-IDF, CBOW, Word2Vec, GloVe, word embeddings, embedding applications.',
    order: 10,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Jay Alammar – Illustrated Word2Vec' },
      { title: 'Stanford CME295 syllabus – NLP + embeddings' },
      { title: 'DeepLearning.AI courses' }
    ],
    note: deepLearningNote('deep-learning-dldays41-44-nlp-fundamentals', 'dl-m-10', dlDays4144Content),
  },
  {
    id: 'dl-m-11',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Transformers + Attention',
    dayRange: 'Days 45–51',
    description: 'Processing text data, dot-product self-attention, scaled self-attention, attention coefficients, multi-head attention, network parameters, transformer layers, computational complexity, positional encoding, encoder-only and decoder-only transformers, long sequence transformers.',
    order: 11,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'CampusX 100 Days DL – Days 71–84' },
      { title: 'Jay Alammar – Illustrated Transformer' },
      { title: 'Stanford CME295 Transformers & LLMs' },
      { title: 'Stanford CME295 YouTube playlist' }
    ],
    note: deepLearningNote('deep-learning-dldays45-51-transformers-attention', 'dl-m-11', dlDays4551Content),
  },
  {
    id: 'dl-m-12',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Fine-tuning, LoRA + Distillation',
    dayRange: 'Days 52–55',
    description: 'Transformer fine-tuning, layer freezing, low-rank approximation, LoRA, QLoRA, PEFT, knowledge distillation, soft vs hard targets.',
    order: 12,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Hugging Face Smol Course' },
      { title: 'Hugging Face Smol Training Playbook' },
      { title: 'Sachin Soni – QLoRA' },
      { title: 'Sachin Soni – Instruction Fine-Tuning' },
      { title: 'LoRA paper' },
      { title: 'QLoRA paper' }
    ],
    note: deepLearningNote('deep-learning-dldays52-55-fine-tuning-lora-distillation', 'dl-m-12', dlDays5255Content),
  },
  {
    id: 'dl-m-13',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Vision Transformers + Multimodal AI',
    dayRange: 'Days 56–57',
    description: 'Image patching, linear projection, CLS token mechanics, ViT architecture, image-to-sequence conversion, CLIP architecture, cross-modal embeddings, attention map mimicking, text-to-image synthesis basics.',
    order: 13,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Pinecone – Vision Transformers explained' },
      { title: 'OpenAI – CLIP' },
      { title: 'D2L – Vision Transformer' },
      { title: 'Stanford CS231n' }
    ],
    note: deepLearningNote('deep-learning-dldays56-57-vision-transformers-multimodal-ai', 'dl-m-13', dlDays5657Content),
  },
  {
    id: 'dl-m-14',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Autoencoders + VAE',
    dayRange: 'Days 58–59',
    description: 'Autoencoders, undercomplete autoencoders, regularized autoencoders, denoising autoencoders, representational power, variational autoencoders, applications.',
    order: 14,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Sachin Soni – VAE in simple language' },
      { title: 'TensorFlow – Autoencoder tutorial' },
      { title: 'Understanding Deep Learning book' }
    ],
    note: deepLearningNote('deep-learning-dldays58-59-autoencoders-vae', 'dl-m-14', dlDays5859Content),
  },
  {
    id: 'dl-m-15',
    sectionId: 'sec-aiml-deep-learning',
    title: 'Placement Readiness + Portfolio Packaging',
    dayRange: 'Day 60',
    description: 'Project storytelling, GitHub cleanup, README, demo video, resume bullet, mock project deep-dive, role-wise prioritization.',
    order: 15,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [],
    note: deepLearningNote('deep-learning-dlday60-placement-readiness-portfolio-packaging', 'dl-m-15', dlDay60Content),
  }
];

export const INTEGRATED_ROADMAP_TOPICS: Topic[] = [
  {
    id: 'int-m-1',
    sectionId: 'sec-aiml-generative-ai',
    title: 'AI/ML/DL/GenAI Orientation',
    dayRange: 'Days 1–3',
    description: 'ML vs traditional programming, AI vs ML vs DL vs GenAI, types of learning, ML task types.',
    order: 1,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'MS GenAI Beginners', url: 'https://github.com/microsoft/generative-ai-for-beginners' },
      { title: 'Microsoft AI Beginners', url: 'https://github.com/microsoft/AI-For-Beginners' }
    ],
    note: generativeAINote('generative-ai-genaidays1-3-aimldlgenai-orientation', 'int-m-1', genaiDays13Content),
  },
  {
    id: 'int-m-2',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Data Preprocessing Basics',
    dayRange: 'Days 4–6',
    description: 'Missing values, feature scaling, data encoding methods.',
    order: 2,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Scikit-learn Preprocessing', url: 'https://scikit-learn.org/stable/modules/preprocessing.html' },
      { title: 'Google GenAI Developers', url: 'https://ai.google.dev/gemini-api/docs' }
    ],
    note: generativeAINote('generative-ai-genaidays4-6-data-preprocessing-basics', 'int-m-2', genaiDays46Content),
  },
  {
    id: 'int-m-3',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Classical ML Foundation',
    dayRange: 'Days 7–10',
    description: 'Linear regression, logistic regression, sigmoid, model formulation, assumptions, limitations.',
    order: 3,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Microsoft AI Beginners', url: 'https://github.com/microsoft/AI-For-Beginners' },
      { title: 'Scikit-learn Model Evaluation', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' }
    ],
    note: generativeAINote('generative-ai-genaidays7-10-classical-ml-foundation', 'int-m-3', genaiDays710Content),
  },
  {
    id: 'int-m-4',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Model Evaluation',
    dayRange: 'Days 11–13',
    description: 'Confusion matrix, precision, recall, F1, MAE, MSE, RMSE, R-squared, adjusted R-squared.',
    order: 4,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Scikit-learn Model Evaluation', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' },
      { title: 'Microsoft AI Beginners', url: 'https://github.com/microsoft/AI-For-Beginners' }
    ],
    note: generativeAINote('generative-ai-genaidays11-13-model-evaluation', 'int-m-4', genaiDays1113Content),
  },
  {
    id: 'int-m-5',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Bias, Variance & Decision Trees',
    dayRange: 'Days 14–16',
    description: 'Bias, variance, bias-variance tradeoff, decision trees, impurity, information gain, regression trees.',
    order: 5,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Microsoft AI Beginners', url: 'https://github.com/microsoft/AI-For-Beginners' },
      { title: 'Scikit-learn Model Evaluation', url: 'https://scikit-learn.org/stable/modules/model_evaluation.html' }
    ],
    note: generativeAINote('generative-ai-genaidays14-16-bias-variance-decision-trees', 'int-m-5', genaiDays1416Content),
  },
  {
    id: 'int-m-6',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Neural Network Foundation',
    dayRange: 'Days 17–20',
    description: 'Perceptron, activation functions, feed-forward networks, MLP, backpropagation intuition.',
    order: 6,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'DeepLearning.AI Neural Networks', url: 'https://www.coursera.org/specializations/deep-learning' },
      { title: 'HF LLM Course', url: 'https://huggingface.co/learn/llm-course' }
    ],
    note: generativeAINote('generative-ai-genaidays17-20-neural-network-foundation', 'int-m-6', genaiDays1720Content),
  },
  {
    id: 'int-m-7',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Generative AI Overview',
    dayRange: 'Days 21–23',
    description: 'Text generation, summarization, code generation, image generation, audio generation, common business use cases.',
    order: 7,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'MS GenAI Beginners', url: 'https://github.com/microsoft/generative-ai-for-beginners' },
      { title: 'Google GenAI Developers', url: 'https://ai.google.dev/gemini-api/docs' }
    ],
    note: generativeAINote('generative-ai-genaidays21-23-generative-ai-overview', 'int-m-7', genaiDays2123Content),
  },
  {
    id: 'int-m-8',
    sectionId: 'sec-aiml-generative-ai',
    title: 'LLM Architecture',
    dayRange: 'Days 24–28',
    description: 'Transformer, tokens, embeddings, self-attention, context window, encoder/decoder overview.',
    order: 8,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'HF LLM Course', url: 'https://huggingface.co/learn/llm-course' },
      { title: 'MS GenAI Beginners', url: 'https://github.com/microsoft/generative-ai-for-beginners' }
    ],
    note: generativeAINote('generative-ai-days-24-28-llm-architecture', 'int-m-8', genaiDays2428Content),
  },
  {
    id: 'int-m-9',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Responsible AI',
    dayRange: 'Days 29–31',
    description: 'Ethical considerations, bias mitigation, misinformation prevention, fairness principles, hallucination risk.',
    order: 9,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Google GenAI Developers', url: 'https://ai.google.dev/gemini-api/docs' },
      { title: 'MS GenAI Beginners', url: 'https://github.com/microsoft/generative-ai-for-beginners' }
    ],
    note: generativeAINote('generative-ai-days-29-31-responsible-ai', 'int-m-9', genaiDays2931Content),
  },
  {
    id: 'int-m-10',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Prompt Engineering',
    dayRange: 'Days 32–35',
    description: 'Prompt design principles, zero-shot prompting, one-shot prompting, few-shot prompting, chain-of-thought, prompt refinement, output evaluation.',
    order: 10,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'OpenAI Prompting', url: 'https://platform.openai.com/docs/guides/prompt-engineering' },
      { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/' }
    ],
    note: generativeAINote('generative-ai-days-32-35-prompt-engineering', 'int-m-10', genaiDays3235Content),
  },
  {
    id: 'int-m-11',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Fine-Tuning Concepts',
    dayRange: 'Days 36–38',
    description: 'Fine-tuning vs prompting, when to fine-tune, instruction tuning, knowledge source selection.',
    order: 11,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'MS GenAI Beginners', url: 'https://github.com/microsoft/generative-ai-for-beginners' },
      { title: 'HF LLM Course', url: 'https://huggingface.co/learn/llm-course' }
    ],
    note: generativeAINote('generative-ai-days-36-38-fine-tuning-concepts', 'int-m-11', genaiDays3638Content),
  },
  {
    id: 'int-m-12',
    sectionId: 'sec-aiml-generative-ai',
    title: 'LLM Tooling Ecosystem',
    dayRange: 'Days 39–41',
    description: 'Hugging Face Hub, Transformers library, pipeline function, model cards, inference basics.',
    order: 12,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'HF Pipelines Docs', url: 'https://huggingface.co/docs/transformers/main_classes/pipelines' },
      { title: 'HF LLM Course', url: 'https://huggingface.co/learn/llm-course' }
    ],
    note: generativeAINote('generative-ai-days-39-41-llm-tooling-ecosystem', 'int-m-12', genaiDays3941Content),
  },
  {
    id: 'int-m-13',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Commercial APIs',
    dayRange: 'Days 42–44',
    description: 'OpenAI API, Gemini API, API keys, cost and billing, rate limits, embeddings, safe key handling.',
    order: 13,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'OpenAI API Quickstart', url: 'https://platform.openai.com/docs/quickstart' },
      { title: 'Gemini API Quickstart', url: 'https://ai.google.dev/gemini-api/docs/quickstart' }
    ],
    note: generativeAINote('generative-ai-days-42-44-commercial-apis', 'int-m-13', genaiDays4244Content),
  },
  {
    id: 'int-m-14',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Managing State in Chatbots',
    dayRange: 'Days 45–47',
    description: 'Memory challenge, multi-turn conversation, context management, passing conversation history.',
    order: 14,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'MS GenAI Beginners', url: 'https://github.com/microsoft/generative-ai-for-beginners' },
      { title: 'OpenAI API Quickstart', url: 'https://platform.openai.com/docs/quickstart' }
    ],
    note: generativeAINote('generative-ai-days-45-47-managing-state-in-chatbots', 'int-m-14', genaiDays4547Content),
  },
  {
    id: 'int-m-15',
    sectionId: 'sec-aiml-generative-ai',
    title: 'RAG Introduction',
    dayRange: 'Days 48–52',
    description: 'RAG, grounding LLMs, external data integration, document loading, chunking, retrieval, answer generation.',
    order: 15,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'LangChain RAG Tutorial', url: 'https://docs.langchain.com/oss/python/langchain/rag' },
      { title: 'LangChain Retrieval Tutorial', url: 'https://docs.langchain.com/oss/python/langchain/retrieval' }
    ],
    note: generativeAINote('generative-ai-days-48-52-rag-introduction', 'int-m-15', genaiDays4852Content),
  },
  {
    id: 'int-m-16',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Vector Databases & Embeddings',
    dayRange: 'Days 53–55',
    description: 'Embedding models, similarity search, Chroma, FAISS, top-k retrieval, metadata filtering basics.',
    order: 16,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Chroma Docs', url: 'https://docs.trychroma.com/' },
      { title: 'FAISS Docs', url: 'https://faiss.ai/' }
    ],
    note: generativeAINote('generative-ai-days-53-55-vector-databases-and-embeddings', 'int-m-16', genaiDays5355Content),
  },
  {
    id: 'int-m-17',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Rapid Prototyping Tools',
    dayRange: 'Days 56–57',
    description: 'Streamlit, Gradio, building data apps, ML/LLM UIs with Python.',
    order: 17,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'Streamlit Get Started', url: 'https://docs.streamlit.io/get-started' },
      { title: 'Gradio Quickstart', url: 'https://www.gradio.app/guides/quickstart' }
    ],
    note: generativeAINote('generative-ai-days-56-57-rapid-prototyping-tools', 'int-m-17', genaiDays5657Content),
  },
  {
    id: 'int-m-18',
    sectionId: 'sec-aiml-generative-ai',
    title: 'Agentic AI',
    dayRange: 'Days 58–59',
    description: 'Agentic AI definition, LLM as brain, tools integration, memory, planning, ReAct framework, Reason + Act.',
    order: 18,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'OpenAI Agents Quickstart', url: 'https://platform.openai.com/docs/guides/agents' },
      { title: 'LangGraph Agentic RAG', url: 'https://docs.langchain.com/oss/python/langgraph/agentic-rag' }
    ],
    note: generativeAINote('generative-ai-days-58-59-agentic-ai', 'int-m-18', genaiDays5859Content),
  },
  {
    id: 'int-m-19',
    sectionId: 'sec-aiml-generative-ai',
    title: 'LangGraph + n8n + Portfolio Wrap',
    dayRange: 'Day 60',
    description: 'LangGraph graphs, nodes, edges, state, n8n visual workflows, nodes, credentials, triggers, AI Agent node.',
    order: 19,
    status: 'NOT_STARTED',
    createdAt: new Date().toISOString(),
    resources: [
      { title: 'LangGraph Overview', url: 'https://docs.langchain.com/oss/python/langgraph/overview' },
      { title: 'n8n AI Agent Node', url: 'https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/' }
    ],
    note: generativeAINote('generative-ai-days-60-60-langgraph-n8n-portfolio-wrap', 'int-m-19', genaiDay60Content),
  }
];

export const AIML_SECTIONS: Section[] = [
  {
    id: 'sec-aiml-ml-foundations',
    trackId: 'track-ai-ml',
    title: 'ML Foundations',
    description: '21-day structured roadmap from Python/NumPy basics to production ML pipelines and system design.',
    order: 1,
    isComingSoon: false,
    topics: ML_FOUNDATIONS_TOPICS,
    subsections: []
  },
  {
    id: 'sec-aiml-deep-learning',
    trackId: 'track-ai-ml',
    title: 'Deep Learning',
    description: '60-day deep learning roadmap across 15 grouped milestones: Neural networks, CNNs, RNNs, Transformers, LoRA, and Multimodal AI.',
    order: 2,
    isComingSoon: false,
    topics: DEEP_LEARNING_TOPICS,
    subsections: []
  },
  {
    id: 'sec-aiml-generative-ai',
    trackId: 'track-ai-ml',
    title: 'Generative AI',
    description: 'A practical 60-day journey from AI/ML fundamentals to Generative AI, RAG, Agentic AI and portfolio development across 19 milestones.',
    order: 3,
    isComingSoon: false,
    topics: INTEGRATED_ROADMAP_TOPICS,
    subsections: []
  }
];
