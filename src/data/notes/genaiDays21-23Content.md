# Days 21–23 — Generative AI Overview

## 1. Overview

Generative AI models learn patterns from data and produce new outputs based on prompts, context, and learned parameters.

This block introduces:
- Text generation.
- Summarisation.
- Code generation.
- Image generation.
- Audio generation.
- Common business use cases.
- Basic components and limitations of a GenAI application.

## 2. What Makes AI Generative?

A traditional classifier may answer: "Which category does this input belong to?"

A generative model may answer: "Create a new output that fits this instruction and context."

Examples:
- Generate a product description.
- Summarise a long report.
- Draft code from a specification.
- Create an image from a prompt.
- Transcribe or generate audio.

Generation is probabilistic in many systems. The same prompt may produce different valid outputs depending on sampling settings and model behaviour.

## 3. Text Generation

An autoregressive language model generates text as a sequence of tokens.

At each step, it estimates a distribution over the next token:

\[
P(x_t\mid x_1,\ldots,x_{t-1})
\]

The model selects or samples a next token, appends it to the context, and repeats.

```text
Prompt tokens
     |
Language model
     |
Next-token probabilities
     |
Token selection
     |
Append token to context
     |
Repeat until stopping condition
```

The model does not generally produce an entire answer in one indivisible operation; generation proceeds token by token.

## 4. Tokens and Context Window

A token can be a word, part of a word, punctuation, or another subword unit depending on the tokenizer.

The **context window** is the amount of tokenised input/output context the model can process in a request.

Implications:
- Long prompts consume context capacity.
- Retrieved documents need selection and chunking.
- Conversation history may need summarisation or truncation.
- Input and generated output both contribute to context constraints in many systems.

Token counts are not identical to word counts.

## 5. Summarisation

Summarisation produces a shorter representation of source material.

Types:
- Extractive: selects important existing sentences or spans.
- Abstractive: generates a new concise description.

Typical workflow:
1. Provide source text.
2. Specify audience and desired length.
3. Specify what must be preserved.
4. Generate a summary.
5. Check factual consistency against the source.

Risk: the model may omit a critical caveat, merge facts incorrectly, or introduce unsupported information.

## 6. Code Generation

A coding assistant can generate:
- Functions and classes.
- Tests.
- SQL queries.
- API integrations.
- Documentation.
- Refactoring suggestions.

Best practices:
- Provide language, framework, and version.
- Give function signatures and constraints.
- Include expected inputs and outputs.
- Ask for tests and edge cases.
- Run the code in a controlled environment.
- Review security, performance, and correctness.

Generated code is a proposal, not verified software.

## 7. Image Generation

Text-to-image models create images conditioned on text prompts.

A prompt commonly specifies:
- Subject.
- Environment.
- Composition.
- Style.
- Lighting.
- Camera or rendering characteristics.
- Aspect ratio and constraints.

Many current systems use diffusion-based methods:
1. Start from noise in pixel or latent space.
2. Use a text-conditioned denoising model.
3. Iteratively reduce noise according to a schedule.
4. Decode a latent representation if required.
5. Produce an image.

Image-generation systems differ in architecture and training; not every image model follows an identical pipeline.

## 8. Audio Generation and Processing

Audio-related generative AI tasks include:
- Speech-to-text transcription.
- Text-to-speech.
- Speech translation.
- Audio generation.
- Voice conversion.
- Audio summarisation or understanding.

Common pipeline:

```text
Audio input
    |
Preprocessing / representation
    |
Speech or audio model
    |
Transcription / audio output / labels
    |
Post-processing and validation
```

Consider speaker consent, privacy, copyright, and disclosure when working with voice or generated audio.

## 9. Common Business Use Cases

| Business area | GenAI use case | Human/technical safeguard |
|---|---|---|
| Customer support | Draft replies and summarise tickets | Retrieval grounding and agent approval |
| Software engineering | Generate tests and code suggestions | Run tests, review security, code review |
| Marketing | Draft descriptions and campaign variations | Brand/legal review |
| Education | Explain concepts and create practice questions | Check factual accuracy and learning quality |
| Operations | Extract fields from documents | Schema validation and exception review |
| Analytics | Generate narrative summaries of charts | Verify calculations against source data |
| Knowledge management | Ask questions over internal documents | Access control and citations to sources |

Use GenAI where flexible language generation adds value. Do not use it as a replacement for deterministic calculations or permissions checks.

## 10. Components of a GenAI Application

A practical application may contain:

1. User interface.
2. Prompt template and instructions.
3. Model/API client.
4. Context retrieval (optional).
5. Tool integrations (optional).
6. Conversation state (optional).
7. Output parser and validation.
8. Safety/policy checks.
9. Logging and evaluation.

```text
User request
    |
Input validation
    |
Prompt + context construction
    |
LLM / multimodal model
    |
Output validation and safety checks
    |
Application logic
    |
User response
```

## 11. Prompting at a Basic Level

A useful prompt specifies:
- Role or task.
- Context.
- Instructions.
- Constraints.
- Expected output format.
- Examples when useful.

Weak prompt: "Summarise this."

More specific prompt: "Summarise the provided report for a project manager in five bullet points. Preserve dates, numeric values, risks, and unresolved decisions. Do not add information not present in the report."

A structured prompt improves clarity but does not guarantee correctness.

## 12. Hallucinations and Reliability

A hallucination is generated content that is unsupported or false but may sound plausible.

Common causes include:
- Missing information.
- Ambiguous instructions.
- Weak or conflicting context.
- Overconfident generation.
- Distribution mismatch.

Ways to reduce risk:
- Ground answers in trusted sources.
- Require citations or source references where appropriate.
- Use structured output schemas.
- Validate calculations and facts externally.
- Allow the model to say it does not know.
- Route high-impact decisions to human review.

Grounding reduces some errors but does not guarantee correctness.

## 13. Evaluation of Generative AI Outputs

Traditional ML metrics are not always sufficient for open-ended generation.

Evaluate:
- Factuality and faithfulness to source.
- Relevance to user request.
- Completeness.
- Safety and policy compliance.
- Format/schema validity.
- Latency and cost.
- Human preference or expert review.
- Task-specific success rate.

Create a representative evaluation dataset with normal, edge, ambiguous, and adversarial cases.

## 14. Risks and Responsible Use

Consider:
- Privacy and sensitive data.
- Intellectual property and licensing.
- Bias and harmful outputs.
- Prompt injection.
- Insecure tool execution.
- Unauthorised access.
- Misleading or fabricated content.
- Human over-reliance.

Protect secrets, restrict tool permissions, validate outputs, and disclose relevant limitations to users.

## 15. Choosing a Model or Approach

Before selecting a model, define:
- Required modality (text, image, audio, etc.).
- Quality target.
- Latency.
- Context length.
- Cost.
- Privacy and data residency.
- Tool/function support.
- Deployment and offline requirements.
- Evaluation criteria.

A hosted API may be appropriate for fast prototyping. A local/open model may be preferred for control, privacy, or cost at scale. The best choice depends on measured requirements.

## 16. Common Mistakes

- Assuming every GenAI model is an LLM.
- Confusing token count with word count.
- Trusting generated code without execution and review.
- Treating a summary as guaranteed faithful.
- Sending sensitive data without checking policy and access.
- Assuming retrieval or citations eliminate hallucinations.
- Evaluating only with subjective impressions.
- Choosing a model before defining requirements.
- Ignoring inference latency and token costs.

## 17. Placement and Interview Questions

**Q1. What is Generative AI?**  
AI that learns patterns in data and generates new content such as text, images, audio, or structured outputs.

**Q2. How does autoregressive text generation work?**  
The model predicts a distribution for the next token based on previous tokens and repeats the process.

**Q3. What is a token?**  
A unit used by a model's tokenizer; it may represent a word, subword, punctuation, or other text fragment.

**Q4. What is a context window?**  
The maximum token context a model can process for a request, subject to model-specific limits.

**Q5. Extractive vs abstractive summarisation?**  
Extractive selects source spans; abstractive generates a new summary.

**Q6. What is a hallucination?**  
A plausible-sounding output that is unsupported or false.

**Q7. Why is generated code not automatically trustworthy?**  
It may contain logic errors, security issues, incompatible APIs, or unhandled edge cases.

**Q8. What safeguards would you place in a business GenAI application?**  
Input/output validation, access controls, grounded context, restricted tools, monitoring, and human review for high-impact outputs.

## 18. Practice

### Concept exercises
1. Map each use case to text, image, or audio generation.
2. Explain how an LLM generates one sentence token by token.
3. Give a strong prompt for summarising a technical report.
4. Identify three ways a customer-support assistant could hallucinate.
5. Design validation steps for an AI code generator.

### Mini project
Build a small text summarisation or document-question-answering prototype:
- Define user and task.
- Select a model/API.
- Create prompt instructions.
- Add output validation.
- Test normal, ambiguous, and adversarial inputs.
- Record factuality, latency, and cost observations.

## 19. Quick Revision

- GenAI: generates new content.
- LLM: language model operating over tokens.
- Autoregressive: predicts next token from previous context.
- Context window: token capacity.
- Summarisation: extractive or abstractive.
- Code generation: code suggestion requiring tests/review.
- Image generation: often diffusion-based.
- Audio: transcription, TTS, generation, understanding.
- Hallucination: plausible but unsupported output.
- Reliability: grounding + validation + evaluation + human oversight.

## 20. Final Checklist

- [ ] Explain text generation at token level.
- [ ] Explain tokens and context windows.
- [ ] Compare extractive and abstractive summarisation.
- [ ] Describe code-generation safeguards.
- [ ] Explain text-to-image diffusion at a high level.
- [ ] Identify audio AI tasks.
- [ ] Map GenAI to business use cases.
- [ ] Design a basic GenAI application pipeline.
- [ ] Explain hallucination and reliability safeguards.

## 21. Recommended Resources

- [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Google AI for Developers — Gemini API](https://ai.google.dev/gemini-api/docs)
- [Google AI for Developers — Prompting Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)
- [Google AI Studio](https://aistudio.google.com/)
- [OpenAI API — Introduction](https://platform.openai.com/docs/introduction)
