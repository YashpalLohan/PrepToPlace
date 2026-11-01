# Day 18 — Feature Engineering & Feature Selection

## 1. Overview

**Feature engineering** transforms raw data into useful model inputs. **Feature selection** chooses which available features should be retained.

This lecture covers:
- One-hot, target, and frequency encoding
- Binning and interaction features
- Scaling and transformations
- Feature selection methods
- Data leakage and target-encoding safeguards
- Pipelines and ColumnTransformer

## 2. What Is a Feature?

A feature is an input variable used by a model.

Examples:
- Customer age
- Number of purchases in the previous 30 days
- Average transaction value
- Account age in days
- Product category
- Day of week

Raw columns are not always the best representation of the underlying problem. Feature engineering uses domain knowledge to represent information in ways a model can use.

## 3. Numeric Feature Engineering

Common transformations include:

### Missing-value indicators

A separate binary feature can indicate whether the original value was missing. Missingness itself may contain information, but only when it is available and meaningful at prediction time.

### Log transformation

For positive, heavily right-skewed values, a log transformation can compress large values:

\[
x'=\log(1+x)
\]

The `log1p` form is defined for non-negative values and handles zero.

### Ratios and rates

Examples:
- Purchases per active month
- Debt-to-income ratio
- Click-through rate
- Errors per request

Always check division by zero, units, and whether the information would be available at prediction time.

## 4. Categorical Encoding

Many models require categorical values to be represented numerically. The encoding must match the meaning of the category.

### One-Hot Encoding

Creates one binary column per category.

Example:

| City | City_Delhi | City_Mumbai | City_Pune |
|---|---:|---:|---:|
| Delhi | 1 | 0 | 0 |
| Pune | 0 | 0 | 1 |
| Mumbai | 0 | 1 | 0 |

Useful when categories have no natural order and the number of categories is manageable.

Consider:
- High-cardinality features can create many columns.
- Unknown categories at inference time need handling.
- Sparse output can save memory.

### Ordinal Encoding

Maps ordered categories to integers, for example:

`Low → 0`, `Medium → 1`, `High → 2`

Use only when the order is meaningful. Arbitrary integer labels can introduce a false numeric order.

### Target Encoding

Replaces a category with a statistic calculated from the target, such as the category's smoothed mean target.

For a category \(c\), a simple un-smoothed version is:

\[
TE(c)=\frac{\sum_{i:x_i=c}y_i}{\#\{i:x_i=c\}}
\]

This can be powerful for high-cardinality categories, but it has a serious leakage risk.

**Leakage prevention:**
- Do not encode a training row using its own target.
- Use out-of-fold / cross-fitted target encoding for training rows.
- Fit the final mapping only on permitted training data.
- Use smoothing for rare categories.
- Ensure validation and test targets are never used to build the mapping.

### Frequency / Count Encoding

Maps categories to their occurrence count or frequency in the training data.

Example: if `Delhi` appears in 40% of training rows, map it to 0.40.

It can compactly represent high-cardinality categories, but equal frequencies do not imply equal meanings.

## 5. Binning and Bucketing

Binning converts a continuous value into intervals.

Example:
- Age 0–17 → `0_17`
- Age 18–29 → `18_29`
- Age 30–49 → `30_49`
- Age 50+ → `50_plus`

Potential benefits:
- Captures threshold-like relationships.
- Reduces sensitivity to small numeric changes.
- Improves interpretability in some models.

Potential costs:
- Loses within-bin information.
- Results depend on bin boundaries.
- Arbitrary bins can reduce predictive performance.

Use domain-driven boundaries or learn binning rules from training data only.

## 6. Interaction Features

An interaction represents a combined effect between features.

Example:
- `price × quantity` gives transaction value.
- `days_active × sessions_per_day` captures exposure.
- `age × income` may express a relationship not represented by either feature alone.

Linear models do not automatically model every interaction. Tree-based models can learn many nonlinear interactions, but engineered features may still help when they encode strong domain knowledge.

Avoid creating large numbers of interactions without validation; the feature space can grow rapidly.

## 7. Date and Time Features

A timestamp can be transformed into:
- Year, month, day, hour
- Day of week
- Weekend indicator
- Time since a reference event
- Time between events

For cyclic variables such as hour-of-day or month, raw integer representation creates an artificial boundary (23 is numerically far from 0 even though the times are adjacent).

A cyclic encoding can use sine and cosine:

\[
x_{\sin}=\sin\left(\frac{2\pi x}{P}\right),\quad
x_{\cos}=\cos\left(\frac{2\pi x}{P}\right)
\]

where \(P\) is the cycle length, such as 24 for hour-of-day.

For prediction, only use timestamps and derived values available at the prediction moment.

## 8. Scaling

### Standardisation

\[
z=\frac{x-\mu}{\sigma}
\]

Transforms values to a scale based on the training mean and standard deviation.

### Min-Max scaling

\[
x'=\frac{x-x_{\min}}{x_{\max}-x_{\min}}
\]

Maps values to a specified range, commonly [0, 1].

### Robust scaling

Uses statistics such as the median and interquartile range, which can be less affected by extreme values.

Scaling is useful for distance-based and gradient-based methods such as KNN, SVM, K-Means, PCA, and many linear/regularised models. Tree-based models typically do not require standard scaling.

Fit scaling statistics on training data only.

## 9. Feature Selection

Feature selection reduces the input feature set. It may improve speed, simplify a model, reduce noise, or improve generalisation.

### Filter methods

Score features using statistics before fitting a particular model.

Examples:
- Variance threshold
- Correlation analysis
- Chi-square
- ANOVA F-test
- Mutual information

Fast and model-independent, but they may miss feature interactions.

### Wrapper methods

Evaluate subsets by repeatedly fitting a model.

Examples:
- Recursive Feature Elimination (RFE)
- Sequential forward selection
- Sequential backward selection

Can capture model-specific usefulness, but can be expensive.

### Embedded methods

Selection happens as part of model fitting.

Examples:
- L1-regularised linear models
- Tree-based importance with careful validation
- SelectFromModel

The selected features depend on the model and data. Importance does not imply causality.

## 10. Data Leakage: The Most Important Safety Rule

Leakage occurs when training or evaluation uses information that would not legitimately be available at prediction time.

Common examples:
- Fitting an imputer or scaler on the full dataset before splitting.
- Selecting features using the full target vector before cross-validation.
- Target encoding a training row with its own target.
- Using a future transaction to predict an earlier decision.
- Splitting duplicate or related entities across train and test.
- Using a post-outcome variable as an input.

### Prevention

1. Define the prediction time and target carefully.
2. Split data before fitting preprocessing.
3. Place transformations and feature selection inside a Pipeline.
4. Use grouped or time-based splitting when the data structure requires it.
5. Use out-of-fold target encoding.
6. Keep the final test set untouched until all decisions are complete.

## 11. ColumnTransformer and Pipeline

`ColumnTransformer` applies different transformations to different columns. `Pipeline` chains preprocessing and a model so that each step is fitted correctly within each training fold.

### Mixed numeric and categorical example

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression

numeric_features = ["age", "income", "account_days"]
categorical_features = ["city", "plan_type"]

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

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", LogisticRegression(max_iter=2000))
])

model.fit(X_train, y_train)
predictions = model.predict(X_test)
```

The feature lists must match the actual columns in your dataset. The example uses a simple median/mode strategy; choose imputation and encoding based on data meaning and validation results.

### Why this is important during hyperparameter tuning

A pipeline ensures that fold-specific statistics are learned only from that fold's training subset. It also makes it possible to tune preprocessing and model parameters together using names such as:

`preprocessor__numeric__imputer__strategy`

or:

`classifier__C`

## 12. Common Mistakes

- Applying ordinal encoding to categories with no order.
- Using one-hot encoding blindly on extremely high-cardinality features.
- Target encoding without out-of-fold protection.
- Fitting scalers, imputers, or feature selectors before splitting.
- Creating features that use future information.
- Building too many interactions without validation.
- Assuming every model benefits from scaling.
- Dropping features based only on correlation without considering nonlinear effects or interactions.
- Treating feature importance as causality.
- Forgetting to handle unseen categories at inference time.

## 13. Placement and Interview Questions

**Q1. What is feature engineering?**  
Transforming raw input data into useful representations for a model.

**Q2. One-hot vs ordinal encoding?**  
One-hot creates separate binary columns for unordered categories. Ordinal encoding maps meaningful ordered categories to ordered numbers.

**Q3. What is target encoding?**  
Replacing categories with target-derived statistics; it must be cross-fitted to prevent leakage.

**Q4. When is frequency encoding useful?**  
For compact representation of categorical variables, especially when cardinality is high; it may lose semantic distinctions.

**Q5. What is an interaction feature?**  
A feature combining two or more inputs to represent a joint effect.

**Q6. Why use ColumnTransformer?**  
To apply different preprocessing steps to different column groups inside one reproducible workflow.

**Q7. Why put preprocessing in a Pipeline?**  
To ensure transformations are fitted only on each training fold and to prevent leakage during cross-validation.

**Q8. Does feature selection guarantee better performance?**  
No. It can remove noise and simplify the model, but it can also discard useful information.

## 14. Practice

### Paper exercise

A dataset has:
- `age` (numeric)
- `income` (numeric)
- `city` (categorical)
- `membership_level` (ordered categorical)
- `signup_time` (timestamp)
- `purchased` (target)

For each column:
1. Suggest one or more transformations.
2. Explain whether scaling is needed for a Logistic Regression pipeline.
3. Identify any possible leakage risk.
4. Explain how you would encode `city` and `membership_level`.
5. Suggest one time-derived feature that is available at prediction time.

### Coding exercise

Build a full preprocessing pipeline:
- Numeric imputation and scaling
- Categorical imputation and one-hot encoding
- Logistic Regression and Random Forest baselines
- Cross-validation
- Feature selection as an optional pipeline step
- Final evaluation on an untouched test set

Compare the models and explain which transformations matter for each model family.

## 15. Quick Revision

- **Feature engineering:** create useful model inputs.
- **One-hot:** binary columns for categories.
- **Ordinal:** ordered numeric codes for genuinely ordered categories.
- **Target encoding:** target statistic per category; use cross-fitting.
- **Frequency encoding:** category count or frequency.
- **Binning:** turn continuous values into intervals.
- **Interaction:** combine features to capture joint effects.
- **Scaling:** important for distance/gradient-based methods.
- **Feature selection:** filter, wrapper, or embedded.
- **Pipeline:** fit transformations within each training fold.
- **ColumnTransformer:** different transformations for different columns.
- **Leakage:** never use information unavailable at prediction time.

## 16. Final Checklist

- [ ] Explain one-hot, ordinal, target, and frequency encoding.
- [ ] Explain target-encoding leakage and out-of-fold protection.
- [ ] Create binning, interaction, and date/time features.
- [ ] Compare StandardScaler, MinMaxScaler, and RobustScaler.
- [ ] Compare filter, wrapper, and embedded feature selection.
- [ ] Identify temporal and preprocessing leakage.
- [ ] Build a Pipeline with ColumnTransformer.
- [ ] Evaluate the full workflow using leakage-safe cross-validation.

## 17. Recommended Resources

- [Kaggle: Feature Engineering](https://www.kaggle.com/learn/feature-engineering)
- [Krish Naik: Feature Engineering tutorials](https://www.youtube.com/results?search_query=Krish+Naik+Feature+Engineering)
- [scikit-learn: Pipelines and ColumnTransformer](https://scikit-learn.org/stable/modules/compose.html)
- [scikit-learn: OneHotEncoder](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.OneHotEncoder.html)
- [scikit-learn: Feature Selection](https://scikit-learn.org/stable/modules/feature_selection.html)
