# Days 52–55 — Fine-tuning, LoRA + Distillation

## 1. Overview

Pretrained models contain representations learned from large-scale data. Fine-tuning adapts these models to a downstream task or domain.

This block covers:
- Full fine-tuning and layer freezing
- Parameter-efficient fine-tuning (PEFT)
- Low-Rank Adaptation (LoRA)
- QLoRA and quantisation
- Knowledge distillation
- Hard and soft targets
- Practical Hugging Face PEFT workflow

## 2. Pretraining vs Fine-tuning

### Pretraining
A model learns general representations from a large dataset using an objective such as masked-token prediction or next-token prediction.

### Fine-tuning
A pretrained model is further trained on task-specific or domain-specific data.

Examples:
- Text classification.
- Instruction following.
- Domain-specific extraction.
- Question answering.
- Image classification.

Fine-tuning should start with a clear task definition, high-quality examples, and a validation plan. It is not automatically the best solution; prompting, retrieval, or a smaller model may be more appropriate.

## 3. Full Fine-Tuning

Full fine-tuning updates all or most model parameters using the downstream training objective.

Advantages:
- Maximum flexibility to adapt weights.
- Can give strong task adaptation when enough data and compute are available.

Limitations:
- High GPU memory use for weights, gradients, and optimizer states.
- Expensive training.
- Separate full model copies can be costly to store and serve.
- Small datasets can cause overfitting or catastrophic forgetting.

## 4. Layer Freezing and Feature Extraction

Freezing means setting selected parameters so they are not updated during training.

Common strategies:
- Freeze the backbone and train only a task head.
- Unfreeze the final few layers.
- Gradually unfreeze more layers.
- Fine-tune all layers with a smaller learning rate.

### When to freeze
- Limited training data.
- Limited compute.
- Pretrained representation is already strong.
- Fast baseline is needed.

### When to unfreeze
- Domain is substantially different from pretraining.
- The task requires deeper representation adaptation.
- Sufficient data and compute exist.

## 5. Parameter-Efficient Fine-Tuning (PEFT)

PEFT updates a small subset of parameters or inserts trainable modules while keeping most pretrained weights frozen.

Benefits:
- Lower trainable parameter count.
- Lower optimizer-state memory.
- Smaller task-specific checkpoints.
- Easier to maintain multiple adapters for different tasks.

Examples:
- LoRA.
- Adapters.
- Prefix tuning.
- Prompt tuning.
- IA³ and other parameter-efficient methods.

PEFT does not remove the cost of loading and running the base model at inference time.

## 6. Low-Rank Approximation Intuition

A matrix can sometimes be approximated by a product of smaller matrices:

\[
\Delta W\approx BA
\]

If \(W\in\mathbb{R}^{d_{out}\times d_{in}}\) and the rank is \(r\), choose:

\[
B\in\mathbb{R}^{d_{out}\times r},\quad
A\in\mathbb{R}^{r\times d_{in}}
\]

When \(r\) is small, the trainable parameter count is:

\[
r(d_{in}+d_{out})
\]

rather than \(d_{in}d_{out}\).

The product BA provides a low-rank update to the original weight matrix.

## 7. LoRA — Low-Rank Adaptation

LoRA freezes the pretrained weight matrix \(W_0\) and learns a low-rank update:

\[
W=W_0+\Delta W
\]

\[
\Delta W=\frac{\alpha}{r}BA
\]

where:
- \(r\): LoRA rank.
- \(\alpha\): scaling parameter.
- A and B: trainable low-rank matrices.

During training:
- Base weights remain frozen.
- Adapter matrices are updated.
- Only a small set of parameters needs gradient and optimizer state.

At inference, the update may be applied as part of the layer computation or merged into base weights where supported.

### LoRA target modules
Common targets in Transformer models include query and value projections, or a broader set of attention and feed-forward projections. Exact module names depend on the model architecture.

## 8. Choosing LoRA Hyperparameters

- `r`: rank of low-rank update. Higher rank increases adaptation capacity and trainable parameters.
- `lora_alpha`: scaling factor.
- `lora_dropout`: dropout applied within adapter path.
- `target_modules`: which layers receive adapters.
- `bias`: whether selected bias parameters are trained.

Do not assume a higher rank always improves validation quality. Choose based on task, data, and compute.

## 9. QLoRA

QLoRA combines quantisation of the frozen base model with trainable LoRA adapters.

High-level:
1. Load base model weights in a low-bit quantised representation (commonly 4-bit).
2. Keep base weights frozen.
3. Add trainable LoRA adapters.
4. Backpropagate through the frozen quantised base computation into adapter parameters.
5. Optimise only adapters and other explicitly trainable parameters.

QLoRA introduced techniques such as:
- 4-bit NormalFloat (NF4).
- Double quantisation.
- Paged optimisers.

The goal is to reduce memory required for fine-tuning large models. It does not mean all computation and memory become negligible, and hardware/software compatibility still matters.

## 10. Hugging Face PEFT Configuration Example

The following illustrates adapter configuration. Model IDs, target modules, quantisation support, and library versions must be checked for the chosen model.

```python
from peft import LoraConfig, TaskType, get_peft_model

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=8,
    lora_alpha=16,
    lora_dropout=0.05,
    target_modules=["q_proj", "v_proj"],
    bias="none"
)

peft_model = get_peft_model(base_model, lora_config)
peft_model.print_trainable_parameters()
```

This snippet assumes `base_model` is already loaded and its architecture contains module names matching `q_proj` and `v_proj`. Inspect the actual model before selecting targets.

## 11. Knowledge Distillation

Knowledge distillation transfers behaviour from a larger **teacher** model to a smaller **student** model.

The teacher produces target distributions or intermediate signals. The student is trained to imitate them, possibly alongside ground-truth labels.

Why distil?
- Smaller/faster inference model.
- Lower serving cost.
- Deployment on edge devices.
- Transfer useful behaviour into a compact architecture.

Distillation does not guarantee the student will match teacher performance.

## 12. Hard Targets vs Soft Targets

### Hard targets
Ground-truth class labels, usually one-hot or class indices.

They say which class is correct.

### Soft targets
Teacher probability distribution across classes.

They contain information about relative similarity/confusion between classes.

Example:
- True label: cat.
- Teacher output: cat 0.72, fox 0.20, dog 0.08.

The soft distribution communicates more than the hard label alone.

## 13. Temperature-Softened Distillation

Given teacher logits \(z_i\) and temperature \(T\):

\[
p_i^{(T)}=\frac{\exp(z_i/T)}{\sum_j\exp(z_j/T)}
\]

Higher T produces a softer distribution.

A common distillation objective combines:
- Student vs ground-truth hard-label loss.
- Student vs teacher soft-target KL divergence.

\[
L=(1-\alpha)L_{hard}+\alpha T^2D_{KL}(p_{teacher}^{(T)}\|p_{student}^{(T)})
\]

The exact coefficient convention varies. The \(T^2\) factor is commonly used to compensate for gradient scaling from temperature.

## 14. Fine-Tuning vs Distillation

| Aspect | Fine-tuning | Distillation |
|---|---|---|
| Main goal | Adapt pretrained model to a task | Transfer teacher behaviour to student |
| Models | Usually one base model being adapted | Teacher and student |
| Data | Task examples | Inputs plus teacher outputs and/or labels |
| Output | Adapted model | Smaller or specialised student |
| Main cost | Updating model/adapters | Teacher inference + student training |

These techniques can also be combined: fine-tune a teacher, then distil it into a smaller student.

## 15. Evaluation for Fine-Tuning

Evaluate more than training loss:
- Task-specific metrics.
- Held-out validation.
- Robustness to input variation.
- Regression tests for important capabilities.
- Safety and policy evaluations where relevant.
- Latency, memory, and throughput.
- Comparison against prompting or retrieval baselines.

Ensure training and evaluation examples do not overlap or leak near-duplicates.

## 16. Common Mistakes

- Fine-tuning before defining a clear task and baseline.
- Assuming PEFT means no inference cost from the base model.
- Using LoRA target-module names that do not exist in the model.
- Increasing rank without validation.
- Assuming 4-bit QLoRA automatically fits on any GPU.
- Confusing quantisation with low-rank decomposition.
- Forgetting that QLoRA freezes the quantised base weights.
- Using only hard labels when teacher soft targets are available and useful.
- Distilling teacher mistakes without evaluating them.
- Reporting training loss without testing task performance.

## 17. Placement and Interview Questions

**Q1. Full fine-tuning vs PEFT?**  
Full fine-tuning updates most/all pretrained parameters; PEFT updates a much smaller set of parameters or adapters.

**Q2. What is LoRA?**  
A method that freezes base weights and learns a low-rank matrix update.

**Q3. Why low rank?**  
It represents a weight update with fewer parameters than a full dense matrix.

**Q4. What is QLoRA?**  
A memory-efficient approach using a low-bit quantised frozen base model with trainable LoRA adapters.

**Q5. What is layer freezing?**  
Preventing selected pretrained parameters from receiving updates.

**Q6. What is knowledge distillation?**  
Training a student to imitate a teacher's output distribution or behaviour.

**Q7. Hard vs soft targets?**  
Hard targets are ground-truth labels; soft targets are probability distributions that include class relationships.

**Q8. What does temperature do in distillation?**  
It softens teacher/student output distributions and exposes relative probabilities across classes.

## 18. Practice

### Paper exercises
1. Calculate LoRA parameter count for a \(4096\times4096\) matrix with rank 8.
2. Compare that count with a full dense update.
3. Explain the roles of \(A\), \(B\), rank, and alpha.
4. Explain how QLoRA reduces memory compared with full fine-tuning.
5. Given teacher logits, describe how increasing temperature changes soft targets.
6. Explain why a student can be smaller but still fail to match a teacher.

### Coding exercise
Use a small openly available instruction dataset and an appropriately sized pretrained model:
- Establish zero-shot or prompt-based baseline.
- Add LoRA with PEFT.
- Count trainable parameters.
- Train with validation monitoring.
- Compare adapter and baseline.
- Save the adapter and model configuration.
- Document hardware, memory, model version, data licence, and reproducibility details.

## 19. Quick Revision

- Full fine-tuning: update all/most weights.
- Freezing: selected weights remain unchanged.
- PEFT: train small parameter subset.
- LoRA: low-rank update \(BA\).
- QLoRA: quantised frozen base + LoRA adapters.
- Distillation: teacher transfers behaviour to student.
- Hard targets: true labels.
- Soft targets: teacher probabilities.
- Temperature: controls softness.
- Evaluation: task quality + capability + cost + robustness.

## 20. Final Checklist

- [ ] Compare full fine-tuning, freezing, and PEFT.
- [ ] Derive LoRA parameter count.
- [ ] Explain rank and alpha.
- [ ] Explain QLoRA and its quantisation techniques.
- [ ] Configure PEFT for an actual model architecture.
- [ ] Explain teacher–student distillation.
- [ ] Compare hard and soft targets.
- [ ] Explain temperature-softened distributions.
- [ ] Evaluate quality, latency, memory, and regressions.

## 21. Recommended Resources

- [Hugging Face Smol Course](https://huggingface.co/learn/smol-course/unit0/1)
- [Hugging Face Smol Training Playbook](https://islinxu.github.io/smol-training-playbook/)
- [Sachin Soni — QLoRA articles and tutorials](https://medium.com/@sachinsoni600517)
- [Sachin Soni — Instruction Fine-Tuning articles](https://medium.com/@sachinsoni600517)
- [LoRA paper](https://arxiv.org/abs/2106.09685)
- [QLoRA paper](https://arxiv.org/abs/2305.14314)
- [Hugging Face PEFT documentation](https://huggingface.co/docs/peft/index)
