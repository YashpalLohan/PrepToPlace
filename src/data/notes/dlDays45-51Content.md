# Days 45–51 — Transformers + Attention

## 1. Overview

Transformers process token sequences using attention rather than recurrence as their central sequence-mixing operation.

This block covers:
- Text preparation and token embeddings
- Query, Key, and Value projections
- Dot-product and scaled dot-product attention
- Attention coefficients and masking
- Multi-head attention
- Transformer blocks and parameter structure
- Computational complexity
- Positional information
- Encoder-only and decoder-only transformer families
- Long-sequence approaches

## 2. Preparing Text for a Transformer

A typical input path:

```text
Raw text
   |
Tokenizer
   |
Token IDs
   |
Token embedding lookup
   |
Add / combine positional information
   |
Transformer layers
   |
Task-specific output head
```

Important:
- Tokenization determines the sequence length.
- Token IDs must match the model's vocabulary.
- Padding and attention masks distinguish real tokens from padding.
- Causal masks prevent a decoder from looking at future tokens.
- The maximum context length is constrained by architecture and implementation.

## 3. Token Embeddings and Positional Information

An embedding matrix has shape:

\[
E\in\mathbb{R}^{V\times d_{model}}
\]

where \(V\) is vocabulary size and \(d_{model}\) is hidden width.

Each token ID selects one row from E.

Self-attention alone does not encode token order. Positional information is added or injected so the model can distinguish sequences with different ordering.

## 4. Query, Key, and Value

Given input representations \(X\), learned linear projections create:

\[
Q=XW_Q,\quad K=XW_K,\quad V=XW_V
\]

Intuition:
- **Query:** what this token is looking for.
- **Key:** what information each token offers for matching.
- **Value:** information that gets combined after attention weights are calculated.

These are learned projections, not fixed semantic labels assigned by humans.

## 5. Dot-Product Self-Attention

Attention compares queries with keys:

\[
Scores=QK^T
\]

Softmax converts each row into attention coefficients:

\[
A=softmax(QK^T)
\]

The output is a weighted combination of values:

\[
Attention(Q,K,V)=AV
\]

For a single sequence, every token can attend to every other permitted token in the sequence, subject to the attention mask.

## 6. Scaled Dot-Product Attention

The standard scaled form is:

\[
Attention(Q,K,V)=softmax\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V
\]

where:
- \(d_k\): key dimension per head.
- \(M\): optional attention mask, often containing large negative values for disallowed positions.

Why divide by \(\sqrt{d_k}\)?
- Dot products can grow in magnitude as key dimension increases.
- Very large logits can saturate softmax.
- Scaling helps keep attention-score magnitudes more manageable.

## 7. Attention Coefficients

Attention coefficients are the softmax weights for each query over allowed keys.

For a query token:
- Higher coefficient means more weight is assigned to that value vector.
- Coefficients across permitted keys sum to one.
- The output is a weighted combination of value vectors.

Attention weights are useful diagnostic signals, but they are not automatically complete or faithful explanations of model reasoning.

## 8. Causal and Padding Masks

### Causal mask
Prevents a decoder position from attending to future positions.

For autoregressive generation, position t can use positions up to t, not t+1 onward.

### Padding mask
Prevents attention to padding positions introduced to make sequences the same length.

The exact boolean convention differs between APIs. Always verify whether `True` means “allowed” or “masked” in the library being used.

## 9. Multi-Head Attention

Instead of one attention operation, Multi-Head Attention runs several attention heads in parallel.

For head \(i\):

\[
head_i=Attention(XW_Q^i,XW_K^i,XW_V^i)
\]

Then:

\[
MHA(X)=Concat(head_1,\ldots,head_h)W_O
\]

Each head can learn different relationships or subspaces, though interpreting heads as distinct human-understandable roles is not guaranteed.

A common design sets \(d_k=d_v=d_{model}/h\).

## 10. Transformer Encoder Block

A standard encoder block contains:
1. Multi-head self-attention.
2. Residual connection and normalization.
3. Position-wise feed-forward network (FFN).
4. Residual connection and normalization.

The feed-forward network is applied independently at every token position:

\[
FFN(x)=W_2\phi(W_1x+b_1)+b_2
\]

A common expansion is \(d_{ff}>d_{model}\), often by a factor near four in classic Transformer designs.

Pre-norm and post-norm arrangements differ in where normalisation is applied relative to residual paths.

## 11. Transformer Parameter Intuition

For hidden width \(d\), a standard attention block has four main dense projection matrices:
- \(W_Q\)
- \(W_K\)
- \(W_V\)
- \(W_O\)

Each is commonly \(d\times d\), ignoring bias terms and alternative architectures.

The FFN usually has:
- First projection: \(d\times d_{ff}\).
- Second projection: \(d_{ff}\times d\).

Thus, the FFN often contains a large fraction of a block's parameters. Attention's computational cost, however, also depends strongly on sequence length.

Parameter count and FLOPs are different measures.

## 12. Computational Complexity

For sequence length \(n\) and model width \(d\):

- Q/K/V projection cost is roughly \(O(nd^2)\).
- Attention score calculation \(QK^T\) is roughly \(O(n^2d)\).
- Applying attention to values is also roughly \(O(n^2d)\).
- Attention-score memory is commonly \(O(n^2)\) per head in standard implementations.

The quadratic dependence on sequence length makes standard full self-attention expensive for long contexts.

## 13. Positional Encoding

### Sinusoidal positional encoding

Uses fixed sine and cosine functions at different frequencies.

Advantages:
- No learned position table.
- Can be evaluated for positions beyond the training range, though this does not guarantee model generalisation to arbitrarily long sequences.

### Learned positional embeddings

Each position has a learned vector added to token embeddings.

Advantages:
- Flexible and learned from task data.

Limitation:
- Usually tied to trained position range unless special handling or interpolation is introduced.

### Relative and rotary approaches

Relative position biases and Rotary Position Embeddings (RoPE) encode position through relationships or rotations applied to query/key representations.

Modern architectures use several positional strategies; know the principle rather than assuming all Transformers use the original sinusoidal method.

## 14. Encoder-Only Transformers

Encoder-only models use bidirectional self-attention over the available input.

Examples:
- BERT-style architectures.
- RoBERTa-style architectures.

Typical applications:
- Classification.
- Token classification.
- Named entity recognition.
- Extractive question answering.
- Embedding and retrieval representations.

They are not inherently left-to-right next-token generators in the same way as decoder-only causal language models.

## 15. Decoder-Only Transformers

Decoder-only models use causal masked self-attention and autoregressive next-token prediction.

Generation loop:
1. Tokenize the prompt.
2. Run the model to obtain next-token logits.
3. Select/sample the next token.
4. Append it to the context.
5. Repeat until stopping criteria.

Examples include GPT-style decoder-only language models.

### Why causal masking?
It ensures that the prediction at position t uses only information available up to t, matching autoregressive training.

## 16. Encoder–Decoder Transformers

Encoder–decoder architecture uses:
- An encoder to produce contextual input representations.
- A decoder with causal self-attention.
- Cross-attention from decoder queries to encoder outputs.

Commonly useful for conditional sequence-to-sequence tasks such as translation and summarisation.

## 17. Long-Sequence Transformer Approaches

Ways to reduce long-context cost include:

- **Sliding-window/local attention:** each token attends to nearby positions.
- **Sparse attention:** only selected query-key interactions are computed.
- **Block-sparse patterns:** attention is restricted to structured blocks.
- **Low-rank/linear attention approximations:** reformulate or approximate attention to reduce cost under particular assumptions.
- **Memory and recurrence:** reuse representations from previous segments.
- **Hierarchical processing:** summarise chunks before global processing.
- **Efficient kernels:** memory-efficient exact attention can reduce materialised intermediate memory, although standard full attention still has quadratic pairwise interaction arithmetic.

Each method trades off global access, exactness, implementation complexity, and memory/compute.

## 18. Simple Attention in PyTorch

```python
import torch
import torch.nn.functional as F

B, T, D = 2, 5, 16
Q = torch.randn(B, T, D)
K = torch.randn(B, T, D)
V = torch.randn(B, T, D)

scores = Q @ K.transpose(-2, -1) / (D ** 0.5)
weights = F.softmax(scores, dim=-1)
output = weights @ V

print(output.shape)  # (2, 5, 16)
```

This is a single-head, unmasked scaled dot-product attention example. A decoder requires a causal mask; padded batches require an appropriate padding mask.

## 19. Common Mistakes

- Forgetting the scale factor \(\sqrt{d_k}\).
- Confusing Q, K, and V roles.
- Forgetting causal masking in autoregressive training.
- Allowing padding tokens to affect attention.
- Assuming attention weights are complete explanations.
- Assuming every Transformer is decoder-only.
- Confusing model parameters with sequence-dependent compute.
- Saying full self-attention is linear in sequence length.
- Assuming positional encoding is optional when order matters.

## 20. Placement and Interview Questions

**Q1. What is self-attention?**  
A token uses query-key compatibility scores to form a weighted combination of value vectors from permitted positions in the same sequence.

**Q2. Why scale dot-product attention?**  
To control score magnitude as key dimensions grow and avoid softmax saturation.

**Q3. What is the role of Q, K, V?**  
Queries request information, keys are matched against queries, and values are combined using attention weights.

**Q4. Why use multiple heads?**  
Different heads can learn different attention projections and relationships in parallel.

**Q5. Why does a Transformer need positional information?**  
Self-attention by itself does not encode sequence order.

**Q6. Encoder-only vs decoder-only?**  
Encoder-only models usually use bidirectional input attention; decoder-only models use causal attention for autoregressive generation.

**Q7. What is the attention complexity issue?**  
Standard full attention has pairwise sequence interactions with quadratic dependence on sequence length.

**Q8. What does cross-attention do?**  
Decoder queries attend to encoder-produced representations, enabling the output sequence to condition on the input sequence.

## 21. Practice

### Paper exercises
1. Given Q shape `(B, T, d_k)` and K shape `(B, T, d_k)`, derive the attention score shape.
2. Explain why softmax is applied over key positions.
3. Draw a causal mask for a sequence of length four.
4. Explain how multi-head attention output dimensions return to `d_model`.
5. Compare encoder-only, decoder-only, and encoder–decoder architectures.
6. Explain why standard full attention gets expensive for long sequences.

### Coding exercise
Implement scaled dot-product attention from scratch:
- Compute Q/K/V.
- Apply scale.
- Add a causal mask.
- Apply softmax.
- Combine values.
- Compare the result with PyTorch scaled-dot-product attention where available.

## 22. Quick Revision

- Token IDs → embeddings + positional information.
- Q/K/V: query, key, value projections.
- Attention score: \(QK^T\).
- Scaling: divide by \(\sqrt{d_k}\).
- Coefficients: softmax over permitted keys.
- Output: weighted sum of values.
- Multi-head: several attention projections in parallel.
- FFN: position-wise nonlinear transformation.
- Full attention: quadratic sequence interactions.
- Encoder-only: bidirectional input representation.
- Decoder-only: causal next-token generation.
- Long context: sparse/local/approximate/memory strategies.

## 23. Final Checklist

- [ ] Explain token processing and positional information.
- [ ] Derive dot-product attention.
- [ ] Explain the scale factor.
- [ ] Explain attention coefficients and masks.
- [ ] Explain multi-head attention.
- [ ] Identify Transformer block components and parameter matrices.
- [ ] Compare attention compute and parameter count.
- [ ] Compare encoder-only, decoder-only, and encoder–decoder models.
- [ ] Explain long-sequence strategies.

## 24. Recommended Resources

- [CampusX 100 Days of Deep Learning — Days 71–84](https://learnwith.campusx.in/s/preview/courses/100-Days-of-Deep-Learning-YouTube)
- [Jay Alammar — The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Stanford CME295 — Transformers & LLMs](https://cme295.stanford.edu/)
- [Stanford CME295 syllabus](https://cme295.stanford.edu/syllabus/)
- [Stanford CME295 YouTube playlist](https://www.youtube.com/playlist?list=PLakGfbKCei80)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
- [Jay Alammar — The Illustrated GPT-2](https://jalammar.github.io/illustrated-gpt2/)
