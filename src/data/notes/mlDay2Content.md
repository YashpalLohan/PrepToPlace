# AI/ML — ML Foundations

# Lecture 2: Pandas + Exploratory Data Analysis (EDA)

**Day 2**

> **Learning focus:** Load, inspect, clean, transform, join, aggregate, and visualize tabular data. These operations form a major part of practical machine-learning data preparation.

---

## Learning Flow

1. Understand tabular data and the Pandas data model.
2. Load datasets from common file formats.
3. Inspect structure, columns, data types, and quality.
4. Select, filter, sort, and transform data.
5. Detect and handle missing and duplicate values.
6. Clean inconsistent values and convert data types.
7. Combine datasets using merge, join, and concat.
8. Summarize data with groupby and aggregation.
9. Perform exploratory data analysis (EDA).
10. Visualize distributions, relationships, and outliers.
11. Prepare a reproducible dataset for machine learning.

---

# 1. Introduction to Pandas and EDA

## 1.1 What is Pandas?

**Pandas** is a Python library for working with structured and labelled data. It provides convenient data structures and operations for loading, inspecting, cleaning, transforming, combining, and summarizing datasets.

Pandas is commonly used when data is stored in rows and columns, such as:

- CSV files containing customer or sales records.
- Excel workbooks containing business data.
- Database query results.
- JSON records returned by APIs.
- Time-series measurements.
- Experiment and model-evaluation results.

Pandas is built on top of the Python ecosystem and works closely with NumPy, Matplotlib, and other data-science libraries.

```python
import pandas as pd
import numpy as np
```

**Why Pandas matters in ML:** Most real-world datasets are not immediately ready for model training. They may contain missing values, inconsistent categories, incorrect data types, duplicate rows, or multiple related tables. Pandas provides tools to investigate and prepare this data.

## 1.2 What is Exploratory Data Analysis (EDA)?

**Exploratory Data Analysis (EDA)** is the process of examining a dataset before making modelling decisions. It combines summaries, visualizations, and questions about the data to understand its structure and quality.

EDA helps answer questions such as:

- How many observations and features are present?
- Which columns are numerical, categorical, dates, or identifiers?
- Are values missing?
- Are duplicate records present?
- What are the typical values and ranges?
- Are distributions skewed?
- Are there unusual values or potential outliers?
- Do variables appear to be related?
- Is the target variable imbalanced?
- Could a feature leak information from the future or from the target?

EDA is not just plotting charts. It is a structured investigation that informs data cleaning, feature engineering, validation, and modelling.

## 1.3 The Main Pandas Data Structures

### Series

A **Series** is a one-dimensional labelled array. It contains values and an associated index.

```python
import pandas as pd

marks = pd.Series([82, 91, 76], index=["Asha", "Ravi", "Meera"])

print(marks)
print(marks["Ravi"])
```

Expected output:

```text
Asha     82
Ravi     91
Meera    76
dtype: int64

91
```

Important properties:

- `values`: underlying values.
- `index`: labels associated with values.
- `dtype`: data type of the values.
- `shape`: dimensions of the Series.

### DataFrame

A **DataFrame** is a two-dimensional labelled data structure with rows and columns. Different columns can have different data types.

```python
students = pd.DataFrame({
    "name": ["Asha", "Ravi", "Meera"],
    "age": [20, 21, 20],
    "marks": [82, 91, 76]
})

print(students)
```

| Index | name | age | marks |
|---:|---|---:|---:|
| 0 | Asha | 20 | 82 |
| 1 | Ravi | 21 | 91 |
| 2 | Meera | 20 | 76 |

Important properties:

| Property | Meaning |
|---|---|
| `df.shape` | Number of rows and columns |
| `df.columns` | Column labels |
| `df.index` | Row labels |
| `df.dtypes` | Data type of each column |
| `df.values` | Array representation of values |
| `df.size` | Total number of elements |
| `df.ndim` | Number of dimensions |

### Series vs DataFrame

| Feature | Series | DataFrame |
|---|---|---|
| Dimensions | 1D | 2D |
| Labels | Index | Row index and column labels |
| Typical use | One column | Complete table |
| Example | `df["age"]` | `df[["age"]]` |

Notice the difference:

```python
age_series = students["age"]
age_dataframe = students[["age"]]

print(type(age_series))
print(type(age_dataframe))
```

- `students["age"]` returns a Series.
- `students[["age"]]` returns a DataFrame.

This distinction matters because some operations and APIs expect a one-dimensional Series while others expect a two-dimensional feature matrix.

---

# 2. Loading and Saving Data

## 2.1 Reading a CSV File

CSV (Comma-Separated Values) is one of the most common formats for tabular datasets.

```python
df = pd.read_csv("students.csv")
```

Useful `read_csv()` parameters:

| Parameter | Purpose | Example |
|---|---|---|
| `filepath_or_buffer` | File path or readable source | `"data.csv"` |
| `sep` | Field delimiter | `sep=";"` |
| `header` | Row containing column names | `header=0` |
| `names` | Explicit column names | `names=["a", "b"]` |
| `index_col` | Column to use as index | `index_col="id"` |
| `usecols` | Read selected columns | `usecols=["age", "salary"]` |
| `dtype` | Specify column data types | `dtype={"id": "string"}` |
| `na_values` | Additional missing-value markers | `na_values=["?", "NA"]` |
| `parse_dates` | Parse date columns | `parse_dates=["date"]` |
| `nrows` | Read only a number of rows | `nrows=1000` |
| `encoding` | Text encoding | `encoding="utf-8"` |

Examples:

```python
df = pd.read_csv(
    "students.csv",
    usecols=["student_id", "age", "marks"],
    na_values=["?", "not available"]
)
```

Read a large file in chunks:

```python
for chunk in pd.read_csv("large_dataset.csv", chunksize=10_000):
    print(chunk.shape)
```

Chunking allows processing a file in smaller pieces rather than loading the entire file into memory at once.

## 2.2 Reading Other File Formats

```python
# Excel
df_excel = pd.read_excel("students.xlsx", sheet_name="Sheet1")

# JSON
df_json = pd.read_json("students.json")

# Parquet
df_parquet = pd.read_parquet("students.parquet")

# SQL query (requires an appropriate database connection)
# df_sql = pd.read_sql_query("SELECT * FROM students", connection)
```

The required optional engines or database drivers must be installed for some formats.

## 2.3 Saving Data

```python
df.to_csv("cleaned_students.csv", index=False)
df.to_excel("cleaned_students.xlsx", index=False)
df.to_json("cleaned_students.json", orient="records")
df.to_parquet("cleaned_students.parquet", index=False)
```

Why use `index=False` for many exports? The DataFrame index is often only a row label. Exporting it as an extra column can create an unwanted column when the file is loaded again. Keep the index when it is meaningful data.

## 2.4 File Paths and Common Loading Errors

Common errors include:

- `FileNotFoundError`: the path is incorrect or the file is not in the expected working directory.
- `UnicodeDecodeError`: the file encoding does not match the assumed encoding.
- `ParserError`: rows may have inconsistent delimiters or malformed quoting.
- `ModuleNotFoundError`: an optional file-format dependency may be missing.

Check the working directory and path:

```python
from pathlib import Path

file_path = Path("data") / "students.csv"
print(file_path.resolve())
print(file_path.exists())

df = pd.read_csv(file_path)
```

**Good practice:** Keep raw input data separate from cleaned output data. Avoid overwriting the original dataset during experimentation.

---

# 3. First Inspection of a Dataset

Before cleaning or modelling, inspect the dataset systematically.

Use a small sample first:

```python
df.head()
df.tail()
df.sample(5, random_state=42)
```

| Method | Purpose |
|---|---|
| `head(n)` | First `n` rows |
| `tail(n)` | Last `n` rows |
| `sample(n)` | Random sample of `n` rows |
| `shape` | Row and column count |
| `columns` | Column names |
| `dtypes` | Column data types |
| `info()` | Concise structural summary |
| `describe()` | Descriptive statistics |

## 3.1 Shape and Structure

```python
print("Rows:", df.shape[0])
print("Columns:", df.shape[1])
print("Total cells:", df.size)
print("Column names:", df.columns.tolist())
```

Always check the shape after operations such as filtering, joining, and dropping rows. An unexpected row-count change may indicate a data-processing mistake.

## 3.2 `info()`

```python
df.info()
```

`info()` reports:

- Index range.
- Number of rows.
- Column names.
- Non-null counts.
- Data types.
- Memory usage.

A column with fewer non-null values than the total row count may contain missing data.

## 3.3 `describe()`

```python
df.describe()
```

For numerical columns, it commonly reports:

- `count`: non-missing value count.
- `mean`: arithmetic average.
- `std`: standard deviation.
- `min`: minimum.
- `25%`: first quartile.
- `50%`: median.
- `75%`: third quartile.
- `max`: maximum.

Include non-numerical columns:

```python
df.describe(include="all")
```

For a selected categorical column:

```python
df["city"].value_counts()
df["city"].value_counts(normalize=True)
```

`normalize=True` returns proportions rather than raw counts.

## 3.4 A Repeatable Initial Inspection

```python
def inspect_dataframe(data):
    print("Shape:", data.shape)
    print("\nFirst five rows:")
    print(data.head())

    print("\nData types and non-null counts:")
    data.info()

    print("\nMissing values:")
    print(data.isna().sum())

    print("\nDuplicate rows:", data.duplicated().sum())

    print("\nNumerical summary:")
    print(data.describe())

inspect_dataframe(df)
```

This is a useful starting point, not a replacement for asking dataset-specific questions.

---

# 4. Selecting, Filtering, and Sorting Data

## 4.1 Selecting Columns

```python
# One column: Series
ages = df["age"]

# Multiple columns: DataFrame
subset = df[["name", "age", "salary"]]
```

Avoid selecting columns using ambiguous positional assumptions when a named column is available.

## 4.2 Selecting Rows with `loc`

`.loc` selects by row and column labels.

```python
df.loc[0]
df.loc[0:3, ["name", "age"]]
df.loc[df["age"] >= 21, ["name", "age"]]
```

Label-based slicing with `.loc` includes the end label when the labels are present.

## 4.3 Selecting Rows with `iloc`

`.iloc` selects by integer position.

```python
df.iloc[0]
df.iloc[0:3, 0:2]
df.iloc[-1]
```

Position-based slicing follows normal Python slice behaviour: the ending position is excluded.

### `loc` vs `iloc`

| Feature | `loc` | `iloc` |
|---|---|---|
| Selection basis | Labels | Integer positions |
| Row example | `df.loc[5]` | `df.iloc[5]` |
| Column example | `df.loc[:, "age"]` | `df.iloc[:, 1]` |
| Slice end | Included for label slices | Excluded |

## 4.4 Boolean Filtering

```python
adults = df[df["age"] >= 18]
high_scorers = df[df["marks"] >= 80]
```

Combine conditions using:

- `&` for AND.
- `|` for OR.
- `~` for NOT.

Each condition should be enclosed in parentheses:

```python
selected = df[
    (df["age"] >= 20) &
    (df["marks"] >= 80)
]
```

Do not use Python's scalar `and` and `or` to combine Pandas Series conditions.

## 4.5 `isin()`, `between()`, and `query()`

```python
# Values from a given set
selected = df[df["city"].isin(["Delhi", "Sonipat"])]

# Inclusive range by default
selected = df[df["marks"].between(70, 90)]

# Query expression
selected = df.query("age >= 20 and marks >= 80")
```

Use `query()` for readable expressions when suitable. For complex or externally supplied expressions, prefer explicit boolean masks and avoid evaluating untrusted input.

## 4.6 Sorting

```python
# Sort by one column
df.sort_values("marks")

# Descending order
df.sort_values("marks", ascending=False)

# Sort by multiple columns
df.sort_values(
    ["city", "marks"],
    ascending=[True, False]
)

# Sort by index
df.sort_index()
```

Sorting does not normally change the original DataFrame unless an in-place operation or reassignment is used.

---

# 5. Data Transformation

## 5.1 Creating and Updating Columns

```python
df["total"] = df["maths"] + df["science"]
df["average"] = df[["maths", "science"]].mean(axis=1)
df["passed"] = df["average"] >= 40
```

Prefer vectorized column operations over row-by-row Python loops when the operation can be expressed with Pandas or NumPy operations.

## 5.2 Renaming Columns

```python
df = df.rename(columns={
    "old_name": "new_name",
    "marks_obtained": "marks"
})
```

Rename all columns when appropriate:

```python
df.columns = ["student_id", "name", "age"]
```

The number of new labels must match the number of columns.

## 5.3 Dropping Columns and Rows

```python
# Drop columns
df = df.drop(columns=["temporary_column"])

# Drop rows by index label
df = df.drop(index=[2, 5])
```

Dropping rows or columns should be based on a clear reason. Do not remove data merely because it is inconvenient.

## 5.4 Applying Functions

```python
df["name_upper"] = df["name"].str.upper()

df["marks_category"] = df["marks"].apply(
    lambda mark: "High" if mark >= 80 else "Other"
)
```

Use built-in vectorized string, datetime, and arithmetic operations when possible. `apply()` is flexible but is not automatically faster than vectorized operations.

## 5.5 String Operations

Pandas provides the `.str` accessor:

```python
df["name"] = df["name"].str.strip()
df["name"] = df["name"].str.title()
df["email_domain"] = df["email"].str.split("@").str[-1]
df["city"] = df["city"].str.replace("NCR", "Delhi NCR", regex=False)
```

Handle missing values before applying operations that do not support them as expected.

## 5.6 Datetime Operations

Parse dates:

```python
df["date"] = pd.to_datetime(df["date"], errors="coerce")
```

Extract components:

```python
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["day"] = df["date"].dt.day
df["day_name"] = df["date"].dt.day_name()
```

`errors="coerce"` converts unparseable values to `NaT` (Pandas' missing datetime value). Inspect those values instead of silently ignoring them.

## 5.7 Data Type Conversion

```python
df["age"] = pd.to_numeric(df["age"], errors="coerce")
df["date"] = pd.to_datetime(df["date"], errors="coerce")
df["category"] = df["category"].astype("category")
df["student_id"] = df["student_id"].astype("string")
```

Use `errors="coerce"` only when converting invalid values to missing values is an intentional cleaning decision. Check how many values failed conversion.

---

# 6. Missing Values

Missing data is common in real datasets. Pandas represents missing values using values such as `NaN`, `NaT`, and `pd.NA`, depending on the dtype and context.

## 6.1 Detecting Missing Values

```python
df.isna()
df.isna().sum()
df.isna().mean() * 100
```

- `isna()` returns a boolean mask.
- `isna().sum()` counts missing values in each column.
- `isna().mean() * 100` calculates the percentage missing in each column.

Check rows containing at least one missing value:

```python
rows_with_missing = df[df.isna().any(axis=1)]
```

Check rows where a particular column is missing:

```python
missing_age = df[df["age"].isna()]
```

Use `isna()` or `isnull()` for missing-value detection. Do not rely on equality comparisons such as `df["age"] == np.nan`.

## 6.2 Removing Missing Values with `dropna()`

```python
# Remove rows containing any missing value
df_without_missing = df.dropna()

# Remove rows only if every value is missing
df_without_empty_rows = df.dropna(how="all")

# Require at least 3 non-missing values in a row
df_filtered = df.dropna(thresh=3)

# Consider only selected columns
df_filtered = df.dropna(subset=["age", "salary"])
```

Dropping rows can introduce bias if missingness is systematic or if too much data is removed. Always inspect the impact.

## 6.3 Filling Missing Values with `fillna()`

Constant value:

```python
df["city"] = df["city"].fillna("Unknown")
```

Mean:

```python
df["salary"] = df["salary"].fillna(df["salary"].mean())
```

Median:

```python
df["salary"] = df["salary"].fillna(df["salary"].median())
```

Mode:

```python
mode_values = df["city"].mode()

if not mode_values.empty:
    df["city"] = df["city"].fillna(mode_values.iloc[0])
```

### Mean vs Median vs Mode

| Method | Suitable use | Limitation |
|---|---|---|
| Mean | Numerical data without severe skew or influential outliers | Sensitive to outliers |
| Median | Numerical data with skew or outliers | Does not preserve every distribution property |
| Mode | Categorical or discrete values | Can over-represent the most common category |
| Constant / Unknown | Missingness itself or a meaningful default category | May introduce an artificial category |

There is no universally correct imputation method. Choose based on the variable, missingness mechanism, domain knowledge, and modelling objective.

## 6.4 Forward Fill and Backward Fill

Useful for ordered or time-series data when carrying a previous or next observation is justified:

```python
df["sensor_value"] = df["sensor_value"].ffill()
df["sensor_value"] = df["sensor_value"].bfill()
```

- Forward fill uses the previous valid value.
- Backward fill uses the next valid value.

Do not use these methods blindly on unordered records. Backward filling can also introduce future information into past observations in time-dependent prediction tasks.

## 6.5 Missingness Indicators

Sometimes the fact that a value is missing contains useful information.

```python
df["salary_was_missing"] = df["salary"].isna().astype("int8")
```

Create the indicator before filling the missing value.

## 6.6 Missing-Value Strategy for ML

A practical workflow:

1. Measure missingness by column and row.
2. Understand why values are missing if possible.
3. Check whether missingness is concentrated in particular groups or time periods.
4. Decide whether to drop, impute, or retain a missing category.
5. Add missingness indicators when justified.
6. Fit learned imputation rules on training data only.
7. Apply the fitted rules to validation and test data.

**Data leakage warning:** If the mean or median is calculated using the complete dataset before the train-test split, information from the test set influences preprocessing. Split first, fit preprocessing on training data, and reuse those fitted parameters for validation/test data.

For production ML pipelines, Scikit-learn's `SimpleImputer` and `Pipeline` can help keep this process consistent.

---

# 7. Duplicate Data and Inconsistent Values

## 7.1 Detecting Duplicates

```python
df.duplicated()
df.duplicated().sum()
```

By default, `duplicated()` identifies rows that duplicate an earlier row, considering all columns.

Check duplicates based on selected columns:

```python
df.duplicated(subset=["email"]).sum()
```

## 7.2 Removing Duplicates

```python
df = df.drop_duplicates()

# Identify duplicates by email, keeping the first occurrence
df = df.drop_duplicates(subset=["email"], keep="first")
```

Options for `keep`:

- `"first"`: keep the first occurrence.
- `"last"`: keep the last occurrence.
- `False`: mark/remove every member of a duplicate group.

Do not assume identical rows are always erroneous. Repeated transactions or measurements may be legitimate. Define what makes a record unique for the domain.

## 7.3 Standardizing Text Values

Inconsistent category labels can create false categories:

```text
Delhi
delhi
 Delhi
DELHI
```

Normalize carefully:

```python
df["city"] = (
    df["city"]
    .astype("string")
    .str.strip()
    .str.title()
)
```

Be careful: title casing is not suitable for every name, code, or identifier. Preserve meaningful capitalization when required.

## 7.4 Finding Unexpected Categories

```python
print(df["city"].value_counts(dropna=False))
print(df["city"].unique())
```

Use this to identify spelling differences, unexpected labels, and invalid categories.

---

# 8. Combining Datasets: Concat, Merge, and Join

Real projects often store related information in multiple tables. Combining them correctly is essential.

## 8.1 `pd.concat()`

`concat()` stacks or combines objects along an axis.

### Row-wise concatenation

```python
january = pd.DataFrame({
    "order_id": [1, 2],
    "amount": [500, 700]
})

february = pd.DataFrame({
    "order_id": [3, 4],
    "amount": [300, 900]
})

all_orders = pd.concat(
    [january, february],
    ignore_index=True
)
```

`ignore_index=True` creates a fresh sequential index.

### Column-wise concatenation

```python
left = pd.DataFrame({"name": ["Asha", "Ravi"]})
right = pd.DataFrame({"marks": [82, 91]})

combined = pd.concat([left, right], axis=1)
```

Column-wise concatenation aligns values by index labels. It does not automatically match records using a shared business key.

## 8.2 `pd.merge()`

`merge()` combines DataFrames using one or more key columns or indexes. It is similar to a relational database join.

Example tables:

```python
students = pd.DataFrame({
    "student_id": [1, 2, 3],
    "name": ["Asha", "Ravi", "Meera"]
})

scores = pd.DataFrame({
    "student_id": [1, 2, 4],
    "marks": [82, 91, 75]
})
```

### Inner Join

Only matching keys are retained:

```python
inner = pd.merge(
    students,
    scores,
    on="student_id",
    how="inner"
)
```

Result:

| student_id | name | marks |
|---:|---|---:|
| 1 | Asha | 82 |
| 2 | Ravi | 91 |

### Left Join

All rows from the left table are retained:

```python
left = pd.merge(
    students,
    scores,
    on="student_id",
    how="left"
)
```

Result:

| student_id | name | marks |
|---:|---|---:|
| 1 | Asha | 82 |
| 2 | Ravi | 91 |
| 3 | Meera | NaN |

### Right Join

All rows from the right table are retained:

```python
right = pd.merge(
    students,
    scores,
    on="student_id",
    how="right"
)
```

### Outer Join

All keys from both tables are retained:

```python
outer = pd.merge(
    students,
    scores,
    on="student_id",
    how="outer"
)
```

### Join Types Summary

| Join | Rows retained |
|---|---|
| Inner | Matching keys only |
| Left | All left keys and matching right values |
| Right | All right keys and matching left values |
| Outer | All keys from both tables |

## 8.3 Joining on Different Column Names

```python
result = pd.merge(
    students,
    scores,
    left_on="id",
    right_on="student_id",
    how="left"
)
```

## 8.4 Handling Duplicate Column Names

```python
result = pd.merge(
    employees,
    departments,
    on="department_id",
    suffixes=("_employee", "_department")
)
```

Use `suffixes` to distinguish overlapping non-key column names.

## 8.5 Merge Validation and Row Explosion

A join can unexpectedly multiply rows when a key appears more than once in either table.

Example: if a key appears twice on the left and three times on the right, the matching key can produce six rows.

Inspect key uniqueness:

```python
print(students["student_id"].is_unique)
print(scores["student_id"].is_unique)
```

Use merge validation when the expected relationship is known:

```python
result = pd.merge(
    students,
    scores,
    on="student_id",
    how="left",
    validate="one_to_one"
)
```

Other useful validation values include `"one_to_many"`, `"many_to_one"`, and `"many_to_many"`.

Check unmatched records with an indicator:

```python
audit = pd.merge(
    students,
    scores,
    on="student_id",
    how="outer",
    indicator=True
)

print(audit["_merge"].value_counts())
```

This helps reveal records that exist in only one source.

## 8.6 `DataFrame.join()`

`join()` is a convenient method commonly used for index-based joins.

```python
students_indexed = students.set_index("student_id")
scores_indexed = scores.set_index("student_id")

joined = students_indexed.join(
    scores_indexed,
    how="left"
)
```

### `concat()` vs `merge()` vs `join()`

| Operation | Main purpose | Typical alignment |
|---|---|---|
| `concat()` | Stack or combine objects | Index or selected axis |
| `merge()` | Relational/key-based combination | Columns or indexes |
| `join()` | Convenient DataFrame combination | Usually index |

---

# 9. GroupBy and Aggregation

`groupby()` follows the **split–apply–combine** pattern:

1. **Split:** Divide rows into groups based on one or more keys.
2. **Apply:** Perform a calculation on each group.
3. **Combine:** Assemble the group results.

Example:

```python
employees = pd.DataFrame({
    "department": ["IT", "HR", "IT", "HR", "Sales"],
    "employee": ["A", "B", "C", "D", "E"],
    "salary": [70000, 50000, 80000, 55000, 60000]
})
```

## 9.1 Basic GroupBy

```python
employees.groupby("department")["salary"].mean()
```

This calculates the average salary in each department.

## 9.2 Multiple Aggregations

```python
summary = employees.groupby("department")["salary"].agg(
    ["count", "sum", "mean", "min", "max"]
)
```

## 9.3 Named Aggregation

```python
summary = employees.groupby("department").agg(
    employee_count=("employee", "count"),
    average_salary=("salary", "mean"),
    highest_salary=("salary", "max")
)
```

Named aggregation produces clearer output column names.

## 9.4 Grouping by Multiple Columns

```python
df.groupby(["city", "department"])["salary"].mean()
```

This creates a group for each city-department combination.

## 9.5 `size()` vs `count()`

- `size()` counts rows in each group, including rows with missing values in other columns.
- `count()` counts non-missing values in the selected column.

```python
grouped = df.groupby("department")

row_counts = grouped.size()
salary_counts = grouped["salary"].count()
```

## 9.6 `transform()`

`transform()` returns a result aligned to the original rows.

```python
df["department_avg_salary"] = (
    df.groupby("department")["salary"]
      .transform("mean")
)
```

Unlike a normal aggregation, this can add a group-level statistic back to each row.

## 9.7 `filter()`

Keep groups that satisfy a group-level condition:

```python
large_departments = employees.groupby("department").filter(
    lambda group: len(group) >= 2
)
```

## 9.8 Pivot Tables

A pivot table summarizes data across row and column categories.

```python
sales = pd.DataFrame({
    "city": ["Delhi", "Delhi", "Mumbai", "Mumbai"],
    "product": ["A", "B", "A", "B"],
    "revenue": [100, 150, 200, 250]
})

pivot = pd.pivot_table(
    sales,
    values="revenue",
    index="city",
    columns="product",
    aggfunc="sum",
    fill_value=0
)
```

Use `pivot_table()` when aggregation is required. `pivot()` reshapes data and expects unique index/column combinations.

---

# 10. Exploratory Data Analysis Workflow

EDA should be guided by questions. A useful workflow is:

1. Understand the problem and data dictionary.
2. Load the raw data.
3. Inspect dimensions, columns, and types.
4. Check missingness and duplicates.
5. Validate ranges and category values.
6. Study numerical distributions.
7. Study categorical frequencies.
8. Examine relationships between variables.
9. Investigate outliers and unusual observations.
10. Examine the target variable, if one exists.
11. Record findings and decide what preprocessing is justified.

## 10.1 Univariate Analysis

Univariate analysis studies one variable at a time.

### Numerical variables

Useful summaries:

```python
df["salary"].describe()
df["salary"].median()
df["salary"].skew()
df["salary"].quantile([0.25, 0.5, 0.75])
```

Useful plots:

- Histogram: distribution and shape.
- Box plot: median, quartiles, and potential outliers.
- Density plot: smoothed distribution estimate.

### Categorical variables

```python
df["department"].value_counts()
df["department"].value_counts(normalize=True) * 100
```

Useful plots:

- Bar chart: category counts.
- Count plot: frequency of categories.

## 10.2 Bivariate Analysis

Bivariate analysis studies the relationship between two variables.

| Variable pair | Useful approach |
|---|---|
| Numerical vs numerical | Scatter plot, correlation |
| Categorical vs numerical | Group summaries, box plot |
| Categorical vs categorical | Cross-tabulation, stacked bar chart |

Examples:

```python
# Correlation between numerical columns
df[["age", "salary", "experience"]].corr()

# Cross-tabulation
pd.crosstab(df["department"], df["left_company"])

# Group-level numerical summary
df.groupby("department")["salary"].median()
```

Correlation measures association, not causation.

## 10.3 Multivariate Analysis

Multivariate analysis examines several variables together.

Examples include:

- Correlation heatmaps.
- Pair plots.
- Grouped summaries.
- Relationships among features and target.
- Interactions between categorical and numerical variables.

Use visualizations to identify patterns, then validate those patterns with appropriate statistical or domain reasoning.

## 10.4 Target Variable Analysis

For classification:

```python
df["target"].value_counts()
df["target"].value_counts(normalize=True)
```

Check whether classes are imbalanced.

For regression:

```python
df["target"].describe()
```

Inspect target distribution, range, skew, missingness, and possible extreme values.

Do not use target information to create preprocessing rules that would not be available at prediction time.

---

# 11. Data Visualization for EDA

Pandas plotting uses Matplotlib by default.

```python
import matplotlib.pyplot as plt
```

## 11.1 Histogram

A histogram shows the frequency distribution of a numerical variable.

```python
df["age"].plot(
    kind="hist",
    bins=20,
    edgecolor="black"
)

plt.title("Age Distribution")
plt.xlabel("Age")
plt.ylabel("Frequency")
plt.show()
```

Use a suitable number of bins. Too few can hide structure; too many can make the plot noisy.

## 11.2 Box Plot

A box plot summarizes a numerical distribution.

```python
df.boxplot(column="salary")
plt.title("Salary Distribution")
plt.show()
```

The box typically represents the interquartile range (IQR), with a line for the median. Whisker conventions depend on the plotting implementation; points beyond the whiskers are often shown individually.

## 11.3 Bar Chart

```python
df["department"].value_counts().plot(kind="bar")

plt.title("Employees by Department")
plt.xlabel("Department")
plt.ylabel("Count")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()
```

## 11.4 Scatter Plot

```python
df.plot(
    kind="scatter",
    x="experience",
    y="salary"
)

plt.title("Experience vs Salary")
plt.show()
```

A scatter plot can reveal trends, clusters, non-linear patterns, and unusual observations.

## 11.5 Correlation Heatmap

```python
import matplotlib.pyplot as plt

corr = df.select_dtypes(include="number").corr()

plt.imshow(corr, aspect="auto")
plt.colorbar()
plt.xticks(range(len(corr.columns)), corr.columns, rotation=45)
plt.yticks(range(len(corr.columns)), corr.columns)
plt.title("Numerical Feature Correlation")
plt.tight_layout()
plt.show()
```

Correlation coefficients describe linear association for Pearson correlation. They do not prove causation and may miss non-linear relationships.

## 11.6 Choosing the Right Chart

| Question | Suitable visualization |
|---|---|
| What is the distribution of a numerical variable? | Histogram |
| Are there potential extreme values? | Box plot |
| Which categories are most frequent? | Bar chart |
| Do two numerical variables move together? | Scatter plot |
| How are numerical features linearly associated? | Correlation heatmap |
| How does a numerical value vary across categories? | Box plot or grouped bar chart |

A chart should answer a specific question. Avoid plotting every column without an objective.

---

# 12. Outliers and Data Quality Checks

## 12.1 What is an Outlier?

An **outlier** is an observation that is unusually distant from the rest of the data under some definition or model.

Outliers may be caused by:

- Data-entry errors.
- Measurement problems.
- Rare but valid events.
- Heavy-tailed distributions.
- Different populations or regimes.

An outlier is not automatically an error.

## 12.2 IQR Method

The interquartile range is:

\[
IQR = Q_3 - Q_1
\]

A common rule flags values below or above:

\[
Lower = Q_1 - 1.5 \times IQR
\]

\[
Upper = Q_3 + 1.5 \times IQR
\]

Python implementation:

```python
q1 = df["salary"].quantile(0.25)
q3 = df["salary"].quantile(0.75)

iqr = q3 - q1

lower_bound = q1 - 1.5 * iqr
upper_bound = q3 + 1.5 * iqr

outliers = df[
    (df["salary"] < lower_bound) |
    (df["salary"] > upper_bound)
]
```

The IQR rule is a screening heuristic, not proof that a value is invalid.

## 12.3 Z-Score

A z-score expresses how many standard deviations an observation is from the mean:

\[
z = \frac{x - \mu}{\sigma}
\]

```python
mean = df["salary"].mean()
std = df["salary"].std()

df["salary_zscore"] = (df["salary"] - mean) / std
```

A threshold such as absolute z-score greater than 3 is sometimes used to flag unusual values, but its usefulness depends on distributional assumptions and context.

## 12.4 What Should You Do with Outliers?

Possible actions:

- Correct a verified data-entry error.
- Keep a valid rare observation.
- Use a transformation for a highly skewed feature.
- Use robust statistics or robust models.
- Apply clipping/winsorization only when justified.
- Investigate whether observations belong to different populations.

Document the decision and fit any learned thresholds using training data only.

---

# 13. A Complete Mini EDA Case Study

This example demonstrates a small workflow from loading-style inspection through cleaning, grouping, and visualization.

## 13.1 Create a Sample Dataset

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

data = {
    "student_id": [1, 2, 3, 4, 5, 5, 7, 8],
    "name": ["Asha", "Ravi", "Meera", "Kabir", "Isha", "Isha", "Arjun", "Neha"],
    "city": ["Delhi", "Sonipat", "Delhi", "delhi ", None, None, "Sonipat", "Delhi"],
    "age": [20, 21, 20, 22, np.nan, np.nan, 21, 20],
    "maths": [85, 72, 91, 65, 78, 78, np.nan, 88],
    "science": [90, 75, 94, 70, 82, 82, 79, 92]
}

df = pd.DataFrame(data)
print(df)
```

## 13.2 Inspect the Dataset

```python
print("Shape:", df.shape)
print(df.info())
print(df.describe(include="all"))
print("Missing values:\n", df.isna().sum())
print("Duplicate rows:", df.duplicated().sum())
```

Questions to ask:

- Are there duplicate records?
- Which columns contain missing values?
- Are numerical columns stored as numerical types?
- Are category labels consistent?
- Are values within plausible ranges?

## 13.3 Clean the Data

```python
# Remove exact duplicate rows
df = df.drop_duplicates()

# Standardize city labels
df["city"] = df["city"].astype("string").str.strip().str.title()

# Fill missing city values
df["city"] = df["city"].fillna("Unknown")

# Fill missing age using the median
df["age"] = df["age"].fillna(df["age"].median())

# Create average marks
df["average_marks"] = df[["maths", "science"]].mean(axis=1)
```

The choices above are illustrative. In a real dataset, investigate why values are missing and whether median imputation is appropriate.

## 13.4 Summarize by City

```python
city_summary = df.groupby("city").agg(
    student_count=("student_id", "count"),
    average_marks=("average_marks", "mean"),
    highest_marks=("average_marks", "max")
)

print(city_summary)
```

## 13.5 Visualize Marks

```python
df["average_marks"].plot(
    kind="hist",
    bins=5,
    edgecolor="black"
)

plt.title("Distribution of Average Marks")
plt.xlabel("Average Marks")
plt.ylabel("Number of Students")
plt.show()
```

## 13.6 What Did We Learn?

This small workflow demonstrated:

- Creating a DataFrame.
- Inspecting shape, types, and descriptive statistics.
- Detecting and removing exact duplicate rows.
- Standardizing text categories.
- Handling missing values.
- Creating a derived feature.
- Grouping and aggregating.
- Visualizing a numerical distribution.

The purpose of EDA is not simply to run these commands. It is to use their results to make justified decisions about data quality and modelling.

---

# 14. Preparing Data for Machine Learning

Pandas is often used before data is passed to a Scikit-learn model.

## 14.1 Separate Features and Target

```python
X = df.drop(columns=["target"])
y = df["target"]
```

- `X`: feature matrix.
- `y`: target vector.

The target should not accidentally remain inside the feature matrix.

## 14.2 Split Before Fitting Preprocessing

For a typical independent and identically distributed classification dataset:

```python
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)
```

Use `stratify=y` when preserving class proportions is appropriate. Time-series data and grouped data often require different splitting strategies.

## 14.3 Avoid Data Leakage

Incorrect workflow:

1. Calculate statistics using the entire dataset.
2. Fill or scale all rows.
3. Split into training and test sets.

This allows information from the test set to influence preprocessing.

Better workflow:

1. Split the data.
2. Fit imputation/scaling rules on training data.
3. Transform training data.
4. Apply the same fitted rules to validation/test data.

Example with Scikit-learn:

```python
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

numeric_preprocessor = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

X_train_scaled = numeric_preprocessor.fit_transform(X_train)
X_test_scaled = numeric_preprocessor.transform(X_test)
```

For mixed numerical and categorical columns, use `ColumnTransformer` to apply different preprocessing pipelines to different column groups.

---

# 15. Common Pandas Mistakes

| Mistake | Why it is a problem | Better approach |
|---|---|---|
| Using `and` / `or` on Series | Ambiguous truth value | Use `&` / `|` with parentheses |
| Confusing `loc` and `iloc` | Label and position selection differ | Choose based on labels vs positions |
| Assuming `dropna()` is always safe | Can discard substantial or biased data | Measure missingness and justify removal |
| Filling every column with mean | Mean is not meaningful for categories and may be outlier-sensitive | Choose a column-appropriate strategy |
| Joining without checking key uniqueness | Can multiply rows | Inspect keys and use `validate` |
| Using `concat()` as a key-based join | It aligns on index/axis, not business keys | Use `merge()` for key-based matching |
| Ignoring data types | Numeric/date values may be treated as text | Inspect `dtypes` and convert carefully |
| Treating every outlier as an error | Valid rare observations may be removed | Investigate domain context |
| Scaling before splitting | Causes data leakage | Fit transformations on training data only |
| Using `apply()` for every operation | May be slower than vectorized operations | Prefer built-in vectorized methods when suitable |
| Forgetting `index=False` during export | Can create an unwanted index column | Choose export index behaviour intentionally |

## 15.1 Chained Assignment

Avoid code such as:

```python
# Avoid relying on chained assignment
# df[df["age"] > 20]["city"] = "Delhi"
```

Use `.loc`:

```python
df.loc[df["age"] > 20, "city"] = "Delhi"
```

This makes the intended assignment explicit and avoids chained-assignment ambiguity.

## 15.2 Copying a Filtered DataFrame

When you intend to modify a filtered subset independently:

```python
high_scorers = df.loc[df["marks"] >= 80].copy()
high_scorers["result"] = "High"
```

Using `.copy()` communicates that the new object is intended to be modified separately.

---

# 16. Performance and Memory Practices

- Load only required columns with `usecols`.
- Read very large CSV files in chunks when appropriate.
- Use suitable numeric and categorical dtypes.
- Avoid unnecessary copies of large DataFrames.
- Prefer vectorized operations over Python-level row loops.
- Use `category` for suitable low-cardinality repeated labels, after checking trade-offs.
- Inspect memory with `df.memory_usage(deep=True)`.
- Consider Parquet for repeated analytical workloads when supported by the environment.

```python
memory_bytes = df.memory_usage(deep=True).sum()
print(f"Approximate DataFrame memory: {memory_bytes:,} bytes")
```

Performance depends on data size, dtype, operation, memory layout, and environment. Benchmark representative workloads rather than assuming one method is always faster.

---

# 17. Interview Preparation

## Beginner Level

### Q1. What is Pandas, and why is it used in machine learning?

**Answer:** Pandas is a Python library for working with labelled tabular data. It is used to load, inspect, clean, transform, combine, and summarize datasets before analysis or model training.

**Key distinction:** NumPy is especially useful for numerical arrays, while Pandas adds labelled rows and columns, heterogeneous column types, and convenient data manipulation.

### Q2. What is the difference between a Series and a DataFrame?

**Answer:**

- A Series is one-dimensional and has an index.
- A DataFrame is two-dimensional and has row and column labels.
- Selecting `df["age"]` usually returns a Series.
- Selecting `df[["age"]]` returns a one-column DataFrame.

### Q3. How do you inspect a DataFrame quickly?

**Answer:**

```python
df.head()
df.shape
df.info()
df.describe()
df.isna().sum()
df.duplicated().sum()
```

Each command answers a different question about the data.

### Q4. What is the difference between `loc` and `iloc`?

**Answer:** `loc` selects using labels, whereas `iloc` selects using integer positions.

```python
df.loc[2, "age"]   # Label-based
df.iloc[2, 1]      # Position-based
```

### Q5. How do you find missing values in each column?

**Answer:**

```python
df.isna().sum()
```

To calculate percentages:

```python
df.isna().mean() * 100
```

### Q6. What is the difference between `dropna()` and `fillna()`?

**Answer:**

- `dropna()` removes rows or columns according to a missingness rule.
- `fillna()` replaces missing values with selected values or strategies.

The correct choice depends on why values are missing and how much information would be lost.

## Intermediate Level

### Q7. Explain the split–apply–combine pattern in `groupby()`.

**Answer:**

1. Split records into groups.
2. Apply an aggregation or transformation to each group.
3. Combine the results.

```python
df.groupby("department")["salary"].mean()
```

This calculates average salary for each department.

### Q8. What is the difference between `merge()` and `concat()`?

**Answer:**

- `merge()` combines data using matching keys, similar to SQL joins.
- `concat()` combines objects along an axis, usually by stacking rows or columns.

Use `merge()` when records must match by an identifier.

### Q9. Explain inner, left, right, and outer joins.

**Answer:**

- Inner: matching keys only.
- Left: every left-side key, with matching right-side values.
- Right: every right-side key, with matching left-side values.
- Outer: every key from both sides.

### Q10. Why can a merge unexpectedly increase the number of rows?

**Answer:** A join key may occur multiple times in one or both tables. Matching duplicate keys creates multiple combinations.

For example, two left-side rows and three right-side rows for the same key can produce six joined rows.

Check key uniqueness and use the `validate` argument when the expected relationship is known.

### Q11. What is the difference between `count()` and `size()` in GroupBy?

**Answer:**

- `size()` counts rows in each group.
- `count()` counts non-missing values in the selected column.

### Q12. What is the difference between `agg()` and `transform()`?

**Answer:**

- `agg()` summarizes each group and generally returns fewer rows.
- `transform()` returns values aligned to the original rows, making it useful for adding group-level statistics to each record.

### Q13. Why should you not calculate imputation values on the entire dataset before splitting?

**Answer:** The test set influences the preprocessing statistics. This is a form of data leakage and can make evaluation overly optimistic. Fit imputation on training data and apply the fitted transformation to test data.

## Advanced Level

### Q14. What is data leakage?

**Answer:** Data leakage occurs when information unavailable at prediction time, or information from the evaluation data, influences model training or preprocessing. Examples include fitting a scaler on the complete dataset before splitting or using future values to construct past features.

### Q15. How would you handle a column with 70% missing values?

**Answer:** There is no universal threshold. Investigate:

- Why the values are missing.
- Whether missingness is informative.
- Whether the feature is important.
- Whether missingness differs across target groups.
- Whether a missingness indicator helps.
- Whether the column should be excluded.

Make the decision using training data and domain knowledge.

### Q16. How do you investigate an unexpectedly large row count after a merge?

**Answer:**

1. Compare row counts before and after the merge.
2. Check key uniqueness on both sides.
3. Inspect duplicate keys.
4. Determine the intended relationship: one-to-one, one-to-many, or many-to-one.
5. Use `validate` to enforce the expected relationship.
6. Inspect unmatched records using `indicator=True`.

### Q17. Does correlation imply causation?

**Answer:** No. Correlation measures association. A relationship may be caused by confounding variables, reverse causality, selection effects, or coincidence. Causal conclusions require an appropriate research design and assumptions.

### Q18. How would you perform EDA on an unfamiliar dataset?

**Answer:**

1. Understand the problem and data dictionary.
2. Load and inspect the data.
3. Check dimensions, types, missingness, and duplicates.
4. Validate ranges and categories.
5. Study numerical and categorical distributions.
6. Investigate relationships between features.
7. Inspect the target variable.
8. Identify outliers and possible leakage.
9. Document findings.
10. Build preprocessing steps using training data only.

## Output-Based Questions

### Q19. What does this return?

```python
df[["age"]].shape
```

**Answer:** A two-dimensional shape `(number_of_rows, 1)` because double brackets select a DataFrame containing one column.

### Q20. What does this return?

```python
df["city"].value_counts()
```

**Answer:** Counts of each non-missing city value, sorted by frequency by default.

### Q21. What does this do?

```python
df.groupby("city")["salary"].transform("mean")
```

**Answer:** It calculates the mean salary within each city and returns a Series aligned to the original rows.

### Q22. What is the risk in this code?

```python
pd.merge(left, right, on="id")
```

**Answer:** The default join is inner. Unmatched keys are removed. Duplicate keys can also multiply rows. Specify the intended `how` and validate the expected key relationship.

---

# 18. Hands-On Practice

Use a real or synthetic tabular dataset. Do not only read the solutions; implement each task.

## Exercise 1 — Dataset Inspection

Given a CSV file:

1. Load it using Pandas.
2. Print its shape and columns.
3. Inspect the first and last five rows.
4. Display data types.
5. Generate numerical and categorical summaries.
6. Count missing values and duplicates.

## Exercise 2 — Filtering and Transformation

1. Select three relevant columns.
2. Filter rows using two conditions.
3. Sort by a numerical column.
4. Create a derived column.
5. Convert an incorrectly typed column.
6. Standardize inconsistent category labels.

## Exercise 3 — Missing Data

1. Calculate missing counts and percentages.
2. Compare mean and median for a skewed numerical column.
3. Impute a numerical column.
4. Impute a categorical column.
5. Add a missingness indicator.
6. Explain why the chosen strategy is appropriate.

## Exercise 4 — Dataset Joining

Create two DataFrames:

- Students: `student_id`, `name`, `city`.
- Scores: `student_id`, `subject`, `marks`.

Perform inner, left, right, and outer joins. Check row counts and duplicate keys. Explain why the results differ.

## Exercise 5 — GroupBy Analysis

Using a sales dataset:

1. Calculate total revenue by region.
2. Calculate average order value by product.
3. Find the top-selling product in each region.
4. Count transactions by month.
5. Compare `agg()` and `transform()`.

## Exercise 6 — EDA Report

Create a short EDA report containing:

- Dataset overview.
- Data quality findings.
- Numerical distributions.
- Categorical frequencies.
- Relationships between important features.
- Outlier investigation.
- Target distribution.
- Recommended preprocessing steps.

## Exercise 7 — End-to-End Preparation

Build a reproducible preprocessing workflow:

1. Load data.
2. Separate features and target.
3. Split the dataset.
4. Fit imputation on training data.
5. Transform training and test data.
6. Scale numerical features where appropriate.
7. Encode categorical features where appropriate.
8. Verify output shapes and missingness.
9. Document all fitted transformations.

---

# 19. Quick Revision Cheat Sheet

## Essential Commands

| Task | Pandas command |
|---|---|
| Load CSV | `pd.read_csv()` |
| Save CSV | `df.to_csv()` |
| First rows | `df.head()` |
| Dataset dimensions | `df.shape` |
| Column data types | `df.dtypes` |
| Structural summary | `df.info()` |
| Descriptive statistics | `df.describe()` |
| Missing values | `df.isna().sum()` |
| Duplicate rows | `df.duplicated().sum()` |
| Select column | `df["column"]` |
| Label selection | `df.loc[]` |
| Position selection | `df.iloc[]` |
| Filter rows | `df[condition]` |
| Sort | `df.sort_values()` |
| Rename | `df.rename()` |
| Remove rows/columns | `df.drop()` |
| Fill missing values | `df.fillna()` |
| Remove missing values | `df.dropna()` |
| Remove duplicates | `df.drop_duplicates()` |
| Combine by key | `pd.merge()` |
| Combine along axis | `pd.concat()` |
| Group and summarize | `df.groupby()` |
| Pivot summary | `pd.pivot_table()` |
| Correlation | `df.corr()` |
| Export to CSV | `df.to_csv()` |

## Core Concepts to Remember

- Series = one-dimensional labelled data.
- DataFrame = two-dimensional labelled table.
- `loc` = label-based selection.
- `iloc` = position-based selection.
- `isna()` = missing-value detection.
- `merge()` = key-based combination.
- `concat()` = axis-based combination.
- `groupby()` = split–apply–combine.
- `agg()` = group summary.
- `transform()` = group result aligned to original rows.
- EDA = structured investigation of data.
- Correlation does not establish causation.
- Fit learned preprocessing on training data only.

## EDA Checklist

- [ ] Understand the dataset and its objective.
- [ ] Inspect shape, columns, and data types.
- [ ] Check missing values.
- [ ] Check duplicate records.
- [ ] Validate numerical ranges.
- [ ] Inspect categorical values.
- [ ] Study distributions.
- [ ] Investigate relationships.
- [ ] Check outliers.
- [ ] Inspect target distribution.
- [ ] Identify potential data leakage.
- [ ] Document cleaning decisions.
- [ ] Build reproducible preprocessing steps.

---

# 20. Key Takeaways

1. Pandas provides labelled data structures and practical tools for tabular data manipulation.
2. Loading data is only the beginning; inspection is essential before analysis.
3. Missing values require investigation and a justified strategy.
4. Duplicate records and inconsistent categories can distort analysis.
5. `merge()`, `concat()`, and `join()` solve different data-combination problems.
6. `groupby()` makes grouped analysis systematic.
7. EDA uses summaries and visualizations to discover data quality issues, distributions, and relationships.
8. Outliers should be investigated, not automatically deleted.
9. Data preprocessing must be fitted on training data only to avoid leakage.
10. A good EDA workflow is reproducible, documented, and driven by questions.

---

# 21. Curated Learning Resources

1. [Kaggle — Pandas Micro-course](https://www.kaggle.com/learn/pandas)
   - Guided practice with Series, DataFrames, indexing, grouping, and data types.

2. [Corey Schafer — Pandas Tutorials](https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS)
   - Video explanations and practical demonstrations of Pandas workflows.

3. [Kaggle — Data Visualization](https://www.kaggle.com/learn/data-visualization)
   - Practice creating charts and communicating patterns in data.

4. [Pandas — Getting Started Documentation](https://pandas.pydata.org/docs/getting_started/index.html)
   - Official introduction and practical examples.

5. [Pandas — User Guide](https://pandas.pydata.org/docs/user_guide/index.html)
   - Detailed reference for indexing, missing data, merging, grouping, and visualization.

6. [Pandas — API Reference](https://pandas.pydata.org/docs/reference/index.html)
   - Exact function signatures and behaviour.

---

**End of Lecture 2 — Pandas + EDA**

**Next learning step:** Apply these operations to an unfamiliar dataset and produce a concise EDA report before moving to the next ML topic.
