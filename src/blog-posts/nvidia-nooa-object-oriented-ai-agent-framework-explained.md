---
title: "NOOA Explained: NVIDIA's Open-Source AI Agent Framework Where an Agent Is Just a Python Class"
slug: 'nvidia-nooa-object-oriented-ai-agent-framework-explained'
date: '2026-07-27'
category: 'Open Source Spotlight'
tags: ['NVIDIA NOOA AI agent framework', 'object-oriented AI agents', 'agent harness design', 'SWE-bench Verified benchmark', 'open-source agentic AI Python', 'NVIDIA Labs agent framework', 'AI agent memory system']
featured: true
image: '/nooa_nvidia_framework.jpg'
excerpt: "NVIDIA's open-source NOOA framework treats AI agents as single Python classes, hitting 82.2% on SWE-bench Verified at roughly half the token cost of comparable harnesses. Here's how the architecture works."
---

# NOOA Explained: NVIDIA's Open-Source AI Agent Framework Where an Agent Is Just a Python Class

## Introduction

Most AI agent frameworks today ask developers to coordinate several separate abstractions — prompt templates, tool schemas, callback functions, and workflow graphs — that all have to stay in sync as an agent evolves. 

NVIDIA Labs' new open-source framework, **NOOA (NVIDIA Object-Oriented Agents)**, starts from a different premise: *what if an agent were simply a Python class, using standard object-oriented programming concepts developers already know?* 

Released as a research preview alongside a full technical report, NOOA demonstrates that this architectural simplification isn't just cleaner code — it produces measurably better accuracy and lower cost on real benchmarks, using the exact same underlying language models.

---

## What Happened?

NVIDIA Labs researchers Ricardo Silveira Cabral and Paul Furgale published NOOA on NVIDIA's Technical Blog on July 27, 2026, alongside an arXiv technical report and full open-source code on GitHub under the Apache 2.0 license. 

NOOA was also contributed as a founding technical piece of the newly formed **Open Secure AI Alliance**, a coalition of companies working on open-source AI security and agent tooling. The framework demonstrates state-of-the-art or near-state-of-the-art results across three distinct domains — software engineering, cybersecurity, and general reasoning — using standard, publicly available models, with no benchmark-specific prompt engineering.

---

## The Technology Behind It

NOOA's central architectural claim is that the **"harness"** — the software layer surrounding an AI model that renders context, executes actions, manages state, and decides when a task is complete — matters as much as the underlying model itself, and can swing benchmark accuracy by double digits with the same model. 

To make that harness as simple and inspectable as possible, NOOA represents an entire agent as a single Python class:
* **Methods** are its available actions.
* **Fields** hold its state.
* **Docstrings** serve as its prompts.
* **Type annotations** function as enforced contracts on inputs and outputs.

A method with an ordinary implementation runs as standard, deterministic Python code. A method whose body is simply an ellipsis (`...`) is instead completed at runtime by an LLM-driven loop — meaning the model "fills in" that specific piece of logic when the method is called, while everything else in the class remains regular code. This blended approach means a single agent definition mixes deterministic business logic and model-driven reasoning within one familiar, testable structure.

---

## How It Works

NOOA's design is built around six specific technical decisions the authors argue are jointly responsible for its performance gains:

1. **Typed input and output**: Every agentic call has validated argument types and return values, rather than relying on free-text parsing.
2. **Pass by reference**: The model works directly with live Python objects rather than receiving everything serialized as text; it sees a bounded preview while the full value remains available in the execution environment.
3. **Code as action**: The model takes action by writing actual Python code with real control flow and inline method calls, rather than emitting structured JSON tool calls.
4. **Programmable loop engineering**: The orchestration loop that drives an agent's reasoning is itself ordinary Python, editable by both developers and the model.
5. **Explicit object state**: An agent's durable, typed state lives directly on the object rather than being reconstructed from conversation history each time.
6. **Model-callable harness APIs**: Context blocks and event history are exposed as APIs the model can inspect and manage directly, rather than being invisible infrastructure.

### Long-Term Memory Subsystem
NOOA also includes a long-term memory subsystem that the agent actively curates rather than one driven by automatic background summarization. The agent deliberately writes, queries, and corrects typed memory records as part of its work, while relevant "spontaneous memories" surface automatically into context when needed. 

Records carry types, importance ratings, and tags, and are connected through typed relationships (such as "supports," "contradicts," or "derived-from") into a knowledge graph rather than a flat log. Everything persists in a single, human-readable SQLite file that teams can inspect, back up, and review using standard software practices, and multiple agents can share a memory store while retaining separate ownership over their own contributions.

---

## Why It Matters

The performance results span three genuinely different domains, all using the same general-purpose agent architecture with no domain-specific tuning:

* **Software engineering**: On SWE-bench Verified, a widely used benchmark for real-world software engineering tasks, NOOA reached **82.2% accuracy** using GPT-5.5 — above the published leaderboard state-of-the-art at the time of submission (79.2%) — using a general-purpose, 253-line agent definition with no benchmark-specific prompting. It reached 79.8% with Claude Opus 4.6.
* **Cybersecurity**: On CyberGym L1, a benchmark for real vulnerability rediscovery, NOOA solved **86.8% of tasks** using GPT-5.5, becoming the top-scoring open-source agent on the benchmark and outperforming most leading closed-source systems. Critically, this result was achieved with network access blocked and a rule-based verification check applied to every trajectory.
* **General reasoning**: On ARC-AGI-3, a benchmark that places an agent in an unfamiliar grid-based game it must learn to play by observing outcomes, a single NOOA agent achieved a mean score of **50.2%** with GPT-5.5, rising to **85.1%** with GPT-5.6-sol — all for under $20 per game.

```
+-------------------------------------------------------------+
|  SWE-bench Verified Harness Comparison                      |
|                                                             |
|  NOOA Harness         [=============] 82.2% Accuracy        |
|                       1.1M tokens | 29 LLM calls            |
|                                                             |
|  Standard Harness     [===========] 78.2% Accuracy          |
|                       2.2M tokens | 66 LLM calls            |
+-------------------------------------------------------------+
```

The efficiency story is arguably as significant as the accuracy story. On SWE-bench Verified, NOOA reached 82.2% accuracy using roughly 1.1 million tokens and 29 LLM calls per task, while comparable harnesses required 66 calls and 2.2 million tokens to reach a lower 78.2% — **roughly double the cost for a worse result**. 

This efficiency comes primarily from the pass-by-reference design: because large tool outputs remain live Python objects rather than being serialized into the text context window, sessions typically peak at only 22,000–72,000 prompt tokens, and no context-compaction or summarization step is needed at all.

---

## Practical Applications

* **AI-assisted software engineering tools** can adopt similar harness patterns to improve accuracy and reduce token costs on long, multi-step coding tasks.
* **Security research and vulnerability-discovery tooling** can use NOOA's approach of combining deterministic verification "gates" (methods that must return a clear true/false verdict) with model-driven exploration, ensuring findings are accepted only when code — not a potentially unreliable model statement — confirms them.
* **General-purpose reasoning agents** operating in novel, rule-discovery environments (robotics, game-playing, exploratory data analysis) may benefit from the "world model" skill pattern demonstrated on ARC-AGI-3.
* **Teams evaluating rising agent inference costs** can use NOOA's pass-by-reference and no-compaction design as a reference architecture for reducing token spend without sacrificing accuracy.

---

## Example for Developers

A simplified illustration of NOOA's core pattern, adapted from NVIDIA's own example:

```python
class SupportAgent(Agent):
    """You are a support agent for a customer service system."""
    
    order_db: OrderDB  # object state: model-visible, passed by reference
    
    def is_refund_eligible(self, order: Order) -> bool:
        """Return whether an order is eligible for a refund."""
        return order.delivered and order.days_since_delivery <= 30
        
    @strategy(PredictStrategy())
    async def classify(self, message: str) -> TicketKind:
        """Classify the customer message into the best ticket kind."""
        ...
        
    async def triage(self, message: str, photo: Image | None, order: Order | None) -> Ticket:
        """Triage a customer message and create a support ticket."""
        ...
```

Here, `is_refund_eligible` is ordinary, deterministic Python — no model call involved. `classify` and `triage` have bodies marked with `...`, meaning an LLM-driven loop fills in that logic at runtime, guided by the docstring as its prompt and the type annotations as its enforced contract. The whole agent can be diffed, unit-tested, and code-reviewed exactly like any other Python class.

---

## Limitations

* **Explicitly a research preview**: NVIDIA describes NOOA as an open experimental surface, not a replacement for existing production harnesses, with rough edges expected.
* **Security guardrails are defense-in-depth, not containment**: NVIDIA is direct that NOOA's built-in AST (code structure) checks and module deny-lists are meant to catch common mistakes early, not to stop code that is actively trying to escape its environment. Genuine isolation requires OS-level sandboxing (containers or VMs).
* **No independent, matched-task benchmarks yet**: As of publication, there isn't a published, independent head-to-head comparison against widely used alternatives like LangGraph or AutoGen using the same tasks and models.
* **Performance on cheaper or smaller models is untested**: The strongest published results use frontier-tier models (GPT-5.5, GPT-5.6-sol, Claude Opus 4.6); how the harness's advantages hold up on smaller models isn't yet demonstrated.

---

## Future Possibilities

NVIDIA frames NOOA as one contribution to a broader, actively evolving open agent ecosystem rather than a finished, standalone product — explicitly inviting other teams to adopt, challenge, or improve on the techniques described in its technical report. 

As part of the Open Secure AI Alliance, NOOA is positioned alongside other open contributions focused on agent identity, isolation, safe model formats, and secure coding workflows, suggesting a broader industry push toward transparent, auditable agent architectures.

---

## My Perspective

What I find most useful about NOOA as a developer isn't any single benchmark number — it's the demonstration that harness architecture is a real, measurable performance lever independent of model choice. It's easy to default to "we need a better/bigger model" when an agent isn't performing well, but this research is a concrete reminder that how you structure context, tool outputs, and state can matter just as much, and is often a cheaper problem to solve. 

The pass-by-reference design in particular strikes me as broadly generalizable well beyond NOOA itself: any team building agents that operate on large tool outputs (database query results, file contents, API responses) should be asking whether those outputs really need to be serialized into the model's text context, or whether the model could instead operate on a bounded preview while working with the full data directly in code. That's a pattern worth internalizing regardless of which specific framework you end up using.

---

## Conclusion

NOOA demonstrates that agent architecture — not just model capability — is a significant, measurable lever for both accuracy and cost in agentic AI systems. By representing an entire agent as a single, typed Python class and letting the model operate on live objects rather than serialized text, NVIDIA's open-source framework achieves state-of-the-art or near-state-of-the-art results across software engineering, cybersecurity, and general reasoning benchmarks, at roughly half the token cost of comparable approaches.

---

## FAQ

### Is NOOA ready for production use?
No. NVIDIA explicitly describes NOOA as a research preview and an "open experimental surface," not a replacement for existing production agent harnesses. Genuine isolation requires running it in a proper sandbox.

### How is NOOA different from frameworks like LangGraph or AutoGen?
NOOA's core distinction is representing an entire agent as a single Python class rather than coordinating separate prompt templates, tool schemas, and workflow graphs.

### What models does NOOA work with?
NOOA is model-agnostic and routes through LiteLLM, supporting hosted APIs, local Ollama instances, and vLLM endpoints.

---

*Suggested internal linking: Link to future articles on AI agent architecture patterns, open-source AI security tooling, and Python-based agentic frameworks, as those get published.*

*Featured image alt text: "Diagram illustrating NVIDIA's NOOA framework, showing an AI agent represented as a single object-oriented Python class with methods, state, and typed contracts."*

## 📚 Sources
* NVIDIA Technical Blog — [“Six Agent Harness Capabilities for Higher Model Performance”](https://developer.nvidia.com/blog/six-agent-harness-capabilities-for-higher-model-performance/), July 27, 2026, by Ricardo Silveira Cabral and Paul Furgale
* arXiv — [NVIDIA-labs OO Agents: Native Python Object-Oriented Agents (technical report)](https://arxiv.org/abs/2607.20709)
* GitHub — [NVIDIA-NeMo/labs-OO-Agents (source code)](https://github.com/NVIDIA-NeMo/labs-OO-Agents)
* NVIDIA Blog — [“Industry Leaders Join Open Secure AI Alliance for AI Safety and Security”](https://blogs.nvidia.com/blog/open-secure-ai-alliance/)
