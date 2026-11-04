---
title: "3875. Construct Uniform Parity Array I"
slug: 'construct-uniform-parity-array-i'
date: '2026-09-03'
difficulty: 'Easy'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(1)'
tags: ['Math', 'Array', 'Bit Manipulation', 'Parity']
excerpt: "Determine if an array can be transformed into a uniform parity array by keeping or subtracting other elements. Explains the mathematical proof showing why the answer is always true."
---

# 3875. Construct Uniform Parity Array I

This one is a nice change of pace — it's "Easy," and the real challenge isn't writing complicated code, it's spotting a clean **mathematical proof** hiding inside the problem. Let's build it up from zero.

---

## 1. Problem in Very Simple Language

You have an array `nums1` of numbers, all different from each other.

You must build a second array `nums2`, same length, where **every single element of `nums2` is even, OR every single element is odd** — you pick which one, but you can't mix.

For each position `i` in `nums2`, you're allowed to fill it in with **one of two choices**:

* Just copy the number straight over: `nums2[i] = nums1[i]`, or
* Subtract some *other* number in the array from it: `nums2[i] = nums1[i] - nums1[j]` (where `j` is any other valid position, not `i` itself).

You get to make this choice independently for every position — some positions can use the "copy" option while others use the "subtract" option, however you like.

* **What's given:** the array `nums1`.
* **What to find:** is there *some* way to fill in `nums2` (mixing copy/subtract choices freely) so that everything ends up the same parity (all even or all odd)?
* **What to return:** `true` if possible, `false` if not.

---

## 2. Real-Life Analogy

Imagine a row of lockers, each with a number tag on it. For each locker, you're allowed to either keep its tag exactly as-is, OR swap it for "this locker's number minus some other locker's number." Your goal: end up with every single locker showing either an odd tag or an even tag — no mixing allowed. You get to decide, locker by locker, which trick to use.

---

## 3. Important Programming Concepts I Need First

### Array
* **Concept:** A numbered list of values.
* **Example:** `nums1 = [2, 3]` — position 0 holds `2`, position 1 holds `3`.
* **Why we need it:** Our whole input and output are arrays.

### Even and Odd numbers, and "Parity"
* **Concept:** A number is **even** if it divides evenly by 2 (no remainder), and **odd** if it doesn't. "Parity" is just the general word for "is it even or odd?" — two numbers "have the same parity" if they're both even or both odd.
* **Example:** `4` and `10` have the same parity (both even). `4` and `7` have different parity.
* **Why we need it:** The entire goal of this problem — "all odd or all even" — is a statement purely about parity.

### Subtraction and Parity (a key mathematical fact)
* **Concept:** When you subtract one whole number from another, there's a simple, reliable rule for the *parity* of the result:
  * `even − even = even`
  * `odd − odd = even`
  * `even − odd = odd`
  * `odd − even = odd`

In other words: **subtracting an even number never changes parity. Subtracting an odd number always flips parity** (even ↔ odd).
* **Example:** `10 - 4 = 6` (even − even = even, parity unchanged). `10 - 3 = 7` (even − odd = odd, parity flipped).
* **Why we need it:** This single fact is the entire engine behind solving this problem — figuring out exactly when we *can* and *can't* change a number's parity using the "subtract" option.

### Loop
* **Concept:** Repeats an action for every item in a list.
* **Example:** "Go through every number in `nums1` and count how many are odd."
* **Why we need it:** We need to scan the array once to count odd numbers.

### If/else
* **Concept:** Branching logic based on a condition.
* **Why we need it:** We'll reason through a couple of "what if" scenarios based on how many odd numbers exist.

### Boolean
* **Concept:** A value that's either `true` or `false`.
* **Why we need it:** Our answer is literally a `true`/`false` value.

---

## 4. Understand the Input

Take Example 1:
```text
nums1 = [2, 3]
```

* Position 0 holds `2` (even).
* Position 1 holds `3` (odd).
* We're asked: can we build `nums2`, same length, where we independently choose "copy" or "subtract another element" at each position, such that the result is either fully odd or fully even?
* Why does it matter that `2` is even and `3` is odd? Because whether we can *change* a number's parity (via subtraction) depends entirely on whether there's an *odd* number elsewhere in the array to subtract (as we'll prove in a moment).

---

## 5. Understand the Output

Output: `true`

* The example shows: `nums2[0] = nums1[0] - nums1[1] = 2 - 3 = -1` (odd!), and `nums2[1] = nums1[1] = 3` (already odd).
* Both final values are odd, so the "all odd" target was achieved.
* Notice `nums2[0]` used the "subtract" trick to *flip* `2` (even) into something odd, by subtracting the odd number `3` — exactly matching our parity-flip rule from Section 3.

---

## 6. Solve the Example Manually

Let's manually reason through **Example 1**: `nums1 = [2, 3]`.

### Step 1: Look at each element's own parity

| Index | Value | Parity |
|---|---|---|
| 0 | 2 | even |
| 1 | 3 | odd |

### Step 2: Try target = "all even"

* Index 1 (value `3`, odd) needs to become even. To flip its parity, we must subtract an *odd* number from it (per our rule). Is there an odd number at some *other* index? The only odd number in the whole array is `3` itself, at index 1 — there's no *other* odd number anywhere else to use! So index 1 is stuck — it can't become even.
* **Target "all even" fails.**

### Step 3: Try target = "all odd"

* Index 0 (value `2`, even) needs to become odd. To flip its parity, we subtract an *odd* number from it. Is there an odd number at some other index? Yes — index 1 holds `3`, which is odd! So `nums2[0] = 2 - 3 = -1`, which is odd. ✔️
* Index 1 (value `3`, odd) already matches the target — just copy it directly: `nums2[1] = 3`. ✔️
* **Target "all odd" succeeds!**

Since at least one target (odd) works, the answer is `true`. ✔️ matches!

---

## 7. Think Like a Programmer

* **What do I know?** For any element, I can either leave its parity alone (copy), or flip it (subtract an odd number, per our rule) — but flipping requires an odd number to exist *somewhere else* in the array.
* **What do I need to find?** Whether *either* "make everything even" or "make everything odd" is achievable.
* **What can I try?** Check both possible targets (all-even, all-odd) separately, and see if either one is achievable for every element.
* **What happens if I try every possibility?** There are only 2 targets to check (even or odd) — nowhere near an exponential search. This is naturally small and fast.
* **Can I make it faster?** It's already about as fast as it can be — but let's see if we can find an even deeper shortcut by understanding *when* each target succeeds or fails, using nothing more than counting.
* **What information should I remember?** Just one number: **how many odd numbers are in the whole array** (let's call it `oddCount`).
* **What pattern do I notice?** For target "all even": every *odd* element needs to flip, which requires *another* odd element to subtract (not itself!). This is only impossible when there's **exactly one** odd number total (that lone odd number has no partner). For target "all odd": every *even* element needs to flip, which requires *any* odd element to exist somewhere in the array. This is only impossible when there are **zero** odd numbers total.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** For each of the 2 possible targets (all-even, all-odd), check every element: if it already matches the target, fine; if not, check whether there's *some other* element with odd parity available to subtract (since only subtracting an odd number can flip parity). If every element can be satisfied, that target works — return `true`. If neither target works, return `false`.

**Why it works:** We're directly checking, for both possible goals, whether every element individually has a legal way to reach that goal — which is exactly the definition of "constructible."

**Time complexity:** For each of the 2 targets, we scan all `n` elements, and for the ones that need to flip, we just need to know "does *some* odd number exist elsewhere?" — which we can precompute once (count of odd numbers) rather than re-scanning per element. So this is `O(n)` overall.

**Space complexity:** `O(1)` extra space (just a counter).

```java
class Solution {
    public boolean uniformArray(int[] nums1) {
        int n = nums1.length;

        int oddCount = 0;
        for (int num : nums1) {
            if (num % 2 != 0) {
                oddCount++;
            }
        }
        int evenCount = n - oddCount;

        // Check target "all even":
        // Every ODD element needs to flip, which needs ANOTHER odd element
        // (not itself) to subtract. Fails only if there's exactly 1 odd number.
        boolean allEvenPossible = (oddCount != 1);

        // Check target "all odd":
        // Every EVEN element needs to flip, which needs ANY odd element
        // to exist somewhere. Fails only if there are 0 odd numbers.
        boolean allOddPossible = (oddCount >= 1);

        return allEvenPossible || allOddPossible;
    }
}
```

---

## 9. Explain the Brute Force Code Line by Line

* `int n = nums1.length;` — store the array length (used implicitly through `evenCount`, though we don't strictly need `n` elsewhere).
* The `for (int num : nums1)` loop — walks through every element once, checking `num % 2 != 0` (true if the number is odd), incrementing `oddCount` each time we find one. This is the *only* pass we need over the actual array data.
* `int evenCount = n - oddCount;` — not strictly required for the final answer, but useful to have named for clarity (everything that's not odd is even).
* `boolean allEvenPossible = (oddCount != 1);` — as reasoned in Section 7: target "all even" fails *only* when there's exactly one odd number (it has no other odd partner to flip with); it succeeds whenever there are zero odd numbers (nothing needs to flip at all) or two-or-more odd numbers (each odd element can always find some *other* odd element to pair with).
* `boolean allOddPossible = (oddCount >= 1);` — target "all odd" fails *only* when there are zero odd numbers anywhere (no odd number exists to use for flipping the evens); it succeeds as soon as at least one odd number exists anywhere in the array, since every even element can reuse that same odd number to flip.
* `return allEvenPossible || allOddPossible;` — the overall answer is `true` if *either* target is achievable.

---

## 10. Why Is This Already "Ideal" — Nothing More to Optimize?

Unlike some earlier problems, there's no slow nested loop lurking here to eliminate — a single pass to count odd numbers, followed by two simple boolean checks, is already about as fast as any solution could be (`O(n)`, which is required at minimum just to look at every input element once). So instead of "optimizing," let's dig one level deeper and discover something remarkable about this specific problem.

---

## 11. Find the Deeper Pattern

> "Can we simplify this even further?"

Let's look very closely at our two conditions:

```text
allEvenPossible = (oddCount != 1)
allOddPossible  = (oddCount >= 1)
```

`allEvenPossible` is `false` **only** when `oddCount == 1`.
`allOddPossible` is `false` **only** when `oddCount == 0`.

These are two *completely different, mutually exclusive* numbers (`oddCount` can't simultaneously equal both `1` and `0`)! That means **it is mathematically impossible for both conditions to be false at the same time.** At least one of them is *always* true, no matter what the array looks like.

---

## ⭐ Key Insight

### Before the insight
It feels like we need to carefully check both targets and combine the results with `||`, expecting that sometimes both could fail, giving `false`.

### The problem
It's not obvious at first that `false` might never actually be reachable — the problem *looks* like it should sometimes be impossible, given it's phrased as a `true`/`false` question.

### The insight
**The two failure conditions (`oddCount == 1` for "all even," and `oddCount == 0` for "all odd") can never both be true simultaneously**, since `oddCount` is a single specific number and can't equal two different values at once. Therefore, for *any* valid input array, **at least one of the two targets is always achievable** — meaning the answer to this problem is **always `true`**, for every possible valid input!

### After the insight
The entire problem reduces to a one-line proof rather than a computation: given the constraints (`n ≥ 1`, distinct positive integers), you can *always* construct a valid `nums2`. The "algorithm" becomes trivial — but understanding *why* is the actual point of the problem.

---

## 13. Dry Run — Confirming "Always True" on a Tricky Case

Let's test the trickiest possible scenario: **exactly one odd number**, to make sure the proof holds.

```text
nums1 = [1, 2, 4]
```

* `oddCount = 1` (only the value `1` is odd).
* `allEvenPossible = (oddCount != 1)` → `(1 != 1)` → **false**. (Makes sense: the lone odd number `1` has no other odd partner to flip to even.)
* `allOddPossible = (oddCount >= 1)` → `(1 >= 1)` → **true**.
* Since `allOddPossible` is true, we go with target "all odd": 
  * Index 0 (`1`, odd): already matches, copy directly → `1`.
  * Index 1 (`2`, even): flip using the odd number `1` → `2 - 1 = 1` (odd). ✔️
  * Index 2 (`4`, even): flip using the odd number `1` → `4 - 1 = 3` (odd). ✔️
* Final `nums2 = [1, 1, 3]` — all odd! Construction succeeds, confirming `true`.

Even in this "worst case" for the even-target, the odd-target rescues us — exactly as the proof guarantees.

---

## 14. Optimized Code

```java
class Solution {
    public boolean uniformArray(int[] nums1) {
        int oddCount = 0;
        for (int num : nums1) {
            if (num % 2 != 0) {
                oddCount++;
            }
        }

        boolean allEvenPossible = (oddCount != 1);
        boolean allOddPossible = (oddCount >= 1);

        return allEvenPossible || allOddPossible; // always true, but shown for clarity
    }
}
```

```javascript
class Solution {
    uniformArray(nums1) {
        let oddCount = 0;
        for (const num of nums1) {
            if (num % 2 !== 0) {
                oddCount++;
            }
        }

        const allEvenPossible = (oddCount !== 1);
        const allOddPossible = (oddCount >= 1);

        return allEvenPossible || allOddPossible;
    }
}
```

---

## 15. Explain the Code Line by Line

Already covered in full detail in Section 9 — the logic is identical. The only "new" thing to internalize here is that, given the proof in Section 11, `allEvenPossible || allOddPossible` is a tautology (always true) for this specific problem's constraints — which is why the bare `return true;` version is 100% equivalent and passes every test case.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`nums1 = [2, 3]` → `oddCount = 1` → `allEvenPossible = false`, `allOddPossible = true` → Output: `true` ✔️

### Example 2 — Different Case
`nums1 = [4, 6]` → `oddCount = 0` → `allEvenPossible = true` (nothing needs to flip), `allOddPossible = false` → Output: `true` ✔️ (via the "all even" route, both already even, just copy directly)

### Example 3 — Edge Case (single element)
`nums1 = [7]` → `n = 1`, `oddCount = 1` → `allEvenPossible = false`, `allOddPossible = true` (the single element `7` is already odd, so target "all odd" is trivially satisfied by copying — no flip ever needed since there's nothing to flip) → Output: `true` ✔️

---

## 17. Edge Cases

* **All elements already even** (`oddCount = 0`) → target "all even" is trivially true (just copy everything); no flipping ever attempted.
* **All elements already odd** (`oddCount = n`) → target "all odd" is trivially true (just copy everything).
* **Exactly one odd element** → target "all even" fails for that lone odd element (no partner), but target "all odd" always succeeds (that one odd number can flip every even element).
* **Single-element array (`n = 1`)** → no other index ever exists to subtract from, so the only usable choice is "copy" — but that's always already uniform (trivially, one element is automatically "all the same parity" as itself).
* **Large arrays with many mixed parities** → still always works, since target "all odd" only ever needs *one* existing odd number as a universal helper for every even element.

---

## 18. Time Complexity

**What is time complexity?** A way to describe how much work an algorithm does as its input grows, using a general rule of thumb.

```text
Counting odd numbers: O(n) — one pass through the array
Everything else: O(1) — just comparing a couple of numbers

Overall: O(n)
```

**Why:** We only need to look at each number once, to check whether it's odd. After that, the rest is just simple arithmetic on a single counted value — no nested loops, no repeated scanning. This is the fastest possible complexity for a problem that requires looking at every input element at least once (you can't know anything about numbers you haven't looked at).

---

## 19. Space Complexity

We only ever store a couple of counter variables (`oddCount`, and optionally `evenCount`) — none of which grow with the size of the input array.

So extra space used is `O(1)` — constant.

---

## 20. Common Mistakes Beginners Make

❌ "I need to actually try building `nums2` element by element and check if it works, simulating the whole process."
✅ You never need to *construct* the actual array — you only need to reason about whether a valid construction *exists*, which boils down to counting odd numbers and checking two simple conditions.

❌ "Subtracting any other number flips the parity."
✅ Only subtracting an **odd** number flips parity. Subtracting an **even** number leaves parity unchanged — this distinction is the entire key to the problem.

❌ "If there's exactly one odd number, the answer must be tricky or possibly false."
✅ It initially seems that way (target "all even" indeed fails in that case), but target "all odd" *always* saves the day whenever there's at least one odd number — so this specific case still results in `true`.

❌ "I should check whether `j` can equal `i`."
✅ The problem states `j != i` for the subtraction option — but this restriction almost never actually matters here, since the "helper" element we use (an odd number, when flipping an even element, or vice versa) always has *different parity* from the element being flipped, so it can never be the *same* element anyway (a number can't simultaneously be both the element at index `i` and have different parity from itself).

❌ "This problem needs a complex algorithm since it's asking about constructing an array."
✅ Not every construction problem requires simulating the actual construction — sometimes (as here), a short mathematical argument about *feasibility* is the entire solution, which is exactly why this is rated "Easy" despite sounding constructive.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Choose one of the following options for each element"
"All elements must satisfy some property (parity, sign, etc.)"
"Return true/false" (rather than "return the array") — hints the real question
  is about FEASIBILITY, not actual construction
"Distinct integers" combined with simple arithmetic operations (+, -, parity)
```

Whenever a problem gives you a couple of simple per-element choices and asks "is it possible," try first asking: **"under what condition would this be impossible?"** — sometimes, as here, that condition turns out to be so narrow (or self-contradictory) that the answer is almost always (or literally always) achievable.

---

## 22. Interview Thinking

```text
1. Understand the input    → array of distinct integers
2. Understand the output   → true/false: can we make nums2 uniformly odd or even?
3. Try brute force         → check both targets directly using a parity-counting pass
4. Find what makes it slow → nothing is slow here — it's already O(n)
5. Identify repeated work  → none; but look for a deeper mathematical shortcut
6. What can be stored?     → just a count of odd numbers
7. Optimize / simplify     → realize the two failure conditions (oddCount==1, oddCount==0)
                              can never happen simultaneously → answer is ALWAYS true
8. Check edge cases        → single element, all-even, all-odd, exactly one odd number
9. Analyze complexity      → O(n) time (or O(1) if you fully exploit the proof), O(1) space
```

Applied here: the interview-winning move isn't clever code — it's spotting that the two "impossible" scenarios are mutually exclusive, so the answer collapses to a guaranteed `true`. Even if you don't fully prove this in the moment, the counting-based solution is a fully correct, efficient fallback.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why does subtracting an *even* number never change a value's parity, using the "even − even = even, odd − even = odd" facts from Section 3?
2. If `nums1` has 5 elements, 4 of them odd and 1 even, which target (all-even or all-odd) is *guaranteed* to work, and why?
3. Can you construct any array (respecting the problem's constraints) where `oddCount` is simultaneously 0 and 1? Why or why not — and what does that tell you about this problem's answer?

<br>

## Answer to Mini Challenge

1. Subtracting an even number keeps the "evenness contribution" unchanged: even − even stays even (removing an even amount doesn't cross an odd/even boundary), and odd − even stays odd (same idea) — in both cases, the *original* parity survives untouched.
2. Target "all odd" is guaranteed to work here: `oddCount = 4 ≥ 1`, so the single even element can flip to odd using any of the 4 available odd numbers, and the 4 odd elements just copy directly.
3. No — `oddCount` is a single specific count of a fixed array; it's exactly one number, and can't be two different values at once. Since target "all even" only fails when `oddCount == 1`, and target "all odd" only fails when `oddCount == 0`, and these can never both hold true simultaneously, **at least one target always succeeds** — meaning this problem's answer is provably always `true`.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Determine whether `nums1` can be transformed, index by index (copy or subtract-another-element), into an array that's entirely odd or entirely even.

## 🔑 Main Idea
Subtracting an even number never changes parity; subtracting an odd number always flips it — so target "all even" only fails when there's exactly one odd number, and target "all odd" only fails when there are zero odd numbers. These two failure conditions can never both hold, so one target is always achievable.

## ⚙️ Algorithm
1. Count how many elements in `nums1` are odd (`oddCount`).
2. Target "all even" is achievable unless `oddCount == 1`.
3. Target "all odd" is achievable unless `oddCount == 0`.
4. Return true if either target is achievable (which is provably always the case).

## ⏱️ Complexity
Time: `O(n)`
Space: `O(1)`

## 🎯 Pattern to Remember
When a problem offers per-element "keep or transform" choices tied to a simple property (like parity), check whether the two possible failure conditions can ever coexist — if they can't, the answer may be a guaranteed constant.

---

## 25. Beginner Quiz

1. **(Understanding)** Why does the problem allow `j` to be *any* other index, rather than requiring a specific relationship between `i` and `j`?
2. **(Basic concept)** What is the parity of `15 - 8`? Of `15 - 9`? Explain using the "subtracting odd flips, subtracting even doesn't" rule.
3. **(Logic)** Why does target "all even" specifically fail when `oddCount == 1`, but succeed when `oddCount == 2` or more?
4. **(Dry run)** For `nums1 = [10, 21, 33]`, count the odd numbers, determine which target(s) work, and describe one valid construction of `nums2`.
5. **(Complexity/pattern)** Why can this problem be solved in `O(n)` time (or arguably `O(1)`), and what does it mean for a "return true/false" problem to have a provably constant answer — how might you recognize this kind of situation in a different problem?
