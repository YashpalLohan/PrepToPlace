# Day 14 — Mock Interview Drill + Start Project

## 1. Overview

Today is an interview-performance day, not a new algorithm lecture.

The task is to select 10 questions from **Chip Huyen's Machine Learning Interviews book**, answer each out loud in **two minutes**, and identify gaps that need revision.

The book contains more than 200 knowledge questions and a separate set of 30 open-ended questions. Use the linked book as the primary question bank. The 10 prompts below are an original practice set aligned with common ML interview themes; they are not copied verbatim from the book.

## 2. What a Two-Minute Answer Should Contain

Use this structure:

| Time | What to do |
|---|---|
| 0–15 sec | Define the concept and state why it matters |
| 15–45 sec | Explain the mechanism or core intuition |
| 45–80 sec | Give a small example, equation, or practical situation |
| 80–105 sec | Discuss assumptions, trade-offs, or failure modes |
| 105–120 sec | Summarise and state when you would use it |

Do not spend the entire answer defining terminology. Interviewers want to see whether you can reason, connect concepts, and communicate clearly.

## 3. The 10-Question Mock Interview Set

Use the official book to choose or cross-reference the closest matching question in its topic sections. Attempt every question without reading notes first.

### Question 1 — Bias, Variance, and Generalisation

**Prompt:** A model achieves very high training performance but much worse validation performance. Explain what may be happening and how you would investigate it.

A strong answer should mention:
- Overfitting and a large generalisation gap
- Bias–variance intuition
- Train/validation curves and data quality
- Model complexity, regularisation, and more representative data
- Leakage checks before changing the model

**Follow-up:** What pattern would suggest underfitting instead?

### Question 2 — Regularisation

**Prompt:** Explain the difference between L1 and L2 regularisation and when you would choose each.

A strong answer should mention:
- Penalty added to the training objective
- L1 absolute-value penalty and sparse coefficients
- L2 squared penalty and coefficient shrinkage
- Scaling and the role of regularisation strength
- Correlated features and Elastic Net as another option

**Follow-up:** Does a non-zero or zero coefficient prove that a feature is or is not causal?

### Question 3 — Data Leakage

**Prompt:** Explain data leakage. Give two examples and show how you would prevent them in a production-quality training workflow.

A strong answer should mention:
- Information unavailable at prediction time entering training
- Preprocessing fitted on the full dataset before splitting
- Future information or target-derived features
- Pipelines and fold-specific fitting
- Time-aware splits when the data is temporal

**Follow-up:** Why can leakage make cross-validation scores look unusually good?

### Question 4 — Evaluation Under Class Imbalance

**Prompt:** You are building a classifier where the positive class is rare. Why might accuracy be misleading, and what would you measure instead?

A strong answer should mention:
- Majority-class baseline
- Confusion matrix
- Precision, recall, and F1
- PR-AUC vs ROC-AUC and the business cost of false positives/negatives
- Threshold selection using validation data

**Follow-up:** Which metric would you prioritise for fraud detection, and what additional context would you need?

### Question 5 — Cross-Validation

**Prompt:** Explain k-fold cross-validation and describe when you would use stratified, grouped, or time-based splitting.

A strong answer should mention:
- Repeated train/validation folds
- Aggregated score and variability
- Stratification for class proportions
- Group separation to prevent related records appearing in both sets
- Time-based split to respect chronology

**Follow-up:** Why is a random split unsafe for some time-series or user-level datasets?

### Question 6 — Feature Importance

**Prompt:** A Random Forest says that one feature is the most important. What does that mean, and how would you validate the result?

A strong answer should mention:
- Impurity-based importance vs permutation importance
- Correlated features can share or distort apparent importance
- Importance depends on data and model
- Validation set and domain reasoning
- Importance is not causality

**Follow-up:** What can happen if you permute one of two highly correlated features?

### Question 7 — Model Selection

**Prompt:** You have a small dataset and several candidate models. How would you choose a model and estimate its performance without overfitting the selection process?

A strong answer should mention:
- A simple baseline
- Metric aligned to the problem
- Cross-validation on training data
- Hyperparameter search and nested CV where appropriate
- Untouched final test set

**Follow-up:** What changes if the dataset contains multiple rows per customer?

### Question 8 — Unsupervised Learning

**Prompt:** How would you decide whether K-Means is suitable for a dataset, and how would you choose K?

A strong answer should mention:
- Unlabelled data and clustering objective
- Numeric, distance-based geometry and feature scaling
- Roughly compact/convex clusters as a favourable setting
- Elbow/inertia and silhouette as diagnostics, not absolute truth
- Sensitivity to initialisation and outliers

**Follow-up:** When would DBSCAN or hierarchical clustering be a better candidate?

### Question 9 — Dimensionality Reduction

**Prompt:** Explain PCA and give one situation where reducing dimensions could hurt a predictive model.

A strong answer should mention:
- Centered data and directions of maximum variance
- Principal components as orthogonal directions
- Explained variance ratio
- Scaling and train-only fitting
- Loss of low-variance but predictive information and reduced interpretability

**Follow-up:** Why is PCA not the same as feature selection?

### Question 10 — From Experiment to Production

**Prompt:** A model performs well offline but performs poorly after deployment. Describe the areas you would investigate.

A strong answer should mention:
- Training-serving skew and preprocessing mismatch
- Data quality, schema, and missing values
- Data drift and concept drift
- Label delay and monitoring
- Latency, reliability, rollback, and retraining criteria

**Follow-up:** Which signals would you monitor if labels arrive weeks after predictions?

## 4. Scoring Rubric

Score each answer from 0 to 4:

| Score | Standard |
|---:|---|
| 0 | No meaningful answer or major misconception |
| 1 | Basic definition, little explanation |
| 2 | Correct concept and a partial example |
| 3 | Clear mechanism, example, and trade-off |
| 4 | Structured answer, correct assumptions, practical judgement, and concise summary |

Maximum score: **40 points**.

Suggested interpretation:
- 34–40: strong; focus on precision and follow-up depth.
- 26–33: good foundation; revise weak areas.
- 16–25: concepts are incomplete; revisit relevant notes.
- 0–15: pause the drill and rebuild fundamentals before repeating.

These bands are a self-assessment aid, not a formal hiring benchmark.

## 5. How to Run the Drill

1. Open Chip Huyen's book and choose the corresponding knowledge questions.
2. Pick the 10 prompts above or substitute exact book questions of similar topics.
3. Start a two-minute timer for each question.
4. Answer out loud without notes.
5. Record yourself if possible.
6. Score each answer using the rubric.
7. Write down the missing concept or weak explanation.
8. Re-answer only the weak questions after revision.

Do not memorise paragraphs. Practise explaining the reasoning in your own words.

## 6. Answer Review Template

Copy this template for each question:

```text
Question:
My 2-minute answer:
What I explained correctly:
What I missed:
Incorrect or vague statement:
Follow-up I struggled with:
Topic to revise:
Score (0–4):
Second-attempt improvement:
```

## 7. Start the ML Project

After the drill, choose one project that demonstrates the complete ML workflow rather than only model training.

A suitable scope:
- Define a real prediction or grouping problem.
- Find a documented dataset and inspect its licence.
- Write a clear problem statement and target definition.
- Build a simple baseline.
- Create a reproducible train/validation/test strategy.
- Build preprocessing and model steps in a pipeline.
- Compare at least two relevant models.
- Evaluate with metrics that match the problem.
- Analyse errors and limitations.
- Save the model and create a small inference interface or API.
- Document setup, results, limitations, and future work.

Do not choose a project only because the model sounds advanced. Data quality, evaluation, reproducibility, and clear communication are stronger evidence of ML skill.

## 8. Suggested Project Milestones

| Milestone | Deliverable |
|---|---|
| 1. Problem framing | Problem statement, users, target, success metric |
| 2. Data understanding | Dataset source, licence, schema, EDA |
| 3. Baseline | Simple model and baseline metric |
| 4. Feature pipeline | Imputation, encoding, scaling where needed |
| 5. Model comparison | Cross-validation table and chosen model |
| 6. Error analysis | Failure cases, limitations, fairness checks where relevant |
| 7. Deployment | Saved artifact and simple API/demo |
| 8. Documentation | Reproduction steps, results, trade-offs, next steps |

## 9. Final Checklist

- [ ] Select 10 questions from Chip Huyen's book or the aligned drill above.
- [ ] Answer every question aloud in two minutes.
- [ ] Include a definition, mechanism, example, and trade-off.
- [ ] Score each answer out of four.
- [ ] List weak topics and schedule revision.
- [ ] Choose one ML project with a concrete problem statement.
- [ ] Define a baseline and a leakage-safe evaluation plan.
- [ ] Create the first project milestone before adding advanced models.

## 10. Recommended Resources

- [Chip Huyen: Machine Learning Interviews Book](https://huyenchip.com/ml-interviews-book/)
- [Chip Huyen: ML Systems Design / Open-Ended Questions](https://huyenchip.com/machine-learning-systems-design/toc.html)
- [Krish Naik: Machine Learning Interview Questions](https://www.youtube.com/results?search_query=Krish+Naik+machine+learning+interview+questions)
- [Krish Naik: Data Science Interview Playlist](https://www.youtube.com/results?search_query=Krish+Naik+Data+Science+Interview+Playlist)
