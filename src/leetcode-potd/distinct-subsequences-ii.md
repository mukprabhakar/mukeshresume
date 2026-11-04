---
title: "940. Distinct Subsequences II"
slug: 'distinct-subsequences-ii'
date: '2026-09-07'
difficulty: 'Hard'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(1)'
tags: ['Dynamic Programming', 'String', 'Subsequence', 'Modulo Arithmetic', 'Array']
excerpt: "Count the number of distinct non-empty subsequences of a string modulo 10^9 + 7 using 1D dynamic programming and a 26-letter running count replace strategy."
---

# 940. Distinct Subsequences II

This problem is a different flavor of "count subsequences" than #115 — here there's only **one** string, and the whole challenge is **avoiding double-counting duplicates**. It introduces a new, very elegant DP trick. Let's build it from zero.

---

## 1. Problem in Very Simple Language

You're given a single string `s`.

A **subsequence** is what you get by deleting zero or more characters from `s` (without rearranging what's left) — so the remaining characters still appear in their original left-to-right order.

Different *positions* deleted can sometimes produce the exact **same resulting string**. For example, in `"aba"`, picking "the `a` at position 0" gives you the string `"a"`, and picking "the `a` at position 2" *also* gives you the string `"a"` — these are the **same subsequence value**, even though they came from different positions.

Your job: count how many **distinct** (i.e., different-looking) non-empty subsequence strings can be formed from `s` — counting each unique resulting string **only once**, no matter how many different ways there are to produce it.

Since this count can get huge, return it **modulo `10^9 + 7`** (a big prime number used to keep the answer within normal integer range).

* **What's given:** a string `s`.
* **What to find:** the number of *distinct* non-empty subsequence strings.
* **What to return:** that count, mod `10^9 + 7`.

---

## 2. Real-Life Analogy

Imagine a bag of scrabble tiles laid out in a row, spelling `s`. You can pick any subset of tiles (keeping their left-to-right order) to spell a "mini-word." The catch: if two different picks spell out the exact same mini-word (like picking the 1st tile vs. the 3rd tile, both letter `'a'`), that only counts as **one** distinct mini-word in your final tally, not two. You want the total number of genuinely *different-looking* mini-words you could spell this way (not counting the empty word).

---

## 3. Important Programming Concepts I Need First

### Subsequence (recap from #115)
* **Concept:** Delete some characters, keep the rest in order.
* **Why we need it:** Same core definition as before — but now we're comparing subsequences to each other for *equality*, not comparing against a fixed target string.

### Distinctness / Deduplication
* **Concept:** Counting only *unique* results, even when multiple different processes could produce the same result.
* **Example:** If both "pick position 0" and "pick position 2" give you the string `"a"`, that's one distinct result, not two.
* **Why we need it:** This is the entire crux of the problem — #115 counted *ways*, this problem counts *distinct results*.

### Modulo Arithmetic
* **Concept:** `x % m` gives the remainder when `x` is divided by `m`. When numbers in a calculation could get astronomically large, we take `% m` at every step to keep numbers small and manageable, while still being able to reconstruct "the answer, if it were computed exactly, then reduced mod m at the very end" — because modulo is compatible with addition (`(a+b) % m == ((a%m)+(b%m)) % m`).
* **Example:** `(7 + 5) % 3 = 12 % 3 = 0`. Also, `(7%3 + 5%3) % 3 = (1+2)%3 = 0` — same answer either way.
* **Why we need it:** The true count of distinct subsequences can grow exponentially with string length (up to 2000 characters!) — far too big for a normal integer — so we must take `% (10^9+7)` throughout, as the problem explicitly asks.

### Array indexed by letter (a "26-box" array)
* **Concept:** Since there are only 26 lowercase English letters, we can use a small fixed-size array of length 26, where index `0` represents `'a'`, index `1` represents `'b'`, ..., index `25` represents `'z'`. We convert a character to its index using `ch - 'a'`.
* **Example:** `'c' - 'a' = 2`, so `'c'` maps to index 2.
* **Why we need it:** We'll track, for *each letter*, some running count associated specifically with subsequences that *end* in that letter.

### Dynamic Programming (recap from #115), applied differently here
* **Concept:** Build up the answer incrementally, one character of `s` at a time, using previously-computed smaller results — but this time, our "table" isn't 2D (indexed by two string positions); it's a small 1D array of size 26 (indexed by ending letter), updated as we scan through `s`.
* **Why we need it:** As we'll see, tracking "how many distinct subsequences end in each specific letter" turns out to be exactly the right piece of information to carry forward.

---

## 4. Understand the Input

Take Example 2:
```text
s = "aba"
```

* Characters: index 0 = `'a'`, index 1 = `'b'`, index 2 = `'a'`.
* We want: every distinct non-empty string that can be formed by deleting some characters (keeping order), counted once each.
* Why does having **two** `'a'`s matter? Because it creates the *opportunity* for duplicate results (like getting `"a"` from either position 0 or position 2) — and it's exactly this duplication that the algorithm must correctly avoid over-counting.

---

## 5. Understand the Output

Output: `6`

The 6 distinct subsequences are: `"a", "b", "ab", "aa", "ba", "aba"`.

* Notice `"a"` appears here **once** in this list, even though you could form the string `"a"` in *two* different ways (using position 0's `a`, or position 2's `a`). We only count it once.
* Similarly, `"aa"` can be formed in only one way here (positions 0 and 2 — there's no other pair of `a`s), so no duplication issue there.
* The *total number of raw ways* to form subsequences (counting position-based ways separately, like problem #115's spirit) would be larger than 6 — but we specifically want *distinct resulting strings*, which is smaller.

---

## 6. Solve the Example Manually

Let's manually build up the distinct subsequences of `s = "aba"`, one character at a time, and see how a clean formula emerges.

**After processing just `"a"` (first character):**
Distinct non-empty subsequences so far: `{"a"}`. Count = 1.

**After processing `"ab"` (first two characters):**
Every subsequence we can form now either (a) doesn't use this new `'b'` at all (so it's one of our old subsequences: `{"a"}`), or (b) uses this new `'b'`, either as "just `'b'` alone" or as "some old subsequence, with `'b'` appended to its end" (since `'b'` is the newest, rightmost character, appending it to the end of any previously valid subsequence gives another valid subsequence).

So the *new* subsequences created by adding `'b'` are: `{"b"}` (b alone) and `{"a" + "b"} = {"ab"}` (appending b to our one existing subsequence `"a"`).

Combined with the old ones: `{"a", "b", "ab"}`. Count = 3.

**After processing `"aba"` (all three characters):**
Now we add the second `'a'`. Following the same logic: the *new* subsequences are "this `'a'` alone" (`{"a"}` — but wait, we already have `"a"` in our set from before!) plus "every existing subsequence with this `'a'` appended": `{"a"+"a", "b"+"a", "ab"+"a"} = {"aa", "ba", "aba"}`.

Here's the crucial subtlety: adding "this `'a'` alone" would just re-create `"a"`, which we **already have** — so it does NOT add anything new to our distinct set. But the *appending* operations (`"aa"`, `"ba"`, `"aba"`) are all brand new distinct strings we haven't seen before.

Combined set: `{"a", "b", "ab"} ∪ {"aa", "ba", "aba"} = {"a", "b", "ab", "aa", "ba", "aba"}`. Count = **6**. ✔️ matches!

This manual walkthrough reveals the key mechanic: each new character potentially adds "itself alone" PLUS "itself appended to every existing distinct subsequence" — but we must be careful not to double-count when "itself alone" collides with something already present.

---

## 7. Think Like a Programmer

* **What do I know?** Processing `s` left to right, each new character can extend every subsequence formed so far, plus stand alone by itself.
* **What do I need to find?** The total count of *distinct* resulting strings.
* **What can I try?** Keep a running set of "all distinct subsequences formed using the prefix of `s` processed so far." When a new character `ch` arrives, the new total set = (old set) ∪ ({ch} ∪ {every old subsequence + ch appended}).
* **What happens if I try to literally store all these strings in a Set?** With `s` up to length 2000, the *number* of distinct subsequences can be enormous (up to close to `2^2000` in the worst case, though duplicates from repeated letters cut this down) — actually storing and comparing full strings would be catastrophically slow and memory-heavy.
* **Can I make it faster?** Yes — notice we don't actually need to know the *strings themselves*, just the **count**. And here's the beautiful trick: **when a new character `ch` arrives, "itself alone" plus "itself appended to every existing subsequence" is EXACTLY equal to `1 + (total count of distinct subsequences so far)`** — because appending `ch` to every existing distinct subsequence produces that many *new*, still-distinct strings (they all end in `ch` now, and everything before the final `ch` was already distinct, so the whole new strings remain pairwise distinct from each other), plus the string `"ch"` alone is one more possibility.
* **But what about the double-counting risk (like `"a"` reappearing) seen in Section 6?** This is the subtle part: if `ch` has appeared **before**, then some of "the new strings ending in `ch`" might collide with strings we already had *ending in `ch`* from an earlier appearance. The fix: track, **for each letter separately**, how many distinct subsequences currently end in that specific letter. When `ch` shows up again, the *entire* previous count of "subsequences ending in `ch`" gets **replaced** (not added to) by the new count — because every subsequence that used to end in the *old* `ch` can now be reformed using *this newer* `ch` instead (giving the identical string), so the old count becomes redundant/superseded, not something to add on top of.
* **What information should I remember?** A small array `end[26]`, where `end[c]` = "number of distinct subsequences currently ending in letter `c`." The overall total distinct count is just the sum of all 26 entries.

---

## 8. Start With the Brute Force Solution

Since actually enumerating and storing every distinct subsequence string would be infeasible for `s` up to length 2000 (astronomically many possible strings), there isn't a *reasonable* brute force to fully implement here the way earlier problems had one — but let's write a **small-scale conceptual brute force** (correct only for tiny inputs) to firmly ground the correct logic, using an actual `Set<String>`.

**Brute force idea:** Maintain a `Set<String>` of all distinct subsequences seen so far. For each new character, generate "itself alone" plus "itself appended to every current set member," and add all of these into the set (a `Set` automatically handles deduplication for us).

```java
// Illustrative brute force (works only for tiny s; too slow/memory-heavy for s up to 2000)
import java.util.*;

class Solution {
    public int distinctSubseqII(String s) {
        Set<String> seen = new HashSet<>();

        for (char ch : s.toCharArray()) {
            Set<String> toAdd = new HashSet<>();
            toAdd.add(String.valueOf(ch)); // this character alone
            for (String existing : seen) {
                toAdd.add(existing + ch);  // this character appended to every existing one
            }
            seen.addAll(toAdd);
        }

        return seen.size() % 1_000_000_007;
    }
}
```

```javascript
// Illustrative brute force (works only for tiny s; too slow/memory-heavy for s up to 2000)
class Solution {
    distinctSubseqII(s) {
        const seen = new Set();

        for (const ch of s) {
            const toAdd = new Set();
            toAdd.add(ch); // this character alone
            for (const existing of seen) {
                toAdd.add(existing + ch); // this character appended to every existing one
            }
            for (const str of toAdd) {
                seen.add(str);
            }
        }

        return seen.size % 1000000007;
    }
}
```

**Why it works (for small inputs):** It directly simulates exactly the process described in Section 6, and relies on `HashSet`'s built-in deduplication to avoid counting the same string twice.

**Time/space complexity:** Both time and space are proportional to the *number of distinct subsequences itself*, which can be exponential in the length of `s` — utterly infeasible once `s` gets anywhere close to length 2000 (way too many strings to store, and each string comparison/hashing itself takes time proportional to string length).

---

## 9. Explain the Brute Force Code Line by Line

* `Set<String> seen = new HashSet<>();` — will hold every distinct subsequence string found so far.
* The `for (char ch : s.toCharArray())` loop — processes each character of `s` in order.
* `toAdd.add(String.valueOf(ch));` — the new character, by itself, is always a candidate new subsequence.
* The inner `for (String existing : seen)` loop — for every subsequence already found, we consider appending the new character to its end, forming a new candidate.
* `seen.addAll(toAdd);` — merge all these candidates into our running set; duplicates (strings already present) are automatically ignored by the `Set`.
* `return seen.size() % 1_000_000_007;` — the final count of distinct non-empty subsequences, reduced modulo the required value.

---

## 10. Why Is the Brute Force Solution Not Ideal?

For a string like `"abcdefghij..."` with many distinct characters, the number of distinct subsequences roughly doubles with each new distinct character (similar to counting subsets), potentially reaching close to `2^2000` — a number so large it dwarfs the number of atoms in the universe many times over. There's no way to *store* that many actual strings; we need a method that computes the **count** directly, without ever materializing the strings themselves.

---

## 11. Find the Better Approach

> "Can we track just the COUNT, without ever storing actual strings?"

Yes — this is exactly the insight from Section 7:

```text
Brute Force:
Actually store every distinct string in a Set
        ↓
Exponentially many strings — infeasible to store
        ↓
Realize: we only need COUNTS, not the actual strings
        ↓
Realize: "append ch to everything" = "double the current total, plus 1" (roughly)
        ↓
Realize: repeated letters cause OVER-counting unless we track per-letter contributions
        ↓
Track end[c] = count of distinct subsequences ending in letter c, for each of 26 letters
        ↓
When letter ch reappears, REPLACE end[ch] (don't add to it) — avoids double-counting
        ↓
O(n) or O(26n) total — no strings stored at all
```

---

## ⭐ Key Insight

### Before the insight
It seems like we need to track actual subsequence strings to know which ones are duplicates of each other.

### The problem
Storing strings is completely infeasible at this scale — we need a way to detect and avoid duplicates using *only numbers*.

### The insight
**Every distinct subsequence has a unique "last character used" and a unique "identity" before that last character.** So if we track, separately for each of the 26 letters, "how many distinct subsequences currently end in this letter," we can compute:
* The grand total of *all* distinct subsequences = sum of all 26 `end[c]` values.
* When a new character `ch` arrives: the number of *new* distinct subsequences ending in `ch`, as of right now, is `1 + (grand total before processing this ch)` — the `+1` accounts for "`ch` all by itself," and the `grand total` accounts for "append `ch` to every distinct subsequence that existed just before this point," which (crucially) are automatically still pairwise distinct from each other once you tack the same final letter onto all of them.
* This freshly computed value **completely replaces** the old `end[ch]` (rather than adding to it) — because any *older* subsequence that used to end in an earlier occurrence of `ch` can now be reproduced using *this* occurrence instead, making the old tally obsolete/redundant, not something to stack on top of.

### After the insight
A single pass through `s`, maintaining just 26 running numbers (plus a running total), correctly and efficiently computes the exact distinct count — no strings, no exponential blow-up, no risk of double-counting.

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 3**: `s = "aaa"`.

We maintain `end[26]` (all start at 0) and `total = 0` (which is just the sum of `end[]`, tracked incrementally for convenience).

**Process 1st `'a'`:**
* New count for subsequences ending in `'a'`: `1 + total(0) = 1`.
* Update: `end['a'] = 1` (was 0, now replaced with 1).
* New total: `total = total - old_end['a'](0) + new_end['a'](1) = 0 - 0 + 1 = 1`.

**Process 2nd `'a'`:**
* New count for subsequences ending in `'a'`: `1 + total(1) = 2`.
* Update: `end['a'] = 2` (was 1, now replaced with 2).
* New total: `total = 1 - 1 + 2 = 2`.

**Process 3rd `'a'`:**
* New count for subsequences ending in `'a'`: `1 + total(2) = 3`.
* Update: `end['a'] = 3` (was 2, now replaced with 3).
* New total: `total = 2 - 2 + 3 = 3`.

Final `total = 3`. ✔️ matches (the 3 distinct subsequences are `"a"`, `"aa"`, `"aaa"`)!

Notice how the "replace, don't add" rule for `end['a']` at each step is exactly what prevents us from over-counting — each time, the entire previous contribution from `'a'` is subsumed into the fresh, larger count.

---

## 14. Optimized Code

```java
class Solution {
    public int distinctSubseqII(String s) {
        final int MOD = 1_000_000_007;
        int[] end = new int[26]; // end[c] = distinct subsequences ending in letter c
        int total = 0;           // running sum of all end[c] values

        for (char ch : s.toCharArray()) {
            int idx = ch - 'a';

            // New count of subsequences ending in this exact character:
            // "ch alone" (the +1) plus "ch appended to every existing distinct subsequence" (total)
            int newEndForCh = (1 + total) % MOD;

            // Update the running total: remove this letter's OLD contribution,
            // add in its NEW contribution
            total = (total - end[idx] + newEndForCh + MOD) % MOD;

            end[idx] = newEndForCh;
        }

        return total;
    }
}
```

```javascript
class Solution {
    distinctSubseqII(s) {
        const MOD = 1000000007;
        const end = new Array(26).fill(0); // end[c] = distinct subsequences ending in letter c
        let total = 0;                     // running sum of all end[c] values

        for (let i = 0; i < s.length; i++) {
            const idx = s.charCodeAt(i) - 97; // 'a'.charCodeAt(0) is 97

            // New count of subsequences ending in this exact character:
            // "ch alone" (the +1) plus "ch appended to every existing distinct subsequence" (total)
            const newEndForCh = (1 + total) % MOD;

            // Update running total: subtract old contribution and add new contribution
            total = (total - end[idx] + newEndForCh + MOD) % MOD;

            end[idx] = newEndForCh;
        }

        return total;
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `final int MOD = 1_000_000_007;` — the modulus specified by the problem; we'll apply `% MOD` throughout to keep numbers bounded.
* `int[] end = new int[26];` — our 26-letter tracker: `end[c]` will always represent "the current count of distinct subsequences that end with letter `c`," using everything processed so far.
* `int total = 0;` — the running grand total of *all* distinct non-empty subsequences so far (equivalently, `sum(end[0..25])`, but we maintain it incrementally rather than re-summing every time, for efficiency).
* The `for (char ch : s.toCharArray())` loop — processes each character of `s`, left to right, exactly once.
* `int idx = ch - 'a';` — converts the character to its 0-25 array index.
* `int newEndForCh = (1 + total) % MOD;` — this is the heart of the insight from Section 12: the fresh count of "distinct subsequences ending in `ch`," accounting for both "`ch` alone" (the `1`) and "every previously-existing distinct subsequence, with `ch` now appended" (the `total` term, since appending the *same* final character to all of them keeps them pairwise distinct from each other, as their "everything before this last character" parts were already all different).
* `total = (total - end[idx] + newEndForCh + MOD) % MOD;` — this line carefully updates the grand total: we **remove** this letter's *old* contribution (`end[idx]`, whatever it was before, possibly `0` if this is `ch`'s first appearance) and **add in** its brand-new contribution (`newEndForCh`). The extra `+ MOD` before the final `% MOD` is a standard safety trick in modular arithmetic to prevent the intermediate value from accidentally going negative (since Java's `%` on a negative number can return a negative result, and subtracting `end[idx]` could momentarily make the running expression dip below zero before the mod wraps it back around correctly).
* `end[idx] = newEndForCh;` — finally, we overwrite (not add to!) this letter's tracked count with the fresh value — reflecting that any older subsequences ending in this letter are now effectively superseded by this newer, larger count.
* After the loop finishes, `total` holds the exact answer: the count of all distinct non-empty subsequences, already reduced modulo `10^9+7`.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`s = "abc"` (all distinct characters, no repeats):
* Process `'a'`: `newEnd = 1+0=1`. `end['a']=1`. `total=0-0+1=1`.
* Process `'b'`: `newEnd = 1+1=2`. `end['b']=2`. `total=1-0+2=3`.
* Process `'c'`: `newEnd = 1+3=4`. `end['c']=4`. `total=3-0+4=7`.
* Output: `7` ✔️ (matches: `"a","b","c","ab","ac","bc","abc"` — exactly 7)

### Example 2 — Different Case
`s = "aba"` → dry-ran conceptually in Sections 6 and matches the mechanics shown in Section 13 for `"aaa"` (just with a `'b'` in between) → Output: `6` ✔️

### Example 3 — Edge Case
`s = "aaa"` → dry-ran fully in Section 13 → Output: `3` ✔️

---

## 17. Edge Cases

* **Single character (`s` has length 1)** → `end[that letter] = 1+0 = 1`, `total = 1` → correctly returns `1` (the one-character string itself is the only distinct non-empty subsequence).
* **All characters identical** (like `"aaa"` or longer runs) → as shown, the count grows linearly-ish in a specific pattern (`1, 2, 3, ...` for the running `end` value of that one letter, since `total` always equals `end[that letter]` when only one letter has ever appeared) — specifically, for a run of `k` identical characters, the distinct subsequence count is exactly `k` (just "the letter repeated 1 time," "repeated 2 times," ..., "repeated k times").
* **All characters distinct** (like `"abc...z"`) → the count grows like `2^n - 1` (every non-empty subset of positions gives a genuinely distinct string, since there's no way to confuse which letters were used) — our formula naturally produces this, since `total` roughly doubles (plus 1) with each brand-new letter.
* **Very long strings (`length` up to 2000)** with many repeated letters scattered throughout → handled correctly and efficiently, since the "replace, don't add" rule for `end[idx]` correctly accounts for however many times each letter has reappeared, no matter the pattern.
* **Modulo wraparound** — since `s` can be up to length 2000, and distinct-subsequence counts can grow roughly exponentially before the modulus "kicks in" conceptually, correctly applying `% MOD` (including the `+ MOD` safety pad before subtracting) at every step is essential to avoid incorrect negative or overflowed intermediate values.

---

## 18. Time Complexity

**What is time complexity?** An estimate of how much work grows as the input grows, using a general scaling trend.

```text
Brute Force (storing actual strings in a Set):
Potentially O(2^n) time and space — completely infeasible for n up to 2000

Optimized (26-letter running counts):
O(n) — one pass through s, constant work (26-sized array lookups/updates) per character
```

**Why:** Our optimized solution touches each character of `s` exactly once, and for each character does only a small, fixed amount of work (one array lookup, a couple of additions/subtractions, one array write) — completely independent of how large the distinct-subsequence count actually is. For `n = 2000`, that's a trivial 2000 iterations, regardless of whether the "true" distinct count is small or astronomically large — we never need to touch that magnitude of work directly, since we're only ever manipulating a handful of numbers.

---

## 19. Space Complexity

* `end[26]` — a small, fixed-size array, regardless of how long `s` is.
* A couple of extra `int` variables (`total`, `idx`, `newEndForCh`).

Extra space: `O(1)` (technically `O(26)` for the array, which is a constant, not something that grows with `n`).

---

## 20. Common Mistakes Beginners Make

* ❌ **"I should literally generate and store every subsequence string, then deduplicate with a Set."**
  * ✅ This is exponentially too slow/memory-heavy for `s` up to length 2000 — you must track only counts, per ending letter, never actual strings.
* ❌ **"When I see a repeated letter, I should just ADD its new contribution to the old `end[c]` value."**
  * ✅ This causes over-counting — the correct move is to **replace** `end[c]` entirely with the newly computed value, since the new value already properly accounts for everything that came before (including previous appearances of that same letter), making the old value redundant to add on top of.
* ❌ **"I don't need to worry about negative numbers in modular arithmetic."**
  * ✅ In Java, `%` can return a negative result when applied to a negative number (e.g., `(-3) % 5 == -3` in Java, not `2` like in some other languages/math conventions) — so when subtracting `end[idx]` from `total`, you should add `MOD` back before the final `% MOD` to guarantee a non-negative result.
* ❌ **"The `+1` in `1 + total` is unnecessary — appending the character to existing subsequences should be enough."**
  * ✅ The `+1` specifically accounts for "this character all by itself" as a brand-new one-character subsequence — without it, you'd never count single-character subsequences correctly the first time each letter appears (or undercount them thereafter).
* ❌ **"I need to take the modulus only at the very end, once, on the final total."**
  * ✅ Because the "true" unbounded numbers can grow far beyond what fits in a normal integer during the computation (not just at the end), you must apply `% MOD` at *every* intermediate step, not just once at the very end — otherwise you'd get integer overflow long before reaching the final answer.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Number of DISTINCT subsequences/subsets/results" (the word "distinct" is the big flag)
"Return the answer modulo 10^9+7" (signals the true count is astronomically large,
   and that you should track running counts with modular arithmetic, not raw enumeration)
A single string/sequence, with a small fixed alphabet (like 26 lowercase letters),
   where duplicates arise from REPEATED characters/elements
```

Whenever a problem wants you to count *distinct* results built by extending a structure one element at a time, and duplicates come from repeated values in a small alphabet, think: **track a per-value running count ("subsequences/sequences ending in this specific value"), and REPLACE (don't add to) that value's count whenever it reoccurs** — this is the standard trick for turning an "exponentially many distinct results" problem into an O(n)-time counting problem.

---

## 22. Interview Thinking

```text
1. Understand the input    → a single string s
2. Understand the output   → count of DISTINCT non-empty subsequences, mod 1e9+7
3. Try brute force         → literally build a Set<String> of all subsequences (tiny inputs only)
4. Find what makes it slow → exponentially many distinct strings possible; can't store them all
5. Identify repeated work  → duplicate results come specifically from REPEATED characters
6. What can be stored?     → end[c] = distinct subsequences ending in letter c, for 26 letters
7. Optimize                → single pass; new end[ch] = 1 + total-before-this-step;
                              REPLACE (don't add to) the old end[ch]; update total accordingly
8. Check edge cases        → all-same characters, all-distinct characters, single character
9. Analyze complexity      → O(n) time, O(1) extra space (26-letter array)
```

Applied here: the interview-winning realization is that "distinct" + "small alphabet" should immediately suggest tracking per-character running totals with a *replace* rule, rather than ever trying to materialize or deduplicate actual strings.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why does appending the *same* new character `ch` to every currently-distinct subsequence always produce a set of results that are still pairwise distinct from each other (never colliding with one another)?
2. If `end['x'] = 5` and later in the string another `'x'` appears when `total = 20`, what does the new `end['x']` become, and what happens to the *old* value `5`?
3. Why is it safe to completely discard/replace the old `end[ch]` value, rather than needing to somehow "merge" it with the new one?

<br>

### Answer to Mini Challenge

1. Because right before appending `ch`, all the existing subsequences being extended were already guaranteed pairwise distinct from each other (that's what `total` represents — a count of genuinely different strings). Tacking the identical final character `ch` onto each of them can't possibly make two previously-different strings become equal — if two strings differed anywhere in their content before, they still differ there after both get the same suffix appended.
2. New `end['x'] = 1 + 20 = 21`. The old value `5` is discarded/overwritten — it's not used in computing the new value directly (except insofar as it had already been folded into `total` long ago when it was first established), and it's specifically subtracted back out of `total` before adding in the new `21`, to avoid double-counting.
3. Because the new value `1 + total` already represents "every distinct subsequence ending in `ch`, using everything processed up through this point" — which is a strictly more complete and up-to-date accounting than the old value (which only reflected an earlier, smaller prefix of `s`). The old subsequences ending in the previous `'x'` are not lost — they're representable as ways to reach the *same final strings*, but since we only care about *distinct string counts* (not "ways"), there's no need to preserve or merge the old number at all.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Count the number of distinct non-empty subsequence strings of `s`, modulo `10^9+7`.

### 🔑 Main Idea
Track, per letter, how many distinct subsequences currently end in that letter; each new character's fresh count is `1 + (running total before this character)`, and this fresh count REPLACES (not adds to) that letter's previous count, correctly avoiding duplicate counting from repeated letters.

### ⚙️ Algorithm
1. Maintain `end[26]` (per-letter counts) and `total` (their sum), all starting at 0.
2. For each character `ch` in `s`: compute `newEndForCh = (1 + total) % MOD`.
3. Update `total = (total - end[idx] + newEndForCh + MOD) % MOD`.
4. Set `end[idx] = newEndForCh`.
5. Return `total` after processing all characters.

### ⏱️ Complexity
* **Time:** `O(n)`
* **Space:** `O(1)` (a fixed 26-element array)

### 🎯 Pattern to Remember
"Count distinct results, mod a big prime, built from a small alphabet" → track per-value running counts, and REPLACE (not add) a value's count whenever it reoccurs, rather than trying to enumerate or deduplicate actual results.

---

## 25. Beginner Quiz

1. **(Understanding)** Why can't we just count subsequences the way problem #115 did (counting *ways*) and expect that to equal the answer here?
2. **(Basic concept)** What does `end[c]` represent, in plain words, at any point during the algorithm?
3. **(Logic)** Why do we REPLACE `end[ch]` with the new value instead of adding the new value on top of the old one?
4. **(Dry run)** For `s = "abab"`, walk through the algorithm step by step (tracking `end['a']`, `end['b']`, and `total`) and find the final answer.
5. **(Complexity/pattern)** Why would literally storing every distinct subsequence in a `Set<String>` be infeasible for `s` of length 2000, and what specific property of the problem (small alphabet + "distinct" + modulo output) should immediately suggest the per-letter running-count technique?
