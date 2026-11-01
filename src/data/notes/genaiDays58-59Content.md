# Days 58–59 — Agentic AI

## 1. Learning Objectives
Explain what makes an AI system agentic, design a bounded tool-using loop, distinguish memory from context, understand planning and ReAct, and evaluate an agent for correctness, safety, latency, and cost.

Topics:
- Agentic AI definition and architecture.
- LLM as controller/decision-maker.
- Tools and function calling.
- Memory and state.
- Planning, execution, and observation.
- ReAct: Reason + Act.
- Guardrails, human approval, and evaluation.

## 2. What Is Agentic AI?
Agentic AI describes systems that use a model to decide and coordinate multiple steps toward a goal, often by selecting tools, observing their outputs, updating state, and deciding what to do next.

A useful agent usually has:
- **Goal/instructions:** what it should achieve and constraints it must follow.
- **Model:** interprets context and selects the next step.
- **Tools:** controlled functions or services that provide information or perform actions.
- **State/memory:** information needed across steps.
- **Control loop:** decides whether to continue, ask for input, or finish.
- **Runtime/guardrails:** enforces limits, permissions, and observability.

Not every multi-step LLM workflow needs an agent. If the path is predictable, a deterministic workflow is often simpler and more reliable.

## 3. LLM as the Brain — With Limits
The LLM can interpret the request, choose a tool, formulate arguments, and decide how to use the result. It does not automatically gain access to the internet, database, filesystem, or external services. Those capabilities must be explicitly provided by tools and enforced by the application.

The LLM is not an operating-system-level authority. The surrounding runtime controls which tools exist, validates arguments, handles permissions, executes operations, and returns observations.

Design principle: let the model propose an action; let trusted application code validate and execute it.

## 4. Agent Architecture and Control Loop

```text
User goal
   ↓
Read instructions + current state
   ↓
LLM chooses: answer / tool / ask user
   ↓
Validate tool call and permissions
   ↓
Execute tool → observe result
   ↓
Update state and continue
   ↓
Final answer / human approval / stop
```

The loop requires explicit stop conditions. Set a maximum number of steps, timeout, token/cost budget, and permitted tool list. A loop that has no useful stopping rule can waste resources or repeatedly perform actions.

## 5. Tools and Function Calling
A tool is a function with a defined contract. The model receives the tool's name, description, and input schema; it can request the function when appropriate. The application executes it and returns the result to the model.

A good tool contract includes:
- A clear, action-oriented name.
- A description of when it should be used.
- Typed and validated arguments.
- A predictable return structure.
- Explicit permission and side-effect expectations.
- Errors that can be handled safely.

Keep tools narrow. `get_order_status(order_id)` is easier to validate than a generic `run_any_sql(query)` or `execute_shell(command)` tool.

## 6. A Minimal Tool-Using Agent with OpenAI Agents SDK
Install the Python SDK and set the API key in a server-side environment variable:

```bash
pip install openai-agents
export OPENAI_API_KEY="your-key"
```

Example using a harmless read-only function tool:

```python
import asyncio
from agents import Agent, Runner, function_tool

@function_tool
def lookup_course_topic(topic: str) -> str:
    """Return a short local course-note lookup result."""
    allowed = {"vectors", "rag", "agents"}
    key = topic.strip().lower()
    if key not in allowed:
        return "Topic not found in the demo index."
    return f"Found notes for: {key}"

agent = Agent(
    name="Study assistant",
    instructions=(
        "Help with course topics. Use lookup_course_topic when a note lookup is needed. "
        "Do not claim a lookup succeeded unless the tool returns a result."
    ),
    tools=[lookup_course_topic],
)

async def main():
    result = await Runner.run(agent, "Find my notes about RAG.")
    print(result.final_output)

if __name__ == "__main__":
    asyncio.run(main())
```

This is a teaching example. A real lookup should query a controlled data source, validate user access, and return source identifiers so the answer can be checked.

## 7. ReAct: Reason + Act
ReAct is a pattern that interleaves model reasoning with actions and observations. Conceptually:

1. **Reason:** determine what information or action is needed.
2. **Act:** select and call an available tool.
3. **Observe:** inspect the tool result.
4. **Reason again:** decide whether another step is required.
5. **Finish:** provide a result or ask for clarification.

```text
Question
  ↓
Reason → Action(tool call) → Observation
  ↑                          ↓
  └──── Continue if needed ──┘
             ↓
          Final answer
```

For implementation, use framework-supported structured tool calls rather than parsing arbitrary free-form strings. The conceptual reasoning trace is not a guarantee that the model's explanation is faithful to its internal computation.

## 8. Planning and Task Decomposition
Planning breaks a broad goal into smaller tasks with dependencies. For example, "prepare a report from this dataset" may require: inspect file → validate schema → compute metrics → create charts → draft report → review output.

Planning strategies:
- **Fixed plan:** application defines the sequence.
- **Model-generated plan:** model proposes steps, runtime validates them.
- **Replanning:** model revises the next steps after observing results.
- **Hierarchical delegation:** a coordinator assigns bounded subtasks to specialist agents.

Plans should be observable and revisable. Do not let a model silently expand the task scope or create irreversible actions without approval.

## 9. Memory vs Context vs State
These terms are related but not identical:
- **Context:** information currently included in a model call.
- **State:** structured data carried between workflow steps or runs.
- **Short-term conversational memory:** relevant details from the current session or thread.
- **Long-term memory:** selected information stored across sessions, usually with explicit retention and deletion policies.

A system may retrieve memory and add selected facts to context. It should not automatically store every message forever. Define what is stored, why, for how long, who can access it, and how users can delete or correct it.

## 10. Designing Useful Memory
Good memory is:
- Relevant to a future task.
- Small enough to retrieve and reason over.
- Structured with provenance and timestamps where useful.
- Updated when facts change.
- Scoped to the correct user, tenant, and permission boundary.
- Deletable under the product's retention policy.

Do not store secrets, credentials, or unnecessary sensitive information as agent memory. Retrieval must enforce access controls just like any other database query.

## 11. Tool Permissions and Side Effects
Classify tools by risk:
- **Read-only:** retrieve weather, search a private knowledge base, or inspect status.
- **Reversible write:** create a draft or add a provisional record.
- **External side effect:** send a message, create a ticket, or modify a customer record.
- **High-impact/irreversible:** transfer funds, delete important data, or change access.

Use least privilege, argument validation, allowlists, idempotency keys, audit logs, and explicit approval for consequential actions. A prompt instruction alone is not an authorization system.

## 12. Tool Errors, Retries, and Idempotency
A robust agent must handle:
- Invalid arguments and schema mismatch.
- Authentication and permission failures.
- Rate limits and transient network errors.
- Tool timeouts and partial results.
- Duplicate actions after retries.

Retry only errors that are plausibly transient. Use bounded exponential backoff with jitter where appropriate. For write operations, design idempotency so retrying the same request does not create duplicate side effects. Return concise, structured errors to the model and preserve diagnostic details in secure logs.

## 13. Agent vs Workflow vs Chatbot
| System | Behaviour | Best fit |
|---|---|---|
| Chatbot | Responds to user input; may not use tools | Q&A and conversational support |
| Deterministic workflow | Executes a predefined graph or sequence | Stable business processes |
| Agent | Selects actions and may adapt steps based on observations | Tasks requiring flexible tool selection or replanning |
| Hybrid | Agent chooses within a bounded workflow | Flexible decisions with predictable guardrails |

Prefer the least complex design that reliably meets requirements. An agent adds flexibility but also introduces nondeterminism, extra latency, cost, and new failure modes.

## 14. Multi-Agent Systems and Handoffs
A multi-agent design can split work among specialised agents, such as a research agent, coding agent, and reviewer. A coordinator can route work or hand off control to a specialist.

Potential benefits:
- Separates instructions and responsibilities.
- Allows specialist tools and context.
- Makes complex workflows easier to reason about when boundaries are clear.

Costs and risks:
- More model calls and latency.
- More state and orchestration complexity.
- Errors can propagate between agents.
- Debugging requires tracing the full handoff chain.

Use multiple agents only when independent responsibilities or tool boundaries justify the overhead. A single agent with well-defined tools is usually a better baseline.

## 15. Human-in-the-Loop Design
Pause for human review when an action is high impact, irreversible, uncertain, or legally/financially sensitive.

A safe approval flow shows:
- The proposed action and exact arguments.
- The records or people affected.
- The reason and evidence supporting the action.
- The ability to approve, edit, or reject.
- An audit record of the decision.

Approval should happen before execution, not after. Re-check authorization at execution time because permissions may change while the request is waiting.

## 16. Agent Evaluation and Observability
Evaluate the whole trajectory, not only the final text. Useful dimensions:
- Task success and answer correctness.
- Tool selection and argument accuracy.
- Evidence quality and groundedness.
- Policy/permission violations.
- Number of steps, latency, and token/API cost.
- Robustness to tool errors and ambiguous instructions.

Create a fixed evaluation set with normal cases, edge cases, adversarial requests, and expected tool behaviour. Log trace IDs, selected tool names, validated arguments, result status, and latency while avoiding secrets and unnecessary personal data.

## 17. Common Agent Failure Modes
- Tool hallucination: model references a tool that does not exist.
- Incorrect arguments: required identifiers or types are missing.
- Tool-result misinterpretation: model treats an error or empty result as success.
- Infinite/long loops: no step limit or stop condition.
- Over-planning: many steps without measurable progress.
- Prompt injection: untrusted retrieved content tries to change agent instructions.
- Unsafe side effects: tool executes without permission or review.
- Memory contamination: stale or cross-user facts enter the wrong context.

Mitigate with strict schemas, least privilege, source separation, explicit stop conditions, validation, human review, and evaluation tests.

## 18. Practical Mini-Project: Study Research Agent
Build a bounded agent that:
1. Accepts a question about a fixed set of course topics.
2. Uses a search tool to retrieve relevant notes.
3. Calls a calculator tool only for numerical calculations.
4. Produces an answer with source IDs.
5. Says when evidence is missing.
6. Stops after a small maximum number of tool calls.

Do not provide arbitrary shell, filesystem, or unrestricted database tools. Add a trace view showing the actions and results used for the final answer.

## 19. Placement and Interview Questions
**Q1. What makes a system agentic?**
It uses a model-driven control loop to select actions, use tools, observe results, and adapt steps toward a goal.

**Q2. What is ReAct?**
A reasoning-and-action pattern in which the model alternates between deciding what to do, invoking a tool, and observing the result.

**Q3. Why are tools needed?**
They provide controlled access to external information and actions that the model cannot perform from its parameters alone.

**Q4. Memory vs context?**
Memory is stored information that may be retrieved later; context is the information supplied to a particular model call.

**Q5. Agent vs workflow?**
A workflow follows a predefined path; an agent can select or revise actions based on model decisions and observations.

**Q6. How do you prevent unsafe tool use?**
Least privilege, strict schemas, runtime permission checks, allowlists, approval gates, idempotency, and audit logs.

**Q7. How do you evaluate agents?**
Measure task success, tool choice/arguments, evidence quality, policy compliance, reliability, latency, and cost across a fixed test set.

## 20. Practice Tasks
- Implement a read-only tool with a strict input schema.
- Create a ReAct-style trace for a two-tool task.
- Add a maximum step count and timeout.
- Demonstrate safe retry handling for a transient error.
- Add a human approval step before a simulated write action.
- Compare a deterministic workflow with an agent on the same task.
- Build a small evaluation set and record success, tool accuracy, latency, and cost.

## 21. Quick Revision
- An agent is a model-driven loop with tools, state, and stop conditions.
- The LLM proposes choices; trusted code validates and executes them.
- ReAct alternates between reasoning, action, and observation.
- Memory is stored information; context is what the model sees now.
- Keep tools narrow, typed, permissioned, and observable.
- Use deterministic workflows when the sequence is known.
- Require human approval before high-impact or irreversible actions.
- Evaluate trajectories, not only final answers.

## 22. Final Checklist
- [ ] Define an agent and draw its control loop.
- [ ] Explain ReAct using a concrete tool call.
- [ ] Implement one safe function tool.
- [ ] Distinguish context, state, and memory.
- [ ] Add step limits, error handling, and access checks.
- [ ] Identify actions requiring human approval.
- [ ] Define metrics and test cases for agent evaluation.

## 23. Recommended Resources
- [OpenAI Agents Quickstart](https://developers.openai.com/api/docs/guides/agents/quickstart)
- [OpenAI Agents SDK Guide](https://developers.openai.com/api/docs/guides/agents/sdk)
- [LangGraph Learning Path — includes custom RAG agent material](https://docs.langchain.com/oss/python/learn)
- [Thinking in LangGraph](https://docs.langchain.com/oss/javascript/langgraph/thinking-in-langgraph)
