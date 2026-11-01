# Day 21 — ML System Design + Interview Pattern Matching

## 1. Overview

ML system design is about building a complete system that uses machine learning to meet a real product or business requirement.

A model is only one component. A useful design connects:

```text
Problem & requirements
        |
Data collection and validation
        |
Feature engineering / feature store
        |
Training and model evaluation
        |
Model registry and deployment
        |
Online or batch inference
        |
Monitoring, feedback, and retraining
```

This lecture teaches a reusable framework for recommendation systems and churn prediction services.

## 2. Start with the Problem, Not the Algorithm

Clarify:
- Who uses the system?
- What action or decision will the prediction support?
- What is the prediction target?
- When must the prediction be available?
- What is the cost of false positives and false negatives?
- What is the latency and throughput requirement?
- What are the privacy, fairness, and security constraints?
- What does success mean for the business?

### Example: Churn prediction

A business wants to identify customers likely to leave in the next 30 days.

Define:
- Entity: customer or account.
- Prediction time: a specific scoring timestamp.
- Label: whether the customer churns within the next 30 days.
- Features: only information available at the scoring timestamp.
- Action: retention team outreach or an approved automated intervention.
- Success: incremental retention or reduced churn, not merely model AUC.

The label window and observation window must be defined precisely to prevent future-data leakage.

## 3. Functional and Non-Functional Requirements

### Functional requirements
What the system must do:
- Ingest user/item/event data.
- Generate training labels and features.
- Train and evaluate models.
- Serve scores or recommendations.
- Capture outcomes and feedback.

### Non-functional requirements
How well the system must operate:
- Latency
- Throughput
- Availability
- Scalability
- Reliability
- Freshness
- Cost
- Privacy and security
- Fairness and explainability where required

These requirements determine whether batch, online, or hybrid inference is appropriate.

## 4. Batch vs Online Inference

| Aspect | Batch inference | Online inference |
|---|---|---|
| Execution | Scheduled or event-driven bulk scoring | Request-time prediction |
| Latency | Minutes to hours may be acceptable | Often milliseconds to seconds |
| Cost pattern | Efficient for large batches | Persistent serving infrastructure |
| Data freshness | Depends on refresh schedule | Can use fresher request-time data |
| Examples | Daily churn scores, weekly segments | Search ranking, live fraud checks |

A hybrid system may precompute candidate features or recommendations and rerank them online.

## 5. Data Layer

Identify data sources and their ownership:
- Application events
- Transactions
- Customer/account records
- Product/catalogue data
- Support interactions
- Labels and outcomes
- External or partner data, if permitted

Define:
- Schema and data contracts
- Event timestamps and ingestion timestamps
- Primary keys and entity joins
- Missingness and duplicate policies
- Retention and deletion rules
- Access controls and privacy constraints
- Data-quality checks

A data pipeline should be idempotent where possible, observable, and able to handle late or corrected events.

## 6. Feature Engineering and Feature Store

Features are computed values used by the model.

Churn examples:
- Days since last activity
- Number of sessions in last 7/30 days
- Change in usage over time
- Support ticket count
- Payment failures
- Plan type

Recommendation examples:
- User's recent interactions
- Item popularity
- Item category
- User–item history
- Context such as time or device, when appropriate

### Offline and online feature consistency

A **training-serving skew** occurs when features are computed differently during training and serving.

A feature store can help manage:
- Offline historical features for training.
- Online low-latency features for serving.
- Shared definitions and metadata.
- Point-in-time correctness.

A feature store is not mandatory for every small system. It introduces operational complexity and should solve a real reuse, consistency, or latency problem.

## 7. Training Data and Point-in-Time Correctness

For every training example, reconstruct features as they existed at the prediction timestamp.

This avoids:
- Future transactions leaking into past examples.
- Labels or post-outcome fields entering features.
- Incorrect joins that expose information from later events.

Use time-aware splits for temporal problems and group-aware splits when multiple rows belong to the same user/account.

For churn, distinguish:
- Observation window: historical period used to construct features.
- Prediction horizon: future period over which churn is labelled.
- Label availability delay: time needed before the outcome is known.

## 8. Model Development and Evaluation

Start with a baseline:
- Churn: Logistic Regression, simple rules, or a tree-based baseline.
- Recommendation: popularity, recency, or content-based baseline.

Then select models based on:
- Data volume and quality
- Required latency
- Feature types
- Interpretability
- Operational complexity
- Business objective

### Churn metrics
- Recall: fraction of future churners identified.
- Precision: fraction of flagged customers who churn.
- PR-AUC / ROC-AUC: ranking quality at different thresholds.
- Calibration: whether predicted probabilities match observed frequencies.
- Lift/gain: how concentrated churners are in the highest-risk segment.

### Recommendation metrics
Offline ranking metrics may include:
- Precision@K
- Recall@K
- NDCG@K
- MAP
- Hit Rate@K

Offline metrics are proxies. Online experiments and business outcomes are needed to assess impact.

## 9. Recommendation System Design

A practical large-scale recommender often separates candidate generation from ranking.

### Stage 1: Candidate generation

Produce a manageable set of candidate items using one or more sources:
- Popular or trending items
- Collaborative filtering
- User/item embeddings
- Content similarity
- Recently viewed or related items

### Stage 2: Ranking

Score candidates using richer features:
- User history
- Item properties
- User–item interaction features
- Context
- Recency and availability
- Business constraints

### Stage 3: Re-ranking and policy

Apply rules such as:
- Remove unavailable or blocked items.
- Avoid excessive duplicates.
- Enforce diversity or freshness.
- Respect safety, privacy, and eligibility rules.

### Stage 4: Feedback

Capture impressions, clicks, saves, purchases, skips, and other meaningful events. Log what was shown, not only what was clicked, to reduce feedback-data blind spots.

```text
User request
    |
Fetch user/context features
    |
Candidate generation
    |
Candidate filtering
    |
Ranking model
    |
Business rules / re-ranking
    |
Top-K recommendations
    |
Log impressions and outcomes
```

## 10. Churn Prediction Service Design

A simple batch-first architecture:

```text
Product / billing / support events
             |
       Data ingestion
             |
   Warehouse / data lake
             |
 Point-in-time feature creation
             |
     Label generation
             |
   Training + validation
             |
     Model registry
             |
      Batch scoring
             |
  CRM / retention dashboard
             |
    Intervention outcomes
             |
      Monitoring loop
```

For time-sensitive use cases, add an online endpoint and online feature retrieval. Do not add low-latency infrastructure unless the product requirement needs it.

A score alone is not the intervention. Define who receives it, what action follows, how many customers can be contacted, and how success will be measured.

## 11. Serving Architecture

Common options:
- Batch scoring job writing predictions to a warehouse.
- Synchronous HTTP model API.
- Asynchronous queue-based inference for work that need not complete in the request.
- Hybrid architecture: batch candidate/features plus online ranking.

Consider:
- Request schema and versioning
- Feature freshness
- Timeout and fallback behaviour
- Model loading and warm-up
- Autoscaling
- Authentication and authorisation
- Rate limiting
- Idempotency for asynchronous jobs
- Model/version traceability

## 12. Monitoring

Monitor four layers.

### System monitoring
- Request rate
- Latency percentiles (p50, p95, p99)
- Error rate
- CPU, memory, and queue depth
- Availability

### Data monitoring
- Missing values
- Schema changes
- Invalid ranges
- Category changes
- Feature freshness
- Input distribution drift

### Model monitoring
- Prediction distribution
- Confidence or score distribution
- Calibration
- Precision/recall/AUC after labels arrive
- Segment-level performance
- Fairness-related measures where appropriate

### Business monitoring
- Churn reduction or retention lift
- Recommendation engagement and conversion
- Revenue or cost impact
- User complaints and negative feedback
- Experiment guardrail metrics

Data drift does not automatically imply performance degradation. Track outcomes where labels are available.

## 13. Feedback Loops and Retraining

Model predictions can influence the data later collected.

Examples:
- A recommender shows popular items more often, creating more interactions for those items.
- A churn intervention contacts high-risk customers, potentially changing whether they churn.
- A fraud model blocks transactions, changing the distribution of observed transactions.

This is a feedback loop. Logged exposure, decisions, interventions, and outcomes are needed to interpret the resulting data.

Retraining strategies can be:
- Scheduled (weekly/monthly).
- Triggered by data-quality or drift alerts.
- Triggered when measured performance falls below a defined threshold.
- Human-approved for high-impact systems.

Do not retrain automatically on every drift alert without validation and release controls.

## 14. Reliability, Rollout, and Rollback

Safe release patterns include:
- Offline validation before deployment.
- Shadow deployment: compare predictions without affecting users.
- Canary release: route a small portion of traffic to a new model.
- A/B test: compare user or business outcomes under controlled assignment.
- Gradual rollout with monitoring.
- Rollback to a previously validated model.

Keep model artifacts, feature definitions, code, and evaluation reports versioned.

## 15. ML System Design Interview Framework

Use this sequence for a 30–45 minute design discussion:

1. **Clarify the problem:** target, users, prediction time, objective.
2. **Set requirements:** latency, throughput, availability, freshness, cost.
3. **Define data:** sources, labels, privacy, quality, splits.
4. **Design features:** point-in-time correctness and training-serving consistency.
5. **Choose a baseline:** simple model and baseline metrics.
6. **Select evaluation:** offline metrics, calibration, online experiment.
7. **Design serving:** batch, online, or hybrid.
8. **Plan monitoring:** system, data, model, and business health.
9. **Handle change:** feedback loops, retraining, versioning, rollback.
10. **Discuss trade-offs:** simplicity, latency, cost, interpretability, quality.

Do not jump straight to deep learning or a feature store. First establish why the system needs them.

## 16. Common Mistakes

- Starting with an algorithm instead of clarifying the business problem.
- Using features that are unavailable at prediction time.
- Randomly splitting temporal or grouped data.
- Treating offline metrics as proof of business value.
- Ignoring training-serving skew.
- Designing online inference when batch scoring is sufficient.
- Ignoring popularity bias and feedback loops in recommendation systems.
- Monitoring only API uptime and not data/model quality.
- Retraining without validation or rollback.
- Forgetting privacy, security, fairness, and user impact.

## 17. Placement and Interview Questions

**Q1. What is ML system design?**  
Designing the full data, feature, training, evaluation, serving, and monitoring system that uses ML to meet product requirements.

**Q2. Batch vs online inference?**  
Batch scores many records on a schedule; online inference predicts at request time under tighter latency requirements.

**Q3. What is training-serving skew?**  
A mismatch between feature computation or data representations during training and serving.

**Q4. What is point-in-time correctness?**  
Ensuring each training example uses only information that existed at its prediction timestamp.

**Q5. Why use two-stage recommendation?**  
Candidate generation reduces a huge catalogue to a manageable set; ranking applies richer features to order those candidates.

**Q6. What is feedback-loop bias?**  
System decisions influence future observed data, which can reinforce earlier decisions or distort training signals.

**Q7. What should an ML monitoring system track?**  
System health, data quality/drift, model performance, and business outcomes.

**Q8. When should a model be retrained?**  
When a defined schedule or validated trigger indicates it is needed, followed by evaluation and controlled release.

**Q9. Why is A/B testing useful?**  
It estimates the effect of a model or policy change on user/business outcomes under controlled assignment.

## 18. Practice: Design a Churn Prediction Service

Prepare a 10-minute whiteboard answer.

Requirements:
- 10 million customers.
- Daily churn risk scores.
- Retention team can contact only the top 20,000 customers per day.
- Labels become reliable after a 30-day outcome window.
- Scores must be available by 7 AM.

Your design should cover:
1. Label and feature windows.
2. Data sources and ingestion.
3. Point-in-time feature generation.
4. Baseline model and evaluation metrics.
5. Daily batch scoring architecture.
6. Ranking customers under the intervention budget.
7. Monitoring and delayed labels.
8. Experiment design to measure retention lift.
9. Retraining and rollback strategy.

## 19. Practice: Design a Recommendation System

Prepare a second 10-minute whiteboard answer.

Requirements:
- A catalogue with millions of items.
- Personalised top-20 recommendations.
- New users and new items must receive reasonable recommendations.
- Recommendations should respect item availability.

Cover:
1. Candidate generation sources.
2. Cold-start fallbacks.
3. Ranking features and objective.
4. Re-ranking/diversity rules.
5. Online latency and caching.
6. Impression and outcome logging.
7. Offline and online evaluation.
8. Monitoring for feedback loops and popularity bias.

## 20. Quick Revision

- **ML system design:** data-to-business-outcome system, not just a model.
- **Requirements:** objective, latency, throughput, availability, cost, privacy.
- **Point-in-time correctness:** no future information in training features.
- **Batch inference:** scheduled bulk scoring.
- **Online inference:** prediction during a request.
- **Feature store:** shared offline/online feature management when justified.
- **Recommendation:** candidate generation → ranking → re-ranking.
- **Monitoring:** system, data, model, and business metrics.
- **Feedback loop:** predictions affect future observed data.
- **Release:** shadow/canary/A-B test with rollback.

## 21. Final Checklist

- [ ] Clarify target, user, prediction time, and business metric.
- [ ] Choose batch, online, or hybrid inference based on requirements.
- [ ] Explain point-in-time correctness and training-serving skew.
- [ ] Draw a recommendation architecture.
- [ ] Draw a churn prediction architecture.
- [ ] Define offline and online evaluation.
- [ ] Explain feedback loops and monitoring.
- [ ] Describe controlled rollout, retraining, and rollback.

## 22. Recommended Resources

- [Chip Huyen: Designing Machine Learning Systems](https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/)
- [Stanford CS329S: Machine Learning Systems Design](https://web.stanford.edu/class/cs329s/)
- [Krish Naik: End-to-end ML lifecycle](https://www.youtube.com/results?search_query=Krish+Naik+end+to+end+machine+learning+lifecycle)
- [Chip Huyen: Machine Learning Systems Design course announcement](https://huyenchip.com/2020/10/27/ml-systems-design-stanford.html)
