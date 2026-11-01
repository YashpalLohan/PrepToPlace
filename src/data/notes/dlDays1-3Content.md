# Days 1–3 — Math for Deep Learning

## 1. Overview

Deep learning models are built from operations on vectors, matrices, and higher-dimensional tensors. Their parameters are arrays of numbers, their forward pass is a sequence of tensor operations, and training uses derivatives to update those parameters.

This block establishes the mathematical language used throughout deep learning:

- Scalars, vectors, matrices, and tensors
- Shapes, dimensions, indexing, and broadcasting
- Dot products, matrix multiplication, and linear transformations
- Norms, distance, rank, and linear independence
- Eigenvalues, eigenvectors, and eigendecomposition
- Singular Value Decomposition (SVD)
- NumPy practice for model-shaped data

## 2. Scalars, Vectors, Matrices, and Tensors

A **scalar** is one number, such as \(3.5\). A **vector** is an ordered collection of numbers. A **matrix** is a two-dimensional array. A **tensor** is the general term for a multi-dimensional array.

| Object | Example shape | Interpretation |
|---|---|---|
| Scalar | `()` | One value |
| Vector | `(4,)` | Four features or values |
| Matrix | `(3, 4)` | Three rows and four columns |
| 3D tensor | `(32, 10, 4)` | A batch of sequences, each with time steps and features |
| Image batch | `(B, C, H, W)` | Batch, channels, height, width (common PyTorch convention) |

A tensor's **rank** in programming usually means its number of axes. Do not confuse tensor rank with matrix rank, which is a separate linear-algebra concept.

Shape discipline is essential. Many deep learning errors are shape mismatches rather than complicated mathematical errors.

## 3. Vectors and Vector Operations

For vectors \(a,b\in\mathbb{R}^n\):

### Addition

\[
a+b=[a_1+b_1,\ldots,a_n+b_n]
\]

Vectors can be added when their shapes match.

### Scalar multiplication

\[
\alpha a=[\alpha a_1,\ldots,\alpha a_n]
\]

### Dot product

\[
a^Tb=\sum_{i=1}^{n}a_ib_i
\]

The dot product returns a scalar. Geometrically:

\[
a^Tb=\|a\|_2\|b\|_2\cos\theta
\]

It measures alignment between vectors. In a neuron, the weighted sum \(w^Tx+b\) is a dot product plus a bias.

### Worked example

Let \(a=[2,1,3]\) and \(b=[1,4,2]\).

\[
a^Tb=2(1)+1(4)+3(2)=12
\]

## 4. Matrices and Matrix Operations

A matrix \(A\in\mathbb{R}^{m\times n}\) has \(m\) rows and \(n\) columns.

### Transpose

The transpose swaps rows and columns:

\[
A\in\mathbb{R}^{m\times n}
\quad\Rightarrow\quad
A^T\in\mathbb{R}^{n\times m}
\]

### Matrix multiplication

If \(A\) has shape \((m,n)\) and \(B\) has shape \((n,p)\), then:

\[
AB\in\mathbb{R}^{m\times p}
\]

The inner dimensions must match. Matrix multiplication is generally not commutative: \(AB\neq BA\).

### Matrix-vector multiplication

\[
y=Ax
\]

If \(A\) has shape \((m,n)\) and \(x\) has shape \((n,)\), then \(y\) has shape \((m,)\).

A fully connected neural-network layer often computes:

\[
z=xW^T+b
\]

For a batch-first representation, if `x` is `(batch, input_features)` and `W` is `(output_features, input_features)`, the output is `(batch, output_features)`.

## 5. Linear Transformations

A matrix can represent a linear transformation: it maps an input vector to an output vector while preserving vector addition and scalar multiplication.

Examples include:
- Scaling a vector.
- Rotating a vector.
- Reflecting a vector.
- Projecting a vector onto a subspace.
- Combining several input coordinates into new coordinates.

A neural network layer applies an affine transformation \(Wx+b\), followed by a nonlinear activation. The bias makes the operation affine; the activation provides nonlinearity.

## 6. Linear Independence, Span, Basis, and Rank

- **Span:** all linear combinations of a set of vectors.
- **Linear independence:** no vector in the set can be expressed as a linear combination of the others.
- **Basis:** a linearly independent set that spans the space.
- **Rank:** number of linearly independent rows or columns of a matrix.

Rank tells us how many independent directions a matrix transformation preserves.

A matrix with low rank contains redundant linear structure. Low-rank structure matters in compression, dimensionality reduction, and parameter-efficient approximations.

## 7. Norms and Distances

A norm measures the size of a vector.

### L1 norm

\[
\|x\|_1=\sum_i |x_i|
\]

### L2 norm

\[
\|x\|_2=\sqrt{\sum_i x_i^2}
\]

### Squared L2 norm

\[
\|x\|_2^2=\sum_i x_i^2
\]

### L-infinity norm

\[
\|x\|_\infty=\max_i |x_i|
\]

For vectors \(x,y\), Euclidean distance is:

\[
d(x,y)=\|x-y\|_2
\]

Norms appear in regularisation, optimisation, distance calculations, and gradient clipping.

## 8. Eigenvalues and Eigenvectors

For a square matrix \(A\), a non-zero vector \(v\) is an eigenvector if:

\[
Av=\lambda v
\]

Here \(\lambda\) is its eigenvalue.

Interpretation: applying \(A\) changes the magnitude of \(v\) by a factor \(\lambda\), but does not change its direction (a negative value reverses direction).

Eigenvectors identify special directions of a linear transformation. Eigenvalues describe the amount of scaling along those directions.

### Worked example

For:

\[
A=\begin{bmatrix}2&0\\0&3\end{bmatrix}
\]

The vectors \(e_1=[1,0]^T\) and \(e_2=[0,1]^T\) are eigenvectors, with eigenvalues 2 and 3 respectively.

## 9. Eigendecomposition

If a matrix has enough linearly independent eigenvectors, it can be decomposed as:

\[
A=Q\Lambda Q^{-1}
\]

where:
- \(Q\) contains eigenvectors as columns.
- \(\Lambda\) is diagonal and contains eigenvalues.

For a real symmetric matrix, eigenvectors can be chosen orthonormal:

\[
A=Q\Lambda Q^T
\]

This is especially useful for covariance matrices and PCA.

Not every square matrix is diagonalizable. Do not assume every matrix has a full eigendecomposition.

## 10. Singular Value Decomposition (SVD)

Any real matrix \(A\in\mathbb{R}^{m\times n}\) can be decomposed as:

\[
A=U\Sigma V^T
\]

where:
- \(U\) contains left singular vectors.
- \(V\) contains right singular vectors.
- \(\Sigma\) contains non-negative singular values on its diagonal.

SVD works for rectangular matrices and is more general than eigendecomposition.

### Why SVD matters

- Low-rank approximation and compression.
- Dimensionality reduction.
- Denoising.
- Understanding matrix rank.
- Stable numerical algorithms.

A truncated SVD keeps the largest \(k\) singular values and their corresponding vectors:

\[
A\approx U_k\Sigma_kV_k^T
\]

The result is a rank-\(k\) approximation.

## 11. Eigen Decomposition vs SVD

| Property | Eigendecomposition | SVD |
|---|---|---|
| Input | Square matrix | Any rectangular matrix |
| Main components | Eigenvectors and eigenvalues | Left/right singular vectors and singular values |
| Always exists? | Not as a full real diagonalisation for every matrix | Yes for real matrices |
| Common use | Symmetric matrices, covariance, PCA theory | Compression, low-rank approximation, numerical methods |

For a symmetric positive semidefinite covariance matrix, eigenvalues are non-negative and the eigenvectors describe principal directions.

## 12. NumPy Practice

```python
import numpy as np

# Vector and dot product
a = np.array([2.0, 1.0, 3.0])
b = np.array([1.0, 4.0, 2.0])
print("dot:", np.dot(a, b))

# Matrix multiplication and shape
A = np.array([[1.0, 2.0], [3.0, 4.0]])
B = np.array([[2.0, 0.0], [1.0, 2.0]])
C = A @ B
print("C:", C)
print("shape:", C.shape)

# Norms
print("L1:", np.linalg.norm(a, ord=1))
print("L2:", np.linalg.norm(a))

# Eigenvalues/eigenvectors (square matrix)
values, vectors = np.linalg.eig(A)
print("eigenvalues:", values)

# SVD
U, singular_values, Vt = np.linalg.svd(A, full_matrices=False)
print("singular values:", singular_values)
```

Use `@` for matrix multiplication. `*` performs elementwise multiplication in NumPy.

## 13. Tensor Shapes in Deep Learning

Examples:
- Batch of tabular rows: `(B, F)`.
- Batch of token embeddings: `(B, T, D)`.
- Batch of grayscale images: `(B, 1, H, W)`.
- Batch of RGB images in PyTorch: `(B, 3, H, W)`.

Always ask:
1. What does each axis represent?
2. Which axes are batch, channel, sequence, height, width, or feature?
3. Which axes are being reduced or multiplied?
4. Does the layer expect channels-first or channels-last?

## 14. Common Mistakes

- Confusing tensor rank (number of axes) with matrix rank.
- Multiplying matrices with incompatible inner dimensions.
- Using `*` when matrix multiplication `@` is intended.
- Assuming matrix multiplication is commutative.
- Confusing eigenvalues with singular values.
- Assuming every square matrix is diagonalizable.
- Forgetting that SVD is valid for rectangular matrices.
- Ignoring batch and channel dimensions in model inputs.

## 15. Placement and Interview Questions

**Q1. What is a tensor?**  
A multi-dimensional array; scalars, vectors, and matrices are special cases.

**Q2. What is the shape of \(AB\) if A is \(m\times n\) and B is \(n\times p\)?**  
The result is \(m\times p\).

**Q3. What is a dot product used for in a neuron?**  
It computes the weighted sum of input features before adding the bias and applying an activation.

**Q4. What is matrix rank?**  
The number of linearly independent rows or columns.

**Q5. What is an eigenvector?**  
A non-zero vector whose direction is preserved by a square matrix transformation, up to scaling.

**Q6. When is symmetric eigendecomposition especially useful?**  
For real symmetric matrices such as covariance matrices, whose eigenvectors can be chosen orthonormal.

**Q7. Why is SVD more general than eigendecomposition?**  
SVD applies to rectangular matrices and exists for every real matrix.

**Q8. What is a low-rank approximation?**  
An approximation that retains only the largest singular components of a matrix.

## 16. Practice

### Paper exercises
1. If \(A\) is `(4, 3)` and \(B\) is `(3, 2)`, state the shape of `A @ B`.
2. Calculate the dot product of `[1, 2, 3]` and `[4, 0, -1]`.
3. Calculate the L1 and L2 norms of `[3, 4]`.
4. For a diagonal matrix `diag(2, 5)`, identify its eigenvalues and eigenvectors.
5. Explain why SVD can be applied to a `(100, 20)` matrix.

### Coding exercise
Generate a random matrix, inspect its rank, compute its SVD, reconstruct it from all singular values, then compare reconstruction error when keeping only the top `k` singular values.

## 17. Quick Revision

- Scalar: zero-dimensional value.
- Vector: one-dimensional array.
- Matrix: two-dimensional array.
- Tensor: general multi-dimensional array.
- Dot product: weighted alignment / scalar result.
- Matrix multiplication: inner dimensions must match.
- Norm: size of a vector.
- Eigenvector: special direction of a square transformation.
- Eigenvalue: scaling along that direction.
- Eigendecomposition: \(A=Q\Lambda Q^{-1}\) when diagonalizable.
- SVD: \(A=U\Sigma V^T\), works for rectangular matrices.
- Low-rank approximation: keep largest singular components.

## 18. Final Checklist

- [ ] Read and explain tensor shapes.
- [ ] Perform vector and matrix operations.
- [ ] Distinguish elementwise multiplication from matrix multiplication.
- [ ] Calculate L1 and L2 norms.
- [ ] Explain rank, basis, and linear independence.
- [ ] Explain eigenvalues and eigenvectors.
- [ ] State when symmetric eigendecomposition applies.
- [ ] Explain SVD and low-rank approximation.
- [ ] Use NumPy for all core operations.

## 19. Recommended Resources

- [3Blue1Brown — Essence of Linear Algebra](https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr)
- [Understanding Deep Learning — Simon Prince](https://udlbook.github.io/udlbook/)
- [IIT Madras CS7015 / CS6910 — Deep Learning](https://cse.iitm.ac.in/~miteshk/CS6910.html)
- [IIT Madras Deep Learning course page](https://study.iitm.ac.in/ds/course_pages/BSCS3004.html)
