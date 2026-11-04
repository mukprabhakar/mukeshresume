---
title: "3903. Smallest Stable Index I"
slug: 'smallest-stable-index-i'
date: '2026-09-05'
difficulty: 'Easy'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(N)'
tags: ['Array', 'Prefix Max', 'Suffix Min', 'Precomputation']
excerpt: "Find the smallest index where the maximum of all elements from the start minus the minimum of all elements to the end is at most k using prefix max and suffix min precomputations."
---

# 3903. Smallest Stable Index I

Let's teach this one from absolute zero, same structure as always.

---

## 1. Problem in Very Simple Language

You have an array of numbers, `nums`, and a threshold number `k`.

For **every single index** `i` in the array, you compute a special value called its **instability score**, defined as:

* Look at all the numbers from the **very start** of the array up through index `i` (inclusive) — find the **biggest** number among them.
* Look at all the numbers from index `i` (inclusive) all the way to the **very end** of the array — find the **smallest** number among them.
* Subtract: `(biggest number in the first part) - (smallest number in the second part)`. That's the instability score for index `i`.

Notice something important: index `i` is included in **both** halves — once when finding the max of "everything up to and including `i`," and once when finding the min of "everything from `i` to the end, including `i`."

An index is called **stable** if its instability score is `≤ k`.

**Goal:** find the **smallest** index that is stable. If no index qualifies, return `-1`.

* **What's given:** the array `nums`, and threshold `k`.
* **What to find:** for each index, the max-of-left-part minus min-of-right-part, then the earliest index where this is small enough.
* **What to return:** that smallest stable index, or `-1`.

---

## 2. Real-Life Analogy

Imagine you're standing at some point along a hiking trail, looking both ways. Looking **backward** (toward the start of the trail, including where you're standing), you note the **highest peak** you can see behind you. Looking **forward** (toward the end of the trail, including where you're standing), you note the **lowest valley** you can see ahead of you.

Your "instability score" at this spot is: how much higher is that tallest peak behind you compared to that lowest valley ahead of you? If that difference is small enough (≤ some tolerance `k`), you'd call this spot "stable" — the terrain immediately behind and ahead doesn't swing too wildly. You want to find the **very first (leftmost)** spot along the trail where this is true.

---

## 3. Important Programming Concepts I Need First

### Array
* **Concept:** A numbered list of values, indexed from 0.
* **Example:** `nums = [5,0,1,4]` — index 0 holds `5`, index 3 holds `4`.
* **Why we need it:** Our input and all our reasoning happen over this array.

### Variable
* **Concept:** A named "box" holding a value we can update.
* **Example:** `int runningMax = 5;`
* **Why we need it:** We'll track a "max so far" and a "min so far" as we scan.

### Loop
* **Concept:** Repeats an action across every item in a list.
* **Example:** "For each index, update the running maximum."
* **Why we need it:** We need to scan the array (potentially more than once) to build up the information needed at every index.

### If/else
* **Concept:** Branching based on a condition.
* **Example:** "If this index's instability score is ≤ k, we found our answer."
* **Why we need it:** Checking the stability condition, and updating running max/min, both require decisions.

### Prefix Max (a new but simple pattern)
* **Concept:** A **prefix max array** is a helper array where position `i` stores "the biggest value seen from the start of the array up through position `i`." You build it left-to-right, and each entry only ever needs to compare the *previous* prefix max to the current element — no need to rescan everything from the start each time.
* **Example:** For `[5,0,1,4]`: prefixMax = `[5, 5, 5, 5]` (since `5` is the biggest seen at every point from index 0 onward).
* **Why we need it:** The problem needs "max of everything from 0 to `i`" for *every* `i` — precomputing this once, left to right, avoids recalculating that max from scratch for every index.

### Suffix Min (the mirror-image idea)
* **Concept:** A **suffix min array** stores, at position `i`, "the smallest value seen from position `i` all the way to the end." You build it **right-to-left**, comparing each entry to the *next* suffix min.
* **Example:** For `[5,0,1,4]`: suffixMin = `[0, 0, 1, 4]` (reading right to left: at index 3, min is 4; at index 2, min of `{1,4}` is 1; at index 1, min of `{0,1,4}` is 0; at index 0, min of `{5,0,1,4}` is 0).
* **Why we need it:** The problem needs "min of everything from `i` to the end" for every `i` — precomputing this once, right to left, similarly avoids repeated rescanning.

### Time Complexity
We'll use this to explain why our approach (with `n` up to only 100 here, admittedly tiny) is efficient and clean.

---

## 4. Understand the Input

Take Example 1:
```text
nums = [5, 0, 1, 4]
k = 3
```

| Index | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Value | 5 | 0 | 1 | 4 |

* We need, for **each** index `i`, two numbers: the max from index `0` to `i`, and the min from index `i` to the end (index 3).
* `k = 3` is our tolerance — we want the smallest index where `(max of left part) - (min of right part) <= 3`.
* Why does index `i` belong to *both* parts? Because the problem explicitly defines both ranges (`0..i` and `i..n-1`) as inclusive of `i` itself — this is a detail worth double-checking carefully, since it's easy to accidentally exclude `i` from one side.

---

## 5. Understand the Output

Output: `3`

* At index 0: max of `[5]` = 5; min of `[5,0,1,4]` = 0; score = `5 - 0 = 5`. Not ≤ 3.
* At index 1: max of `[5,0]` = 5; min of `[0,1,4]` = 0; score = `5 - 0 = 5`. Not ≤ 3.
* At index 2: max of `[5,0,1]` = 5; min of `[1,4]` = 1; score = `5 - 1 = 4`. Not ≤ 3.
* At index 3: max of `[5,0,1,4]` = 5; min of `[4]` = 4; score = `5 - 4 = 1`. **This is ≤ 3!** Stable.
* Since index 3 is the *first* index where the score drops to ≤ k, the answer is `3`.

---

## 6. Solve the Example Manually

Let's build the two helper arrays by hand for `nums = [5, 0, 1, 4]`.

**Step 1: Build the prefix max array, left to right.**

| Index | Value | Compare to previous prefix max | New prefix max |
|---|---|---|---|
| 0 | 5 | (nothing before) start with 5 | 5 |
| 1 | 0 | max(5, 0) = 5 | 5 |
| 2 | 1 | max(5, 1) = 5 | 5 |
| 3 | 4 | max(5, 4) = 5 | 5 |

`prefixMax = [5, 5, 5, 5]`

**Step 2: Build the suffix min array, right to left.**

| Index | Value | Compare to next suffix min | New suffix min |
|---|---|---|---|
| 3 | 4 | (nothing after) start with 4 | 4 |
| 2 | 1 | min(1, 4) = 1 | 1 |
| 1 | 0 | min(0, 1) = 0 | 0 |
| 0 | 5 | min(5, 0) = 0 | 0 |

`suffixMin = [0, 0, 1, 4]`

**Step 3: Scan left to right, compute `prefixMax[i] - suffixMin[i]`, and stop at the first index where it's ≤ k.**

| Index | prefixMax | suffixMin | Score | ≤ k(3)? |
|---|---|---|---|---|
| 0 | 5 | 0 | 5 | No |
| 1 | 5 | 0 | 5 | No |
| 2 | 5 | 1 | 4 | No |
| 3 | 5 | 4 | 1 | **Yes!** |

First qualifying index: `3`. ✔️ matches!

---

## 7. Think Like a Programmer

* **What do I know?** For any index, I need "max of everything up to here" and "min of everything from here onward."
* **What do I need to find?** The smallest index where the difference of these two is small enough.
* **What can I try?** The most direct idea: for each index `i`, separately scan `0..i` for the max and separately scan `i..n-1` for the min, then compare. This works, but redoes a lot of scanning repeatedly for every `i`.
* **What happens if I try every possibility?** For each of the `n` indices, scanning up to `n` elements twice (once for the max part, once for the min part) costs about `O(n)` per index, so `O(n²)` total. With `n` only up to `100` here, this is actually totally fine performance-wise — but it's still wasteful, and understanding the smarter way matters for building good habits (and for when `n` is much bigger in similar problems).
* **Can I make it faster?** Yes — notice that "max of `0..i`" only ever changes by *possibly* growing as `i` increases (each step, we just compare the new element to the *previous* max-so-far, we never need to rescan). Similarly, "min of `i..n-1`" only changes as `i` decreases (walking right to left, comparing to the *previous* min-so-far in that direction). This means we can compute *all* prefix maxes in a single left-to-right pass, and *all* suffix mins in a single right-to-left pass — each index's answer becomes an O(1) lookup after that.
* **What information should I remember?** Two full helper arrays (`prefixMax`, `suffixMin`), each built with a single running "best so far" variable during its own pass.
* **What pattern do I notice?** This is a classic **prefix/suffix precomputation** pattern: whenever you need "some aggregate over everything to the left" and/or "some aggregate over everything to the right," for *every* position, build those aggregates once in a single pass each, rather than recomputing them from scratch per position.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** For each index `i` from 0 to `n-1`, scan `nums[0..i]` to find the max, scan `nums[i..n-1]` to find the min, compute the difference, and check against `k`. Return the first `i` that qualifies.

**Why it works:** It directly computes exactly what the problem defines, for every index, with no shortcuts — guaranteed correct.

**Time complexity:** For each of the `n` indices, we do up to `O(n)` work scanning both halves, so `O(n²)` total.

**Space complexity:** `O(1)` extra (just a couple of tracking variables per index, no persistent extra array needed).

```java
class Solution {
    public int firstStableIndex(int[] nums, int k) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            int maxLeft = Integer.MIN_VALUE;
            for (int a = 0; a <= i; a++) {
                maxLeft = Math.max(maxLeft, nums[a]);
            }

            int minRight = Integer.MAX_VALUE;
            for (int b = i; b < n; b++) {
                minRight = Math.min(minRight, nums[b]);
            }

            if (maxLeft - minRight <= k) {
                return i;
            }
        }

        return -1;
    }
}
```

---

## 9. Explain the Brute Force Code Line by Line

* `int n = nums.length;` — total number of elements.
* The outer `for (int i = 0; i < n; i++)` loop — tries every index in order, from smallest to largest (so the very first one that qualifies is naturally the *smallest* stable index).
* `int maxLeft = Integer.MIN_VALUE;` — start impossibly small, so any real value we compare against it will correctly update it.
* The inner `for (int a = 0; a <= i; a++)` loop — scans every index from `0` up to and including `i`, updating `maxLeft` to be the running biggest value seen. This directly computes `max(nums[0..i])`.
* `int minRight = Integer.MAX_VALUE;` — start impossibly large, so it will correctly shrink down to the true minimum as we scan.
* The inner `for (int b = i; b < n; b++)` loop — scans every index from `i` to the end, updating `minRight` to the running smallest value. This computes `min(nums[i..n-1])`.
* `if (maxLeft - minRight <= k) return i;` — check the stability condition; if satisfied, we've found our answer, so return immediately.
* `return -1;` — if we finish the outer loop without ever returning, no index was stable.

---

## 10. Why Might the Brute Force Not Be Ideal (in general)?

For this specific problem, `n` is capped at just `100`, so `O(n²)` is at most `10,000` operations — genuinely no performance problem at all here. But imagine a *similar* problem where `n` could be `100,000` — then `O(n²)` would balloon to `10` billion operations, far too slow. It's worth learning the faster technique now, both because it's cleaner code and because it's the *right* habit for when constraints are bigger.

---

## 11. Find the Better Approach

```text
Brute Force:
For each i, rescan 0..i for max AND rescan i..n-1 for min
        ↓
O(n) work PER index → O(n²) total
        ↓
Realize: max(0..i) only needs max(0..i-1) plus nums[i] — no full rescan needed
        ↓
Realize: min(i..n-1) only needs min(i+1..n-1) plus nums[i] — same idea, other direction
        ↓
Build prefixMax array in one left-to-right pass
Build suffixMin array in one right-to-left pass
        ↓
Final answer: single pass comparing prefixMax[i] - suffixMin[i] to k
        ↓
O(n) total
```

---

## ⭐ Key Insight

### Before the insight
It feels like finding "max of everything up to `i`" and "min of everything from `i` onward" requires looking at a growing/shrinking chunk of the array fresh, for every single `i`.

### The problem
Rescanning a growing or shrinking range from scratch, for every index, repeats a huge amount of comparison work that's almost entirely redundant between consecutive indices.

### The insight
**`max(nums[0..i])` is just `max(nums[0..i-1], nums[i])`** — the max up to `i` is simply "whatever the max was one step earlier, compared with the one new element." This means we can build the *entire* prefix-max array with a single left-to-right sweep, carrying forward one running value. The exact same logic applies in reverse for the suffix-min array, built with a single right-to-left sweep.

### After the insight
Once both helper arrays exist, answering "what's the instability score at index `i`?" for *every* `i` becomes an instant lookup (`prefixMax[i] - suffixMin[i]`) — no rescanning at all. The whole algorithm becomes three simple, single-direction passes.

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 2**: `nums = [3, 2, 1], k = 1`.

**Step 1: Build prefixMax (left to right).**

| Index | Value | prefixMax |
|---|---|---|
| 0 | 3 | 3 |
| 1 | 2 | max(3,2)=3 |
| 2 | 1 | max(3,1)=3 |

`prefixMax = [3, 3, 3]`

**Step 2: Build suffixMin (right to left).**

| Index | Value | suffixMin |
|---|---|---|
| 2 | 1 | 1 |
| 1 | 2 | min(2,1)=1 |
| 0 | 3 | min(3,1)=1 |

`suffixMin = [1, 1, 1]`

**Step 3: Scan for the first index where `prefixMax[i] - suffixMin[i] <= k(1)`.**

| Index | prefixMax | suffixMin | Score | ≤ 1? |
|---|---|---|---|---|
| 0 | 3 | 1 | 2 | No |
| 1 | 3 | 1 | 2 | No |
| 2 | 3 | 1 | 2 | No |

No index qualifies → return `-1`. ✔️ matches!

---

## 14. Optimized Code

```java
class Solution {
    public int firstStableIndex(int[] nums, int k) {
        int n = nums.length;

        int[] prefixMax = new int[n];
        prefixMax[0] = nums[0];
        for (int i = 1; i < n; i++) {
            prefixMax[i] = Math.max(prefixMax[i - 1], nums[i]);
        }

        int[] suffixMin = new int[n];
        suffixMin[n - 1] = nums[n - 1];
        for (int i = n - 2; i >= 0; i--) {
            suffixMin[i] = Math.min(suffixMin[i + 1], nums[i]);
        }

        for (int i = 0; i < n; i++) {
            if (prefixMax[i] - suffixMin[i] <= k) {
                return i;
            }
        }

        return -1;
    }
}
```

```javascript
class Solution {
    firstStableIndex(nums, k) {
        const n = nums.length;

        const prefixMax = new Array(n);
        prefixMax[0] = nums[0];
        for (let i = 1; i < n; i++) {
            prefixMax[i] = Math.max(prefixMax[i - 1], nums[i]);
        }

        const suffixMin = new Array(n);
        suffixMin[n - 1] = nums[n - 1];
        for (let i = n - 2; i >= 0; i--) {
            suffixMin[i] = Math.min(suffixMin[i + 1], nums[i]);
        }

        for (let i = 0; i < n; i++) {
            if (prefixMax[i] - suffixMin[i] <= k) {
                return i;
            }
        }

        return -1;
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `int n = nums.length;` — total element count.
* `int[] prefixMax = new int[n];` — a new array where `prefixMax[i]` will hold `max(nums[0..i])`.
* `prefixMax[0] = nums[0];` — the base case: with only one element (index 0) considered, the max is that element itself.
* The `for (int i = 1; i < n; i++)` loop — for every later index, `prefixMax[i] = Math.max(prefixMax[i-1], nums[i])`: take whatever the max was one step back, compare it to the current element, and keep the bigger one.
* `int[] suffixMin = new int[n];` — similarly, `suffixMin[i]` will hold `min(nums[i..n-1])`.
* `suffixMin[n-1] = nums[n-1];` — base case: with only the last element considered, the min is just that element.
* The `for (int i = n - 2; i >= 0; i--)` loop — walks **backward** from the second-to-last index down to `0`. `suffixMin[i] = Math.min(suffixMin[i+1], nums[i])`: take whatever the min was one step ahead, compare it to the current element, keep the smaller one.
* The final `for (int i = 0; i < n; i++)` loop — scans indices in increasing order and checks `prefixMax[i] - suffixMin[i] <= k`. The moment this is true, we return `i` immediately (guaranteed to be the smallest such index).
* `return -1;` — if no index satisfies the condition, none is stable.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`nums=[5,0,1,4], k=3` → dry-ran manually in Section 6 → Output: `3` ✔️

### Example 2 — Different Case
`nums=[3,2,1], k=1` → dry-ran in Section 13 → Output: `-1` ✔️

### Example 3 — Edge Case (single element)
`nums=[0], k=0`. `n=1`. `prefixMax=[0]`, `suffixMin=[0]`. Check index 0: `prefixMax[0] - suffixMin[0] = 0 - 0 = 0 <= 0`? Yes! → Output: `0` ✔️

---

## 17. Edge Cases

* **Single-element array (`n=1`)** → both helper arrays are just the base case, index 0's score is `nums[0] - nums[0] = 0`, so it's stable exactly when `k >= 0` — which is guaranteed by constraints, so a single-element array is **always** stable at index 0.
* **No stable index exists at all** → the final scan finishes without returning, correctly falling through to `return -1`.
* **The array is already fully sorted increasing** (e.g., `[1,2,3,4]`) → at the last index, `prefixMax` = last element, `suffixMin` = last element, score is `0`, so the last index is always stable.
* **The array is sorted strictly decreasing** (e.g., `[4,3,2,1]`) → `prefixMax` stays at the first element; `suffixMin` stays at the last element throughout — every index has the same score (`first - last`).
* **All elements identical** → `prefixMax[i] == suffixMin[i]` everywhere → score is always `0` → index 0 is always stable.

---

## 18. Time Complexity

```text
Brute Force:
O(n²) — for each index, rescanning up to n elements twice

Optimized:
O(n) — one pass to build prefixMax, one pass to build suffixMin,
        one pass to scan for the answer (3 × O(n) = O(n))
```

**Why:** Each of our three passes touches every element exactly once, doing constant work per element. The total work scales linearly with `n`.

---

## 19. Space Complexity

* `prefixMax` and `suffixMin` are each full arrays of length `n`.

So extra space used is `O(n)`.

---

## 20. Common Mistakes Beginners Make

❌ "The max range is `0` to `i-1`, and the min range is `i+1` to `n-1` (excluding `i` from both)."
✅ Both `max(nums[0..i])` and `min(nums[i..n-1])` **include** index `i` itself.

❌ "I should rescan the whole 0..i range from scratch every time to compute the prefix max."
✅ You only need the *previous* prefix max value plus the current element: `max(0..i) = max(prefixMax[i-1], nums[i])`.

❌ "I'll build the suffix min array left to right, like the prefix max."
✅ The suffix min must be built **right to left**, since `min(i..n-1)` depends on `min(i+1..n-1)`.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"For every index, consider everything to its left" (max/min/sum/count from the start up to i)
"For every index, consider everything to its right" (max/min/sum/count from i to the end)
"Prefix" or "suffix" explicitly mentioned
A formula combining a left-side aggregate and a right-side aggregate, evaluated at every position
```

Whenever a problem asks you to compute some aggregate of everything to one side for every position, think **prefix array** or **suffix array** to optimize $O(N^2)$ to $O(N)$.

---

## 22. Interview Thinking

```text
1. Understand the input    → array + threshold k
2. Understand the output   → smallest index where max-of-left minus min-of-right <= k
3. Try brute force         → for each index, separately scan both sides fresh
4. Find what makes it slow → repeatedly rescanning overlapping ranges for every index
5. Identify repeated work  → max(0..i) and max(0..i-1) differ by just one new element
6. What can be stored?     → running prefix-max array and suffix-min array
7. Optimize                → build both in one pass each, then a final O(n) scan
8. Check edge cases        → single element, sorted increasing/decreasing, all-equal elements
9. Analyze complexity      → O(n) time, O(n) space
```

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why do we build the prefix max array by comparing to the *previous* prefix max, rather than the original array's previous *element*?
2. If `nums = [7, 7, 7]`, what would `prefixMax` and `suffixMin` look like, and what's the instability score at every index?
3. Why is scanning left-to-right in the final step (rather than right-to-left) important for correctly returning the *smallest* stable index?

<br>

## Answer to Mini Challenge

1. Because the prefix max needs to reflect the biggest value seen across *all* elements up to this point, not just a comparison with the single element right before it.
2. `prefixMax = [7,7,7]`, `suffixMin = [7,7,7]` — every index has score `7 - 7 = 0`. Index 0 is stable, answer is `0`.
3. Scanning left to right guarantees you encounter indices in increasing order, so the very first match you find is naturally the smallest.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Find the smallest index where the maximum of everything to its left (inclusive) minus the minimum of everything to its right (inclusive) is at most `k`.

## 🔑 Main Idea
Precompute a prefix-max array (left to right) and a suffix-min array (right to left), then scan once for the first index where their difference is at most `k`.

## ⚙️ Algorithm
1. Build `prefixMax[i] = max(prefixMax[i-1], nums[i])`, left to right.
2. Build `suffixMin[i] = min(suffixMin[i+1], nums[i])`, right to left.
3. Scan indices left to right, returning the first `i` where `prefixMax[i] - suffixMin[i] <= k`.
4. If none found, return `-1`.

## ⏱️ Complexity
Time: `O(n)`
Space: `O(n)`

## 🎯 Pattern to Remember
"Aggregate over everything to the left/right, for every index" → prefix/suffix precomputation, not repeated rescanning.

---

## 25. Beginner Quiz

1. **(Understanding)** Why is index `i` included in *both* the left range and the right range when computing its instability score?
2. **(Basic concept)** What's the difference between how you build a prefix max array versus a suffix min array — which direction does each one scan?
3. **(Logic)** Why is it safe to return the first index (scanning left to right) that satisfies the stability condition, without needing to check any later indices?
4. **(Dry run)** For `nums = [2, 8, 1, 6], k = 5`, build the prefix max and suffix min arrays, and find the smallest stable index (or determine there isn't one).
5. **(Complexity/pattern)** Why does this problem's brute force (`O(n²)`) run instantly anyway given the constraints, and what specific phrase in the problem statement ("for each index... 0 to i" and "i to n-1") should cue you to reach for prefix/suffix arrays regardless of whether the constraints strictly require it?
