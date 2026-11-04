---
title: "3876. Construct Uniform Parity Array II"
slug: 'construct-uniform-parity-array-ii'
date: '2026-09-04'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(1)'
tags: ['Math', 'Array', 'Greedy', 'Parity']
excerpt: "Determine if an array can be transformed into a uniform parity array when you can only subtract strictly smaller elements. Explains the forced minimum logic and parity rules."
---

# 3876. Construct Uniform Parity Array II

This is Part II of the problem you just solved — same setup, but with **one extra rule bolted onto the subtract option**, and that one rule completely changes the answer from "always true" to something you actually have to check. Let's build it up.

---

## 1. Problem in Very Simple Language

Same setup as Part I: you have `nums1`, all distinct integers, and you want to build `nums2` (same length) where **every element is odd, or every element is even** — no mixing.

For each position `i`, you choose one of:

* `nums2[i] = nums1[i]` (copy), or
* `nums2[i] = nums1[i] - nums1[j]` for some *other* index `j`, **but only if `nums1[i] - nums1[j] >= 1`**.

That last condition is brand new compared to Part I, and it's the whole story here: since every value is a positive integer, `nums1[i] - nums1[j] >= 1` simply means **`nums1[j]` must be strictly smaller than `nums1[i]`**. In Part I, you could subtract *any* other element, even a bigger one (giving a negative result, which was fine). Now, **you can only subtract a smaller number from a bigger one.**

* **What's given:** `nums1`.
* **What to find:** is there a way to fill `nums2`, respecting this new "can only subtract something smaller" rule, so everything ends up the same parity?
* **What to return:** `true` or `false`.

---

## 2. Real-Life Analogy

Back to our lockers: each locker can either keep its own tag, or swap it for "my number minus a *smaller* number from some other locker." You're no longer allowed to subtract a bigger locker's number from yours (that trick, which let you sometimes go negative in Part I, is now off the table). This sounds like a small change, but it has a big consequence: **the locker holding the smallest number in the entire row has nobody smaller to borrow from — it is physically forced to just keep its own tag.**

---

## 3. Important Programming Concepts I Need First

Everything from Part I still applies (parity, the "subtracting odd flips parity, subtracting even doesn't" rule) — quick recap:

### Parity-flip rule (from Part I, still true here)
`even − even = even`, `odd − odd = even`, `even − odd = odd`, `odd − even = odd`. In short: **subtracting an odd number always flips parity; subtracting an even number never does**, regardless of which number is bigger.

### New concept: "Forced move"
* **Concept:** Sometimes a rule leaves you with *zero* legal choices except one — that one choice is "forced." Recognizing forced moves early often unlocks the whole problem, because they pin down facts you can build the rest of your reasoning on.
* **Why we need it:** The new `>= 1` restriction means the *smallest* element in `nums1` has no valid `j` to subtract at all (there's nothing smaller than the minimum!) — so it's forced to just copy itself. That one forced move turns out to decide almost everything.

### Minimum of an array
* **Concept:** The single smallest value among all elements.
* **Example:** `min([2, 3]) = 2`.
* **Why we need it:** As just discussed, the minimum element is the one with no subtraction option available — it's the anchor of our whole argument.

### Sorted order (as a thinking tool, not necessarily code we write)
* **Concept:** Imagining the array's values lined up from smallest to largest helps reason about "does a smaller helper number exist?" questions.
* **Why we need it:** We'll repeatedly ask "is there a smaller *odd* number available?" — thinking in sorted order makes this easy to reason about, even though our final code won't need to actually sort anything.

---

## 4. Understand the Input

Take Example 2 (the interesting one — it's `false` this time!):
```text
nums1 = [2, 3]
```

* `2` is even, `3` is odd.
* The minimum value in the array is `2`.
* Since `2` is the minimum, there's no index `j` with `nums1[j] < 2` — so index 0 (value `2`) has **no valid subtraction option at all**. It's forced to copy: `nums2[0] = 2`.
* This immediately locks in the target parity: since `nums2[0]` must be `2` (even), the *entire* `nums2` array must be even.
* Now can `3` (at index 1) become even? It would need `nums2[1] = 3 - nums1[j]` for some `j` with `nums1[j] < 3` — the only candidate is `j = 0`, value `2`. Is `3 - 2 = 1` even? No, it's odd! Subtracting `2` (even) from `3` (odd) gives odd (per our parity rule: subtracting an even number never flips parity) — so this doesn't help.
* There's no other smaller number to try. `3` is stuck at odd, but the target is forced to be even. **Impossible.**

---

## 5. Understand the Output

Output: `false`

* As shown above: the minimum element (`2`) is forced to stay even (no subtraction possible), which locks the whole array's target to "all even." But `3` can never be turned into an even number using only smaller numbers to subtract (its only smaller option, `2`, is even, and subtracting an even number can't flip `3`'s parity). So no valid `nums2` exists.

Compare this to Example 1: `nums1 = [1, 4, 7]`. Minimum is `1` (odd) — this forces target = odd. Then `4` (even) needs to flip to odd using a smaller number; `1` is available and it's odd, so `4 - 1 = 3` works. `7` is already odd, just copy. Everything works out → `true`.

---

## 6. Solve the Example Manually

Let's manually work through a slightly bigger example to really nail the pattern: `nums1 = [4, 3, 9]`.

**Step 1: Find the minimum.** `min(4, 3, 9) = 3`.

**Step 2: Since 3 is the minimum, it has no valid `j` to subtract from — it's forced to copy itself.** `nums2` for that position = `3`, which is **odd**. This locks the target: **the whole array must end up odd.**

**Step 3: Check every other element against target = odd.**

| Value | Already odd? | If not, need to flip using SOME smaller ODD number | Available smaller odd number? | Result |
|---|---|---|---|---|
| 3 (the min) | Yes (odd) | — (forced copy anyway) | — | OK (copy) |
| 4 | No (even) | Need smaller odd number `< 4` | Yes! `3` is odd and `3 < 4` | `4 - 3 = 1` (odd) ✔️ |
| 9 | Yes (odd) | — | — | OK (copy, or could subtract too) |

Every element works out → answer is `true`.

**Now let's contrast with `nums1 = [4, 2, 9]`:**

**Step 1: Minimum is `2`.** It's even → forced target = **even**.

**Step 2: Check every other element against target = even.**

| Value | Already even? | If not, need smaller ODD number to flip | Smaller odd number available? | Result |
|---|---|---|---|---|
| 2 (min) | Yes | — | — | OK (forced copy) |
| 4 | Yes | — | — | OK (copy) |
| 9 | No (odd) | Need smaller ODD number `< 9` | Candidates smaller than 9: `4` (even), `2` (even) — **no odd ones available!** | ❌ Stuck |

`9` can never become even here, because every number smaller than it in this array happens to be even. Answer: `false`.

This reveals the real danger zone: **when the minimum is even, the *smallest odd number* in the whole array (if one exists) can never find a smaller odd helper — because by definition, nothing smaller than it is odd.**

---

## 7. Think Like a Programmer

* **What do I know?** The minimum element is always forced to "copy," which locks in the target parity as `parity(minimum)`.
* **What do I need to find?** Whether every other element can actually reach that forced target.
* **What can I try?** Split into two cases based on whether the minimum is odd or even, and figure out exactly when each case can (or can't) succeed.
* **Case: minimum is odd.** The target is odd. Any element that's already odd just copies. Any element that's even needs to flip — and it needs *some* smaller odd number to subtract. Here's the beautiful part: **the minimum itself is odd, and by definition it's smaller than every other element in the array!** So *every* even element can always use the minimum as its "flip helper." This case can never fail.
* **Case: minimum is even.** The target is even. Any already-even element copies fine. Any odd element needs to flip using a smaller *odd* number. But now the minimum (even) can't help with that — we need some *other*, odd, smaller number. The most fragile case is: **the smallest odd number in the whole array.** By definition, nothing smaller than it is odd (if something smaller and odd existed, it would BE the smallest odd number instead). So if any odd number exists at all, the smallest one among them is permanently stuck. This case only succeeds if there are **zero** odd numbers in the entire array.
* **What information should I remember?** Just two things, found in a single pass: the array's minimum value (specifically, its parity), and whether any odd number exists at all.
* **What pattern do I notice?** This collapses to a two-line check — no need to actually simulate constructing `nums2`.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** For each of the 2 possible targets (all-even, all-odd), check every element: if it matches, fine. If not, search through *all other elements smaller than it* to see if any has the opposite (odd) parity needed to flip it.

**Why it works:** Directly checks feasibility for both targets, respecting the "must subtract something smaller" rule.

**Time complexity:** For each of 2 targets, and for each element needing a flip, scanning all smaller elements could take O(n) — giving O(n²) overall in the worst case. With `n` up to `10^5`, that's up to `10^10` operations — way too slow.

```java
// Illustrative brute force (too slow for n up to 1e5) — for understanding only
class Solution {
    public boolean uniformArray(int[] nums1) {
        return canReach(nums1, 0) || canReach(nums1, 1); // 0 = even target, 1 = odd target
    }

    private boolean canReach(int[] nums1, int targetParity) {
        int n = nums1.length;
        for (int i = 0; i < n; i++) {
            if (nums1[i] % 2 == targetParity) continue; // already matches, copy is fine
            boolean canFlip = false;
            for (int j = 0; j < n; j++) {
                if (j != i && nums1[j] < nums1[i] && nums1[j] % 2 == 1) {
                    // subtracting an odd smaller number flips parity
                    canFlip = true;
                    break;
                }
            }
            if (!canFlip) return false;
        }
        return true;
    }
}
```

---

## 9. Explain the Brute Force Code Line by Line

* `canReach(nums1, 0) || canReach(nums1, 1)` — try both possible targets (even=0, odd=1); if either is achievable, return true.
* Inside `canReach`: for each element, `if (nums1[i] % 2 == targetParity) continue;` — if it already matches the target, no work needed, "copy" handles it.
* Otherwise, we need to flip it. We scan every other index `j`, looking for one that is (a) smaller in value (`nums1[j] < nums1[i]`, satisfying the new `>= 1` rule) and (b) odd (since only subtracting odd numbers flips parity).
* If we find such a `j`, this element can be fixed; if we scan everything and find nothing, this target is impossible, so we return `false` immediately.

---

## 10. Why Is the Brute Force Solution Not Ideal?

With `n` up to `100,000`, checking "does a smaller odd number exist" by re-scanning the whole array for every single element that needs a flip could mean up to `100,000 × 100,000 = 10` billion comparisons in the worst case. That's far too slow to run in time. We need to answer "is there a smaller odd number available?" *instantly*, not by rescanning.

---

## 11. Find the Better Approach

```text
Brute Force:
For each target, for each element needing a flip, rescan for a smaller odd helper
        ↓
O(n²) — too slow
        ↓
Realize: the MINIMUM element is always forced to copy → target = parity(minimum)
        ↓
If minimum is odd: it's automatically the smallest AND odd, so it helps
                    EVERY other element flip if needed → always succeeds
        ↓
If minimum is even: the smallest ODD element (if any) can never find a
                     smaller odd helper → succeeds ONLY if there are zero odd numbers at all
        ↓
Answer computable with a single O(n) pass: track min's parity + whether any odd exists
```

---

## ⭐ Key Insight

### Before the insight
It looks like we need to check every element against every possible smaller helper, for both possible targets — an expensive search.

### The problem
That's way too much repeated work, and it obscures a much simpler truth hiding in the problem's structure.

### The insight
**The new `>= 1` restriction removes all freedom from exactly one element: the minimum.** It can never subtract anything (nothing is smaller), so it must copy itself — which single-handedly *decides* the target parity for the entire array; there's no longer a choice between "try both targets," there's only ever one target to check: `parity(minimum)`.

Once the target is pinned down, everything else follows from one more fact: **the minimum element, if odd, is a universal helper** (it's smaller than everything else, so every even element can always borrow it to flip to odd). But **if the minimum is even, it can't help anyone flip** — and the *next* smallest odd number (if one exists) has the exact same problem the minimum had: nothing smaller than *it* is odd, so it's permanently stuck if the target is even.

### After the insight
The whole problem reduces to two quick checks computed in a single pass: what's the parity of the minimum, and does any odd number exist in the array at all?

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 2**: `nums1 = [2, 3]`.

**Step 1: Scan once, tracking minimum value and whether any odd number exists.**

| Index | Value | Running min | Is this value odd? | hasOdd so far |
|---|---|---|---|---|
| 0 | 2 | 2 | No | false |
| 1 | 3 | 2 (unchanged, 3 > 2) | Yes | true |

Final: `minVal = 2`, `hasOdd = true`.

**Step 2: Check `minVal`'s parity.** `2 % 2 == 0` → minimum is **even**.

**Step 3: Since minimum is even, the answer is `!hasOdd`.** `hasOdd = true`, so `!hasOdd = false`.

**Final answer: `false`** ✔️ matches!

---

## 14. Optimized Code

```java
class Solution {
    public boolean uniformArray(int[] nums1) {
        int minVal = Integer.MAX_VALUE;
        boolean hasOdd = false;

        for (int num : nums1) {
            if (num < minVal) {
                minVal = num;
            }
            if (num % 2 != 0) {
                hasOdd = true;
            }
        }

        if (minVal % 2 != 0) {
            // Minimum is odd: it is smaller than everything else AND odd,
            // so it can always flip any even element to odd. Always succeeds.
            return true;
        } else {
            // Minimum is even: target is forced to even. This only works if
            // there are NO odd numbers at all (otherwise the smallest odd
            // number has no smaller odd helper and gets stuck).
            return !hasOdd;
        }
    }
}
```

```javascript
class Solution {
    uniformArray(nums1) {
        let minVal = Infinity;
        let hasOdd = false;

        for (const num of nums1) {
            if (num < minVal) {
                minVal = num;
            }
            if (num % 2 !== 0) {
                hasOdd = true;
            }
        }

        if (minVal % 2 !== 0) {
            return true;
        } else {
            return !hasOdd;
        }
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `int minVal = Integer.MAX_VALUE;` — start with an impossibly large placeholder, so the very first real value we see will correctly become the new minimum.
* `boolean hasOdd = false;` — tracks whether we've seen *any* odd number anywhere in the array.
* The `for (int num : nums1)` loop — a single pass through the array.
  * `if (num < minVal) minVal = num;` — standard running-minimum tracking.
  * `if (num % 2 != 0) hasOdd = true;` — flags that at least one odd number exists, the moment we see one.
* `if (minVal % 2 != 0)` — checks whether the minimum element is odd.
  * If yes: this case *always* succeeds, because the minimum is both the smallest value in the array and odd, making it a universal "flip helper" for every even element. We `return true` immediately.
* `else { return !hasOdd; }` — if the minimum is even, the target is forced to even, and this only works if there's no odd number anywhere. So we return `true` only when `hasOdd` is `false`.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`nums1 = [1,4,7]` → min = 1 (odd) → Output: `true` ✔️

### Example 2 — Different Case
`nums1 = [2,3]` → min = 2 (even), hasOdd = true → Output: `false` ✔️

### Example 3 — Edge Case
`nums1 = [4,6]` → min = 4 (even), hasOdd = false (both even) → Output: `!false = true` ✔️

---

## 17. Edge Cases

* **Single-element array (`n = 1`)** → the lone element is forced to copy itself (no `j` exists at all), which trivially matches its own parity → `minVal` = that element; if odd, `true` directly; if even, `hasOdd` will be `false` (since the only number is even) → `true` either way. Always `true` for `n = 1`.
* **All elements even** → `minVal` is even, `hasOdd = false` → `true` (nothing ever needs to flip).
* **All elements odd** → `minVal` is odd → `true` immediately (every element already matches, or can trivially copy).
* **Minimum is odd, but there are many even numbers to flip** → still always `true`, since the minimum alone is sufficient to flip every even number, no matter how many there are.
* **Minimum is even, exactly one odd number exists** → `hasOdd = true` → `false` (that lone odd number, being both the only and therefore the smallest odd number, can never find a smaller odd helper).
* **Large arrays (`n` up to `10^5`) with mixed parities** → handled efficiently in one O(n) pass, no risk of timeout.

---

## 18. Time Complexity

```text
Brute Force:
O(n²) — for each element needing a flip, rescan the whole array

Optimized:
O(n) — one single pass, tracking two running values
```

**Why:** We only need to look at each element exactly once to know both its value (for tracking the minimum) and its parity (for tracking `hasOdd`). No nested loops, no rescanning — everything the final answer depends on can be computed while walking through the array a single time.

---

## 19. Space Complexity

We only use a couple of simple variables (`minVal`, `hasOdd`) — no arrays, lists, or structures that grow with input size.

Extra space: `O(1)` — constant.

---

## 20. Common Mistakes Beginners Make

❌ "This is just like Part I, so the answer should always be `true`."
✅ Part I allowed subtracting *any* other element (even a bigger one, going negative). Part II's `>= 1` restriction removes that freedom specifically from the minimum element, which breaks the "always true" guarantee from Part I entirely.

❌ "I should check both possible targets (all-even, all-odd), like in Part I."
✅ There's no longer a free choice of target — the minimum element is *forced* to copy itself (no valid `j` exists for it), which locks the target to `parity(minimum)` automatically. Only one target is ever worth checking.

❌ "If the minimum is even, I just need to check if there's a smaller odd number for each odd element individually."
✅ You don't need to check element-by-element — the key realization is that it's *specifically the smallest odd number* (if any exists) that's the bottleneck; if it fails, nothing built around checking "is target even achievable" needs anything more granular than "does any odd number exist at all?"

❌ "Subtracting works the same regardless of which number is bigger."
✅ In this version, `nums1[i] - nums1[j] >= 1` **requires `nums1[j] < nums1[i]`** — you can only subtract something *smaller*. This one-directional restriction is the entire crux of the problem.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"You may subtract/combine with another element, but only if [some inequality] holds"
"For an index j != i such that [expression] >= some bound" → look for what element(s)
  this makes IMPOSSIBLE to use certain operations on (often the min or max)
"Distinct integers" + simple parity/arithmetic conditions
A sequel/variant problem ("Part II") that adds ONE new restriction → ask specifically
  "which element(s) does this restriction remove all freedom from?"
```

---

## 22. Interview Thinking

```text
1. Understand the input    → array of distinct integers, same as Part I
2. Understand the output   → true/false, but now with a "must subtract something smaller" rule
3. Try brute force         → check both targets, rescanning for a valid smaller-odd helper
4. Find what makes it slow → O(n²) rescanning for every element needing a flip
5. Identify repeated work  → repeatedly asking "does a smaller odd number exist?" per element
6. What can be stored?     → the minimum's parity, and whether ANY odd number exists at all
7. Optimize                → realize the minimum is FORCED to copy, locking the target;
                              then reason about when that forced target is achievable
8. Check edge cases        → n=1, all-even, all-odd, minimum even with exactly one odd number
9. Analyze complexity      → O(n) time, O(1) space
```

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why is the minimum element in `nums1` the *only* one guaranteed to have zero valid subtraction options?
2. If the minimum element is odd, why can it always help *every* even element flip to odd, no matter how large the array is?
3. If the minimum is even and there are 3 odd numbers in the array — say `5, 11, 3` — which one specifically causes the problem, and why don't the other two matter?

<br>

## Answer to Mini Challenge

1. The rule requires `nums1[j] < nums1[i]` for a valid subtraction at index `i`. The minimum element, by definition, has no other element smaller than it anywhere in the array — so no valid `j` can ever exist for it, forcing it to copy itself.
2. Because the minimum is, by definition, smaller than every other element in the array — so for any even element `v`, `v - minimum` is always a legal move (satisfies the `>= 1` rule since `v > minimum`), and since the minimum is odd, subtracting it always flips `v`'s parity to odd.
3. The smallest of the three, `3`, is the one that causes the problem — it has no smaller odd number to use as its own flip-helper (since it's the smallest odd number overall), so it can never become even. `5` and `11` are both larger and could technically use `3` as their odd helper if needed, so they're not the bottleneck — but since `3` itself already fails, the whole target is impossible regardless.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Determine whether `nums1` can be made uniformly odd or even, where the "subtract" option now only allows subtracting a *smaller* element.

## 🔑 Main Idea
The minimum element can never subtract anything (nothing is smaller), forcing it to copy itself and locking the target parity to `parity(minimum)`. If the minimum is odd, it can always flip every other element (always succeeds). If the minimum is even, it only works when there are zero odd numbers anywhere (otherwise the smallest odd number gets permanently stuck).

## ⚙️ Algorithm
1. Scan the array once, tracking the minimum value and whether any odd number exists.
2. If the minimum is odd, return `true`.
3. Otherwise, return `true` only if no odd numbers exist at all; otherwise `false`.

## ⏱️ Complexity
Time: `O(n)`
Space: `O(1)`

## 🎯 Pattern to Remember
A restriction like "can only combine with something smaller/bigger" often locks a specific extreme element (min or max) into a forced move — chase that forced move to see if it determines the whole answer.

---

## 25. Beginner Quiz

1. **(Understanding)** Why does adding the `>= 1` restriction change the answer from "always true" (Part I) to "sometimes false" (Part II)?
2. **(Basic concept)** For `nums1 = [6, 10, 2]`, what is the forced target parity, and why?
3. **(Logic)** Why does it matter *specifically* whether the smallest odd number (not just any odd number) has a smaller odd helper available?
4. **(Dry run)** For `nums1 = [8, 3, 6, 15]`, find the minimum, determine the forced target, and decide whether the answer is `true` or `false`.
5. **(Complexity/pattern)** Why does the brute-force approach risk `O(n²)` here, and what specific single fact (about the minimum element) collapses the whole problem down to an `O(n)` check?
