# Days 36–40 — Sequence Modeling

## 1. Overview

Sequence models process ordered data where earlier elements can provide information about later elements.

Examples:
- Text and language.
- Time series and sensor readings.
- Speech and audio frames.
- Event sequences.
- Video frame representations.

This block covers:
- Unfolding recurrent computation graphs
- Vanilla RNNs
- Backpropagation Through Time (BPTT)
- Long-term dependency problems
- Bidirectional RNNs
- LSTM and GRU gated architectures

## 2. Why Sequence Modeling?

A standard feed-forward network processes each input without an inherent memory of previous inputs. Sequence tasks need context.

An RNN maintains a hidden state that carries information across time steps.

At time \(t\):
- Input: \(x_t\).
- Previous state: \(h_{t-1}\).
- New hidden state: \(h_t\).
- Optional output: \(y_t\).

## 3. Vanilla RNN Equations

A simple RNN computes:

\[
h_t=\tanh(W_{xh}x_t+W_{hh}h_{t-1}+b_h)
\]

\[
y_t=W_{hy}h_t+b_y
\]

The same weight matrices are reused at every time step.

The hidden state is a learned summary of the sequence prefix, not a perfect memory of every earlier input.

## 4. Unfolding the Computational Graph

A recurrent network can be represented as one repeating cell or unfolded through time.

```text
h0 → [RNN cell] → h1 → [RNN cell] → h2 → [RNN cell] → h3
          ↑                 ↑                 ↑
          x1                x2                x3
```

Unfolding makes it clear that:
- The same parameters are shared across time.
- Each time step depends on the previous hidden state.
- Gradients from later outputs can affect earlier recurrent computations.

## 5. Sequence Input/Output Patterns

| Pattern | Input | Output | Example |
|---|---|---|---|
| One-to-one | One item | One item | Image classification |
| One-to-many | One item | Sequence | Image captioning |
| Many-to-one | Sequence | One item | Sentiment classification |
| Many-to-many, aligned | Sequence | Sequence | Token-level tagging |
| Many-to-many, unaligned | Input sequence | Output sequence | Translation / sequence generation |

The architecture and output head depend on where and when predictions are required.

## 6. Backpropagation Through Time (BPTT)

BPTT applies the chain rule to the unfolded recurrent graph.

Process:
1. Run the forward pass through all relevant time steps.
2. Calculate loss at one or more output steps.
3. Backpropagate gradients from later steps to earlier steps.
4. Accumulate gradient contributions for shared recurrent parameters.
5. Update the shared parameters.

For a sequence with many time steps, the gradient path can become long.

### Truncated BPTT

Truncated BPTT limits gradient propagation to a finite window of time steps.

Benefits:
- Reduces memory use.
- Reduces computational cost.
- Makes online/streaming training more practical.

Trade-off:
- Gradients cannot directly propagate across the entire sequence beyond the truncation window.

## 7. Vanishing and Exploding Gradients in RNNs

During BPTT, gradients repeatedly multiply through recurrent weights and activation derivatives.

- If repeated factors have magnitudes below one, gradients can shrink exponentially.
- If factors are consistently large, gradients can grow rapidly.

Consequences:
- Vanishing gradients make long-range dependencies difficult to learn.
- Exploding gradients can make training unstable.

Common remedies include gated architectures, careful initialisation, gradient clipping, normalisation/architecture choices, and truncated BPTT where appropriate.

## 8. Long-Term Dependencies

A long-term dependency occurs when an output depends on information from many time steps earlier.

Example:

"The book that the students borrowed from the library **was** missing."

The correct verb depends on the main subject "book", not the nearer plural noun "students".

Vanilla RNNs can struggle to preserve the required information over long sequences due to repeated state updates and gradient propagation.

## 9. Bidirectional RNNs

A bidirectional RNN processes a sequence in:
- Forward direction: left to right.
- Backward direction: right to left.

The two hidden representations are typically concatenated or otherwise combined.

Advantages:
- Each position can use both past and future context.
- Useful for offline sequence labelling where the full sequence is available.

Limitations:
- Cannot directly use future context in strict streaming/causal prediction.
- Usually needs the complete sequence before producing a fully contextual output.

## 10. LSTM: Long Short-Term Memory

LSTM is a gated RNN designed to make long-term information flow easier.

It maintains:
- Hidden state \(h_t\).
- Cell state \(c_t\).

Main gates:
- Input gate: controls new information written.
- Forget gate: controls old cell information retained.
- Output gate: controls what is exposed as hidden state.

A common LSTM formulation:

\[
i_t=\sigma(W_i x_t+U_i h_{t-1}+b_i)
\]

\[
f_t=\sigma(W_f x_t+U_f h_{t-1}+b_f)
\]

\[
g_t=\tanh(W_g x_t+U_g h_{t-1}+b_g)
\]

\[
o_t=\sigma(W_o x_t+U_o h_{t-1}+b_o)
\]

\[
c_t=f_t\odot c_{t-1}+i_t\odot g_t
\]

\[
h_t=o_t\odot\tanh(c_t)
\]

Where \(\sigma\) is sigmoid and \(\odot\) is elementwise multiplication.

## 11. LSTM Gate Intuition

- **Forget gate:** decides what portion of old cell state to retain.
- **Input gate:** decides how much candidate information to write.
- **Candidate state:** proposes new content.
- **Output gate:** decides what part of the cell state becomes visible as hidden state.

The additive cell-state update helps gradients flow more directly than in a plain RNN, although LSTMs do not remove every long-sequence training difficulty.

## 12. GRU: Gated Recurrent Unit

GRU uses a simpler gated design than LSTM.

It typically maintains a hidden state without a separate cell state.

Main gates:
- Reset gate: controls how much previous information contributes to the candidate.
- Update gate: controls how the new state combines candidate information and the previous state.

A common formulation:

\[
r_t=\sigma(W_r x_t+U_r h_{t-1})
\]

\[
z_t=\sigma(W_z x_t+U_z h_{t-1})
\]

\[
\tilde h_t=\tanh(W_hx_t+U_h(r_t\odot h_{t-1}))
\]

\[
h_t=(1-z_t)\odot\tilde h_t+z_t\odot h_{t-1}
\]

Different texts and implementations may use alternative gate conventions or equations. Focus on the information-flow role of each gate.

## 13. LSTM vs GRU vs Vanilla RNN

| Property | Vanilla RNN | LSTM | GRU |
|---|---|---|---|
| State | Hidden state | Hidden + cell state | Hidden state |
| Gates | No | Input, forget, output | Reset, update |
| Long dependencies | Often difficult | Designed to help | Designed to help |
| Parameter count | Usually lower | Usually higher | Often lower than comparable LSTM |
| Complexity | Simple | More complex | Intermediate |

Neither LSTM nor GRU is guaranteed to outperform the other. Compare on the sequence task and deployment constraints.

## 14. PyTorch Sequence Shapes

With `batch_first=True`, common input shape is:

\[
(B,T,F)
\]

where:
- \(B\): batch size.
- \(T\): sequence length.
- \(F\): input features.

For an LSTM or GRU:
- `output` contains the hidden features for each time step.
- `h_n` contains final hidden states.
- LSTM also returns `c_n`, the final cell states.

```python
import torch
from torch import nn

rnn = nn.LSTM(
    input_size=16,
    hidden_size=32,
    num_layers=2,
    batch_first=True,
    bidirectional=True
)

x = torch.randn(8, 20, 16)   # B=8, T=20, F=16
output, (h_n, c_n) = rnn(x)

print(output.shape)  # (8, 20, 64)
print(h_n.shape)     # (4, 8, 32)
print(c_n.shape)     # (4, 8, 32)
```

For a bidirectional model, feature width is typically `2 * hidden_size`. The first dimension of `h_n` is `num_layers * num_directions`.

## 15. Common Mistakes

- Forgetting that RNN weights are shared across time.
- Confusing BPTT with ordinary one-step backpropagation.
- Assuming a bidirectional model works in real-time streaming without future context.
- Mixing sequence length and feature dimensions.
- Forgetting LSTM returns both hidden and cell states.
- Assuming a GRU has a separate cell state like an LSTM.
- Ignoring gradient clipping on unstable recurrent training.
- Treating hidden state as an exact storage of the full sequence.

## 16. Placement and Interview Questions

**Q1. What is an RNN?**  
A recurrent architecture that updates a hidden state at each time step using the current input and previous state.

**Q2. What does unfolding mean?**  
Drawing the repeated recurrent cell across time steps to expose dependencies and shared parameters.

**Q3. What is BPTT?**  
Applying backpropagation through the unfolded recurrent computation graph.

**Q4. Why do vanilla RNNs struggle with long-term dependencies?**  
Repeated gradient multiplication can cause vanishing or exploding gradients, making distant information difficult to learn.

**Q5. What is a bidirectional RNN?**  
An RNN with forward and backward sequence processing, combining both contexts.

**Q6. Why can a bidirectional RNN be unsuitable for streaming?**  
The backward direction requires future tokens or observations.

**Q7. What does the LSTM forget gate do?**  
Controls how much previous cell-state information is retained.

**Q8. LSTM vs GRU?**  
LSTM uses separate hidden and cell states with three main gates; GRU uses a simpler gated hidden-state update.

## 17. Practice

### Paper exercises
1. Unfold a 4-step RNN and mark shared parameters.
2. Explain why gradients may vanish over long recurrent paths.
3. Describe forward and backward context in a bidirectional RNN.
4. Explain the role of each LSTM gate.
5. Compare GRU and LSTM state structures.

### Coding exercise
Build a many-to-one sentiment classifier:
- Tokenise and pad sequences.
- Convert tokens to embedding vectors.
- Train a vanilla RNN, GRU, or LSTM.
- Compare training speed and validation metrics.
- Add gradient clipping.
- Test a bidirectional variant for offline classification.
- Explain why that variant would not directly support causal streaming.

## 18. Quick Revision

- RNN: hidden state carries sequence context.
- Unfolding: repeated cell across time.
- BPTT: chain rule through time.
- Truncated BPTT: restrict gradient window.
- Bidirectional: forward + backward context.
- LSTM: hidden state + cell state + input/forget/output gates.
- GRU: hidden state + reset/update gates.
- Long dependency issue: vanishing/exploding gradients.
- Gradient clipping: controls gradient magnitude.

## 19. Final Checklist

- [ ] Write vanilla RNN recurrence equations.
- [ ] Explain shared parameters across time.
- [ ] Explain BPTT and truncated BPTT.
- [ ] Explain vanishing/exploding gradients.
- [ ] Distinguish bidirectional and causal sequence models.
- [ ] Explain LSTM gates and cell state.
- [ ] Explain GRU gates.
- [ ] Track PyTorch sequence tensor shapes.
- [ ] Implement a basic sequence classifier.

## 20. Recommended Resources

- [CampusX 100 Days of Deep Learning — RNN/LSTM/GRU Days 55–66](https://learnwith.campusx.in/s/preview/courses/100-Days-of-Deep-Learning-YouTube)
- [Colah — Understanding LSTM Networks](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)
- [MIT 6.S191 — Introduction to Deep Learning](https://introtodeeplearning.com/2025/index.html)
- [PyTorch RNN](https://docs.pytorch.org/docs/stable/generated/torch.nn.RNN.html)
- [PyTorch LSTM](https://docs.pytorch.org/docs/stable/generated/torch.nn.LSTM.html)
- [PyTorch GRU](https://docs.pytorch.org/docs/stable/generated/torch.nn.GRU.html)
