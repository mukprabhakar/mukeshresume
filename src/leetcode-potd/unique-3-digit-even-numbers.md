---
title: "3483. Unique 3-Digit Even Numbers"
slug: 'unique-3-digit-even-numbers'
date: '2026-09-11'
difficulty: 'Easy'
platform: 'LeetCode POTD'
timeComplexity: 'O(N^3)'
spaceComplexity: 'O(1)'
tags: ['Array', 'Hash Table', 'Enumeration', 'Combinatorics', 'Math']
excerpt: "Count the number of distinct 3-digit even numbers without leading zeros that can be formed from an array of digits using position enumeration and hash set deduplication."
---

# 3483. Unique 3-Digit Even Numbers

Let's teach this one from absolute zero, same structure as before. Good news: this problem's input is tiny (`digits.length` is at most 10), so we can lean on a very direct brute-force approach and it'll be plenty fast — but we'll still build up the reasoning carefully.

---

## 1. Problem in Very Simple Language

You're given a small list of single digits, `digits` (each between 0 and 9). Some digits might repeat in the list (like `[0,2,2]`, which has two `2`s).

You want to build **3-digit numbers** by picking three of these digits and arranging them in some order, following two rules:

* **No leading zero** — the very first digit of your 3-digit number can't be `0` (otherwise it wouldn't really be a 3-digit number, e.g., `"024"` is really just `24`, a 2-digit number).
* **Must be even** — the *last* digit of your number must be even (`0, 2, 4, 6,` or `8`), since a number is even exactly when its last digit is even.

You can only use each **copy** of a digit once per number. So if `digits = [2,2,3]`, you have two separate `2`s available (you could use both of them in the same number, like `223`), but you couldn't use a `2` a *third* time, since only two copies exist.

**Goal:** count how many **distinct** (different-looking) 3-digit even numbers can be formed this way.

* **What's given:** an array of digits (with possible repeats).
* **What to find:** how many different 3-digit even numbers can be built, respecting the no-leading-zero and "use each copy at most once" rules.
* **What to return:** that count.

---

## 2. Real-Life Analogy

Imagine you have a small pile of numbered tiles — say, tiles showing `1, 2, 3, 4`. You want to lay out exactly **three** of these tiles in a row to form a 3-digit number. Two rules apply: you can't start the row with a `0` tile (that would look silly, like a phone number starting with a blank), and the *last* tile in the row must show an even digit (so the whole number reads as even). If your pile has two tiles that look identical (like two `2`s), you're allowed to use *both* of them in the same row — but you can never use more copies of a tile than you physically have in your pile. You want to know: how many genuinely different-looking 3-tile rows can you form this way?

---

## 3. Important Programming Concepts I Need First

### Array
* **Concept:** A numbered list of values.
* **Example:** `digits = [1,2,3,4]` — a list of 4 single-digit numbers.
* **Why we need it:** Our input is exactly this kind of list.

### Set (for tracking distinct results)
* **Concept:** A collection that automatically ignores duplicate entries — adding the same value twice has no extra effect; the size of the set tells you how many *distinct* values it holds.
* **Example:** Adding `124`, then `124` again, then `132` to a set leaves it with just `{124, 132}` — size 2, not 3.
* **Why we need it:** Different choices of *which* digit copies we use might still produce the exact same-looking 3-digit number — a `Set` naturally handles this deduplication for us.

### Nested loops (trying every combination of positions)
* **Concept:** To try "every possible choice for the first digit, and for each of those, every possible choice for the second digit, and for each of those, every possible choice for the third digit," we nest three loops inside each other.
* **Why we need it:** With `digits.length` at most 10, trying every ordered triple of *distinct positions* (not distinct values — positions!) is only up to `10 × 10 × 10 = 1000` combinations at most — completely fast enough to brute-force directly.

### Using positions (indices), not just values, to respect "copies"
* **Concept:** Since a digit might repeat in the array (like two `2`s at, say, index 1 and index 2), we must be careful to select **three different positions** in the array (never reusing the *same* position twice), even if two different positions happen to hold the *same* value.
* **Why we need it:** This is exactly how the problem's "each copy used once" rule gets enforced correctly — by picking distinct array *indices*, not by trying to track "how many 2's have I used" separately.

### Building a number from its digits
* **Concept:** If you have three digits `a` (hundreds place), `b` (tens place), `c` (ones place), the actual number they form is `a × 100 + b × 10 + c`.
* **Example:** digits `1, 2, 4` in that order → `1×100 + 2×10 + 4 = 124`.
* **Why we need it:** Once we've picked three positions (in some order), we need to convert that ordered triple of digit-values into the actual 3-digit number.

---

## 4. Understand the Input

Take Example 2:
```text
digits = [0, 2, 2]
```

* Index 0 holds `0`, index 1 holds `2`, index 2 holds `2`.
* Even though the *values* `2` and `2` look identical, they live at two genuinely different positions (index 1 and index 2) — so we're allowed to use "the `2` at index 1" and "the `2` at index 2" together in the same number, since that only uses each *position* once.
* We want: distinct 3-digit even numbers, using exactly 3 of these positions (all of them, actually, since there are only 3 total), with no leading zero and an even last digit.

---

## 5. Understand the Output

Output: `2`

* Let's think about which arrangements of `{0, 2, 2}` (using each position exactly once, since there are exactly 3 positions and we need exactly 3 digits) give valid, distinct 3-digit even numbers.
* Arrangement `0, 2, 2` → number `022` → **invalid**, leading zero.
* Arrangement `2, 0, 2` → number `202` → valid! Leading digit `2` (fine), last digit `2` (even, fine).
* Arrangement `2, 2, 0` → number `220` → valid! Leading digit `2` (fine), last digit `0` (even, fine).
* Distinct valid numbers found: `{202, 220}` → count = **2**. ✔️ matches!

---

## 6. Solve the Example Manually

Let's manually work through **Example 1**: `digits = [1,2,3,4]` (all distinct values, 4 positions total).

Since we need exactly 3 digits out of these 4 available positions, and order matters, let's reason smartly using our two rules:

**Rule for the last digit (must be even):** Out of `{1,2,3,4}`, only `2` and `4` are even. So the *last* digit of our number must be either `2` or `4`.

**Rule for the first digit (can't be 0):** None of `1,2,3,4` are `0` anyway, so this rule doesn't eliminate anything here — *any* of the 4 digits is fine as a leading digit.

* **Case A: last digit = 2.** Remaining available digits: `{1,3,4}`. Ordered pairs for first two positions: `(1,3),(1,4),(3,1),(3,4),(4,1),(4,3)` → `132, 142, 312, 342, 412, 432` (6 numbers).
* **Case B: last digit = 4.** Remaining available digits: `{1,2,3}`. Ordered pairs for first two positions: `(1,2),(1,3),(2,1),(2,3),(3,1),(3,2)` → `124, 134, 214, 234, 314, 324` (6 numbers).

**Total:** 6 + 6 = **12** distinct numbers. ✔️ matches!

---

## 7. Think Like a Programmer

* **What do I know?** I have up to 10 digit positions; I need to pick 3 distinct positions, arrange them in an order, and check two simple rules.
* **What do I need to find?** How many *distinct-looking* valid 3-digit numbers can result.
* **What can I try?** Try every possible ordered choice of 3 distinct positions (three nested loops, each picking a different index), build the resulting number, check the two validity rules, and if valid, add it to a `Set` (which automatically handles deduplication).
* **What happens if I try every possibility?** With at most 10 positions, trying every ordered triple of distinct positions is at most `10 × 9 × 8 = 720` combinations — trivially fast for any computer.
* **What information should I remember?** A `Set<Integer>` to collect every valid number we form, so duplicates are automatically only counted once.
* **What pattern do I notice?** Enumerate all valid arrangements of a small set of positions, filter by simple rules, deduplicate results using a hash set.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** Use three nested loops, each iterating over all indices of `digits`, to try every possible ordered triple of **distinct** indices `(i, j, k)`. For each such triple, form the number `digits[i]*100 + digits[j]*10 + digits[k]`, and if it satisfies "first digit isn't 0" and "last digit is even," add it to a `Set<Integer>`. At the end, return the set's size.

```java
import java.util.*;

class Solution {
    public int totalNumbers(int[] digits) {
        int n = digits.length;
        Set<Integer> validNumbers = new HashSet<>();

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j == i) continue; // must be a different position than i
                for (int k = 0; k < n; k++) {
                    if (k == i || k == j) continue; // must be different from both i and j

                    int firstDigit = digits[i];
                    int secondDigit = digits[j];
                    int thirdDigit = digits[k];

                    if (firstDigit == 0) continue;      // no leading zero
                    if (thirdDigit % 2 != 0) continue;  // last digit must be even

                    int number = firstDigit * 100 + secondDigit * 10 + thirdDigit;
                    validNumbers.add(number);
                }
            }
        }

        return validNumbers.size();
    }
}
```

```javascript
class Solution {
    totalNumbers(digits) {
        const n = digits.length;
        const validNumbers = new Set();

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (j === i) continue; // must be a different position than i
                for (let k = 0; k < n; k++) {
                    if (k === i || k === j) continue; // must be different from both i and j

                    const firstDigit = digits[i];
                    const secondDigit = digits[j];
                    const thirdDigit = digits[k];

                    if (firstDigit === 0) continue;      // no leading zero
                    if (thirdDigit % 2 !== 0) continue;  // last digit must be even

                    const number = firstDigit * 100 + secondDigit * 10 + thirdDigit;
                    validNumbers.add(number);
                }
            }
        }

        return validNumbers.size;
    }
}
```

---

## 9. Explain the Brute Force Code Line by Line

* `int n = digits.length;` — total number of available digit positions.
* `Set<Integer> validNumbers = new HashSet<>();` — will collect every distinct valid number we successfully form.
* The three nested `for` loops (`i`, `j`, `k`) — each ranges over all valid array indices (`0` to `n-1`), attempting to try every possible ordered assignment of positions.
* `if (j == i) continue;` — skip this combination if `j` is the same position as `i`.
* `if (k == i || k == j) continue;` — skip if `k` collides with either `i` or `j`.
* `int firstDigit = digits[i]; ...` — read out the actual digit values at these three chosen positions.
* `if (firstDigit == 0) continue;` — enforce the "no leading zero" rule.
* `if (thirdDigit % 2 != 0) continue;` — enforce the "must be even" rule.
* `int number = firstDigit * 100 + secondDigit * 10 + thirdDigit;` — compute the actual 3-digit integer.
* `validNumbers.add(number);` — record the number; duplicate values are automatically ignored.
* `return validNumbers.size();` — return the count of distinct numbers formed.

---

## 10. Why Might We Want to Understand This More Deeply?

With `digits.length ≤ 10`, the enumeration takes at most 720 iterations. The `Set` does critical work when duplicate values exist at different indices.

---

## 11. When Do Duplicate-Looking Numbers Arise?

Duplicate-looking numbers arise when the array contains **repeated values** at different positions (e.g., `digits = [6,6,6]`).
* There are $3 \times 2 \times 1 = 6$ index permutations: `(0,1,2), (0,2,1), ...`.
* All 6 permutations evaluate to `666`.
* Without a `Set`, a plain counter would return `6` (wrong). With a `Set`, only `1` unique number `{666}` is kept (correct).

---

## ⭐ Key Insight

### Before the insight
It might seem like we should count the number of valid index permutations directly.

### The problem
That counts **arrangements of indices**, not **distinct-looking numbers**. Repeated digits cause severe overcounting.

### The insight
**The problem asks for distinct *numbers*, not distinct *position choices*.** Enumerate index triples to respect physical tile counts, construct the number, and insert into a `Set` for automatic deduplication.

### After the insight
No complex combinatorial formulas or exclusion-inclusion logic needed — brute force with a Set is simple, foolproof, and takes under 1 ms.

---

## 13. Dry Run the Solution

Let's dry-run **Example 4**: `digits = [1,3,5]`.
* All values are odd.
* The check `thirdDigit % 2 != 0` skips every single combination.
* `validNumbers.size() = 0`. ✔️ Output = `0`.

---

## 14. Optimized Code

```java
import java.util.*;

class Solution {
    public int totalNumbers(int[] digits) {
        int n = digits.length;
        Set<Integer> validNumbers = new HashSet<>();

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (j == i) continue;
                for (int k = 0; k < n; k++) {
                    if (k == i || k == j) continue;

                    int firstDigit = digits[i];
                    int secondDigit = digits[j];
                    int thirdDigit = digits[k];

                    if (firstDigit == 0) continue;
                    if (thirdDigit % 2 != 0) continue;

                    int number = firstDigit * 100 + secondDigit * 10 + thirdDigit;
                    validNumbers.add(number);
                }
            }
        }

        return validNumbers.size();
    }
}
```

```javascript
class Solution {
    totalNumbers(digits) {
        const n = digits.length;
        const validNumbers = new Set();

        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (j === i) continue;
                for (let k = 0; k < n; k++) {
                    if (k === i || k === j) continue;

                    const firstDigit = digits[i];
                    const secondDigit = digits[j];
                    const thirdDigit = digits[k];

                    if (firstDigit === 0) continue;
                    if (thirdDigit % 2 !== 0) continue;

                    const number = firstDigit * 100 + secondDigit * 10 + thirdDigit;
                    validNumbers.add(number);
                }
            }
        }

        return validNumbers.size;
    }
}
```

---

## 15. Explain the Code Line by Line

See Section 9 for complete line-by-line documentation.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`digits = [1,2,3,4]` → Output: `12` ✔️

### Example 2 — Different Case
`digits = [0,2,2]` → Output: `2` (`202`, `220`) ✔️

### Example 3 — All identical values
`digits = [6,6,6]` → Output: `1` (`666`) ✔️

### Example 4 — No even digits
`digits = [1,3,5]` → Output: `0` ✔️

---

## 17. Edge Cases

* **All digits odd:** Output `0`.
* **All digits identical:** Output `1` if valid even 3-digit number, otherwise `0`.
* **Array contains 0:** `0` cannot be leading, but is valid in tens/ones place.
* **$N = 3$ (minimum size):** Exactly 6 permutations evaluated.
* **$N = 10$ (maximum size):** Up to 720 combinations evaluated instantly.

---

## 18. Time Complexity

* **Time Complexity:** $O(N^3)$ where $N \le 10$, yielding at most 720 iterations — executes in microseconds ($O(1)$ effectively).

---

## 19. Space Complexity

* **Space Complexity:** $O(1)$ auxiliary space — at most 900 unique 3-digit integers (100 to 999) can be stored in the hash set.

---

## 20. Common Mistakes Beginners Make

* ❌ **"Tracking values used instead of array indices."**
  * ✅ You must track distinct index positions to allow using multiple copies of identical digits.
* ❌ **"Using a counter instead of a Set."**
  * ✅ Repeated digit values cause different index triplets to yield identical numbers.
* ❌ **"Disallowing 0 in middle or last positions."**
  * ✅ `0` is only forbidden as the leading hundreds digit; `202` and `220` are valid.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for:
```text
"Form distinct numbers from given digits"
"Each copy can be used once"
Small input bounds (N <= 15)
```
When $N \le 15$, exhaustive permutation search with a Hash Set is optimal, clear, and bug-resistant.

---

## 22. Interview Thinking

```text
1. Understand the input    → array of digits, possibly with repeats, small size
2. Understand the output   → count of DISTINCT valid 3-digit even numbers formable
3. Try brute force         → enumerate every ordered triple of distinct POSITIONS
4. Find what makes it slow → nothing — n<=10 makes O(n^3) trivially fast
5. Identify repeated work  → use Set for deduplication of identical numbers
6. What can be stored?     → a Set<Integer> to naturally deduplicate final results
7. Optimize                → brute force is already optimal for N <= 10
8. Check edge cases        → all-odd digits, all-identical digits, digits containing 0
9. Analyze complexity      → O(n^3) time, O(1) space
```

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why do we check `j == i` and `k == i || k == j` separately instead of `i == j == k`?
2. If `digits = [4,4,4,4]`, how many index triples pass checks, and what is the final set size?
3. Why does the order of checking `firstDigit == 0` vs `thirdDigit % 2 != 0` not matter?

<br>

### Answer to Mini Challenge

1. `i == j == k` would miss partial collisions like `i == j != k` (reusing index $i$ twice).
2. All 24 index permutations produce `444`; the final set size is `1`.
3. Both checks are independent filter conditions; their evaluation order does not affect the outcome.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Count the distinct 3-digit even numbers (no leading zero) formable by arranging 3 distinct positions from the given digit array.

### 🔑 Main Idea
Enumerate all pairwise-distinct index triplets `(i, j, k)`, validate `digits[i] != 0` and `digits[k] % 2 == 0`, and collect valid values in a `Set`.

### ⚙️ Algorithm
1. Loop $i$ from $0$ to $n-1$, $j$ from $0$ to $n-1$ ($j \ne i$), $k$ from $0$ to $n-1$ ($k \ne i, k \ne j$).
2. Check `digits[i] != 0` and `digits[k] % 2 == 0`.
3. Compute `val = digits[i]*100 + digits[j]*10 + digits[k]` and insert into `Set`.
4. Return `set.size()`.

### ⏱️ Complexity
* **Time:** $O(N^3)$
* **Space:** $O(1)$

---

## 25. Beginner Quiz

1. **(Understanding)** Why must we select distinct array positions rather than checking values?
2. **(Basic concept)** Why is a `Set` required instead of an incrementing integer counter?
3. **(Logic)** Why does `digits = [1,3,5]` always yield `0`?
4. **(Dry run)** For `digits = [2,0,0]`, list the valid permutations and find the final count.
5. **(Complexity/pattern)** Why is $O(N^3)$ optimal for $N \le 10$?
