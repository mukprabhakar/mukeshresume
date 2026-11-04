---
title: "Claude and Fermat's Last Theorem: How AI Formalized a 13-Million-Line Proof in Lean"
slug: 'claude-fermats-last-theorem-lean-formalization-explained'
date: '2026-09-04'
category: 'AI Research'
tags: ["Claude Fermat's Last Theorem Lean proof", 'AI mathematical formalization', 'Lean theorem prover AI', 'multi-agent AI coordination', 'Prove2Me Anthropic', 'autoformalization mathematics AI']
featured: true
image: '/claude_lean_flt_proof.jpg'
excerpt: "Anthropic's Claude worked largely autonomously for 11 days to produce the first complete, computer-checked proof of Fermat's Last Theorem in Lean — 13 million lines of code, 29,500 theorems. Here's how it worked, and the real critiques worth knowing."
---

# Claude and Fermat's Last Theorem: How AI Formalized a 13-Million-Line Proof in Lean

## Introduction

Fermat's Last Theorem — the deceptively simple claim that no three positive integers $a$, $b$, and $c$ can satisfy $a^n + b^n = c^n$ for any integer $n$ greater than 2 — took over 350 years to prove after Pierre de Fermat first stated it in 1637, finally resolved by Andrew Wiles in 1994. 

On September 4, 2026, Anthropic published something new about this famous result: not a new mathematical proof, but the first complete formalization of the existing proof — translated into Lean, a formal language a computer can verify line by line with zero tolerance for logical gaps — produced largely autonomously by Claude over 11 days.

---

## What Happened?

Anthropic researcher Tianyi Peng, whose group at Columbia University builds AI formalization tools, set out to test whether Claude could make meaningful progress formalizing Fermat's Last Theorem (FLT) in Lean. 

According to Anthropic's official research post, the result exceeded expectations: working largely autonomously over 11 days, Claude produced the first end-to-end, computer-checked proof of FLT, writing 13 million lines of Lean code and proving 30,300 intermediate theorems, of which 29,500 were used in the final proof. 

The complete proof is publicly available on GitHub, and Anthropic shared it with Kevin Buzzard, an Imperial College London mathematician and prominent figure in the Lean formalization community, who reviewed and praised the work.

---

## The Technology Behind It

The key distinction to understand here is between **proving a mathematical statement** and **formalizing an existing proof**:
* Wiles' original 1994 proof of FLT is accepted as mathematically correct by the broader mathematics community, but it's written the way human mathematicians write proofs: relying on shared context, intuition, and steps considered "obvious enough" to skip in detail. 
* Formalization means translating that proof into a language like **Lean**, where every single logical step must be made completely explicit and is then mechanically checked by a computer program (Lean's "kernel") against a small set of foundational axioms — with zero room for ambiguity, hand-waving, or an unproven placeholder step (referred to in Lean as a `"sorry"`).

This formalization process is notoriously slow and labor-intensive for human mathematicians — it has taken teams of expert formalizers years to formalize far simpler results than FLT. The technical challenge Anthropic's work addresses is whether AI agents, given the right coordination infrastructure, can meaningfully compress that bottleneck for a result of genuinely major mathematical significance.

---

## How It Works

Claude's proof was assembled using a new agentic harness built on **Prove2Me**, an open collaborative platform for formalizing mathematics developed by Tianyi Peng's research group at Columbia University:

1. **Massive Parallelism**: Dozens of Claude agents worked in parallel throughout the process, each responsible for defining mathematical concepts, proving specific intermediate theorems, and then using those established theorems to attempt progressively harder statements.
2. **Shared Dependency DAG**: The key coordination mechanism was a shared directed acyclic graph (DAG) of theorem statements. Agents used this shared graph to decide what to attempt proving next, based on what other agents had already successfully established elsewhere in the effort.
3. **Collision Avoidance**: This structure allowed many agents to work productively in parallel on a single, enormous, interdependent problem without duplicating effort or working on statements that depended on not-yet-proven prerequisites.
4. **Token Scale**: Over the 11-day run, the agents collectively consumed approximately 6 billion output tokens, ultimately producing 13 million lines of Lean code — more than five times the size of Mathlib, the principal community-maintained library of formalized mathematics.
5. **Zero "Sorry"s**: The final formalization covers over 29,500 theorems and 1,450 definitions, all verified through Lean's kernel using only Lean's three standard axioms, with no unproven placeholder steps remaining.

---

## Why It Matters

The significance of this result rests substantially on the nature of Lean verification itself: unlike most AI benchmarks, which can potentially be gamed through data contamination, clever prompting, or partial credit, **Lean's kernel check is binary and deterministic** — a proof either satisfies the formal logical requirements or it doesn't, with no room for a model to bluff its way to an apparent success. That property gives this result a different epistemic weight than typical AI capability benchmarks.

Kevin Buzzard's independent assessment is a meaningful data point precisely because of his standing in this specific community: he described the achievement as extraordinary, noting the proof formalizes results spanning algebra, harmonic analysis, geometry, and number theory, and drew a broader conclusion — that AI autoformalization artifacts are now robust enough to be built upon, suggesting a plausible path toward automatically formalizing much more of the modern mathematical literature.

---

## Practical Applications

* **Accelerating formal verification of software and systems**: the same rigorous, zero-ambiguity checking that Lean applies to mathematical proofs is used in formally verifying critical software, security properties, and safety-critical systems — a domain that has historically been bottlenecked by slow, tedious formalization.
* **Building on and extending existing formalized mathematics**: with a substantially larger body of verified results now available (this proof alone is over five times the size of Mathlib), future formalization efforts have a massive foundation of verified intermediate results to draw from.
* **Multi-agent coordination for large, decomposable problems**: the shared dependency-graph coordination pattern used here — letting parallel agents decide what to work on next based on what's already been established — is a reusable architecture for any sufficiently large, structurally decomposable problem.
* **Advancing AI-assisted mathematical research**: while formalizing an existing proof is distinct from discovering a new one, the infrastructure and coordination techniques demonstrated here plausibly transfer to future efforts at AI-assisted mathematical discovery.

---

## Example for Developers

A simplified conceptual outline of the multi-agent coordination pattern used in this project, generalizable to other large, decomposable problems:

```text
1. GRAPH REPRESENTATION:
   Represent the overall problem as a graph of interdependent sub-goals
   (a directed acyclic graph of theorem statements, where some theorems
   depend on others being proven first).

2. PARALLEL AGENT POOL:
   Deploy multiple agents in parallel, each capable of:
   - Selecting an available sub-goal from the graph (whose prerequisites are satisfied)
   - Attempting to solve/prove/complete that sub-goal
   - Updating the shared graph with the result

3. GRAPH-BASED COORDINATION:
   Use the shared graph itself as the coordination mechanism — agents don't need
   direct peer-to-peer communication; they coordinate indirectly through the
   graph's current state, avoiding duplicated effort and respecting dependencies.

4. DEPENDENCY RESOLUTION:
   Iterate until the graph's root goal (the final target theorem) has all its
   dependencies satisfied.

5. DETERMINISTIC VERIFICATION:
   Independently verify the final composed result against a deterministic,
   zero-ambiguity checker (Lean's kernel) rather than relying on the agents'
   own self-assessment of success.
```

This pattern — shared dependency graph coordination plus independent, deterministic final verification — is a strong reference architecture for any large multi-agent effort where sub-tasks have real interdependencies and a genuinely trustworthy final check is available.

---

## Limitations

* **Built substantially on existing human formalization work**: Independent analysis of Anthropic's repository found 106 upstream files credited to Imperial College London's existing FLT formalization project and to Mathlib — meaning this was not formalization from a blank slate, and some of the initial framing around complete autonomy has been questioned on this basis.
* **The first attempt reportedly failed**: According to independent reporting, Claude's initial formalization attempt did not succeed; the eventual result required adding Prove2Me, a purpose-built third-party coordination tool, rather than succeeding with a simpler or more general-purpose agentic setup.
* **"11 days" reflects massive parallelism, not sustained single-agent effort**: The reported timeline represents wall-clock time across a run involving several dozen agents working simultaneously and consuming roughly 6 billion output tokens collectively.
* **Formalizing an existing proof is not the same as discovering a new one**: The gap between this achievement and genuine autonomous mathematical discovery remains significant; translating an already-accepted human proof into a machine-checkable form is a different (and arguably more tractable) problem than originating novel mathematical insight.

---

## Future Possibilities

Kevin Buzzard's own framing suggests the most significant implication may not be this specific proof, but what it suggests is now possible: if a result as complex as Fermat's Last Theorem can be formalized this quickly given the right tooling, a broader push toward automatically formalizing large portions of the modern mathematical literature becomes more plausible. 

Given Anthropic's stated interest in AI-assisted formal verification more broadly, and the reusability of the underlying coordination and tooling (Prove2Me, the shared dependency-graph pattern), it's reasonable to expect continued investment in applying similar multi-agent formalization approaches to other complex mathematical results, and potentially to formal verification tasks in software and safety-critical systems engineering as well.

---

## My Perspective

What I find most transferable about this result, as a developer, isn't the mathematics itself — it's the coordination architecture. 

Using a shared dependency graph to let dozens of parallel agents decide what to work on next, based on what's already been established elsewhere in the effort, is a clean and genuinely reusable pattern for any large, structurally decomposable problem you might want to throw a multi-agent system at — well beyond formal mathematics. 

I'd also encourage treating the legitimate critiques here (substantial reliance on existing formalization infrastructure, a failed first attempt, massive parallelism rather than sustained single-agent effort) as adding to the story rather than undermining it: a well-designed multi-agent system that successfully builds on existing human work and specialized tooling to accomplish something previously infeasible is a genuinely useful and realistic picture of how this kind of AI-assisted work actually happens.

---

## Conclusion

Anthropic's formalization of Fermat's Last Theorem demonstrates that multi-agent AI systems, given the right coordination infrastructure and enough time, can now tackle mathematical formalization tasks of genuinely major scale and significance — verified not by a benchmark or human judgment, but by Lean's deterministic, zero-ambiguity proof checker. 

The achievement is real and independently praised by a credible domain expert, even as legitimate questions about the framing of "autonomy" and the substantial role of existing formalization infrastructure deserve equal attention. Together, the full picture offers a realistic understanding of where AI-assisted mathematics currently stands.

---

## FAQ

### Did Claude discover a new mathematical proof of Fermat's Last Theorem?
No. Fermat's Last Theorem was already proven by Andrew Wiles in 1994. What Claude did was formalize that existing proof — translating it into Lean, a language a computer can verify with zero ambiguity — which is a distinct and historically very tedious task, separate from originating the underlying mathematical insight.

### Did Claude do this work entirely on its own, from scratch?
Not entirely. Independent analysis found that Anthropic's own GitHub repository credits 106 upstream files to Imperial College London's existing FLT formalization project and to Mathlib, meaning a meaningful amount of existing human formalization work was built upon. Claude's first attempt at the task also reportedly failed before success was achieved using a purpose-built coordination tool called Prove2Me.

### What does "computer-checked" actually mean here?
It means the entire proof was verified by Lean's kernel — a deterministic program that checks every logical step in a formal proof against a small set of foundational axioms, with no tolerance for unproven placeholder steps (`sorry`) or logical gaps. This is a fundamentally different, stricter form of verification than typical AI benchmark scoring.
