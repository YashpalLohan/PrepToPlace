# Days 17–20 — Neural Network Foundation

## 1. Overview

Neural networks learn complex input–output mappings by composing layers of learnable transformations and nonlinear activation functions.

This block covers:
- Perceptron.
- Activation functions.
- Feed-forward networks.
- Multi-Layer Perceptron (MLP).
- Forward propagation.
- Backpropagation intuition.
- Neural-network foundation for modern LLMs and Generative AI.

## 2. Perceptron

A perceptron calculates a weighted sum plus bias:

\[
z=w^Tx+b
\]

A step activation converts the score into a binary output.

\[
\hat y=
\begin{cases}
1,&z\geq0\\
0,&z<0
\end{cases}
\]

The perceptron learns a linear decision boundary.

## 3. Why One Perceptron Is Limited

A single perceptron can solve linearly separable problems, but not every classification pattern.

### XOR example

| x1 | x2 | XOR |
|---:|---:|---:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

No single straight line separates the positive and negative points.

A hidden layer with nonlinear activations allows the network to construct a more complex decision boundary.

## 4. Feed-Forward Neural Network

A feed-forward network passes information from input to output without recurrent feedback loops.

Typical structure:
- Input layer.
- One or more hidden layers.
- Output layer.

Each layer transforms its input, and the output of one layer becomes the next layer's input.

## 5. Multi-Layer Perceptron (MLP)

For layer \(l\):

\[
z^{(l)}=W^{(l)}a^{(l-1)}+b^{(l)}
\]

\[
a^{(l)}=f(z^{(l)})
\]

where:
- \(W^{(l)}\): learned weights.
- \(b^{(l)}\): learned bias.
- \(f\): activation.
- \(a^{(l)}\): layer output.

A stack of linear layers without nonlinear activations is still equivalent to one linear transformation. Nonlinear activation functions allow MLPs to represent nonlinear relationships.

## 6. Activation Functions

### Sigmoid

\[
\sigma(z)=\frac{1}{1+e^{-z}}
\]

Range: (0,1). Often used to turn a binary logit into a probability at inference. It can saturate and lead to small gradients.

### Tanh

\[
tanh(z)=\frac{e^z-e^{-z}}{e^z+e^{-z}}
\]

Range: (-1,1). Zero-centred but also saturates.

### ReLU

\[
ReLU(z)=\max(0,z)
\]

Common in hidden layers. Efficient, but neurons can become inactive for negative inputs.

### Leaky ReLU

\[
f(z)=\max(\alpha z,z)
\]

Keeps a small gradient for negative inputs.

### GELU

A smooth activation used in many Transformer architectures. It softly weights inputs instead of applying a hard zero cutoff.

### Softmax

\[
p_i=\frac{e^{z_i}}{\sum_j e^{z_j}}
\]

Converts multiclass logits into probabilities that sum to one.

## 7. Activation Selection

| Model location | Common choice |
|---|---|
| Hidden layers in basic MLP | ReLU |
| Transformer feed-forward blocks | GELU or architecture-specific alternatives |
| Binary classification output | One logit + BCEWithLogitsLoss |
| Multiclass classification output | Raw logits + CrossEntropyLoss |
| Regression output | Often linear output |

Do not apply softmax before PyTorch `CrossEntropyLoss`; it expects raw logits.

## 8. Forward Propagation

Forward propagation calculates output from input:

1. Input feature vector enters the first layer.
2. Multiply by weight matrix.
3. Add bias.
4. Apply activation.
5. Pass output to the next layer.
6. Produce logits or predictions.

The forward pass calculates predictions; it does not update weights by itself.

## 9. Backpropagation Intuition

Training uses the loss to determine how model parameters should change.

Backpropagation applies the chain rule from the output back through the network.

For a composite function:

\[
y=f(g(x))
\]

\[
\frac{dy}{dx}=\frac{df}{dg}\frac{dg}{dx}
\]

The network reuses intermediate derivatives to calculate loss gradients for its weights and biases.

## 10. Simple Neuron Gradient

Suppose:

\[
\hat y=wx+b
\]

and:

\[
L=\frac12(\hat y-y)^2
\]

Then:

\[
\frac{\partial L}{\partial w}=(\hat y-y)x
\]

\[
\frac{\partial L}{\partial b}=\hat y-y
\]

The gradients tell us how the loss changes locally as each parameter changes.

## 11. Gradient Descent

A basic parameter update is:

\[
\theta_{new}=\theta_{old}-\eta\nabla_\theta L
\]

where \(\eta\) is the learning rate.

- Too large: updates may overshoot or diverge.
- Too small: training can be slow.
- Suitable: loss decreases stably and validation performance improves.

Backpropagation computes the gradients; the optimiser uses them to update parameters.

## 12. PyTorch MLP Example

```python
import torch
from torch import nn

class MLP(nn.Module):
    def __init__(self, input_features: int, hidden_units: int, num_classes: int):
        super().__init__()
        self.layers = nn.Sequential(
            nn.Linear(input_features, hidden_units),
            nn.ReLU(),
            nn.Linear(hidden_units, num_classes)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.layers(x)

model = MLP(input_features=10, hidden_units=32, num_classes=3)

x = torch.randn(8, 10)
logits = model(x)

print(logits.shape)  # (8, 3)
```

The batch dimension is 8, the input feature count is 10, and the model returns 3 class logits per example.

## 13. Loss and Training Step

```python
import torch
from torch import nn

model = MLP(10, 32, 3)
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

x = torch.randn(8, 10)
y = torch.randint(0, 3, (8,))

optimizer.zero_grad()
logits = model(x)
loss = criterion(logits, y)
loss.backward()
optimizer.step()
```

Sequence:
1. `zero_grad()` clears old gradients.
2. Forward pass calculates logits.
3. Loss compares logits with target.
4. `backward()` calculates gradients.
5. `step()` updates parameters.

## 14. Why Neural Networks Matter for GenAI

Modern Generative AI models are built from neural-network components:
- Embedding layers map tokens to vectors.
- Attention layers mix information between tokens.
- Feed-forward layers transform hidden representations.
- Normalisation layers help stabilise computation.
- Output heads produce next-token or other task-specific predictions.

A Transformer LLM is much more complex than a basic MLP, but the foundations of parameters, tensors, forward propagation, losses, and gradients remain relevant.

## 15. Common Mistakes

- Expecting a single perceptron to solve XOR.
- Stacking only linear transformations.
- Confusing logits and probabilities.
- Applying softmax before CrossEntropyLoss.
- Forgetting to clear gradients.
- Assuming `backward()` updates weights.
- Ignoring tensor shapes.
- Using a linear output for classification without an appropriate probabilistic/loss setup.

## 16. Placement and Interview Questions

**Q1. What is a perceptron?**  
A weighted sum and bias followed by an activation.

**Q2. Why does XOR need a hidden layer?**  
XOR is not linearly separable.

**Q3. What is an MLP?**  
A feed-forward network with multiple fully connected layers and nonlinear activations.

**Q4. Why do we need activation functions?**  
Without nonlinear activations, stacked linear layers collapse into one linear transformation.

**Q5. What is forward propagation?**  
Calculating model outputs by passing inputs through the network.

**Q6. What is backpropagation?**  
Using the chain rule to compute gradients of loss with respect to network parameters.

**Q7. Does `loss.backward()` update weights?**  
No. It computes gradients; the optimiser's `step()` updates parameters.

**Q8. What are logits?**  
Raw model scores before probability normalisation.

## 17. Practice

### Paper exercises
1. Draw a perceptron and label weights, bias, and activation.
2. Explain XOR's non-linearity.
3. Write the equations for a two-layer MLP.
4. Calculate output shape for batch size 16, input width 20, hidden width 64, and 4 classes.
5. Explain the sequence `zero_grad → forward → loss → backward → step`.

### Coding exercise
Train an MLP on a small classification dataset:
- Compare a linear model against a hidden-layer MLP.
- Plot training and validation loss.
- Inspect class probabilities.
- Change activation and hidden width.
- Explain which change improved validation performance.

## 18. Quick Revision

- Perceptron: weighted sum + activation.
- XOR: not linearly separable.
- MLP: stack of nonlinear layers.
- Sigmoid: binary probability mapping.
- ReLU: common hidden activation.
- GELU: smooth activation used in Transformers.
- Forward: compute prediction.
- Loss: measure error.
- Backprop: compute gradients.
- Optimiser: update parameters.
- LLMs: use embeddings, attention, feed-forward layers, and output heads.

## 19. Final Checklist

- [ ] Explain the perceptron and XOR limitation.
- [ ] Compare major activation functions.
- [ ] Write MLP forward equations.
- [ ] Track tensor dimensions.
- [ ] Explain forward propagation.
- [ ] Explain backpropagation and the chain rule.
- [ ] Implement a PyTorch MLP.
- [ ] Explain the basic training-step sequence.
- [ ] Connect neural-network foundations to LLM components.

## 20. Recommended Resources

- [DeepLearning.AI — Neural Networks and Deep Learning](https://www.deeplearning.ai/courses/neural-networks-and-deep-learning/)
- [Hugging Face LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- [PyTorch — Build the Neural Network](https://docs.pytorch.org/tutorials/beginner/basics/buildmodel_tutorial.html)
- [PyTorch — Autograd Mechanics](https://docs.pytorch.org/docs/stable/notes/autograd.html)
