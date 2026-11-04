---
title: "3734. Lexicographically Smallest Palindromic Permutation Greater Than Target"
date: "August 28, 2026"
difficulty: "Hard"
tags: ["Greedy", "Palindrome", "Strings"]
platform: "LeetCode POTD"
timeComplexity: "O(n)"
spaceComplexity: "O(n)"
excerpt: "Solve the Hard challenge of building the smallest lexicographical palindrome permutation greater than target."
---

# 3734. Lexicographically Smallest Palindromic Permutation Greater Than Target

Let's build this up from zero. This is a **Hard** problem, so we'll go slow and steady.

---

## 1. Problem in Very Simple Language

You are given two words, `s` and `target`, both made of only lowercase letters, and both the same length.

You are allowed to **rearrange the letters of `s`** in any order you like (this is called a "permutation" — just a fancy word for "a rearrangement using the exact same letters, same amount of each").

Among all the rearrangements of `s` that are **palindromes** (words that read the same forwards and backwards, like "level" or "baab"), you must find the one that:

* is **strictly greater** than `target` when compared like dictionary words, and
* is the **smallest** one that satisfies that condition.

If no rearrangement of `s` is even a palindrome, or none of the palindromic rearrangements beats `target`, you return an empty string `""`.

**What's given:** `s` (letters you're allowed to use), `target` (the word you must beat).
**What to find:** the smallest palindrome word, built only from `s`'s letters, that is bigger than `target`.
**What to return:** that word, or `""` if impossible.

---

## 2. Real-Life Analogy

Imagine you have a bag of Scrabble tiles — say two `B`s and two `A`s. You're told: "Arrange all these tiles in a row so the row reads the same from left to right and right to left (a palindrome), and make sure your row, read as a word, comes **after** the word `ABBA` in the dictionary — but choose the arrangement that is the closest possible word after it, not some huge jump."

You can't just grab any arrangement — it must (a) use every tile exactly once, (b) be a palindrome, and (c) be the *smallest* dictionary word that still beats the target word.

---

## 3. Important Programming Concepts I Need First

### String
**Concept:** A string is just a sequence of characters, like a row of tiles, each with a position number starting at 0.
**Example:** `"baba"` has `b` at position 0, `a` at position 1, `b` at position 2, `a` at position 3.
**Why we need it:** Both `s` and `target` are strings, and our answer is a string too.

### Array (specifically, a frequency array)
**Concept:** An array is a numbered list of boxes. A "frequency array" of size 26 has one box per letter of the alphabet, and each box holds a count.
**Example:** For `s = "baba"`, box for `a` = 2, box for `b` = 2, everything else = 0.
**Why we need it:** We need to know exactly how many of each letter we have available, since we must use every letter of `s` exactly once.

### Loop
**Concept:** A loop repeats an action for each item in a list, without you writing the same line 300 times by hand.
**Example:** "For every letter in `s`, add 1 to that letter's counting box."
**Why we need it:** We scan through strings and arrays constantly (counting letters, comparing positions, etc.).

### If/else
**Concept:** A way of telling the program "do this if a condition is true, otherwise do that."
**Example:** "If the current letter is bigger than the target's letter, we found our answer."
**Why we need it:** The entire trick of "find the smallest letter bigger than target's letter" is one big if/else decision repeated many times.

### Palindrome
**Concept:** A word that reads identically forwards and backwards. Position `i` from the start must equal position `i` from the end.
**Example:** `"baab"` — first letter `b` = last letter `b`; second letter `a` = second-to-last letter `a`.
**Why we need it:** Our answer must be a palindrome, which cuts our freedom in half — we only get to *choose* the first half of the letters; the second half is forced to mirror it.

### HashMap / frequency counting (same idea as the frequency array above, just conceptually)
**Concept:** A way to quickly look up "how many of X do I have left?"
**Why we need it:** As we build our answer letter by letter, we constantly need to ask "do I still have a `c` left to use?"

### Greedy Algorithm
**Concept:** A greedy algorithm makes the best-looking choice at each step, one step at a time, hoping (and in this case, proving) it leads to the overall best answer.
**Example:** To find the smallest number bigger than 47 using digits {1,7,9}, you try to keep the first digit as "4-like" as possible, only bumping a digit up when forced to.
**Why we need it:** We build our palindrome by matching `target` as long as possible, then bumping the very next letter up just enough — that's a greedy strategy.

### Comparing strings ("lexicographic" order)
**Concept:** Comparing two strings works like comparing words in a dictionary: look at the first position where they differ; whichever has the smaller letter there is the smaller string.
**Example:** `"baab"` vs `"abba"` — first letters `b` vs `a` — since `b > a`, `"baab" > "abba"`.
**Why we need it:** The entire goal ("smallest palindrome greater than target") is defined using this comparison rule.

### Time Complexity (Big-O)
**Concept:** A way of describing "roughly how much work does my program do as the input grows," ignoring small constant details.
**Why we need it:** With `n` up to 300, we need to make sure our solution isn't doing something silly like checking every possible arrangement (which would be astronomically slow).

---

## 4. Understand the Input

Take Example 1:
```
s      = "baba"
target = "abba"
```

* `s = "baba"` tells us: we have exactly these 4 letters to use, in some order: `b, a, b, a` → that's **two `b`s and two `a`s**. We are *not* stuck with the order `b,a,b,a` — we can rearrange freely.
* `target = "abba"` is the word we must beat. It happens to already be a palindrome itself, but that's not required of `target` — it's just the "line in the sand" we must cross.
* We are looking for: a rearrangement of `{b, b, a, a}` that (1) is a palindrome, and (2) is the smallest one that is strictly bigger than `"abba"`.
* `2` and `7`-style "important numbers" don't apply here (that was the Two Sum example from your template) — instead, the important thing is the **counts**: 2 `a`s and 2 `b`s. Since both counts are even, a palindrome is possible (every letter needs a "partner" on the other side, except possibly one letter in the very middle if the word length is odd).

---

## 5. Understand the Output

Output: `"baab"`

* All palindromic rearrangements of `"baba"`, sorted like a dictionary, are: `"abba"`, `"baab"`. (Only two exist, because once you decide the first half of a palindrome, the second half is forced.)
* `"abba"` is *not* strictly greater than `target = "abba"` — it's equal, and we need strictly greater.
* `"baab"` **is** strictly greater than `"abba"` (compare first letters: `b > a`).
* Since `"baab"` is the only remaining candidate and it works, it's the answer.

---

## 6. Solve the Example Manually

Let's solve Example 1 by hand, the way a human would, without writing any code.

We have letters `{a, a, b, b}` and `target = "abba"`.

Since the answer must be a 4-letter palindrome, only the **first 2 letters** are really "ours to choose" — the last 2 letters are forced to mirror the first 2.

| Step | What I try for first half | Full palindrome | Compare to target "abba" | Result |
|---|---|---|---|---|
| 1 | "aa" (smallest possible) | "aaaa" — wait, we don't have 4 `a`s, only 2. Not a valid rearrangement using our letters (need to use exactly 2 a's and 2 b's) | — | invalid, skip |
| 2 | "ab" | "ab" + reverse("ab") = "abba" | equal to target, not strictly greater | fails |
| 3 | "ba" | "ba" + reverse("ba") = "baab" | "baab" > "abba"? First letters: b > a → yes | **This works!** |

Since we tried the two possible first halves in increasing order (`"ab"` then `"ba"`) and picked the first one that produces something strictly bigger than target, `"baab"` is our answer.

---

## 7. Think Like a Programmer

Let's turn that manual process into logic.

* **What do I know?** I know exactly which letters I'm allowed to use (their counts), and I know the target string I must beat.
* **What do I need to find?** The smallest palindrome, built from those letters, greater than target.
* **What can I try?** Since the answer is a palindrome, I only need to decide the **first half** of it — the rest is automatic (mirrored). If the length is odd, there's one middle letter too, but that middle letter is *not free* — only one letter in the whole alphabet is allowed to appear an odd number of times, and it MUST be that one, sitting exactly in the middle. No choice there.
* **What happens if I try every possibility?** I could generate every arrangement of the first half, build the palindrome, and compare to target — but with up to 150 letters in that first half, the number of arrangements is unimaginably huge. Too slow.
* **Can I make it faster?** Yes — just like finding "the smallest number bigger than 472 using certain digits," I don't need to *generate* every option. I can be smart: try to match `target` letter-by-letter for as long as possible, then at the very last moment I'm forced to change something, put the smallest legal letter that's *bigger* than target's letter there, and fill everything after that with the smallest possible letters.
* **What information should I remember?** How many of each letter I still have left to place, as I place letters one at a time.
* **What pattern do I notice?** The longer I can match `target` exactly before being forced to increase a letter, the smaller (closer to target) my final answer will be. So I want to match as long as possible, then bump the *last possible* position, not an early one.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** Generate every distinct permutation of `s`, keep only the ones that are palindromes, sort them, and pick the smallest one that's bigger than `target`.

**Why it works:** It's literally trying everything, so it can't miss the answer.

**Why it's correct:** By definition, checking every single arrangement guarantees we find the true smallest valid one.

**Time complexity:** Generating all permutations of a string of length `n` takes about `O(n!)` (n factorial) time — for `n = 300`, this number has hundreds of digits. Completely impossible to run.

**Space complexity:** Also astronomical, since we'd try to store or generate all these permutations.

We won't even write this code for real — it's only useful as a mental starting point, since actually running it would never finish. But conceptually:

```java
// PSEUDOCODE ONLY - never actually runs for large n
List<String> allPalindromicPermutations = new ArrayList<>();
for (String perm : allPermutationsOf(s)) {
    if (isPalindrome(perm)) {
        allPalindromicPermutations.add(perm);
    }
}
Collections.sort(allPalindromicPermutations);
for (String candidate : allPalindromicPermutations) {
    if (candidate.compareTo(target) > 0) {
        return candidate;
    }
}
return "";
```

---

## 9. Explain the Brute Force Code Line by Line

* `allPermutationsOf(s)` — imagine a function that produces every possible reordering of the letters in `s`. For `"baba"` that would include `"baba"`, `"abab"`, `"abba"`, `"baab"`, `"aabb"`, `"bbaa"`, etc.
* `isPalindrome(perm)` — checks whether a string reads the same forwards and backwards, by comparing position `i` with position `length-1-i` for every `i`.
* `Collections.sort(...)` — puts the palindromic permutations in dictionary order, smallest first.
* The final `for` loop — walks through the sorted list and returns the very first one that beats `target`, since that's guaranteed to be the smallest one that does.

---

## 10. Why Is the Brute Force Solution Not Ideal?

Imagine `s` has 300 letters. The number of ways to arrange 300 items is a number so large it has around 600+ digits — more than the number of atoms in the observable universe, many times over. No computer, now or in the future, could generate even a tiny fraction of that list. We need a method that **builds the answer directly**, without ever listing "all the other options."

---

## 11. Find the Better Approach

> "Can we avoid doing unnecessary work?"

Yes. Two key realizations shrink the problem enormously:

1. **We never need to consider the second half of the palindrome as a free choice.** It's 100% determined by the first half (mirrored). So instead of deciding `n` letters, we only decide about `n/2` letters.
2. **We don't need to generate every arrangement of that first half either.** We can build it directly, matching `target` as long as possible, the same way you'd figure out "what's the next number after 4729 using only these digits" without listing every number.

```text
Brute Force:
Try every full-length arrangement
        ↓
Way too many (n!)
        ↓
Realize: second half is forced (mirror of first half)
        ↓
Now only need to decide first half (n/2 letters)
        ↓
Realize: don't need to try every arrangement of THAT either —
build it directly like "next bigger number" problems
        ↓
Fast solution: roughly one pass through the string
```

---

## 12. Key Insight

### Before the insight
We were thinking about the whole `n`-letter string as something we need to search through many possible full arrangements of.

### The problem
A palindrome's second half isn't independent — it's a mirror of the first half — but naive brute force ignored that free lunch and searched the whole space anyway.

### The insight
**Once you fix the first half of a palindrome, the whole string is fixed.** So the entire problem shrinks to: *find the smallest valid first-half string such that, once mirrored into a full palindrome, it beats `target`.* And finding "the smallest string beating a target, letter-budget-limited" is a classic pattern: **match the target as long as possible, then at the first position where you're forced to deviate, place the smallest available letter that's bigger than target's letter there, and fill everything after with the smallest leftover letters.**

There's one more twist: if the string length is odd, exactly one letter is allowed to appear an odd number of times in `s` — and that letter is *forced* to sit in the very middle. You never get to choose it.

### After the insight
Instead of touching all `n` letters freely, we only ever make decisions about the first `n/2` (rounded down) letters. We scan left to right, trying to match `target`, and the moment we can't match anymore (or matching all the way turns out to not be enough), we bump the letter at that position up to the smallest legal option greater than target's letter, then fill the rest smallest-first. This takes roughly one pass through the string — extremely fast.

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 1** again, but now the "smart" way, tracking our leftover letter budget.

`s = "baba"` → counts: `a:2, b:2`. Length `n=4` is even, so **half = 2**, no middle letter. Since we only place each letter once in the first half but it represents 2 copies in the full word, our "half budget" is `a:1, b:1` (half of each count).

`target = "abba"`.

| Step | Position | Target letter | Budget before | Try to match target exactly? | What happens |
|---|---|---|---|---|---|
| 1 | 0 | `a` | `{a:1, b:1}` | Yes, we have an `a` | Use it. Budget → `{a:0, b:1}` |
| 2 | 1 | `b` | `{a:0, b:1}` | Yes, we have a `b` | Use it. Budget → `{a:0, b:0}` |

We matched the entire first half (`"ab"`) exactly to target's first half. Now, since we matched everything, we must check the **mirrored tail**: reverse of `"ab"` is `"ba"`, compare to target's actual tail (`target[2..3] = "ba"`). They're **equal**, not strictly greater — so simply copying target's first half fails to beat it.

Since exact matching failed, we back up one position and try to bump it:

| Step | Position | Give back letter | Budget now | Look for a letter > target letter | Result |
|---|---|---|---|---|---|
| 3 | 1 (give back `b` used at step 2) | `b` | `{a:0, b:1}` | Need something > `b` — nothing (no `c`, etc. available) | Fails at position 1 |
| 4 | 0 (give back `a` used at step 1) | `a` | `{a:1, b:1}` | Need something > `a` — we have `b`! | Use `b` here |

We place `b` at position 0. Budget left: `{a:1, b:0}`. We fill the rest of the first half (just 1 more slot) with the smallest leftover letter: `a`. First half = `"ba"`. Mirror it: full palindrome = `"ba" + "ab" = "baab"`.

This matches our manual answer from Section 6! 🎉

---

## 14. Optimized Code

```java
class Solution {

    public String lexPalindromicPermutation(String s, String target) {
        int n = s.length();

        // Count characters in s
        int[] count = new int[26];
        for (char ch : s.toCharArray()) {
            count[ch - 'a']++;
        }

        // A palindrome can have at most one odd-frequency character
        int oddCount = 0;
        char middle = 0;

        for (int i = 0; i < 26; i++) {
            if ((count[i] & 1) == 1) {
                oddCount++;
                middle = (char) ('a' + i);
            }
        }

        if (oddCount > 1) {
            return "";
        }

        // Number of characters in the left half
        int halfLen = n / 2;

        // Characters available for the left half
        int[] halfCount = new int[26];
        for (int i = 0; i < 26; i++) {
            halfCount[i] = count[i] / 2;
        }

        char[] prefix = new char[halfLen];

        /*
         * Build the left half from left to right.
         *
         * At every position, try characters from 'a' to 'z'.
         * We choose the smallest character for which there exists
         * some completion that can produce a palindrome > target.
         */
        for (int pos = 0; pos < halfLen; pos++) {

            boolean found = false;

            for (int c = 0; c < 26; c++) {

                if (halfCount[c] == 0) {
                    continue;
                }

                // Try placing this character
                halfCount[c]--;
                prefix[pos] = (char) ('a' + c);

                /*
                 * Check whether this prefix can be completed
                 * to a palindrome strictly greater than target.
                 *
                 * To maximize the palindrome for this prefix,
                 * put all remaining characters in descending order
                 * in the rest of the left half.
                 */
                if (canMakeGreater(prefix, pos + 1,
                                   halfCount, middle, target)) {

                    found = true;
                    break;
                }

                // This character cannot lead to an answer.
                halfCount[c]++;
            }

            if (!found) {
                return "";
            }
        }

        // We have constructed the optimal left half.
        StringBuilder ans = new StringBuilder(n);

        for (char ch : prefix) {
            ans.append(ch);
        }

        // Middle character only exists for odd n
        if ((n & 1) == 1) {
            ans.append(middle);
        }

        // Mirror the left half
        for (int i = halfLen - 1; i >= 0; i--) {
            ans.append(prefix[i]);
        }

        String result = ans.toString();

        return result.compareTo(target) > 0 ? result : "";
    }

    /*
     * Returns true if there is at least one completion of the
     * current prefix that produces a palindrome > target.
     *
     * We construct the LARGEST possible completion from the
     * remaining characters.
     *
     * If even the largest completion is not > target,
     * no smaller completion can work either.
     */
    private boolean canMakeGreater(
            char[] prefix,
            int prefixLength,
            int[] halfCount,
            char middle,
            String target) {

        int halfLen = prefix.length;

        StringBuilder left = new StringBuilder(halfLen);

        // Already fixed prefix
        for (int i = 0; i < prefixLength; i++) {
            left.append(prefix[i]);
        }

        // Put remaining characters in descending order
        for (int c = 25; c >= 0; c--) {
            for (int k = 0; k < halfCount[c]; k++) {
                left.append((char) ('a' + c));
            }
        }

        // Construct the largest palindrome for this prefix
        StringBuilder palindrome = new StringBuilder();

        palindrome.append(left);

        // Middle character
        if ((target.length() & 1) == 1) {
            palindrome.append(middle);
        }

        // Reverse left half
        for (int i = left.length() - 1; i >= 0; i--) {
            palindrome.append(left.charAt(i));
        }

        return palindrome.toString().compareTo(target) > 0;
    }
}
```

```javascript
class Solution {
    lexPalindromicPermutation(s, target) {
        const n = s.length;

        // Count characters in s
        const count = new Array(26).fill(0);
        for (let i = 0; i < s.length; i++) {
            count[s.charCodeAt(i) - 97]++;
        }

        // A palindrome can have at most one odd-frequency character
        let oddCount = 0;
        let middle = '';

        for (let i = 0; i < 26; i++) {
            if ((count[i] & 1) === 1) {
                oddCount++;
                middle = String.fromCharCode(97 + i);
            }
        }

        if (oddCount > 1) {
            return "";
        }

        // Number of characters in the left half
        const halfLen = Math.floor(n / 2);

        // Characters available for the left half
        const halfCount = new Array(26).fill(0);
        for (let i = 0; i < 26; i++) {
            halfCount[i] = Math.floor(count[i] / 2);
        }

        const prefix = new Array(halfLen).fill('');

        /*
         * Build the left half from left to right.
         *
         * At every position, try characters from 'a' to 'z'.
         * We choose the smallest character for which there exists
         * some completion that can produce a palindrome > target.
         */
        for (let pos = 0; pos < halfLen; pos++) {
            let found = false;

            for (let c = 0; c < 26; c++) {
                if (halfCount[c] === 0) {
                    continue;
                }

                // Try placing this character
                halfCount[c]--;
                prefix[pos] = String.fromCharCode(97 + c);

                /*
                 * Check whether this prefix can be completed
                 * to a palindrome strictly greater than target.
                 *
                 * To maximize the palindrome for this prefix,
                 * put all remaining characters in descending order
                 * in the rest of the left half.
                 */
                if (this.canMakeGreater(prefix, pos + 1,
                                   halfCount, middle, target)) {
                    found = true;
                    break;
                }

                // This character cannot lead to an answer.
                halfCount[c]++;
            }

            if (!found) {
                return "";
            }
        }

        // We have constructed the optimal left half.
        const leftSide = prefix.join('');
        const rightSide = prefix.slice().reverse().join('');
        const result = leftSide + middle + rightSide;

        return result > target ? result : "";
    }

    /*
     * Returns true if there is at least one completion of the
     * current prefix that produces a palindrome > target.
     *
     * We construct the LARGEST possible completion from the
     * remaining characters.
     *
     * If even the largest completion is not > target,
     * no smaller completion can work either.
     */
    canMakeGreater(
            prefix,
            prefixLength,
            halfCount,
            middle,
            target) {

        const halfLen = prefix.length;
        let left = '';

        // Already fixed prefix
        for (let i = 0; i < prefixLength; i++) {
            left += prefix[i];
        }

        // Put remaining characters in descending order
        for (let c = 25; c >= 0; c--) {
            for (let k = 0; k < halfCount[c]; k++) {
                left += String.fromCharCode(97 + c);
            }
        }

        // Construct the largest palindrome for this prefix
        const right = left.split('').reverse().join('');
        const palindrome = left + middle + right;

        return palindrome > target;
    }
}
```
---

## 15. Explain Optimized Code Line by Line

* `int[] count = new int[26];` — one box per letter, all start at 0. We'll count how many `a`s, `b`s, ... `s` has.
* The `for` loop right after — walks through every letter of `s` once, incrementing its box. After this, `count['a'-'a']` tells you exactly how many `a`s exist in `s`.
* `oddCount` / `oddCharIndex` — we scan all 26 boxes; if a letter's count is odd, a palindrome needs it to sit alone in the middle. There can be **at most one** such letter, or a palindrome is impossible.
* `mid = n % 2` — 1 if the target length is odd (there's a middle seat), 0 if even (no middle seat).
* The two `if` checks right after — this is the "is a palindrome even possible" gate. If length is even but some letter has an odd count, impossible. If length is odd but there isn't *exactly* one odd-count letter, impossible.
* `half = n / 2` — how many letters we get to freely decide (the first half).
* `halfBudget[i] = count[i] / 2` — since each letter in the first half is mirrored once in the second half, we only get *half* as many "free placements" as the full count.
* `centerChar` — the forced middle letter, if any. Notice: this is **not a choice** — there can only be one candidate.
* The `while (matchedLength < half)` loop — this is us trying to copy `target`'s first half exactly, one letter at a time, spending from our budget as we go, stopping the instant we run out of the needed letter.
* The `if (matchedLength == half)` block — if we successfully copied the *entire* first half, our string so far exactly equals `target`'s first half. Now we must check: does the *forced* rest of the string (center letter + mirrored tail) already make our full string bigger than `target`? We check the center first (if it exists), then the tail. If yes, we return immediately — this is the smallest possible answer, since we matched `target` as long as humanly possible.
* If that check fails (equal or smaller), we don't give up — we go back and try increasing some earlier letter instead.
* `budget[tgt[half - 1] - 'a']++;` — this "gives back" the last letter we tentatively used, since we're now allowed to try something *different* there instead of matching target exactly.
* The main `while (position >= 0)` loop — this is the heart of the "bump the letter" logic. At each position, we look through our remaining budget for the **smallest letter bigger than target's letter at that position** (`for (int c = targetLetter + 1; c < 26; c++)`).
* If we find one (`chosenLetter != -1`), we use it, then fill everything after with the **smallest leftover letters** (since nothing more needs comparing — we've already guaranteed we're bigger than target). Then we mirror to build the full palindrome and return.
* If we don't find one, we "give back" the letter target had at the previous position (so we can try bumping *there* instead) and move one position to the left — this is exactly like carrying in addition, but for letters.
* If we run out of positions entirely, no valid palindrome beats `target`, so we return `""`.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
Input: `s="baba", target="abba"` → dry-ran above → Output: `"baab"` ✔️

### Example 2 — Different Case (exact prefix match, but tail is equal, and no bump possible)
Input: `s="baba", target="bbaa"`.
Budget: `{a:1, b:1}`. Matching target's first letter `b`: budget has `b`, use it, budget → `{a:1, b:0}`. Second letter `b`: budget has no `b` left — matching stops at `matchedLength=1`.
We try to bump position 1 (target letter `b`): need something `> b` in `{a:1}` — nothing. Give back target[0]=`b` → budget `{a:1, b:1}`. Try to bump position 0 (target letter `b`): need `> b` — nothing (`a` is not bigger). No position works → Output: `""` ✔️

### Example 3 — Edge Case (palindrome impossible at all)
Input: `s="abc", target="abb"`. Counts: `a:1, b:1, c:1` — **three** odd counts. Since length 3 is odd, we need *exactly* one odd count, not three → impossible → Output: `""` ✔️

---

## 17. Edge Cases

* **Palindrome is impossible from the start** (wrong number of odd-count letters) → return `""` immediately, no need to even look at `target`.
* **Every rearrangement is smaller than or equal to `target`** → our search runs out of positions to bump → return `""`.
* **The only valid palindrome exactly equals `target`** → since we need *strictly* greater, this doesn't count, and we must look for something else (or fail).
* **`target`'s letters can't even be matched at position 0** (e.g., target starts with `z` but our budget has no letter ≥ that) → the "bump" search starts right at position 0 and likely fails fast.
* **All letters identical** (e.g., `s = "aaaa"`) → only one palindrome exists (`"aaaa"`); either it beats target or it doesn't.
* **Odd length, only one letter total** (`n=1`) → `half=0`, the entire string is just the center letter — no real search needed, just compare directly.

---

## 18. Time Complexity

**What is time complexity?** It's a way of estimating how the *amount of work* grows as the input grows, without worrying about exact seconds — like saying "doubling my grocery list roughly doubles my shopping time," rather than measuring it with a stopwatch.

```text
Brute Force:
O(n!)   — completely impossible for n=300

Optimized:
O(n)    — roughly one pass through the string (times a small constant of 26 for the alphabet)
```

**Why:** We compute letter counts in one pass (`O(n)`). We try to match target's first half in one pass (`O(n/2)`). In the worst case, our "bump" search walks backward through the first half once (`O(n/2)`), and at each position checks up to 26 letters (`O(26)`), which is a constant, not something that grows with `n`. Building the final answer string is another single pass. All together, this is proportional to `n`, not to some huge exploding number — like sorting your grocery list once instead of trying every possible order of it.

---

## 19. Space Complexity

* We use a few fixed-size arrays of length 26 (letter counts, half-budget, etc.) — this doesn't grow with `n` at all, it's always 26 boxes.
* We build the answer string, which is length `n`.

So extra memory used is `O(n)` (mostly just for building and returning the answer itself), plus a small constant `O(26)` for our counting arrays.

---

## 20. Common Mistakes Beginners Make

❌ "I should just sort the letters and check if that's a palindrome."
✅ Sorting only gives you *one* arrangement — usually not even a palindrome, and definitely not necessarily the smallest one greater than target. You need to specifically construct a palindrome by mirroring a chosen first half.

❌ "The middle letter (for odd length) is something I get to pick to help beat target."
✅ The middle letter is completely forced — there's only ever at most one letter with an odd count, and it *must* be the center. You never get to choose it.

❌ "I should compare my constructed string to target only up to the half-way point, since after that it's just a mirror anyway."
✅ You must compare the *entire* string, because even though the second half is a mirror, it can still be the exact part that decides whether your string is bigger or smaller than target (see how the tail check mattered in Example 2's dry run).

❌ "Once I find any position where I can place a bigger letter, that's the answer."
✅ You must search from the **rightmost possible position backward**, because bumping a letter as late as possible keeps your answer as close (and thus as small) as possible while still being greater than target.

---

## 21. How to Recognize This Pattern in Other Problems

If you see phrasing like this, think "match-as-long-as-possible, then bump the smallest legal amount":

```text
"Smallest / next permutation greater than X"
"Rearrange to get the closest larger value"
"Using a limited set of digits/letters, construct the next bigger number/word"
"Palindrome permutation" (combine with: only half the string is a free choice)
"Strictly greater than a given target"
```

---

## 22. Interview Thinking

```text
1. Understand the input   → two equal-length strings, one is a letter budget, one is a target to beat
2. Understand the output  → smallest palindrome from that budget, strictly greater than target
3. Try brute force        → generate all permutations, filter palindromes, sort, scan (way too slow)
4. Find what makes it slow→ we're re-deriving the second half of the palindrome for free every time
5. Identify repeated work → the second half is ALWAYS just the mirror of the first half
6. What can be stored?    → a running "letter budget" for the first half only
7. Optimize               → match target as long as possible, then bump the rightmost possible letter
8. Check edge cases       → impossible palindrome, exact-equal candidate, no bump possible anywhere
9. Analyze complexity     → O(n) time, O(n) space
```

Applied here: this is exactly the path we walked — brute force → realize the mirror trick → realize it's a "match then bump" construction problem → handle the tricky "exact match, check the tail" case → land on an `O(n)` solution.

---

## 23. Mini Challenge

Before we wrap up, try answering these in your head (or on paper):

1. If `s = "aabb"` and `target = "abab"`, what's the half-budget (`a` and `b` counts for the first half)?
2. At position 0, target's letter is `a`. Do we try to match it first, or immediately look for something bigger?
3. Suppose we match the *entire* first half exactly to target, and the mirrored tail comes out **smaller** than target's real tail. What should we do next?

<br>

## Answer to Mini Challenge

1. Full counts: `a:2, b:2`. Half-budget: `a:1, b:1`.
2. We always **try to match first** — matching keeps our answer as close to (and thus as small as) possible while beating target; we only "bump" when matching is no longer possible or doesn't work out.
3. If the mirrored tail turns out smaller (or equal), the exact-match candidate fails to beat target, so we go back and search backward from the last matched position, looking for the rightmost spot where we can legally place a letter bigger than target's letter there.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Build the smallest palindrome, using exactly the letters of `s`, that is strictly bigger than `target`.

## 🔑 Main Idea
A palindrome's second half is just a mirror of its first half, so we only ever need to construct the first half — and we build that first half by matching `target` as long as possible, then bumping the letter at the latest possible position up to the smallest legal larger option.

## ⚙️ Algorithm
1. Count letters of `s`; check a palindrome is even possible (at most one odd-count letter).
2. Compute the "half budget" (each count divided by 2) and the forced center letter, if any.
3. Try to match `target`'s first half exactly using the budget.
4. If fully matched, check the forced center + mirrored tail — if that already beats target, return it (smallest possible answer).
5. Otherwise, search backward for the rightmost position where a bigger letter can be placed; place it, fill the rest with the smallest leftover letters, mirror, and return.
6. If nothing works anywhere, return `""`.

## ⏱️ Complexity
Time: `O(n)`
Space: `O(n)` (for the answer string; counting arrays are a constant O(26))

## 🎯 Pattern to Remember
"Match-then-bump" construction, combined with "a palindrome is only half-free."

---

## 25. Beginner Quiz

1. **(Understanding)** In your own words, why can't we just pick any palindrome permutation of `s` — what two conditions must our answer satisfy?
2. **(Basic concept)** If `s = "ccdd"`, what would the "half-budget" array contain (just for letters `c` and `d`)?
3. **(Logic)** Why do we search for the position to "bump" starting from the **end** of the matched prefix and moving backward, rather than starting from position 0 and moving forward?
4. **(Dry run)** For `s = "aabb"` and `target = "abba"`, walk through: what's the half-budget, does the first half match target exactly, and if not, what's the final answer?
5. **(Complexity/pattern)** Why is this solution `O(n)` instead of something like `O(n log n)` or `O(n^2)`, and what "signal words" in a problem statement should make you think of this match-then-bump technique in the future?

Take your time — send me your answers whenever you're ready, and I'll walk through them with you!
