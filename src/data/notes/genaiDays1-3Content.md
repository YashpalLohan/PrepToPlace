# Days 1–3 — AI/ML/DL/GenAI Orientation

## 1. Overview

This block establishes the terminology and problem-solving workflow behind Artificial Intelligence (AI), Machine Learning (ML), Deep Learning (DL), and Generative AI.

You will learn:
- Traditional rule-based programming vs machine learning.
- How AI, ML, DL, and Generative AI relate.
- Supervised, unsupervised, semi-supervised, self-supervised, and reinforcement learning.
- Common ML task types.
- Where generative models fit into modern AI applications.

## 2. Traditional Programming vs Machine Learning

### Traditional programming

A developer writes explicit rules. The program applies those rules to input data and produces output.

```text
Input data + Hand-written rules
              |
           Program
              |
            Output
```

Example: a tax calculator uses explicit rules and formulas to calculate tax from income and other inputs.

### Machine learning

Instead of writing every decision rule manually, we provide examples and a learning algorithm. Training estimates a model that maps inputs to outputs.

```text
Training examples + Learning algorithm
                  |
                Training
                  |
              Learned model

New input + Learned model → Prediction
```

Example: an email spam classifier learns patterns from labelled spam and non-spam emails.

### Main comparison

| Aspect | Traditional programming | Machine learning |
|---|---|---|
| Rules | Written explicitly | Learned from data |
| Inputs | Data and rules | Data; labels for supervised tasks |
| Output | Program result | Trained model / prediction |
| Best fit | Stable, explicit logic | Patterns too complex to specify manually |
| Main risk | Incorrect or incomplete rules | Poor data, bias, leakage, overfitting, drift |

Machine learning is not automatically better. Use explicit code for deterministic business rules and ML where learning patterns from data adds value.

## 3. AI vs ML vs DL vs Generative AI

These terms describe overlapping areas, not four unrelated technologies.

```text
Artificial Intelligence (AI)
    |
    +-- Machine Learning (ML)
            |
            +-- Deep Learning (DL)
                    |
                    +-- Many modern Generative AI systems
```

### Artificial Intelligence

AI is the broad field of building systems that perform tasks associated with intelligent behaviour, such as perception, reasoning, planning, language, and decision-making.

AI includes:
- Rule-based expert systems.
- Search and planning.
- Constraint solving.
- Machine learning.
- Robotics and perception.

### Machine Learning

ML systems learn patterns or decision functions from data rather than relying only on manually written rules.

Examples:
- Spam classification.
- House-price prediction.
- Customer churn prediction.
- Customer segmentation.

### Deep Learning

DL is a subset of ML that uses neural networks with multiple layers to learn representations.

Examples:
- CNNs for image processing.
- RNNs and Transformers for sequence data.
- Deep networks for speech and multimodal tasks.

### Generative AI

Generative AI systems learn patterns in data and generate new content such as:
- Text.
- Code.
- Images.
- Audio.
- Video.
- Structured outputs.

Large Language Models (LLMs) are a major family of generative models that generate text token by token. Not all Generative AI is an LLM; image and audio models may use different architectures and objectives.

## 4. Discriminative vs Generative Models

A discriminative model focuses on predicting a target or separating classes.

Example:

\[
P(y\mid x)
\]

A generative model learns a data distribution or conditional generation process, such as:

\[
P(x)\quad\text{or}\quad P(x\mid c)
\]

where \(c\) may be a prompt or condition.

| Discriminative use | Generative use |
|---|---|
| Is this email spam? | Draft a reply to this email |
| Is this image a cat? | Generate an image of a cat |
| Predict next month's churn | Generate a customer-support summary |
| Classify a review's sentiment | Write a product description |

The distinction is about the task and model objective. A generative model can also be used to create representations or support discriminative tasks.

## 5. Types of Machine Learning

### Supervised learning

Training examples include inputs and target labels.

Tasks:
- Classification.
- Regression.

Example: predict house price using labelled historical sales.

### Unsupervised learning

Training data has no supplied target label. The algorithm searches for structure.

Tasks:
- Clustering.
- Dimensionality reduction.
- Density estimation.
- Anomaly exploration.

Example: group customers based on purchasing behaviour.

### Semi-supervised learning

Uses a small labelled dataset with a larger unlabelled dataset.

Useful when labels are expensive but raw data is available in quantity.

### Self-supervised learning

Creates supervision signals from the data itself.

Examples:
- Predict a masked token.
- Predict the next token.
- Contrast matching and non-matching image-text pairs.

Self-supervised pretraining is widely used to build representations before downstream fine-tuning.

### Reinforcement learning

An agent interacts with an environment, observes states, takes actions, and receives rewards.

Goal: learn a policy that maximises expected cumulative reward.

Examples:
- Game-playing agents.
- Robotics control.
- Some preference-optimisation stages for language-model alignment.

## 6. Common ML Task Types

| Task | Goal | Example output |
|---|---|---|
| Binary classification | Choose between two classes | Fraud / not fraud |
| Multiclass classification | Choose one of several classes | Cat / dog / bird |
| Multi-label classification | Predict several labels at once | Image tags |
| Regression | Predict a continuous value | Price |
| Clustering | Group similar examples | Customer segments |
| Dimensionality reduction | Compress representation | Lower-dimensional vectors |
| Anomaly detection | Identify unusual examples | Suspicious transaction |
| Ranking | Order candidates | Search results |
| Recommendation | Suggest relevant items | Products or videos |
| Generation | Produce new content | Text, image, audio |

## 7. A Typical Machine Learning Workflow

1. Define the problem and target.
2. Collect and understand data.
3. Clean data and inspect quality.
4. Split data using a valid strategy.
5. Create a baseline.
6. Engineer and preprocess features.
7. Train candidate models.
8. Evaluate with relevant metrics.
9. Tune using training/validation data.
10. Test once on held-out data.
11. Deploy and monitor.
12. Retrain or revise when evidence supports it.

The model is only one part of an ML system. Data definitions, evaluation, deployment, and monitoring matter equally.

## 8. Where Generative AI Fits in a Product

A typical generative AI application includes:

```text
User input / context
       |
Prompt construction
       |
Model / API
       |
Generated output
       |
Validation / business logic
       |
User-facing result
```

Real applications may also include:
- Retrieval from documents or databases.
- Tool calls and external APIs.
- Conversation state.
- Output schema validation.
- Safety checks.
- Monitoring and evaluation.

Do not assume a model response is always correct simply because it is fluent.

## 9. Strengths and Limitations of Generative AI

### Strengths
- Produces drafts, summaries, code, and creative content.
- Interacts through natural language.
- Can generalise to tasks not explicitly hard-coded.
- Can combine with retrieval and tools to support workflows.

### Limitations
- Can produce plausible but false information (hallucination).
- May reflect bias in training data.
- Can be sensitive to prompt wording and context.
- Has context-window and latency constraints.
- Can incur inference costs.
- Needs evaluation, privacy controls, and safeguards.

## 10. Choosing the Right Approach

Ask:
- Is the task deterministic and rule-based?
- Do we have examples and labels?
- Is the target a category, number, grouping, ranking, or generated artifact?
- Does the task need new content or just a prediction?
- How costly is an incorrect result?
- Does the application require human approval?

Use the simplest technique that meets the requirements. A small classifier or a deterministic function may be better than an LLM for some tasks.

## 11. Common Mistakes

- Saying AI and ML are identical.
- Treating DL and GenAI as synonyms.
- Assuming every AI system learns from data.
- Assuming every generative model is a language model.
- Confusing supervised and self-supervised learning.
- Treating a clustering label as ground truth.
- Assuming fluent generated content is factual.
- Starting model selection before defining the problem and metric.

## 12. Placement and Interview Questions

**Q1. What is the difference between traditional programming and ML?**  
Traditional programming uses manually specified rules; ML estimates patterns or decision functions from data.

**Q2. Is deep learning a subset of machine learning?**  
Yes. DL uses multi-layer neural networks to learn representations.

**Q3. Is Generative AI the same as deep learning?**  
No. Many modern generative systems use DL, but the terms describe different concepts.

**Q4. Supervised vs unsupervised learning?**  
Supervised learning uses labelled examples; unsupervised learning finds patterns without supplied target labels.

**Q5. What is self-supervised learning?**  
A method that derives training targets from the input data itself.

**Q6. What is reinforcement learning?**  
Learning a policy through interaction with an environment and reward feedback.

**Q7. Classification vs regression?**  
Classification predicts categories; regression predicts continuous values.

**Q8. What is a generative model used for?**  
Learning a data-generation process to create content such as text, images, audio, or other outputs.

## 13. Practice

### Concept exercises
1. Classify each example: spam detection, house-price prediction, customer segmentation, next-token prediction, robot navigation.
2. Explain why a rules-based calculator does not need ML.
3. Draw the relationship between AI, ML, DL, and Generative AI.
4. Give one discriminative and one generative solution for a customer-support task.

### Mini project
Pick a simple product use case and write:
- User problem.
- Input data.
- Desired output.
- Whether the solution needs rules, supervised ML, unsupervised ML, or generation.
- Cost of a wrong answer.
- Human-review requirement.

## 14. Quick Revision

- Traditional programming: data + explicit rules → output.
- ML: examples + algorithm → learned model.
- AI: broad field of intelligent systems.
- ML: systems learn from data.
- DL: multi-layer neural networks.
- GenAI: creates new content.
- Supervised: labelled data.
- Unsupervised: unlabelled structure discovery.
- Semi-supervised: limited labels + unlabelled data.
- Self-supervised: targets derived from data.
- Reinforcement: actions + rewards.
- Classification: category.
- Regression: number.
- Generation: new content.

## 15. Final Checklist

- [ ] Explain traditional programming vs ML.
- [ ] Explain AI, ML, DL, and Generative AI.
- [ ] Compare discriminative and generative tasks.
- [ ] Distinguish supervised, unsupervised, semi-supervised, self-supervised, and reinforcement learning.
- [ ] Identify common ML task types.
- [ ] Describe an end-to-end ML workflow.
- [ ] Explain GenAI strengths, limitations, and product components.

## 16. Recommended Resources

- [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Microsoft AI for Beginners](https://microsoft.github.io/AI-For-Beginners/)
- [Microsoft Learn — Generative AI for Beginners](https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/)
