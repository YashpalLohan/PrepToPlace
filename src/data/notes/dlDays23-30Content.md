# Days 23–30 — CNN Fundamentals + Project

## 1. Overview

Convolutional Neural Networks (CNNs) are designed to process grid-like data such as images. They use local connectivity and shared filters to detect spatial patterns.

This block covers:
- Convolution and learnable filters
- Padding, stride, and output dimensions
- Pooling and receptive fields
- CNN architecture and tensor shapes
- CNN vs fully connected ANN
- Backpropagation through convolution and pooling
- Data augmentation
- Transfer learning and fine-tuning
- A practical image-classification project

## 2. Why CNNs for Images?

An image contains local spatial structure:
- Nearby pixels are related.
- Edges and textures often appear in local regions.
- Similar patterns can appear at different image locations.

A fully connected layer connects every input pixel to every output unit. This can create a huge parameter count and does not explicitly encode local spatial structure.

CNNs use:
- Local receptive fields.
- Shared filters (weight sharing).
- Hierarchical feature extraction.

Early layers often learn simple patterns such as edges or textures; deeper layers combine them into more complex patterns.

## 3. Convolution Intuition

A filter/kernel is a small grid of learnable weights. It slides across the input and computes a weighted sum at each location.

For a 2D single-channel input and kernel, the convolution-style operation used in common CNN libraries is technically cross-correlation (the kernel is not flipped). Deep learning literature often calls it convolution.

For one output position:

\[
Y_{i,j}=\sum_{u=0}^{K_h-1}\sum_{v=0}^{K_w-1}X_{i+u,j+v}K_{u,v}
\]

A bias can be added to each output channel.

The filter weights are learned through backpropagation.

## 4. Channels and Filters

An image commonly has:
- 1 channel for grayscale.
- 3 channels for RGB.

A convolutional layer can accept multiple input channels and produce multiple output channels.

For input `(B, C_in, H, W)` and a convolution with `C_out` filters, the output is `(B, C_out, H_out, W_out)`.

Each output channel is produced by a filter spanning all input channels.

## 5. Output Shape: Kernel, Padding, and Stride

For one spatial dimension:

\[
O=\left\lfloor\frac{I+2P-D(K-1)-1}{S}+1\right\rfloor
\]

where:
- \(I\): input size.
- \(O\): output size.
- \(K\): kernel size.
- \(P\): padding.
- \(S\): stride.
- \(D\): dilation.

For a standard non-dilated convolution, \(D=1\).

### Example

Input width \(I=32\), kernel \(K=3\), padding \(P=1\), stride \(S=1\), dilation \(D=1\):

\[
O=\left\lfloor\frac{32+2-2-1}{1}+1\right\rfloor=32
\]

The output width remains 32.

## 6. Padding

Padding adds values (commonly zeros) around the input boundary.

Common concepts:
- **Valid:** no padding.
- **Same-style:** choose padding so output spatial size is preserved for stride 1 with suitable kernel/dilation settings.

Padding helps preserve border information and control output dimensions.

## 7. Stride

Stride determines how far the filter moves at each step.

- Stride 1: moves one position at a time.
- Stride 2: skips positions and reduces spatial resolution more quickly.

Larger stride reduces output dimensions and computation, but may discard spatial detail.

## 8. Pooling

Pooling reduces spatial dimensions by summarising local regions.

### Max pooling

Returns the maximum value in each pooling window.

### Average pooling

Returns the average value in each window.

Pooling can reduce computation and provide some robustness to small local shifts, but it also discards precise spatial information. Modern architectures may use strided convolutions or global average pooling instead of repeated max pooling.

## 9. Receptive Field

The receptive field of a unit is the region of the original input that can influence it.

As layers are stacked, receptive fields grow.

For stride and dilation-aware calculation in one dimension, keep track of:
- \(r_l\): receptive field size at layer \(l\).
- \(j_l\): effective jump (distance between neighbouring output locations in original input coordinates).

Starting with \(r_0=1\), \(j_0=1\):

\[
r_l=r_{l-1}+(K_l-1)D_lj_{l-1}
\]

\[
j_l=j_{l-1}S_l
\]

This helps explain how deeper CNN units can integrate information from larger image regions.

## 10. Typical CNN Architecture

A simple image-classification CNN:

```text
Input image
    |
Convolution + ReLU
    |
Pooling
    |
Convolution + ReLU
    |
Pooling
    |
Flatten / Global Average Pooling
    |
Fully Connected Layer
    |
Class logits
```

More advanced architectures use residual connections, normalisation, bottleneck blocks, and global average pooling.

## 11. CNN vs Fully Connected ANN

| Property | Fully Connected ANN | CNN |
|---|---|---|
| Connectivity | Every unit connects to all previous features | Local receptive fields |
| Weight sharing | Usually no spatial sharing | Filters shared across positions |
| Image structure | Not explicitly built in | Spatial structure is built in |
| Parameters | Can be very large for raw images | Often much fewer parameters |
| Translation behaviour | Not naturally encoded | Shared filters provide some translation equivariance |
| Common use | Tabular/features, dense heads | Images and spatial data |

Convolution provides translation equivariance under suitable conditions; pooling and other operations can create some local shift tolerance. A CNN is not perfectly invariant to arbitrary transformations.

## 12. CNN Backpropagation Intuition

A convolutional layer has shared filter weights. During the forward pass, each filter is applied at many spatial positions.

During backpropagation:
- Gradients are calculated for each output position.
- Contributions from all positions are accumulated for shared filter weights.
- Input gradients are propagated to earlier layers.
- Bias gradients aggregate contributions across locations and batch elements.

For max pooling, the gradient is routed through the location that produced the maximum in each pooling window (subject to tie handling). Average pooling distributes gradients across the window according to its averaging operation.

You do not need to derive every index in an interview, but should explain why shared filters accumulate gradient contributions from multiple positions.

## 13. Data Augmentation

Data augmentation creates transformed training examples intended to preserve the label while increasing variation.

Common image augmentations:
- Random crop and resize.
- Horizontal flip (only when label semantics allow it).
- Small rotations.
- Colour jitter.
- Random erasing.
- Mild blur or noise when realistic.

### Important rules
- Apply stochastic augmentation to training data only.
- Validation and test preprocessing should be deterministic and representative.
- Augmentations must preserve the target label.
- Avoid transformations that create unrealistic or misleading samples.

For example, horizontal flipping may be unsafe if left/right orientation changes the class meaning.

## 14. Transfer Learning

Transfer learning reuses a model trained on a large dataset for a related task.

Common workflow:
1. Load a pretrained model.
2. Replace its classification head for the new number of classes.
3. Freeze the backbone initially.
4. Train the new head.
5. Optionally unfreeze some/all backbone layers.
6. Fine-tune with a smaller learning rate.
7. Compare against a scratch-trained baseline when feasible.

### Feature extraction vs fine-tuning

- **Feature extraction:** backbone weights are frozen; only the new head is trained.
- **Fine-tuning:** some or all pretrained weights are updated on the target dataset.

Transfer learning is especially useful when the target dataset is small or compute is limited, but the source and target domains should be sufficiently related.

## 15. Transfer Learning with PyTorch

The following example uses a pretrained ResNet18 from torchvision. It assumes an installed compatible `torch` and `torchvision`, and that the data loaders produce image tensors using preprocessing compatible with the selected pretrained weights.

```python
import torch
from torch import nn
from torchvision.models import resnet18, ResNet18_Weights

num_classes = 5
weights = ResNet18_Weights.DEFAULT

model = resnet18(weights=weights)

# Freeze pretrained backbone
for parameter in model.parameters():
    parameter.requires_grad = False

# Replace task-specific classification head
in_features = model.fc.in_features
model.fc = nn.Linear(in_features, num_classes)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)
```

Use the preprocessing transform recommended by the selected weights:

```python
preprocess = weights.transforms()
```

For training-time augmentation, create a separate training transform compatible with the input expectations, then use deterministic validation preprocessing.

## 16. Fine-Tuning the Backbone

After the head has learned a reasonable task-specific mapping, unfreeze selected layers and fine-tune cautiously.

```python
# Example: unfreeze the final residual block
for parameter in model.layer4.parameters():
    parameter.requires_grad = True

optimizer = torch.optim.AdamW([
    {"params": model.layer4.parameters(), "lr": 1e-4},
    {"params": model.fc.parameters(), "lr": 5e-4}
], weight_decay=1e-4)
```

Use a smaller learning rate for pretrained layers to avoid destroying useful representations too quickly.

## 17. Project: Image Classification

### Project objective

Build an image classifier using a documented dataset, a reproducible training pipeline, and transfer learning.

Example project options:
- Cats vs Dogs.
- Plant disease classification.
- Food image classification.
- Waste category classification.
- A small custom image dataset with clear labels.

Choose a dataset with a clear licence and ensure class labels are appropriate.

### Project workflow

1. Define classes and the prediction objective.
2. Inspect sample images, class counts, duplicates, and label quality.
3. Split into train, validation, and test sets at the correct entity level.
4. Apply training-only augmentation.
5. Start with a simple CNN or pretrained feature extractor.
6. Train a task-specific classification head.
7. Fine-tune selected backbone layers if useful.
8. Monitor train/validation loss and class-wise metrics.
9. Evaluate once on the final test set.
10. Inspect misclassified examples.
11. Save the complete model state and inference preprocessing configuration.
12. Create a small demo or API.

### Evaluation

Report:
- Accuracy.
- Precision, recall, and F1 per class.
- Confusion matrix.
- Macro-F1 if classes are imbalanced.
- Training time and model size.
- Typical failure cases.

Do not rely on accuracy alone when class distribution is uneven.

## 18. Save and Load a PyTorch Model

Saving a state dictionary is a common approach:

```python
torch.save(model.state_dict(), "cnn_weights.pth")
```

Recreate the same architecture and load the weights:

```python
model = resnet18(weights=None)
model.fc = nn.Linear(model.fc.in_features, num_classes)
model.load_state_dict(torch.load("cnn_weights.pth", map_location="cpu"))
model.eval()
```

Keep the architecture definition, class-index mapping, preprocessing transforms, and package versions with the artifact so inference can be reproduced.

## 19. Common Mistakes

- Confusing convolution with elementwise multiplication.
- Forgetting the channel dimension in convolution.
- Calculating output size incorrectly.
- Assuming padding and stride are interchangeable.
- Applying random augmentation to validation/test data.
- Using flips or rotations that change label meaning.
- Forgetting pretrained weights' expected normalization.
- Training all pretrained layers at a high learning rate immediately.
- Ignoring class imbalance.
- Evaluating on near-duplicate or leakage-contaminated images.
- Saving weights without class mapping and preprocessing details.

## 20. Placement and Interview Questions

**Q1. Why are CNNs effective for images?**  
They use local connectivity and shared filters to detect spatial patterns with fewer parameters than a large fully connected layer over raw pixels.

**Q2. What is a convolution filter?**  
A learnable weight tensor applied across local input regions to produce feature maps.

**Q3. What do stride and padding control?**  
Stride controls movement step and output resolution; padding controls boundary treatment and output dimensions.

**Q4. What is a receptive field?**  
The region of the original input that can influence a particular feature-map unit.

**Q5. What is weight sharing?**  
The same filter parameters are used at different spatial locations.

**Q6. CNN vs ANN?**  
CNNs exploit spatial locality and shared filters; fully connected ANNs do not inherently encode image-grid structure.

**Q7. What happens during convolution backpropagation?**  
Gradient contributions from different spatial applications of a shared filter are accumulated into the same filter parameters.

**Q8. Feature extraction vs fine-tuning?**  
Feature extraction freezes the pretrained backbone; fine-tuning updates some or all pretrained weights.

**Q9. Why use transfer learning?**  
It reuses useful learned features, often improving data and compute efficiency on related tasks.

## 21. Practice

### Paper exercises
1. Calculate output size for input 64, kernel 5, padding 2, stride 2, dilation 1.
2. Explain how receptive field grows through two convolution layers.
3. Compare max pooling and average pooling.
4. Explain how shared filters affect parameter count.
5. Describe which parts of a transfer-learning model are trained during feature extraction and fine-tuning.

### Coding exercise
Complete the image-classification project:
- Load a labelled dataset.
- Split without entity leakage.
- Create training augmentation and deterministic validation transforms.
- Use a pretrained ResNet18.
- Train the classification head.
- Fine-tune the final block.
- Log metrics and checkpoints.
- Inspect the confusion matrix and failure cases.
- Save model weights, label mapping, and inference preprocessing.

## 22. Eight-Day Study / Project Plan

| Roadmap days | Focus | Deliverable |
|---|---|---|
| 23–24 | Convolution, channels, padding, stride, output shapes | Work 5 output-shape problems |
| 25 | Pooling and receptive field | Draw a CNN and calculate receptive field |
| 26 | CNN architecture and CNN vs ANN | Implement a small CNN |
| 27 | CNN backpropagation intuition | Explain shared-filter gradient accumulation |
| 28 | Data augmentation | Create train/validation transforms |
| 29 | Transfer learning | Train a frozen-backbone model |
| 30 | Fine-tuning and project review | Report metrics, errors, and demo |

## 23. Quick Revision

- Convolution: local weighted operation with shared filters.
- Channels: input and output feature maps.
- Padding: boundary extension.
- Stride: filter movement step.
- Pooling: spatial downsampling.
- Receptive field: original input region influencing a unit.
- CNN: local connectivity + weight sharing.
- Backprop: shared filter gradients accumulate across positions.
- Augmentation: label-preserving training variation.
- Transfer learning: reuse pretrained representations.
- Feature extraction: freeze backbone.
- Fine-tuning: update pretrained weights.

## 24. Final Checklist

- [ ] Explain convolution and channel dimensions.
- [ ] Calculate output height and width.
- [ ] Explain padding, stride, and pooling.
- [ ] Calculate receptive-field growth.
- [ ] Compare CNNs and fully connected ANNs.
- [ ] Explain convolution and pooling backpropagation.
- [ ] Design safe training augmentation.
- [ ] Load pretrained weights and replace a classifier head.
- [ ] Distinguish feature extraction from fine-tuning.
- [ ] Complete and document an image-classification project.

## 25. Recommended Resources

- [CampusX 100 Days of Deep Learning — Days 40–53](https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn)
- [Stanford CS231n — Deep Learning for Computer Vision](https://cs231n.stanford.edu/)
- [Stanford CS231n — Course Notes](https://cs231n.github.io/)
- [Stanford CS231n — Schedule and Course Materials](https://cs231n.stanford.edu/schedule.html)
- [PyTorch — Transfer Learning Tutorial](https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html)
