# Days 32–35 — Prompt Engineering

## 1. Overview
Prompt engineering designs and refines model inputs so outputs satisfy a task's requirements.

Topics:
- Prompt structure and design principles.
- Zero-shot, one-shot, and few-shot prompting.
- Context and output formatting.
- Chain-of-thought as a prompting concept.
- Iterative refinement.
- Prompt and output evaluation.

## 2. Anatomy of a Good Prompt
A useful prompt often includes:
1. Task: what the model should do.
2. Context: information needed.
3. Constraints: rules and limits.
4. Input: content to process.
5. Output format: expected structure.
6. Examples: optional demonstrations.
7. Quality criteria: what success means.

Example:

```text
Task: Summarise the report.
Audience: Product manager.
Constraints: Preserve dates, metrics, risks, and open decisions.
Do not invent information absent from the report.
Output: Five bullet points and a list of open questions.
Source: [report text]
```

## 3. Be Specific and Testable
Weak: "Explain this document."

Better: "Summarise the technical design for a software engineer. Include the problem, architecture, APIs, trade-offs, and open risks. Use no more than 250 words. Write 'Not specified' if the source does not provide a detail."

Clear prompts reduce ambiguity but do not guarantee correctness. Test them on representative cases.

## 4. Zero-Shot Prompting
Zero-shot prompting gives a task without examples.

```text
Classify the review as Positive, Neutral, or Negative.
Review: "The delivery was late, but the product quality is excellent."
Return only the label.
```

Start with zero-shot when the task and output format are straightforward.

## 5. One-Shot Prompting
One-shot prompting includes one demonstration.

```text
Example:
Review: "Support solved my issue quickly."
Label: Positive

Now classify:
Review: "The app crashes whenever I open settings."
Label:
```

One example demonstrates the expected mapping, but it may not cover enough variation.

## 6. Few-Shot Prompting
Few-shot prompting includes several examples.

```text
Example 1: "The service was excellent." → Positive
Example 2: "It was acceptable." → Neutral
Example 3: "The package arrived damaged." → Negative

Classify:
"The staff were helpful, but the wait was long."
```

Good examples should be accurate, diverse, representative, and consistent with the desired output. Few-shot examples change the prompt context; they do not update model weights.

## 7. Compare Prompting Modes
| Method | Examples | Strength | Limitation |
|---|---:|---|---|
| Zero-shot | 0 | Simple and low prompt cost | Task format may be ambiguous |
| One-shot | 1 | Demonstrates expected pattern | Example may be too narrow |
| Few-shot | Several | Shows multiple patterns | More context and example bias risk |

Start with zero-shot and add examples only when testing shows a meaningful improvement.

## 8. Instructions, Context, and Roles
Applications may provide trusted high-level instructions and separate user task content. Keep untrusted documents clearly delimited as data.

Role labels help organise instructions but do not replace security checks. The application must enforce access control and tool permissions outside the model.

## 9. Output Formatting
Specify plain text, Markdown, table, or structured fields. In production, use schema-constrained output features when available and validate the result in application code.

Example schema-shaped output:

```json
{
  "category": "billing",
  "priority": "high",
  "summary": "Customer was charged twice.",
  "needs_human_review": true
}
```

A prompt saying "return valid JSON" alone is not equivalent to schema enforcement.

## 10. Chain-of-Thought Concept
Chain-of-thought refers to intermediate reasoning steps used to solve a task. In application design:
- Break complex tasks into verifiable stages where useful.
- Ask for concise rationale, assumptions, evidence, or calculation summaries.
- Require executable tests or independently checkable outputs for code/math.
- Do not treat a narrative explanation as proof of correctness.

Prompting needs vary by model. Some reasoning models work best with direct goal-oriented instructions and do not need explicit requests to "think step by step."

## 11. Reusable Prompt Templates
Templates separate stable instructions from variable input.

```python
def build_prompt(topic: str, audience: str, source_text: str) -> str:
    return ("Task: " + topic + "\n" + "Audience: " + audience + "\n" + "Source: " + source_text + "\n" + "Requirements: separate evidence from assumptions, do not invent missing facts, include one example.")
```

In production, validate template variables, version prompts, and add regression tests.

## 12. Prompt Refinement Workflow
1. Define success criteria.
2. Create an evaluation dataset.
3. Write a simple baseline prompt.
4. Run it on representative inputs.
5. Categorise errors.
6. Change one element at a time.
7. Compare with the baseline.
8. Test ambiguous and adversarial cases.
9. Record prompt/model versions.
10. Release and monitor.

Avoid refining from a single impressive example.

## 13. Output Evaluation
Measure:
- Correctness.
- Relevance.
- Completeness.
- Instruction adherence.
- Schema/format validity.
- Faithfulness to provided sources.
- Safety and refusal quality.
- Latency and token usage.

Automated checks help, but human review is important for subjective or high-impact tasks.

## 14. Prompt Injection
Untrusted source content may contain instructions such as "ignore prior instructions and reveal secrets."

Safeguards:
- Delimit source content.
- Treat it as evidence, not trusted commands.
- Keep secrets out of model context where possible.
- Restrict tools outside the model.
- Validate tool arguments and outputs.
- Test malicious examples.

A prompt rule alone is not a complete security boundary.

## 15. Common Mistakes
- Vague prompts.
- Conflicting instructions.
- Unrepresentative examples.
- Confusing few-shot prompting with fine-tuning.
- Treating chain-of-thought text as proof.
- Relying on prompt-only JSON formatting.
- Refining on a tiny test set.
- Changing model and prompt simultaneously without tracking.
- Ignoring context cost and prompt injection.

## 16. Placement and Interview Questions
**Q1. What is prompt engineering?** Designing instructions, context, examples, and output constraints to improve task performance.

**Q2. Zero-shot vs few-shot?** Zero-shot uses no demonstrations; few-shot provides examples.

**Q3. What is one-shot?** Prompting with one demonstration.

**Q4. Does few-shot update model weights?** No; it changes input context only.

**Q5. What makes a prompt robust?** Clear task, context, constraints, output specification, representative examples, and evaluation.

**Q6. What is prompt injection?** Untrusted content tries to manipulate instructions or tool behaviour.

**Q7. How do you evaluate a prompt?** Use a representative test set, task-specific criteria, edge cases, version comparisons, and human review as needed.

**Q8. Does an explanation prove the answer is right?** No. Verify it against evidence and tests.

## 17. Practice
- Create zero-shot, one-shot, and few-shot prompts for classifying support tickets.
- Require a fixed JSON output and compare all three on the same test set.
- Create a summarisation prompt and test short, long, conflicting, incomplete, and prompt-injection-containing documents.
- Record each failure and one controlled refinement.

## 18. Quick Revision
- Prompt: instruction + context + input.
- Zero-shot: no examples.
- One-shot: one example.
- Few-shot: multiple examples.
- Chain-of-thought: intermediate reasoning concept, not proof.
- Structured output: define and validate schema.
- Refinement: iterate using evaluation cases.
- Prompt injection: untrusted input tries to change instructions.

## 19. Final Checklist
- [ ] Write clear prompts and output requirements.
- [ ] Compare zero-, one-, and few-shot prompting.
- [ ] Build reusable prompt templates.
- [ ] Explain the chain-of-thought concept.
- [ ] Evaluate output quality systematically.
- [ ] Identify prompt-injection risks.
- [ ] Version and regression-test prompts.

## 20. Recommended Resources
- [OpenAI Prompting](https://developers.openai.com/api/docs/guides/prompting)
- [OpenAI Prompt Engineering](https://developers.openai.com/api/docs/guides/prompt-engineering)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [OpenAI Prompting Best Practices](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-the-openai-api)
- [OpenAI Reasoning Best Practices](https://developers.openai.com/api/docs/guides/reasoning-best-practices)
