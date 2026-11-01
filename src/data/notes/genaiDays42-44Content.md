# Days 42–44 — Commercial APIs

## 1. Overview
Commercial model APIs provide hosted language, embedding, and multimodal capabilities without requiring you to operate the entire model infrastructure.

Topics:
- OpenAI API and Gemini API.
- Authentication and API keys.
- Request/response lifecycle.
- Billing and usage controls.
- Rate limits and retries.
- Embeddings and safe secret handling.

## 2. What Is a Model API?
An API exposes model functionality through a defined interface, commonly HTTPS. Requests include authentication, model identifier, input/messages, and optional parameters. Responses include generated content and often usage metadata.

## 3. Request Lifecycle
```text
Client → Your backend → Secret manager/environment
       → Provider API → Authentication/limits → Model
       → Provider response → Validation → Client
```

In production, provider credentials should normally remain on your backend, not in a browser or mobile bundle.

## 4. OpenAI API Concepts
Common concepts include API authentication, model selection, input/instructions, Responses API and SDK, tool calling, structured outputs, usage, and rate limits.

Use the current official quickstart and API reference for endpoint and model availability.

## 5. OpenAI Python Request Pattern
```python
from openai import OpenAI

client = OpenAI()  # Reads OPENAI_API_KEY from environment
response = client.responses.create(
    model="YOUR_SUPPORTED_MODEL",
    instructions="You are a concise technical tutor.",
    input="Explain embeddings in three bullet points."
)
print(response.output_text)
```
Replace the model placeholder with a model currently available to your project. Never hardcode the API key.

## 6. Gemini API Concepts
Gemini API provides hosted models through Google's SDK and REST interfaces. Concepts include AI Studio project/key, model selection, text and multimodal input, generation configuration, safety settings, embeddings, and usage/rate limits.

The SDK/API surface can evolve; follow the current quickstart.

## 7. Gemini Python Request Pattern
```python
from google import genai

client = genai.Client()  # Reads GEMINI_API_KEY or GOOGLE_API_KEY
response = client.models.generate_content(
    model="YOUR_SUPPORTED_GEMINI_MODEL",
    contents="Explain vector embeddings in three bullet points."
)
print(response.text)
```
Use a currently supported model ID. Keep credentials out of public code.

## 8. API Keys and Authentication
Good practices:
- Use separate development and production projects/keys where appropriate.
- Apply provider restrictions when available.
- Store keys in environment variables or a secret manager.
- Rotate keys and revoke suspected leaks.
- Use least privilege.
- Monitor usage and unusual traffic.

An API key is a secret credential, not a public identifier.

## 9. Keep Keys Out of Frontend Code
Unsafe:
- Hardcoding a key in browser JavaScript.
- Placing a secret in a client-exposed environment variable.
- Committing keys to GitHub.
- Sharing keys in notebooks/screenshots.

Safer architecture: client → your backend → provider API. The backend retrieves credentials from a secret manager or environment.

If exposed: revoke/rotate, inspect usage and billing, remove the secret from active code and repository history, and add secret scanning.

## 10. Billing and Cost
Cost can depend on input tokens, output tokens, model, modalities, cached input, batch processing, and embeddings.

Conceptually:

\[
Cost\approx InputTokens\times InputRate+OutputTokens\times OutputRate
\]

Use the provider's current pricing and billing page for actual values. Rates and model availability change.

Controls:
- Spend alerts/budgets.
- Output token limits.
- Appropriate model selection.
- Safe caching.
- Batch offline work when suitable.
- Usage monitoring by feature/project.
- Avoid retry loops that multiply requests.

## 11. Rate Limits
Limits can include requests per minute (RPM), tokens per minute (TPM), daily limits, and modality-specific quotas. Limits depend on provider, model, project, account tier, and endpoint.

Inspect error codes and response headers. A 429 may represent throttling or a quota issue; these require different responses.

## 12. Retry Strategy
For transient throttling/overload:
- Respect `Retry-After` when supplied.
- Use exponential backoff with jitter.
- Limit attempts and total elapsed time.
- Reduce concurrency or ramp traffic gradually.
- Do not retry permanent auth, invalid-request, or billing errors without fixing the cause.

Conceptual delay:

\[
delay_n=\min(delay_{max},baseDelay\cdot2^n)+jitter
\]

Provider-specific guidance takes precedence.

## 13. Embeddings
An embedding maps text to a dense vector:

\[
f(text)\rightarrow\mathbb{R}^{d}
\]

Use cases include semantic search, RAG, clustering, recommendations, similarity, and duplicate detection. Query and document vectors must be generated using compatible model spaces and task settings.

## 14. Similarity Search
Cosine similarity:

\[
cos(u,v)=\frac{u\cdot v}{\|u\|\|v\|}
\]

RAG workflow:
1. Chunk documents.
2. Embed chunks.
3. Store vectors with text and metadata.
4. Embed query.
5. Retrieve similar chunks.
6. Send evidence to a generation model.

Embeddings are representations, not generated answers.

## 15. OpenAI Embedding Pattern
```python
from openai import OpenAI

client = OpenAI()
result = client.embeddings.create(
    model="YOUR_SUPPORTED_EMBEDDING_MODEL",
    input=["Chunk about neural networks.", "Chunk about vector databases."]
)
vectors = [item.embedding for item in result.data]
print(len(vectors), len(vectors[0]))
```
Check model availability and input-token limits for the selected embedding model.

## 16. Gemini Embedding Pattern
```python
from google import genai

client = genai.Client()
result = client.models.embed_content(
    model="gemini-embedding-001",
    contents="Document text to embed"
)
vector = result.embeddings[0].values
print(len(vector))
```
Review current task-type, dimensionality, token-limit, and version guidance. Embedding spaces from incompatible models cannot simply be mixed; changing models may require re-embedding the index.

## 17. Provider-Agnostic Design
Hide provider-specific SDKs behind internal functions such as `generate_text`, `create_embedding`, and normalised error/usage handling. This makes provider changes and automated tests easier.

## 18. Common Mistakes
- Exposing API keys in frontend code.
- Committing secrets.
- Assuming pricing/rate limits are permanent.
- Retrying failures indefinitely.
- Ignoring token/output limits.
- Comparing incompatible embeddings.
- Sending sensitive data without checking terms.
- Coupling all application logic to one provider response schema.

## 19. Placement and Interview Questions
**Q1. What is an API key?** A secret credential used to authenticate/authorise requests.

**Q2. Why keep keys backend-only?** Client bundles can be inspected and keys stolen.

**Q3. What are RPM and TPM?** Requests per minute and tokens per minute.

**Q4. What is exponential backoff?** Increasing retry delay after successive transient failures.

**Q5. What is an embedding?** A dense vector representation for retrieval or similarity tasks.

**Q6. Why must embedding models be compatible?** Different models may produce unrelated vector spaces.

**Q7. How control API cost?** Monitor usage, select suitable models, limit output, cache safely, and set budget alerts.

**Q8. What should not be retried blindly?** Permanent auth, invalid-request, and billing/quota errors.

## 20. Practice
Build a backend endpoint that calls one provider with a server-side key, validated input, timeout, bounded retry, error handling, and usage logging without secrets. Then embed five document chunks and compare query similarity.

## 21. Quick Revision
- API: hosted model interface.
- API key: secret credential.
- Backend proxy: protects credentials.
- Cost: model, input/output tokens, modality, features.
- Rate limits: RPM/TPM and other quotas.
- Retry: Retry-After + backoff + jitter for transient failures.
- Embedding: dense vector.
- Similarity: cosine or chosen metric.
- Key hygiene: secure storage, rotation, revocation.

## 22. Final Checklist
- [ ] Make OpenAI and Gemini API requests.
- [ ] Explain API key security.
- [ ] Design backend-only provider calls.
- [ ] Explain billing and rate limits.
- [ ] Implement bounded transient retries.
- [ ] Generate and compare embeddings.
- [ ] Explain embedding compatibility and index migration.

## 23. Recommended Resources
- [OpenAI API Quickstart](https://developers.openai.com/api/docs/quickstart)
- [Gemini API Quickstart](https://ai.google.dev/gemini-api/docs/get-started)
- [OpenAI Rate Limits](https://developers.openai.com/api/docs/guides/rate-limits)
- [OpenAI Embeddings API](https://developers.openai.com/api/reference/resources/embeddings/methods/create)
- [Gemini Embeddings](https://ai.google.dev/gemini-api/docs/embeddings)
- [Gemini API Key Management](https://ai.google.dev/gemini-api/docs/api-key)
- [OpenAI API Overview](https://developers.openai.com/api/reference/overview)
