---
title: "Qdrant 1.18 & TurboQuant Explained: Cutting Vector Database Memory Costs in Half"
slug: 'qdrant-1-18-turboquant-explained'
date: '2026-05-11'
category: 'AI Architecture'
tags: ['Qdrant TurboQuant', 'vector database quantization', 'Qdrant 1.18 release', 'RAG memory optimization', 'Google Research quantization', 'vector search cost reduction']
featured: true
image: '/qdrant_turboquant_explained.jpg'
excerpt: "Qdrant 1.18 ships TurboQuant, a Google Research quantization method that doubles compression over scalar quantization without sacrificing recall. Here's how it works and what it means for RAG and AI agent builders."
---

# TurboQuant: How Qdrant 1.18 Cut Vector Search Memory Costs Without Cutting Accuracy

## Introduction

If you've built a RAG (retrieval-augmented generation) pipeline or an AI agent with long-term memory, you already know the quiet, unglamorous cost center hiding underneath the impressive demo: the vector database. As embedding collections grow into the tens or hundreds of millions, memory becomes the bottleneck that actually determines your infrastructure bill. On May 11, 2026, Qdrant released version 1.18, headlined by **TurboQuant** — a new quantization method developed in collaboration with Google Research that doubles compression compared to standard scalar quantization while keeping recall and speed at a comparable level. For anyone building embedding-heavy AI products, this is a genuinely useful piece of infrastructure news.

---

## What Happened?

Qdrant, an open-source vector database widely used for semantic search, RAG, and AI agent memory, shipped version 1.18 with several notable additions:

* **TurboQuant** — a rotation-based quantization technique, developed with Google Research, that achieves roughly twice the compression ratio of standard scalar quantization while delivering similar recall and query speed. Qdrant's implementation extends the original Google Research algorithm with adjustments — including a length-renormalization step borrowed conceptually from the RaBitQ quantization method — specifically to close the gap between the algorithm's theoretical assumptions and how real-world embeddings actually behave.
* **Memory Monitoring** — a new Web UI view and API endpoint that breaks down a collection's disk, RAM, and page-cache usage by component (vectors, payload, indexes), making capacity planning far more precise than before.
* **Schema flexibility** — the ability to add or remove named vectors from an existing collection without recreating it, which matters directly for teams migrating between embedding models.
* **Operational improvements** — a new audit-log query API, request tracing ID support, per-collection API metrics, and additional strict-mode guardrails to prevent resource exhaustion.

A subsequent release, version 1.19 (August 2026), extended TurboQuant further by adding a 4-bit variant as a primary vector storage datatype, meaning teams can store only the quantized vectors and skip keeping the original full-precision vectors on disk entirely.

---

## The Technology Behind It

To understand why TurboQuant matters, it helps to understand the tradeoffs it's replacing. Quantization compresses vector embeddings by reducing the precision (bit depth) used to store each value — smaller vectors fit more readily in memory, which speeds up search and lowers infrastructure cost. But every existing quantization method comes with a catch: **binary quantization** is fast but needs a centered vector distribution and loses significant accuracy on smaller vectors; **scalar quantization** is reliable but only compresses by roughly a factor of four; **product quantization** compresses more aggressively but at real cost to both accuracy and speed.

TurboQuant's technical trick is applying a **fast Hadamard rotation** to vectors before compression. This rotation redistributes values evenly across coordinates, which normalizes the data's distribution — and because that normalization happens algorithmically rather than depending on how a specific embedding model happens to distribute its values, TurboQuant works consistently well across different embedding models, unlike methods that implicitly assume a particular data shape.

---

## How It Works

Qdrant's implementation layers several refinements on top of the base TurboQuant algorithm from Google Research:

1. **Hadamard rotation** — applied to each vector before compression, evening out the distribution of values across coordinates.
2. **Length renormalization** — a correction step that fixes a recall-degrading bias introduced by the quantization error itself, an idea adapted from the RaBitQ quantization method.
3. **Per-coordinate calibration** — a pre-pass that fits incoming data to precomputed codebooks, recovering accuracy that would otherwise be lost to distribution mismatch between the theoretical algorithm and real embeddings.
4. **SIMD-accelerated execution** — the compression and search operations are optimized at the hardware instruction level for maximum throughput.

TurboQuant supports multiple operating points (4-bit, 2-bit, and 1-bit), and cosine similarity, dot product, and L2 distance are all supported as first-class metrics. According to Qdrant's published benchmarks, TurboQuant at 4-bit delivers competitive recall against standard scalar quantization while using half the memory, and at 2-bit and 1-bit it significantly outperforms binary quantization's recall at comparable storage levels.

---

## Why It Matters

For teams running vector search at meaningful scale, memory is often the actual constraint — not CPU. A common rule of thumb in the vector database community is that an HNSW index needs to fit in RAM to perform well, and a 50-million-vector collection at 768 dimensions can easily consume more than 150 GB uncompressed. Halving that memory footprint without meaningfully sacrificing recall directly changes the economics of running large-scale semantic search: fewer, cheaper machines, longer runway before a team needs to shard or migrate to a more complex distributed setup.

The fact that TurboQuant came out of a collaboration with Google Research, rather than being purely an internal Qdrant invention, is also a useful signal — it suggests the underlying compression technique has been validated beyond a single vendor's specific implementation.

---

## Practical Applications

* **RAG pipelines at scale** — teams running retrieval over large document or knowledge-base collections can cut infrastructure costs meaningfully without needing to re-architect their retrieval logic.
* **AI agent long-term memory** — agents that accumulate memory over time (conversation history, task logs, learned facts) benefit directly from cheaper, denser vector storage as that memory grows.
* **Recommendation systems** — large-scale embedding-based recommendation (products, content, users) faces the same memory-scaling pressure that TurboQuant is designed to relieve.
* **Multi-tenant SaaS platforms** — the new per-collection metrics and memory monitoring make it meaningfully easier to diagnose latency or memory issues in a specific customer's collection without needing to inspect the whole cluster.

---

## Example for Developers

Enabling TurboQuant on a collection in Qdrant follows the same general pattern as configuring any other quantization method:

```python
from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance, TurboQuantConfig

client = QdrantClient(url="http://localhost:6333")

client.create_collection(
    collection_name="documents",
    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
    quantization_config=TurboQuantConfig(
        bits=4,          # 4-bit, 2-bit, or 1-bit operating point
        always_ram=True  # keep quantized vectors resident in memory
    )
)
```

The core design decision for a developer here is choosing the right bit-depth operating point: 4-bit for collections where recall matters most, 2-bit or 1-bit for collections where memory savings matter more and a small recall tradeoff is acceptable — a decision worth validating against your own embedding model and query patterns rather than assuming the defaults are optimal.

---

## Limitations

* **Compression still involves a tradeoff, even if a favorable one.** TurboQuant narrows the gap between compression and accuracy compared to older methods, but it doesn't eliminate the tradeoff entirely — teams with extremely accuracy-sensitive applications should benchmark on their own data before switching bit-depths in production.
* **Reported recall and speed comparisons come primarily from Qdrant's own published benchmarks.** Independent, third-party benchmarking across a wider range of embedding models and real production workloads wasn't broadly available at the time of release.
* **Migrating an existing large collection to a new quantization method isn't free** — depending on collection size, re-indexing or re-quantizing existing data can itself be a resource-intensive operation, so the memory savings need to be weighed against migration cost for already-large production collections.
* **This is one vendor's (Qdrant's) implementation** of an algorithm originally developed by Google Research; other vector databases (Weaviate, Milvus, Pinecone) may adopt similar rotation-based quantization techniques differently or on different timelines.

---

## Future Possibilities

Given that vector databases broadly (Qdrant, Milvus, Weaviate) have converged on cost-per-vector as a shared 2026 priority, expect rotation-based quantization approaches like TurboQuant to spread across the ecosystem rather than remain a single-vendor differentiator for long. The 4-bit primary-storage option introduced in the following 1.19 release — storing only quantized vectors and dropping full-precision originals entirely — also hints at where this is heading: quantization moving from an optional accuracy/cost tradeoff into becoming the default storage format for large-scale vector search.

---

## My Perspective

Having worked with Postgres, Supabase, and various backend data stores, what stands out to me about TurboQuant is that it's solving a problem I'd expect to hit personally the moment any AI-powered SaaS product I build actually gets real usage: embedding storage costs scale with your users' data, not with your feature roadmap, and that scaling is often invisible until a bill or a latency spike forces the issue. A drop-in quantization upgrade that meaningfully cuts memory footprint without requiring an architectural rewrite is exactly the kind of infrastructure improvement that lets a small team keep shipping AI features without prematurely investing in a much more complex distributed vector search setup.

---

## Conclusion

TurboQuant is a good example of unglamorous infrastructure work that matters more to a product's actual unit economics than most user-facing AI features do. For any team building RAG, semantic search, or agent memory at real scale, it's worth a look — not because it's flashy, but because memory cost is one of the few AI infrastructure bills that scales relentlessly with success.

---

## FAQ

**What is TurboQuant?**  
TurboQuant is a vector quantization method, developed in collaboration with Google Research and shipped in Qdrant 1.18, that compresses vector embeddings roughly twice as much as standard scalar quantization while maintaining comparable recall and search speed.

**Do I need to change my embedding model to use TurboQuant?**  
No. TurboQuant applies a mathematical rotation to normalize any embedding's value distribution before compression, which is specifically designed to work well regardless of which embedding model produced the vectors.

**Is Qdrant free to use?**  
Qdrant is open source and can be self-hosted for free; Qdrant also offers managed cloud and bring-your-own-cloud hosting options with usage-based pricing.

---

## Internal Linking Suggestions

* Link to a post on building a cost-efficient RAG pipeline architecture
* Link to a post comparing pgvector, Qdrant, Pinecone, and Weaviate for AI agent memory
* Link to a post on optimizing embedding storage for multi-tenant SaaS platforms

---

## External Authoritative Sources

* Qdrant official blog — "Qdrant 1.18 - TurboQuant" (May 11, 2026)
* Qdrant official technical article — "TurboQuant in Qdrant" (Ivan Pleshkov & Jonas Schulz)
* Qdrant GitHub releases — v1.19.0 changelog (August 5, 2026)

---

## Featured Image Concept

A minimal illustration of a compressed data cube shrinking in size with a subtle rotation arrow around it, next to a simplified memory-usage bar chart — conveying compression and efficiency without any literal brand logos.

**Image Alt Text:** Illustration of a vector data cube being compressed through rotation, representing Qdrant's TurboQuant quantization method.
