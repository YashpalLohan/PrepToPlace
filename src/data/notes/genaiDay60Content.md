# Day 60 — LangGraph + n8n + Portfolio Wrap

## 1. Day 60 Objectives
Consolidate the Generative AI track by understanding graph-based agent orchestration, building a visual automation workflow in n8n, connecting tools safely, and packaging one end-to-end project for internship and placement discussions.

Topics:
- LangGraph graphs, nodes, edges, and state.
- Entry points, conditional routing, and graph execution.
- Persistence, checkpointing, and human-in-the-loop concepts.
- n8n visual workflows, nodes, connections, and triggers.
- Credentials and integrations.
- AI Agent node and connected tools.
- Portfolio architecture, evaluation, documentation, and demo.

## 2. Why Orchestration Frameworks?
An agent demo often starts as one prompt and one model call. As soon as it needs retrieval, tools, branching, retries, state, approvals, and persistence, control flow becomes harder to maintain.

Orchestration frameworks make that flow explicit:
- LangGraph expresses application logic as a graph of steps and transitions.
- n8n expresses integrations and automations as connected visual nodes.
- Both can coordinate LLM calls and tools, but they have different programming models and deployment considerations.

Use a framework because it solves a concrete complexity problem, not because every LLM call needs a framework.

## 3. LangGraph: Graph Fundamentals
LangGraph models an application as a graph. Core concepts:
- **State:** shared structured data passed through the workflow.
- **Node:** a function or unit of work that reads state and returns updates.
- **Edge:** a connection that determines which node runs next.
- **Conditional edge/routing:** chooses the next node based on state or a decision.
- **START and END:** graph entry and terminal points.
- **Checkpointer:** saves state at execution checkpoints so a thread can persist or resume, when configured.

A graph is not just a diagram; it defines executable control flow.

## 4. State Design
State should contain the information that nodes need to share across steps. Examples for a document assistant:

```python
from typing import TypedDict

class AssistantState(TypedDict):
    question: str
    retrieved_chunks: list[str]
    draft_answer: str
    approved: bool
```

Design state deliberately:
- Keep raw inputs and structured results.
- Store values needed by later nodes or for persistence/debugging.
- Avoid duplicating values that can be cheaply derived.
- Keep prompt formatting inside the node that uses it.
- Use typed schemas and validation for important fields.

State is workflow data, not a place to store arbitrary secrets or unrestricted user records.

## 5. Nodes: Small, Testable Units
A node should have one clear responsibility, such as:
- Parse the user's request.
- Retrieve documents.
- Call a model to draft an answer.
- Check whether evidence is sufficient.
- Request human review.
- Execute an approved action.

Small nodes make testing and debugging easier. A node should return state updates rather than secretly depending on unrelated global variables. Handle expected errors explicitly.

## 6. Edges and Conditional Routing
A normal edge always routes to the next defined node. A conditional edge chooses a path based on the current state.

Example design:

```text
START → retrieve → draft → evidence_check
                              ↓
                    ┌─────────┴─────────┐
                sufficient          insufficient
                    ↓                    ↓
                  answer              clarify
                    ↓                    ↓
                   END                 END
```

The routing function should be small, deterministic where possible, and tested for every branch. Do not allow an LLM decision to bypass a permission or approval check.

## 7. A Conceptual LangGraph Workflow
A graph can be designed in stages before writing code:
1. List the user-visible goal and constraints.
2. Break the process into nodes.
3. Identify what data passes between nodes.
4. Draw fixed and conditional edges.
5. Define error, retry, and stop behaviour.
6. Add persistence or interrupt points only where useful.
7. Test each node and the full graph.

This design-first workflow prevents a single oversized node from containing retrieval, prompting, external actions, and UI logic together.

## 8. LangGraph Python Skeleton
A simplified graph pattern uses `StateGraph`, node functions, edges, and compilation:

```python
from typing import TypedDict
from langgraph.graph import StateGraph, START, END

class State(TypedDict):
    question: str
    answer: str

def draft(state: State):
    # Replace with a model call in a real application.
    return {"answer": f"Draft for: {state['question']}"}

builder = StateGraph(State)
builder.add_node("draft", draft)
builder.add_edge(START, "draft")
builder.add_edge("draft", END)

app = builder.compile()
result = app.invoke({"question": "What is RAG?", "answer": ""})
print(result["answer"])
```

This is a minimal skeleton, not a complete agent. Add a model, tools, validation, and persistence only when the application requires them. Check the installed LangGraph version because APIs and examples can evolve.

## 9. Persistence, Checkpointing, and Human Review
Checkpointing stores graph state at defined points so workflows can resume, inspect prior state, or support multi-step interactions. Thread identifiers scope executions when using a checkpointer.

Human-in-the-loop workflows can pause before a consequential step, request an approval or correction, and then resume. The approval must be checked before the action runs. A saved graph state does not itself guarantee that the user is still authorised to execute the operation.

Consider persistence when a process needs:
- Conversation/thread continuity.
- Pause and resume.
- Human approval.
- Fault recovery and inspection.

For a one-shot deterministic script, checkpointing may add unnecessary complexity.

## 10. LangGraph Debugging and Testing
Test the graph at three levels:
- **Node tests:** given input state, does the node return the expected update?
- **Routing tests:** does each condition take the correct path?
- **End-to-end tests:** does the full graph produce a valid result and stop correctly?

Inspect state transitions, tool inputs/outputs, exceptions, and execution time. Avoid putting secrets or raw personal information into traces. Include test cases for missing fields, empty retrieval, tool failure, and approval rejection.

## 11. n8n: Visual Workflow Fundamentals
n8n is a workflow automation platform that connects applications and APIs through a visual canvas. A workflow is composed of nodes connected by edges; data produced by one node is passed to downstream nodes.

Common node categories:
- **Trigger nodes:** start a workflow due to a schedule, webhook, app event, or manual action.
- **Action/app nodes:** read, create, update, or send data to an integration.
- **Logic/data nodes:** transform, filter, branch, merge, or validate data.
- **AI/LangChain nodes:** connect models, memory, tools, retrievers, or agent behaviour where supported.

The exact node list depends on installed n8n version and connected integrations.

## 12. n8n Workflow Anatomy
A typical workflow:

```text
Trigger
   ↓
Validate / Transform Input
   ↓
AI Agent or Business Logic
   ↓
Connected Tool / API Nodes
   ↓
Validate Result
   ↓
Notify / Store / Respond
```

The trigger determines when execution begins. Nodes define work. Connections determine data flow and sequence. Execution history helps inspect input/output and identify failures.

Keep each node's responsibility narrow. Add explicit branches for validation failure, missing records, and service errors rather than allowing invalid data to flow into later actions.

## 13. Triggers: Starting the Workflow
Common trigger patterns:
- **Manual trigger:** run a workflow during development or testing.
- **Schedule trigger:** start at a defined time or interval.
- **Webhook trigger:** start when an external service sends an HTTP request.
- **App event trigger:** start when a connected service reports an event.

Choose the trigger based on the business event. For webhook endpoints, validate caller identity, request shape, and replay behaviour. For scheduled tasks, make the workflow safe to run more than once.

## 14. Credentials and Connection Security
n8n credentials store authentication information for connected services. Create and select credentials through the platform's credential mechanism rather than putting API keys or passwords into ordinary node text fields.

Security checklist:
- Use least-privilege credentials.
- Separate development and production credentials.
- Rotate credentials when exposed or no longer needed.
- Restrict who can edit workflows and access credentials.
- Avoid sending secrets in prompts or model-visible context.
- Review execution logs for accidental secret exposure.
- Protect webhook endpoints and limit inbound access.

A workflow can be visually simple while still having production-level security responsibilities.

## 15. n8n AI Agent Node
The AI Agent node provides an agent-style step that uses a connected chat model and tools to decide how to handle a task. The current n8n documentation requires at least one tool sub-node to be connected. The older agent-type selector was deprecated from n8n 1.82.0; current AI Agent nodes use the Tools Agent behaviour. The agent receives workflow data as input and selects among its connected tools.

Conceptual setup:
1. Add a trigger node.
2. Validate and prepare the incoming request.
3. Add the AI Agent node.
4. Connect a supported chat model.
5. Connect only the tools needed for the task.
6. Provide concise instructions and expected output constraints.
7. Validate the result before sending or saving it.

The model's ability to call a connected tool is not permission for every user. Enforce access and side-effect rules in the downstream tool or application.

## 16. Connecting Tools to an Agent
A tool connection exposes a bounded capability to the agent. Examples include a knowledge-base retriever, calculator, CRM lookup, or ticket search.

Good practice:
- Describe precisely what the tool does and when to use it.
- Keep parameters narrow and typed.
- Return concise, structured results with IDs and status.
- Separate read operations from write operations.
- Add human review before external or irreversible side effects.
- Test the agent's tool selection and argument quality with realistic examples.

Avoid giving the agent broad access to arbitrary HTTP requests, shell commands, or unfiltered database operations.

## 17. LangGraph vs n8n
| Dimension | LangGraph | n8n |
|---|---|---|
| Primary model | Code-first graph orchestration | Visual workflow automation |
| Main building blocks | State, nodes, edges, routing | Nodes, connections, triggers, credentials |
| Strength | Custom agent control flow and application state | Integrating services and automating business workflows |
| Developer experience | Python/JS code and tests | Visual canvas plus expressions/code where needed |
| Good fit | Custom assistants, complex branching, agent state | API integrations, scheduled automation, event-driven workflows |

They can complement each other. For example, n8n can receive a webhook and coordinate business integrations while calling a separately deployed LangGraph service for a complex agent workflow.

## 18. Practical Integration Project
Build a course-material assistant with the following architecture:

```text
n8n Webhook Trigger
       ↓
Validate request + caller
       ↓
Call LangGraph API
       ↓
LangGraph: Retrieve → Draft → Evidence check
       ↓
Return answer + source IDs
       ↓
n8n: Format response → send to approved destination
```

Requirements:
- The retrieval layer enforces user/document permissions.
- The LangGraph service returns source IDs and a status.
- n8n validates the response before notification.
- The workflow records execution status without logging secrets.
- External write actions require explicit authorisation.

## 19. Portfolio Wrap: Choose One Strong Project
A strong portfolio project demonstrates an end-to-end problem solution, not just a collection of libraries. Select one project and make its value obvious in the first 30 seconds.

Include:
- Problem statement and target user.
- Screenshots or a short product demo.
- Architecture diagram and component responsibilities.
- Stack and reason for key choices.
- Data flow, API contracts, and database design.
- Retrieval/agent evaluation results where relevant.
- Known limitations, security decisions, and future work.
- Live demo and reproducible setup instructions.

Possible project directions: document RAG assistant, data analyst agent, support workflow assistant, or an ML inference application with an automation layer.

## 20. README and Demo Checklist
A clear README should contain:
1. Project name and one-sentence value proposition.
2. Problem and key features.
3. Architecture diagram.
4. Tech stack.
5. Local setup and environment variable names (never real secrets).
6. Example inputs and expected outputs.
7. Evaluation methodology and results.
8. Demo link, screenshots, and limitations.
9. License and attribution for external datasets/assets.

The live demo should include a sample path so a reviewer can understand the project without creating an account or uploading private files.

## 21. Evaluation, Security, and Deployment Readiness
Before presenting an AI project, document:
- A small evaluation set and measurable task-success results.
- Retrieval quality or agent tool accuracy where applicable.
- Latency, API usage, and cost per representative task if available.
- Input validation, rate limiting, and error handling.
- Secret management and access-control boundaries.
- Prompt-injection and untrusted-document handling.
- Logging that supports debugging without exposing sensitive data.
- Deployment limitations, uptime expectations, and fallback behaviour.

Do not fabricate benchmark numbers. Report the dataset, number of test cases, metric definition, and observed result. State when measurements are preliminary.

## 22. Interview Story and Final Revision
Prepare a 2-minute explanation:
- What problem did the project solve?
- Why did you choose this architecture?
- What happens from user input to final output?
- Where do LangGraph/n8n fit?
- How did you evaluate correctness and reliability?
- What failed during development, and how did you fix it?
- What would you change before production?

Final concepts:
- LangGraph: state + nodes + edges + conditional routing.
- n8n: triggers + nodes + connections + credentials.
- Agent node: model decides among connected tools within configured boundaries.
- Checkpointing: persistence and recovery, not authorization.
- Portfolio: evidence of problem-solving, architecture, evaluation, and engineering quality.

## 23. Recommended Resources
- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
- [Thinking in LangGraph](https://docs.langchain.com/oss/python/langgraph/thinking-in-langgraph)
- [n8n AI Agent Node](https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/)
- [n8n Documentation](https://docs.n8n.io/)
