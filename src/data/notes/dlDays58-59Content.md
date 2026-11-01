# Days 58–59 — Autoencoders + Variational Autoencoders

## 1. Overview

Autoencoders learn to represent input data in a compressed or transformed latent space and reconstruct the input.

This block covers:
- Encoder, latent representation, and decoder
- Undercomplete autoencoders
- Regularised and denoising autoencoders
- Representational power and limitations
- Variational Autoencoders (VAEs)
- Reparameterisation trick
- ELBO objective and applications

## 2. Autoencoder Architecture

An autoencoder has two main components.

### Encoder
Maps input \(x\) to latent representation \(z\):

\[
z=f_\theta(x)
\]

### Decoder
Maps latent representation back to reconstruction:

\[
\hat x=g_\phi(z)
\]

The model is trained to make \(\hat x\) similar to x.

```text
Input x
  |
Encoder
  |
Latent vector z
  |
Decoder
  |
Reconstruction x_hat
  |
Reconstruction loss compared with x
```

The latent space may capture useful structure, but it is not automatically meaningful or disentangled.

## 3. Reconstruction Loss

For real-valued data, mean squared error is common:

\[
L_{MSE}=\frac{1}{N}\sum_i(x_i-\hat x_i)^2
\]

For binary-valued pixels/features, binary cross-entropy may be appropriate.

The loss must match the data representation and decoder output parameterisation.

## 4. Undercomplete Autoencoders

An undercomplete autoencoder uses a latent representation with fewer dimensions than the input.

Example:
- Input dimension: 784.
- Latent dimension: 32.

The bottleneck encourages the model to compress information.

However, if the model has excessive capacity or the objective is poorly chosen, an autoencoder may learn an unhelpful mapping.

## 5. Representational Power

An autoencoder can learn nonlinear representations through nonlinear encoder and decoder networks.

A linear autoencoder trained with squared reconstruction error and a suitable bottleneck is closely related to PCA in the subspace it learns (subject to assumptions and optimisation).

A nonlinear autoencoder can represent more complex structures, but:
- Reconstruction quality is not the same as useful downstream features.
- Latent dimensions may be difficult to interpret.
- The model can learn shortcuts or memorise when capacity is too high.

## 6. Regularised Autoencoders

Regularisation constrains what representations the model can learn.

Examples:
- Weight penalties.
- Sparse activations.
- Contractive penalties that discourage excessive sensitivity.
- Noise corruption.
- Architectural bottlenecks.

The goal is to learn robust, useful representations rather than a trivial identity map.

## 7. Denoising Autoencoders

A denoising autoencoder receives a corrupted input and learns to reconstruct the clean original.

```text
Clean input x
     |
Add corruption / noise
     |
Corrupted input x_tilde
     |
Encoder → latent → Decoder
     |
Reconstruction x_hat
     |
Compare x_hat with clean x
```

Objective:

\[
L=L(x,\hat x)
\]

The target is the original clean input, not the corrupted input.

Denoising can encourage features that capture stable structure rather than exact input noise.

## 8. Autoencoder Applications

- Dimensionality reduction.
- Denoising.
- Anomaly detection using reconstruction error.
- Representation learning.
- Compression (with suitable quantisation/encoding design).
- Generative modelling when the latent distribution is structured appropriately.

### Anomaly detection
Train on mostly normal examples. If unusual examples reconstruct poorly, their reconstruction error may be high.

This requires validation: unusual examples may still reconstruct well, and legitimate normal examples may reconstruct poorly.

## 9. Why a Basic Autoencoder Is Not Automatically Generative

A basic autoencoder learns to reconstruct examples from latent codes produced by the encoder.

It does not necessarily learn a smooth, known latent distribution from which arbitrary points can be sampled.

If we sample a random latent vector from an arbitrary distribution, the decoder may produce unrealistic outputs because the sampled vector may be outside the region occupied by encoded training examples.

VAEs introduce a probabilistic latent-variable model and regularise the latent distribution.

## 10. Variational Autoencoder (VAE)

A VAE models a latent variable \(z\) probabilistically.

The encoder estimates a distribution:

\[
q_\phi(z\mid x)
\]

Commonly it predicts:
- Mean vector \(\mu(x)\).
- Log variance vector \(\log\sigma^2(x)\).

The decoder models:

\[
p_\theta(x\mid z)
\]

The prior is commonly:

\[
p(z)=\mathcal{N}(0,I)
\]

Instead of encoding each input to one deterministic point, the encoder defines a distribution over possible latent representations.

## 11. Reparameterisation Trick

Sampling directly from a distribution can obstruct ordinary backpropagation through the sampling operation.

For a diagonal Gaussian posterior:

\[
z=\mu+\sigma\odot\epsilon,\quad \epsilon\sim\mathcal{N}(0,I)
\]

The noise \(\epsilon\) is sampled independently, while \(\mu\) and \(\sigma\) remain differentiable.

This lets gradients flow through the deterministic transformation from \(\mu,\sigma,\epsilon\) to z.

## 12. VAE Objective: ELBO

The VAE maximises the evidence lower bound (ELBO):

\[
ELBO=
\mathbb{E}_{q_\phi(z\mid x)}[\log p_\theta(x\mid z)]
-
D_{KL}(q_\phi(z\mid x)\|p(z))
\]

Equivalently, minimise the negative ELBO:

\[
L_{VAE}=L_{reconstruction}+L_{KL}
\]

where:
- Reconstruction term encourages faithful reconstruction.
- KL term encourages the approximate posterior to remain close to the prior.

For a diagonal Gaussian posterior and standard normal prior:

\[
D_{KL}=
-\frac12\sum_j
(1+\log\sigma_j^2-\mu_j^2-\sigma_j^2)
\]

The exact reconstruction likelihood depends on the data/model (Bernoulli, Gaussian, etc.).

## 13. Why the KL Term Matters

Without the KL term, the encoder could assign arbitrary latent codes that reconstruct training samples but do not form a convenient sampleable distribution.

The KL penalty encourages encoded distributions to remain near the prior.

Trade-off:
- Too little regularisation: latent space may be irregular.
- Too much KL pressure: posterior may ignore input information (posterior collapse in some settings).

The reconstruction–regularisation balance is central to VAE behaviour.

## 14. Basic PyTorch VAE Components

```python
import torch
from torch import nn

class VAE(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int, latent_dim: int):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, hidden_dim),
            nn.ReLU()
        )
        self.mu = nn.Linear(hidden_dim, latent_dim)
        self.logvar = nn.Linear(hidden_dim, latent_dim)

        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, hidden_dim),
            nn.ReLU(),
            nn.Linear(hidden_dim, input_dim),
            nn.Sigmoid()
        )

    def reparameterize(self, mu, logvar):
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def forward(self, x):
        h = self.encoder(x)
        mu = self.mu(h)
        logvar = self.logvar(h)
        z = self.reparameterize(mu, logvar)
        reconstruction = self.decoder(z)
        return reconstruction, mu, logvar
```

This example is a simple vector-input VAE. It assumes inputs are scaled to [0,1] and uses a sigmoid decoder; the likelihood/loss should match the actual data.

## 15. VAE Loss Example

```python
import torch.nn.functional as F

def vae_loss(reconstruction, x, mu, logvar):
    reconstruction_loss = F.binary_cross_entropy(
        reconstruction, x, reduction="sum"
    )

    kl_loss = -0.5 * torch.sum(
        1 + logvar - mu.pow(2) - logvar.exp()
    )

    return reconstruction_loss + kl_loss
```

For continuous real-valued inputs, a Gaussian likelihood/MSE-style reconstruction objective may be more appropriate than binary cross-entropy.

## 16. Autoencoder vs VAE

| Property | Basic Autoencoder | Variational Autoencoder |
|---|---|---|
| Latent representation | Deterministic vector | Distribution over latent variables |
| Main objective | Reconstruction | Reconstruction + KL regularisation |
| Sampling | Not inherently well-defined | Sample from prior and decode |
| Latent organisation | No explicit prior constraint by default | Encouraged to match prior |
| Typical use | Compression, denoising, representation | Generative modelling and latent representation |

## 17. Common Mistakes

- Assuming a basic autoencoder can generate valid samples from arbitrary random latent vectors.
- Comparing reconstruction loss without considering data likelihood.
- Forgetting the KL term in a VAE.
- Confusing log variance with variance.
- Sampling z without the reparameterisation trick.
- Using BCE with unscaled continuous inputs.
- Treating high reconstruction error as proof of anomaly.
- Assuming a VAE latent space is perfectly disentangled.

## 18. Placement and Interview Questions

**Q1. What is an autoencoder?**  
An encoder–decoder network trained to reconstruct input data through a latent representation.

**Q2. What is an undercomplete autoencoder?**  
An autoencoder whose latent dimension is smaller than its input dimension.

**Q3. What is a denoising autoencoder?**  
A model trained to reconstruct clean input from a corrupted version.

**Q4. Why is a basic autoencoder not necessarily generative?**  
Its latent codes may not follow a known smooth prior, so arbitrary latent samples may decode poorly.

**Q5. What does a VAE encoder output?**  
Parameters of an approximate posterior distribution, commonly mean and log variance.

**Q6. What is the reparameterisation trick?**  
Expressing a latent sample as a differentiable function of distribution parameters and independent noise.

**Q7. What are the two terms in the VAE loss?**  
Reconstruction loss and KL divergence regularisation.

**Q8. What is posterior collapse?**  
A situation where the learned posterior carries little information about the input and remains close to the prior.

## 19. Practice

### Paper exercises
1. Draw a basic autoencoder and label encoder, latent vector, and decoder.
2. Explain why denoising uses corrupted input but clean reconstruction target.
3. Write the VAE reparameterisation equation.
4. Explain each term in the ELBO.
5. Describe why the KL term helps sampling from the prior.

### Coding exercise
Train an autoencoder and VAE on a small image dataset:
- Compare reconstruction quality.
- Visualise latent representations.
- Sample latent vectors from the VAE prior.
- Decode generated samples.
- Plot reconstruction and KL losses separately.
- Test anomaly-detection thresholding on a validation set.

## 20. Quick Revision

- Autoencoder: encode → latent → decode.
- Undercomplete: latent bottleneck.
- Denoising: corrupted input → clean target.
- Regularised AE: constrain representation.
- Basic AE: deterministic latent code.
- VAE: approximate posterior distribution.
- Reparameterisation: \(z=\mu+\sigma\epsilon\).
- ELBO: reconstruction likelihood term − KL divergence.
- VAE loss: reconstruction + KL.
- Applications: denoising, compression, anomaly detection, generation.

## 21. Final Checklist

- [ ] Draw and explain an autoencoder.
- [ ] Distinguish undercomplete and regularised autoencoders.
- [ ] Explain denoising objective.
- [ ] Explain why a basic AE is not automatically generative.
- [ ] Write the VAE probabilistic model.
- [ ] Explain reparameterisation.
- [ ] Derive the negative ELBO terms.
- [ ] Implement and train a simple VAE.
- [ ] Evaluate reconstruction and prior samples.

## 22. Recommended Resources

- [Sachin Soni — VAE in Simple Language](https://medium.com/@sachinsoni600517/variational-autoencoders-in-simple-language-vae-explained-8a2c8b9f0e3b)
- [TensorFlow — Intro to Autoencoders](https://www.tensorflow.org/tutorials/generative/autoencoder)
- [Understanding Deep Learning — Simon Prince](https://udlbook.github.io/udlbook/)
