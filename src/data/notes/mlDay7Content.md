# Consolidation + Start the Week-1 ML Project

**Day 7 — ML Foundations**

> **Goal:** Revisit the foundations from Days 1–6 in one clean, reproducible Jupyter notebook, then start a small end-to-end machine-learning project. The focus is connecting the concepts into one workflow—not learning a large number of new algorithms today.

---

## Learning Flow

1. Review Python, NumPy, Pandas, and EDA.
2. Review linear algebra and statistics used in ML.
3. Review linear regression, logistic regression, and Gradient Descent.
4. Review model evaluation and validation.
5. Set up a clean consolidation notebook.
6. Choose and frame the Week-1 project.
7. Acquire, inspect, and explore project data.
8. Create a leakage-safe train/validation/test strategy.
9. Build a reproducible preprocessing pipeline.
10. Establish a baseline and train first models.
11. Evaluate, document, and plan the next iteration.

---

# 1. Why Consolidate Before Moving On?

During Days 1–6, you learned individual building blocks:

| Day | Topic | Core capability |
|---|---|---|
| Day 1 | Python + NumPy for ML | Work with numerical arrays and vectorized operations |
| Day 2 | Pandas + EDA | Load, inspect, clean, transform, join, and summarize data |
| Day 3 | Linear Algebra + Probability/Statistics | Understand vectors, matrices, distributions, and uncertainty |
| Day 4 | Linear Regression | Predict continuous values with least squares and Gradient Descent |
| Day 5 | Logistic Regression + Gradient Descent | Predict binary class probabilities |
| Day 6 | Model Evaluation | Validate models and interpret task-appropriate metrics |
| Day 7 | Consolidation + Project | Connect the full workflow and start a real project |

A working ML practitioner must connect these steps. A model is only one part of a larger system:

**Problem → Data → EDA → Preparation → Model → Evaluation → Communication**

## 1.1 What should be in the consolidation notebook?

Create one notebook that contains concise explanations, small examples, and runnable code for the key concepts from Days 1–6.

The notebook is a personal reference and should be executable from top to bottom. Avoid copying every paragraph from the previous lecture notes.

---

# 2. Consolidation Notebook: Environment and Structure

Create a Jupyter notebook named:

`week1_ml_foundations_consolidation.ipynb`

Use this section order:

1. Environment setup and imports.
2. Python and NumPy essentials.
3. Pandas data handling and EDA.
4. Linear algebra and statistics quick reference.
5. Linear regression.
6. Logistic regression.
7. Model evaluation.
8. A small integrated example.
9. Final checklist and reflection.

## 2.1 Recommended imports

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.model_selection import (
    train_test_split,
    cross_val_score,
    KFold,
    StratifiedKFold
)
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score
)

SEED = 42
np.random.seed(SEED)
```

Use a modern `np.random.default_rng(SEED)` generator for new random-data examples. Setting the legacy global seed is included only where a library or example still relies on it.

## 2.2 Notebook quality rules

- Use Markdown cells to explain the goal of each section.
- Keep code cells short enough to understand.
- Run cells in order from a fresh kernel.
- Display useful outputs and shapes.
- Include assertions for important assumptions.
- Keep raw data unchanged; create working copies.
- Avoid unexplained variables and hidden notebook state.
- Do not include huge output dumps.
- Record package versions if reproducibility matters.

---

# 3. Review: Python and NumPy Essentials

## 3.1 Python patterns

Revisit:

- Variables, numeric and string types.
- Lists, tuples, dictionaries, and sets.
- Loops and conditionals.
- Functions and return values.
- Comprehensions.
- Exceptions.
- Imports and modules.
- Mutability and copying.

Example function:

```python
def calculate_mean(values):
    if len(values) == 0:
        raise ValueError("values must not be empty")
    return sum(values) / len(values)

calculate_mean([10, 20, 30])
```

## 3.2 NumPy array foundations

```python
import numpy as np

X = np.array([
    [2.0, 70.0],
    [4.0, 80.0],
    [6.0, 90.0]
])

print("Shape:", X.shape)
print("Dimensions:", X.ndim)
print("Data type:", X.dtype)
print("Column means:", X.mean(axis=0))
```

Remember:

- `shape` gives the size of each dimension.
- `axis=0` aggregates down rows, producing one result per column.
- `axis=1` aggregates across columns, producing one result per row.
- Broadcasting allows operations between compatible shapes.
- Boolean masks select values based on conditions.
- Vectorization reduces Python-level loop overhead.

## 3.3 Core NumPy operations

```python
a = np.array([2, 3])
b = np.array([4, 1])

print("Addition:", a + b)
print("Element-wise:", a * b)
print("Dot product:", np.dot(a, b))
print("L2 norm:", np.linalg.norm(a))
print("Matrix product:", X @ np.array([1.0, 0.5]))
```

Do not confuse:
- `*`: element-wise multiplication.
- `@`: matrix multiplication.
- `np.dot`: dot product or matrix product depending on input dimensions.

---

# 4. Review: Pandas and EDA

## 4.1 Load and inspect

```python
df = pd.read_csv("your_dataset.csv")

print("Shape:", df.shape)
display(df.head())
df.info()
display(df.describe(include="all"))
```

Core inspection checklist:

- Number of rows and columns.
- Column names and types.
- Missing-value counts and percentages.
- Duplicate records.
- Numerical ranges and distributions.
- Categorical frequencies.
- Target distribution.
- Potential data leakage.

## 4.2 Select, filter, and transform

```python
# Select columns
subset = df[["feature_a", "feature_b"]]

# Filter rows
filtered = df.loc[df["feature_a"] > 0]

# Sort
sorted_df = df.sort_values("feature_a", ascending=False)

# Create a derived feature
df["feature_sum"] = df[["feature_a", "feature_b"]].sum(axis=1)
```

## 4.3 Missing values and duplicates

```python
print(df.isna().sum())
print("Duplicate rows:", df.duplicated().sum())

df_clean = df.drop_duplicates().copy()
```

Do not fill every missing value with the same strategy. Select an approach based on the feature type, missingness pattern, and modelling objective.

## 4.4 Grouping and joining

```python
# Aggregation
summary = df.groupby("category_column").agg(
    row_count=("category_column", "size")
)

# Key-based join
combined = pd.merge(
    left_df,
    right_df,
    on="id",
    how="left",
    validate="one_to_one"
)
```

Use `validate` when the intended relationship between join keys is known. Check row counts after joins.

## 4.5 EDA visualizations

```python
df["numeric_feature"].hist(bins=20)
plt.title("Feature Distribution")
plt.xlabel("Value")
plt.ylabel("Frequency")
plt.show()
```

Use:
- Histograms for numerical distributions.
- Box plots for spread and potential outliers.
- Bar charts for category counts.
- Scatter plots for numerical relationships.
- Correlation matrices for linear associations among numerical variables.

A visualization should answer a question. Correlation does not establish causation.

---

# 5. Review: Linear Algebra and Statistics

## 5.1 Dataset representation

For `m` samples and `n` features:

\[
X\in\mathbb{R}^{m\times n}
\]

Each row represents one sample; each column represents one feature. In supervised learning, `y` contains the target values.

## 5.2 Dot product and linear prediction

\[
\hat{y}=\mathbf{w}^{T}\mathbf{x}+b
\]

A dot product multiplies corresponding feature and weight values, then sums the products. It is the central operation in a linear prediction.

## 5.3 Mean and variance

\[
\bar{x}=\frac{1}{n}\sum_{i=1}^{n}x_i
\]

\[
\sigma^2=\frac{1}{N}\sum_{i=1}^{N}(x_i-\mu)^2
\]

Mean describes the arithmetic centre; variance describes squared spread. Standard deviation is the square root of variance and uses the original units.

## 5.4 Probability reminders

- Probability lies between 0 and 1.
- Conditional probability is \(P(A|B)=P(A\cap B)/P(B)\), when \(P(B)>0\).
- Independence means one event does not change the probability of the other.
- Bayes' rule updates a prior using evidence.

\[
P(A|B)=\frac{P(B|A)P(A)}{P(B)}
\]

---

# 6. Review: Linear Regression

## 6.1 Model

\[
\hat{y}=b_0+b_1x
\]

For multiple features:

\[
\hat{\mathbf{y}}=X\mathbf{w}+b
\]

## 6.2 MSE cost

\[
MSE=\frac{1}{m}\sum_{i=1}^{m}(y_i-\hat{y}_i)^2
\]

MSE averages squared residuals and gives larger errors greater influence.

## 6.3 Normal Equation

\[
\boldsymbol{\theta}=(X_b^TX_b)^{-1}X_b^T\mathbf{y}
\]

This is a closed-form least-squares expression when the inverse exists. In practical code, prefer a numerically robust least-squares solver or pseudoinverse rather than explicitly inverting a matrix.

## 6.4 Gradient Descent

\[
\boldsymbol{\theta}\leftarrow\boldsymbol{\theta}-\alpha\nabla J(\boldsymbol{\theta})
\]

The learning rate controls update size. A value that is too small can make learning slow; one that is too large can cause overshooting or divergence.

## 6.5 NumPy reminder

```python
from sklearn.metrics import mean_squared_error

y_pred = X @ weights + bias
mse = mean_squared_error(y, y_pred)
```

Be sure the weights and feature dimensions are compatible.

---

# 7. Review: Logistic Regression

## 7.1 Linear score and sigmoid

\[
z=\mathbf{w}^{T}\mathbf{x}+b
\]

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

The sigmoid maps the score to a probability between 0 and 1.

## 7.2 Decision threshold

For a default threshold of 0.5:

\[
\hat y =
\begin{cases}
1 & \hat p\geq0.5\\
0 & \hat p<0.5
\end{cases}
\]

The threshold should reflect validation performance and the costs of different mistakes.

## 7.3 Binary cross-entropy

\[
J=-\frac{1}{m}\sum_{i=1}^{m}
\left[y_i\log(\hat p_i)+(1-y_i)\log(1-\hat p_i)\right]
\]

It penalizes confident incorrect probabilities and is the standard loss for binary logistic regression.

## 7.4 Gradient updates

\[
dw=\frac{X^T(\hat p-y)}{m}
\qquad
db=\frac{1}{m}\sum_{i=1}^{m}(\hat p_i-y_i)
\]

\[
w\leftarrow w-\alpha dw
\qquad
b\leftarrow b-\alpha db
\]

---

# 8. Review: Model Evaluation

## 8.1 Regression metrics

| Metric | Meaning |
|---|---|
| MAE | Average absolute error |
| MSE | Average squared error |
| RMSE | Square root of MSE; target units |
| R² | Performance relative to predicting the target mean |

## 8.2 Classification metrics

| Metric | Meaning |
|---|---|
| Accuracy | Fraction of predictions correct |
| Precision | TP / (TP + FP) |
| Recall | TP / (TP + FN) |
| F1 | Harmonic mean of precision and recall |
| ROC-AUC | Ranking performance across thresholds |
| Confusion matrix | TP, TN, FP, FN counts |

Accuracy alone can be misleading when classes are imbalanced.

## 8.3 Split strategy

- Training set: fit parameters.
- Validation set: choose models, hyperparameters, and thresholds.
- Test set: final evaluation after decisions are complete.

K-fold cross-validation provides repeated train/validation estimates. Use stratified folds for classification where appropriate, group-aware folds for grouped data, and time-aware splits for temporal data.

**Never fit a scaler, imputer, feature selector, or other learned preprocessing step on the full dataset before splitting.**

---

# 9. Week-1 Project: Start an End-to-End ML Problem

The purpose of the Day 7 project session is to begin a small, well-scoped project that uses the concepts from Days 1–6.

## 9.1 Project objective

Build a reproducible tabular machine-learning project that:

1. Starts with a clearly stated real-world question.
2. Uses a public, documented dataset.
3. Performs EDA and data-quality checks.
4. Creates a leakage-safe train/test strategy.
5. Builds a simple baseline model.
6. Compares one or more suitable ML models.
7. Evaluates with metrics appropriate to the target.
8. Documents findings, limitations, and next steps.

Do not attempt to build a production application today. The objective is a complete first modelling workflow.

## 9.2 Choose a project

Select one dataset that matches the skills practiced so far.

### Option A — Student Performance Prediction

**Problem:** Predict a student's final score using available study and academic features.

- Task: Regression if predicting a numerical final score.
- Possible data: study time, attendance, previous scores, and other permitted features.
- Metrics: MAE, RMSE, and R².
- Models: mean baseline and Linear Regression.

**Caution:** Check whether any feature contains information derived from the final score or would not be available at prediction time.

### Option B — Titanic Survival Prediction

**Problem:** Predict whether a passenger survived.

- Task: Binary classification.
- Possible data: passenger class, age, sex, family information, and fare.
- Metrics: confusion matrix, precision, recall, F1, and ROC-AUC.
- Models: majority-class baseline and Logistic Regression.

**Caution:** This is a learning dataset. Discuss missingness, class balance, and the limits of conclusions from historical data.

### Option C — California Housing Price Prediction

**Problem:** Predict median house value from available census and location features.

- Task: Regression.
- Possible data: income, house age, rooms, population, and geographical coordinates.
- Metrics: MAE, RMSE, and R².
- Models: mean baseline and Linear Regression.

**Caution:** Treat the dataset's geographic and historical scope as a limitation. Avoid presenting the model as a current property valuation service.

**Recommendation:** Choose one dataset only. Do not combine datasets or switch project topics midway through the first notebook.

---

# 10. Project Workflow

Follow this order. Keep the test set separate until final evaluation.

## Step 1 — Frame the problem

Write a short problem statement answering:

- What are we predicting?
- Who might use the prediction?
- What is one row in the dataset?
- What is the target column?
- Is this regression or classification?
- What metric best reflects the task?
- What would a simple baseline predict?
- What assumptions are being made?

Do not start by training a model before defining the objective.

## Step 2 — Acquire and understand data

- Use a trustworthy public dataset.
- Record its source and license/usage terms.
- Read its documentation or data dictionary.
- Keep the raw file unchanged.
- Create a working copy for analysis.
- Inspect the file size, row count, column count, and data types.

## Step 3 — Exploratory Data Analysis

At minimum:

1. Inspect `head()`, `shape`, `info()`, and `describe()`.
2. Identify the target and feature columns.
3. Calculate missing-value counts and percentages.
4. Check duplicate records.
5. Inspect unique values and category frequencies.
6. Plot important numerical distributions.
7. Compare important features with the target.
8. Inspect class balance for classification.
9. Investigate unusual values and possible leakage.
10. Write down at least five data observations.

Do not assume a correlation implies causation.

## Step 4 — Create the test split

For a typical independent tabular dataset, create a held-out test set before fitting learned transformations.

For classification, stratify by the target when appropriate. For time-dependent or grouped data, choose a split strategy that respects the data structure.

```python
from sklearn.model_selection import train_test_split

X = df.drop(columns=[target_column])
y = df[target_column]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y if task_type == "classification" else None
)
```

`task_type` and `target_column` are project variables that must be set explicitly before running this example. Do not pass `stratify` for regression.

## Step 5 — Build preprocessing pipelines

Separate numerical and categorical features.

```python
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

numeric_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("numeric", numeric_pipeline, numeric_features),
    ("categorical", categorical_pipeline, categorical_features)
])
```

Set `numeric_features` and `categorical_features` from the training feature columns. Exclude IDs and leakage columns unless there is a justified modelling reason to retain them.

The pipeline is fitted only on training data during model fitting.

## Step 6 — Establish a baseline

A baseline is a simple reference model. A more complex model should demonstrate measurable value over it.

For regression:

```python
from sklearn.dummy import DummyRegressor

baseline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", DummyRegressor(strategy="mean"))
])
baseline.fit(X_train, y_train)
```

For classification:

```python
from sklearn.dummy import DummyClassifier

baseline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", DummyClassifier(strategy="most_frequent"))
])
baseline.fit(X_train, y_train)
```

Use only the baseline that matches the selected task.

## Step 7 — Train the first real model

For regression:

```python
from sklearn.linear_model import LinearRegression

regression_model = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LinearRegression())
])

regression_model.fit(X_train, y_train)
```

For binary classification:

```python
from sklearn.linear_model import LogisticRegression

classification_model = Pipeline([
    ("preprocessor", preprocessor),
    ("model", LogisticRegression(max_iter=1000))
])

classification_model.fit(X_train, y_train)
```

Train only the model appropriate to the selected target. Do not use a regression estimator for a categorical target or a classifier for a continuous target.

## Step 8 — Validate model choices

Use cross-validation on the training data to estimate performance during development.

- Regression: consider MAE or RMSE as the scoring metric.
- Classification: consider F1, recall, precision, or ROC-AUC based on the problem.
- Use `KFold` for suitable regression settings.
- Use `StratifiedKFold` for classification where appropriate.
- Keep preprocessing inside the Pipeline so each fold fits its own transformations.

Do not use the held-out test set for repeated experimentation.

## Step 9 — Final test evaluation

After selecting the approach, evaluate it once on the test set using the metrics selected during problem framing.

For regression, report MAE, RMSE, and R².

For classification, report confusion matrix, precision, recall, F1, and ROC-AUC where probability scores are available and the metric is appropriate.

Compare against the baseline. Interpret the size and type of errors, not just the headline score.

## Step 10 — Document findings

Record:

- Problem and target.
- Dataset source and limitations.
- Dataset dimensions and feature types.
- Missingness and cleaning decisions.
- EDA observations.
- Split strategy.
- Preprocessing steps.
- Baseline result.
- Model and validation result.
- Final test result.
- Error analysis.
- Assumptions and limitations.
- Next experiments.

---

# 11. Project Deliverable and Folder Structure

Use a clean project directory:

```text
week1-ml-project/
│
├── data/
│   ├── raw/
│   └── processed/
│
├── notebooks/
│   └── week1_ml_project.ipynb
│
├── reports/
│   └── eda_and_model_summary.md
│
├── src/
│   └── preprocessing.py
│
├── README.md
└── requirements.txt
```

For a first project, do not over-engineer. The notebook is the primary deliverable. Create reusable source files only when they make the workflow clearer.

## Required notebook sections

1. Project title and objective.
2. Dataset source and description.
3. Imports and reproducibility setup.
4. Load data.
5. Initial inspection.
6. EDA and visualizations.
7. Data quality findings.
8. Target and feature selection.
9. Train/test split.
10. Preprocessing pipeline.
11. Baseline model.
12. First ML model.
13. Validation strategy.
14. Final test evaluation.
15. Error analysis.
16. Conclusions and next steps.

## Day 7 minimum completion criteria

By the end of this session, aim to have:

- [ ] One clean consolidation notebook covering Days 1–6.
- [ ] One project selected.
- [ ] A written problem statement and target definition.
- [ ] Dataset downloaded or loaded from a documented source.
- [ ] Initial data inspection completed.
- [ ] At least five EDA observations documented.
- [ ] A leakage-aware split strategy selected.
- [ ] A first baseline or project pipeline started.
- [ ] A clear list of remaining tasks for the next session.

The entire project does not need to be finished on Day 7. This day starts the project and creates a sound foundation for the next milestones.

---

# 12. Common Mistakes to Avoid

1. Creating a notebook with copied code cells that have no explanation.
2. Running cells out of order and relying on hidden notebook state.
3. Changing the project target after looking at test results.
4. Using the test set for repeated model selection.
5. Fitting scalers, imputers, or encoders before splitting.
6. Ignoring class imbalance in classification.
7. Reporting accuracy alone when positive cases are rare.
8. Comparing models with different splits or inconsistent preprocessing.
9. Removing outliers without investigating whether they are valid.
10. Failing to document the data source and assumptions.
11. Building an app before establishing a reliable baseline.
12. Claiming business impact from a learning dataset without evidence.

---

# 13. Placement and Interview Questions

### Q1. Why is a baseline model important?

**Answer:** It establishes a simple reference performance. A more sophisticated model should provide measurable improvement over this baseline to justify its complexity.

### Q2. Why should the test set be kept separate until the end?

**Answer:** Repeated decisions based on test performance cause information from the test set to influence model selection. This makes the final evaluation overly optimistic.

### Q3. What is the difference between validation and cross-validation?

**Answer:** A validation set is one held-out development split. Cross-validation repeats training and validation across several folds, providing multiple estimates of performance.

### Q4. Why use a Pipeline?

**Answer:** A Pipeline keeps preprocessing and model fitting together. During cross-validation, each transformation is fitted only on the training portion of that fold, reducing leakage risk and making the workflow reproducible.

### Q5. How do you choose between MAE and RMSE?

**Answer:** MAE treats error magnitude linearly and is easier to interpret. RMSE penalizes larger errors more strongly. The choice should reflect the impact of large mistakes in the application.

### Q6. Why can accuracy be misleading?

**Answer:** With imbalanced classes, predicting only the majority class can produce high accuracy while failing to detect the minority class. Precision, recall, F1, and the confusion matrix provide additional information.

### Q7. What would you include in an ML project README?

**Answer:** Problem statement, dataset source, setup instructions, notebook structure, preprocessing, model, evaluation method, results, limitations, and reproduction steps.

---

# 14. Final Revision Checklist

## Technical understanding

- [ ] I can manipulate NumPy arrays and reason about their shapes.
- [ ] I can load, inspect, clean, join, and aggregate data with Pandas.
- [ ] I understand vectors, matrices, dot products, mean, variance, and probability basics.
- [ ] I can explain the linear-regression model and MSE.
- [ ] I understand the Normal Equation and Gradient Descent.
- [ ] I can explain sigmoid, log-loss, and logistic-regression updates.
- [ ] I can choose appropriate regression and classification metrics.
- [ ] I understand train/validation/test separation and k-fold CV.
- [ ] I can identify common data-leakage paths.

## Project readiness

- [ ] The problem is clearly framed.
- [ ] The dataset source and target are documented.
- [ ] EDA has produced written observations.
- [ ] Preprocessing is reproducible.
- [ ] The test set has been kept out of model selection.
- [ ] A baseline exists.
- [ ] The first model is trained or the pipeline is ready.
- [ ] Evaluation metrics match the task.
- [ ] Limitations and next steps are documented.

---

# 15. Recommended Resources

1. [Hands-on Machine Learning — GitHub notebooks](https://github.com/ageron/handson-ml3)
   - Use the repository's early notebooks as practical references for the ML landscape and an end-to-end project.
   - Particularly relevant: `01_the_machine_learning_landscape.ipynb` and `02_end_to_end_machine_learning_project.ipynb`.
   - The repository also includes a project checklist covering problem framing, data acquisition, EDA, preparation, model shortlisting, tuning, presentation, and deployment/monitoring.

2. [Kaggle — Intro to Machine Learning](https://www.kaggle.com/learn/intro-to-machine-learning)
   - Guided practice with model fitting, validation, and decision-making using a notebook workflow.

**Study strategy:** Rebuild the important examples yourself. Use the resources as references, not as a substitute for understanding your own notebook.

---

**End of Day 7 — Consolidation + Start the Week-1 Project**

**Next step:** Continue the selected project by completing data preparation, cross-validation, model comparison, and a carefully held-out final evaluation.
