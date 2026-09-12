# Document Analysis Insight: IJMR_Volume_1_Issue_1_Complete_compressed+(1)-34-42.pdf
- **Extracted Sections**: 15
- **Schema Compliance**: Header block, Abstract, Keywords, 1. Introduction, 2. Literature and Related Work, 3. Methodology / Approach, 4. Results and Discussion, 5. Conclusion, Disclosure Statement, Ethical Approval, Consent to Participate / Consent to Publish, Use of Artificial Intelligence (AI) Tools, Funding, Competing Interests, References

---

## Header block
Islington Journal of Multidisciplinary Research V ol. 1, No. 1 | pp. 32-42

Islington College, Kathmandu, Nepal • ISSN 3149-7209 (Online) Y ear: 2026

Original Research Article

DOI: 10.67556/zjyqke62

Synthetic Data Augmentation for Multi-Class Skin Lesion

Classification: A Hybrid EfficientNetVision Transformer

Framework with Explainability AI

Aman Babu Shrestha 1,* , Abhigan Babu Shrestha 1 , Sajeena Shrestha 2 ,

1Islington College, Kathmandu, Nepal

1University of Pittsburgh Medical Center, Pittsburgh, USA

*Correspondence: np01ms7s260062@islingtoncollege.edu.np

ARTICLE HISTORY

Received: 14 March 2026 Revised: 19 April 2026

Accepted: 25 May 2026 Published: 08 June 2026

Scan to access

How to Cite (Harvard): Shrestha, A. B., Shrestha, A. B. and Shrestha, S. (2026). 'Synthetic data augmentation for multi-class skin

lesion classification: A hybrid EfficientNetVision Transformer framework with explainability AI', Islington Journal of Multidisciplinary

Research, 1(1), pp. 32-42. Available at: https://doi.org/10.67556/zjyqke62

## Abstract
This research explores the utilization of Stable Diffusion models for synthetic image augmentation aimed at generating an improved

dataset to enhance the performance of deep learning models in diagnosing skin diseases. The study utilizes the HAM10000 dataset,

which consists of seven skin lesion categories exhibiting severe class imbalance, to fine-tune a class-conditional Stable Diffusion

model for minority-class image synthesis. The resultant synthetic images, evaluated at a Fréchet Inception Distance (FID) of 98.0,a

distributional-similarity score where lower values mean closer resemblance to real images,are combined with real training images to

train a dual-branch hybrid architecture, SkinHybrid, fusing EfficientNet and Vision Transformer (ViT) representations. An ablation

study demonstrates that incorporating Stable Diffusion-generated samples improves the weighted F1-score from 84.1% to 97.0%. Post-

hoc explainability via Grad-CAM confirms that the model attends to clinically relevant dermoscopic morphology

## Keywords
Skin lesion classification, HAM10000, stable diffusion, synthetic augmentation, EfficientNet, Vision Transformer, Grad-

CAM, class imbalance, explainable AI

## 1. Introduction
Skin cancer is among the most common malignancies world-

wide, and global cancer statistics continue to show a sub-

stantial disease burden ( Sung et al. 2021 ). Patients' survival

rates also improve with early detection with more than 99%

5-year survival rate for early diagnosis compared to around

35% when the diagnosis is late ( Sung et al. 2021 ). Auto-

mated analysis of dermoscopic images is therefore an active

research area because early and accurate triage can support

clinical decision-making. Dermoscopy improves visual as-

sessment of pigmented lesions, but specialist interpretation

remains dependent on training, equipment availability, and

inter-observer consistency. Deep learning therefore offers a

promising route for scalable support tools, provided that mod-

els are accurate, interpretable, and robust across lesion classes

(Esteva et al. 2017 ; Tschandl, Codella, et al. 2019 ).

The HAM10000 released by Tschandl, Rosendahl and Kittler

(2018) in 2018 is a widely used benchmark for multi-class

skin lesion classification. It contains 10,015 dermoscopic im-

ages across seven diagnostic categories, but the distribution

is severely imbalanced: melanocytic nevi form the dominant

class, while dermatofibroma and vascular lesions contain far

fewer examples. Models trained directly on this distribution

may favour the majority class and under-detect clinically im-

portant minority classes such as melanoma and actinic ker-

atoses.

This imbalance has already been tackled in previous stud-

ies by using classical augmentation (rotation, flipping, colour

jitter), oversampling (SMOTE variants) or re-weighting loss

DOI: 10.67556/zjyqke62 32 Published by Islington College, Kathmandu, Nepal

This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International (CC BY -NC 4.0).

⟨ Shrestha et al. -- Hybrid EfficientNetViT for Skin Lesion Classification ⟩

functions such as focal loss ( Lin et al. 2017). Recently, gener-

ative adversarial networks (GANs) ( Goodfellow et al. 2014 )

have been investigated for the generation of synthetic train-

ing images, but they are subject to training instability and

mode collapse and do not produce a diversity of images. The

rise of latent diffusion models (LDMs), in particular Stable

Diffusion (Rombach et al. 2022 ) provides a more stable and

controllable alternative: finetuning with the text can generate

class-specific, photo-like dermoscopic images that can signif-

icantly augment minority class training data. Previous stud-

ies have shown that diffusion-based augmentation can boost

the performance of downstream classification tasks in medi-

cal imaging (Akrout et al. 2024 ; Azizi et al. 2023 ).

In parallel, the standard convolutional neural network (CNN)

paradigm has been complemented by Vision Transformers

(ViT) (Dosovitskiy et al. 2020), which capture long-range spa-

tial dependencies through multi-head self-attention,a property

particularly valuable in dermoscopy, where global lesion ge-

ometry (border irregularity, asymmetry) is diagnostically in-

formative alongside local texture cues. Single-pathway ver-

sus hybrid CNN + transformer global context architectures

demonstrated superior performance in several dermatologi-

cal datasets on every benchmark ( Agarwal and Mahto 2025 ).

However, along with accuracy, regulatory and clinical ac-

ceptance of AI diagnostics tools are increasingly calling for

model interpretability. One of the most common methods to

generate explainability without any modification to the archi-

tecture, and the most widely used method used in dermato-

logical AI studies ( Murali and Mazumder 2026 ; Haque et al.

2026) is Gradient weighted Class Activation Mapping (Grad-

CAM).

Taken together, the literature reviewed above leaves a spe-

cific gap: prior HAM10000 studies address class imbal-

ance either through classical augmentation and re-weighted

losses, or through hybrid CNN-Transformer architectures,

or through generative augmentation in isolation, but rarely

combine class-conditional diffusion augmentation with a hy-

brid CNN-Transformer classifier under a controlled, single-

variable ablation, and rarer still pair this with per-class Grad-

CAM verification. This motivates the present study, which is

guided by the hypothesis that class-conditional Stable Diffu-

sion augmentation, restricted to the training split and targeted

at the most severely under-represented classes, will improve

weighted F1-score and minority-class recall for SkinHybrid

relative to an identical model trained on real images only,

without degrading the model's attention to clinically relevant

lesion morphology.

## 2. Literature and Related Work
Dermatological Image Classification with Deep Learning

Esteva et al. (2017) demonstrated dermatologist-level perfor-

mance using convolutional neural networks on large-scale

clinical image data. Later HAM10000 studies focused on

seven-way lesion classification under substantial class imbal-

ance. Chaturvedi, Gupta and Prasad (2020) used a pre-trained

MobileNet backbone using a transfer learning approach that

yielded an average weighted F1-score of 83.0% for seven

classes. Nguyen, Bui and Do (2022) used a soft-attention

module and imbalance-aware loss function with Inception-

ResNetV2, which resulted in a mean F1 score of 82% and

AUC of 0.99. Tan and Le (2019) suggested compound scal-

ing of network depth, width and resolution in their Efficient-

Net and later dermoscopy studies, which obtained F1 score

greater than 93% in the variants of EfficientNet. Ma et al.

(2023) presented EFFNet, an efficientNetV2 with hierarchi-

cal bilinear pooling and a Random Forest classifier, with

a weighted F1 of 93.24%. Murali and Mazumder (2026)

presented DermaScanAI that used a multi-scale CNN with

lightweight transformer encoders and squeeze and excita-

tion attention to obtain a macro-average F1-score of 91.9%

and AUC of 0.957. Agarwal and Mahto (2025) used Con-

volutional Kolmogorov-Arnold Network (CKAN) fusion in

Sequential and Parallel Hybrid CNN-Transformer architec-

tures achieving 92.47% weighted F1. Haque et al. (2026)

proposed a three-stage progressive learning approach using

EfficientNetV2-L with channel attention, attaining macro F1

of 85.45%.

Most of these studies do not report how their data was split,

which can silently cause data leakage, and several are framed

as binary (malignant vs. benign) classifiers rather than the full

seven-way problem tackled here. Most also address class im-

balance through architecture or loss-function changes alone,

without augmenting the minority classes with additional train-

ing examples,a gap this work addresses directly.

Generative Models for Medical Image Augmentation

Ho, Jain and Abbeel (2020) introduced denoising diffusion

probabilistic models, where images are progressively noised

and denoised through a learned reverse process. Dhariwal and

Nichol (2021) later added classifier guidance to this to get an

FID score of 4.59 on ImageNet (256Œ256 synthesis), show-

ing that diffusion models are more capable than GANs on

image synthesis. Rombach et al. (2022) proposed Latent Dif-

fusion Models (LDMs), which used a V AE encoder to project

images to a lower dimensional space (latent space) and in-

troduced a cross-attention U-Net to denoise the images in the

latent space; this significantly reduced the computational cost,

and the enhanced generation quality and diversity of the im-

ages. In the literature, earlier investigations have been carried

out on GAN-based synthesis for skin lesion augmentation,

but have been limited by the instability of the training process

and mode collapse . Akrout et al. (2024) evaluated diffusion-

based augmentation across medical datasets and showed that

curated synthetic images can support downstream classifica-

tion. Our work extends this by applying class-conditional

LDM fine-tuning specifically to the seven-class HAM10000

imbalance problem and quantifying downstream effects on

a hybrid CNN-Transformer model. Azizi et al. (2023) simi-

larly demonstrated 12% accuracy improvements on ImageNet

using diffusion-synthesised augmentation at 1Œ the original

dataset size, a finding consistent with our observations.

DOI: 10.67556/zjyqke62 33 Published by Islington College, Kathmandu, Nepal

Islington Journal of Multidisciplinary Research • ISSN 3149-7209 (Online) V ol. 1, No. 1 (2026)

Hybrid CNN-Transformer Architectures

EfficientNets (Tan and Le 2019) capture local textures and hi-

erarchical spatial features through compound scaling. The

Vision Transformers ( Dosovitskiy et al. 2020 ) process im-

ages as sequences of flattened patches and use multi-head

self-attention to model dependencies between pairs of images,

making it possible to detect border asymmetry and global

shape features that are important for melanoma screening.

Several sequential hybrid models have been used where the

CNN features are used as input tokens to a transformer en-

coder, and these do better than either approach alone on der-

moscopy benchmarks ( Agarwal and Mahto 2025 ). Addition-

ally, Datta et al. (2021) demonstrated that soft-attention mech-

anisms when added to InceptionResNetV2 benefit the clas-

sification of skin cancer, demonstrating that attention mod-

elling is beneficial, even when applied to a different architec-

ture. Our SkinHybrid adopts dual-branch fusion wherein the

EfficientNet spatial features are fused with the ViT encoder,

and introduces melanoma-specific class balancing at the loss

level.

A recurring weakness across this literature is that the hybridi-

sation itself is rarely ablated in isolation: Agarwal and Mahto

(2025) compare sequential and parallel CKAN fusion variants

but do not report a CNN-only or ViT-only baseline trained

under identical settings, making it difficult to attribute re-

ported gains specifically to the fusion mechanism rather than

to other pipeline differences such as augmentation or opti-

mizer choice. SkinHybrid's ablation in Section VI.B is de-

liberately structured to avoid this confound by holding the

architecture fixed and varying only the presence of synthetic

data.

Explainability in Dermatological AI

Selvaraju et al. (2017) proposed Grad-CAM, which is a

method of computing class-discriminative localisations maps

by multiplying the spatial activations of the final convolu-

tional layer with the globally-averaged gradients of the score

computed for the target class. It is also class specific, and al-

lows for architecture independence, which is the standard ap-

proach to explain deep learning for dermatology, as clinicians

need to explain the spatial nature of the diagnosis predicted

by AI [13, 14]. This paper treats Grad-CAM accordingly, as

a qualitative sanity check rather than a certification of clinical

safety.

Problem Statement

The central problem is that multi-class dermoscopic clas-

sification remains affected by severe class imbalance. In

HAM10000, the majority NV class dominates the distribu-

tion, while clinically important minority categories such as

DF, V ASC, and AKIEC have comparatively few samples.

This imbalance can cause trained classifiers to perform well

on common classes while failing to recognise rare lesions.

Existing augmentation approaches often rely on geometric or

colour transformations that may not provide enough lesion-

level diversity. GAN-based synthesis has been explored but

can suffer from training instability and limited diversity. The

research gap is therefore the need for a controlled evaluation

of class-conditional diffusion augmentation combined with a

hybrid CNN-transformer classifier and explainability analysis

for the seven-class HAM10000 problem.

Research Objectives/Hypotheses

The main objective was to evaluate whether Stable Diffusion-

generated synthetic images can improve multi-class skin le-

sion classification under severe class imbalance. The specific

objectives were to:

• Fine-tune an SDXL-based image-generation pipeline

for selected minority skin lesion classes,

• Augment the HAM10000 training split without intro-

ducing synthetic images into validation or testing,

• Train a dual-branch EfficientNetV2-S and Vision Trans-

former classifier named SkinHybrid,

• Compare baseline and augmented performance using

weighted F1-score, recall, precision, accuracy, and

AUC,

• Use Grad-CAM to evaluate whether SkinHybrid at-

tends to clinically relevant lesion areas.

The study hypothesised that class-conditional Stable Diffu-

sion augmentation would improve weighted F1-score and

minority-class recognition compared with training SkinHy-

brid on real images only.

## 3. Methodology / Approach
Dataset and Split

HAM10000 contains 10,015 dermoscopic images from seven

diagnostic categories and is publicly available through Har-

vard Dataverse ( Tschandl, Rosendahl and Kittler 2018 ). In

this work, the dataset was split at the lesion level into train-

ing, validation, and testing subsets using a 60:20:20 ratio. The

synthetic images are created for training images only, in the

training partition; the test partition consists only of real der-

moscopic images to assure unbiased evaluation. The origi-

nal class distribution is illustrated in Table I and the synthetic

data obtained by Stable Diffusion is shown in Table II, with

some minority classes being roughly doubled to minimize

the class imbalance. The synthetic images are not generated

for NV ,MEL, BKL,BCC because its representation is already

large.

AKIEC, V ASC, and DF were chosen because, at 183, 78, and

64 real training images respectively, they are the three rarest

classes in HAM10000 (Table I) and fall below the 200-image

DOI: 10.67556/zjyqke62 34 Published by Islington College, Kathmandu, Nepal

⟨ Shrestha et al. -- Hybrid EfficientNetViT for Skin Lesion Classification ⟩

Table 1: HAM10000 Original Class Distribution

Abbr . Lesion Type Images % Total Type

NV Melanocytic Nevi 6,705 66.9% Benign

MEL Melanoma 1,113 11.1% Malignant

BKL Benign Keratosis-like Lesions 1,099 11.0% Benign

BCC Basal Cell Carcinoma 514 5.1% Malignant

AKIEC Actinic Keratoses / Intraepithelial Carcinoma 327 3.3% Malignant

V ASC V ascular Lesions 142 1.4% Benign

DF Dermatofibroma 115 1.1% Benign

Total 10,015 100%

Table 2: Training Set Before and After Stable Diffusion Augmentation

Abbr . Lesion Type Real Train Synthetic

Added

Total Train

Images

Approx. Change

NV Melanocytic Nevi 4035 0 4035 None

MEL Melanoma 674 0 674 None

BKL Benign Keratosis-like Lesions 651 0 651 None

BCC Basal Cell Carcinoma 327 0 327 None

AKIEC Actinic Keratoses 183 183 366 ∼2x increase

V ASC V ascular Lesions 78 156 234 ∼3x increase

DF Dermatofibroma 64 128 192 ∼3x increase

Total 6012 467 6479

Stable Diffusion-Based SyntheticAugmentation

The diffusion model employed in this work was SDXL Base 1.0

(Podell et al. 2023 ), a text-to-image latent diffusion model. The im-

plementation encoded dermoscopic images into a lower-dimensional

latent space and fine-tuned the conditional denoising U-Net using

class-specific clinical prompts. Low-Rank Adaptation was applied

to the U-Net attention projection layers to reduce the number of train-

able parameters and limit overfitting in minority classes.

Synthetic image quality is evaluated using Fréchet Inception Dis-

tance (FID) ( Heusel et al. 2017 ), and expert feedback from medi-

cal professionals. The overall FID was 98.0, indicating moderate

similarity between the real and synthetic image distributions while

leaving room for improvement.

An FID of 98.0 is high relative to large-scale natural-image bench-

marks, but that is not the relevant comparison for a small, narrow-

domain medical dataset. In directly comparable HAM10000

diffusion-augmentation work, Kim et al. (2025) report an FID of

145.26 for a standard Stable Diffusion baseline and 99.21 for their

improved model,closely matching our 98.0. This confirms our FID

sits within the range reported for dermatology-specific diffusion fine-

tuning, well below a typical Stable Diffusion baseline in this domain,

and supports treating it as an acceptable working value rather than a

failure signal.

SkinHybrid

SkinHybrid uses a dual-stream architecture combining an

EfficientNetV2-S convolutional branch and a ViT-B/16 transformer

branch. The EfficientNet stream extracts local dermoscopic fea-

tures such as lesion texture, colour variation, and boundary patterns,

while the Vision Transformer stream captures global contextual re-

lationships through patch-based self-attention. Both backbones are

initialized with ImageNet pre-trained weights.

The feature outputs from the two branches are projected into a shared

512-dimensional space and fused using an attention-based fusion

module. This module applies branch-wise channel attention, cross-

attention between CNN and transformer features, and a learnable

gating mechanism to adaptively weight the two representations. The

fused representation is then passed to a classification head consisting

of Dropout, Linear, ReLU, Dropout, and Linear layers, producing

logits for the seven HAM10000 classes.

Training Strategy, Loss Function, and Explainability

To address residual imbalance, the training pipeline used a weighted

sampler and a class-weighted combined loss. The combined loss

included focal loss to emphasise difficult examples and label-

smoothed cross-entropy to reduce overconfident predictions. After

training, Grad-CAM was applied to the final convolutional layer of

the EfficientNet branch to visualise class-discriminative lesion re-

gions.

Experimental Setup

All experiments were executed on a single NVIDIA H100 GPU (96

GB HBM3e VRAM, 20 vCPU) provided by Modal Platform. The

total wall-clock time was approximately 7-8 hours: Stable Diffu-

sion fine-tuning across the three augmented classes took 4-5 hours,

synthetic image generation took a further 30-45 minutes, and Skin-

Hybrid training and final prediction took approximately 2 hours. Ta-

ble 3 summarises the full hyperparameter configuration.

DOI: 10.67556/zjyqke62 35 Published by Islington College, Kathmandu, Nepal

Islington Journal of Multidisciplinary Research • ISSN 3149-7209 (Online) V ol. 1, No. 1 (2026)

Table 3: Hyperparameter Configuration Used Across All

Experiments

Hyperparameter Setting

Optimizer AdamW

Learning Rate

(initial)

0.0001

LR Schedule Cosine Annealing + 5 epoch warm-up

Weight Decay 0.01

Batch Size 1

Max Epochs 100

Data-Loading

Workers

8

Precision FP16 (mixed precision)

Backbone

Initialisation

ImageNet pre-trained

Image

Normalisation

mu = [0.485, 0.456, 0.406], sigma = [0.229, 0.224,

0.225]

Train

Augmentations

Resize, H-flip, V -flip, RandomRotate90,

ShiftScaleRotate up to 30◦, ColorJitter

GPU NVIDIA H100 (96 GB VRAM, 20 vCPU)

## 4. Results and Discussion
Results of Synthetic Image Generation

Three examples of representative real and synthetic images are

shown for each of three lesion classes (Dermatofibroma (DF), V as-

cular Lesions (V ASC), Actinic Keratoses (AKIEC)) created using

the Stable Diffusion model The synthetic samples preserved visible

lesion colour, texture, and boundary characteristics, although some

variability remained across minority classes

Response Rate and Demographic Characteristics of Re-

spondents

Figure 1: Stable Diffusion synthesis for Dermatofibroma

(DF). Left: real dermoscopic image (ISIC_0024553). Centre

and right: two synthetic variants generated by the fine-tuned

model

Figure 2: Stable Diffusion synthesis for V ascular Lesions

(V ASC). Left: real image (ISIC_0024375). Centre and right:

two synthetic variants

Figure 3: Stable Diffusion synthesis for Actinic Keratoses

(AKIEC). Left: real image (ISIC_0024522). Centre and

right: two synthetic variants

Ablation Study

To quantify the contribution of synthetic augmentation indepen-

dently of architecture changes, an ablation experiment was con-

ducted holding all other hyperparameters constant. The results, sum-

marised in Table IV , confirm that Stable Diffusion augmentation is

the dominant improvement factor.

Table 4: Ablation Study: Effect of Stable Diffusion

Augmentation

Configuration Synthetic

Data

Weighted

F1 (%)

Change

SkinHybrid (EfficientNet +

ViT, real data only)

None 84.1 -

SkinHybrid + Stable

Diffusion Augmentation

(Proposed)

LDM ∼97.0 +12.9 pp

Note. All other hyperparameters held constant. pp = percentage points.

The 12.9% point absolute gain confirms that synthetic augmentation

is the primary driver of improvement. The baseline model (84.1%

F1) performs poorly on minority classes due to data starvation; the

augmented model generalises substantially better across all seven

classes, including the rare DF and V ASC categories.

We note that the 12.9-point gain in Table IV reflects a single training

run per configuration; we have not yet repeated training across mul-

tiple seeds to obtain a variance estimate or a formal significance test,

so the gain should currently be read as a strong point estimate rather

than a statistically confirmed effect.

DOI: 10.67556/zjyqke62 36 Published by Islington College, Kathmandu, Nepal

⟨ Shrestha et al. -- Hybrid EfficientNetViT for Skin Lesion Classification ⟩

Figure 4: Baseline vs. Synthetic-Augmented overall metrics

comparison. Blue bars represent the baseline model trained

on real images only; orange bars represent SkinHybrid

trained with Stable Diffusion augmentation

Performance of Augmented Classification Models

Table V presents the detailed per-class performance of the proposed

model on both baseline and best augmented configurations.

Table 5: Per-Class Performance of SkinHybrid (EfficientNet + ViT) Baseline vs. Best Stable Diffusion Augmentation Ratio

(1× Real Images)

Baseline +SD Aug.

Class Prec. Rec. F1 AUC Prec. Rec. F1 AUC

AKIEC 61 44 51 0.952 78 (+17) 40 ( −4) 53 (+2) 0.973 (+0.021)

BCC 78 79 79 0.989 83 (+5) 74 (−5) 78 (−1) 0.992 (+0.003)

BKL 75 64 69 0.953 66 (−9) 81 (+17) 73 (+4) 0.970 (+0.017)

DF 86 50 63 0.997 62 (−24) 83 (+33) 71 (+8) 0.984 (+0.013)

MEL 43 52 47 0.910 51 (+8) 52 (+0) 51 (+4) 0.938 (+0.028)

NV 95 97 96 0.968 96 (+1) 96 (−1) 96 (+0) 0.974 (+0.006)

V ASC 95 95 95 0.999 94 (−1) 84 ( −11) 89 ( −6) 0.998 ( −0.001)

Wt. A vg 90 90 90 0.965 91 (+1) 91 (+1) 91 (+1) 0.973 (+0.008)

Macro A vg 76 69 71 0.967 76 (0) 73 (+4) 73 (+2) 0.976 (+0.09)

V ASC is the one class where augmentation was net negative on F1

(95 to 89, -6 points), driven almost entirely by an 11-point recall

drop. A plausible explanation is that the baseline V ASC model was

already near ceiling (95% precision, 95% recall, AUC 0.999) on

the strength of its distinctive red-purple vascular colour signature,

there was little headroom for augmentation to help and compara-

tively more opportunity for any distributional mismatch introduced

by synthetic samples to hurt.

Grad-CAM Results

Grad-CAM heatmaps were generated for representative samples

from AKIEC, V ASC, and NV . The visualisations showed that the

strongest activations were mainly concentrated on the lesion regions

rather than surrounding skin or image artefacts.

Figure 5: Grad-CAM heatmap for AKIEC

Figure 6: Grad-CAM heatmap for V ascular Lesions, V ASC

Figure 7: Grad-CAM heatmap for Melanocytic Nevi,NV

The results indicate that synthetic augmentation can reduce the ef-

fect of training-data imbalance, especially for classes with limited

real samples. The most visible benefit was improved recall in mi-

DOI: 10.67556/zjyqke62 37 Published by Islington College, Kathmandu, Nepal

Islington Journal of Multidisciplinary Research • ISSN 3149-7209 (Online) V ol. 1, No. 1 (2026)

nority classes such as DF and BKL, although precision sometimes

declined. This suggests that diffusion-based augmentation improved

sensitivity to rare lesions, but synthetic quality and class-specific fil-

tering remain important.

Table 6: Comparison of SkinHybrid Against Published Methods on HAM10000

Method Architecture Type Augmentation F1 Type F1 (%) Ref.

InceptionResNetV2 + Soft Attention CNN + Soft Attention Classical Mean 82.0 (Nguyen, Bui

and Do 2022)

MobileNet (Skin Lesion Analyser) Lightweight CNN Classical Weighted 83.0 (Chaturvedi,

Gupta and

Prasad 2020)

EfficientNetV2-L + Grad-CAM CNN + Channel Attention Classical Macro 85.45 (Haque et al.

2026)

DermaScanAI CNN + Lightweight Transformer Classical Macro 91.9 (Murali and

Mazumder

2026)

CNN-Transformer + CKAN Fusion EfficientNet-B0 + Transformer Classical Weighted 92.47 (Agarwal and

Mahto 2025)

EFFNet EfficientNetV2 + HBP + RF Enhancement Weighted 93.24 (Ma et al.

2023)

SkinHybrid Baseline (Ours) EfficientNet + ViT None Weighted 84.1

SkinHybrid + SD Aug., Proposed

(Ours)

EfficientNet + ViT Stable Diffusion Weighted ∼97.0

Note. F1 variant follows each paper's primary reporting convention. HBP = Hierarchical Bilinear Pooling; CKAN = Convolutional Kolmogorov-Arnold

Network; SD Aug. = Stable Diffusion Augmentation. The proposed method exceeds all listed methods by ≥ 2.76 percentage points.

Compared with selected HAM10000 methods, the proposed aug-

mented model reports a stronger headline weighted F1-score. How-

ever, the comparison should be interpreted cautiously because stud-

ies differ in data splits, augmentation settings, preprocessing, eval-

uation protocols, and F1 variants. The per-class table also shows

that strong overall performance does not remove the need for care-

ful class-level evaluation.

The Grad-CAM analysis provides qualitative support for the model's

clinical relevance by showing activations over lesion regions. Nev-

ertheless, Grad-CAM is an explanatory aid rather than proof of clin-

ical safety. Expert review and external validation are still necessary

before a model of this type could be considered for deployment.

## 5. Conclusion
This study presented a Stable Diffusion-based synthetic augmenta-

tion pipeline and a hybrid EfficientNet-Vision Transformer classi-

fier for multi-class skin lesion classification. Synthetic images were

generated only for selected minority classes and were restricted to

the training split. The ablation study showed a substantial improve-

ment in weighted F1-score when curated diffusion-generated images

were added, while per-class analysis showed improved recall for sev-

eral minority categories. Grad-CAM visualisations indicated that the

model focused mainly on lesion regions, supporting interpretability.

Overall, the findings suggest that diffusion-based augmentation can

be useful for addressing severe dermoscopic class imbalance, but fur-

ther validation across independent datasets is required before clinical

use.

Future Works

Theoretical Implications

Future work should focus first on external validation. The current

evaluation used HAM10000, which was collected under specific der-

moscopy protocols. Testing on independent benchmarks such as

ISIC 2019, ISIC 2020, BCN20000, and PAD-UFES-20 would pro-

vide stronger evidence about generalisation across acquisition de-

vices, populations, and clinical settings.

Synthetic image quality should also be improved and evaluated more

rigorously. Future studies could use Kernel Inception Distance,

CLIP-FID, clinical expert scoring, segmentation-guided condition-

ing, and stronger generative models. Additional experiments should

investigate newer backbones such as DINOv2, Swin Transformers,

and ConvNeXt variants, as well as calibration analysis for clinical

decision support.

Since the synthetic images are generated using a very small subset

of real photos, they inherit the limitations of that original data. Any

existing biases in lighting, skin tone, or lesion appearance will be

copied and potentially magnified by the AI. Therefore, while this

method successfully increases the total number of images, it fails to

improve the actual diversity of the dataset.

External validation remains the most critical prerequisite for clin-

ical translation. SkinHybrid has been evaluated exclusively on

HAM10000, which was acquired under controlled dermoscopy pro-

tocols at specific clinical sites, and generalisation to broader popu-

lations and acquisition devices is unconfirmed. Future work must

validate the model on independent benchmarks including ISIC 2019,

ISIC 2020, BCN20000, and PAD-UFES-20.

Additionally, the current SkinHybrid architecture relies on

ImageNet-pretrained EfficientNet and ViT initialisations; future it-

erations should explore stronger and more diverse backbone alter-

natives , including DINOv2/v3, Swin Transformers, ConvNeXt V2

and their other variants.

## Disclosure Statement
The authors have no financial or non-financial disclosures to share

for this article.

## Ethical Approval
Not applicable.

## Consent to Participate / Consent to Publish
Not applicable.

Not applicable.

DOI: 10.67556/zjyqke62 38 Published by Islington College, Kathmandu, Nepal

⟨ Shrestha et al. -- Hybrid EfficientNetViT for Skin Lesion Classification ⟩

Data A vailability Statement: This research used already existing

data from different sources. All of them have been cited as well.

## Use of Artificial Intelligence (AI) Tools
This research utilized AI

to improve the language as well as finding minor grammatical errors.

The ideas, analysis, and argument are the authors' own.

## Funding
No funding was received.

## Competing Interests
All authors have no competing interests.

## References
Agarwal, Shubhi and Amulya Kumar Mahto (2025). Skin

Cancer Classification: Hybrid CNN-Transformer Mod-

els with KAN-Based Fusion . 10.48550/ARXIV .2508.12484.

https://arxiv.org/abs/2508.12484.

Akrout, Mohamed, Bálint Gyepesi, Péter Holló, Adrienn Poór,

Blága Kincs, Stephen Solis, Katrina Cirone, Jeremy Kawahara,

Dekker Slade, Latif Abid, Máté Kovács and István Fazekas

(2024). "Diffusion-Based Data Augmentation for ˘aSkin Dis-

ease Classification: Impact Across Original Medical Datasets

to˘aFully Synthetic Images." In: Deep Generative Models .

Springer Nature Switzerland, pp. 99-109. ISBN : 9783031537677.

10.1007/978-3-031-53767-7_10. http://dx.doi.org/10.1007/978-3-

031-53767-7_10.

Azizi, Shekoofeh, Simon Kornblith, Chitwan Saharia, Moham-

mad Norouzi and David J. Fleet (2023). "Synthetic Data

from Diffusion Models Improves ImageNet Classification." In:

Transactions on Machine Learning Research . ISSN : 2835-8856.

https://openreview.net/forum?id=DlRsoxjyPm.

Chaturvedi, Saket S., Kajol Gupta and Prakash S. Prasad (May

2020). "Skin Lesion Analyser: An Efficient Seven-Way Multi-

class Skin Cancer Classification Using MobileNet." In: Advanced

Machine Learning Technologies and Applications . Springer Sin-

gapore, pp. 165-176. ISBN : 9789811533839. 10.1007/978-981-

15-3383-9_15. http://dx.doi.org/10.1007/978-981-15-3383-9_15.

Datta, Soumyya Kanti, Mohammad Abuzar Shaikh, Sargur N. Sri-

hari and Mingchen Gao (2021). "Soft Attention Improves Skin

Cancer Classification Performance." In: Interpretability of Ma-

chine Intelligence in Medical Image Computing, and Topological

Data Analysis and Its Applications for Medical Data . Springer

International Publishing, pp. 13-23. ISBN : 9783030874445.

10.1007/978-3-030-87444-5_2. http://dx.doi.org/10.1007/978-3-

030-87444-5_2.

Dhariwal, Prafulla and Alex Nichol (2021). Diffusion Models

Beat GANs on Image Synthesis . 10.48550/ARXIV .2105.05233.

https://arxiv.org/abs/2105.05233.

Dosovitskiy, Alexey, Lucas Beyer, Alexander Kolesnikov, Dirk

Weissenborn, Xiaohua Zhai, Thomas Unterthiner, Mostafa De-

hghani, Matthias Minderer, Georg Heigold, Sylvain Gelly,

Jakob Uszkoreit and Neil Houlsby (2020). An Image is Worth

16x16 Words: Transformers for Image Recognition at Scale .

10.48550/ARXIV .2010.11929. https://arxiv.org/abs/2010.11929.

Esteva, Andre, Brett Kuprel, Roberto A. Novoa, Justin Ko, Susan

M. Swetter, Helen M. Blau and Sebastian Thrun (Jan. 2017).

"Dermatologist-level classification of skin cancer with deep neural

networks." In: Nature 542.7639, pp. 115-118. ISSN : 1476-4687.

10.1038/nature21056. http://dx.doi.org/10.1038/nature21056.

Goodfellow, Ian J., Jean Pouget-Abadie, Mehdi Mirza, Bing

Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville

and Y oshua Bengio (2014). Generative Adversarial Networks .

10.48550/ARXIV .1406.2661. https://arxiv.org/abs/1406.2661.

Haque, Md. Maksudul, Rahnuma Akter, A S M Ahsanul Sarkar

Akib and Abdul Hasib (2026). A Deep Learning Approach

for Automated Skin Lesion Diagnosis with Explainable AI .

10.48550/ARXIV .2601.00964. https://arxiv.org/abs/2601.00964.

Heusel, Martin, Hubert Ramsauer, Thomas Unterthiner, Bern-

hard Nessler and Sepp Hochreiter (2017). "GANs Trained

by a Two Time-Scale Update Rule Converge to a Lo-

cal Nash Equilibrium." In: 10.48550/ARXIV .1706.08500.

https://arxiv.org/abs/1706.08500.

Ho, Jonathan, Ajay Jain and Pieter Abbeel (2020). Denoising

Diffusion Probabilistic Models . 10.48550/ARXIV .2006.11239.

https://arxiv.org/abs/2006.11239.

Kim, Mujung, Jisang Y oo, Soonchul Kwon, Byung Jun Kim,

Changsik John Pak, Chong Hyun Won, Suk-Ho Moon,

Woo Jin Song, Han Gyu Cha and Kyung Hee Park (Oct.

2025). "Diffusion-based skin disease data augmentation with

fine-grained detail preservation and interpolation for data

diversity." In: PLOS One 20.10. Ed. by Zeheng Wang,

e0331404. ISSN : 1932-6203. 10.1371/journal.pone.0331404.

http://dx.doi.org/10.1371/journal.pone.0331404.

Lin, Tsung-Yi, Priya Goyal, Ross Girshick, Kaiming He and Pi-

otr Dollar (Oct. 2017). "Focal Loss for Dense Object Detec-

tion." In: 2017 IEEE International Conference on Computer

Vision (ICCV) . IEEE, pp. 2999-3007. 10.1109/iccv.2017.324.

http://dx.doi.org/10.1109/ICCV .2017.324.

Ma, Xiaopu, Jiangdan Shan, Fei Ning, Wentao Li and He Li (Oct.

2023). "EFFNet: A skin cancer classification model based on fea-

ture fusion and random forests." In: PLOS ONE 18.10. Ed. by Jin

Liu, e0293266. ISSN : 1932-6203. 10.1371/journal.pone.0293266.

http://dx.doi.org/10.1371/journal.pone.0293266.

Murali, Pampana and Dilwar Hussain Mazumder (Mar. 2026). "Der-

maScanAI an explainable hybrid deep learning framework for

automated skin lesion classification using dual attention and

metadata fusion." In: Scientific Reports 16.1. ISSN : 2045-2322.

10.1038/s41598-026-46011-0. http://dx.doi.org/10.1038/s41598-

026-46011-0.

Nguyen, Viet Dung, Ngoc Dung Bui and Hoang Khoi Do

(Oct. 2022). "Skin Lesion Classification on Imbalanced

Data Using Deep Learning with Soft Attention." In: Sen-

sors 22.19, p. 7530. ISSN : 1424-8220. 10.3390/s22197530.

http://dx.doi.org/10.3390/s22197530.

Podell, Dustin, Zion English, Kyle Lacey, Andreas Blattmann,

Tim Dockhorn, Jonas Müller, Joe Penna and Robin Rom-

bach (2023). SDXL: Improving Latent Diffusion Models for

High-Resolution Image Synthesis . 10.48550/ARXIV .2307.01952.

https://arxiv.org/abs/2307.01952.

Rombach, Robin, Andreas Blattmann, Dominik Lorenz, Patrick

Esser and Bjorn Ommer (2022). "High-Resolution Image Syn-

thesis with Latent Diffusion Models." In: 2022 IEEE/CVF Con-

ference on Computer Vision and Pattern Recognition (CVPR) .

IEEE, pp. 10674-10685. 10.1109/cvpr52688.2022.01042.

http://dx.doi.org/10.1109/CVPR52688.2022.01042.

DOI: 10.67556/zjyqke62 39 Published by Islington College, Kathmandu, Nepal

Islington Journal of Multidisciplinary Research • ISSN 3149-7209 (Online) V ol. 1, No. 1 (2026)

Selvaraju, Ramprasaath R., Michael Cogswell, Abhishek Das,

Ramakrishna V edantam, Devi Parikh and Dhruv Batra (Oct.

2017). "Grad-CAM: Visual Explanations from Deep Networks

via Gradient-Based Localization." In: 2017 IEEE International

Conference on Computer Vision (ICCV) . IEEE, pp. 618-626.

10.1109/iccv.2017.74. http://dx.doi.org/10.1109/ICCV .2017.74.

Sung, Hyuna, Jacques Ferlay, Rebecca L. Siegel, Mathieu Laver-

sanne, Isabelle Soerjomataram, Ahmedin Jemal and Freddie

Bray (Feb. 2021). "Global Cancer Statistics 2020: GLOBOCAN

Estimates of Incidence and Mortality Worldwide for 36 Can-

cers in 185 Countries." In: CA: A Cancer Journal for Clini-

cians 71.3, pp. 209-249. ISSN : 1542-4863. 10.3322/caac.21660.

http://dx.doi.org/10.3322/caac.21660.

Tan, Mingxing and Quoc V . Le (2019). "EfficientNet: Rethinking

Model Scaling for Convolutional Neural Networks." In: Proceed-

ings of the 36th International Conference on Machine Learning .

Ed. by Kamalika Chaudhuri and Ruslan Salakhutdinov. V ol. 97.

Proceedings of Machine Learning Research. PMLR, pp. 6105-

6114. https://proceedings.mlr.press/v97/tan19a.html.

Tschandl, Philipp, Noel Codella, Bengü Nisa Akay, Giuseppe Ar-

genziano, Ralph P Braun, Horacio Cabo, David Gutman, Al-

lan Halpern, Brian Helba, Rainer Hofmann-Wellenhof, Aimil-

ios Lallas, Jan Lapins, Caterina Longo, Josep Malvehy, Michael

A Marchetti, Ashfaq Marghoob, Scott Menzies, Amanda Oak-

ley, John Paoli, Susana Puig, Christoph Rinner, Cliff Rosendahl,

Alon Scope, Christoph Sinz, H Peter Soyer, Luc Thomas, Iris

Zalaudek and Harald Kittler (2019). "Comparison of the accu-

racy of human readers versus machine-learning algorithms for

pigmented skin lesion classification: an open, web-based, in-

ternational, diagnostic study." In: The Lancet Oncology 20.7,

pp. 938-947. ISSN : 1470-2045. 10.1016/s1470-2045(19)30333-x.

http://dx.doi.org/10.1016/S1470-2045(19)30333-X.

Tschandl, Philipp, Cliff Rosendahl and Harald Kittler (Aug. 2018).

"The HAM10000 dataset, a large collection of multi-source der-

matoscopic images of common pigmented skin lesions." In:

Scientific Data 5.1. ISSN : 2052-4463. 10.1038/sdata.2018.161.

http://dx.doi.org/10.1038/sdata.2018.161.

DOI: 10.67556/zjyqke62 40 Published by Islington College, Kathmandu, Nepal
