# Days 19–22 — Initialization, Normalization + Optimization

## 1. Overview

A neural network can have the right architecture and loss function but still train poorly if weights are initialised badly, activations have unstable scales, or the optimiser uses unsuitable hyperparameters.

This block covers:
- Zero, random, Xavier, and Kaiming initialisation
- Batch Normalization and Layer Normalization
- Learning rate and optimisation dynamics
- Momentum and Nesterov Accelerated Gradient (NAG)
- AdaGrad, RMSProp, and Adam
- Hyperparameter tuning
- Double descent intuition

## 2. Why Weight Initialisation Matters

Initialisation sets the starting values of learnable parameters.

Good initialisation should help:
- Break symmetry between neurons.
- Keep activations in a useful range.
- Keep gradients from shrinking or growing too rapidly.
- Make optimisation stable at the beginning of training.

## 3. Zero Initialisation

If all weights in a layer are initialised to zero, neurons in that layer receive identical gradients and remain identical under symmetric updates.

They therefore fail to learn distinct features.

Biases can often start at zero, but weights in a hidden layer generally need a symmetry-breaking initialisation.

## 4. Random Initialisation

Small random values break symmetry, but their scale matters.

- Values too small can shrink signals and gradients.
- Values too large can create exploding activations or unstable gradients.
- The suitable scale depends on the activation and layer fan-in/fan-out.

## 5. Xavier / Glorot Initialisation

Xavier initialisation aims to maintain signal variance across layers, commonly for tanh-like or approximately symmetric activations.

A common uniform form is:

\[
W\sim U\left(-\sqrt{\frac{6}{fan_{in}+fan_{out}}},
\sqrt{\frac{6}{fan_{in}+fan_{out}}}\right)
\]

A common normal form has variance approximately:

\[
Var(W)=\frac{2}{fan_{in}+fan_{out}}
\]

The exact derivation depends on assumptions about activation and input statistics.

## 6. Kaiming / He Initialisation

Kaiming initialisation is designed for ReLU-family activations, accounting for the fact that ReLU sets negative activations to zero.

A common normal form:

\[
Var(W)=\frac{2}{fan_{in}}
\]

A common uniform form uses bounds based on \(\sqrt{6/fan_{in}}\), with details depending on the selected mode and nonlinearity parameter.

In PyTorch:

```python
import torch.nn as nn

linear = nn.Linear(128, 64)
nn.init.kaiming_normal_(linear.weight, nonlinearity="relu")
nn.init.zeros_(linear.bias)
```

## 7. Xavier vs Kaiming

| Method | Typical activation context | Main aim |
|---|---|---|
| Xavier / Glorot | Tanh and approximately symmetric activations | Balance forward and backward variance |
| Kaiming / He | ReLU and related activations | Account for rectification and preserve variance |

Use an initialisation appropriate to the architecture and activation. Modern layers may already apply suitable defaults, but understand what they do.

## 8. Normalization: Why It Helps

During training, activation distributions and scales can change as earlier parameters update.

Normalization layers transform activations using estimated or per-example statistics and learnable scale/shift parameters in many implementations.

Potential benefits:
- More stable optimisation.
- Better-conditioned activations.
- Sometimes faster convergence.
- Sometimes useful regularisation effects.

Normalization is not a substitute for good data preprocessing, correct initialisation, or a suitable learning rate.

## 9. Batch Normalization

Batch Normalization normalises each feature/channel using mini-batch statistics during training:

\[
\hat x=\frac{x-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}
\]

Then applies learnable scale and shift:

\[
y=\gamma\hat x+\beta
\]

During evaluation, BatchNorm typically uses running estimates collected during training.

Important:
- Training and evaluation behaviour differ.
- Very small or unrepresentative batches can make estimates noisy.
- BatchNorm placement depends on architecture.
- BatchNorm tracks running statistics in common configurations.

## 10. Layer Normalization

Layer Normalization computes mean and variance across the feature dimensions of an individual example, rather than across the batch.

For a feature vector:

\[
\hat x=\frac{x-\mu_{features}}{\sqrt{\sigma_{features}^2+\epsilon}}
\]

It then applies learnable scale and shift.

LayerNorm:
- Does not depend on other examples in the batch.
- Uses consistent per-example normalisation in training and evaluation.
- Is widely used in Transformer architectures.

## 11. BatchNorm vs LayerNorm

| Property | BatchNorm | LayerNorm |
|---|---|---|
| Statistics | Across batch for each feature/channel | Across features within each example |
| Batch-size dependence | Yes | No |
| Running statistics | Commonly used | Not required |
| Common contexts | CNNs and many feed-forward networks | Transformers and sequence models |
| Train/eval behaviour | Different due to batch vs running stats | Generally same normalisation rule |

The exact axes normalised depend on tensor layout and implementation.

## 12. Learning Rate

The learning rate controls the size of an optimiser's update.

- Too high: overshooting, oscillation, divergence.
- Too low: slow progress and possibly stopping at a poor practical point.
- Suitable: stable reduction in training objective with useful validation performance.

Learning-rate schedules change the rate during training:
- Step decay.
- Exponential decay.
- Cosine decay.
- Warmup followed by decay.
- Reduce-on-plateau.

Choose schedules based on model, dataset, batch size, and training budget.

## 13. Momentum

Momentum accumulates a moving direction from past gradients.

One common form:

\[
v_t=\beta v_{t-1}+g_t
\]

\[
\theta_{t+1}=\theta_t-\eta v_t
\]

where \(g_t\) is the current gradient and \(\beta\) controls momentum.

Momentum can smooth noisy updates and accelerate progress along consistent directions.

## 14. Nesterov Accelerated Gradient (NAG)

NAG computes a gradient at a look-ahead parameter position, anticipating where momentum is moving.

Intuition:
1. Consider the position after the momentum direction.
2. Evaluate the gradient there.
3. Use that gradient to adjust the update.

NAG can improve responsiveness compared with a basic momentum update, depending on the problem. Exact implementation equations vary with the chosen convention.

## 15. Adaptive Optimisers

### AdaGrad

Accumulates squared gradients and scales each parameter's learning rate inversely to the square root of accumulated history.

Benefit:
- Larger updates for parameters with infrequent/small gradients and smaller updates for frequently updated/high-gradient parameters.

Limitation:
- Accumulated squared gradients keep growing, so effective learning rates can become very small.

### RMSProp

Uses an exponentially moving average of squared gradients rather than an ever-growing sum.

This helps prevent the learning rate from shrinking indefinitely.

### Adam

Combines:
- Momentum-like first moment of gradients.
- Adaptive second moment of squared gradients.
- Bias correction for initial moment estimates.

Conceptually:

\[
m_t=\beta_1m_{t-1}+(1-\beta_1)g_t
\]

\[
v_t=\beta_2v_{t-1}+(1-\beta_2)g_t^2
\]

After bias correction, Adam updates parameters using the first moment divided by the square root of the second moment plus a small stabilising constant.

### AdamW

AdamW decouples weight decay from Adam's adaptive gradient update. It is commonly preferred when explicit weight decay is desired with Adam-like optimisation.

## 16. Optimiser Comparison

| Optimiser | Main idea | Watch-outs |
|---|---|---|
| SGD | Current mini-batch gradient | Can need careful learning-rate tuning |
| Momentum | Smooths updates using gradient history | Momentum coefficient matters |
| NAG | Look-ahead momentum | Implementation conventions differ |
| AdaGrad | Per-parameter accumulated squared gradients | Effective rate can decay too much |
| RMSProp | Moving average of squared gradients | Requires decay and learning-rate choices |
| Adam | First and second moment estimates | May not always generalise better than SGD |
| AdamW | Adam with decoupled weight decay | Weight decay still needs tuning |

No optimiser is universally best. Compare on validation performance and training stability.

## 17. Hyperparameter Tuning

Important deep-learning hyperparameters include:
- Learning rate.
- Batch size.
- Weight decay.
- Dropout probability.
- Hidden width/depth.
- Optimiser and its parameters.
- Learning-rate schedule.
- Number of epochs.
- Normalization and initialisation choices.

A practical tuning order:
1. Verify data, labels, loss, and shapes.
2. Overfit a tiny batch to verify the model can learn.
3. Establish a baseline with a standard optimiser and initialisation.
4. Tune learning rate first.
5. Tune batch size and regularisation.
6. Tune architecture after the training process is stable.
7. Use validation data and track compute budget.
8. Keep the final test set untouched.

Use random or Bayesian search when the search space is broad. Record all seeds and configurations.

## 18. Double Descent Intuition

The classical bias–variance intuition often suggests that test error first decreases as model capacity increases, then rises due to overfitting.

In some modern settings, test error can show a second decline after a peak as model capacity continues increasing. This pattern is called **double descent**.

Intuition:
- Under-parameterised regime: model may not fit the training data well.
- Interpolation threshold: model first becomes capable of fitting training examples; generalisation can be unstable.
- Highly over-parameterised regime: further capacity and optimisation may sometimes improve generalisation again.

Double descent is an observed phenomenon under specific settings, not a universal guarantee that making a network larger will improve test performance.

## 19. PyTorch Examples

### Initialisation

```python
import torch.nn as nn

layer = nn.Linear(128, 64)
nn.init.xavier_uniform_(layer.weight)
nn.init.zeros_(layer.bias)
```

For ReLU:

```python
nn.init.kaiming_normal_(layer.weight, nonlinearity="relu")
```

### Normalization layers

```python
batch_norm = nn.BatchNorm1d(num_features=64)
layer_norm = nn.LayerNorm(normalized_shape=64)
```

For a 2D batch input `(B, 64)`, both examples accept the feature dimension shown. CNN BatchNorm commonly uses `BatchNorm2d(C)` with input `(B, C, H, W)`.

### Optimisers

```python
optimizer_sgd = torch.optim.SGD(
    model.parameters(), lr=0.01, momentum=0.9, nesterov=True
)

optimizer_adam = torch.optim.Adam(
    model.parameters(), lr=1e-3
)

optimizer_adamw = torch.optim.AdamW(
    model.parameters(), lr=1e-3, weight_decay=1e-4
)
```

Nesterov requires momentum in the SGD configuration.

## 20. Common Mistakes

- Initialising all weights to zero.
- Using Kaiming blindly with every activation.
- Assuming BatchNorm and LayerNorm normalise the same axes.
- Forgetting that BatchNorm behaves differently in train/eval mode.
- Increasing learning rate when loss is already unstable.
- Assuming Adam is always superior to SGD.
- Confusing Adam weight decay and classic L2 penalty.
- Tuning many parameters simultaneously without a baseline.
- Treating double descent as a universal law.

## 21. Placement and Interview Questions

**Q1. Why is zero initialisation bad for hidden weights?**  
It preserves symmetry, causing neurons to receive identical updates and learn the same features.

**Q2. Xavier vs Kaiming?**  
Xavier is commonly suited to symmetric activations such as tanh; Kaiming is designed for ReLU-family activations.

**Q3. BatchNorm vs LayerNorm?**  
BatchNorm uses batch statistics per feature/channel; LayerNorm normalises feature dimensions within each example.

**Q4. What is momentum?**  
A moving accumulation of gradients that smooths and accelerates updates.

**Q5. What distinguishes AdaGrad and RMSProp?**  
AdaGrad accumulates squared gradients indefinitely; RMSProp uses a moving average.

**Q6. What does Adam combine?**  
Momentum-like first moments and adaptive second moments, with bias correction.

**Q7. What is AdamW?**  
An Adam variant with decoupled weight decay.

**Q8. What is double descent?**  
A possible pattern where test error decreases, rises near an interpolation threshold, and then decreases again with further model capacity.

## 22. Practice

### Paper exercises
1. Explain why zero initialisation makes neurons in a layer symmetric.
2. For a dense layer with `fan_in=100` and `fan_out=50`, write the Xavier uniform bounds.
3. Compare the statistics used by BatchNorm and LayerNorm.
4. Explain why AdaGrad's effective learning rate may become very small.
5. Describe the two moments used by Adam.
6. Sketch a conceptual double-descent test-error curve and label the interpolation region.

### Coding exercise
Train the same small network with:
- Xavier + tanh.
- Kaiming + ReLU.
- SGD with momentum.
- Adam.
- AdamW with weight decay.
- BatchNorm vs LayerNorm.

Track training/validation loss, gradient norms, and runtime. Change one major factor at a time.

## 23. Quick Revision

- Initialisation: starting parameter values.
- Zero weights: symmetry problem.
- Xavier: commonly tanh-like activations.
- Kaiming: commonly ReLU-family activations.
- BatchNorm: batch/channel statistics.
- LayerNorm: per-example feature statistics.
- Momentum: moving gradient direction.
- NAG: look-ahead momentum.
- AdaGrad: accumulated squared gradients.
- RMSProp: moving average of squared gradients.
- Adam: first + second moments.
- AdamW: decoupled weight decay.
- Double descent: possible second drop in test error with increasing capacity.

## 24. Final Checklist

- [ ] Explain why weight initialisation matters.
- [ ] Compare zero, random, Xavier, and Kaiming initialisation.
- [ ] Explain BatchNorm and LayerNorm axes and behaviour.
- [ ] Interpret learning-rate failures.
- [ ] Explain momentum and NAG.
- [ ] Compare AdaGrad, RMSProp, Adam, and AdamW.
- [ ] Plan a controlled hyperparameter search.
- [ ] Explain double descent without overgeneralising it.

## 25. Recommended Resources

- [CampusX 100 Days of Deep Learning — Days 27–39](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn)
- [Understanding Deep Learning — Simon Prince](https://udlbook.github.io/udlbook/)
- [IIT Madras CS7015 / CS6910 — Deep Learning](https://cse.iitm.ac.in/~miteshk/CS6910.html)
- [PyTorch — Weight Initialisation](https://docs.pytorch.org/docs/stable/nn.init.html)
- [PyTorch — Optimisers](https://docs.pytorch.org/docs/stable/optim.html)
