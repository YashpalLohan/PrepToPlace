# Days 56–57 — Vision Transformers + Multimodal AI

## 1. Overview

Vision Transformers (ViTs) treat images as sequences of patch embeddings and process them using Transformer blocks.

Multimodal models connect representations from different modalities, such as images and text.

This block covers:
- Splitting images into patches
- Linear projection and positional embeddings
- CLS token mechanics
- ViT architecture
- CLIP's image/text dual-encoder structure
- Cross-modal embeddings and similarity
- Attention-map imitation as a distillation idea
- Text-to-image generation fundamentals

## 2. Why Transformers for Vision?

CNNs build in a strong local spatial inductive bias through local filters and weight sharing.

Vision Transformers instead:
1. Divide an image into patches.
2. Convert each patch into an embedding.
3. Add position information.
4. Process the patch sequence using Transformer layers.

This allows interactions between distant image regions through attention, but the model may need substantial pretraining data or strong regularisation to learn useful visual structure.

## 3. Image Patching

Suppose an image has dimensions \(H\times W\) and uses square patches of side \(P\), assuming H and W are divisible by P.

Number of patches:

\[
N=\frac{H}{P}\cdot\frac{W}{P}
\]

Example: a \(224\times224\) image with \(16\times16\) patches:

\[
N=14\cdot14=196
\]

Each patch contains \(P^2C\) raw values for C channels.

## 4. Linear Projection to Patch Embeddings

Each flattened patch is projected into a vector of dimension \(D\):

\[
e_i=x_iW_E+b_E
\]

The sequence of patch embeddings has shape approximately `(B, N, D)`.

The projection can be implemented using a linear layer or an equivalent convolution with kernel size and stride equal to patch size.

## 5. CLS Token Mechanics

A learnable classification token (often written `[CLS]`) is prepended to the patch sequence.

Input sequence:

```text
[CLS] [Patch 1] [Patch 2] ... [Patch N]
```

After Transformer layers:
- The final CLS representation can be fed to a classification head.
- Patch representations can be used for dense or spatial tasks with appropriate heads.

CLS is a learned summary mechanism. It does not have to correspond to a real image patch.

Some ViT variants use global average pooling over patch tokens instead of a CLS token.

## 6. Positional Embeddings in ViT

Self-attention does not inherently encode patch order/location.

ViT commonly adds learned positional embeddings to patch and CLS embeddings:

\[
Z_0=[x_{class};x_p^1E;\ldots;x_p^NE]+E_{pos}
\]

The positional vector identifies where each patch came from in the image grid.

Changing image resolution or patch size changes the number of tokens; pretrained positional embeddings may need interpolation or architecture-specific handling.

## 7. ViT Architecture

A typical ViT flow:

```text
Image
  |
Split into patches
  |
Flatten each patch
  |
Linear patch projection
  |
Prepend CLS token
  |
Add positional embeddings
  |
Transformer encoder blocks
  |
Final norm / representation
  |
Classification head
```

Unlike a CNN, a standard ViT does not progressively reduce the spatial grid through convolution/pooling in its core Transformer blocks, although hierarchical and hybrid variants exist.

## 8. Attention Complexity in ViT

The sequence length is approximately the number of image patches plus optional special tokens.

Standard full self-attention has pairwise interactions with quadratic dependence on token count:

\[
O(N^2D)
\]

Smaller patches increase N and can dramatically increase attention cost.

For fixed image size, halving patch side length roughly quadruples patch count and increases pairwise attention interactions by about sixteen times, ignoring special tokens and other costs.

## 9. CLIP: Connecting Images and Text

CLIP is a contrastive image–text model.

It contains:
- Image encoder.
- Text encoder.
- Projection into a shared embedding space.
- Similarity-based contrastive training.

Training data contains image–text pairs. The model learns to place matching image and text embeddings close together relative to mismatched pairs in a batch.

## 10. Contrastive Learning Intuition

For a batch of N matched image-caption pairs:
1. Encode N images.
2. Encode N captions.
3. Compute pairwise similarity matrix.
4. Matching image-caption pairs are positive pairs.
5. Other examples in the batch act as negatives.
6. Optimise a contrastive objective that increases matching-pair similarity.

At inference:
- Encode an image.
- Encode candidate text descriptions.
- Compare their normalized embeddings.
- Rank text candidates by similarity.

This supports zero-shot classification by comparing an image against text prompts such as "a photo of a dog" and "a photo of a bicycle".

It is not unlimited general intelligence: performance depends on training data, prompts, domain, and image characteristics.

## 11. Cross-Modal Embeddings

A shared embedding space allows different modalities to be compared.

Examples:
- Image-to-text retrieval.
- Text-to-image retrieval.
- Zero-shot classification.
- Image clustering by text-aligned concepts.
- Multimodal search.

Similarity often uses cosine similarity:

\[
sim(I,T)=\frac{I^TT}{\|I\|\|T\|}
\]

Embeddings must come from compatible encoders and projection spaces. Do not compare unrelated embedding models directly.

## 12. Attention Maps and Attention-Map Mimicking

Attention maps show how a Transformer distributes attention weights across tokens or image patches.

In some distillation settings, a student model can be trained to imitate teacher attention maps or intermediate representations.

Conceptual objective:

\[
L=L_{task}+\lambda L_{attention}
\]

where `L_attention` measures a chosen difference between teacher and student attention maps.

Cautions:
- Teacher and student heads/layers may not align naturally.
- Attention map similarity does not guarantee equal task behaviour.
- Different architectures may have different token layouts or attention semantics.
- Distillation objectives must be validated empirically.

Attention-map mimicry is one possible auxiliary distillation signal, not a universal requirement for multimodal learning.

## 13. Text-to-Image Synthesis Basics

Many modern text-to-image systems use diffusion-based generative models.

High-level process:
1. Encode text prompt into conditioning representations.
2. Start from noise in image or latent space.
3. Repeatedly denoise using a neural network conditioned on text.
4. Decode latent representation to an image if a latent diffusion system is used.

### Latent diffusion intuition
Instead of running the denoising process directly over full-resolution pixels, an encoder compresses the image into a latent representation. Diffusion operates in latent space, then a decoder reconstructs the image.

Common components:
- Text encoder.
- Denoising network (often U-Net-like).
- Noise scheduler.
- VAE encoder/decoder in latent diffusion.
- Guidance strategy.

This is a conceptual overview; detailed diffusion mathematics is outside this two-day block.

## 14. ViT vs CNN vs CLIP

| Model family | Input/representation | Main objective/use |
|---|---|---|
| CNN | Spatial feature maps | Visual feature extraction / vision tasks |
| ViT | Patch-token sequence | Image understanding via Transformer |
| CLIP | Image and text encoders | Align image/text representations |

CLIP often uses a CNN or ViT image encoder, together with a text Transformer encoder. It is a model system and training objective, not simply another ViT block.

## 15. Common Mistakes

- Forgetting to add positional information to patches.
- Confusing patch embeddings with raw pixels.
- Treating CLS as a real image patch.
- Ignoring the quadratic sequence cost of full attention.
- Assuming CLIP is a single encoder.
- Comparing embeddings from incompatible spaces.
- Assuming zero-shot classification means no limitations or domain shift.
- Treating attention maps as definitive explanations.
- Confusing text-to-image diffusion with CLIP contrastive training.

## 16. Placement and Interview Questions

**Q1. How does ViT convert an image into a sequence?**  
Split the image into patches, flatten/project each patch into an embedding, add positional information, and process the sequence with Transformer blocks.

**Q2. Why use a CLS token?**  
It provides a learnable sequence representation that can be used by a classification head.

**Q3. Why add positional embeddings?**  
Self-attention does not inherently know the original spatial order of patches.

**Q4. How does CLIP learn image–text alignment?**  
It uses contrastive learning on paired image and text examples to align matching embeddings and separate non-matching pairs.

**Q5. What is zero-shot image classification with CLIP?**  
Compare an image embedding to text embeddings of candidate class descriptions and select the most similar candidate.

**Q6. What is cross-modal retrieval?**  
Searching one modality using an embedding produced from another compatible modality.

**Q7. Why are smaller ViT patches more expensive?**  
They create more tokens, and full self-attention has quadratic pairwise interactions.

**Q8. What is latent diffusion?**  
A diffusion process performed in a compressed latent representation, followed by decoding to the image domain.

## 17. Practice

### Paper exercises
1. Calculate patch count for a 256×256 image with 16×16 patches.
2. Explain how CLS and patch tokens are arranged.
3. Explain why patch count affects attention cost quadratically.
4. Draw the CLIP dual-encoder training process.
5. Explain the difference between CLIP contrastive learning and text-to-image diffusion.

### Coding exercise
Use a pretrained ViT and CLIP model:
- Run image classification with a pretrained ViT.
- Encode an image and multiple text prompts with CLIP.
- Compare image/text cosine similarities.
- Try prompt variations.
- Inspect failure cases and domain limitations.
- Record model ID, preprocessing, and licence.

## 18. Quick Revision

- ViT: image patches become tokens.
- Patch projection: flattened patch → vector.
- CLS: learned sequence summary token.
- Positional embedding: restores patch location/order.
- ViT: Transformer encoder over patches.
- CLIP: dual encoder + contrastive image/text alignment.
- Cross-modal embeddings: shared vector space.
- Attention map mimicry: optional distillation signal.
- Text-to-image: prompt-conditioned generation, often diffusion-based.
- Latent diffusion: denoise compressed latent then decode.

## 19. Final Checklist

- [ ] Calculate patch count and embedding shape.
- [ ] Explain linear patch projection.
- [ ] Explain CLS token and positional embeddings.
- [ ] Compare ViT and CNN inductive biases.
- [ ] Explain CLIP's image/text encoders.
- [ ] Explain contrastive positives and negatives.
- [ ] Explain cross-modal retrieval.
- [ ] Explain attention-map distillation caveats.
- [ ] Outline text-to-image diffusion.

## 20. Recommended Resources

- [Pinecone — Vision Transformers Explained](https://www.pinecone.io/learn/series/image-search/vision-transformers/)
- [OpenAI — CLIP](https://openai.com/index/clip/)
- [Dive into Deep Learning — Vision Transformer](https://d2l.ai/chapter_attention-mechanisms/vision-transformer.html)
- [Stanford CS231n](https://cs231n.stanford.edu/)
- [Vision Transformer paper](https://arxiv.org/abs/2010.11929)
- [CLIP paper](https://arxiv.org/abs/2103.00020)
