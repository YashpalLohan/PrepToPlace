# Days 45–47 — Managing State in Chatbots

## 1. Overview
A multi-turn chatbot connects the current message with relevant prior interaction. The model's context window is not automatically permanent memory. Applications typically store state and supply relevant history or use provider-supported state features.

Topics:
- Memory challenge.
- Multi-turn messages.
- Passing conversation history.
- Context-window budgeting.
- Summarisation and truncation.
- Persistence, privacy, and user controls.

## 2. Stateless Request vs Stateful Experience
A single model request processes supplied input. A multi-turn product creates continuity by managing:
- Conversation ID.
- Message history.
- User/session identity.
- Prompt/model configuration.
- Summary or relevant memories.
- Tool results and timestamps.

A product can feel stateful even when each model request is rebuilt from stored context.

## 3. Basic Conversation Format
A conversation is commonly represented as ordered role-labelled messages:

```json
[
  {"role": "user", "content": "Explain embeddings."},
  {"role": "assistant", "content": "An embedding is a dense vector..."},
  {"role": "user", "content": "Give a practical example."}
]
```

Role schemas vary by API. Preserve the provider's required structure and ordering.

## 4. Passing History
A simple pattern:
1. Receive the new user message.
2. Fetch authorised conversation history.
3. Select relevant turns.
4. Send instructions, selected history, and current input.
5. Store the new user and assistant messages.

Provider-neutral pseudocode:

```python
messages = [
    {"role": "system", "content": "You are a helpful tutor."},
    *conversation_history,
    {"role": "user", "content": current_message}
]
response = call_model(messages)
save_message(conversation_id, "user", current_message)
save_message(conversation_id, "assistant", response)
```

Use the exact current request format required by the selected API.

## 5. Why Memory Is Difficult
History grows and can exceed context capacity. Challenges:
- More tokens and cost.
- Irrelevant old messages.
- Important facts lost during truncation.
- Summaries omit caveats.
- Persistence expectations across sessions.
- Sensitive information retention.

The application must define what to store and what to send.

## 6. Types of Chatbot Memory
- **In-context history:** recent messages supplied to this request.
- **Conversation summary:** compact representation of earlier turns.
- **Explicit user memory:** selected stable facts/preferences.
- **Retrieval memory:** past events/documents retrieved by query.
- **External application state:** authoritative database values.

These are different mechanisms. Do not treat generated text as a substitute for authoritative state.

## 7. Sliding Window
A sliding window retains the most recent N messages or tokens.

Benefits: simple, bounded, recent context.

Limitations: older important facts disappear; arbitrary truncation may break message boundaries or remove needed details.

A stronger approach keeps trusted instructions, recent turns, a summary, and relevant retrieved facts.

## 8. Conversation Summarisation
A summary should preserve:
- User's current goal.
- Relevant constraints.
- Decisions already made.
- Important facts and sources.
- Pending actions.
- Unresolved questions.

Avoid inventing facts, turning uncertainty into certainty, losing dates/units/negations, or retaining unnecessary sensitive data. Keep structured state alongside the prose summary.

## 9. Structured State vs Free-Text Summary
| Structured state | Free-text summary |
|---|---|
| Fields such as status/date/ID | Natural-language description |
| Easy to validate and update | Flexible and compact |
| Good for authoritative facts | Good for conversational context |
| Requires a schema | Can be ambiguous |

Use a database for critical facts. Let the model interpret requests, but fetch and validate authoritative values in application logic.

## 10. Persistence Schema
```text
Conversation
- id
- user_id
- created_at
- updated_at
- summary

Message
- id
- conversation_id
- role
- content
- created_at
- token_count
- metadata
```

Possible additions: model/provider, prompt version, tool-call records, attachment IDs, status, and retention/deletion metadata.

Scope database access so users can access only their own conversations.

## 11. Context Budgeting
A request must fit instructions, history, retrieval, current input, tool outputs, and expected generated output.

\[
C\geq T_{instructions}+T_{history}+T_{retrieval}+T_{input}+T_{output}
\]

Exact counting and output reservation depend on the model/API. Reserve room for the answer and do not blindly send every previous message.

## 12. Tool Calls and Results
When tools are used:
- Store request/result records where needed for continuity.
- Validate arguments.
- Enforce user permissions outside the model.
- Treat tool output as data, not trusted instructions.
- Preserve provider-required message/tool-call structure.

Historical tool output does not grant new permissions.

## 13. Provider Conversation State
Some APIs offer conversation IDs or response-chaining features. They can reduce manual history construction, but understand:
- What is retained and for how long.
- Provider data controls.
- Whether your app still needs its own record.
- Deletion/export requirements.
- How state is scoped to a user.

Provider conversation state is not automatically equivalent to permanent user memory.

## 14. Privacy and User Controls
Define what is stored, why, who can access it, retention duration, and deletion/export behaviour. Avoid storing secrets or sensitive personal information in summaries without a clear, lawful, secure reason.

## 15. Common Mistakes
- Assuming the model remembers previous requests automatically.
- Sending full history forever.
- Truncating arbitrary message fragments.
- Treating summaries as authoritative records.
- Losing tool-call structure.
- Failing to isolate users' conversations.
- Storing sensitive content without retention rules.
- Assuming provider conversation IDs equal permanent memory.

## 16. Placement and Interview Questions
**Q1. What is conversation state?** Messages and relevant data used to maintain continuity.

**Q2. Does an API automatically remember earlier requests?** Not necessarily; pass history or use a supported state mechanism.

**Q3. What is a sliding window?** Retaining a recent bounded part of history.

**Q4. Why summarise history?** Preserve useful context while reducing token usage.

**Q5. Why structured state?** It stores validated authoritative fields more reliably than prose.

**Q6. How manage long conversations?** Budget context, keep recent turns, summarise, and retrieve relevant records.

**Q7. How protect multi-user history?** Enforce user-scoped access in backend reads/writes.

**Q8. Context vs persistent memory?** Context is supplied to the current request; persistent memory is stored and selectively retrieved across requests.

## 17. Practice
Design a study assistant that tracks current subject, goals, recent turns, exam date, and progress. Decide what belongs in conversation history, summary, structured database, and retrieval index.

Build a chat backend with conversation creation, message append/read, recent-turn selection, summary updates, per-user access, and deletion.

## 18. Quick Revision
- Stateful experience needs stored state.
- Context: information sent to current request.
- History: ordered messages.
- Summary: compressed conversational context.
- Structured state: authoritative fields.
- Retrieval memory: relevant stored records.
- Context budget: reserve for input and output.
- Privacy: access, retention, deletion.

## 19. Final Checklist
- [ ] Explain stateless calls vs multi-turn experiences.
- [ ] Store and retrieve history.
- [ ] Budget context.
- [ ] Compare sliding window and summaries.
- [ ] Distinguish context, memory, retrieval, and structured state.
- [ ] Preserve tool state safely.
- [ ] Enforce per-user access.
- [ ] Define retention/deletion.

## 20. Recommended Resources
- [MS GenAI Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [OpenAI API Quickstart](https://developers.openai.com/api/docs/quickstart)
- [OpenAI Conversation State](https://developers.openai.com/api/docs/guides/conversation-state)
- [OpenAI Prompting Guide](https://developers.openai.com/api/docs/guides/prompting)
