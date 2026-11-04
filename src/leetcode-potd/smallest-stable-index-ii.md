---
title: "3904. Smallest Stable Index II"
slug: 'smallest-stable-index-ii'
date: '2026-09-05'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(N)'
tags: ['Array', 'Prefix Max', 'Suffix Min', 'Precomputation']
excerpt: "Find the smallest index where the maximum of all elements from the start minus the minimum of all elements to the end is at most k with large constraints (N up to 100,000) using prefix max and suffix min precomputation."
---

# 3904. Smallest Stable Index II

Good news: this is **exactly the same problem** as Part I — same definition, same examples — with only one thing changed in the constraints: `n` can now be up to `10^5` instead of `100`. That single change is the whole story of this "sequel." Let's walk through it properly anyway, since it's worth understanding *why* this constraint bump matters.

---

## 1. Problem in Very Simple Language

Identical to Part I: for every index `i`, the **instability score** is `max(nums[0..i]) - min(nums[i..n-1])` — the biggest value from the start through `i` (inclusive), minus the smallest value from `i` through the end (inclusive). An index is **stable** if this score is `≤ k`. Find the smallest stable index, or `-1` if none exists.

* **What's given:** `nums`, `k` — but now `nums` can have up to 100,000 elements.
* **What to find:** the same thing as before.
* **What to return:** the same thing as before.

---

## 2. Real-Life Analogy

Same hiking-trail analogy as Part I: standing at any point, you look backward for the highest peak you've passed, and forward for the lowest valley ahead. You want the first spot where that gap is small enough. The only difference now: **the trail is 1,000 times longer** — so whatever method you use to scan it needs to not get dramatically slower just because the trail grew.

---

## 3. Important Programming Concepts I Need First

Everything from Part I still applies directly:

* **Prefix Max** — `prefixMax[i] = max(nums[0..i])`, built in one left-to-right pass, where `prefixMax[i] = max(prefixMax[i-1], nums[i])`.
* **Suffix Min** — `suffixMin[i] = min(nums[i..n-1])`, built in one right-to-left pass, where `suffixMin[i] = min(suffixMin[i+1], nums[i])`.
* **Why these avoid rescanning:** each one only ever needs "the previous running best" plus "the one new element," never a fresh look back over the whole range.

### New concept this time: Why constraints actually matter here
* **Concept:** A brute-force approach with nested loops (`O(n²)`) that seemed "fine" when `n ≤ 100` (at most `10,000` operations) becomes catastrophic when `n ≤ 100,000` (up to `10,000,000,000` operations) — the *exact same code*, just given a bigger input, goes from "instant" to "would take minutes or longer," which competitive judges like LeetCode simply won't wait for (they enforce a time limit, typically a couple of seconds).
* **Why we need it:** This is precisely why Part I could get away with brute force but Part II cannot — the algorithm must be genuinely `O(n)` (or close to it) this time, not just "technically correct."

---

## 4. Understand the Input

Identical to Part I's Example 1:
```text
nums = [5, 0, 1, 4]
k = 3
```

---

## 5. Understand the Output

Identical reasoning to Part I: output is `3`, since index 3 is the first index where `max(0..i) - min(i..n-1) <= k`.

---

## 6. Solve the Example Manually

This is identical to Part I's Section 6 — building `prefixMax = [5,5,5,5]` and `suffixMin = [0,0,1,4]`, then finding index `3` as the first place where `prefixMax[i] - suffixMin[i] = 5 - 4 = 1 <= 3`. Nothing changes about the manual process — only about how we'd have to implement it if `n` were huge.

---

## 7. Think Like a Programmer

* **What do I know?** The exact same relationships as Part I: `max(0..i) = max(max(0..i-1), nums[i])`, and `min(i..n-1) = min(min(i+1..n-1), nums[i])`.
* **What's different this time?** With `n` up to `100,000`, any approach that does `O(n)` work *per index* (like rescanning a growing/shrinking range from scratch for every `i`) totals `O(n²)` ≈ `10` billion operations in the worst case — this **will time out**.
* **What must I do instead?** Use the prefix-max / suffix-min precomputation from Part I — which was already the "proper" `O(n)` solution there, just not strictly *required* by Part I's tiny constraints. Now, it's mandatory.
* **Is there anything conceptually new to figure out?** No — the insight is 100% the same as Part I. This "Part II" is really testing whether you *actually* understood why the optimized approach works, or whether you just happened to get away with brute force last time because the input was small.

---

## 8. Why the Part I Brute Force Now Fails

Let's revisit the brute force from Part I to see exactly where it breaks:

```java
// This will TIME OUT for n up to 100,000
class Solution {
    public int firstStableIndex(int[] nums, int k) {
        int n = nums.length;

        for (int i = 0; i < n; i++) {
            int maxLeft = Integer.MIN_VALUE;
            for (int a = 0; a <= i; a++) {              // up to n iterations
                maxLeft = Math.max(maxLeft, nums[a]);
            }

            int minRight = Integer.MAX_VALUE;
            for (int b = i; b < n; b++) {                // up to n iterations
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

**Why it times out:** The outer loop runs `n` times, and *each* iteration does up to `2n` work (rescanning both the left part and the right part from scratch). That's `O(n²)` total — for `n = 100,000`, that's on the order of `10` billion basic operations. Even at a very generous "100 million operations per second" estimate, that's roughly 100 seconds — far beyond what any judge will allow (typically 1-2 seconds for Java).

---

## 11. The Fix: Reuse Part I's Optimized Approach

```text
O(n²) brute force (rescanning per index)
        ↓
Precompute prefixMax once, left to right — O(n)
Precompute suffixMin once, right to left — O(n)
        ↓
Final scan: O(n) lookup-and-compare, no rescanning
        ↓
Total: O(n) — now safely handles n up to 100,000
```

---

## ⭐ Key Insight

### Before the insight
It's tempting to think "Part II is a totally new, harder problem" just because the constraints grew.

### The problem
Nothing about the *definition* changed — only the *scale*. If you don't already have a truly `O(n)` (or `O(n log n)`) solution, the bigger input size will expose that weakness immediately via a timeout, even though your Part I brute-force logic was 100% *correct*.

### The insight
**Constraint changes between "Part I" and "Part II" versions of a problem are almost always a direct signal about required time complexity, not a signal that the core logic needs to change.** The prefix-max / suffix-min technique from Part I was *already* the right full solution — Part I just didn't force you to discover it. Part II does.

### After the insight
We reuse the exact same algorithm, unchanged in structure, and it now comfortably handles the full constraint range.

---

## 13. Dry Run

Identical to Part I's Section 13 (Example 2: `nums=[3,2,1], k=1` → `prefixMax=[3,3,3]`, `suffixMin=[1,1,1]`, every index scores `2`, none `≤ 1` → `-1`). The computation process is completely unchanged; only the *size* of array this process needs to comfortably scale to has grown.

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

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`[5,0,1,4], k=3` → Output: `3` ✔️

### Example 2 — Different Case
`[3,2,1], k=1` → Output: `-1` ✔️

### Example 3 — Edge Case
`[0], k=0` → Output: `0` ✔️

### Example 4 — The case that actually distinguishes Part I from Part II
A worst-case-shaped array of length `100,000`, e.g. strictly decreasing (`[100000, 99999, ..., 1]`), with a generous `k`. The brute force from Section 8 would take on the order of **10 billion operations** and time out. The prefix/suffix version processes this instantly, doing three clean passes of `100,000` steps each — about `300,000` total operations, finishing in a few milliseconds.

---

## 17. Edge Cases

All the same edge cases from Part I apply unchanged (single element, all-increasing, all-decreasing, all-equal, no stable index). One *new* thing worth calling out explicitly for this version:

* **Maximum-size input (`n = 100,000`) combined with an unlucky shape (e.g., no stable index exists at all, forcing a full scan through all 100,000 indices before returning `-1`)** — this is the true stress test. Our `O(n)` solution handles it easily (three `100,000`-length passes); the brute force from Section 8 would not.

---

## 18. Time Complexity

```text
Brute Force (Part I's naive version):
O(n²) — for n = 100,000, this is ~10,000,000,000 operations → TIMES OUT

Optimized (prefix/suffix precomputation):
O(n) — three separate single passes, each touching every element once
      → for n = 100,000, this is ~300,000 operations total → runs instantly
```

**Why this matters now, when it didn't in Part I:** with `n ≤ 100`, `O(n²)` tops out at `10,000` operations — trivially fast regardless of approach. With `n ≤ 100,000`, `O(n²)` explodes to `10` billion — a difference of roughly a **million-fold** increase in work, purely from the constraint change. This is exactly why "Part II" versions of easy problems exist: to force you to actually use the efficient technique, not just the correct-but-slow one.

---

## 19. Space Complexity

Same as Part I: `O(n)`, for the two helper arrays `prefixMax` and `suffixMin`. This is very comfortable even at `n = 100,000` (two arrays of 100,000 integers each is trivial memory usage).

---

## 20. Common Mistakes Beginners Make

❌ "My Part I brute-force solution worked, so it must still be correct here — maybe there's a bug elsewhere."
✅ The logic is correct, but *too slow*. A "Time Limit Exceeded" verdict (rather than "Wrong Answer") is the classic symptom of an algorithm that's logically right but complexity-wise inadequate for the given constraints — the fix is a faster algorithm, not different logic.

❌ "I'll just try to make the brute force's inner loops slightly faster (micro-optimizing the same O(n²) shape)."
✅ Shaving constants off an `O(n²)` algorithm doesn't change the fundamental scaling problem — at `n=100,000`, even a "twice as fast" `O(n²)` solution is still on the order of 5 billion operations, still far too slow. You need to change the *complexity class* entirely (to `O(n)`), not just optimize within the slow one.

❌ "This must require a totally different, more advanced algorithm since it's now rated differently or has bigger constraints."
✅ Not necessarily — sometimes (like here), the *correct* efficient algorithm was already fully knowable from the original problem statement; the bigger constraints just remove the option of skipping it.

---

## 21. How to Recognize This Pattern in Other Problems

```text
Same problem statement and examples, but "II" has much larger constraints
      → the REQUIRED algorithm almost certainly hasn't changed conceptually,
        but your IMPLEMENTATION must now hit a stricter time complexity
"n up to 100" vs "n up to 10^5 or 10^9" → a huge jump like this is the
      clearest possible signal that O(n²) (fine for the small version)
      will fail the large version
```

Whenever you see a "II" sequel with the exact same wording but drastically bigger limits, your first move should be: **re-examine your Part I solution's complexity, and if it wasn't already O(n) or O(n log n), figure out the version of it that is**.

---

## 22. Interview Thinking

```text
1. Understand the input    → same as Part I, just n up to 1e5 instead of 100
2. Understand the output   → same as Part I
3. Try brute force         → same O(n²) idea as Part I
4. Find what makes it slow → O(n²) at n=1e5 is ~1e10 operations — will time out
5. Identify repeated work  → same realization as Part I: prefix max / suffix min
                              can each be built incrementally in one pass
6. What can be stored?     → prefixMax array, suffixMin array
7. Optimize                → build both in O(n), then O(n) final scan
8. Check edge cases        → same as Part I, plus explicitly consider max-size stress cases
9. Analyze complexity      → O(n) time, O(n) space — now REQUIRED, not just nice-to-have
```

The interview lesson here: always ask yourself, even when brute force technically passes, **"would this still work if the input were 1,000x bigger?"** — that habit is exactly what separates a solution that happens to pass small tests from one that's genuinely correct in complexity.

---

## 23. Mini Challenge

1. If `n = 100,000` and the array happens to be sorted in strictly increasing order, roughly how many operations would the Part I brute force perform in the worst case (as it checks index by index)? Roughly how many would the optimized version perform?
2. Why doesn't building `prefixMax` and `suffixMin` as two *separate* `O(n)` passes (rather than one combined pass) hurt our overall complexity?
3. If a future "Part III" of this problem allowed `n` up to `10^7`, would the current `O(n)` solution still likely be fast enough? Why?

<br>

## Answer to Mini Challenge

1. Brute force: roughly `n²/2 ≈ 5` billion operations in the worst case. Optimized: roughly `3n = 300,000` operations total (one pass each for prefixMax, suffixMin, and the final scan) — a difference of about four orders of magnitude.
2. Because `O(n) + O(n) + O(n)` is still `O(n)` overall — adding a fixed number of linear passes together doesn't change the overall growth rate; it's still "grows proportionally to n," just with a bigger constant multiplier (3x instead of 1x).
3. Very likely yes — `O(n)` with `n = 10^7` is about 10 million basic operations across each pass (30 million total), which modern judges can typically handle within a couple of seconds.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Identical to Part I: find the smallest index where the max of everything to its left (inclusive) minus the min of everything to its right (inclusive) is at most `k` — but now `n` can be up to `100,000`, so the solution must genuinely be `O(n)`.

## 🔑 Main Idea
The Part I "optimized" approach (prefix-max + suffix-min precomputation) wasn't optional flourish — it's the mandatory solution once `n` grows large, since the brute-force `O(n²)` rescanning approach becomes computationally infeasible.

## ⚙️ Algorithm
1. Build `prefixMax[i] = max(prefixMax[i-1], nums[i])`, left to right.
2. Build `suffixMin[i] = min(suffixMin[i+1], nums[i])`, right to left.
3. Scan left to right, return the first `i` where `prefixMax[i] - suffixMin[i] <= k`.
4. If none found, return `-1`.

## ⏱️ Complexity
Time: `O(n)`
Space: `O(n)`

## 🎯 Pattern to Remember
When a "Part II" keeps the same definition but massively raises `n`, treat it as a direct instruction: **your solution must be O(n) or O(n log n) — go find (or reuse) that version.**

---

## 25. Beginner Quiz

1. **(Understanding)** What is the only thing that actually changed between Part I and Part II of this problem?
2. **(Basic concept)** Roughly how many operations does an `O(n²)` algorithm perform when `n = 100,000`, and how does that compare to an `O(n)` algorithm on the same input?
3. **(Logic)** Why does a solution that passes all of Part I's test cases not guarantee it will pass Part II's, even though the problem statement is word-for-word identical?
4. **(Dry run)** For a strictly decreasing array of length 5, `[50, 40, 30, 20, 10]`, with `k = 15`, compute `prefixMax`, `suffixMin`, and find the smallest stable index using the optimized approach.
5. **(Complexity/pattern)** What general lesson should you take away for recognizing "Part II" style sequels on LeetCode, specifically regarding how much attention to pay to the constraints section versus the problem description?
