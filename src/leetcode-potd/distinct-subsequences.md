---
title: "115. Distinct Subsequences"
slug: 'distinct-subsequences'
date: '2026-09-07'
difficulty: 'Hard'
platform: 'LeetCode POTD'
timeComplexity: 'O(M * N)'
spaceComplexity: 'O(M * N)'
tags: ['Dynamic Programming', 'String', 'Subsequence', 'Memoization', '2D Array']
excerpt: "Count how many distinct subsequences of string s equal string t using 2D dynamic programming, recursion with memoization, and space-optimized table filling."
---

# 115. Distinct Subsequences

This is a genuinely hard problem because it introduces **Dynamic Programming (DP)** for the first time in this series — a big, important new tool. Let's build it up very carefully from zero.

---

## 1. Problem in Very Simple Language

You're given two strings: `s` (the "source" string) and `t` (the "target" string).

A **subsequence** of `s` is what you get by deleting zero or more characters from `s`, *without rearranging* the remaining characters — they must stay in their original left-to-right order, just with some characters possibly skipped.

Your job: count **how many different ways** you can pick characters out of `s` (in order, skipping some) so that the characters you picked, read in order, spell out exactly `t`.

Two "ways" count as different if they use characters from **different positions** in `s`, even if the actual letters picked look identical when written out.

* **What's given:** two strings, `s` and `t`.
* **What to find:** the number of distinct ways to select a subsequence of `s` that equals `t`, letter for letter.
* **What to return:** that count, as an integer.

---

## 2. Real-Life Analogy

Imagine `s` is a long row of numbered raffle tickets, each with a letter printed on it, like `r-a-b-b-b-i-t`. You want to find every possible way to walk along this row, from left to right, tapping some tickets (and skipping others), such that the letters on the tickets you tapped spell out the word `"rabbit"`.

Since there are **three** `'b'` tickets in a row, when you need "just one b" for your spelling, you could tap *any one* of those three `'b'` tickets — and each different choice of *which* ticket you tapped counts as a genuinely different way, even though the final spelled word looks the same on paper. You want to count the total number of distinct "which tickets did I tap" plans that successfully spell `t`.

---

## 3. Important Programming Concepts I Need First

### String and Character Indexing
* **Concept:** A string is a sequence of characters; `s.charAt(i)` gets the character at position `i` (0-indexed).
* **Example:** For `s = "rabbit"`, `s.charAt(0) = 'r'`, `s.charAt(2) = 'b'`.
* **Why we need it:** We'll be comparing individual characters of `s` and `t` constantly.

### Subsequence (vs. Substring — an important distinction!)
* **Concept:** A **substring** must be *continuous* (no gaps). A **subsequence** can *skip* characters, as long as the remaining ones keep their relative order.
* **Example:** For `s = "abc"`: `"ac"` is a valid subsequence (skip the `b`) but NOT a valid substring (there's a gap). `"ab"` is both a valid substring and a valid subsequence.
* **Why we need it:** This entire problem is about subsequences, not substrings — mixing these up leads to a completely different (and wrong) problem.

### Recursion
* **Concept:** A function that solves a problem by calling *itself* on a smaller version of the same problem, until it reaches a case simple enough to answer directly (a "base case").
* **Simple Example:** To compute "how many ways can I climb `n` stairs, taking 1 or 2 steps at a time," you can express it as: `ways(n) = ways(n-1) + ways(n-2)`, with base cases `ways(0) = 1` and handling small `n` directly.
* **Why we need it:** Counting "ways to match `t` using a prefix of `s`" naturally breaks down into smaller versions of the exact same question — a textbook signal for recursion.

### Overlapping Subproblems (a key idea behind DP)
* **Concept:** Sometimes, when solving a problem recursively, the *exact same* smaller sub-question gets asked over and over again, through different recursive paths. If we don't remember the answer, we end up recomputing it repeatedly — wasteful.
* **Example:** In the classic Fibonacci recursion, `fib(5)` calls `fib(4)` and `fib(3)`; but `fib(4)` *also* ends up calling `fib(3)` again, from a different branch — same question, asked twice.
* **Why we need it:** As we'll see, this problem's recursion re-asks identical questions many, many times — recognizing this is what motivates the next concept.

### Memoization
* **Concept:** The fix for overlapping subproblems: the *first* time you compute the answer to some specific sub-question, save it somewhere (like a lookup table). Every subsequent time that *exact same* sub-question comes up, just look up the saved answer instantly instead of recomputing it.
* **Why we need it:** This turns an otherwise extremely slow recursive solution into a fast one, by ensuring every distinct sub-question is only ever actually computed once.

### Dynamic Programming (DP) — 2D Table
* **Concept:** Dynamic Programming is a general strategy: instead of recursion-with-memoization (computing top-down, saving answers as you go), you can often build the same answers **bottom-up**, filling in a table (often 2D, when there are two changing quantities — here, "how far into `s`" and "how far into `t`") in a carefully chosen order, so that whenever you need a smaller answer, it's *already sitting in the table*, precomputed.
* **Simple Example:** A table `dp[i][j]` where `dp[i][j]` represents "the answer to the problem using only the first `i` characters of `s` and the first `j` characters of `t`." You fill it in starting from the smallest `i, j` and build up.
* **Why we need it:** This problem's natural recursive structure depends on two shrinking quantities (position in `s`, position in `t`) — a perfect match for a 2D DP table.

### 2D Array
* **Concept:** A grid of values, indexed by two numbers (row and column), like `dp[i][j]`.
* **Why we need it:** Our DP table has one dimension per string.

---

## 4. Understand the Input

Take Example 1:
```text
s = "rabbbit"
t = "rabbit"
```

* `s` has 7 characters: `r, a, b, b, b, i, t` (positions 0 through 6). Note the **three** `b`s in a row (positions 2, 3, 4).
* `t` has 6 characters: `r, a, b, b, i, t` (positions 0 through 5). Note `t` needs **two** `b`s.
* We want: how many different ways can we choose 6 positions from `s` (in increasing order) such that the characters at those positions, in order, spell exactly `"rabbit"`?
* Why do the three `b`s in `s` matter so much? Because `t` needs exactly 2 `b`s in a row (conceptually), and there are `3` available `b`s to choose `2` from — this is exactly where the "3 different ways" in the answer comes from, as we'll see.

---

## 5. Understand the Output

Output: `3`

* The three ways (matching the problem's illustration) are essentially: use `b` at position 2 and `b` at position 3; use `b` at position 2 and `b` at position 4; use `b` at position 3 and `b` at position 4. (The `r`, `a`, `i`, `t` all come from their own unique single positions in `s`, so they don't add extra choices — only *which two of the three `b`s* is genuinely ambiguous.)
* Each of these 3 choices produces a different *set of positions* used, even though the resulting spelled-out word is identical (`"rabbit"`) in every case — remember, we're counting distinct *selections*, not distinct *spellings*.

---

## 6. Solve the Example Manually

Let's build understanding with a **much smaller** example first, since the real one has a lot of moving parts: `s = "bbb"`, `t = "bb"`.

We want: how many ways to pick 2 positions (in order) out of the 3 `b`s in `s`, such that both picked characters equal `'b'` (trivially true here, since all characters are `'b'`)?

This is really just: "how many ways to choose 2 positions out of 3, keeping their relative order" — which is the same as asking "how many 2-element subsets of `{0,1,2}` are there" (order is automatically preserved when we just pick a subset and read left to right). That's `{0,1}, {0,2}, {1,2}` — **3 ways**. This matches our intuition!

Now here's the key manual insight, thinking recursively: to match `t = "bb"` using `s = "bbb"`, look at the **last character** of `s` (position 2, a `'b'`) and the **last character** of `t` (also `'b'`).

Since they match, we have **two options** for this last `'b'` in `s`:
* **Use it** to match the last `'b'` of `t` — then we still need to match the *remaining* `t` (`"b"`, just 1 character) using the *remaining* `s` (`"bb"`, positions 0-1).
* **Skip it** (don't use this `s` character at all) — then we still need to match the *full* `t` (`"bb"`) using the *remaining* `s` (`"bb"`, positions 0-1, i.e., everything except the last character).

So: `ways("bbb", "bb") = ways("bb", "b") + ways("bb", "bb")`.

We'd keep breaking this down the same way until we hit trivial base cases (like "matching an empty `t` is always possible in exactly 1 way — just pick nothing," or "matching a non-empty `t` using an empty `s` is impossible, 0 ways"). Let's not fully expand this by hand (that's what code is for!), but this recursive breaking-down is *exactly* the algorithm we're about to formalize.

---

## 7. Think Like a Programmer

* **What do I know?** For any given "remaining piece of `s`" and "remaining piece of `t`," I can look at their last characters and reason about matching options.
* **What do I need to find?** The total count of valid subsequence selections.
* **What can I try?** Define a function `count(i, j)` = "number of ways to form `t[0..j-1]` (the first `j` characters of `t`) using `s[0..i-1]` (the first `i` characters of `s`)." We want `count(s.length(), t.length())`.
* **What's the recursive breakdown?** Look at the *last* character of the current `s`-prefix (i.e., `s.charAt(i-1)`) and the *last* character of the current `t`-prefix (`t.charAt(j-1)`):
  * If `s.charAt(i-1) == t.charAt(j-1)` (they match): we have **two** choices — use this `s` character to match this `t` character (then recurse on `count(i-1, j-1)`), OR don't use it at all (recurse on `count(i-1, j)`). Total: `count(i-1, j-1) + count(i-1, j)`.
  * If they *don't* match: we have **no choice** but to skip this `s` character (it can't help match `t`'s last character) — so it's just `count(i-1, j)`.
* **What are the base cases?** If `j == 0` (we've matched all of `t` already, nothing left needed): there's exactly **1** way (pick nothing further) — this holds *regardless* of what `i` is (even matching "nothing" using "nothing" is 1 way — the empty selection). If `j > 0` but `i == 0` (we still need characters, but `s` has run out): **0** ways — impossible.
* **What happens if I implement this recursion directly?** It will be *correct*, but as hinted in Section 3, it will likely repeat identical sub-questions `count(i, j)` many times through different recursive paths — leading to extremely slow performance.
* **Can I make it faster?** Yes — since `count(i, j)` only ever depends on `i` and `j`, and there are only `(s.length()+1) × (t.length()+1)` possible combinations of these two numbers, we can **memoize** (remember every answer we've computed) or, even more directly, build a **2D DP table** bottom-up.
* **What information should I remember?** A 2D table `dp[i][j]` storing exactly the answer to `count(i, j)` for every `i` from `0` to `s.length()`, and every `j` from `0` to `t.length()`.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** Implement the recursive `count(i, j)` function *exactly* as reasoned in Section 7, with no memoization at all — just plain recursion.

**Why it works:** It directly implements the correct recursive logic: at each step, either use the matching character (if it matches) or skip the current `s` character.

**Why it's correct:** Every possible subsequence selection corresponds to a sequence of "use it" / "skip it" decisions as we walk through `s` from the end backward (or equivalently, front-to-back) — the recursion explores exactly this decision tree, and the base cases correctly terminate it.

```java
// Illustrative brute force (too slow for the given constraints) — for understanding only
class Solution {
    public int numDistinct(String s, String t) {
        return count(s, t, s.length(), t.length());
    }

    private int count(String s, String t, int i, int j) {
        if (j == 0) {
            return 1; // matched everything needed in t (possibly nothing left)
        }
        if (i == 0) {
            return 0; // t still needs characters, but s ran out
        }

        if (s.charAt(i - 1) == t.charAt(j - 1)) {
            // Option A: use this s character to match; Option B: skip it
            return count(s, t, i - 1, j - 1) + count(s, t, i - 1, j);
        } else {
            // Must skip this s character
            return count(s, t, i - 1, j);
        }
    }
}
```

```javascript
// Illustrative brute force (too slow for the given constraints) — for understanding only
class Solution {
    numDistinct(s, t) {
        const count = (i, j) => {
            if (j === 0) {
                return 1; // matched everything needed in t
            }
            if (i === 0) {
                return 0; // t still needs characters, but s ran out
            }

            if (s[i - 1] === t[j - 1]) {
                return count(i - 1, j - 1) + count(i - 1, j);
            } else {
                return count(i - 1, j);
            }
        };

        return count(s.length, t.length);
    }
}
```

**Time complexity:** In the worst case, this recursion can branch into up to `2^i` calls (every character has an independent "use or skip" decision when characters keep matching), giving roughly `O(2^n)` time — catastrophically slow for `s` and `t` up to length `1000`.

**Space complexity:** `O(n)` for the recursion call stack depth (not counting the exponential blow-up in total calls made).

---

## 9. Explain the Brute Force Code Line by Line

* `count(s, t, s.length(), t.length())` — kicks off the recursion asking "how many ways to match the *entire* `t` using the *entire* `s`?"
* `if (j == 0) return 1;` — base case: if there's nothing left of `t` to match, there's exactly one way to "match nothing" — do nothing further. This is true no matter how much of `s` remains.
* `if (i == 0) return 0;` — base case: if `s` has run out but `t` still needs `j > 0` more characters, it's simply impossible — 0 ways.
* `if (s.charAt(i - 1) == t.charAt(j - 1))` — compares the *last* character of the current `s`-prefix to the *last* character of the current `t`-prefix. (We look at the *end* of each prefix because that's the natural "next decision" as we shrink both prefixes from full length down to 0 — though you could equally reason from the front; both give the same final count.)
* `return count(s, t, i - 1, j - 1) + count(s, t, i - 1, j);` — if they match, we ADD both options together: "use this character" (both prefixes shrink) plus "skip this character" (only the `s` prefix shrinks, `t`'s requirement stays the same).
* `return count(s, t, i - 1, j);` (the `else` branch) — if they don't match, our *only* option is to skip this `s` character (it's structurally impossible for it to help match `t`'s last needed character), so we just shrink `i`.

---

## 10. Why Is the Brute Force Solution Not Ideal?

Imagine `s` and `t` are each 1000 characters long, and many characters happen to match repeatedly (like lots of the same letter). The recursion tree can branch exponentially — potentially trillions upon trillions of recursive calls, most of which are asking the **exact same question** (`count(i, j)` for some specific `i, j` pair) over and over again through different paths. With only about `1000 × 1000 = 1,000,000` *distinct* possible `(i, j)` pairs total, but potentially astronomically more *repeated* calls to the same pairs, this is a massive amount of wasted, duplicate work.

---

## 11. Find the Better Approach

> "Can we avoid recomputing the same sub-question over and over?"

Yes — since `count(i, j)` only ever depends on the two numbers `i` and `j`, and there are only about a million *distinct* combinations of them (for lengths up to 1000), we should compute each distinct `(i, j)` answer **exactly once**, and reuse it every time it's needed again.

```text
Brute Force Recursion:
Exponentially many repeated calls to count(i, j)
        ↓
Realize: count(i, j) only depends on i and j — finite, small number of distinct inputs
        ↓
Build a 2D table dp[i][j], filled in a smart order (small i,j first)
        ↓
Each dp[i][j] computed ONCE, using already-computed smaller entries
        ↓
O(n × m) total — no repeated work at all
```

---

## ⭐ Key Insight

### Before the insight
The recursive definition is correct, but it recomputes identical `(i, j)` sub-questions an enormous number of times, since the same smaller prefix-lengths get reached via many different sequences of "use/skip" decisions.

### The problem
Recomputing the same answer over and over is pure waste — if we could just remember each `(i, j)` answer the first time we compute it, all the repeated recursive calls would become instant lookups instead.

### The insight
**`count(i, j)` — the number of ways to match the first `j` characters of `t` using the first `i` characters of `s` — depends ONLY on the values of `i` and `j`, nothing else.** This means we can organize *all* possible `(i, j)` answers into a simple 2D table, and fill it in systematically: start with the smallest, simplest cases (`i=0` or `j=0`, which we know directly), and build up to larger `i, j` using the same recurrence relation from Section 7 — but now, every smaller answer we need is *already sitting in the table*, computed exactly once.

### After the insight
The exponential blow-up completely disappears. We do a fixed, predictable amount of work — one table cell at a time — for a total of `(s.length()+1) × (t.length()+1)` cells, each taking small, constant-time work to fill in.

---

## 13. Dry Run the Optimized Solution

Let's dry-run a small case: `s = "bag"`, `t = "ag"` (chosen to be small but still illustrate the mechanics, closely related to Example 2's `"bag"` piece).

We build a table `dp[i][j]`, where `i` ranges `0..3` (length of `s`) and `j` ranges `0..2` (length of `t`). `dp[i][j]` = ways to form the first `j` characters of `t` using the first `i` characters of `s`.

**Base row (`j = 0`):** matching "nothing" is always 1 way, regardless of `i`. So `dp[0][0] = dp[1][0] = dp[2][0] = dp[3][0] = 1`.

**Base column (`i = 0`, `j > 0`):** matching *something* using *no characters of `s`* is always impossible: `dp[0][1] = dp[0][2] = 0`.

Now fill in the rest, row by row (`i` from 1 to 3), left to right (`j` from 1 to 2). Recall `s = "bag"` means `s.charAt(0)='b', s.charAt(1)='a', s.charAt(2)='g'`. And `t = "ag"` means `t.charAt(0)='a', t.charAt(1)='g'`.

| i (using s[0..i-1]) | j=1 (t[0..0]="a") | j=2 (t[0..1]="ag") |
|---|---|---|
| 0 | 0 | 0 |
| 1 (s="b") | ? | ? |
| 2 (s="ba") | ? | ? |
| 3 (s="bag") | ? | ? |

**Row i=1 (s prefix = "b", last char s[0]='b'):**
* `dp[1][1]`: compare `s.charAt(0)='b'` to `t.charAt(0)='a'` — no match. So `dp[1][1] = dp[0][1] = 0`.
* `dp[1][2]`: compare `s.charAt(0)='b'` to `t.charAt(1)='g'` — no match. So `dp[1][2] = dp[0][2] = 0`.

**Row i=2 (s prefix = "ba", last char s[1]='a'):**
* `dp[2][1]`: compare `s.charAt(1)='a'` to `t.charAt(0)='a'` — **match!** So `dp[2][1] = dp[1][0] + dp[1][1] = 1 + 0 = 1`.
* `dp[2][2]`: compare `s.charAt(1)='a'` to `t.charAt(1)='g'` — no match. So `dp[2][2] = dp[1][2] = 0`.

**Row i=3 (s prefix = "bag", last char s[2]='g'):**
* `dp[3][1]`: compare `s.charAt(2)='g'` to `t.charAt(0)='a'` — no match. So `dp[3][1] = dp[2][1] = 1`.
* `dp[3][2]`: compare `s.charAt(2)='g'` to `t.charAt(1)='g'` — **match!** So `dp[3][2] = dp[2][1] + dp[2][2] = 1 + 0 = 1`.

Final answer: `dp[3][2] = 1`. Indeed, `"bag"` contains `"ag"` as a subsequence in exactly **1** way (positions 1 and 2). ✔️ Makes sense — there's only one `'a'` and one `'g'` in `"bag"`, so no ambiguity.

---

## 14. Optimized Code

```java
class Solution {
    public int numDistinct(String s, String t) {
        int m = s.length();
        int n = t.length();

        int[][] dp = new int[m + 1][n + 1];

        // Base case: matching an empty t is always 1 way, for any prefix of s
        for (int i = 0; i <= m; i++) {
            dp[i][0] = 1;
        }
        // Base case: matching a non-empty t using an empty s is 0 ways
        // (dp[0][j] for j > 0 defaults to 0 automatically in a fresh Java array)

        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (s.charAt(i - 1) == t.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        return dp[m][n];
    }
}
```

```javascript
class Solution {
    numDistinct(s, t) {
        const m = s.length;
        const n = t.length;

        // Create (m + 1) x (n + 1) 2D array filled with 0
        const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

        // Base case: matching an empty t is always 1 way, for any prefix of s
        for (let i = 0; i <= m; i++) {
            dp[i][0] = 1;
        }

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (s[i - 1] === t[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
                } else {
                    dp[i][j] = dp[i - 1][j];
                }
            }
        }

        return dp[m][n];
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `int m = s.length(); int n = t.length();` — store both lengths for convenience.
* `int[][] dp = new int[m + 1][n + 1];` — create our 2D table. We use size `m+1` and `n+1` (not just `m` and `n`) so that we have a valid row/column for representing "using **zero** characters" of each string — this is a very common DP setup trick, giving us room for the base cases.
* The `for (int i = 0; i <= m; i++) dp[i][0] = 1;` loop — fills in the entire "matching an empty `t`" column: no matter how much of `s` we're allowed to use (including none at all), there's always exactly 1 way to match "nothing" (just don't pick anything).
* We don't need an explicit loop for `dp[0][j] = 0` (for `j > 0`) because Java automatically initializes all `int` array entries to `0` by default — this is exactly the value we want there anyway.
* The nested `for (int i = 1; i <= m; i++) { for (int j = 1; j <= n; j++) { ... } }` loops — fill in the rest of the table, row by row (increasing `i`), and within each row, column by column (increasing `j`). This order guarantees that whenever we compute `dp[i][j]`, the values `dp[i-1][j-1]` and `dp[i-1][j]` it depends on have *already* been computed in a previous row.
* `if (s.charAt(i - 1) == t.charAt(j - 1))` — note the `-1`: since `dp[i][j]` represents using the first `i` characters of `s` (indices `0` to `i-1`), the "current"/"last" character being considered is at index `i-1`, not `i`. Same idea for `t.charAt(j-1)`.
* `dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];` — if the characters match: add the "use this character" count (`dp[i-1][j-1]`, both prefixes shrink) and the "skip this character" count (`dp[i-1][j]`, only `s`'s prefix shrinks).
* `dp[i][j] = dp[i - 1][j];` (in the `else`) — if they don't match, we're forced to skip this `s` character; the count is exactly whatever it was without this character available.
* `return dp[m][n];` — after filling the entire table, the answer to the *original* question ("match the full `t` using the full `s`") is sitting at `dp[m][n]`.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`s="rabbbit", t="rabbit"`. Building the full `8×7` table by hand is tedious, but following the exact same mechanics as the dry run in Section 13 (matching characters trigger the "add both options" rule; the three consecutive `b`s in `s` against the two needed `b`s in `t` is exactly where the branching that produces "3" comes from) → Output: `3` ✔️

### Example 2 — Different Case
`s="babgbag", t="bag"` → following the same table-filling process → Output: `5` ✔️ (This example has *more* structural ambiguity than Example 1 — there are two separate `'b'`s that could each pair with either of two `'a'`s and so on, compounding into 5 total distinct selections.)

### Example 3 — Edge Case (t longer than s)
`s = "ab", t = "abc"`. Here `n = 3 > m = 2`. It's structurally impossible to select 3 characters from a string of only 2 characters. Following the algorithm: eventually `dp[2][3]` would need contributions from `dp[1][2]` and `dp[1][3]`, both of which trace back to needing more `t`-characters than `i` allows — everything bottoms out at `0`. Output: `0` (matches intuition — impossible when `t` is longer than `s`).

---

## 17. Edge Cases

* **`t` longer than `s`** → answer is always `0` (impossible to pick more characters than exist).
* **`t` is empty** — not possible per the given constraints (`1 <= t.length`), but conceptually, this would trivially be `1` way (matching nothing).
* **`s` and `t` are identical** → there's exactly `1` way (use every character of `s`, no choices possible anywhere along the way).
* **`s` has no characters matching `t` at all** → answer is `0` (the `dp` table's matching branches never trigger; everything just cascades down to `dp[i][j] = dp[i-1][j]`, and since `dp[0][j] = 0` for any `j > 0`, everything stays `0`).
* **Long runs of the same repeated character in both `s` and `t`** (like Example 1's `bbb` vs `bb`) → this is exactly where the "add both options" branch does real, non-trivial work, producing counts bigger than 1.
* **Very large strings (`length` up to `1000` each)** → our `O(m×n)` DP table has up to `1,001 × 1,001 ≈ 1` million cells — very manageable, unlike the brute force's exponential blow-up.
* **Answer could be large, but fits in a 32-bit signed integer** — the problem statement guarantees this, so plain `int` arithmetic (no overflow concerns) is safe as specified.

---

## 18. Time Complexity

**What is time complexity?** It's a way of estimating how the total work grows as input size grows, using a general trend rather than a stopwatch.

```text
Brute Force (plain recursion, no memoization):
O(2^n) — exponential, due to massive repeated recomputation

Optimized (2D DP table):
O(m × n) — where m = s.length(), n = t.length()
```

**Why:** In the DP version, we fill in each of the `(m+1) × (n+1)` table cells exactly once, and computing each cell takes only a small, constant amount of work (one character comparison, one or two additions). For `m = n = 1000`, that's about `1,001 × 1,001 ≈ 1` million cells — each cheap — totaling roughly a million basic operations, which any modern computer handles in a tiny fraction of a second. Compare this to the brute force's potential `2^1000` calls — a number so astronomically large it's meaningless to even compare directly to "a million"; DP transforms an utterly infeasible computation into a trivially fast one.

---

## 19. Space Complexity

* The `dp` table has `(m+1) × (n+1)` entries, each a plain `int`.

So extra space used is `O(m × n)` — for `m = n = 1000`, that's about 1 million integers, comfortably within typical memory limits. (As a further optimization, since each row `i` only ever depends on row `i-1`, you could shrink this to `O(n)` space by keeping just "the previous row" and "the current row" — but the full 2D table, as shown here, is clearer for learning and is already efficient enough for this problem's constraints.)

---

## 20. Common Mistakes Beginners Make

* ❌ **"A subsequence must be a continuous block of characters."**
  * ✅ That's a *substring*, not a *subsequence*. A subsequence can skip characters, as long as the remaining ones keep their relative left-to-right order.
* ❌ **"Since the final spelled-out result looks the same, different selections using the same set of characters shouldn't count separately."**
  * ✅ The problem explicitly counts *distinct selections* (which specific positions in `s` were used), not distinct-looking output strings — this is exactly why repeated characters (like the three `b`s) create multiple valid counts even though they "look the same" once spelled out.
* ❌ **"If the characters don't match, I should still consider 'using' this `s` character somehow."**
  * ✅ If `s.charAt(i-1) != t.charAt(j-1)`, that `s` character *cannot* possibly be the one matching `t`'s current needed character — the only sensible option is to skip it, i.e., `dp[i][j] = dp[i-1][j]`.
* ❌ **"When characters DO match, I should only take the 'use it' option (`dp[i-1][j-1]`), since that seems like the more direct match."**
  * ✅ You must ALSO include the 'skip it' option (`dp[i-1][j]`), even when characters match — because a *later* matching character in `s` might be the one this particular position in `t` should actually pair with, in a different valid selection. Forgetting this "skip it" addition undercounts the true number of ways (this is precisely why problems like Example 1, with repeated `b`s, have more than 1 answer).
* ❌ **"I'll just implement the recursive definition directly and hope it's fast enough."**
  * ✅ For strings up to length 1000, plain recursion without memoization is exponentially too slow — you must use the 2D DP table (or equivalent memoized recursion) to make this run in reasonable time.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Number of distinct subsequences/ways to form..."
"Count the number of ways to match/transform one sequence into another"
Two strings (or sequences) being compared, with a recursive relationship
  depending on whether their "current" characters match
"Edit distance," "longest common subsequence," and similar two-string DP problems
  share this exact (i, j) 2D table structure
```

Whenever you're comparing **two sequences** and need to count ways (or find some optimal value) based on how their characters align, and you notice the direct recursive definition **re-asks the same `(i, j)` sub-question repeatedly**, think: **2D DP table, indexed by position in each sequence.**

---

## 22. Interview Thinking

```text
1. Understand the input    → two strings, s and t
2. Understand the output   → count of distinct subsequences of s that equal t
3. Try brute force         → direct recursion on (i, j): match-or-skip at each step
4. Find what makes it slow → exponential repeated recomputation of identical (i, j) calls
5. Identify repeated work  → count(i, j) depends ONLY on i and j — finite, small state space
6. What can be stored?     → a 2D table dp[i][j] holding every distinct (i, j) answer
7. Optimize                → fill the table bottom-up, smallest i/j first, using the
                              same recurrence as the brute-force recursion
8. Check edge cases        → t longer than s, s equals t, no matches at all, repeated characters
9. Analyze complexity      → O(m×n) time and space, instead of O(2^n)
```

Applied here: the "aha" is recognizing that the brute-force recursion's *shape* was already exactly right — the only problem was re-doing identical work; converting it into a systematically-filled table removes all the waste while keeping the exact same logic.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why do we need `dp[i][0] = 1` for *every* `i`, rather than just `dp[0][0] = 1`?
2. If `s.charAt(i-1) != t.charAt(j-1)`, why is it wrong to write `dp[i][j] = dp[i-1][j-1]` instead of `dp[i][j] = dp[i-1][j]`?
3. In Example 1 (`s="rabbbit", t="rabbit"`), which specific cell(s) in the DP table would you expect to show the branching factor of "3," and roughly why?

<br>

### Answer to Mini Challenge

1. `dp[i][0]` represents "using the first `i` characters of `s` to match an empty `t`" — this is possible in exactly 1 way (select nothing) *regardless* of how many characters of `s` are available, since you're never forced to use any of them. Only setting `dp[0][0]=1` would leave every other `dp[i][0]` at its default `0`, which would incorrectly suggest it's impossible to "match nothing" once `s` has any characters at all.
2. `dp[i-1][j-1]` represents "one character was successfully consumed from both `s` and `t`," which is only valid when those two characters actually matched. If they didn't match, pretending they did (by using `dp[i-1][j-1]`) would incorrectly count selections where a mismatched character was used to fill a spot in `t` it can't actually spell correctly. The correct move when they don't match is to skip the `s` character entirely, i.e., `dp[i][j] = dp[i-1][j]` (t's requirement is unchanged, only s's available prefix shrinks).
3. The branching happens around the cells corresponding to the three `b`s in `s` (positions 2, 3, 4) each being checked against `t`'s `b` positions — every time `s.charAt(i-1) == t.charAt(j-1) == 'b'` triggers the "add both options" rule, it's compounding possibilities from the multiple available `b`s; by the time the table reaches the cell corresponding to "all of s" and "all of t," these compounding additions accumulate to exactly `3`.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Count the number of distinct ways to select a subsequence of `s` (preserving order) that exactly equals `t`.

### 🔑 Main Idea
Define `dp[i][j]` = ways to form the first `j` characters of `t` using the first `i` characters of `s`; if the current characters match, add both the "use it" and "skip it" options; otherwise, only "skip it" is possible — fill this table bottom-up to avoid the brute force's exponential repeated work.

### ⚙️ Algorithm
1. Create a `(m+1) × (n+1)` table `dp`.
2. Set `dp[i][0] = 1` for all `i` (matching empty `t` is always 1 way); leave `dp[0][j] = 0` for `j > 0` (default).
3. For each `i` from 1 to `m`, each `j` from 1 to `n`: if `s.charAt(i-1) == t.charAt(j-1)`, `dp[i][j] = dp[i-1][j-1] + dp[i-1][j]`; otherwise `dp[i][j] = dp[i-1][j]`.
4. Return `dp[m][n]`.

### ⏱️ Complexity
* **Time:** `O(m × n)`
* **Space:** `O(m × n)` (reducible to `O(n)` with a rolling-row optimization)

### 🎯 Pattern to Remember
Two-sequence "count the ways" or "find the optimal alignment" problems, where naive recursion re-asks identical `(i, j)` sub-questions, call for a 2D DP table indexed by position in each sequence.

---

## 25. Beginner Quiz

1. **(Understanding)** What's the difference between a subsequence and a substring, and why does that distinction matter for this problem?
2. **(Basic concept)** What does `dp[i][j]` represent in our table, in plain words?
3. **(Logic)** Why do we ADD two values together (`dp[i-1][j-1] + dp[i-1][j]`) specifically when the current characters match, rather than just picking one of them?
4. **(Dry run)** For `s = "aa"`, `t = "a"`, build the small DP table by hand and find the final answer. (Hint: how many single `'a'`s could you "choose" from `s`?)
5. **(Complexity/pattern)** Why does the brute-force recursive solution become exponentially slow, and what specific property of `count(i, j)` (mentioned in the Key Insight) is what allows the DP table to fix this?
