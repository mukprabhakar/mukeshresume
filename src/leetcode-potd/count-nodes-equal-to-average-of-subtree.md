---
title: "2265. Count Nodes Equal to Average of Subtree"
slug: 'count-nodes-equal-to-average-of-subtree'
date: '2026-09-10'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(H)'
tags: ['Tree', 'Binary Tree', 'Depth-First Search', 'Recursion', 'Post-Order Traversal']
excerpt: "Count how many nodes in a binary tree have a value equal to the rounded-down average of their subtree using a single post-order recursive traversal."
---

# 2265. Count Nodes Equal to Average of Subtree

This one introduces trees and recursion-on-trees for the first time in this series — a big new shape of problem. Let's build it up carefully from zero.

---

## 1. Problem in Very Simple Language

You're given a **binary tree** — we'll explain exactly what that is in a moment. Every node in the tree holds a number (`val`).

For **every single node** in the tree, consider its **subtree** — that node itself, plus every node "hanging below" it (its children, their children, and so on, all the way down). Compute the **average** of all the values in that subtree: add up every value in the subtree, divide by how many nodes are in the subtree, and **round down** to the nearest whole number (drop any decimal part).

Then check: does this node's *own* value equal that computed average?

* **Goal:** count how many nodes, across the *entire* tree, satisfy "my own value equals the average of my subtree."
* **What's given:** the root of a binary tree.
* **What to find:** for every node, whether its value matches its subtree's average.
* **What to return:** the total count of nodes where this is true.

---

## 2. Real-Life Analogy

Imagine a company org chart, shaped like a tree: a CEO at the top, with managers below them, and employees below the managers, and so on. Every person has a "performance score" (their value).

For **every single person** in the org chart, imagine you gather that person plus **everyone who reports to them, directly or indirectly** (their whole "team," including sub-teams) — and compute the **average performance score** of that entire team (rounding down).

You want to count: **how many people have a performance score that exactly equals the average score of their own team** (including themselves)? A brand-new hire with no reports is automatically their "own team of one," so their score trivially equals their team's average (themselves).

---

## 3. Important Programming Concepts I Need First

### Binary Tree
* **Concept:** A tree where each node has at most **two** children, conventionally called `left` and `right`. There's one special node at the very top called the `root`, and nodes with no children are called "leaves."
* **Example:** A node with `val=5`, whose `left` child has `val=3` and whose `right` child is `null` (meaning "no right child").
* **Why we need it:** The input to this problem is exactly this kind of structure — we must navigate it using `.left` and `.right`, not array indices.

### TreeNode (the building block)
* **Concept:** Each node is an object with three parts: `val` (its number), `left` (a reference to its left child, or `null` if none), and `right` (same idea, for the right child).
* **Why we need it:** We'll be constantly reading `.val` and following `.left`/`.right` to explore the tree.

### Subtree
* **Concept:** The subtree "rooted at" some node `X` consists of `X` itself, plus everything reachable by following `.left`/`.right` pointers downward from `X` — i.e., all of `X`'s descendants. A leaf node's subtree is just itself (a "team of one").
* **Why we need it:** The entire problem is defined in terms of "average of a node's subtree" — we need to be crystal clear that this always includes the node itself.

### Recursion on Trees (a very natural fit)
* **Concept:** Trees are naturally recursive structures: "the tree rooted at node X" = "node X itself" + "the tree rooted at X.left" + "the tree rooted at X.right." This means a recursive function that solves a problem for a whole tree can often be built by (a) solving the *same* problem for the left and right subtrees first, and (b) combining those results with the current node's own value.
* **Simple Example:** To count *all* nodes in a tree: `countNodes(node) = 1 + countNodes(node.left) + countNodes(node.right)`, with the base case `countNodes(null) = 0`.
* **Why we need it:** Computing "sum and count of every subtree," for every node, is a textbook recursive-on-trees problem — each node's subtree sum/count is built directly from its children's subtree sums/counts.

### Base Case (for tree recursion specifically)
* **Concept:** The natural "smallest" input for tree recursion is `null` — an empty/nonexistent node (like "no child here"). We must decide what our function should return for `null`, since every recursive tree function eventually reaches this case as it walks down to the leaves and beyond.
* **Why we need it:** Without a correct base case for `null`, our recursion would either crash (trying to read `.val` on something that doesn't exist) or never terminate.

### Returning Multiple Values from One Recursive Call
* **Concept:** Sometimes a single recursive call needs to report back *more than one* piece of information to its caller (here: both the subtree's sum AND its node count). In Java, a clean way to do this is to return a small array (like `int[]{sum, count}`), or in JavaScript an array `[sum, count]`.
* **Why we need it:** For each node, we need both the total sum *and* the total count of its subtree to compute the average — a single return value isn't enough.

---

## 4. Understand the Input

Take Example 1:
```text
root = [4,8,5,0,1,null,6]
```

This array notation represents a binary tree, level by level (this is LeetCode's standard way of describing trees as flat arrays). Drawn out as an actual tree:

```text
              4
            /   \
           8     5
          / \      \
         0   1       6
```

* The root node has value `4`, with left child `8` and right child `5`.
* Node `8` has left child `0` and right child `1` (both leaves).
* Node `5` has no left child (that's what the `null` represents) and has right child `6` (a leaf).
* We need to check, for *every* node in this tree, whether its own value equals the average of its entire subtree.

---

## 5. Understand the Output

Output: `5`

Let's check every node (there are 6 total: `4, 8, 5, 0, 1, 6`):

* **Node 4 (root):** its subtree is the *entire* tree: `{4,8,5,0,1,6}`. Sum = `24`, count = `6`, average = `24/6 = 4`. Does `4 == 4`? **Yes.**
* **Node 8:** its subtree is `{8,0,1}`. Sum = `9`, count = `3`, average = `9/3 = 3`. Does `8 == 3`? No.
* **Node 5:** its subtree is `{5,6}` (itself plus its right child, no left child). Sum = `11`, count = `2`, average = `11/2 = 5` (integer division rounds down `5.5` to `5`). Does `5 == 5`? **Yes.**
* **Node 0:** a leaf, subtree is just `{0}`. Average = `0/1 = 0`. Does `0 == 0`? **Yes.**
* **Node 1:** a leaf, subtree is just `{1}`. Average = `1/1 = 1`. Does `1 == 1`? **Yes.**
* **Node 6:** a leaf, subtree is just `{6}`. Average = `6/1 = 6`. Does `6 == 6`? **Yes.**

Counting the "Yes" answers: node 4, node 5, node 0, node 1, node 6 — that's **5** nodes. Only node `8` fails to match. ✔️ matches the expected output!

Notice: **every leaf automatically matches** (its subtree is just itself, so the average always trivially equals its own value) — this is a useful sanity-check pattern to keep in mind.

---

## 6. Solve the Example Manually

Let's manually trace through how we'd compute this **recursively**, from the bottom up (since we can't know a node's subtree sum until we know its children's subtree sums first).

We process nodes in an order where children are fully handled *before* their parents (this is naturally how recursion unwinds):

| Node | Left child's (sum, count) | Right child's (sum, count) | This node's subtree sum | This node's subtree count | Average | Matches own value? |
|---|---|---|---|---|---|---|
| 0 (leaf) | none (null) | none (null) | 0 + 0 = 0 | 0 + 1 = 1 | 0/1=0 | 0==0 ✔️ |
| 1 (leaf) | none | none | 1 | 1 | 1/1=1 | 1==1 ✔️ |
| 6 (leaf) | none | none | 6 | 1 | 6/1=6 | 6==6 ✔️ |
| 8 | (0,1) from left child "0" | (1,1) from right child "1" | 8 + 0 + 1 = 9 | 1 + 1 + 1 = 3 | 9/3=3 | 8==3? ❌ |
| 5 | none (no left child) | (6,1) from right child "6" | 5 + 0 + 6 = 11 | 1 + 0 + 1 = 2 | 11/2=5 | 5==5 ✔️ |
| 4 (root) | (9,3) from left child "8" | (11,2) from right child "5" | 4 + 9 + 11 = 24 | 1 + 3 + 2 = 6 | 24/6=4 | 4==4 ✔️ |

Counting the ✔️ marks: `0, 1, 6, 5, 4` — that's 5 matches (node `8` is the only failure). ✔️ Total: **5**, matching the expected output!

---

## 7. Think Like a Programmer

* **What do I know?** For any node, if I already know the (sum, count) of its left subtree and right subtree, I can instantly compute its *own* subtree's (sum, count): `mySum = node.val + leftSum + rightSum`, `myCount = 1 + leftCount + rightCount`.
* **What do I need to find?** For every node, whether `node.val == mySum / myCount` (integer division).
* **What can I try?** A recursive function that, for a given node, first recursively computes its left child's (sum, count) and right child's (sum, count), *then* combines them with its own value to get its own (sum, count) — and along the way, checks the matching condition and updates a running counter.
* **What's the base case?** A `null` node contributes `(sum=0, count=0)` to whatever called it — this correctly represents "there's nothing here to add."
* **What order must things happen in?** We must fully finish processing a node's **children** before we can compute that node's *own* subtree sum/count — this is naturally what post-order traversal provides.
* **How do I count matches across the WHOLE tree?** Use a counter variable that gets incremented every time a node's condition is satisfied during the recursive traversal.

---

## 8. Start With the Brute Force Solution

**Naive idea:** For each node, separately walk its *entire* subtree from scratch to compute the sum and count, then compare to its value.

**Why it's correct but wasteful:** A node near the root has its subtree scanned, then each of its children's subtrees get scanned again separately — leading to $O(N^2)$ work on skewed trees.

```java
// Illustrative naive approach (works, but wastefully re-scans subtrees) — for understanding only
class Solution {
    private int count = 0;

    public int averageOfSubtree(TreeNode root) {
        checkEveryNode(root);
        return count;
    }

    private void checkEveryNode(TreeNode node) {
        if (node == null) return;

        int[] sumAndCount = sumAndCountOfSubtree(node); // full rescan, every time!
        if (node.val == sumAndCount[0] / sumAndCount[1]) {
            count++;
        }

        checkEveryNode(node.left);
        checkEveryNode(node.right);
    }

    private int[] sumAndCountOfSubtree(TreeNode node) {
        if (node == null) return new int[]{0, 0};
        int[] left = sumAndCountOfSubtree(node.left);
        int[] right = sumAndCountOfSubtree(node.right);
        return new int[]{node.val + left[0] + right[0], 1 + left[1] + right[1]};
    }
}
```

```javascript
// Illustrative naive approach (works, but wastefully re-scans subtrees) — for understanding only
class Solution {
    averageOfSubtree(root) {
        let count = 0;

        const sumAndCountOfSubtree = (node) => {
            if (node === null) return [0, 0];
            const left = sumAndCountOfSubtree(node.left);
            const right = sumAndCountOfSubtree(node.right);
            return [node.val + left[0] + right[0], 1 + left[1] + right[1]];
        };

        const checkEveryNode = (node) => {
            if (node === null) return;

            const [sum, totalCount] = sumAndCountOfSubtree(node);
            if (node.val === Math.floor(sum / totalCount)) {
                count++;
            }

            checkEveryNode(node.left);
            checkEveryNode(node.right);
        };

        checkEveryNode(root);
        return count;
    }
}
```

---

## 9. Explain the Naive Code Line by Line

* `private int count = 0;` — a running total of how many nodes satisfy the condition, tracked as we go.
* `checkEveryNode(root)` — kicks off a traversal that visits *every* node in the tree, one at a time.
* Inside `checkEveryNode`: `if (node == null) return;` — base case, nothing to check for a non-existent node.
* `int[] sumAndCount = sumAndCountOfSubtree(node);` — for the *current* node, do a **completely separate, full recursive scan** of its entire subtree just to get its sum and count.
* `if (node.val == sumAndCount[0] / sumAndCount[1]) count++;` — check the matching condition, using integer division.
* `checkEveryNode(node.left); checkEveryNode(node.right);` — recursively check children, each triggering full sub-traversals.

---

## 10. Why Is This Naive Approach Not Ideal?

Imagine a tree shaped like a long chain (each node has exactly one child, going 1000 nodes deep). For the topmost node, `sumAndCountOfSubtree` walks 1000 nodes. For the second, it walks 999 nodes. Total work: roughly `1000 + 999 + ... + 1 ≈ 500,000` operations ($O(N^2)$). We can eliminate all repeated rescans by computing the aggregate bottom-up in a single pass.

---

## 11. Find the Better Approach

```text
Naive:
For each node, separately rescan its whole subtree to get sum/count
        ↓
O(n²) — massive repeated rescanning
        ↓
Realize: a node's subtree sum/count can be built DIRECTLY from its
          children's subtree sum/count, which we're already computing
          recursively anyway
        ↓
Combine "compute sum/count" and "check the condition" into ONE recursive function
        ↓
Each node is only ever "fully processed" once
        ↓
O(n) total
```

---

## ⭐ Key Insight

### Before the insight
It feels like we need two separate steps: first get every node's subtree sum/count; second, use that info to check matches.

### The problem
Doing these as two separate traversal passes leads to repeated $O(N^2)$ sub-scans.

### The insight
**A single post-order recursive function can compute a subtree's `(sum, count)` AND check-and-count the matching condition for that node, all in one pass.** By the time `node.left` and `node.right` return their pairs to `node`, we immediately know `node`'s subtree sum and count, evaluate `node.val == sum / count`, increment the counter, and return `node`'s aggregated pair to its parent.

### After the insight
Every node in the tree is processed **exactly once** in $O(1)$ time per node, scaling in $O(N)$ total time.

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 2**: `root = [1]` (single node).

* Call on root (`1`): `left` is `null`, `right` is `null`.
* Recursive call on `left` (`null`) → returns `(0, 0)`.
* Recursive call on `right` (`null`) → returns `(0, 0)`.
* Combine: `mySum = 1 + 0 + 0 = 1`, `myCount = 1 + 0 + 0 = 1`.
* Check: `average = 1 / 1 = 1`. `node.val (1) == 1` → **Match!** `matchCount = 1`.
* Return `(1, 1)`. Output = `1`. ✔️

---

## 14. Optimized Code

```java
class Solution {
    private int matchCount = 0;

    public int averageOfSubtree(TreeNode root) {
        computeSumAndCount(root);
        return matchCount;
    }

    // Returns {sum of this subtree, count of nodes in this subtree}
    private int[] computeSumAndCount(TreeNode node) {
        if (node == null) {
            return new int[]{0, 0};
        }

        int[] leftResult = computeSumAndCount(node.left);
        int[] rightResult = computeSumAndCount(node.right);

        int subtreeSum = node.val + leftResult[0] + rightResult[0];
        int subtreeCount = 1 + leftResult[1] + rightResult[1];

        int average = subtreeSum / subtreeCount; // integer division rounds down

        if (average == node.val) {
            matchCount++;
        }

        return new int[]{subtreeSum, subtreeCount};
    }
}
```

```javascript
class Solution {
    averageOfSubtree(root) {
        let matchCount = 0;

        // Returns [subtreeSum, subtreeCount]
        const computeSumAndCount = (node) => {
            if (node === null) {
                return [0, 0];
            }

            const [leftSum, leftCount] = computeSumAndCount(node.left);
            const [rightSum, rightCount] = computeSumAndCount(node.right);

            const subtreeSum = node.val + leftSum + rightSum;
            const subtreeCount = 1 + leftCount + rightCount;

            const average = Math.floor(subtreeSum / subtreeCount);

            if (average === node.val) {
                matchCount++;
            }

            return [subtreeSum, subtreeCount];
        };

        computeSumAndCount(root);
        return matchCount;
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `private int matchCount = 0;` — accumulator variable across the entire traversal.
* `averageOfSubtree(TreeNode root)` — initiates traversal on root and returns final count.
* `if (node == null) return new int[]{0, 0};` — base case: null subtree contributes 0 sum and 0 count.
* `computeSumAndCount(node.left)` & `computeSumAndCount(node.right)` — post-order traversal: resolve child subtrees first.
* `int subtreeSum = node.val + leftResult[0] + rightResult[0];` — aggregates current node with left and right sums.
* `int subtreeCount = 1 + leftResult[1] + rightResult[1];` — aggregates node count (1 for current node + child counts).
* `int average = subtreeSum / subtreeCount;` — computes integer rounded-down average.
* `if (average == node.val) matchCount++;` — tests condition and increments match counter.
* `return new int[]{subtreeSum, subtreeCount};` — passes accumulated subtree statistics to parent.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`root = [4,8,5,0,1,null,6]` → 5 matches (nodes 0, 1, 6, 5, 4) → Output: `5` ✔️

### Example 2 — Different Case
`root = [1]` → 1 match → Output: `1` ✔️

### Example 3 — Single-child tree
`root = [1, 2]` → Leaf 2 matches (avg 2), root 1 matches (avg (1+2)/2 = 1) → Output: `2` ✔️

---

## 17. Edge Cases

* **Single node:** Always matches (avg equals node value) → returns `1`.
* **All leaves in any tree:** Always match trivially.
* **All equal values:** Every subtree average equals that same value → returns total node count $N$.
* **Skewed / Degenerate tree (linked list structure):** Handled in $O(N)$ without stack overflow within problem constraints ($N \le 1000$).

---

## 18. Time Complexity

* **Optimized Solution:** $O(N)$ — every node is visited exactly once, doing $O(1)$ operations per node.
* **Naive Rescan:** $O(N^2)$ in worst-case skewed trees.

---

## 19. Space Complexity

* **Call Stack Space:** $O(H)$, where $H$ is the height of the tree.
  * Balanced tree: $O(\log N)$
  * Skewed tree: $O(N)$
* **Auxiliary Variables:** $O(1)$.

---

## 20. Common Mistakes Beginners Make

* ❌ **"Floating-point division is required."**
  * ✅ Integer division / `Math.floor` naturally rounds down as specified.
* ❌ **"Subtree excludes the current node."**
  * ✅ A subtree rooted at $X$ includes $X$ itself plus all its descendants.
* ❌ **"Using two separate traversals."**
  * ✅ Bottom-up post-order combines statistics gathering and condition verification in one single pass.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for:
```text
"For every node in a binary tree, compute property of its subtree"
"Subtree sum / average / maximum / height"
Bottom-up tree aggregation
```
Whenever a parent needs aggregated metrics from its children, use **post-order DFS returning a multi-value tuple `(metric1, metric2)`**.

---

## 22. Interview Thinking

```text
1. Understand the input    → root of a binary tree
2. Understand the output   → count of nodes where value == average of its own subtree
3. Try brute force         → separately recompute each node's subtree sum/count from scratch
4. Find what makes it slow → massive repeated rescanning of overlapping subtrees
5. Identify repeated work  → a node's subtree sum/count is directly derivable from its
                              children's subtree sum/count, which we're already computing
6. What can be stored?     → return (sum, count) up through the natural recursive call structure
7. Optimize                → one post-order recursive function: compute children's results
                              first, combine them, check the condition, return upward
8. Check edge cases        → single node, leaves (always match), one-sided children, all-equal values
9. Analyze complexity      → O(n) time, O(height) space
```

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why must we fully compute `leftResult` and `rightResult` before computing `subtreeSum` and `subtreeCount`?
2. If a node has `subtreeSum = 10` and `subtreeCount = 3`, what is the computed average, and would it match node value 4?
3. Why does every leaf node automatically match?

<br>

### Answer to Mini Challenge

1. A parent's subtree statistics are defined as the sum of its children's subtree statistics plus its own; children must finish first.
2. `10 / 3 = 3` (integer division). It matches value 3, but does not match value 4.
3. For any leaf, `subtreeSum = leaf.val` and `subtreeCount = 1`, so `leaf.val / 1 = leaf.val`.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Count how many nodes in a binary tree have a value equal to the rounded-down average of all values in their own subtree.

### 🔑 Main Idea
A single post-order recursive traversal computes each node's subtree `(sum, count)` bottom-up and verifies the average condition on the fly in $O(N)$ time.

### ⚙️ Algorithm
1. Base case: `node == null` returns `(0, 0)`.
2. Recursively get `left = (leftSum, leftCount)` and `right = (rightSum, rightCount)`.
3. `subtreeSum = node.val + leftSum + rightSum`; `subtreeCount = 1 + leftCount + rightCount`.
4. If `Math.floor(subtreeSum / subtreeCount) == node.val`, increment `matchCount`.
5. Return `(subtreeSum, subtreeCount)`.

### ⏱️ Complexity
* **Time:** $O(N)$
* **Space:** $O(H)$

---

## 25. Beginner Quiz

1. **(Understanding)** Why does a subtree's definition always include the node itself, not just its descendants?
2. **(Basic concept)** What does the base case `return new int[]{0, 0};` for a `null` node represent, in plain words?
3. **(Logic)** Why can we safely check and count the current node's matching condition *before* returning its (sum, count) to its parent, rather than needing some separate later pass?
4. **(Dry run)** For a tree `root = [2,2,2]` (root value 2, left child value 2, right child value 2), compute the (sum, count) at each node and determine the final answer.
5. **(Complexity/pattern)** Why would the naive "rescan each subtree separately" approach be $O(N^2)$ for a chain-shaped tree specifically, and what general tree-problem signal should make you reach for a single combined post-order traversal instead?
