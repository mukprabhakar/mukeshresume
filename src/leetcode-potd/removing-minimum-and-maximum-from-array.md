---
title: "2091. Removing Minimum and Maximum From Array"
slug: 'removing-minimum-and-maximum-from-array'
date: '2026-08-30'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(n)'
spaceComplexity: 'O(1)'
tags: ['Array', 'Greedy']
excerpt: "Find the minimum number of deletions from the front or back of an array to remove both the minimum and maximum elements."
---

# 2091. Removing Minimum and Maximum From Array

Let's teach this one from absolute zero, same structure as before.

---

## 1. Problem in Very Simple Language

You have a list of numbers, all different from each other (no duplicates).

Somewhere in this list is the **smallest** number, and somewhere else is the **largest** number.

You want to get rid of *both* of these two special numbers. But you're only allowed to remove numbers in one of two ways:

* Remove from the **front** (delete the leftmost remaining number), or
* Remove from the **back** (delete the rightmost remaining number).

Each single removal (front or back) counts as **one deletion**, and it also removes whatever number happens to be sitting at that end right now — even ordinary numbers you don't care about get deleted along the way if they're \"in front of\" your target.

Your goal: find the **smallest total number of deletions** needed so that, by the time you're done, both the minimum and the maximum values have been removed (it's fine if other numbers get removed too, as a side effect).

* **What's given:** an array of distinct integers.
* **What to find:** the position of the smallest and largest values, and the cheapest way to clear both of them out using only front/back deletions.
* **What to return:** the minimum number of deletions.

---

## 2. Real-Life Analogy

Imagine a line of people waiting at a bus stop, standing in a single row. Two particular people in this row are \"VIPs\" you need to send away — one is the shortest person, one is the tallest person. But there's a rule: you can only ask people to leave from the **front of the line** or the **back of the line**, one at a time — you can't just pluck someone out of the middle.

If both VIPs happen to be standing near the front, you only need a few \"front\" removals. If one VIP is near the front and the other near the back, you might get away with removing a few from each end. If both VIPs are somewhere in the middle-ish area, you have to decide: is it cheaper to clear everyone from the front up through both VIPs, clear everyone from the back up through both, or clear one VIP from the front and the other from the back (leaving the middle-most untouched people alone)?

---

## 3. Important Programming Concepts I Need First

### Array
* **Concept:** A numbered list of values, positions (called \"indices\") starting at 0.
* **Example:** `nums = [2,10,7,5,4,1,8,6]` — position 0 holds `2`, position 5 holds `1`.
* **Why we need it:** Our whole input is an array, and positions (indices) are the key thing we're reasoning about — not the values themselves, but *where* they sit.

### Variable
* **Concept:** A named \"box\" that stores a single value you can use and update later.
* **Example:** `int minIndex = 5;` stores the number `5` in a box named `minIndex`.
* **Why we need it:** We need to remember *where* the minimum value and the maximum value are located.

### Loop
* **Concept:** A way to repeat an action for each item in a list automatically.
* **Example:** \"Go through every position in the array, checking if this is a new smallest or largest value seen so far.\"
* **Why we need it:** To find the minimum and maximum values' positions, we scan through the whole array once.

### If/else
* **Concept:** Lets the program make decisions — \"if this condition is true, do this; otherwise do something else.\"
* **Example:** \"If the current number is smaller than the smallest one seen so far, update our record.\"
* **Why we need it:** Finding min/max, and later comparing our 3 possible removal strategies, both require decision-making.

### Function / Method
* **Concept:** A named, reusable block of code that performs a specific task and can be called by name.
* **Example:** `Math.min(a, b)` is a built-in function that returns the smaller of two numbers.
* **Why we need it:** We'll use `Math.min` and `Math.max` to simplify comparing our final strategies.

### Index (position) vs Value — an important distinction
* **Concept:** The *value* is the actual number stored (like `10`), while the *index* is *where* it sits in the array (like position `1`). These are two completely different things, and this problem cares almost entirely about **indices**, not values.
* **Why we need it:** A common beginner trap in this problem is accidentally reasoning about the *values* of the min/max (like \"10 is big, so...\") when really only their *positions* in the array matter for counting deletions.

### Time Complexity
We'll use this to confirm our solution is efficient enough for arrays of length up to 100,000.

---

## 4. Understand the Input

Take Example 1:
```text
nums = [2, 10, 7, 5, 4, 1, 8, 6]
```

Let's list out each position and value:

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| Value | 2 | 10 | 7 | 5 | 4 | 1 | 8 | 6 |

* The **minimum** value in this array is `1`, and it sits at **index 5**.
* The **maximum** value in this array is `10`, and it sits at **index 1**.
* We are looking for: the fewest total front/back deletions so that both index 5's value and index 1's value get removed.
* Why is it important that the minimum is at index 5 (near the back-ish/middle) while the maximum is at index 1 (near the front)? Because their *positions*, not their actual values (`1` and `10`), are what determines how many deletions each strategy costs.

---

## 5. Understand the Output

Output: `5`

* The explanation removes `2` elements from the front (this removes index 0 and index 1 — and index 1 is exactly where our maximum, `10`, lives!) and `3` elements from the back (this removes indices 7, 6, 5 — and index 5 is exactly where our minimum, `1`, lives!).
* Total deletions: `2 + 3 = 5`.
* Why is this the best? Because the minimum (index 5) and maximum (index 1) are somewhat spread apart — one near the front, one more towards the back — so a mixed \"some from front, some from back\" strategy turns out cheapest, compared to clearing everything from just one side.

---

## 6. Solve the Example Manually

Let's solve Example 1 step by step, exactly as a human would think, without code.

**Step 1: Find the index of the minimum and the index of the maximum.**

Scanning through `[2, 10, 7, 5, 4, 1, 8, 6]`:
* Smallest value found: `1`, at index `5`.
* Largest value found: `10`, at index `1`.

**Step 2: Figure out the smaller and larger of these two indices**, since it doesn't matter *which one* (min or max) is on the left — what matters is their positions relative to each other.

Here, the two indices are `1` and `5`. The smaller one is `1` (let's call it `left`), the larger one is `5` (let's call it `right`).

**Step 3: There are exactly 3 possible strategies. Let's compute the cost of each one, using `n = 8` (array length).**

| Strategy | How it works | Cost formula | Calculation | Result |
|---|---|---|---|---|
| A: Remove both from the front | Delete everything from index 0 up through `right` (the larger index) | `right + 1` | `5 + 1` | `6` |
| B: Remove both from the back | Delete everything from `left` (the smaller index) up through the end | `n - left` | `8 - 1` | `7` |
| C: Remove one from front, one from back | Delete everything from index 0 up through `left`, PLUS everything from `right` to the end | `(left + 1) + (n - right)` | `(1+1) + (8-5)` | `2 + 3 = 5` |

**Step 4: Take the minimum of these three strategy costs.**

`min(6, 7, 5) = 5` ✔️ matches the expected output!

---

## 7. Think Like a Programmer

* **What do I know?** The positions of the minimum and maximum values.
* **What do I need to find?** The cheapest way to guarantee both get removed, using only front or back deletions.
* **What can I try?** Since we can only chip away from the two ends, and we need to reach *both* special positions, there are really only a few fundamentally different \"shapes\" the deletions can take: peel entirely from the front until we've passed both targets, peel entirely from the back until we've passed both targets, or peel some from the front (covering whichever target is closer to the front) and some from the back (covering whichever target is closer to the back).
* **What happens if I try every possibility?** Actually, in this problem, there genuinely are only **3** meaningful possibilities total — not an exponential explosion — because once you know the two target positions, any front/back deletion strategy that successfully removes both must fit one of these 3 shapes. So \"try every possibility\" is actually already cheap here!
* **Can I make it faster?** It's already about as fast as possible — we just need one pass to find min/max positions, then a constant amount of arithmetic.
* **What information should I remember?** Just two numbers: the index of the minimum, and the index of the maximum.
* **What pattern do I notice?** Whichever of the two indices is smaller, calling it `left`, and whichever is larger, calling it `right`, all 3 strategies can be expressed purely in terms of `left`, `right`, and the array length `n`.

---

## 8. Start With the Brute Force Solution

Interestingly, for this particular problem, the \"brute force\" and the \"optimal\" solution are almost the same thing, because the number of genuinely different strategies is fixed at 3, regardless of array size. Let's still walk through it in the spirit of \"start simple.\"

**Brute force idea:** Find where the min and max are. Then directly compute the cost of each of the 3 removal strategies (front-only, back-only, mixed), and return the smallest of the three.

**Why it works:** Any way of clearing both endpoints using only front/back deletions must end up looking like one of these 3 shapes — you can't remove both without either (a) your front-cursor passing both, (b) your back-cursor passing both, or (c) each cursor passing exactly one.

**Why it's correct:** There's no 4th shape — if front-cursor passes only one target and back-cursor passes zero, the other target never gets removed, which fails the requirement.

**Time complexity:** `O(n)` — one pass to find min/max positions, then constant-time arithmetic.

**Space complexity:** `O(1)` — we only store a couple of index variables.

Since actually writing \"keep swapping while it helps\" correctly is tricky and slow, let's skip straight past this shaky brute force and go directly to reasoning about *structure* (Section 7's insight), which is really the natural next step for this problem. (Unlike Two Sum-style problems, here the \"obvious\" brute force isn't even clearly correct without a lot of extra care — so the real lesson is: recognize the connected-components structure early.)

---

## 9. Why Is a More Naive Idea (Simulating Deletions) Not Ideal?

You might be tempted to literally *simulate* removing elements one at a time from either end, trying every possible combination of \"how many from front, how many from back\" and checking if both targets got removed. If you tried *all* combinations of front-count and back-count (from 0 up to n each), that's up to `n × n` combinations to check — for `n = 100,000`, that's 10 billion checks, way too slow. Realizing that there are really only **3 meaningful shapes** (not `n²` shapes) is the key simplification that avoids this slowdown entirely.

---

## 11. Find the Better Approach

> "Can we avoid doing unnecessary work?"

We already avoided it, by recognizing there are only 3 possible \"shapes\" of a valid solution, rather than trying every combination of front-count and back-count.

```text
Naive idea:
Try every combination of (deletions from front, deletions from back)
        ↓
O(n²) combinations — too slow
        ↓
Realize: only 3 meaningful strategies exist —
front-only, back-only, or split (front covers the earlier target, back covers the later one)
        ↓
Just compute all 3 directly using left/right index math
        ↓
O(n) solution (dominated by the single pass to find min/max)
```

---

## ⭐ Key Insight

### Before the insight
It might feel like there are many ways to mix front and back deletions, and we'd need to search through combinations to find the cheapest.

### The problem
Searching combinations directly would be slow, and it's not obvious at first that the search space is actually tiny.

### The insight
**Only the *positions* (indices) of the minimum and maximum matter — not their values — and any valid removal strategy must take one of exactly 3 shapes:** clear everything up to and including the later-positioned target from the front, clear everything from and including the earlier-positioned target from the back, or split the work — clear the front up through the earlier target, and clear the back up through the later target. Because clearing an \"earlier\" target automatically clears anything before it too (front deletions happen in order), you never need to consider more complicated mixed strategies.

### After the insight
The whole problem becomes: find two indices, sort them into `left` and `right`, and plug them into 3 simple formulas. No simulation, no combination-searching — just direct arithmetic.

---

## 13. Dry Run the Optimized Solution

Let's dry run **Example 2**.

```text
nums = [0, -4, 19, 1, 8, -2, -3, 5]
```

| Index | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|---|
| Value | 0 | -4 | 19 | 1 | 8 | -2 | -3 | 5 |

**Step 1: Scan to find min and max positions.**

| i | nums[i] | New min? (minIndex) | New max? (maxIndex) |
|---|---|---|---|
| 0 (start) | 0 | minIndex=0 | maxIndex=0 |
| 1 | -4 | -4 < 0 → minIndex=1 | -4 not > 0 → maxIndex=0 |
| 2 | 19 | 19 not < -4 → minIndex=1 | 19 > 0 → maxIndex=2 |
| 3 | 1 | 1 not < -4 → minIndex=1 | 1 not > 19 → maxIndex=2 |
| 4 | 8 | 8 not < -4 → minIndex=1 | 8 not > 19 → maxIndex=2 |
| 5 | -2 | -2 not < -4 → minIndex=1 | -2 not > 19 → maxIndex=2 |
| 6 | -3 | -3 not < -4 → minIndex=1 | -3 not > 19 → maxIndex=2 |
| 7 | 5 | 5 not < -4 → minIndex=1 | 5 not > 19 → maxIndex=2 |

Final: `minIndex = 1` (value `-4`), `maxIndex = 2` (value `19`).

**Step 2: Compute left/right.**

`left = min(1, 2) = 1`, `right = max(1, 2) = 2`.

**Step 3: Compute all three strategies.** `n = 8`.

| Strategy | Formula | Calculation | Result |
|---|---|---|---|
| Front only | `right + 1` | `2 + 1` | `3` |
| Back only | `n - left` | `8 - 1` | `7` |
| Mixed | `(left+1) + (n-right)` | `(1+1) + (8-2)` | `2 + 6 = 8` |

**Step 4: Take the minimum.**

`min(3, 7, 8) = 3` ✔️ matches the expected output!

Notice here that \"front only\" wins, because both the min and max are conveniently located very close together near the front (indices 1 and 2).

---

## 14. Optimized Code

```java
class Solution {
    public int minimumDeletions(int[] nums) {
        int n = nums.length;

        int minIndex = 0;
        int maxIndex = 0;

        for (int i = 1; i < n; i++) {
            if (nums[i] < nums[minIndex]) {
                minIndex = i;
            }
            if (nums[i] > nums[maxIndex]) {
                maxIndex = i;
            }
        }

        int left = Math.min(minIndex, maxIndex);
        int right = Math.max(minIndex, maxIndex);

        int removeFromFrontOnly = right + 1;
        int removeFromBackOnly = n - left;
        int removeFromBothEnds = (left + 1) + (n - right);

        return Math.min(removeFromFrontOnly, Math.min(removeFromBackOnly, removeFromBothEnds));
    }
}
```

```javascript
class Solution {
    minimumDeletions(nums) {
        const n = nums.length;
        if (n === 1) return 1;

        let minIndex = 0;
        let maxIndex = 0;

        for (let i = 1; i < n; i++) {
            if (nums[i] < nums[minIndex]) {
                minIndex = i;
            }
            if (nums[i] > nums[maxIndex]) {
                maxIndex = i;
            }
        }

        const left = Math.min(minIndex, maxIndex);
        const right = Math.max(minIndex, maxIndex);

        const removeFromFrontOnly = right + 1;
        const removeFromBackOnly = n - left;
        const removeFromBothEnds = (left + 1) + (n - right);

        return Math.min(removeFromFrontOnly, removeFromBackOnly, removeFromBothEnds);
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `int n = nums.length;` — get the total count of elements; we need this for the formulas involving \"distance from the end.\"
* `int minIndex = 0; int maxIndex = 0;` — start our search assuming index 0 holds both records, since it's the only data point we have before scanning.
* The `for` loop — visits each remaining index once, updating our best-so-far records whenever we find something more extreme.
* `left` / `right` — normalize our two found positions into \"whichever comes first\" and \"whichever comes second,\" since the formulas only care about relative order, not which one was technically the min vs the max.
* The three formula lines — directly compute the cost of each of the 3 valid strategies, using simple index arithmetic (explained in detail in Section 9).
* The final `return Math.min(...)` — picks the cheapest of the three.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`nums = [2,10,7,5,4,1,8,6]` → dry-ran manually in Section 6 → Output: `5` ✔️

### Example 2 — Different Case
`nums = [0,-4,19,1,8,-2,-3,5]` → dry-ran in Section 13 → Output: `3` ✔️

### Example 3 — Edge Case (single element)
`nums = [101]`. Here `n = 1`. Scanning: `minIndex = 0`, `maxIndex = 0` (the loop from `i=1` to `i<1` never runs, since there's nothing to compare). `left = 0`, `right = 0`.
* Front only: `right + 1 = 1`
* Back only: `n - left = 1 - 0 = 1`
* Mixed: `(left+1) + (n-right) = (0+1) + (1-0) = 1 + 1 = 2`

`min(1, 1, 2) = 1` ✔️ — makes perfect sense: the single element is both the min and the max, and removing it (either \"from the front\" or \"from the back,\" they're the same action here) takes exactly 1 deletion.

---

## 17. Edge Cases

* **Array has exactly one element** → that element is simultaneously the min and max; answer is always `1` (see Example 3 above).
* **Minimum and maximum are right next to each other** (adjacent indices) → the \"front only\" or \"back only\" strategy is often (but not always) very cheap, since both targets get cleared together quickly from whichever side is closer.
* **Minimum is at index 0, maximum is at index `n-1` (or vice versa)** → removing from both ends will each need to clear the *entire* array in the worst arrangement, but the \"front only\" or \"back only\" strategy will cost exactly `n` in that case, and the mixed strategy will cost just `1 + 1 = 2` (best case!) — showing why checking all 3 strategies matters, since which one wins really depends on the arrangement.
* **Negative numbers involved** → doesn't change anything about the logic, since we're comparing values only to find *positions* of min/max — Java's `<` and `>` work correctly on negative numbers just like positive ones.
* **Minimum and maximum happen to be the very same position** — impossible here, since the problem guarantees all values are **distinct**, so the smallest and largest values are always two genuinely different elements (unless the array has only 1 element, where trivially min=max=that one element).

---

## 18. Time Complexity

**What is time complexity?** A way to describe how the amount of work grows as the input size grows, focusing on the general trend rather than exact timing — like noting that \"checking twice as many mailboxes takes roughly twice as long,\" regardless of how fast you personally check each one.

```text
Finding min/max positions: O(n)   — one single pass through the array
Computing the 3 formulas:  O(1)   — just a few arithmetic operations, doesn't grow with n

Overall: O(n)
```

**Why:** We only ever look at each element once, to compare it against our current best-known min and max positions. After that single pass, everything else is just plain arithmetic on two numbers (`left` and `right`) — no further looping needed at all. This is about as fast as any algorithm could possibly be for this problem, since you can't even know where the min/max are without looking at every element at least once.

---

## 19. Space Complexity

* We only ever store a small, fixed number of extra variables: `n`, `minIndex`, `maxIndex`, `left`, `right`, and the three strategy costs.
* None of these grow as the array grows — we never create any new arrays, lists, or other structures that scale with `n`.

So the extra space used is `O(1)` — constant, regardless of how large the input array is.

---

## 20. Common Mistakes Beginners Make

❌ \"I should look at the *values* of the min and max (like comparing `1` and `10`) to figure out the cost.\"
✅ Only the **indices** (positions) of the min and max matter for counting deletions — the actual values themselves are irrelevant once we've located them.

❌ \"I only need to consider removing from the front, or removing from the back — not both together.\"
✅ There's a third essential strategy: removing some elements from the front AND some from the back, which is often the cheapest option (as seen in Example 1). Missing this case gives wrong answers.

❌ \"I need to figure out *which* one (min or max) is more to the left, and treat them differently based on that.\"
✅ It doesn't matter which one is the min and which is the max — only their relative positions matter. That's exactly why we compute `left = Math.min(minIndex, maxIndex)` and `right = Math.max(minIndex, maxIndex)`: this normalizes away the \"which one is which\" question entirely.

❌ \"The mixed strategy cost should be `left + right` or some other combination without the `+1` and using `n -`.\"
✅ Be careful with off-by-one counting: removing \"through index `left`, inclusive,\" from the front costs `left + 1` (not just `left`), because index `left` is the `(left+1)`-th element when counting from 1. Similarly, removing from index `right` to the end costs `n - right` elements (not `n - right - 1`), since there are exactly `n - right` elements from index `right` to index `n-1` inclusive.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Remove from the front or back only"
"Minimum number of deletions/operations from either end"
"Positions" or "indices" mattering more than values
"There are only a few possible final configurations"
```

Whenever a problem restricts you to only touching the two *ends* of a sequence, think: **the number of fundamentally different strategies is often small and fixed (not exponential) — try to enumerate them directly instead of simulating.**

---

## 22. Interview Thinking

```text
1. Understand the input    → array of distinct integers
2. Understand the output   → minimum front/back deletions to remove both min and max
3. Try brute force         → realize the "brute force" here is actually just checking 3 fixed strategies
4. Find what makes it slow → nothing is really slow here once you spot the 3-strategy structure;
                              the risk is over-complicating it into an O(n²) combination search
5. Identify repeated work  → none needed; this is a "find 2 positions, do fixed math" problem
6. What can be stored?     → just the two positions (min's index and max's index)
7. Optimize                → normalize into left/right, apply 3 formulas, take the minimum
8. Check edge cases        → single-element array, min/max adjacent, min/max at opposite ends
9. Analyze complexity      → O(n) time, O(1) space
```

Applied here: this is a great example of a problem where recognizing \"there are only 3 possible shapes\" immediately gives you the optimal solution — no fancy data structure needed.

---

## 23. Mini Challenge

Try these before checking the answers:

1. If the minimum is at index 3 and the maximum is at index 3 as well... wait, could that ever actually happen in this problem? Why or why not?
2. If `minIndex = 6` and `maxIndex = 2`, what are `left` and `right`?
3. For an array of length `n = 10`, if `left = 4` and `right = 4` (same position — hypothetically), what would each of the 3 strategy costs be? (This helps sanity-check the formulas even though `left == right` can't truly happen here, since min ≠ max means they're always different indices — think about *why* the formulas still \"make sense\" mathematically.)

<br>

## Answer to Mini Challenge

1. No — since all values in `nums` are guaranteed distinct, the minimum and maximum are always two different values, so they must live at two different indices. They can never be the exact same position.
2. `left = Math.min(6, 2) = 2`, `right = Math.max(6, 2) = 6`.
3. Front only: `right + 1 = 5`. Back only: `n - left = 10 - 4 = 6`. Mixed: `(left+1) + (n-right) = (4+1) + (10-4) = 5 + 6 = 11`. (This hypothetical case shows the mixed formula \"double counts\" the shared position if `left` equalled `right`, which is exactly why the problem's guarantee of distinct values — and therefore genuinely different indices — matters for the formula to make sense without extra adjustment.)

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Find the fewest front/back deletions needed to remove both the array's minimum and maximum values.

## 🔑 Main Idea
Only the positions of the min and max matter; sort those two positions into `left` and `right`, then the answer is the minimum of exactly 3 possible strategies: front-only, back-only, or split between both ends.

## ⚙️ Algorithm
1. Scan the array once to find the index of the minimum value and the index of the maximum value.
2. Set `left` = the smaller of these two indices, `right` = the larger.
3. Compute: front-only cost = `right + 1`, back-only cost = `n - left`, mixed cost = `(left + 1) + (n - right)`.
4. Return the smallest of these three values.

## ⏱️ Complexity
Time: `O(n)`
Space: `O(1)`

## 🎯 Pattern to Remember
\"Only touch the two ends\" problems often reduce to a small, fixed number of enumerable strategies based purely on key positions/indices — no need to simulate deletions one by one.

---

## 25. Beginner Quiz

1. **(Understanding)** Why does it not matter whether the minimum comes before the maximum in the array, or the other way around?
2. **(Basic concept)** What is the difference between an element's *value* and its *index*, and which one actually matters for this problem's cost calculation?
3. **(Logic)** Why are there only 3 possible strategies for removing both the min and max, instead of many more?
4. **(Dry run)** For `nums = [3, 1, 2, 5, 4]`, find the min and max positions, compute `left` and `right`, and calculate all 3 strategy costs. What's the final answer?
5. **(Complexity/pattern)** Why is this solution `O(n)` and not, say, `O(n log n)` or `O(1)`, and what key restriction in the problem statement (about *how* you're allowed to remove elements) is the clue that tells you to think about \"positions from the ends\" rather than searching all subsets?
