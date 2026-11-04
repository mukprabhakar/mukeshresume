---
title: "Encoding vs. Recall: Why LLMs Know More Facts Than They Can Retrieve"
slug: 'llm-factuality-recall-vs-encoding-google-research'
date: '2026-08-12'
category: 'Artificial Intelligence'
tags: ['LLM factuality recall vs encoding', 'knowledge profiling LLM', 'WikiProfile benchmark', 'LLM hallucination research', 'reversal curse LLM', 'chain-of-thought factual recall', 'Google Research LLM 2026']
featured: true
image: '/llm_encoding_vs_recall.jpg'
excerpt: "Google Research's new 'knowledge profiling' framework shows frontier LLMs like Gemini-3 and GPT-5 encode 95-98% of facts but fail to recall 26-34% of them — reframing how developers should think about hallucinations."
---

# Encoding vs. Recall: Why LLMs Know More Facts Than They Can Retrieve

## Introduction

Factual errors remain one of the most persistent problems limiting how much developers and enterprises can trust large language models. When a model states something incorrect, the usual diagnosis is simple: *"the model doesn't know that."* But a new study from Google Research, published on August 12, 2026, argues that this diagnosis is often wrong — and that the real problem is frequently not what the model knows, but what it can access. 

The paper, *"Empty Shelves or Lost Keys? Recall Is the Bottleneck for Parametric Factuality,"* introduces a framework for telling these two failure modes apart, with direct implications for anyone building RAG systems, agents, or factual-QA tools.

---

## What Happened?

Researchers Nitay Calderon and Gal Yona at Google Research introduced **knowledge profiling**, a behavioral framework that separates two properties standard factuality benchmarks conflate: whether a fact is encoded in a model's parameters (learned during training), and whether that fact is recallable (retrievable in response to a direct question, without the answer being shown). 

To operationalize this, they built and released **WikiProfile**, a benchmark of 2,150 Wikipedia-derived facts, each tested through ten different question formats. They evaluated 13 LLMs — including Gemini-2.5-Pro, Gemini-3-Pro and Flash, and GPT-5 — producing roughly 4.5 million graded responses. The paper and the WikiProfile dataset are both publicly available.

---

## The Technology Behind It

The central distinction in this research borrows from cognitive psychology's vocabulary around memory:

* **Encoding**: Whether a fact is represented in the model's parameters at all. This is tested by placing the model in a pretraining-like context (proposition completion, contextual questioning) that primes it to expose stored knowledge without revealing the answer directly.
* **Recall**: Whether the model can retrieve an encoded fact and answer correctly across varied phrasings, including both direct questions ("A is B; what is B?") and reverse questions ("what is A, given B?").
* **Recognition**: Whether the model can identify the correct fact when it's presented among plausible alternatives, tested via multiple-choice questions.

Each fact in WikiProfile gets classified into one of five knowledge profiles: **encoding failure**, **recall failure**, **direct recall**, **recall with thinking**, and **inference without encoding** (where a model reasons its way to a correct answer using other encoded facts, without ever having directly encoded the fact itself).

---

## How It Works

WikiProfile was built through a largely automated pipeline: facts were extracted from Wikipedia (a well-known and heavily represented source in pretraining data), then a prompted LLM (Gemini-2.5-Pro with thinking) generated direct and reverse questions through a generation-refinement-filtering process. Every question was filtered against a search engine to guarantee a single, unambiguous, verifiable answer — questions with multiple possible answers were discarded entirely. 

After automated filtering and a final manual validation pass, the benchmark settled at 2,150 facts, each paired with ten tasks: two for encoding, four for direct knowledge evaluation (direct/reverse, with/without thinking), and four multiple-choice recognition variants.

Each of the 13 evaluated models was tested with and without "thinking" enabled (chain-of-thought or thinking-optimized inference), with eight sampled responses per fact/task combination, graded by prompted LLM autoraters.

---

## Why It Matters

The headline result: across frontier models (Gemini-2.5-Pro, Gemini-3-Pro, Gemini-3-Flash, GPT-5), encoding is close to saturated — **Gemini-3-Pro and GPT-5 encode 95–98% of the facts** in the benchmark. But direct recall lags far behind: these same models **fail to directly recall 26–34% of facts** they've actually encoded. Even with thinking enabled, 11–12% remain unrecalled. 

The paper's framing is direct: factual errors in frontier models increasingly stem not from missing knowledge, but from knowledge that is stored yet inaccessible.

```
+-------------------------------------------------------------+
|  Gemini-3 / GPT-5 Factual Knowledge Gap                     |
|                                                             |
|  [=========================================---] 95-98%      |
|  Encoded in parameters                                       |
|                                                             |
|  [============================] 66-74%                      |
|  Directly recallable (without thinking)                     |
+-------------------------------------------------------------+
```

This pattern holds across scale, too. Within the Gemma 3 model family, larger models show markedly fewer encoding failures — but recall failures persist and become a larger share of remaining errors as models scale. The authors' conclusion: **scaling improves what a model stores more than it improves what a model can retrieve.**

Two specific patterns stood out in the results:

### 1. Long-tail facts
Prior research has often framed poor performance on rare facts as a capacity/training-data problem. This study finds that rare facts are encoded at rates close to popular facts — the real gap opens up at the recall stage, not the encoding stage. The long-tail factuality problem looks less like *"the model never learned this"* and more like *"the model learned this but struggles to retrieve it."*

### 2. The Reversal Curse
Models that learn "A is B" but fail to answer "what is B?" have often been interpreted as lacking bidirectional knowledge. This study complicates that view: in multiple-choice recognition tasks, reverse questions are no harder than direct ones (often easier). But in open-ended generation, reverse questions are consistently harder. Since the model can recognize the correct answer among distractors but can't generate it unprompted, the fact appears genuinely encoded and even recognizable — **the reversal curse looks like a recall problem specifically tied to open-ended generation**, not an absence of bidirectional knowledge.

---

## Practical Applications

* **RAG system design**: Understanding that many "unknown" facts are actually encoded-but-unrecalled suggests that better query phrasing, multiple question reformulations, or retrieval-augmented verification steps might resolve errors that would otherwise be misdiagnosed as knowledge gaps.
* **Agent verification layers**: Systems that ask an LLM to self-verify a fact via multiple-choice recognition may get more reliable results than asking it to generate the fact directly from an open-ended prompt.
* **Fact-checking and QA tooling**: Distinguishing "the model doesn't know this" from "the model can't find this" changes what remediation makes sense — external retrieval versus prompt reformulation versus escalating to a human.
* **Model evaluation practices**: Standard accuracy metrics that treat all wrong answers identically obscure this distinction entirely; teams building internal eval suites for LLM-powered products may want to adopt a similar profiling approach rather than a single pass/fail accuracy number.

---

## Example for Developers

A simplified way to apply the paper's logic when debugging factual errors in an LLM-powered application:

For a given fact-based failure:
1. Ask the same underlying fact via a **different phrasing/direction** (e.g., if *"what is the capital of X"* failed, try *"X's capital is ___"*)
2. Ask it as a **multiple-choice / recognition question** instead of open generation.
3. Re-ask with a **thinking/reasoning step** enabled.

* **If the model succeeds on (2) or (3) but failed on the original phrasing:**  
  → *Likely a RECALL failure* — the fact is encoded but not surfacing.  
  → *Fix:* Reformulate prompts, add retrieval grounding, or allow reasoning steps.
* **If the model fails across all three:**  
  → *Likely an ENCODING failure* — the fact may not be present at all.  
  → *Fix:* External retrieval (RAG) is the more reliable remedy here, not prompt engineering.

This isn't a replacement for the paper's rigorous methodology, but it's a reasonable diagnostic heuristic developers can apply when triaging factual errors in production systems.

---

## Limitations

* **Domain scope**: WikiProfile is built specifically from Wikipedia-derived facts. Wikipedia is heavily represented in most pretraining corpora, so results may not generalize identically to specialized, technical, or proprietary domain knowledge less common in training data.
* **Automated pipeline dependency**: The benchmark's question generation relies on a prompted LLM (Gemini-2.5-Pro) for construction, with manual validation as a check — this introduces some dependency on that model's own capabilities and biases, even with the search-grounded filtering step.
* **Grading methodology**: Responses are graded by prompted LLM autoraters rather than exclusively human annotators, which is a common and reasonably validated practice in large-scale evals but still worth noting as a methodological choice.
* **Single research team's framework**: As with any new benchmark, broader adoption and independent replication across different fact distributions and languages will help confirm how generalizable these findings are.

---

## Future Possibilities

The authors suggest that if encoding is already near-saturated in frontier models, further factuality gains are less likely to come from simply scaling pretraining data or model size. Instead, they point toward post-training methods and inference-time strategies specifically designed to improve utilization of already-encoded knowledge — essentially, teaching models to search their own parameters more effectively rather than teaching them more facts. 

This could influence how labs prioritize research investment: less "bigger corpus," more "better retrieval-from-self" mechanisms, alongside continued reliance on external retrieval (RAG) for genuinely absent knowledge.

---

## My Perspective

As a developer who works with LLM-integrated systems, what strikes me most about this paper is how directly it maps onto debugging intuition I've built through trial and error — except now there's a rigorous framework and a public benchmark behind it instead of just anecdotal pattern-matching. I've seen models "fail" to answer something correctly, only to get it right when I rephrased the same question. This paper gives that experience a name and a measurement methodology.

The practical takeaway for anyone building AI-powered products is that hallucination mitigation isn't a single problem with a single fix. If a chunk of factual errors are recall failures rather than encoding failures, then RAG alone doesn't fully solve the problem — a well-designed retrieval system still needs to account for how a model's own parametric knowledge might already have the answer, just not in a form the current prompt is surfacing. That's a more nuanced systems-design problem than "just add retrieval," and it's the kind of insight that should shape how developers structure verification and self-consistency checks in production LLM applications.

---

## Conclusion

Google Research's knowledge profiling framework offers a more precise diagnosis for one of AI's most persistent problems: many factual errors in frontier LLMs aren't caused by missing knowledge, but by an inability to reliably retrieve knowledge that's already stored. Encoding in models like Gemini-3-Pro and GPT-5 is nearly saturated, yet recall failures persist — especially for rare facts and reverse-direction questions — and "thinking" helps recover much of that gap, but only for facts that were genuinely encoded in the first place. For developers, the lesson is that improving factuality increasingly means designing systems that help models access what they already know, not just feeding them more data.

---

## FAQ

### What is "knowledge profiling" in the context of LLMs?
It's a framework introduced by Google Research that classifies each fact a model might be asked about into one of five states — based on whether the fact is encoded in the model's parameters and how accessible it is (not recallable, directly recallable, recallable only with thinking, or inferable without direct encoding).

### Is this the same thing as the "reversal curse"?
The reversal curse (failing to answer "what is B" after learning "A is B") is one specific pattern this research examines. The paper's finding is that the reversal curse behaves like a recall problem rather than a missing-knowledge problem, since models can often still recognize the correct answer in a multiple-choice format even when they can't generate it directly.

### Does this mean RAG is less necessary?
No — the paper doesn't argue against retrieval-augmented generation. It suggests that some errors currently treated as "knowledge gaps" (and addressed purely with external retrieval) may actually be recall failures that could also be improved through better prompting, reasoning steps, or retrieval design that accounts for parametric knowledge the model already has.

---

*Suggested internal linking: Link to future articles on RAG system design, LLM evaluation methodology, and chain-of-thought reasoning, as those get published.*

*Featured image alt text: "Diagram illustrating the difference between LLM knowledge encoding (empty shelves) and knowledge recall (lost keys), based on Google Research's knowledge profiling framework."*

## 📚 Sources
* Google Research (Official Blog) — [“Empty shelves or lost keys? Recall is the bottleneck for parametric factuality”](https://research.google/blog/empty-shelves-or-lost-keys-recall-is-the-bottleneck-for-parametric-factuality/), August 12, 2026, by Nitay Calderon and Gal Yona
* arXiv — [Full paper: “Empty Shelves or Lost Keys? Recall Is the Bottleneck for Parametric Factuality”](https://arxiv.org/abs/2602.14080)
* Hugging Face — [WikiProfile benchmark dataset](https://huggingface.co/datasets/google/WikiProfile)
