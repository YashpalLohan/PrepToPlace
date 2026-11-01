# Days 4–5 — Probability + Information Theory

## 1. Overview

Deep learning is trained under uncertainty. Data is sampled, labels can be noisy, predictions are probabilistic, and classification models often produce probability distributions.

This block covers:
- Random experiments, events, and random variables
- PMF, PDF, CDF, expectation, and variance
- Conditional probability and independence
- Probability chain rule and Bayes' theorem
- Entropy and information content
- Cross-entropy and KL divergence
- Why these ideas appear in classification losses and model evaluation

## 2. Probability Basics

A probability assigns a value from 0 to 1 to an event.

- \(P(A)=0\): impossible event.
- \(P(A)=1\): certain event.
- \(0\leq P(A)\leq1\).

For mutually exclusive events \(A\) and \(B\):

\[
P(A\cup B)=P(A)+P(B)
\]

For general events:

\[
P(A\cup B)=P(A)+P(B)-P(A\cap B)
\]

The sample space \(\Omega\) contains all possible outcomes of an experiment.

## 3. Random Variables and Distributions

A random variable maps outcomes to numerical values.

### Discrete random variable — PMF

The probability mass function gives the probability of each discrete value:

\[
p(x)=P(X=x)
\]

Its probabilities sum to 1.

Example: for a fair die, \(P(X=k)=1/6\) for \(k\in\{1,\ldots,6\}\).

### Continuous random variable — PDF

A probability density function describes probability density. Probability over an interval is the area under the density:

\[
P(a\leq X\leq b)=\int_a^b f(x)\,dx
\]

For a continuous variable, \(P(X=x)=0\) at a single exact point.

### Cumulative distribution function — CDF

\[
F(x)=P(X\leq x)
\]

The CDF is non-decreasing and ranges from 0 to 1.

## 4. Expectation and Variance

Expectation is the long-run average value under a distribution.

For a discrete random variable:

\[
\mathbb{E}[X]=\sum_x xP(X=x)
\]

For a continuous random variable:

\[
\mathbb{E}[X]=\int_{-\infty}^{\infty}xf(x)\,dx
\]

Variance measures spread around the mean:

\[
Var(X)=\mathbb{E}[(X-\mathbb{E}[X])^2]
\]

Equivalent identity:

\[
Var(X)=\mathbb{E}[X^2]-(\mathbb{E}[X])^2
\]

Standard deviation is \(\sqrt{Var(X)}\).

## 5. Common Distributions

| Distribution | Type | Typical use / meaning |
|---|---|---|
| Bernoulli(\(p\)) | Discrete | One binary trial |
| Binomial(\(n,p\)) | Discrete | Number of successes in n independent Bernoulli trials |
| Categorical | Discrete | One of several categories |
| Uniform | Discrete or continuous | Equal probability over a finite set or constant density over an interval |
| Gaussian / Normal | Continuous | Symmetric bell-shaped distribution |
| Exponential | Continuous | Waiting-time model under a constant-rate process |

### Bernoulli

\[
P(X=1)=p,\quad P(X=0)=1-p
\]

\[
\mathbb{E}[X]=p,\quad Var(X)=p(1-p)
\]

A binary classification label is often represented as a Bernoulli target.

### Gaussian

\[
X\sim\mathcal{N}(\mu,\sigma^2)
\]

The mean is \(\mu\); the variance is \(\sigma^2\). Gaussian assumptions appear in many statistical models, but neural networks do not universally require inputs or errors to be normally distributed.

## 6. Conditional Probability

The probability of A given that B has occurred:

\[
P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
\]

Conditional probability changes the reference information.

### Independence

A and B are independent when:

\[
P(A\cap B)=P(A)P(B)
\]

Equivalently, when \(P(B)>0\), \(P(A\mid B)=P(A)\).

Do not confuse independence with mutual exclusivity. Mutually exclusive events with non-zero probabilities are not independent.

## 7. Probability Chain Rule

For events \(A,B,C\):

\[
P(A,B,C)=P(A)P(B\mid A)P(C\mid A,B)
\]

More generally:

\[
P(x_1,\ldots,x_n)=\prod_{i=1}^{n}P(x_i\mid x_1,\ldots,x_{i-1})
\]

This is the probability chain rule.

It is the basis of autoregressive factorisation, where a sequence probability is written as the product of next-token conditional probabilities.

The chain rule does not assume independence. Independence would allow some conditioning variables to be removed.

## 8. Bayes' Theorem

Bayes' theorem reverses conditioning:

\[
P(A\mid B)=\frac{P(B\mid A)P(A)}{P(B)}
\]

Terms:
- Prior \(P(A)\): belief before observing B.
- Likelihood \(P(B\mid A)\): probability of evidence under A.
- Evidence \(P(B)\): normalising probability.
- Posterior \(P(A\mid B)\): updated probability after observing B.

### Worked example

Suppose:
- Disease prevalence is 1%.
- Test sensitivity is 90%.
- False positive rate is 5%.

Let D mean disease and + mean positive test.

\[
P(D)=0.01,\quad P(+\mid D)=0.90,\quad P(+\mid \neg D)=0.05
\]

\[
P(D\mid +)=
\frac{0.90(0.01)}
{0.90(0.01)+0.05(0.99)}
\]

\[
P(D\mid +)\approx0.154
\]

Even with a positive test, the posterior is about 15.4% because the disease is rare and false positives occur among the much larger healthy population.

## 9. Entropy: Measuring Uncertainty

For a discrete distribution \(p(x)\), Shannon entropy is:

\[
H(X)=-\sum_x p(x)\log_2 p(x)
\]

Entropy is measured in bits when log base 2 is used.

- Certain outcome: entropy 0.
- Two equally likely outcomes: entropy 1 bit.
- Uniform distribution across \(K\) outcomes: entropy \(\log_2 K\).

Entropy measures uncertainty of a distribution, not the semantic importance of an event.

## 10. Information Content

The information content (self-information) of an event with probability \(p(x)\) is:

\[
I(x)=-\log p(x)
\]

Rare events carry more information under this definition. Entropy is the expected information content:

\[
H(X)=\mathbb{E}[-\log p(X)]
\]

## 11. Cross-Entropy

Cross-entropy measures the average negative log-probability assigned by a predicted distribution \(q\) to outcomes drawn from true distribution \(p\):

\[
H(p,q)=-\sum_x p(x)\log q(x)
\]

For one-hot classification targets, only the probability assigned to the correct class contributes:

\[
L=-\log q(y)
\]

For a dataset, average this value across examples.

A confident wrong prediction has a large loss. Assigning higher probability to the true class reduces the loss.

### Binary cross-entropy

For a binary target \(y\in\{0,1\}\) and predicted probability \(p\):

\[
L=-[y\log p+(1-y)\log(1-p)]
\]

In code, use numerically stable library implementations instead of manually taking logs of probabilities.

## 12. KL Divergence

Kullback–Leibler divergence measures how one distribution differs from another:

\[
D_{KL}(p\|q)=\sum_x p(x)\log\frac{p(x)}{q(x)}
\]

Properties:
- It is non-negative.
- It is zero when distributions match (under suitable support conditions).
- It is not symmetric: \(D_{KL}(p\|q)\neq D_{KL}(q\|p)\) in general.
- It is not a distance metric.

Cross-entropy decomposes as:

\[
H(p,q)=H(p)+D_{KL}(p\|q)
\]

For a fixed true distribution \(p\), minimising cross-entropy with respect to q is equivalent to minimising KL divergence.

## 13. Softmax and Multiclass Probabilities

A neural network may output logits \(z_1,\ldots,z_K\). Softmax converts logits into a probability distribution:

\[
p_i=\frac{e^{z_i}}{\sum_{j=1}^{K}e^{z_j}}
\]

Properties:
- Each probability is between 0 and 1.
- Probabilities sum to 1.
- Adding the same constant to all logits does not change softmax probabilities.

For multiclass classification, cross-entropy penalises the negative log probability of the true class.

In PyTorch, `CrossEntropyLoss` expects raw logits and class-index targets for its usual classification use. Do not apply softmax before passing logits to that loss.

## 14. Why These Concepts Matter in Deep Learning

- Probability distributions represent uncertainty and classification outputs.
- The chain rule describes sequence probabilities and conditional factorisation.
- Bayes' theorem provides a framework for updating beliefs from evidence.
- Entropy measures uncertainty and appears in information-theoretic objectives.
- Cross-entropy is a standard classification loss.
- KL divergence compares probability distributions and appears in variational learning and regularisation objectives.

## 15. Common Mistakes

- Treating a PDF value as the probability of one exact continuous value.
- Confusing PMF and PDF.
- Assuming independence without justification.
- Confusing \(P(A\mid B)\) with \(P(B\mid A)\).
- Forgetting the evidence term in Bayes' theorem.
- Using a wrong logarithm convention without stating it.
- Assuming KL divergence is symmetric.
- Applying softmax before PyTorch CrossEntropyLoss.
- Thinking entropy measures model accuracy.

## 16. Placement and Interview Questions

**Q1. PMF vs PDF?**  
PMF gives probability at discrete values; PDF is a density whose integral over an interval gives continuous probability.

**Q2. What is a CDF?**  
\(F(x)=P(X\leq x)\).

**Q3. What is conditional probability?**  
The probability of an event under the information that another event has occurred.

**Q4. State the probability chain rule.**  
A joint probability can be factorised into a product of conditional probabilities.

**Q5. What is Bayes' theorem used for?**  
Updating a prior probability using observed evidence and a likelihood.

**Q6. What does entropy measure?**  
Expected uncertainty or information content in a probability distribution.

**Q7. Why use cross-entropy for classification?**  
It penalises low probability assigned to the correct class and corresponds to a negative log-likelihood objective.

**Q8. Is KL divergence symmetric?**  
No. The direction matters.

## 17. Practice

### Paper exercises
1. A fair coin is tossed twice. List the sample space and calculate the probability of exactly one head.
2. A random variable has values 0 and 1 with probabilities 0.7 and 0.3. Calculate expectation and variance.
3. Apply Bayes' theorem to a rare-event test scenario.
4. Calculate entropy for a fair binary distribution and for a distribution `(0.9, 0.1)`.
5. For true class 2 and predicted probabilities `(0.1, 0.7, 0.2)`, calculate the one-example cross-entropy using natural logarithms.

### Coding exercise
Use NumPy to:
- Generate samples from Bernoulli and Normal distributions.
- Calculate empirical mean and variance.
- Calculate entropy for a categorical distribution.
- Compare the cross-entropy of two candidate prediction distributions.

## 18. Quick Revision

- PMF: discrete probability.
- PDF: continuous density.
- CDF: \(P(X\leq x)\).
- Expectation: average under a distribution.
- Variance: expected squared deviation.
- Conditional probability: \(P(A\mid B)\).
- Chain rule: joint probability as conditional product.
- Bayes: posterior = likelihood × prior / evidence.
- Entropy: expected information content.
- Cross-entropy: expected negative log probability under q for outcomes from p.
- KL: directed distribution divergence.
- Softmax: maps logits to a categorical distribution.

## 19. Final Checklist

- [ ] Distinguish PMF, PDF, and CDF.
- [ ] Calculate expectation and variance.
- [ ] Explain conditional probability and independence.
- [ ] Apply the probability chain rule.
- [ ] Solve a Bayes theorem problem.
- [ ] Calculate entropy and self-information.
- [ ] Explain cross-entropy and KL divergence.
- [ ] Explain softmax and PyTorch CrossEntropyLoss input expectations.

## 20. Recommended Resources

- [MIT OpenCourseWare — Introduction to Probability and Statistics](https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/)
- [MIT 6.S191 — Introduction to Deep Learning](https://introtodeeplearning.com/2025/index.html)
- [IIT Madras CS7015 / CS6910 — Deep Learning](https://cse.iitm.ac.in/~miteshk/CS6910.html)
- [NPTEL — Deep Learning, IIT Madras](https://www.nptel.ac.in/courses/106106201)
