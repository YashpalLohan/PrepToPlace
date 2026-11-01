# Days 4–6 — Data Preprocessing Basics

## 1. Overview

Data preprocessing converts raw data into a consistent representation suitable for model training and inference.

This block covers:
- Identifying missing and invalid values.
- Imputation strategies.
- Feature scaling and normalisation.
- Categorical encoding.
- Train/validation/test separation.
- Pipelines that prevent preprocessing leakage.

## 2. Why Preprocessing Matters

Raw datasets often contain:
- Missing values.
- Duplicate rows.
- Inconsistent units and formats.
- Categorical variables.
- Outliers.
- Invalid values.
- Different numerical scales.

A model can learn misleading patterns if these issues are ignored. Preprocessing must be based on data meaning and the requirements of the selected model.

## 3. Inspect the Dataset First

Before transforming data, inspect:
- Number of rows and columns.
- Data types.
- Missing-value counts.
- Unique category values.
- Numeric ranges and distributions.
- Duplicate records.
- Target distribution.
- Potential leakage columns.

```python
import pandas as pd

df = pd.read_csv("data.csv")

print(df.shape)
print(df.info())
print(df.isna().sum().sort_values(ascending=False))
print(df.describe(include="all"))
print("Duplicate rows:", df.duplicated().sum())
```

Do not automatically drop every duplicate. Determine whether duplicates are erroneous repeated records or legitimate repeated events.

## 4. Missing Values

Missing values may occur because:
- A user did not provide an answer.
- A sensor failed.
- Data was not collected.
- A field does not apply.
- The value was lost during ingestion.

Missingness itself can carry information, but it can also be random or caused by a data-quality issue.

### Missingness patterns

- MCAR: Missing Completely At Random.
- MAR: Missing At Random conditional on observed variables.
- MNAR: Missingness depends on unobserved values or the missing value itself.

These are statistical assumptions; they cannot always be determined from the dataset alone.

## 5. Missing-Value Handling

### Row deletion
Drop rows when the number is small and deletion is justified.

Risk: losing data or changing the population distribution.

### Column deletion
Drop a feature when missingness is excessive or the feature is not useful.

Risk: removing important signal.

### Mean imputation
Replace missing numeric values with the training mean.

Sensitive to outliers.

### Median imputation
Replace missing numeric values with the training median.

Often more robust for skewed distributions.

### Mode / most-frequent imputation
Replace missing categorical values with the most frequent category.

### Constant or explicit category
Use a meaningful constant such as `"Unknown"` where absence itself may be informative.

### Missingness indicator
Add a binary feature indicating whether the original value was missing.

The correct strategy depends on why data is missing, the feature meaning, and validation performance.

## 6. Imputation with scikit-learn

```python
from sklearn.impute import SimpleImputer

numeric_imputer = SimpleImputer(strategy="median")
categorical_imputer = SimpleImputer(strategy="most_frequent")

X_num = numeric_imputer.fit_transform(X_numeric_train)
X_cat = categorical_imputer.fit_transform(X_categorical_train)
```

Fit imputers only on training data. Apply the fitted transformation to validation/test data.

## 7. Feature Scaling

Features can use different ranges and units.

Example:
- Age: 18–80.
- Annual income: 20,000–2,000,000.
- Purchase count: 0–100.

For distance-based or gradient-based models, larger-scale features may dominate optimisation or distance calculations.

Scaling is commonly important for:
- KNN.
- K-Means.
- SVM.
- PCA.
- Regularised linear models.
- Neural networks and gradient-based workflows.

Tree-based models are generally less sensitive to monotonic rescaling of individual features.

## 8. Standardisation

Standardisation transforms a feature using training mean and standard deviation:

\[
z=\frac{x-\mu}{\sigma}
\]

After transformation, the training feature has approximately zero mean and unit variance (assuming non-zero variance).

StandardScaler is sensitive to outliers because mean and standard deviation are sensitive to extreme values.

## 9. Min-Max Scaling

\[
x'=\frac{x-x_{min}}{x_{max}-x_{min}}
\]

This commonly maps values into [0, 1].

Advantages:
- Fixed range.
- Useful when bounded feature values are expected by a model.

Limitations:
- Sensitive to outliers.
- New observations can fall outside the fitted range.

## 10. Robust Scaling and Normalisation

### RobustScaler
Uses statistics such as median and interquartile range, reducing sensitivity to outliers.

### Vector normalisation
Scales each sample to a chosen norm, often L1 or L2. This differs from scaling each feature across rows.

Use vector normalisation when direction or relative feature proportions matter, such as some text representations.

## 11. Categorical Encoding

Many models require numeric inputs. Categorical values must be encoded carefully.

### One-hot encoding
Creates one indicator column for each category.

Example:

| Plan | Basic | Pro | Enterprise |
|---|---:|---:|---:|
| Basic | 1 | 0 | 0 |
| Pro | 0 | 1 | 0 |

Use for nominal categories without a meaningful order.

### Ordinal encoding
Maps ordered categories to integers.

Example: `Low → 0`, `Medium → 1`, `High → 2`.

Only use when the ordering is meaningful.

### Frequency encoding
Maps each category to its count or frequency in the training dataset.

Useful for high-cardinality categories, but different categories can share the same frequency and semantics are not preserved.

### Target encoding
Maps categories to target-derived statistics.

It can be useful for high-cardinality variables but has leakage risk. Use out-of-fold/cross-fitted encoding for training data and build mappings from training data only.

## 12. Encoding with scikit-learn

```python
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

one_hot = OneHotEncoder(handle_unknown="ignore")
X_train_encoded = one_hot.fit_transform(X_train[["city"]])

ordinal = OrdinalEncoder(
    categories=[["Low", "Medium", "High"]]
)
X_level = ordinal.fit_transform(X_train[["risk_level"]])
```

`handle_unknown="ignore"` helps one-hot encoding transform categories not observed during fit.

## 13. Preprocessing in a Pipeline

Use `ColumnTransformer` to apply different transformations to different feature groups.

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

numeric_features = ["age", "income"]
categorical_features = ["city", "plan"]

numeric_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer([
    ("num", numeric_pipe, numeric_features),
    ("cat", categorical_pipe, categorical_features)
])

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=2000))
])
```

The example demonstrates the structure. Feature names and model choice must match the actual dataset.

## 14. Data Leakage During Preprocessing

Leakage occurs when a transformation learns information from data that should be held out.

Incorrect:
1. Scale the full dataset.
2. Split into train and test.
3. Train and evaluate.

Correct:
1. Split data.
2. Fit imputer, scaler, and encoder on training data.
3. Transform validation/test using those fitted objects.

A Pipeline ensures preprocessing is refitted inside each cross-validation training fold.

## 15. Preprocessing Choices by Model

| Model | Scaling | Encoding | Notes |
|---|---|---|---|
| Linear/Logistic Regression | Usually useful | One-hot / suitable encoding | Scaling important with regularisation |
| KNN | Important | Numeric representation required | Distance dominated by scale |
| SVM | Usually important | Numeric representation required | Kernel distances/dot products |
| K-Means | Important | Carefully designed numeric representation | Distance-based |
| Decision Tree | Usually not required | Model-dependent | Split-based |
| Random Forest | Usually not required | Model-dependent | Split-based |
| Neural Network | Commonly useful | Numeric/tensor representation | Helps optimisation |

## 16. Common Mistakes

- Filling missing values before train/test split.
- Applying one-hot encoding without handling unknown categories.
- Ordinal-encoding categories with no natural order.
- Using target encoding without cross-fitting.
- Scaling features unnecessarily for every model.
- Ignoring outliers before mean/standard-deviation scaling.
- Dropping rows without understanding missingness.
- Assuming preprocessing learned during training will be repeated identically in production without saving the pipeline.

## 17. Placement and Interview Questions

**Q1. Why impute missing values?**  
Many estimators cannot directly process missing values; imputation creates a usable representation, though the strategy must be justified.

**Q2. Mean vs median imputation?**  
Mean is sensitive to outliers; median is more robust for skewed distributions.

**Q3. StandardScaler vs MinMaxScaler?**  
StandardScaler uses mean and standard deviation; MinMaxScaler maps values to a chosen range.

**Q4. Why scale for KNN and SVM?**  
Their distance/dot-product calculations can be dominated by high-range features.

**Q5. One-hot vs ordinal encoding?**  
One-hot represents unordered categories without inventing order; ordinal encoding represents a meaningful order.

**Q6. What is data leakage in preprocessing?**  
Fitting transformations using validation/test information before evaluation.

**Q7. Why use ColumnTransformer?**  
It applies different preprocessing pipelines to different column groups in one reproducible workflow.

## 18. Practice

### Paper exercise
A dataset contains `age`, `salary`, `city`, `membership_level`, and missing values in `salary`.

1. Choose a missing-value strategy and justify it.
2. Choose an encoding for `city`.
3. Choose an encoding for `membership_level`.
4. Decide whether scaling is useful for Logistic Regression and Decision Trees.
5. Explain how to avoid leakage.

### Coding exercise
Build a preprocessing Pipeline with:
- Median numeric imputation.
- Standard scaling.
- Most-frequent categorical imputation.
- One-hot encoding.
- Logistic Regression.
- Train/test split and classification report.

## 19. Quick Revision

- Inspect before transforming.
- Missing values: delete, impute, or represent missingness.
- Standardisation: zero mean / unit variance.
- Min-max: map to a range.
- Robust scaling: median / IQR.
- One-hot: nominal categories.
- Ordinal: meaningful ordered categories.
- Frequency: category count/rate.
- Target encoding: target statistic; cross-fit to prevent leakage.
- Pipeline: fit preprocessing on training fold only.

## 20. Final Checklist

- [ ] Inspect types, missingness, duplicates, and distributions.
- [ ] Compare missing-value strategies.
- [ ] Explain StandardScaler, MinMaxScaler, and RobustScaler.
- [ ] Select appropriate categorical encodings.
- [ ] Explain target-encoding leakage.
- [ ] Use ColumnTransformer and Pipeline.
- [ ] Fit transformations only on training data.
- [ ] Explain why scaling needs differ by model.

## 21. Recommended Resources

- [scikit-learn Preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)
- [Google AI for Developers — Gemini API](https://ai.google.dev/gemini-api/docs)
- [Google AI Studio](https://aistudio.google.com/)
- [scikit-learn Imputation](https://scikit-learn.org/stable/modules/impute.html)
