# Days 56–57 — Rapid Prototyping Tools

## 1. Learning Objectives
Build a small interactive Python application around a dataset, ML model, or LLM. Choose between Streamlit and Gradio based on the interface, implement inputs and outputs, manage state, and prepare a demo for sharing.

Topics:
- Streamlit fundamentals and data apps.
- Gradio components and Blocks.
- ML/LLM user interfaces in Python.
- Input validation, state, caching, and error handling.
- Secrets, deployment, and demo quality.

## 2. Why Rapid Prototyping Tools?
A model is difficult to evaluate when only accessible through scripts or notebooks. A lightweight interface allows a reviewer to provide realistic inputs, inspect outputs, and understand the value of a project.

Rapid prototyping tools are useful for:
- Data exploration dashboards.
- Classifiers and prediction demos.
- LLM chat and document question-answering.
- Internal tools and proof-of-concept workflows.
- Portfolio demos that make a technical project easy to test.

A prototype is not automatically a production application. Authentication, privacy, observability, reliability, cost controls, and deployment architecture still need deliberate design.

## 3. Streamlit: Mental Model
Streamlit turns a Python script into an interactive web app. The script generally executes from top to bottom when a user interacts with a widget; Streamlit reruns the script and uses widget/state mechanisms to preserve the intended values.

Basic building blocks:
- Display: titles, text, dataframes, charts, metrics.
- Input widgets: text input, selectbox, slider, file uploader, buttons.
- Layout: columns, sidebar, tabs, expanders, containers.
- State: `st.session_state` for values that must survive reruns.
- Caching: `st.cache_data` for data results and `st.cache_resource` for reusable resources such as models/connections.

## 4. Streamlit: Installation and First App
Create an isolated environment and install Streamlit:

```bash
python -m venv .venv
# Activate the environment for your operating system
pip install streamlit pandas
```

Create `app.py`:

```python
import streamlit as st
import pandas as pd

st.set_page_config(page_title="Placement Data Explorer", layout="wide")
st.title("Placement Data Explorer")
st.write("Upload a CSV to inspect its structure.")

file = st.file_uploader("Choose a CSV file", type=["csv"])
if file is not None:
    df = pd.read_csv(file)
    st.metric("Rows", len(df))
    st.metric("Columns", len(df.columns))
    st.dataframe(df.head(20), use_container_width=True)
```

Run it:

```bash
streamlit run app.py
```

The command starts the local development server and opens the app in a browser. Do not assume uploaded files are safe: validate size, schema, encoding, and content before processing.

## 5. Streamlit Widgets and Layout
Widgets return Python values that drive the script. Example:

```python
import streamlit as st

st.title("Model Prediction Demo")
experience = st.slider("Years of experience", 0, 10, 1)
skill = st.selectbox("Primary skill", ["Python", "Java", "JavaScript"])

if st.button("Estimate"):
    st.write({"experience": experience, "skill": skill})
```

Layout helpers such as `st.columns`, `st.sidebar`, `st.tabs`, and `st.expander` organise the page. Keep the most important user action visible and avoid placing every metric in a separate card.

## 6. Streamlit State, Caching, and Reruns
Use session state for data that must persist across reruns during a session:

```python
import streamlit as st

if "messages" not in st.session_state:
    st.session_state.messages = []

prompt = st.chat_input("Ask a question")
if prompt:
    st.session_state.messages.append({"role": "user", "content": prompt})

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])
```

Caching guidance:
- `st.cache_data`: cache serializable data results, such as a parsed dataset or computed table.
- `st.cache_resource`: cache shared resources such as a loaded model or database connection when reuse is appropriate.
- Never cache user-specific private data globally without understanding the cache key and isolation implications.
- Avoid using caching as a substitute for correctness or invalidation strategy.

## 7. Streamlit: Visualising Data and Models
Example chart workflow:

```python
import streamlit as st
import pandas as pd

uploaded = st.file_uploader("Upload sales.csv", type="csv")
if uploaded:
    df = pd.read_csv(uploaded)
    if {"month", "revenue"}.issubset(df.columns):
        st.line_chart(df.set_index("month")["revenue"])
    else:
        st.error("CSV must contain month and revenue columns.")
```

For ML inference, load the model once where possible, validate feature names and types, transform data using the same fitted preprocessing pipeline used during training, and display the prediction with relevant context. Do not retrain on every rerun.

## 8. Gradio: Mental Model
Gradio creates a web interface around a Python function, ML model, or API. Its components describe inputs and outputs; an interface connects those components to a callable function.

Use Gradio when you want:
- A focused model or function demo.
- Text, image, audio, video, or file inputs and outputs supported by components.
- A quick shareable interface for testing an inference function.
- A custom multi-component layout using `Blocks`.

Gradio is not limited to LLMs. A Python function can be the core of the demo.

## 9. Gradio: Interface Quickstart
Install Gradio in a virtual environment:

```bash
pip install --upgrade gradio
```

Create `app.py`:

```python
import gradio as gr

def greet(name: str) -> str:
    name = name.strip()
    return f"Hello, {name or 'there'}!"

app = gr.Interface(
    fn=greet,
    inputs=gr.Textbox(label="Your name"),
    outputs=gr.Textbox(label="Greeting"),
    title="Greeting Demo",
    description="A minimal Python function exposed as a web UI."
)

if __name__ == "__main__":
    app.launch()
```

The `Interface` abstraction is useful for simple input → function → output flows. For richer pages, use `gr.Blocks` and compose components with event handlers.

## 10. Gradio Blocks and Event Flow
`Blocks` provides more control over layout and interactions:

```python
import gradio as gr

def word_count(text):
    words = text.split()
    return f"Words: {len(words)}"

with gr.Blocks() as demo:
    gr.Markdown("# Text Analyzer")
    text_input = gr.Textbox(lines=5, label="Enter text")
    result = gr.Textbox(label="Result")
    analyze = gr.Button("Analyze")
    analyze.click(fn=word_count, inputs=text_input, outputs=result)

demo.launch()
```

A component event calls a function with the configured inputs and sends the returned value to the configured outputs. Keep functions deterministic where possible and handle exceptions so users receive useful feedback instead of a broken interface.

## 11. Streamlit vs Gradio
| Dimension | Streamlit | Gradio |
|---|---|---|
| Common starting point | Data apps and dashboards | Model/function demos |
| Programming model | Script reruns and widgets | Components connected to functions/events |
| Strength | Data exploration, layout, charts, workflows | Fast model demos and rich ML input/output components |
| Customisation | Python-first app composition | `Interface` for simple demos; `Blocks` for custom layouts |
| Choose when | Users explore data or a multi-step dashboard | Users submit inputs to an inference function or model |

Both can build useful AI interfaces. Choose based on the user journey rather than assuming one is universally better.

## 12. Building an LLM UI Safely
A minimal LLM interface usually needs:
1. Input box and submit action.
2. Server-side call to the model provider.
3. Loading/progress feedback.
4. Output display and conversation history if needed.
5. Error and rate-limit handling.

Security and reliability requirements:
- Keep provider API keys on the server, using environment variables or the platform's secrets manager.
- Never embed secret keys in browser-visible code or a public repository.
- Add request-size limits, timeouts, and rate limits.
- Make external calls only after validating input.
- Avoid logging secrets or unnecessary personal data.
- Treat model output as untrusted content; escape it before rendering as HTML.
- Explain when the output is generated and may be incorrect.

## 13. File Uploads and Data Validation
For CSV/document demos, enforce:
- Allowed file types and a maximum file size.
- Expected columns, data types, and row limits.
- Safe parsing and encoding handling.
- Clear errors for empty or malformed files.
- Data retention and deletion expectations.

Do not execute uploaded code, macros, or arbitrary serialized objects. A portfolio demo should use sample data or clearly explain what happens to uploaded content.

## 14. Deployment and Sharing
A local demo is not the same as a deployed app. Before sharing:
- Pin dependencies in `requirements.txt` or an equivalent lock file.
- Store secrets in deployment environment configuration.
- Confirm model and data downloads work in a clean environment.
- Set resource and request limits.
- Test from a second browser/session.
- Add a README with setup, features, architecture, limitations, and demo URL.

Streamlit Community Cloud and Gradio's supported hosting/sharing options are common ways to publish prototypes. Verify current platform limits, privacy behaviour, and sleeping/availability policies before relying on a free deployment for a production service.

## 15. Practical Mini-Project: ML/LLM Playground
Create a two-tab app:
- **Prediction tab:** input fields, preprocessing, model prediction, confidence or explanation where valid.
- **LLM tab:** user prompt, model response, token/latency information when available, and a clear error state.

Requirements:
- Validate inputs and show useful errors.
- Keep API keys server-side.
- Add a small sample dataset or demo mode.
- Add a reset/clear action.
- Include a limitations section and test examples.

Choose Streamlit for a data-exploration workflow or Gradio for an inference-first experience. Build the same simple function in both if you want a direct comparison.

## 16. Testing and Common Mistakes
- **Blocking long operations:** show progress and configure sensible timeouts.
- **Repeated model loading:** use appropriate resource caching.
- **State resets:** understand rerun and component event behaviour.
- **Unvalidated input:** check file size, structure, and types.
- **Exposed credentials:** use server-side secrets only.
- **No error state:** catch expected provider, validation, and network errors.
- **Prototype mistaken for production:** document missing authentication, monitoring, backups, and scale controls.
- **Misleading confidence:** distinguish probability estimates from certainty and calibrate when the use case needs it.

## 17. Placement and Interview Questions
**Q1. What is Streamlit?**
A Python framework for creating interactive data apps using scripts and widgets.

**Q2. What is Gradio?**
A Python library that exposes a function, model, or API through a web UI built from input/output components.

**Q3. Streamlit rerun model?**
Interactions can trigger script reruns; widget values and session state preserve the required interaction state.

**Q4. `st.cache_data` vs `st.cache_resource`?**
The former caches data results; the latter caches reusable resources such as a model or connection.

**Q5. `Interface` vs `Blocks` in Gradio?**
`Interface` is a convenient input-function-output abstraction; `Blocks` supports more custom layouts and event wiring.

**Q6. Where should API keys live?**
On the server in environment variables or a secrets manager, never in client-side code or a public repository.

**Q7. Is a demo production-ready?**
Not by default. Production needs security, privacy, reliability, monitoring, access control, deployment and cost management.

## 18. Practice Tasks
- Build a Streamlit CSV profiler with row/column metrics, missing-value summary, and two charts.
- Build a Gradio sentiment classifier around a Python function.
- Build a chat-like LLM UI with loading and error states.
- Add state so a conversation remains visible after interactions.
- Add file validation and a maximum upload size.
- Create a clean `requirements.txt` and README.
- Deploy one app and test it from a fresh browser session.

## 19. Quick Revision
- Streamlit is a strong fit for Python data apps and dashboards.
- Gradio is a fast path from a Python function/model to an interactive demo.
- Streamlit reruns scripts; use session state and caching intentionally.
- Gradio `Interface` is simple; `Blocks` offers custom composition.
- Keep credentials server-side and validate all user-provided files and inputs.
- Document the boundary between a portfolio prototype and a production system.

## 20. Final Checklist
- [ ] Build and run a Streamlit app locally.
- [ ] Use widgets and session state.
- [ ] Cache a data result or reusable model correctly.
- [ ] Build a Gradio Interface and a Blocks layout.
- [ ] Explain which framework fits a given use case.
- [ ] Validate files and handle errors.
- [ ] Store secrets outside source code.
- [ ] Publish a demo with a clear README and limitations.

## 21. Recommended Resources
- [Streamlit Get Started](https://docs.streamlit.io/get-started)
- [Streamlit API Reference](https://docs.streamlit.io/develop/api-reference)
- [Gradio Quickstart](https://www.gradio.app/guides/quickstart)
- [Gradio Guides](https://www.gradio.app/guides)
