# Days 39–41 — LLM Tooling Ecosystem

## 1. Overview
The Hugging Face ecosystem supports model discovery, loading, inference, evaluation, and sharing.

Topics:
- Hugging Face Hub.
- Model repositories and model cards.
- Transformers library.
- Tokenizers and model loading.
- `pipeline()` abstraction.
- Inference basics, device placement, and generation parameters.

## 2. Hugging Face Hub
The Hub hosts repositories for models, datasets, and Spaces/demos. A model repository may contain weights, configuration, tokenizer files, generation configuration, model card, and supporting code.

Repository contents and trust requirements vary by model.

## 3. Model IDs and Revisions
A model is commonly referenced as `organization/model-name`.

For reproducibility:
- Record the model ID.
- Pin a commit/revision where possible.
- Record tokenizer and library versions.
- Record inference parameters and preprocessing.
- Keep evaluation cases.

The default branch may change. Pinning a revision reduces unexpected updates.

## 4. Model Cards
Review a model card for:
- Architecture and model description.
- Training data/provenance when disclosed.
- Intended and out-of-scope use.
- Evaluation and benchmarks.
- Limitations, bias, and safety information.
- Licence.
- Hardware and inference requirements.

A model card is useful documentation, not a guarantee that every claim has been independently verified.

## 5. Transformers Library
Transformers provides model classes, tokenizers, configuration classes, generation utilities, and task pipelines.

Common APIs:
- `AutoTokenizer.from_pretrained(...)`
- `AutoModel.from_pretrained(...)`
- Task-specific `AutoModelFor...` classes.
- `pipeline(...)`

Auto classes select model implementations based on checkpoint configuration.

## 6. What Is a Pipeline?
A Transformers pipeline combines:
1. Preprocessing.
2. Model inference.
3. Task-specific post-processing.

Examples include text classification, generation, token classification, question answering, summarisation, image classification, and speech recognition.

Pipelines are convenient for common inference tasks. Direct model/tokenizer use provides more control for advanced batching or custom processing.

## 7. Sentiment Pipeline
```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis")
result = classifier("The tutorial was clear and practical.")
print(result)
```

For reproducible work, specify a model explicitly rather than relying on a task default.

## 8. Text Generation Pipeline
```python
from transformers import pipeline

generator = pipeline(
    task="text-generation",
    model="distilgpt2"
)

result = generator(
    "Artificial intelligence can help students by",
    max_new_tokens=60,
    do_sample=True,
    temperature=0.8
)
print(result[0]["generated_text"])
```

The example is for learning, not a quality benchmark. Check model-specific context and generation limits.

## 9. Load Tokenizer and Model Directly
```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_id = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSequenceClassification.from_pretrained(model_id)

inputs = tokenizer(
    "The product works well.",
    return_tensors="pt",
    truncation=True
)
outputs = model(**inputs)
print(outputs.logits)
```

Direct loading gives more control over tokenization, padding, batching, tensors, device, and post-processing.

## 10. Inference and Device Placement
Inference runs a trained model on new input.

Consider CPU/GPU, memory, dtype/precision, batch size, input length, latency, throughput, quantisation, and caching.

```python
import torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
inputs = {k: v.to(device) for k, v in inputs.items()}

model.eval()
with torch.inference_mode():
    outputs = model(**inputs)
```

Model and inputs must be on compatible devices.

## 11. Generation Parameters
| Parameter | Purpose |
|---|---|
| `max_new_tokens` | Limits generated token count |
| `do_sample` | Enables sampling |
| `temperature` | Adjusts sampling sharpness |
| `top_k` | Restricts candidates to top k |
| `top_p` | Nucleus sampling threshold |
| `num_beams` | Beam-search width |
| `eos_token_id` | End token |
| `pad_token_id` | Padding token |

No decoding strategy is best for every task.

## 12. Licence and Safe Model Use
Before using a model:
- Read licence and restrictions.
- Confirm commercial-use conditions if relevant.
- Review intended uses and limitations.
- Check model provenance.
- Avoid blindly executing repository code.
- Use `trust_remote_code=True` only when code is reviewed and trusted.
- Secure downloads and dependencies in production.

Public availability does not mean unrestricted use.

## 13. Model Selection
Compare task quality on your data, language/domain support, input limits, latency, memory, licence, safety, and reproducibility.

Downloads and benchmark scores alone are not enough. Run representative and edge-case evaluations.

## 14. Common Mistakes
- Skipping the model card.
- Assuming Hub's default branch never changes.
- Ignoring licence.
- Trusting arbitrary remote code.
- Not understanding pipeline output.
- Forgetting truncation and context limits.
- Moving input to GPU but not model.
- Treating default model as production recommendation.

## 15. Placement and Interview Questions
**Q1. What is Hugging Face Hub?** A platform for discovering and sharing models, datasets, and demos.

**Q2. What is a model card?** Documentation covering model details, uses, evaluation, limitations, and licence.

**Q3. What does `pipeline()` do?** Wraps preprocessing, inference, and post-processing.

**Q4. Pipeline vs direct loading?** Pipeline is convenient; direct loading provides control.

**Q5. What does AutoTokenizer do?** Loads tokenizer assets associated with a checkpoint.

**Q6. Why pin revisions?** To improve reproducibility.

**Q7. What does `model.eval()` do?** Switches modules such as dropout and BatchNorm to evaluation behaviour.

**Q8. Why review remote code?** Repository code may execute in your environment.

## 16. Practice
Choose two Hub models for the same task. Compare model cards, licences, limitations, hardware requirements, outputs, and latency. Load one tokenizer/model directly and inspect token IDs, attention masks, logits, and device placement.

## 17. Quick Revision
- Hub: model/dataset/demo repositories.
- Model card: intended use, evaluation, limits, licence.
- Transformers: model/tokenizer interfaces.
- Pipeline: preprocess → infer → postprocess.
- Inference: run model on new input.
- Revision pinning: reproducibility.
- Remote code and licences: review before use.

## 18. Final Checklist
- [ ] Inspect a model on Hugging Face Hub.
- [ ] Read model card and licence.
- [ ] Use a classification and generation pipeline.
- [ ] Load model/tokenizer directly.
- [ ] Explain inference/device placement.
- [ ] Pin revisions and record versions.

## 19. Recommended Resources
- [HF Pipelines Docs](https://huggingface.co/docs/transformers/main_classes/pipelines)
- [HF LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- [HF Hub Docs](https://huggingface.co/docs/hub/index)
- [HF Model Cards](https://huggingface.co/docs/hub/model-cards)
- [Transformers Quicktour](https://huggingface.co/docs/transformers/quicktour)
