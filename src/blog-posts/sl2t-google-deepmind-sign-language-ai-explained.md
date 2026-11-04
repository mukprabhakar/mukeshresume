---
title: "SL2T Explained: How Google DeepMind's AI Brings Real Sign Language Dictation to Android"
slug: 'sl2t-google-deepmind-sign-language-ai-explained'
date: '2026-08-12'
category: 'AI Research'
tags: ['SL2T sign language AI Google DeepMind', 'sign language translation AI', 'ASL to English AI model', 'Gboard sign language dictation', 'MediaPipe Holistic', 'AI accessibility technology', 'sign language to text']
featured: true
image: '/sl2t_sign_language.jpg'
excerpt: "Google DeepMind's SL2T model powers real-time ASL-to-English sign language dictation in Gboard and Live Transcribe on Pixel 11 — built with privacy-preserving on-device pose tracking. Here's how it works."
---

# SL2T Explained: How Google DeepMind's AI Brings Real Sign Language Dictation to Android

## Introduction

AI's ability to process spoken language has advanced dramatically over the past decade, powering dictation, translation, and voice assistants that feel effortless for hearing users. That same progress has not reached the more than 200 sign languages used by an estimated 70 million Deaf and hard of hearing people worldwide. 

On August 12, 2026, Google DeepMind published research introducing **SL2T (sign-language-to-text)**, a massively multilingual sign language translation model that marks what the team describes as a genuine breakthrough in quality and generality — and, notably, one that has already shipped into a real consumer product rather than staying confined to a research paper.

---

## What Happened?

Google DeepMind's Sign Language Team, working jointly with Android engineers, introduced SL2T and deployed it into two features on Pixel 11: sign-to-text dictation in Gboard (Google's keyboard app) and Live Transcribe (Google's real-time captioning app). 

The initial release supports American Sign Language (ASL) to English translation, with additional devices and sign languages planned. The feature lets Deaf users sign to their phone anywhere they would normally type — to search the web, draft messages, or interact with Gemini — and sign responses directly within Live Transcribe conversations instead of typing back and forth.

---

## The Technology Behind It

Sign language translation presents two challenges that don't exist in spoken language transcription, and understanding them explains why progress in this field has historically lagged so far behind speech AI.

### 1. Translation vs. Transcription
Converting speech to text is fundamentally a sequential mapping within a single language — sound in, text out, same underlying language. Sign languages, by contrast, are complete, independent natural languages with their own grammar, syntax, and lexicon, distinct from the spoken language of the surrounding hearing community. 

Translating ASL to English therefore requires real machine translation between two different languages, not a sequential sign-to-word transformation. This is precisely why earlier technological attempts — such as sign language gloves that captured hand shapes — were fundamentally limited: they treated sign language as if it were simply English performed with the hands, when it is its own complete linguistic system.

### 2. High-Dimensional Vision in Real Time
Sign languages convey meaning through the simultaneous, coordinated movement of hands, arms, torso, head, and face. Accurately tracking all of this at high frame rates is a demanding, computationally intensive computer vision problem layered directly on top of the translation challenge.

---

## How It Works

SL2T addresses both challenges through a combination of massive multilingual training and a deliberately privacy-preserving architecture.

```
+------------------------------------------------------------+
|  SL2T Privacy-Preserving Translation Pipeline              |
|                                                            |
|  [ Camera Capture ] --> [ MediaPipe Holistic Pose Tracker ] |
|                                      |                     |
|  [ Server Translation ] <-- [ Anonymized Landmark Coords ]  |
|    SL2T direct landmark-to-text                            |
+------------------------------------------------------------+
```

* **Training approach**: The model was trained on more than 100,000 hours of data spanning over 50 sign languages, with roughly a quarter of that data in ASL specifically. Training jointly across many languages, dialects, and signer proficiency levels caused the model to learn shared underlying linguistic structure, which the DeepMind team found outperformed models trained on a single sign language alone — a cross-lingual transfer effect similar to patterns seen in multilingual spoken-language models.
* **Privacy-by-architecture**: Rather than sending raw camera footage to a server for processing, SL2T represents sign language input as a sequence of pose landmark locations — geometric coordinate points tracking the signer's body. An on-device model called MediaPipe Holistic performs this tracking locally on the phone. Only these anonymized coordinate sequences are sent to the server for translation, and the original video is discarded immediately rather than being retained or transmitted.
* **Direct translation, no intermediate glosses**: Much prior sign language translation research has routed through an intermediate representation called "glosses" — essentially simplified, sign-by-sign textual annotations. DeepMind's team found that glosses fail to capture rich, non-linear aspects of sign languages, such as non-manual markers (facial expressions and head movements that carry grammatical meaning) and spatial constructions (where meaning is conveyed through positioning in signing space). SL2T instead translates directly from the landmark coordinate sequence into fluent output text, which removes artificial vocabulary limitations and allows translation quality to scale more directly with additional training data.

---

## Why It Matters

On **FLEURS-ASL (sd-test)**, a benchmark specifically designed to assess ASL-to-English translation quality, SL2T achieved a zero-shot score of **70 BLEURT** — a result DeepMind describes as significantly higher than any previously reported score on this benchmark.

Beyond the headline benchmark number, the team explicitly notes that strong academic performance doesn't guarantee real-world usability, and describes specific engineering work undertaken to close that gap:
* Minimizing streaming latency for a responsive, conversational feel.
* Preventing the model from hallucinating output when the input isn't actually signing.
* Ensuring fairness for the roughly 10% of signers who are left-handed.
* Improving performance for one-handed signing, a common real-world scenario given that a user is typically holding the phone in their other hand.

The published examples illustrate both the strength and honest limitations of the current model. Full-sentence, grammatically complex ASL translates fluently into natural English in most published examples, but DeepMind explicitly documents remaining error patterns: rare signs, rapid fingerspelling occasionally being misread (one published example shows "prey" mistranslated as "grey"), passive grammatical constructions, classifier depictions where descriptive detail can be dropped, and tense ambiguity without additional context.

---

## Practical Applications

* **Accessible mobile input**: Deaf and hard of hearing users can sign to search the web, draft messages and documents, and interact with AI assistants like Gemini directly through natural sign language, rather than typing.
* **Real-time conversation support**: Within Live Transcribe, users can sign their responses in a conversation instead of manually typing replies, making back-and-forth conversation with hearing individuals significantly more fluid.
* **Foundation for broader accessibility tooling**: The underlying architecture — on-device pose extraction plus server-side translation — is a reusable pattern for other privacy-sensitive, vision-based accessibility applications beyond sign language specifically.
* **A template for participatory AI development**: The project's collaborative structure, including a dedicated advisory committee of Deaf organizations and a published joint impact report, offers a concrete model for other AI-for-accessibility projects.

---

## Example for Developers

A simplified conceptual outline of SL2T's privacy-preserving processing pipeline:

1. Camera captures raw video locally on-device (phone).
2. On-device model (MediaPipe Holistic) extracts pose landmarks — coordinate points for hands, arms, torso, head, and face — in real time.
3. Raw video is discarded immediately; only the anonymized landmark coordinate sequence is retained.
4. The coordinate sequence is sent to the server-side SL2T model.
5. SL2T translates the coordinate sequence DIRECTLY into text output (no intermediate gloss annotation step).
6. Translated text streams back to the device (e.g., into Gboard or Live Transcribe) with minimized latency.

This on-device extraction / server-side inference split is a broadly useful architectural pattern for any application handling sensitive visual input (health, biometric, or identity-adjacent use cases) where full raw-video transmission and retention would be an unnecessary privacy risk.

---

## Limitations

* **Currently ASL-to-English only**: The initial release supports a single language pair. DeepMind states that additional sign languages will follow.
* **Single device at launch**: SL2T is available first on Pixel 11, with broader device support described as "coming soon."
* **Specific error patterns**: DeepMind's own published examples show real translation errors on rare signs, rapid fingerspelling, passive constructions, classifier depictions, and tense ambiguity — this is presented candidly as a current-generation model with known limitations.
* **One-directional (recognition only)**: SL2T translates sign language input into text; it does not yet generate sign language output from text or speech.
* **Benchmark performance vs. real-world variation**: Sign language usage varies significantly by region, community, age, and individual signing style; broader real-world validation beyond the benchmark and initial testing groups will be an ongoing process.

---

## Future Possibilities

Google DeepMind frames this ASL-to-English release as an initial step rather than a finished product, with explicitly stated plans to expand to additional sign languages, develop sign language generation (translating text or speech into sign language), and continue integrating frontier AI capabilities into this technology over time. 

The stated long-term goal is reaching genuine parity between sign languages and spoken/written languages across digital products — extending Google's broader mission of making information universally accessible.

---

## My Perspective

What stands out to me most about SL2T as a developer isn't just the benchmark score — it's the pairing of a genuinely hard, historically neglected technical problem with a deliberately privacy-first architecture and a real, structured community-partnership process (the AI Sign Language Advisory Committee and the joint impact report). 

It's a useful reminder that "solving" an AI accessibility problem well requires more than a strong model: it requires understanding the actual linguistic reality of the problem (sign languages are full, independent languages, not encoded English), designing the data pipeline around user trust from the start rather than retrofitting privacy later, and building alongside the affected community rather than just testing on them after the fact. 

That combination — technical rigor, architectural privacy-by-design, and genuine participatory development — is a strong template worth studying for anyone building AI products in accessibility or other sensitive, community-facing domains.

---

## Conclusion

SL2T represents a genuine technical breakthrough in a domain that has lagged far behind spoken language AI for structural reasons — sign languages are complete, independent languages requiring real translation, layered on top of a demanding real-time computer vision problem. Google DeepMind's approach combines massive multilingual training, direct landmark-to-text translation without lossy intermediate glosses, and an architecture that never sends raw video off the device, all developed in structured partnership with Deaf communities.

---

## FAQ

### What is SL2T?
SL2T (sign-language-to-text) is a massively multilingual AI translation model developed by Google DeepMind that translates sign language input into written text, currently powering sign-to-text dictation features in Gboard and Live Transcribe on Google Pixel 11.

### Does SL2T send my camera video to Google's servers?
No. SL2T uses an on-device model to extract pose landmark coordinates locally on the phone, discards the original video immediately, and only sends the anonymized coordinate sequence to the server for translation.

### Which sign languages does SL2T support right now?
The initial release supports American Sign Language (ASL) to English translation only. Google DeepMind has stated that additional sign languages and devices will be added in future releases.

---

*Suggested internal linking: Link to future articles on AI accessibility technology, computer vision for real-time applications, and privacy-preserving on-device AI architecture, as those get published.*

*Featured image alt text: "Illustration of Google DeepMind's SL2T model translating American Sign Language into text using on-device pose landmark tracking."*

## 📚 Sources
* Google DeepMind (Official Blog) — [“Putting sign language AI into users' hands”](https://deepmind.google/blog/putting-sign-language-ai-into-users-hands/), August 12, 2026, by the Google DeepMind Sign Language Team
* Google DeepMind — [AISLAC Joint Impact Report for SL2T 1.0 (PDF)](https://storage.googleapis.com/deepmind-media/DeepMind.com/Blog/putting-sign-language-ai-into-users-hands/aislac-joint-impact-report-for-sl2t-1-0.pdf)
* Kaggle — [FLEURS-ASL benchmark dataset](https://www.kaggle.com/datasets/googleai/fleurs-asl)
* Google Research (Official Blog) — [MediaPipe Holistic: Simultaneous Face, Hand and Pose Prediction, On-Device](https://research.google/blog/mediapipe-holistic-simultaneous-face-hand-and-pose-prediction-on-device/)
