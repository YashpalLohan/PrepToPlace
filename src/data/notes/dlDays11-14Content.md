# Days 11–14 — Loss, Backpropagation + Gradient Descent

## 1. Overview

A neural network learns by comparing predictions with targets, calculating a loss, finding how each parameter contributed to that loss, and updating parameters to reduce future loss.

This block covers:
- Loss functions for regression and classification
- Computation graphs and the chain rule
- Backpropagation intuition and a worked example
- Gradient descent, SGD, and mini-batch gradient descent
- PyTorch autograd
- A reusable training and evaluation loop

## 2. What Is a Loss Function?

A loss function quantifies how wrong a model's prediction is for an example or batch.

The training objective often minimises average loss:

\[
J(\theta)=\frac{1}{N}\sum_{i=1}^{N}L(f_\theta(x_i),y_i)
\]

where \(\theta\) represents the model parameters.

Loss is not the same as every evaluation metric. For example, cross-entropy is differentiable and useful for training classification models, while accuracy is often used for evaluation but is not a smooth optimisation objective.

## 3. Common Loss Functions

### Mean Squared Error (MSE)

For regression:

\[
MSE=\frac{1}{N}\sum_{i=1}^{N}(y_i-\hat y_i)^2
\]

Large errors receive a quadratic penalty. MSE is sensitive to outliers.

### Mean Absolute Error (MAE)

\[
MAE=\frac{1}{N}\sum_{i=1}^{N}|y_i-\hat y_i|
\]

MAE grows linearly with error magnitude and is less sensitive to large outliers than MSE.

### Binary Cross-Entropy (BCE)

For target \(y\in\{0,1\}\) and predicted probability \(p\):

\[
L=-[y\log p+(1-y)\log(1-p)]
\]

In PyTorch, `BCEWithLogitsLoss` is generally preferred when the model outputs raw logits because it combines sigmoid and BCE in a numerically stable way.

### Multiclass Cross-Entropy

For a one-hot target distribution \(y\) and predicted probabilities \(p\):

\[
L=-\sum_{k=1}^{C}y_k\log p_k
\]

For one-hot targets, this is \(-\log p_{\text{correct}}\).

PyTorch `CrossEntropyLoss` expects raw logits and usually integer class-index targets.

## 4. Computation Graph

A computation graph represents a calculation as connected operations.

For a simple neuron:

```text
Input x
  |
Multiply by w
  |
Add bias b
  |
Activation f
  |
Prediction y_hat
  |
Compare with target y
  |
Loss L
```

During the forward pass, values are computed. During backpropagation, derivatives are propagated backward through the graph.

## 5. The Chain Rule

For a composite function:

\[
y=f(g(x))
\]

the derivative is:

\[
\frac{dy}{dx}=\frac{df}{dg}\frac{dg}{dx}
\]

Neural networks are nested compositions, so the chain rule connects the loss gradient to every parameter.

For a scalar loss \(L\) and intermediate variable \(h\):

\[
\frac{\partial L}{\partial w}
=
\frac{\partial L}{\partial h}
\frac{\partial h}{\partial w}
\]

Backpropagation efficiently reuses intermediate gradients rather than recomputing every derivative independently.

## 6. Worked Backpropagation Example: One Linear Neuron

Let:

\[
\hat y=wx+b
\]

and use a one-example squared error:

\[
L=\frac{1}{2}(\hat y-y)^2
\]

First:

\[
\frac{\partial L}{\partial \hat y}=\hat y-y
\]

Then:

\[
\frac{\partial \hat y}{\partial w}=x,\qquad
\frac{\partial \hat y}{\partial b}=1
\]

By the chain rule:

\[
\frac{\partial L}{\partial w}=(\hat y-y)x
\]

\[
\frac{\partial L}{\partial b}=\hat y-y
\]

These gradients indicate how changing w and b changes the loss locally.

## 7. Backpropagation Through a Multi-Layer Network

For layer \(l\):

\[
z^{(l)}=W^{(l)}a^{(l-1)}+b^{(l)}
\]

\[
a^{(l)}=f(z^{(l)})
\]

Backpropagation computes the error signal for the final layer, then propagates it to previous layers using derivatives of the activation and matrix operations.

For a hidden layer, conceptually:

\[
\delta^{(l)}
=
\left(W^{(l+1)T}\delta^{(l+1)}\right)
\odot f'(z^{(l)})
\]

The exact dimensions depend on the batch and matrix orientation. The expression shows two operations: propagate the downstream gradient through the next layer's weights, then multiply elementwise by the local activation derivative.

## 8. Gradient Descent

Gradient descent updates parameters in the negative direction of the gradient:

\[
\theta_{t+1}=\theta_t-\eta\nabla_\theta J(\theta_t)
\]

where:
- \(\theta\): model parameters.
- \(\eta\): learning rate.
- \(\nabla_\theta J\): gradient of loss with respect to parameters.

The gradient indicates the direction of steepest local increase; moving against it locally decreases the objective for a sufficiently small step.

### Learning rate

- Too small: slow learning.
- Too large: may overshoot, oscillate, or diverge.
- Appropriate: stable progress toward a useful minimum.

## 9. Batch, Stochastic, and Mini-Batch Gradient Descent

| Method | Gradient computed from | Characteristics |
|---|---|---|
| Batch GD | Entire training set | Stable gradient estimate, costly for very large datasets |
| SGD | One example | Noisy updates, frequent updates |
| Mini-batch GD | Small batch | Efficient hardware use and a compromise between stability and update frequency |

Deep learning typically uses mini-batch gradient descent.

An epoch means one pass through the training dataset. An iteration/step usually means one parameter update.

## 10. PyTorch Autograd

PyTorch tracks operations on tensors with `requires_grad=True` and builds a dynamic computation graph.

```python
import torch

w = torch.tensor(2.0, requires_grad=True)
x = torch.tensor(3.0)
y = torch.tensor(10.0)

prediction = w * x
loss = 0.5 * (prediction - y) ** 2

loss.backward()
print(w.grad)
```

Here, \(\hat y=6\), error is \(-4\), and:

\[
\frac{dL}{dw}=(\hat y-y)x=(-4)(3)=-12
\]

`backward()` computes gradients. It does not itself update the parameter.

## 11. Why Clear Gradients?

PyTorch accumulates gradients into `.grad` by default. Therefore, training code clears gradients before the next backward pass.

```python
optimizer.zero_grad()
loss.backward()
optimizer.step()
```

- `zero_grad()`: clears previous gradients.
- `backward()`: computes gradients.
- `step()`: updates parameters using the optimiser.

Skipping gradient clearing can cause gradients from multiple batches to accumulate unintentionally.

## 12. Complete Mini-Batch Training Loop

```python
import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

# X_train: (N, input_features)
# y_train: (N,) integer class labels
dataset = TensorDataset(X_train, y_train)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

model = nn.Sequential(
    nn.Linear(X_train.shape[1], 64),
    nn.ReLU(),
    nn.Linear(64, num_classes)
)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

for epoch in range(10):
    model.train()
    total_loss = 0.0

    for xb, yb in loader:
        optimizer.zero_grad()

        logits = model(xb)
        loss = criterion(logits, yb)

        loss.backward()
        optimizer.step()

        total_loss += loss.item() * xb.size(0)

    epoch_loss = total_loss / len(dataset)
    print(f"Epoch {epoch + 1}: loss={epoch_loss:.4f}")
```

This example assumes tensors already have the correct dtype and are on a compatible device. In a real project, create a validation loop, track metrics, and avoid using the test set for tuning.

## 13. Training vs Evaluation Mode

For models containing dropout or batch normalisation:
- `model.train()` activates training behaviour.
- `model.eval()` activates evaluation behaviour.

Use `torch.no_grad()` or `torch.inference_mode()` during evaluation to avoid recording gradients and reduce overhead.

```python
model.eval()
correct = 0
total = 0

with torch.inference_mode():
    for xb, yb in validation_loader:
        logits = model(xb)
        predictions = logits.argmax(dim=1)
        correct += (predictions == yb).sum().item()
        total += yb.size(0)

accuracy = correct / total
```

## 14. Common Mistakes

- Using accuracy as a differentiable training loss.
- Applying softmax before `CrossEntropyLoss`.
- Forgetting `optimizer.zero_grad()`.
- Assuming `loss.backward()` updates model parameters.
- Forgetting `optimizer.step()`.
- Using the wrong target shape or dtype.
- Evaluating with `model.train()` when dropout or BatchNorm is present.
- Computing validation gradients unnecessarily.
- Confusing epochs with parameter-update iterations.
- Choosing an excessively high learning rate.

## 15. Placement and Interview Questions

**Q1. What is backpropagation?**  
An efficient application of the chain rule that computes loss gradients with respect to parameters from output layers back to earlier layers.

**Q2. What does the gradient represent?**  
The local rate and direction of change of the loss with respect to a parameter.

**Q3. Does backward() update weights?**  
No. It calculates gradients; the optimiser's `step()` updates parameters.

**Q4. Why clear gradients?**  
PyTorch accumulates gradients by default.

**Q5. Batch GD vs SGD vs mini-batch GD?**  
They differ in how many training examples contribute to each gradient update.

**Q6. Why is mini-batch GD common?**  
It balances noisy updates with computational efficiency and hardware parallelism.

**Q7. MSE vs cross-entropy?**  
MSE is common for regression; cross-entropy is common for probabilistic classification.

**Q8. What does the learning rate control?**  
The step size of each gradient-based update.

## 16. Practice

### Paper exercises
1. For \(\hat y=wx+b\), \(x=3\), \(w=2\), \(b=0\), and \(y=10\), calculate prediction and gradients for \(L=\frac12(\hat y-y)^2\).
2. Explain the chain rule for a two-layer network.
3. A dataset has 10,000 examples and batch size 100. How many updates occur in one full epoch if all batches are used?
4. Explain what happens when gradients are not cleared between batches.

### Coding exercise
Build a small PyTorch MLP and:
- Train with mini-batches.
- Log training and validation loss.
- Compare two learning rates.
- Verify a parameter's gradient before and after `backward()`.
- Compare SGD and an adaptive optimiser in a controlled experiment.

## 17. Quick Revision

- Loss: objective measuring prediction error.
- Computation graph: connected operations.
- Chain rule: derivative of composite functions.
- Backpropagation: computes parameter gradients efficiently.
- Gradient descent: update against gradient.
- Learning rate: update step size.
- Batch GD: all examples per update.
- SGD: one example per update.
- Mini-batch GD: subset per update.
- Autograd: automatic differentiation.
- `zero_grad`: clear gradients.
- `backward`: compute gradients.
- `step`: update parameters.

## 18. Final Checklist

- [ ] Select losses appropriate to regression or classification.
- [ ] Explain computation graphs and chain rule.
- [ ] Derive gradients for a simple neuron.
- [ ] Explain backpropagation through hidden layers.
- [ ] Compare batch, stochastic, and mini-batch GD.
- [ ] Use PyTorch autograd.
- [ ] Write a correct training loop.
- [ ] Implement evaluation with `eval()` and inference mode.

## 19. Recommended Resources

- [CampusX 100 Days of Deep Learning — Days 14–19](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn)
- [Sachin Soni — PyTorch Autograd](https://www.youtube.com/results?search_query=Sachin+Soni+PyTorch+Autograd)
- [DeepLearning.AI — Deep Learning Specialization](https://www.deeplearning.ai/specializations/deep-learning/)
- [PyTorch — Autograd Mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html)
