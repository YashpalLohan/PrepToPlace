# Days 15–18 — Regularization + Generalization

## 1. Overview

A deep learning model should perform well on data it has not seen during training. It should learn useful patterns rather than memorise the training examples.

This block covers:
- Underfitting and overfitting
- Generalisation and the bias–variance perspective
- L1 and L2 regularisation
- Early stopping
- Dropout
- Vanishing and exploding gradients
- Practical diagnostics and remedies

## 2. Training, Validation, and Test Sets

- **Training set:** used to calculate gradients and fit parameters.
- **Validation set:** used for model selection, hyperparameter tuning, and early stopping.
- **Test set:** held back for final evaluation after decisions are frozen.

Do not repeatedly optimise decisions against the test set. That gradually turns it into another validation set.

For grouped or temporal data, use splitting methods that respect the structure instead of random row splitting.

## 3. Underfitting and Overfitting

### Underfitting

The model is not expressive enough or has not learned adequately.

Typical symptoms:
- Training loss remains high.
- Validation loss also remains high.
- Both metrics may plateau early.

Possible remedies:
- Increase useful model capacity.
- Train for longer if optimisation is incomplete.
- Improve features or input resolution.
- Reduce excessive regularisation.
- Check the learning rate and optimisation setup.

### Overfitting

The model learns training-specific details and noise.

Typical symptoms:
- Training loss keeps decreasing.
- Validation loss stops improving or starts increasing.
- Training performance is substantially better than validation performance.

Possible remedies:
- More representative training data.
- Data augmentation where valid.
- Weight regularisation.
- Dropout.
- Early stopping.
- Smaller model or other capacity control.
- Better validation split and leakage checks.

## 4. Generalisation

Generalisation is performance on examples drawn from the target deployment distribution that were not used to fit the model.

A model can fail to generalise because of:
- Overfitting to training data.
- Distribution shift.
- Data leakage or invalid evaluation.
- Noisy labels.
- Training-serving mismatch.
- Insufficient coverage of deployment conditions.

Regularisation can help with overfitting but cannot solve every distribution-shift problem.

## 5. L2 Regularisation / Weight Decay

L2 regularisation adds a penalty on squared parameter magnitudes:

\[
J(\theta)=L_{data}(\theta)+\frac{\lambda}{2}\|\theta\|_2^2
\]

The penalty discourages large weights and can produce smoother or less complex functions.

In a simple gradient update, the L2 term contributes a gradient proportional to the parameter value.

### PyTorch

```python
optimizer = torch.optim.SGD(
    model.parameters(),
    lr=0.01,
    weight_decay=1e-4
)
```

The exact behaviour of `weight_decay` depends on the optimiser. For SGD it corresponds to the common L2-style shrinkage interpretation. AdamW uses decoupled weight decay, which is not identical to simply adding an L2 penalty to Adam's loss.

Biases and normalisation parameters are sometimes excluded from decay using parameter groups; the decision should be intentional.

## 6. L1 Regularisation

L1 regularisation adds the absolute value of weights:

\[
J(\theta)=L_{data}(\theta)+\lambda\|\theta\|_1
\]

It encourages sparse parameters, with some weights becoming exactly zero under suitable optimisation conditions.

In neural networks, L1 is often added explicitly to the loss:

```python
l1_lambda = 1e-5
l1_penalty = sum(parameter.abs().sum() for parameter in model.parameters())
loss = data_loss + l1_lambda * l1_penalty
```

Decide which parameters should be regularised; this simplified snippet applies L1 to every parameter tensor.

## 7. Early Stopping

Early stopping terminates training when validation performance stops improving.

Typical process:
1. Train for one epoch.
2. Evaluate on validation data.
3. Save the checkpoint if the chosen validation metric improves.
4. Count epochs without improvement.
5. Stop after a patience threshold.
6. Restore the best checkpoint.

Early stopping acts as a form of regularisation because it limits how long the model can fit training-specific details.

Use a validation metric and patience appropriate to the task. Always restore the best checkpoint, not automatically the final epoch.

## 8. Dropout

Dropout randomly sets a subset of activations to zero during training.

For activation \(h\) and dropout mask \(m\):

\[
\tilde h=\frac{m\odot h}{1-p}
\]

where each mask element is retained with probability \(1-p\), and \(p\) is the dropout probability. This is inverted dropout.

At evaluation time, dropout is disabled; scaling is already accounted for during training.

### PyTorch

```python
import torch.nn as nn

model = nn.Sequential(
    nn.Linear(128, 64),
    nn.ReLU(),
    nn.Dropout(p=0.3),
    nn.Linear(64, 10)
)
```

Remember:
- `model.train()` enables dropout.
- `model.eval()` disables dropout.
- Dropout is not a guarantee against overfitting; validate its effect.

## 9. Vanishing Gradients

During backpropagation, gradients are multiplied through many layer derivatives and weight matrices. If these factors repeatedly have small magnitudes, gradients reaching early layers can become extremely small.

Effects:
- Early layers learn very slowly.
- Training becomes difficult in deep networks.
- Sigmoid/tanh saturation can make the problem worse.

Potential remedies:
- ReLU-family activations where appropriate.
- Xavier or Kaiming initialisation.
- Normalisation layers.
- Residual/skip connections.
- Suitable architecture and optimiser.
- Careful input scaling.

## 10. Exploding Gradients

If repeated gradient factors have large magnitudes, gradients can grow rapidly.

Symptoms:
- Unstable loss.
- Very large parameter updates.
- `NaN` or infinite values.
- Training divergence.

Potential remedies:
- Gradient clipping.
- Better initialisation.
- Lower learning rate.
- Normalisation or architecture changes.
- Check input scaling and numerical stability.

### Gradient clipping

```python
loss.backward()
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
optimizer.step()
```

Clipping constrains the gradient norm before the optimiser update. It is commonly useful for recurrent networks and other unstable training settings.

## 11. Regularisation Techniques Compared

| Technique | Main mechanism | Typical use |
|---|---|---|
| L1 | Penalises absolute weights | Encourage sparse parameters |
| L2 / weight decay | Penalises large weights / shrinks parameters | Control parameter magnitude |
| Dropout | Randomly removes activations during training | Reduce co-adaptation / overfitting |
| Early stopping | Stops based on validation performance | Prevent excessive fitting |
| Data augmentation | Generates label-preserving input variations | Improve robustness and data diversity |
| Smaller model | Limits capacity | Reduce overfitting |

Regularisation methods can be combined, but too much regularisation causes underfitting.

## 12. Diagnose with Learning Curves

Plot training and validation loss over epochs.

Common patterns:
- Both high: underfitting, data issue, or optimisation issue.
- Training decreases while validation increases: overfitting.
- Both decrease and remain close: learning is progressing with a smaller gap.
- Both fluctuate: learning rate may be high, data may be noisy, or batches may vary.

Also inspect class-wise metrics, confusion matrices, calibration, and representative failure cases when applicable.

## 13. Common Mistakes

- Selecting the best model using the test set.
- Assuming more regularisation is always better.
- Leaving dropout active during evaluation.
- Forgetting to restore the best early-stopping checkpoint.
- Applying L1 to parameters that should not necessarily be penalised.
- Treating Adam weight decay and L2 penalty as always identical.
- Using gradient clipping as a fix for every optimisation problem.
- Ignoring data leakage or distribution shift.
- Assuming a small train–validation gap always means a useful model.

## 14. Placement and Interview Questions

**Q1. What is overfitting?**  
Learning training-specific patterns that do not generalise well to unseen examples.

**Q2. What is early stopping?**  
Stopping training based on validation performance and restoring the best checkpoint.

**Q3. L1 vs L2?**  
L1 encourages sparsity; L2 shrinks weights and discourages large parameter values.

**Q4. What does dropout do?**  
Randomly zeroes activations during training and is disabled during evaluation.

**Q5. What is a vanishing gradient?**  
A gradient becomes very small while propagating backward, slowing learning in earlier layers.

**Q6. What is an exploding gradient?**  
Gradients grow too large, causing unstable updates or numerical failures.

**Q7. How does gradient clipping help?**  
It limits gradient magnitude or norm before the optimiser update.

**Q8. Can regularisation solve distribution shift?**  
Not by itself. It may reduce overfitting but cannot guarantee performance under a changed deployment distribution.

## 15. Practice

### Paper exercises
1. A model's training loss decreases each epoch while validation loss begins increasing after epoch 12. What should you do?
2. Explain the effect of increasing dropout probability.
3. Why can sigmoid activations contribute to vanishing gradients?
4. Compare L1 and L2 penalties.
5. Explain how gradient clipping changes an update.

### Coding exercise
Train the same MLP under:
- No explicit regularisation.
- L2 weight decay.
- Dropout.
- Early stopping.
- A combination of selected methods.

Plot training and validation loss. Compare final test performance only after model choices are complete.

## 16. Quick Revision

- Underfitting: model fails to capture patterns.
- Overfitting: model memorises training-specific structure.
- Generalisation: performance on unseen deployment-like data.
- L1: sparse parameter penalty.
- L2: squared-weight penalty / shrinkage.
- Early stopping: stop based on validation.
- Dropout: random activation masking during training.
- Vanishing gradient: gradients become too small.
- Exploding gradient: gradients become too large.
- Gradient clipping: limits gradient norm/value.

## 17. Final Checklist

- [ ] Interpret training and validation curves.
- [ ] Explain generalisation vs memorisation.
- [ ] Implement L1 and L2-style regularisation.
- [ ] Explain early stopping and checkpoint restoration.
- [ ] Explain dropout train/eval behaviour.
- [ ] Diagnose vanishing gradients.
- [ ] Diagnose exploding gradients.
- [ ] Use gradient clipping correctly.
- [ ] Explain why regularisation does not solve every distribution shift.

## 18. Recommended Resources

- [CampusX 100 Days of Deep Learning — Days 20–26](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn)
- [CampusX 100 Days of Deep Learning — course page and notes](https://learnwith.campusx.in/courses/100-Days-of-Deep-Learning-YouTube-6818549cc1a70a79d992169f)
- [IIT Madras CS7015 / CS6910 — Deep Learning](https://cse.iitm.ac.in/~miteshk/CS6910.html)
- [Understanding Deep Learning — Simon Prince](https://udlbook.github.io/udlbook/)
