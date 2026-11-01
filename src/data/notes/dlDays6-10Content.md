# Days 6–10 — Neural Network Basics

## 1. Overview

Neural networks learn a mapping from inputs to outputs by composing weighted transformations and nonlinear activation functions.

This block covers:
- The perceptron and its limitations
- Why a single perceptron cannot solve XOR
- Shallow neural networks and multilayer perceptrons (MLPs)
- Activation functions
- Forward propagation and tensor shapes
- Building a basic neural network with PyTorch

## 2. From a Linear Model to a Perceptron

A perceptron computes a weighted sum:

\[
z=w^Tx+b
\]

Then applies a step activation:

\[
\hat y =
\begin{cases}
1 & z\geq0\\
0 & z<0
\end{cases}
\]

The weights determine the orientation of a linear decision boundary; the bias shifts it.

A single perceptron can solve linearly separable binary classification problems.

## 3. The XOR Problem

XOR returns 1 when its two binary inputs differ.

| x1 | x2 | XOR |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

The positive points `(0,1)` and `(1,0)` cannot be separated from the negative points `(0,0)` and `(1,1)` by one straight line.

Therefore a single linear perceptron cannot represent XOR.

A network with a hidden layer and nonlinear activations can build a nonlinear decision boundary.

## 4. Shallow Neural Network

A shallow network typically contains:
- An input layer.
- One hidden layer.
- An output layer.

The hidden layer computes:

\[
h=f(W_1x+b_1)
\]

The output layer computes:

\[
\hat y=g(W_2h+b_2)
\]

Here \(f\) and \(g\) are activation functions chosen for the task.

The hidden layer creates intermediate representations. The nonlinear activation is essential: stacking only linear transformations remains equivalent to one linear transformation.

## 5. Multilayer Perceptron (MLP)

An MLP is a feed-forward neural network formed from fully connected layers.

For layer \(l\):

\[
z^{(l)}=W^{(l)}a^{(l-1)}+b^{(l)}
\]

\[
a^{(l)}=f^{(l)}(z^{(l)})
\]

The output of one layer becomes the input to the next.

For batch-first tensors:
- Input: `(batch_size, input_features)`.
- Hidden output: `(batch_size, hidden_units)`.
- Class logits: `(batch_size, number_of_classes)`.

## 6. Activation Functions

Activation functions introduce nonlinearity.

### Sigmoid

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

- Output range: (0, 1).
- Useful for a binary probability output when paired with the correct loss.
- Can saturate for large positive/negative inputs and produce small gradients.

### Tanh

\[
\tanh(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}
\]

- Output range: (-1, 1).
- Zero-centred.
- Can also saturate and produce small gradients.

### ReLU

\[
ReLU(z)=\max(0,z)
\]

- Simple and computationally efficient.
- Common in hidden layers.
- Can produce inactive units for inputs that remain negative.

### Leaky ReLU

\[
f(z)=\max(\alpha z,z)
\]

Allows a small negative-side slope.

### GELU

A smooth activation used in many modern architectures, especially Transformer models. It weights inputs by a smooth approximation related to the Gaussian cumulative distribution.

### Softmax

For class logits \(z_i\):

\[
softmax(z_i)=\frac{e^{z_i}}{\sum_j e^{z_j}}
\]

It creates a categorical probability distribution.

### Practical choice

| Location | Common choice |
|---|---|
| Hidden layers | ReLU, GELU, sometimes Leaky ReLU |
| Binary output | One logit with BCEWithLogitsLoss, or sigmoid probability with BCELoss |
| Multiclass output | Raw logits with CrossEntropyLoss; softmax mainly for inference/probability display |
| Regression output | Often linear output |

## 7. Forward Propagation

Forward propagation computes a model's prediction from input to output.

1. Pass input features to the first layer.
2. Multiply by weights and add bias.
3. Apply activation.
4. Pass activations through subsequent layers.
5. Produce output logits or values.

The forward pass does not by itself update weights. Weight updates happen during training after loss calculation and gradient-based optimisation.

## 8. PyTorch Tensor Basics

```python
import torch

x = torch.tensor([[1.0, 2.0], [3.0, 4.0]])
print(x.shape)       # torch.Size([2, 2])
print(x.dtype)       # typically torch.float32
print(x.device)      # CPU unless moved
print(x.mean())
```

### Shape operations

```python
x = torch.randn(32, 10)

print(x.shape)       # (32, 10)
print(x.reshape(32, 5, 2).shape)
print(x.unsqueeze(1).shape)
```

`reshape`, `view`, `unsqueeze`, and `squeeze` change tensor shape. Know which axis you are adding or removing.

### Device

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
x = x.to(device)
```

The model and input tensors must be on compatible devices.

## 9. Build an MLP with PyTorch

```python
import torch
from torch import nn

class MLP(nn.Module):
    def __init__(self, input_features: int, hidden_units: int, num_classes: int):
        super().__init__()
        self.network = nn.Sequential(
            nn.Linear(input_features, hidden_units),
            nn.ReLU(),
            nn.Linear(hidden_units, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.network(x)

model = MLP(
    input_features=10,
    hidden_units=32,
    num_classes=3
)

x = torch.randn(8, 10)
logits = model(x)
print(logits.shape)  # (8, 3)
```

`nn.Linear(in_features, out_features)` applies an affine transformation. For a batch input `(B, in_features)`, it returns `(B, out_features)`.

## 10. Understand the Output and Loss Contract

For multiclass classification:
- Model output: raw logits with shape `(B, C)`.
- Target: integer class indices with shape `(B,)`.
- Loss: `nn.CrossEntropyLoss()`.

```python
targets = torch.randint(0, 3, (8,))
criterion = nn.CrossEntropyLoss()
loss = criterion(logits, targets)
```

Do not apply softmax before `CrossEntropyLoss`; it combines the relevant log-softmax and negative log-likelihood operations in a numerically stable way.

For binary classification:
- A common model returns one raw logit per example.
- Use `BCEWithLogitsLoss` with float targets of matching shape.
- Apply sigmoid only when probabilities are needed for interpretation/inference.

## 11. A First PyTorch Training Step

This is a minimal view of the training operations. A complete reusable training loop is covered in the next block.

```python
import torch
from torch import nn

model = MLP(input_features=10, hidden_units=32, num_classes=3)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)

x = torch.randn(8, 10)
y = torch.randint(0, 3, (8,))

optimizer.zero_grad()
logits = model(x)
loss = criterion(logits, y)
loss.backward()
optimizer.step()
```

The next lecture explains what `backward()` calculates and how the optimiser uses gradients.

## 12. Common Mistakes

- Expecting a single perceptron to solve XOR.
- Stacking linear layers without nonlinear activations.
- Applying softmax before CrossEntropyLoss.
- Passing one-hot targets when the configured loss expects class indices.
- Confusing logits with probabilities.
- Mixing CPU and GPU tensors.
- Ignoring batch dimensions.
- Forgetting to initialise an `nn.Module` parent with `super().__init__()`.
- Forgetting that the forward pass does not update weights.

## 13. Placement and Interview Questions

**Q1. What is a perceptron?**  
A linear weighted sum followed by an activation, historically used for binary classification.

**Q2. Why can't one perceptron solve XOR?**  
XOR classes are not linearly separable.

**Q3. Why do neural networks need nonlinear activations?**  
Without nonlinearities, a composition of linear layers remains linear and cannot represent general nonlinear mappings.

**Q4. What is an MLP?**  
A feed-forward network with fully connected layers and nonlinear activations.

**Q5. Sigmoid vs ReLU?**  
Sigmoid maps to (0,1) and can saturate; ReLU is zero for negative inputs and linear for positive inputs, and is common in hidden layers.

**Q6. What are logits?**  
Raw model scores before probability normalisation.

**Q7. What does nn.Linear do?**  
It applies a learned affine transformation to the last input dimension.

**Q8. Why use CrossEntropyLoss with raw logits?**  
It computes a numerically stable log-softmax and negative log-likelihood objective internally.

## 14. Practice

### Paper exercises
1. Draw the XOR input points and explain why no single straight line separates the classes.
2. Write the forward equations for an MLP with two inputs, two hidden units, and one output.
3. State the output shape for batch size 64, 20 input features, and 5 output classes.
4. Explain why two linear layers without activation are equivalent to one linear transformation.

### Coding exercise
Use PyTorch to:
- Create a small synthetic XOR dataset.
- Train a single linear model and observe its limitation.
- Train an MLP with a hidden layer and nonlinear activation.
- Inspect logits and probabilities.
- Compare loss and accuracy.

## 15. Quick Revision

- Perceptron: weighted sum + activation.
- XOR: not linearly separable.
- Hidden layer: learns intermediate representations.
- MLP: stack of fully connected layers.
- Activation: introduces nonlinearity.
- Forward propagation: input to model output.
- Logits: unnormalised class scores.
- `nn.Module`: base class for PyTorch models.
- `nn.Linear`: affine transformation.
- `CrossEntropyLoss`: raw multiclass logits + integer labels.

## 16. Final Checklist

- [ ] Explain the perceptron.
- [ ] Explain why XOR requires a nonlinear model.
- [ ] Write MLP forward equations.
- [ ] Compare sigmoid, tanh, ReLU, Leaky ReLU, and GELU.
- [ ] Track tensor shapes through layers.
- [ ] Build an MLP using `nn.Module`.
- [ ] Match logits and target shapes to the loss function.
- [ ] Run a basic PyTorch training step.

## 17. Recommended Resources

- [CampusX 100 Days of Deep Learning — Days 2–13](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn)
- [CampusX course page](https://learnwith.campusx.in/courses/100-Days-of-Deep-Learning-YouTube-6818549cc1a70a79d992169f)
- [Sachin Soni — PyTorch Neural Networks](https://www.youtube.com/results?search_query=Sachin+Soni+PyTorch+Neural+Networks)
- [MIT 6.S191 YouTube / course materials](https://introtodeeplearning.com/2025/index.html)
- [PyTorch — Build the Neural Network](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html)
