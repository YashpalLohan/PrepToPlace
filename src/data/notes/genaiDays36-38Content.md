# Days 36–38 — Fine-Tuning Concepts

## 1. Overview
Fine-tuning adapts a pretrained model using task- or domain-specific data.

Topics:
- Prompting vs fine-tuning.
- When fine-tuning is useful.
- Instruction tuning.
- Dataset quality.
- Choosing between model weights, retrieval, and external tools as knowledge sources.
- Evaluation, privacy, and deployment considerations.

## 2. Pretraining, Prompting, Fine-Tuning
**Pretraining:** model learns general patterns from a large corpus.

**Prompting:** instructions/examples are supplied at inference time; weights do not change.

**Fine-tuning:** additional training updates some or all model parameters.

| Approach | Changes weights? | Suitable for |
|---|---|---|
| Prompting | No | Instructions, format, simple behaviour changes |
| RAG | No required weight update | Current/private/traceable knowledge |
| Fine-tuning | Yes | Stable task patterns or behaviour |
| Tools/API | No training required | Live data, calculations, external actions |

Approaches can be combined.

## 3. Fine-Tuning vs Prompting
Prompting is usually the first baseline: fast to test and requires no labelled training dataset.

Fine-tuning may help when:
- Task patterns are stable and repeated.
- Output style/format must be consistent.
- Prompt instructions are becoming cumbersome.
- High-quality examples exist.
- Evaluation shows a repeatable gap that fine-tuning could address.

Fine-tuning is usually not best for live prices, current internal facts, private files, or calculations that should come from authoritative tools.

## 4. What Fine-Tuning Does Not Guarantee
Fine-tuning does not automatically guarantee factual correctness, up-to-date knowledge, citations, permission-aware access, better reasoning, lower inference cost, or removal of bias.

Results depend on the data, objective, model, and evaluation.

## 5. Instruction Tuning
Instruction tuning is supervised fine-tuning on examples that pair instructions with desired responses.

Example:

```json
{
  "instruction": "Explain recursion simply.",
  "input": "Use factorial as an example.",
  "output": "Recursion is when a function calls itself..."
}
```

Training examples may contain an instruction, optional context, desired response, and metadata.

Instruction tuning teaches a model response patterns and instruction-following behaviour.

## 6. Instruction Data Quality
Check:
- Correctness and consistency.
- Coverage of common and edge cases.
- Duplicates and near-duplicates.
- Sensitive information.
- Formatting.
- Data rights and licences.
- Train/validation/test separation.
- Whether the examples reflect real deployment requests.

Poor examples can teach unwanted behaviour.

## 7. Conversation-Style Training Data
A conversation sample may use role-labelled messages:

```json
{
  "messages": [
    {"role": "user", "content": "Summarise this paragraph."},
    {"role": "assistant", "content": "The paragraph explains..."}
  ]
}
```

The chat template is model-specific. Use the tokenizer/model documentation rather than inventing special tokens.

## 8. Fine-Tuning Workflow
1. Define task and success criteria.
2. Select a pretrained model.
3. Build a high-quality dataset.
4. Split data without leakage.
5. Establish a prompting baseline.
6. Select full fine-tuning or PEFT.
7. Configure training and evaluation.
8. Track loss and metrics.
9. Test held-out and adversarial cases.
10. Compare with prompt and RAG baselines.
11. Package model, tokenizer, and config.
12. Monitor after deployment.

## 9. When to Use RAG Instead
RAG is usually preferable when facts are frequently updated, private, or require source citations. It can update knowledge by re-indexing documents without retraining model weights.

Fine-tuning is useful for stable behaviours, style, repeated task patterns, and response conventions.

Example: use RAG to answer from the latest university handbook; use instruction tuning to teach a consistent explanation style.

## 10. Knowledge Source Selection
| Knowledge type | Suitable approach |
|---|---|
| General language/task patterns | Pretrained model + prompting |
| Current internal facts | Retrieval from controlled source |
| Live account status | Authenticated API/database |
| Mathematical calculation | Deterministic code |
| Required output format | Prompt/schema/fine-tuning |
| Repeated specialised behaviour | Evaluate fine-tuning |

Do not use model weights as the source of truth for live external state.

## 11. Overfitting and Catastrophic Forgetting
**Overfitting:** model fits training examples but fails to generalise.

**Catastrophic forgetting:** fine-tuning degrades previously learned capabilities.

Mitigation:
- Representative training data.
- Conservative learning rates.
- Validation monitoring.
- Capability tests before/after.
- PEFT where suitable.
- Rollback to base model.

## 12. Privacy and Data Rights
Before fine-tuning:
- Confirm rights and permission to use the data.
- Minimise or remove unnecessary personal information.
- Restrict dataset/checkpoint access.
- Define retention and deletion controls.
- Review provider data terms.
- Secure logs and repositories.

Weights may memorise training examples; deleting the original dataset does not guarantee the learned information has been removed.

## 13. Evaluation
Compare tuned model against prompt-only, RAG, and smaller-model baselines. Measure task success, instruction adherence, factuality, format validity, robustness, safety, latency, and serving cost.

Keep the test set untouched during training and checkpoint selection.

## 14. Common Mistakes
- Fine-tuning before testing a prompt baseline.
- Encoding changing facts in model weights.
- Using noisy instruction examples.
- Evaluating on training data.
- Ignoring model-specific chat templates.
- Assuming fine-tuning eliminates hallucinations.
- Ignoring capability regression.
- Ignoring privacy and data rights.

## 15. Placement and Interview Questions
**Q1. Prompting vs fine-tuning?** Prompting changes input context; fine-tuning updates model parameters.

**Q2. What is instruction tuning?** Supervised training on instruction/response examples.

**Q3. When use RAG?** For current, private, traceable, frequently changing knowledge.

**Q4. What matters in a fine-tuning dataset?** Correctness, consistency, diversity, duplication control, privacy, licence, and split quality.

**Q5. What is catastrophic forgetting?** Previously learned behaviour degrades during adaptation.

**Q6. Does fine-tuning eliminate hallucination?** No.

**Q7. Why keep a prompt baseline?** To measure whether fine-tuning adds real benefit.

**Q8. How select knowledge source?** Consider freshness, authority, permissions, traceability, and whether the information is static or live.

## 16. Practice
Design an assistant that must answer from the current handbook, use a consistent formal tone, retrieve live fee status, and calculate a balance. Assign prompting, RAG, API tools, deterministic calculation, or fine-tuning to each subtask and explain why.

Create 20 instruction/response samples. Define a quality rubric, data split, baseline, privacy checks, and evaluation set.

## 17. Quick Revision
- Prompting: instructions in context.
- Fine-tuning: extra training updates weights.
- Instruction tuning: instruction/response examples.
- RAG: current external knowledge.
- Tools: live data and actions.
- Overfitting: training-specific behaviour.
- Catastrophic forgetting: loss of old capabilities.
- Evaluation: quality + safety + cost + robustness.

## 18. Final Checklist
- [ ] Compare prompting, RAG, tools, and fine-tuning.
- [ ] Explain instruction tuning.
- [ ] Design a clean dataset.
- [ ] Select the right knowledge source.
- [ ] Build a baseline.
- [ ] Explain forgetting and overfitting.
- [ ] Evaluate capability regression and privacy.

## 19. Recommended Resources
- [MS GenAI Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [HF LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- [HF LLM Course — Fine-Tuning](https://huggingface.co/learn/llm-course/chapter3/1)
- [Hugging Face PEFT](https://huggingface.co/docs/peft/index)
