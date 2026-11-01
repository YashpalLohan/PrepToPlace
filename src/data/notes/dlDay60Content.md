# Day 60 — Placement Readiness + Portfolio Packaging

## 1. Overview

This day turns the learning roadmap into evidence that can be reviewed by recruiters, interviewers, and engineers.

The goal is not to claim expertise in every deep learning topic. The goal is to show that you can:
- Identify a meaningful problem.
- Build a reproducible solution.
- Make sound modelling and engineering decisions.
- Evaluate honestly.
- Explain trade-offs.
- Package and communicate the result professionally.

This section is intentionally resource-extensible. Add your preferred resources later; no fixed external resource list is required for this day.

## 2. Select Projects That Demonstrate Depth

A strong portfolio should contain a small number of well-finished projects rather than many unfinished repositories.

A useful project mix for a CSE & AI student:

| Project type | What it demonstrates |
|---|---|
| Classical ML | Data preparation, feature engineering, evaluation |
| Deep Learning / Computer Vision | Model architecture, training, metrics, error analysis |
| NLP / Transformers | Tokenisation, embeddings, fine-tuning or retrieval |
| ML Engineering | Pipeline, API, Docker, reproducibility, monitoring |

Choose projects that genuinely reflect your work. Do not list a technology merely because it appears in a tutorial.

## 3. Project Storytelling Framework

Use this structure to explain every project:

1. **Problem:** What real need or task does the project address?
2. **Users:** Who would use it?
3. **Data:** Where did the data come from, and what are its limitations?
4. **Baseline:** What simple approach did you compare against?
5. **Approach:** What model and system did you build?
6. **Evaluation:** Which metrics did you choose and why?
7. **Result:** What did the experiments actually show?
8. **Trade-offs:** What did you sacrifice or simplify?
9. **Limitations:** Where does the system fail?
10. **Next steps:** What would you improve with more time or data?

Avoid describing only the model architecture. Explain the decisions that led to the final system.

## 4. GitHub Repository Cleanup

Before sharing a repository, check:

- Repository name is clear and professional.
- Description explains the project in one sentence.
- Repository visibility is intentional.
- No API keys, passwords, personal credentials, or private data are committed.
- `.gitignore` excludes virtual environments, caches, large local datasets, and secrets.
- Dependencies are listed.
- Setup commands work from a clean environment.
- Code is organised into understandable modules.
- Notebook outputs and temporary files are controlled.
- Licences for code and datasets are respected.
- Large model files are handled appropriately (for example, via a model hub or documented download step).

### Suggested structure

```text
project-name/
├── README.md
├── requirements.txt
├── .gitignore
├── configs/
├── data/
│   └── README.md
├── notebooks/
├── src/
│   ├── data/
│   ├── features/
│   ├── models/
│   └── evaluation/
├── tests/
├── artifacts/
│   └── README.md
└── reports/
```

Do not force every project into exactly this structure. Keep the repository simple enough that someone can understand it quickly.

## 5. README Structure

A professional README should answer these questions without requiring the reader to run the project.

Recommended sections:

```markdown
# Project Name

One-sentence project summary.

## Demo
Live link or demo video.

## Problem
What problem is being solved and for whom?

## Key Features
Important functionality.

## Architecture
System diagram and component descriptions.

## Dataset
Source, licence, size, target, and limitations.

## Approach
Preprocessing, baseline, model, and training setup.

## Results
Metrics, baseline comparison, and failure analysis.

## Installation
Environment and dependency setup.

## Usage
Training and inference commands.

## API
Endpoints and request/response examples, if applicable.

## Limitations
Known gaps and risks.

## Future Work
Realistic next improvements.

## Acknowledgements
Sources, pretrained models, and datasets.
```

Use screenshots, diagrams, and a short GIF only where they clarify the system.

## 6. Demo Video

A short demo should show the project working, not just slides describing it.

Suggested 2–4 minute sequence:
1. State the problem and intended user.
2. Show the application or command-line workflow.
3. Demonstrate one normal example.
4. Demonstrate one edge or failure case.
5. Explain the model/system architecture briefly.
6. Show key evaluation results.
7. State the main limitation and next improvement.

Before recording:
- Use representative sample data.
- Hide keys, tokens, private information, and personal data.
- Close unrelated tabs.
- Verify the deployed demo works.
- Ensure labels and results are readable.
- Keep narration concise and clear.

A demo video supports a project; it does not replace reproducible code and evaluation.

## 7. Resume Bullet Writing

A resume bullet should communicate action, technical contribution, and evidence.

Use the structure:

**Action verb + what you built + how you built it + verified result or scale.**

Weak:
- "Worked on a deep learning project using CNN."

Stronger template:
- "Built a [task] system using [architecture/framework], trained on [dataset/scale], and evaluated it with [metric], achieving [verified result]."

Another template:
- "Designed a reproducible [training/inference] pipeline with [tools], reducing [measured cost/time] by [verified amount]."

Rules:
- Never invent accuracy, speed, traffic, users, or impact.
- State the evaluation split and metric when the result may otherwise be misleading.
- Avoid listing every library in the bullet.
- Use one or two meaningful technical details.
- Keep the claim defensible in a technical interview.

## 8. Project Deep-Dive Interview

Prepare to answer these questions for every featured project:

### Problem and data
- Why did you choose this problem?
- Who benefits from the system?
- What does one training example represent?
- How were labels created?
- What data leakage risks did you check?
- What are dataset limitations or biases?

### Modelling
- Why this model instead of a simpler baseline?
- What loss and metric did you choose?
- How did you split the data?
- What did you tune?
- Which experiment failed and what did you learn?
- What is the largest source of error?

### Engineering
- How do you reproduce training?
- How are model artifacts versioned?
- How does inference work?
- What happens with invalid input?
- How would you monitor failures in production?
- What would happen if model latency doubled?

### Ownership and judgement
- Which part did you implement yourself?
- What would you redesign?
- What trade-off are you least satisfied with?
- What would you do with twice the data or half the compute?

## 9. Mock Project Deep-Dive Format

Practise a 10-minute explanation:

| Time | Content |
|---|---|
| 0–1 min | Problem, users, and success metric |
| 1–2 min | Dataset and data quality |
| 2–4 min | Architecture and modelling approach |
| 4–6 min | Experiments and evaluation |
| 6–7 min | Deployment or reproducibility |
| 7–8 min | Failure cases and limitations |
| 8–10 min | Trade-offs, improvements, and questions |

After the explanation, ask a peer to challenge:
- Metric selection.
- Data leakage.
- Baseline quality.
- Model choice.
- Production reliability.
- Claims on the resume.

## 10. Role-Wise Prioritisation

Do not prepare every role with equal depth if the target role is clear.

### ML Engineer
Prioritise:
- Python and data structures.
- ML fundamentals and evaluation.
- Feature pipelines and leakage prevention.
- Model training and inference.
- APIs, Docker, testing, and monitoring.
- Basic system design for ML workloads.

### Deep Learning / Computer Vision Engineer
Prioritise:
- Linear algebra and optimisation.
- Neural networks, CNNs, and Transformers.
- PyTorch training/debugging.
- Data augmentation and transfer learning.
- Metrics and failure analysis.
- Reproduction of papers or architectures.

### NLP / LLM Engineer
Prioritise:
- Tokenisation and embeddings.
- Attention and Transformer architecture.
- Fine-tuning, LoRA/QLoRA, and evaluation.
- Retrieval and vector search where relevant.
- Data quality, prompt/inference costs, and safety.
- Serving and monitoring.

### Software Development Engineer (SDE)
Prioritise:
- DSA and coding interviews.
- OOP, DBMS, OS, and Computer Networks.
- Backend/API engineering.
- Testing, Git, deployment, and system design.
- Projects that demonstrate end-to-end ownership.

Deep learning knowledge can differentiate an SDE profile, but it does not replace core software engineering preparation.

## 11. Portfolio Prioritisation Matrix

Score each project from 1 to 5 on:
- Problem relevance.
- Technical depth.
- Reproducibility.
- Evaluation quality.
- Engineering quality.
- Communication quality.

Use the scores to decide which projects deserve:
- A featured GitHub pin.
- A live demo.
- A detailed README.
- A resume bullet.
- A deep-dive interview story.

Do not rank projects only by model size or architecture complexity.

## 12. Final Portfolio Checklist

### Repository
- [ ] Clear name and description.
- [ ] Clean commits and project structure.
- [ ] No secrets or credentials.
- [ ] Dependencies and setup instructions.
- [ ] Data and model licences documented.
- [ ] Reproducible training/inference path.

### Technical evidence
- [ ] Baseline comparison.
- [ ] Correct train/validation/test methodology.
- [ ] Appropriate metrics.
- [ ] Error analysis and limitations.
- [ ] Architecture or workflow diagram.
- [ ] Saved artifact or working inference path.

### Presentation
- [ ] Clear README.
- [ ] Working demo or screenshots.
- [ ] Short demonstration video.
- [ ] Resume bullet based on verified results.
- [ ] Prepared 10-minute project explanation.
- [ ] Ready for technical follow-up questions.

## 13. Final 7-Day Action Plan

| Day | Action | Deliverable |
|---|---|---|
| 1 | Select 2–3 strongest projects | Portfolio shortlist |
| 2 | Clean one repository | Reproducible GitHub project |
| 3 | Rewrite README | Clear project documentation |
| 4 | Verify deployment and demo | Working demo |
| 5 | Record walkthrough | 2–4 minute video |
| 6 | Write resume bullets and update links | Final resume project section |
| 7 | Run mock deep-dive interview | Gap list and revised explanation |

Adjust the schedule to your placement timeline. The goal is to finish and verify deliverables, not simply tick off activities.

## 14. Quick Revision

- Portfolio quality beats repository count.
- Explain problem, data, baseline, method, evaluation, limitations.
- README should make the project understandable before running it.
- Demo video should show a real workflow and failure case.
- Resume metrics must be verified.
- Prepare model, data, and system-design questions.
- Prioritise by target role.
- Never claim work or results you cannot defend.

## 15. Final Checklist

- [ ] Choose the strongest projects.
- [ ] Clean and verify repositories.
- [ ] Remove secrets and document data/model licences.
- [ ] Write complete READMEs.
- [ ] Create architecture and results visuals.
- [ ] Record a concise working demo.
- [ ] Write evidence-based resume bullets.
- [ ] Practise a 10-minute project deep dive.
- [ ] Prioritise preparation for the target role.
- [ ] Add resources to this lecture later when selected.
