---
title: "ME-POIs Explained: Google Research's Mobility-Informed Framework for Understanding Places"
slug: 'me-pois-google-research-mobility-informed-place-ai'
date: '2026-08-21'
category: 'AI Research'
tags: ['ME-POIs Google Research mobility AI', 'geospatial AI points of interest', 'mobility-informed language models', 'AI place embeddings', 'Google Earth AI', 'permanent closure detection AI', 'price-level classification AI']
featured: true
image: '/me_pois_geospatial_ai.jpg'
excerpt: "Google Research's ME-POIs framework combines text descriptions with anonymized mobility data to dramatically improve AI predictions about places — up to 81.9% gains on unseen locations. Here's how it works."
---

# ME-POIs Explained: Google Research's Mobility-Informed Framework for Understanding Places

## Introduction

Language models have become remarkably good at understanding text about the physical world — addresses, business categories, written descriptions of places. But a name and a category only tell part of the story. 

A coffee shop labeled identically to another might function as a quiet morning commuter stop in one neighborhood and a bustling late-night study spot in another, and no amount of text metadata alone reliably captures that difference. 

On August 21, 2026, Google Research published a framework called **ME-POIs (Mobility-Embedded Points of Interest)** that addresses this gap directly, by teaching AI models to combine what a place says about itself with what people's actual movement patterns reveal about how it really functions.

---

## What Happened?

Google Research scientists Maria Despoina Siampou and Shushman Choudhury, working with collaborators from the University of Southern California, introduced ME-POIs, a framework that enriches text-based representations of places (points of interest, or POIs) with aggregated, anonymized mobility data — arrival times, stay durations, and surrounding movement patterns. 

Tested across two large, culturally distinct metropolitan areas (Los Angeles and Houston) on places the model had never encountered during training, the framework delivered substantial accuracy gains across five distinct prediction tasks: opening/closing hours, price-level classification, permanent closure detection, visit intent classification, and busyness forecasting. The full paper is publicly available on arXiv, and the work is part of Google's broader Earth AI initiative.

---

## The Technology Behind It

The paper's central conceptual framing is that every place has two distinct signatures:
* **Identity**: Name, category, textual description — essentially its "paper trail."
* **Function**: Its aggregated, real-world visit footprint — how it's actually used.

Traditional language model representations of places rely almost entirely on the first signature. World-class models like Gemini are highly capable at processing addresses, business categories, and written descriptions, but that static metadata alone can't capture a place's dynamic, real-world rhythm.

Notably, ME-POIs also represents a shift in how mobility data has historically been used in geospatial AI research. Prior work applied mobility patterns almost exclusively as an output — predicting the next place a user is likely to visit. ME-POIs instead treats mobility as an input feature, using it to define and enrich the representation of the place itself, independent of any specific user's next move.

---

## How It Works

ME-POIs builds its enriched place representations through a three-step pipeline:

```
+------------------------------------------------------------+
|  ME-POIs Multi-Scale Fusion Pipeline                        |
|                                                            |
|  [ Text Embeddings ]                                       |
|         |                                                  |
|         v --> Aligned via Cosine Similarity                |
|  [ Mobility centroids ] <-------------------+              |
|         ^                                   |              |
|         |                                   |              |
|  [ Visit Alignment ]              [ Spatial Propagation ]   |
|   Times, durations                 Block / street level    |
|   from data-rich POIs              transfer for sparse POIs|
+------------------------------------------------------------+
```

1. **Visit alignment**: Rather than simply averaging visit statistics, a temporal encoder maps the sequences of arrival windows, departure trends, and stay durations at a given place into a dense vector space, producing what the researchers call a "functional centroid" — a unique, multidimensional signature capturing the place's aggregated mobility patterns across a full year and different days of the week.
2. **Spatial multiscale visit propagation (solving data sparsity)**: This addresses a well-known "long tail" problem in geospatial data science: famous landmarks and busy chains generate abundant visit data, while the vast majority of small local businesses — neighborhood boutiques, specialized repair shops, newly opened cafés — suffer from severe data sparsity. Historically, models encountering a place with little or no recorded visit data would incorrectly infer near-zero activity, breaking downstream predictions. ME-POIs instead recognizes that visit patterns are typically regionally constrained — a small boutique on a busy shopping street tends to share behavioral traits with its neighbors. The framework examines adjacent places at multiple spatial scales (immediate street, block, wider neighborhood) and statistically transfers aggregated visit patterns from data-rich neighbors to nearby sparse places, effectively applying a learned geographical prior to businesses with little direct data of their own.
3. **Text-mobility synergy**: Rather than discarding textual descriptions, the framework aligns high-level language embeddings (the standard vector representations extracted from models like Gemini) with the newly generated mobility vectors by maximizing their cosine similarity. This layers the mobility signal directly on top of the existing language representation, preserving structural semantics from text (for example, knowing a place sells food) while adding operational context from mobility data (knowing whether it functions as a lunch spot or a late-night diner).

---

## Why It Matters

To rigorously test whether ME-POIs achieves genuine, generalizable understanding rather than simply memorizing local patterns, the researchers trained the framework on one set of observed places and then evaluated it on entirely unseen places across two distinct metropolitan areas — Los Angeles and Houston.

Across five downstream tasks — opening/closing hours prediction, price-level classification, permanent closure detection, visit intent classification, and busyness forecasting — ME-POIs consistently outperformed both purely text-based baselines (including standard Gemini embeddings) and existing trajectory-based geospatial models. 

Specific reported gains included:
* Up to an **81.9% relative improvement** in predicting visit intent.
* A **75.1% improvement** in price-level classification accuracy.
* A **24.7% increase** in busyness estimation accuracy.

One of the study's more striking findings emerged when comparing a mobility-only model against a text-only model directly: in several tasks, notably price-level classification, the mobility-only model actually outperformed the text-only language model. The researchers frame this as revealing an underappreciated truth about urban dynamics — that collective real-world behavior at a place can be a more descriptive signal than the formal language used to label it.

---

## Practical Applications

* **Permanent closure detection**: Businesses frequently stop operating well before an owner updates an online listing or a crowd-sourced report gets filed; mobility-informed models can flag this shift earlier than systems relying solely on static or manually updated data.
* **Smart city planning and retail site selection**: Understanding a location's actual functional rhythm — not just its category — can inform better decisions about where new businesses, transit stops, or public services would fit a neighborhood's genuine activity patterns.
* **Consumer-facing location apps**: Predicting real-time attributes like current busyness, likely opening hours, or expected price tier without relying on data that requires constant manual updates from business owners.
* **Geospatial and mapping product development**: Any product working with points-of-interest data (navigation, delivery logistics, local search) could benefit from richer, more accurate place representations.

---

## Example for Developers

A simplified conceptual outline of the ME-POIs approach, illustrating the general pattern for combining text and behavioral data:

For each point of interest (POI):
1. Generate a standard text embedding from available metadata (name, category, address, description) using a language model.
2. Generate a mobility embedding ("functional centroid") from aggregated, anonymized visit data: arrival times, stay durations, day-of-week patterns.
3. If the POI has sparse or no visit data: Propagate mobility signal from nearby, data-rich POIs at multiple spatial scales (street, block, neighborhood).
4. Align the text embedding and mobility embedding via cosine similarity to produce a unified representation.
5. Use the combined embedding as input to downstream prediction tasks (hours, price level, busyness, closure risk, etc.) rather than training separate task-specific models from scratch.

This general pattern — combining a static descriptive signal with a dynamic behavioral signal, and specifically addressing data sparsity through spatial propagation — is a reusable idea for any domain where text labels alone are known to be a weak proxy for real-world function.

---

## Limitations

* **Aggregate-only, by design**: The researchers explicitly state that ME-POIs captures how a place is visited across broad populations and time frames, and cannot be used to draw conclusions about individual users or for any form of personalization.
* **Dependent on mobility data quality**: The framework's spatial propagation mechanism helps address data sparsity, but its effectiveness in regions with very limited underlying mobility data coverage hasn't been demonstrated in the published research.
* **Tested on two U.S. metropolitan areas**: While Los Angeles and Houston are large test regions, broader validation across international cities, rural areas, and different mobility-data ecosystems will be necessary.
* **A single research team's framework**: Broad independent replication will confirm how these gains hold up outside the specific benchmark conditions.

---

## Future Possibilities

The researchers position ME-POIs as part of Google's broader Earth AI effort to build geospatial models and datasets that convert planetary-scale data into actionable intelligence. 

Given the framework's demonstrated ability to generalize to unseen places, plausible extensions include applying similar mobility-informed representations to other domains where behavioral data could complement text — public transit planning, urban resilience and disaster response, or retail and real estate analytics.

---

## My Perspective

What I find most transferable about ME-POIs, as a developer, isn't the geospatial application specifically — it's the general pattern of recognizing when a text label is fundamentally a poor proxy for real-world function, and deliberately introducing a second, behavioral data modality to close that gap. That's a pattern worth watching for in other domains: a product's marketing description versus its actual usage patterns, a piece of documentation versus how a system is actually used in production, a job title versus what someone actually spends their time doing. 

The spatial propagation mechanism for solving data sparsity is also a genuinely elegant piece of engineering — rather than treating missing data as "assume zero," it uses a well-reasoned geographic prior (nearby places share behavioral rhythms) to make a principled inference instead. That's a good general lesson for handling sparse data in any domain with meaningful spatial or relational structure.

---

## Conclusion

Google Research's ME-POIs framework demonstrates that enriching a language model's understanding of a place with real-world mobility data — not just improving its text descriptions — produces substantial, measurable gains across a range of practical prediction tasks, even on locations the model has never seen before.

---

## FAQ

### Does ME-POIs track or use data about specific individuals?
No. The researchers explicitly state the framework uses aggregated, anonymized mobility patterns and is designed to understand places in aggregate — it cannot be used for individual personalization or to track specific people.

### What cities was ME-POIs tested on?
The framework was evaluated on data from two large U.S. metropolitan areas: Los Angeles and Houston, with testing specifically designed to measure performance on places unseen during training.

### How is ME-POIs different from previous uses of mobility data in AI?
Prior geospatial AI research primarily used mobility data to predict a user's next destination. ME-POIs instead uses mobility data as an input feature that defines and enriches the representation of a place itself, independent of any individual user's movement.

---

*Suggested internal linking: Link to future articles on geospatial AI, smart city technology, and Google Earth AI initiatives, as those get published.*

*Featured image alt text: "Illustration of Google Research's ME-POIs framework, showing a point of interest represented by both static text metadata and dynamic anonymized mobility patterns."*

## 📚 Sources
* Google Research (Official Blog) — [“How mobility gives language models a deeper understanding of place”](https://research.google/blog/how-mobility-gives-language-models-a-deeper-understanding-of-place/), August 21, 2026, by Maria Despoina Siampou and Shushman Choudhury
* arXiv — [Full ME-POIs paper](https://arxiv.org/abs/2601.21149)
