# Days 24–28 — LLM Architecture

## 1. Overview
Large Language Models (LLMs) process token sequences and learn patterns that let them predict or generate text. Most modern LLMs use Transformer architectures built around attention.

Topics:
- Language modelling and next-token prediction.
- Tokens, tokenization, vocabulary, and embeddings.
- Transformer layers and self-attention.
- Context windows and attention masks.
- Encoder-only, decoder-only, and encoder–decoder models.

## 2. What Is a Language Model?
A language model assigns probabilities to token sequences. An autoregressive language model factorises a sequence as:

\[
P(x_1,\ldots,x_T)=\prod_{t=1}^{T}P(x_t\mid x_1,\ldots,x_{t-1})
\]

At each generation step, it estimates a distribution over the next token using the preceding context. It then selects or samples a token and repeats.

A language model is not a deterministic database. It learns statistical patterns from training data and uses its parameters plus supplied context to generate likely continuations.

## 3. Tokens and Tokenization
A token is a unit produced by a tokenizer. It may be a word, word part, punctuation mark, whitespace-related fragment, or special marker.

Tokenization converts text into token IDs. Subword methods such as BPE, WordPiece, and Unigram balance vocabulary size with the ability to represent unfamiliar words.

Important:
- Token boundaries do not necessarily match word boundaries.
- Token IDs belong to a particular tokenizer vocabulary.
- The model and tokenizer must be compatible.
- Special tokens can mark sequence boundaries, padding, roles, or task structure.

## 4. Embeddings
An embedding maps a discrete token ID to a dense vector. For vocabulary size \(V\) and hidden dimension \(d\), the embedding table is:

\[
E\in\mathbb{R}^{V\times d}
\]

Token ID \(i\) selects row \(E_i\). These vectors are learned during training and provide continuous representations for neural-network computation.

Embedding similarity can reflect statistical relationships, but vectors are not guaranteed to encode simple human-readable definitions.

## 5. Transformer Input Pipeline
A simplified path is:

```text
Raw text → Tokenizer → Token IDs → Embedding lookup
         → Positional information → Transformer layers → Output head
```

For batch size \(B\), sequence length \(T\), and hidden width \(d_{model}\), the hidden-state tensor commonly has shape `(B, T, d_model)`.

The tokenizer determines sequence length. Padding masks distinguish actual tokens from padding. The output head produces task-specific scores, such as next-token logits.

## 6. Self-Attention: Query, Key, Value
An attention layer learns three projections:

\[
Q=XW_Q,\quad K=XW_K,\quad V=XW_V
\]

Intuition:
- Query: what a token is looking for.
- Key: what each token offers for matching.
- Value: information combined after attention weights are calculated.

Self-attention compares queries with keys, then uses the resulting weights to mix value vectors.

## 7. Scaled Dot-Product Attention
The standard form is:

\[
Attention(Q,K,V)=softmax\left(\frac{QK^T}{\sqrt{d_k}}+M\right)V
\]

where \(d_k\) is the key dimension and \(M\) is an optional mask.

The scale factor controls dot-product magnitude as the key dimension grows, helping avoid overly saturated softmax scores.

Attention coefficients are softmax weights over allowed positions. They are useful diagnostics but are not, by themselves, complete explanations of model reasoning.

## 8. Attention Masks
**Padding mask:** prevents attention to padding positions added for batching.

**Causal mask:** prevents a decoder position from attending to future tokens. This is required for autoregressive next-token training.

For four positions, a causal visibility pattern is:

```text
1 0 0 0
1 1 0 0
1 1 1 0
1 1 1 1
```

Mask conventions differ by API. Check whether `True` means allowed or blocked.

## 9. Multi-Head Attention and Transformer Blocks
Multi-head attention runs multiple attention projections in parallel:

\[
head_i=Attention(Q_i,K_i,V_i)
\]

\[
MHA(X)=Concat(head_1,\ldots,head_h)W_O
\]

A typical Transformer block combines:
1. Multi-head attention.
2. Residual connection and normalisation.
3. Position-wise feed-forward network.
4. Another residual connection and normalisation.

The FFN is applied independently at each token position. Pre-norm and post-norm arrangements differ in where normalisation occurs.

## 10. Positional Information
Self-attention alone does not encode token order. Transformers inject positional information using methods such as:
- Sinusoidal positional encodings.
- Learned absolute position embeddings.
- Relative position biases.
- Rotary Position Embeddings (RoPE).

The original Transformer used sinusoidal encodings; modern architectures use several alternatives.

## 11. Context Window
The context window is the token capacity a model can process for one request, subject to model and API limits. It may include instructions, user input, conversation history, retrieved documents, tool results, and generated output.

A context window is not permanent memory. Applications may need:
- History truncation or summarisation.
- Document chunking.
- Retrieval of relevant past information.
- Token budgeting that reserves room for output.

Larger context is not automatically better if the extra material is irrelevant or distracts from the task.

## 12. Encoder, Decoder, and Encoder–Decoder Models
| Architecture | Attention pattern | Typical tasks |
|---|---|---|
| Encoder-only | Bidirectional input attention | Classification, token labelling, embeddings |
| Decoder-only | Causal attention | Next-token text/code generation |
| Encoder–decoder | Encoder attention + causal decoder + cross-attention | Translation, summarisation |

Encoder-only models create contextual input representations. Decoder-only models generate autoregressively. Encoder–decoder models condition output generation on an encoded input sequence.

## 13. Common Mistakes
- Treating tokens and words as identical.
- Assuming token IDs can be reused with a different tokenizer.
- Confusing IDs with embeddings.
- Forgetting positional information.
- Omitting causal masks for autoregressive training.
- Assuming every Transformer is decoder-only.
- Treating context window as persistent memory.
- Treating attention weights as a complete explanation.

## 14. Placement and Interview Questions
**Q1. What is a token?** A tokenizer-defined unit such as a word, word piece, punctuation mark, or special marker.

**Q2. Why use embeddings?** They map discrete IDs into dense vectors that neural networks can process.

**Q3. What is self-attention?** A mechanism that compares queries and keys and forms a weighted combination of values.

**Q4. Why scale attention scores?** To control magnitude as key dimension grows and reduce softmax saturation.

**Q5. Why causal masking?** To prevent future tokens from leaking into earlier next-token predictions.

**Q6. What is a context window?** The token capacity available to a model for the current request/context.

**Q7. Encoder-only vs decoder-only?** Encoder-only models typically use bidirectional context; decoder-only models use causal attention for generation.

**Q8. What is cross-attention?** Queries from one sequence attend to key/value representations from another sequence.

## 15. Practice
1. Draw the flow from raw text to next-token logits.
2. Explain Q, K, and V in your own words.
3. Draw a causal mask for five tokens.
4. Compare encoder-only, decoder-only, and encoder–decoder architectures.
5. Explain why context capacity is measured in tokens, not words.
6. Use a Hugging Face tokenizer to inspect token IDs and attention masks.

## 16. Quick Revision
- Token: tokenizer-defined unit.
- Embedding: dense learned vector.
- Q/K/V: query, key, value projections.
- Self-attention: weighted mixing of values.
- Scale: divide scores by \(\sqrt{d_k}\).
- Mask: controls allowed attention.
- Context window: token budget for the current request.
- Encoder-only: bidirectional representation.
- Decoder-only: causal generation.
- Encoder–decoder: input encoder plus conditional decoder.

## 17. Final Checklist
- [ ] Explain tokenization, vocabulary, and embeddings.
- [ ] Describe a Transformer block.
- [ ] Derive scaled dot-product attention.
- [ ] Explain padding and causal masks.
- [ ] Explain positional information and context limits.
- [ ] Compare encoder-only, decoder-only, and encoder–decoder models.

## 18. Recommended Resources
- [HF LLM Course](https://huggingface.co/learn/llm-course/chapter1/1)
- [MS GenAI Beginners](https://github.com/microsoft/generative-ai-for-beginners)
- [Jay Alammar — Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/)
- [Attention Is All You Need](https://arxiv.org/abs/1706.03762)
