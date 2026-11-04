---
title: "3870. Count Commas in Range"
slug: 'count-commas-in-range'
date: '2026-09-08'
difficulty: 'Easy'
platform: 'LeetCode POTD'
timeComplexity: 'O(log N)'
spaceComplexity: 'O(1)'
tags: ['Math', 'Digits', 'Range Counting', 'Simulation']
excerpt: "Count the total number of commas across standard-formatted integers from 1 to n using digit grouping and mathematical division."
---

# 3870. Count Commas in Range

A nice, approachable "Easy" problem — let's still build it up carefully from zero, since even simple-sounding problems can trip you up on the details (like off-by-one digit counting).

---

## 1. Problem in Very Simple Language

You're given a number `n`. Imagine writing out **every whole number from 1 to `n`**, one after another, using the normal way we format big numbers with commas — like `1,234` or `12,345,678`.

The rule for where commas go: starting from the **rightmost** digit and counting leftward, you insert a comma after every group of 3 digits. Numbers with 3 digits or fewer (so, 1 to 999) never get any comma at all.

Your job: count the **total number of commas** used, if you wrote out every single number from `1` to `n` this way and added up all the commas across all of them.

* **What's given:** a single integer `n`.
* **What to find:** how many commas appear in total, across the standard-formatted versions of every integer from `1` to `n`.
* **What to return:** that total count.

---

## 2. Real-Life Analogy

Imagine you're a bank teller printing out receipts for every dollar amount from `$1` to `$n`, and your printer automatically adds commas to big numbers (like `$12,345`) the way we normally read money. Some receipts (small amounts, under `$1,000`) come out with no commas at all. Others (like `$45,678`) get exactly one comma. Really huge ones would get two or more. You want to know: if you printed *every single receipt* from `$1` up through `$n`, how many commas would show up in total, across the whole stack?

---

## 3. Important Programming Concepts I Need First

### Digit Count of a Number
* **Concept:** How many digits a number has when written normally. `7` has 1 digit, `42` has 2 digits, `1000` has 4 digits.
* **Why we need it:** The number of commas a number gets depends *entirely* on how many digits it has — nothing else matters.

### The comma-counting rule, translated into math
* **Concept:** A comma appears after every group of 3 digits, counting from the right. This means:
  * 1-3 digit numbers → 0 commas.
  * 4-6 digit numbers → 1 comma.
  * 7-9 digit numbers → 2 commas.
  * In general, a number with `d` digits gets exactly `(d - 1) / 3` commas, using **integer division** (which automatically rounds down / drops any remainder).
* **Example:** `d = 4` → `(4-1)/3 = 3/3 = 1` comma. `d = 6` → `(6-1)/3 = 5/3 = 1` (integer division drops the `.67`) → still 1 comma (correct: `123,456` has exactly 1 comma). `d = 7` → `(7-1)/3 = 6/3 = 2` commas (correct: `1,234,567` has 2 commas).
* **Why we need it:** This one small formula is the entire mathematical engine behind the whole problem.

### Integer Division
* **Concept:** When dividing two integers in Java using `/`, the result is automatically truncated (rounded toward zero) — no decimal part is kept.
* **Example:** `7 / 3 = 2` (not `2.33`), `5 / 3 = 1`.
* **Why we need it:** Our comma-count formula, `(d-1)/3`, relies specifically on this truncating behavior.

### Loop
* **Concept:** Repeats an action for every item in a range.
* **Why we need it:** We need to consider every number from 1 to `n` (or, in the optimized version, every possible *digit-length group* within that range).

### Grouping by digit length (a new, useful pattern)
* **Concept:** Instead of processing numbers one at a time, notice that **all numbers with the same digit count get the exact same number of commas**. So instead of asking "how many commas does 1000 get? 1001? 1002?" one at a time, we can ask "how many 4-digit numbers are there in our range, and multiply that count by 1 (the commas each one gets)?" — all at once.
* **Why we need it:** This turns our solution into something that only needs to check a tiny handful of digit-length "groups" (since `n` can have at most a few digits), rather than looping through every single number.

---

## 4. Understand the Input

Take Example 1:
```text
n = 1002
```

* We're writing out every number from `1` to `1002`.
* Most of these numbers (1 through 999) have 3 or fewer digits, so they contribute 0 commas each.
* The numbers `1000`, `1001`, and `1002` each have 4 digits, so each contributes exactly `(4-1)/3 = 1` comma.
* Why does it matter that exactly *three* numbers (`1000, 1001, 1002`) fall into the "4-digit" group within our range? Because the total comma count is just "how many numbers are in each digit-length group" multiplied by "how many commas that group's numbers each get," summed across all groups.

---

## 5. Understand the Output

Output: `3`

* Numbers 1 through 999: 0 digits-group contribution (0 commas each, 999 numbers, `999 × 0 = 0` total commas).
* Numbers 1000 through 1002: this is a 4-digit group; each number here gets exactly 1 comma; there are 3 such numbers in our range (`1000, 1001, 1002`); so `3 × 1 = 3` commas.
* Grand total: `0 + 3 = 3`. ✔️ matches!

---

## 6. Solve the Example Manually

Let's manually work through Example 1 (`n = 1002`) using the "group by digit length" idea.

**Step 1: Figure out the digit-length groups that fall (even partially) within `[1, n]`.**

* 1-digit numbers: `1` to `9` (9 numbers total in this group, all fully within our range since `n=1002 ≥ 9`).
* 2-digit numbers: `10` to `99` (90 numbers, fully within range).
* 3-digit numbers: `100` to `999` (900 numbers, fully within range).
* 4-digit numbers: `1000` to `9999` normally — but our range stops at `n = 1002`, so only `1000` to `1002` actually falls within `[1, n]` (3 numbers, a *partial* group).

**Step 2: For each group, compute commas-per-number, and how many numbers from that group are actually in `[1, n]`.**

| Digit length (d) | Commas per number: (d-1)/3 | Full range of d-digit numbers | Numbers actually in [1, n] | Count in range | Commas contributed |
|---|---|---|---|---|---|
| 1 | (1-1)/3 = 0 | 1 to 9 | 1 to 9 (all fit, since 9 ≤ 1002) | 9 | 9 × 0 = 0 |
| 2 | (2-1)/3 = 0 | 10 to 99 | 10 to 99 (all fit) | 90 | 90 × 0 = 0 |
| 3 | (3-1)/3 = 0 | 100 to 999 | 100 to 999 (all fit) | 900 | 900 × 0 = 0 |
| 4 | (4-1)/3 = 1 | 1000 to 9999 | 1000 to **1002** (capped by n) | 3 | 3 × 1 = 3 |

**Step 3: Sum all the "commas contributed" values.**

`0 + 0 + 0 + 3 = 3`. ✔️ matches!

Notice groups 1, 2, and 3 all contribute `0` total commas anyway (since `(d-1)/3 = 0` for `d = 1, 2, 3`), so really only 4-digit-and-beyond groups can ever contribute anything — but it's still good practice to see the general method applied to every group, since for a bigger `n`, later groups (5-digit, 6-digit, etc.) *would* start contributing.

---

## 7. Think Like a Programmer

* **What do I know?** Every number's comma count depends only on its digit length, via the formula `(digitLength - 1) / 3`.
* **What do I need to find?** The sum of comma-counts across every number from 1 to `n`.
* **What can I try?** The most direct approach: loop through every number from 1 to `n`, figure out its digit length (e.g., by converting to a string and checking its length, or by repeated division), compute its comma count, and add it to a running total.
* **What happens if I try every possibility?** With `n` capped at `100,000` (per the constraints — `10^5`), looping through every single number is only `100,000` iterations — genuinely fast and totally fine for this problem's size.
* **Can I make it faster / cleaner anyway?** Yes — since numbers with the *same digit length* always contribute the *same* number of commas each, we can process entire digit-length *groups* at once (as done in Section 6), rather than one number at a time. This is both faster (only a handful of groups to consider, since `n ≤ 100,000` means at most 6 digits) and arguably a cleaner way to think about the problem.
* **What information should I remember?** For each digit length `d` from 1 upward (until we exceed `n`), the size of the *overlap* between "all d-digit numbers" (`10^(d-1)` to `10^d - 1`) and our actual range (`1` to `n`).
* **What pattern do I notice?** This is fundamentally a **counting-by-groups** problem: instead of processing each individual item, identify a small number of "buckets" (digit-length groups here) where every item in the bucket behaves identically, and process each bucket as a whole.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** Loop through every integer from `1` to `n`. For each one, determine its digit count (e.g., via `String.valueOf(i).length()`), compute its comma count via the formula, and add it to a running sum.

**Why it works:** It directly computes the comma count for every single number in the range and sums them — a completely literal implementation of the problem statement.

```java
class Solution {
    public int countCommas(int n) {
        int totalCommas = 0;

        for (int i = 1; i <= n; i++) {
            int digitCount = String.valueOf(i).length();
            int commasForThisNumber = (digitCount - 1) / 3;
            totalCommas += commasForThisNumber;
        }

        return totalCommas;
    }
}
```

```javascript
class Solution {
    countCommas(n) {
        let totalCommas = 0;

        for (let i = 1; i <= n; i++) {
            const digitCount = String(i).length;
            const commasForThisNumber = Math.floor((digitCount - 1) / 3);
            totalCommas += commasForThisNumber;
        }

        return totalCommas;
    }
}
```

**Time complexity:** `O(n)` iterations, and converting each number to a string to get its length takes time roughly proportional to the number of digits (which is at most `O(log n)`) — so overall `O(n log n)` in the strictest sense, though for `n` up to `100,000`, this is trivially fast regardless.

**Space complexity:** `O(1)` extra (not counting temporary string allocations).

---

## 9. Explain the Brute Force Code Line by Line

* `int totalCommas = 0;` — our running sum, starting at zero.
* `for (int i = 1; i <= n; i++)` — walks through every integer from `1` to `n`, inclusive, exactly as the problem describes.
* `int digitCount = String.valueOf(i).length();` — converts the current number `i` into its string form (e.g., `1002` becomes `"1002"`) and measures how many characters (digits) it has.
* `int commasForThisNumber = (digitCount - 1) / 3;` — applies our formula from Section 3: a number with `digitCount` digits gets exactly `(digitCount - 1) / 3` commas (using integer division, which naturally truncates/rounds down).
* `totalCommas += commasForThisNumber;` — adds this number's comma contribution to our running total.
* `return totalCommas;` — after checking every number, return the grand total.

---

## 10. Why Might We Want Something Even Cleaner?

For this specific problem, with `n` capped at only `100,000`, the brute force above is already extremely fast — there's no risk of it being "too slow." But it's worth learning the **grouped** approach too, both because it's a more elegant/insightful solution, and because it's the kind of technique that *would* be necessary if `n` were allowed to be much larger (say, up into the billions or beyond) — where looping one-by-one would eventually become impractical.

---

## 11. Find the Better (Grouped) Approach

> "Can we process many numbers at once, instead of one at a time?"

Yes — using the "group by digit length" idea from Section 6:

```text
Brute Force:
Loop through every number 1..n individually, compute its comma count
        ↓
O(n) work — fine here, but doesn't scale to huge n
        ↓
Realize: ALL numbers with the same digit length get the SAME comma count
        ↓
For each digit length d (only a handful exist, up to n's own digit length):
   figure out how many numbers of that length fall within [1, n]
   multiply by that length's comma count
        ↓
Sum across all digit lengths — O(number of digits in n), extremely fast regardless of how big n is
```

---

## ⭐ Key Insight

### Before the insight
It seems natural to check every number individually to find its comma count.

### The problem
This is more work than necessary — most of that work is redundant, since large *groups* of consecutive numbers (all numbers with the same digit length) share the exact same comma count.

### The insight
**A number's comma count depends ONLY on its digit length, via `(digitLength - 1) / 3` — nothing else about the number matters.** This means we can skip checking numbers individually altogether, and instead directly compute, for each digit length `d`, exactly how many numbers of that length fall within our range `[1, n]` — using simple arithmetic on the boundaries `10^(d-1)` and `10^d - 1`, capped by `n` — then multiply that count by the (fixed) comma count for that digit length.

### After the insight
The entire problem shrinks from "process up to 100,000 individual numbers" down to "process at most 6 digit-length groups" (since `n ≤ 100,000` means digit lengths only range from 1 to 6), each handled with simple arithmetic.

---

## 13. Dry Run the Grouped Solution

Let's dry-run **Example 2**: `n = 998`.

**Digit length 1 (numbers 1-9):** Fully within range (`9 ≤ 998`). Count = `9`. Commas per number = `(1-1)/3 = 0`. Contribution = `9 × 0 = 0`.

**Digit length 2 (numbers 10-99):** Fully within range. Count = `90`. Commas per number = `(2-1)/3 = 0`. Contribution = `90 × 0 = 0`.

**Digit length 3 (numbers 100-999, but capped at n=998):** The natural range is `100` to `999`, but since `n = 998 < 999`, we cap the upper end at `998`. Count = `998 - 100 + 1 = 899`. Commas per number = `(3-1)/3 = 2/3 = 0` (integer division). Contribution = `899 × 0 = 0`.

**Digit length 4 and beyond:** The natural range would start at `1000`, but our `n = 998` is smaller than `1000` — so there are **zero** numbers of digit length 4 (or more) within `[1, 998]`. We stop here.

**Total:** `0 + 0 + 0 = 0`. ✔️ matches!

---

## 14. Optimized (Grouped) Code

```java
class Solution {
    public int countCommas(int n) {
        int totalCommas = 0;

        long groupStart = 1;      // start of the current digit-length group (e.g., 1, 10, 100, 1000, ...)
        int digitLength = 1;

        while (groupStart <= n) {
            long groupEnd = groupStart * 10 - 1; // e.g., for groupStart=100, groupEnd=999
            long actualEnd = Math.min(groupEnd, (long) n); // cap at n if the group extends past it

            long countInGroup = actualEnd - groupStart + 1;
            int commasPerNumber = (digitLength - 1) / 3;

            totalCommas += countInGroup * commasPerNumber;

            groupStart *= 10;
            digitLength++;
        }

        return totalCommas;
    }
}
```

```javascript
class Solution {
    countCommas(n) {
        let totalCommas = 0;

        let groupStart = 1;
        let digitLength = 1;

        while (groupStart <= n) {
            const groupEnd = groupStart * 10 - 1;
            const actualEnd = Math.min(groupEnd, n);

            const countInGroup = actualEnd - groupStart + 1;
            const commasPerNumber = Math.floor((digitLength - 1) / 3);

            totalCommas += countInGroup * commasPerNumber;

            groupStart *= 10;
            digitLength++;
        }

        return totalCommas;
    }
}
```

---

## 15. Explain the Grouped Code Line by Line

* `int totalCommas = 0;` — our running sum, same as before.
* `long groupStart = 1;` — the starting point of the current digit-length group. We begin with 1-digit numbers, which start at `1`. (We use `long` here purely as a safety habit for intermediate arithmetic like `groupStart * 10`).
* `int digitLength = 1;` — tracks how many digits the current group's numbers have.
* `while (groupStart <= n)` — we keep processing digit-length groups as long as the *start* of the next group is still within our range; once a group's start exceeds `n`, there's nothing left to count.
* `long groupEnd = groupStart * 10 - 1;` — computes the natural upper end of this digit-length group. For example, if `groupStart = 100` (3-digit numbers begin here), then `groupEnd = 100 * 10 - 1 = 999`.
* `long actualEnd = Math.min(groupEnd, (long) n);` — since our range might not reach all the way to the group's natural end, we cap it using `Math.min`.
* `long countInGroup = actualEnd - groupStart + 1;` — standard inclusive range count formula: `(end - start + 1)`.
* `int commasPerNumber = (digitLength - 1) / 3;` — our comma formula from Section 3, applied to this group's shared digit length.
* `totalCommas += countInGroup * commasPerNumber;` — adds this entire group's total comma contribution to our running sum all at once.
* `groupStart *= 10; digitLength++;` — advance to the next digit-length group and increment our digit-length tracker.
* `return totalCommas;` — after all applicable groups have been processed, return the final sum.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`n = 1002` → dry-ran manually in Section 6 → Output: `3` ✔️

### Example 2 — Different Case
`n = 998` → dry-ran in Section 13 → Output: `0` ✔️

### Example 3 — Edge Case (very small n)
`n = 1`. `groupStart = 1`, which is `≤ n(1)`: `groupEnd = 1×10-1 = 9`, `actualEnd = min(9, 1) = 1`, `countInGroup = 1-1+1 = 1`, `commasPerNumber = (1-1)/3 = 0`, contribution = `1×0=0`. `totalCommas = 0`. Next `groupStart` becomes `10 > 1`, loop terminates. Output: `0` ✔️

---

## 17. Edge Cases

* **`n = 1` (smallest possible input)** → only the single number `1` is considered, which trivially has 0 commas → output `0`.
* **`n` exactly at a "boundary" like `999` or `1000`** → correctly handled by the `Math.min(groupEnd, n)` capping — e.g., `n=999` never enters the 4-digit group loop iteration, while `n=1000` does enter it with `actualEnd` correctly capped at `1000`.
* **`n` such that no group ever reaches 4+ digits** (`n ≤ 999`) → every group's `commasPerNumber` evaluates to `0`, so the total is always `0`.
* **Maximum `n` (up to `100,000`, i.e., 6 digits)** → our loop runs at most 6 times, executing in microseconds.
* **`n` right at a power of 10 transition** — naturally handled by the group-boundary math.

---

## 18. Time Complexity

**What is time complexity?** An estimate of how the amount of work grows as the input grows, using a general trend.

```text
Brute Force (loop 1 to n):
O(n) — for n up to 100,000, this is fast, but scales linearly with n

Grouped Approach:
O(digits in n) — effectively O(log10 n), since the number of digit-length
                   groups is proportional to how many digits n itself has
```

**Why:** In the grouped approach, we never look at individual numbers — we only ever process one group per possible digit length (at most 6 for `n ≤ 100,000`, and at most 10 for any 32-bit integer).

---

## 19. Space Complexity

* Both approaches use only a small, fixed number of extra variables (`totalCommas`, `groupStart`, `digitLength`).
* Extra space: `O(1)`.

---

## 20. Common Mistakes Beginners Make

* ❌ **"The comma formula should be `digitCount / 3`, without the `-1`."**
  * ✅ It must be `(digitCount - 1) / 3` — for `d=3`, `3/3=1` would wrongly suggest 3-digit numbers get a comma, whereas `(3-1)/3 = 2/3 = 0` correctly gives zero.
* ❌ **"The group boundaries should be `10^d` to `10^(d+1)`."**
  * ✅ Careful with off-by-one: 1-digit numbers are `1` to `9`, 2-digit are `10` to `99`, 3-digit are `100` to `999`. Pattern: starts at `10^(d-1)`, ends at `10^d - 1`.
* ❌ **"I don't need to cap the group's end using `Math.min`."**
  * ✅ When `n` falls within a digit-length group, capping with `Math.min(groupEnd, n)` is essential to avoid overcounting numbers greater than `n`.
* ❌ **"This requires string formatting."**
  * ✅ The problem reduces entirely to digit-counting mathematics without any string allocations.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Sum/count something across all numbers from 1 to n"
"Depends only on digit count or numerical scale"
Large numeric ranges where consecutive blocks share identical behavior
```

Whenever a per-number property is shared by large groups of consecutive numbers, think: **process by group, not by individual number** — compute `(group_size) × (per_item_value)` across $O(\log_{10} N)$ groups.

---

## 22. Interview Thinking

```text
1. Understand the input    → a single integer n
2. Understand the output   → total commas across standard-formatted 1..n
3. Try brute force         → loop 1 to n, compute each number's digit count and comma count
4. Find what makes it slow → redundant per-number work for large n
5. Identify repeated work  → all numbers with the same digit length behave identically
6. What can be stored?     → nothing extra needed — iterate over digit-length groups
7. Optimize                → for each digit length, group size (capped by n) × (d-1)/3
8. Check edge cases        → n=1, boundaries at 999, 1000, etc.
9. Analyze complexity      → O(log n) time, O(1) space
```

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why does the formula `(digitCount - 1) / 3` give `0` for any `digitCount` of 1, 2, or 3, but `1` for digitCount of 4, 5, or 6?
2. If `n = 50000`, which digit-length groups would be processed, and would any of them need `Math.min` capping applied?
3. Why does the grouped approach only ever need to loop a handful of times, no matter how big `n` gets (within reason)?

<br>

### Answer to Mini Challenge

1. Integer division `(d-1)/3` only increments when `d-1` crosses multiples of 3. For `d=1,2,3`: `d-1` is `0,1,2` (all yield `0`). For `d=4,5,6`: `d-1` is `3,4,5` (all yield `1`). This mirrors the standard 3-digit comma rule.
2. For `n = 50000` (5 digits): groups 1 (1-9), 2 (10-99), 3 (100-999), 4 (1000-9999) are fully included. Group 5 (10000-99999) is capped at `actualEnd = min(99999, 50000) = 50000`.
3. The number of groups equals the number of digits in `n`, which is at most 10 for standard 32-bit integers.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Count the total number of commas across the standard-formatted versions of every integer from 1 to `n`.

### 🔑 Main Idea
A number's comma count depends only on its digit length via `(digitLength - 1) / 3`. Process entire digit-length groups at once, multiplying each group's size by its shared comma count.

### ⚙️ Algorithm
1. For each digit length `d` starting at 1, find that group's natural range (`10^(d-1)` to `10^d - 1`).
2. Cap the group's upper end at `n` if needed (`Math.min`).
3. If `groupStart > n`, stop.
4. Otherwise, add `(actualEnd - groupStart + 1) × (d - 1) / 3` to the total.
5. Advance to the next power of 10 and repeat.

### ⏱️ Complexity
* **Time:** `O(log10 n)` (grouped)
* **Space:** `O(1)`

### 🎯 Pattern to Remember
When properties are uniform across digit ranges, group by powers of 10 to turn $O(N)$ simulations into $O(\log N)$ range calculations.

---

## 25. Beginner Quiz

1. **(Understanding)** Why do numbers with 1, 2, or 3 digits never contain any commas?
2. **(Basic concept)** What is `(7-1)/3` using integer division, and what does that tell you about how many commas a 7-digit number has?
3. **(Logic)** Why is `Math.min(groupEnd, n)` necessary when computing a group's actual upper bound?
4. **(Dry run)** For `n = 10500`, determine which digit-length groups get processed, their capped ranges, and the final total comma count.
5. **(Complexity/pattern)** Given that `n` is capped at only `100,000` in this specific problem, why is the simple `O(n)` brute-force loop perfectly acceptable here, and under what circumstances would you need the grouped `O(log n)` approach instead?
