# Days 29–31 — Responsible AI

## 1. Overview
Responsible AI covers the ethical, safety, privacy, fairness, and accountability requirements for systems across their lifecycle. It is not just a final content filter.

Topics:
- Ethical considerations.
- Bias sources and mitigation.
- Fairness principles.
- Misinformation and hallucination risk.
- Privacy, security, transparency, and human oversight.
- Evaluation and monitoring.

## 2. Responsible AI Principles
Common principles include:
- **Fairness:** avoid unjustified disparities across people or groups.
- **Reliability and safety:** perform as intended and fail safely.
- **Privacy and security:** protect personal information and system access.
- **Inclusiveness:** work for people across different abilities and contexts.
- **Transparency:** communicate capabilities and limitations.
- **Accountability:** assign responsibility and oversight.

Frameworks use different terminology, but these themes recur across responsible-AI guidance.

## 3. Ethics Across the Lifecycle
| Stage | Questions |
|---|---|
| Problem definition | Is AI appropriate? Who may benefit or be harmed? |
| Data collection | Was data obtained lawfully and fairly? |
| Data preparation | Are groups underrepresented or labels biased? |
| Model selection | Does the model fit the risk and task? |
| Evaluation | Are errors measured across groups and edge cases? |
| Deployment | Are users informed? Is human review available? |
| Monitoring | Are harm, drift, and abuse detected? |
| Retirement | Can the system be withdrawn safely? |

## 4. Sources of Bias
Bias can enter through:
- Historical data reflecting unequal treatment.
- Underrepresented populations.
- Measurement error.
- Proxy variables correlated with sensitive attributes.
- Labelling practices and annotator assumptions.
- Product design and deployment context.
- Feedback loops that reinforce previous model decisions.

Example: a speech system may perform worse for some accents if the training and evaluation data do not represent those speakers adequately.

## 5. Bias Mitigation Workflow
1. Identify affected stakeholders and potential harms.
2. Inspect data coverage and label quality.
3. Define meaningful groups for evaluation.
4. Measure group-wise error patterns.
5. Investigate features, labels, and proxies.
6. Consider data, model, or decision-policy changes.
7. Re-evaluate across groups and edge cases.
8. Document limitations and remaining risks.
9. Monitor after deployment.

No single fairness metric solves every problem. Fairness definitions can conflict; the appropriate choice depends on context, applicable law, and stakeholder impact.

## 6. Fairness Metrics
Possible classification measures include:
- Demographic parity / selection-rate differences.
- Equal opportunity / true-positive-rate differences.
- Equalised odds / true-positive and false-positive-rate differences.
- Predictive parity / precision differences.

Each measures a different property. A system can satisfy one fairness definition and fail another. Reports should state the groups, labels, thresholds, data scope, and limitations used.

## 7. Privacy and Data Protection
GenAI apps can process personal identifiers, conversations, documents, credentials, and business information.

Safeguards:
- Minimise data collection.
- Avoid sending unnecessary sensitive data to providers.
- Enforce access controls.
- Define retention and deletion rules.
- Redact or pseudonymise where appropriate.
- Review provider data-use and retention terms.
- Secure logs, embeddings, vector stores, and backups.
- Prevent one user's retrieved content from being exposed to another.

Embeddings are derived from source content and should not automatically be treated as anonymous.

## 8. GenAI Security Risks
**Prompt injection:** untrusted text tries to override application instructions or manipulate tool use.

**Data exfiltration:** protected information is revealed to an unauthorised party.

**Insecure tool execution:** model-generated code/commands execute with excessive privileges.

**Model abuse:** users attempt to bypass safeguards.

**Supply-chain risk:** untrusted model weights, datasets, or dependencies introduce malicious or vulnerable components.

Use least-privilege tools, external permission checks, input/output validation, isolation, secret management, monitoring, and security tests.

## 9. Hallucination Risk
A hallucination is plausible-sounding but false or unsupported output.

Examples:
- Invented citations or legal cases.
- Incorrect dates or numerical claims.
- Unsupported claims about an uploaded document.
- Fabricated API parameters.

Risk increases when context is incomplete, instructions are ambiguous, sources conflict, or the model lacks domain/current information.

## 10. Misinformation Prevention
- Ground answers in trusted sources.
- Require source references where available.
- Validate citations and quoted text.
- Use structured output for extraction.
- Separate source facts from model-generated interpretation.
- Use deterministic tools for calculations.
- Allow abstention when evidence is insufficient.
- Require human review for high-impact decisions.
- Provide a correction/reporting path.

Retrieval and citations reduce some risks but do not guarantee truth; the model can misread the evidence.

## 11. Human Oversight
High-impact domains such as employment, education, healthcare, legal rights, credit, and public services need meaningful human oversight.

A reviewer needs:
- Sufficient information to evaluate the output.
- Authority to reject or override it.
- Time and training.
- Clear accountability.
- An escalation path.

A checkbox approval without understanding evidence is not meaningful oversight.

## 12. Transparency
Users should understand:
- When AI is involved.
- What data the application uses.
- What the model can and cannot do.
- That outputs may be inaccurate.
- When human review occurs.
- How to report or correct a problem.

Avoid claiming that a system is unbiased or always accurate.

## 13. Safety and Fairness Evaluation
Include typical, ambiguous, sensitive, edge, and adversarial inputs. Measure:
- Harmful-output rate.
- Factuality and citation correctness.
- Privacy leakage.
- Group-wise error patterns.
- Refusal quality and over-refusal.
- Robustness to paraphrases and distribution shifts.

Repeat tests after changing model, prompt, retrieval, or tools.

## 14. Example: Responsible Support Assistant
- Retrieve only documents the current user may access.
- Treat retrieved text as evidence, not instructions.
- Require source IDs for policy claims.
- Validate outputs.
- Enforce account permissions in application code.
- Escalate uncertain/high-impact cases.
- Log model version and request IDs without unnecessary sensitive content.

The model must not be the security boundary.

## 15. Common Mistakes
- Treating fairness as one universal score.
- Checking bias only after deployment.
- Assuming removal of names fully anonymises data.
- Treating embeddings as automatically privacy-safe.
- Trusting generated citations without validation.
- Assuming RAG eliminates hallucinations.
- Giving an LLM unrestricted tools or secrets.
- Treating human review as meaningful without authority and context.

## 16. Placement and Interview Questions
**Q1. What is Responsible AI?** Lifecycle-wide design and operation that considers fairness, safety, privacy, transparency, inclusion, and accountability.

**Q2. Common bias sources?** Sampling, historical data, measurement, labels, proxy variables, design, and feedback loops.

**Q3. What is hallucination?** Plausible-sounding but false or unsupported generated information.

**Q4. Does RAG eliminate hallucination?** No. Retrieval and interpretation can still fail.

**Q5. What is prompt injection?** Untrusted content attempts to manipulate instructions or tool use.

**Q6. Why enforce permissions outside the model?** Model output is probabilistic and is not a reliable security boundary.

**Q7. What is meaningful human oversight?** A competent reviewer has context, authority, and time to challenge or override the system.

**Q8. Why can fairness metrics conflict?** They encode different definitions and may not all be simultaneously achievable in a given data setting.

## 17. Practice
Design an AI applicant-ranking system. Identify stakeholders, training-data bias, possible proxies, group-wise evaluation, transparency, appeal process, monitoring, and rollback triggers.

Design a document assistant. Test prompt injection, validate citations, restrict access, define abstention behaviour, and document retention.

## 18. Quick Revision
- Responsible AI: lifecycle discipline.
- Fairness: measure unjustified disparities.
- Privacy: minimise and protect data.
- Safety: prevent and mitigate harm.
- Transparency: communicate limitations.
- Accountability: human responsibility.
- Hallucination: unsupported content.
- Prompt injection: malicious untrusted content.
- RAG helps grounding but cannot guarantee truth.
- Permissions belong in application logic.

## 19. Final Checklist
- [ ] Explain key Responsible AI principles.
- [ ] Identify bias sources and mitigation workflow.
- [ ] Compare fairness metrics and limits.
- [ ] Describe privacy and security controls.
- [ ] Explain prompt injection and hallucination risk.
- [ ] Design source-grounding and human-review safeguards.
- [ ] Evaluate safety, factuality, and group-wise outcomes.

## 20. Recommended Resources
- [Google GenAI Responsible AI Toolkit](https://ai.google.dev/responsible)
- [Google Safety and Factuality Guidance](https://ai.google.dev/gemini-api/docs/safety-guidance)
- [MS GenAI Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Microsoft Responsible AI Principles](https://www.microsoft.com/en-in/ai/principles-and-approach)
- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)
