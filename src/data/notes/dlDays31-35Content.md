# Days 31–35 — Advanced CNN Architectures

## 1. Overview

This block moves from basic convolutional networks to architectures used for image classification, segmentation, and object detection.

Core topics:
- AlexNet, VGG, and ResNet
- Residual connections and Batch Normalization
- Semantic segmentation and U-Net
- Object detection pipeline
- R-CNN, Fast R-CNN, and Faster R-CNN

The key distinction to remember is the task:
- **Classification:** one label for an image.
- **Object detection:** class labels and bounding boxes for objects.
- **Semantic segmentation:** a class label for each pixel.

## 2. Why Advanced CNN Architectures Emerged

Early CNNs showed that learned visual features could outperform manually engineered features. As models became deeper, researchers had to address:
- Optimisation difficulty.
- Vanishing or unstable gradients.
- Parameter and compute cost.
- Need for spatially precise outputs.
- Need to locate multiple objects rather than classify an entire image.

Each architecture introduced design choices that addressed different bottlenecks.

## 3. AlexNet

AlexNet was a breakthrough deep CNN for large-scale image classification.

High-level architecture:
- Several convolutional layers.
- ReLU activations.
- Max-pooling layers.
- Fully connected classification layers.
- Dropout in fully connected layers.
- Softmax class output.

### Important contributions
- Demonstrated the effectiveness of deep CNNs on ImageNet-scale data.
- Used ReLU to improve optimisation speed compared with saturating activations used in earlier networks.
- Used GPU computation to train a large model.
- Used data augmentation and dropout to reduce overfitting.

### Limitations and historical context
AlexNet's fully connected layers contributed substantially to parameter count. Later architectures improved depth, efficiency, and feature reuse.

## 4. VGG Networks

VGG explored the effect of increasing depth using repeated small \(3\times3\) convolution filters.

Common variants:
- VGG-16: 16 weight layers.
- VGG-19: 19 weight layers.

### Main design idea
Instead of using large filters throughout, stack multiple small convolutions.

For example, two \(3\times3\) convolutions have a receptive-field effect similar to a larger spatial region while introducing an additional nonlinearity between them.

### Strengths
- Simple and uniform architecture.
- Easy to understand.
- Useful as a feature extractor and historical backbone.

### Limitations
- Large parameter count, especially in the fully connected classifier.
- Considerable memory and compute requirements.
- Greater depth did not alone solve optimisation problems for arbitrarily deep networks.

## 5. ResNet and Residual Connections

Very deep plain networks can become difficult to optimise. ResNet introduces a **skip connection** that lets a block learn a residual mapping.

Instead of learning a direct mapping \(H(x)\), a residual block learns:

\[
F(x)=H(x)-x
\]

and outputs:

\[
y=F(x)+x
\]

The identity path provides a route for information and gradients to pass through the block.

```text
Input x ───────────────┐
   |                   |
Convolution            |
   |                   |
BatchNorm              |
   |                   |
ReLU                   |
   |                   |
Convolution            |
   |                   |
BatchNorm              |
   |                   |
   +──── Add x ◄───────┘
          |
         ReLU
          |
        Output
```

If dimensions differ, a projection shortcut (often a \(1\times1\) convolution) can transform the skip path to match the residual branch.

### Why residual connections help
- Make very deep networks easier to train.
- Provide a direct information path.
- Help gradients flow through identity shortcuts.
- Allow blocks to learn refinements to an identity mapping.

Residual connections do not guarantee that every deep network will train perfectly; optimisation, data, and architecture still matter.

## 6. ResNet Variants and Basic vs Bottleneck Blocks

Common model families include ResNet-18, ResNet-34, ResNet-50, ResNet-101, and ResNet-152.

- Shallower variants commonly use basic residual blocks.
- Deeper variants commonly use bottleneck blocks with \(1\times1\), \(3\times3\), and \(1\times1\) convolutions.
- A \(1\times1\) convolution can reduce or expand channel dimensions efficiently.

### Basic block intuition
Two spatial convolutions with a skip addition.

### Bottleneck intuition
Reduce channels, perform spatial processing, then expand channels. This reduces the cost of deep networks.

## 7. Batch Normalization in CNN Architectures

Batch Normalization normalises activations using mini-batch statistics during training, followed by learned scale and shift:

\[
\hat{x}=\frac{x-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}
\]

\[
y=\gamma\hat{x}+\beta
\]

For CNN feature maps, BatchNorm commonly calculates statistics per channel over batch and spatial positions.

During evaluation, running statistics accumulated during training are used in typical configurations.

Benefits:
- Can stabilise optimisation.
- Often allows more effective learning-rate choices.
- Can help training converge faster.

Cautions:
- Small or unrepresentative batches can make batch statistics noisy.
- Use `model.train()` and `model.eval()` correctly.
- BatchNorm is not a replacement for valid input preprocessing or regularisation.

## 8. Classification vs Detection vs Segmentation

| Task | Output | Example |
|---|---|---|
| Image classification | One or more labels for the whole image | Cat / dog |
| Object detection | Bounding boxes + class scores | Find every car and person |
| Semantic segmentation | Pixel-level class map | Every road pixel vs building pixel |
| Instance segmentation | Separate mask for each object instance | Distinguish car 1 from car 2 |

Semantic segmentation groups pixels by class and does not necessarily separate two objects of the same class into distinct instances.

## 9. Semantic Segmentation

A segmentation model predicts a class for every pixel.

Input: image of shape `(B, C, H, W)`.

Output logits commonly have shape `(B, num_classes, H, W)`.

For multi-class segmentation:
- Target mask usually has shape `(B, H, W)`.
- Each target pixel stores a class index.
- Pixel-wise cross-entropy is a common loss.

### Evaluation metrics
- Pixel accuracy.
- Per-class precision and recall.
- Intersection over Union (IoU).
- Mean IoU (mIoU).
- Dice coefficient / Dice score.

For a class:

\[
IoU=\frac{|Prediction\cap GroundTruth|}{|Prediction\cup GroundTruth|}
\]

\[
Dice=\frac{2|Prediction\cap GroundTruth|}{|Prediction|+|GroundTruth|}
\]

IoU and Dice are related overlap metrics. They are often more informative than pixel accuracy when the background dominates.

## 10. U-Net Architecture

U-Net is an encoder–decoder CNN architecture originally designed for biomedical image segmentation.

### Encoder / contracting path
- Convolutions extract features.
- Downsampling reduces spatial size.
- Channel depth generally increases.
- Deeper features capture broader context.

### Decoder / expansive path
- Upsampling restores spatial resolution.
- Convolutions refine features.
- Skip connections bring high-resolution encoder features into the decoder.

```text
Input
  |
Encoder block → Downsample
  |
Encoder block → Downsample
  |
Bottleneck
  |
Upsample + skip features ← Encoder features
  |
Decoder block
  |
Upsample + skip features ← Encoder features
  |
Pixel-wise segmentation map
```

### Why skip connections matter in U-Net
The encoder captures context but loses spatial detail during downsampling. Skip connections provide high-resolution features to the decoder, helping recover boundaries and localisation.

Original U-Net implementations concatenate encoder and decoder features. Other architectures may add them.

## 11. U-Net Losses and Data

Common loss choices:
- Pixel-wise cross-entropy for multi-class masks.
- Binary cross-entropy for binary segmentation.
- Dice loss for overlap-oriented optimisation.
- Combined BCE + Dice or cross-entropy + Dice for some tasks.

Data preparation:
- Image and mask must receive spatially identical augmentations.
- Use nearest-neighbour interpolation for categorical masks.
- Normalise input images consistently.
- Handle class imbalance across pixels.
- Split by patient, subject, scene, or source entity when leakage is possible.

## 12. Object Detection Basics

An object detector typically predicts:
1. Bounding-box coordinates.
2. Objectness or confidence.
3. Class probabilities.

Bounding boxes may be represented as `(x_min, y_min, x_max, y_max)` or center/width/height. Coordinate conventions must remain consistent.

### Intersection over Union

\[
IoU=\frac{Area(B_p\cap B_g)}{Area(B_p\cup B_g)}
\]

IoU measures overlap between a predicted and ground-truth box.

### Non-Maximum Suppression (NMS)
NMS removes many overlapping duplicate predictions:
1. Sort predictions by score.
2. Select the highest-scoring box.
3. Suppress lower-scoring boxes with high overlap to the selected box.
4. Repeat.

Class-aware NMS generally performs this process independently by class, depending on detector design.

## 13. R-CNN

R-CNN is a region-based object detection approach.

High-level steps:
1. Generate region proposals (candidate object regions).
2. Crop/warp each proposal.
3. Run CNN feature extraction for each region.
4. Classify each region.
5. Refine bounding boxes.

### Main limitation
Running CNN computation separately for many region proposals is expensive and slow. Training also involves multiple stages in the original approach.

## 14. Fast R-CNN

Fast R-CNN improves efficiency by:
- Running the CNN once over the full image to produce a feature map.
- Projecting region proposals onto the shared feature map.
- Using RoI pooling to create fixed-size region features.
- Predicting class scores and bounding-box refinements from shared features.

The key improvement is shared convolutional computation rather than re-running the CNN independently for every proposal.

However, the region proposal generation stage remains a separate bottleneck in the original Fast R-CNN pipeline.

## 15. Faster R-CNN

Faster R-CNN introduces a Region Proposal Network (RPN) that shares convolutional features with the detector.

Pipeline:
1. Backbone CNN extracts feature maps.
2. RPN proposes candidate regions and objectness scores.
3. RoI features are extracted.
4. Detection head predicts class and box refinement.

The RPN makes proposal generation learnable and shares features with the detection network.

### R-CNN family comparison

| Model | Region proposals | CNN computation | Main change |
|---|---|---|---|
| R-CNN | External proposal method | CNN per proposal | Region-based CNN features |
| Fast R-CNN | External proposals | Shared full-image CNN | RoI pooling and joint classification/box regression |
| Faster R-CNN | Learned RPN | Shared backbone with RPN | Learned proposals integrated with detector |

These are two-stage detectors: proposal generation is followed by region classification/refinement.

## 16. PyTorch Transfer-Learning Example with ResNet

```python
import torch
from torch import nn
from torchvision.models import resnet18, ResNet18_Weights

weights = ResNet18_Weights.DEFAULT
model = resnet18(weights=weights)

num_classes = 5
model.fc = nn.Linear(model.fc.in_features, num_classes)

preprocess = weights.transforms()

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)
```

Use the weights' recommended preprocessing for validation/inference. For training, use task-appropriate augmentation while preserving the required normalisation.

## 17. Common Mistakes

- Confusing image classification with detection and segmentation.
- Describing a residual block as merely "another convolution layer".
- Forgetting shortcut dimension matching.
- Assuming BatchNorm uses identical behaviour in training and evaluation.
- Using ordinary image interpolation for categorical segmentation masks.
- Applying different geometric transformations to an image and its mask.
- Using pixel accuracy alone on heavily imbalanced segmentation masks.
- Confusing external proposals in Fast R-CNN with the RPN in Faster R-CNN.
- Describing R-CNN, Fast R-CNN, and Faster R-CNN as having identical pipelines.

## 18. Placement and Interview Questions

**Q1. What problem did ResNet address?**  
Training very deep networks can become difficult; residual connections provide identity paths that improve optimisation and gradient flow.

**Q2. What is a residual connection?**  
A shortcut that adds a block's input to the block's learned residual output.

**Q3. Why use a \(1\times1\) convolution in a shortcut?**  
To project the input so its channel or spatial dimensions match the residual branch.

**Q4. What is the purpose of BatchNorm?**  
It normalises activations using batch statistics during training and applies learned scale/shift parameters.

**Q5. What is semantic segmentation?**  
Assigning a semantic class label to each pixel.

**Q6. Why does U-Net use skip connections?**  
To combine high-resolution encoder features with decoder features and recover spatial detail.

**Q7. What is the main inefficiency of original R-CNN?**  
It performs CNN feature extraction separately for many region proposals.

**Q8. How does Fast R-CNN improve on R-CNN?**  
It computes shared full-image convolutional features and uses RoI pooling for region features.

**Q9. How does Faster R-CNN improve on Fast R-CNN?**  
It adds a Region Proposal Network that shares backbone features to generate proposals.

## 19. Practice

### Paper exercises
1. Draw a residual block and explain the identity path.
2. Explain why a shortcut may need a \(1\times1\) projection.
3. Compare classification, detection, semantic segmentation, and instance segmentation.
4. Explain U-Net's encoder, bottleneck, decoder, and skip connections.
5. Compare R-CNN, Fast R-CNN, and Faster R-CNN stage by stage.

### Coding exercise
Choose one image task:
- Classification with pretrained ResNet18.
- Semantic segmentation with U-Net.
- Object detection using a pretrained torchvision detector.

Document the dataset, split strategy, preprocessing, augmentations, metric, confusion/failure cases, and inference pipeline.

## 20. Quick Revision

- AlexNet: early large-scale deep CNN breakthrough.
- VGG: repeated small \(3\times3\) filters and increased depth.
- ResNet: residual learning with skip connections.
- BatchNorm: batch/channel statistics during training.
- Segmentation: class per pixel.
- U-Net: encoder–decoder with skip connections.
- R-CNN: CNN per proposal.
- Fast R-CNN: shared image feature map + RoI pooling.
- Faster R-CNN: RPN shares features with detector.
- IoU: overlap metric for boxes/masks.

## 21. Final Checklist

- [ ] Compare AlexNet, VGG, and ResNet.
- [ ] Draw and explain residual connections.
- [ ] Explain BatchNorm train/eval behaviour.
- [ ] Distinguish classification, detection, and segmentation.
- [ ] Explain U-Net skip connections.
- [ ] Calculate IoU and interpret Dice.
- [ ] Explain R-CNN vs Fast R-CNN vs Faster R-CNN.
- [ ] Build or fine-tune one advanced CNN for a vision task.

## 22. Recommended Resources

- [CS231n YouTube playlist](https://www.youtube.com/results?search_query=Stanford+CS231n+official+lecture+playlist)
- [Stanford CS231n](https://cs231n.stanford.edu/)
- [CampusX CNN foundation videos](https://www.youtube.com/results?search_query=CampusX+CNN+100+Days+Deep+Learning)
- [AlexNet paper](https://proceedings.neurips.cc/paper_files/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf)
- [VGG paper](https://arxiv.org/abs/1409.1556)
- [ResNet paper](https://arxiv.org/abs/1512.03385)
- [Fast R-CNN paper](https://arxiv.org/abs/1504.08083)
- [Faster R-CNN paper](https://arxiv.org/abs/1506.01497)
