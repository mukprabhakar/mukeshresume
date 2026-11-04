---
title: "835. Image Overlap"
slug: 'image-overlap'
date: '2026-09-14'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(A * B)'
spaceComplexity: 'O(N^2)'
tags: ['Array', 'Hash Table', 'Matrix', 'Enumeration']
excerpt: "Find the translation of one binary grid that maximizes overlapping 1s using shift vector enumeration and hash map frequency voting."
---

# 835. Image Overlap

This is a nice step up from Rectangle Overlap — same "translate and compare" flavor, but on grids of 0s and 1s, and it introduces a slick "count shift vectors" trick. Let's build it from zero.

---

## 1. Problem in Very Simple Language

You have two square grids of the same size, `img1` and `img2`, each filled with `0`s and `1`s. Think of the `1`s as "lit pixels" and `0`s as "dark pixels."

You're allowed to **slide** (translate) one entire image — left, right, up, or down, by any whole number of steps — and then lay it on top of the other image. Sliding never rotates or flips anything, it just shifts every `1` bit by the same amount in the same direction. Any `1`s that get pushed off the edge of the grid during this slide simply disappear (they're erased, not wrapped around).

After sliding (by whichever amount you choose) and overlaying, you count how many grid positions have a `1` in **both** images at once — that's the "overlap" for that particular slide.

* **Goal:** find the slide (shift amount) that produces the **largest possible overlap** count.
* **What's given:** two `n×n` binary grids.
* **What to find:** the best possible shift of one grid relative to the other, to maximize matching `1`-positions.
* **What to return:** that maximum overlap count.

---

## 2. Real-Life Analogy

Imagine two transparent sheets of graph paper, each with some squares colored in black (the `1`s) and the rest left blank (the `0`s). You can slide one sheet around — left, right, up, down, any distance — and then stack it directly on top of the other sheet (still keeping both sheets facing the same way, no rotating or flipping). You want to find the sliding position where the **most black squares from sheet A land exactly on top of black squares from sheet B**.

---

## 3. Important Programming Concepts I Need First

### 2D Array / Grid
* **Concept:** A grid of values, indexed by row and column, `grid[row][col]`.
* **Why we need it:** Both `img1` and `img2` are given as `n×n` grids.

### Translation (Shift) Vector
* **Concept:** A translation is described by two numbers: `dx` (how far to shift horizontally — columns) and `dy` (how far to shift vertically — rows). A single point `(r, c)` moves to `(r + dy, c + dx)` after this shift.
* **Example:** Shifting by `(dy=1, dx=1)` moves the point `(0,0)` to `(1,1)`.
* **Why we need it:** The entire problem is about finding the *best* single shift vector to apply to one whole image.

### Coordinates of `1`s (as a list of points)
* **Concept:** Instead of thinking about a grid as a big 2D block, we can instead just list out *where* the `1`s are — as a collection of `(row, col)` coordinate pairs. Everywhere else is implicitly `0` and can be ignored.
* **Why we need it:** Since only `1`-positions can ever contribute to an overlap (a `0` overlapping anything is never counted), we only actually care about the `1`s' locations — not the full grid.

### Pairing up points from two lists, and computing their relative offset
* **Concept:** If you have a `1` at position `p1` in `img1`, and a `1` at position `p2` in `img2`, then the *specific shift* that would move `p1` exactly onto `p2` is `p2 - p1` (subtracting row from row, column from column). If we later actually apply *that* shift to the *entire* `img1`, this particular pair would indeed land on top of each other.
* **Why we need it:** This is the heart of the algorithm — see Section 7.

### HashMap for counting occurrences
* **Concept:** A `HashMap` lets us associate a "key" with a "value," and quickly look up or update that value later. Here, we'll use a shift vector (packaged as a single key, like `(dy, dx)`, encoded into an integer) as the key, and "how many `1`-pairs would align under this exact shift" as the value.
* **Why we need it:** Many different pairs of `1`s might all happen to require the *same* shift vector to align — we want to count, for each *distinct* possible shift, how many pairs it would successfully align, and then find the shift with the highest such count.

---

## 4. Understand the Input

Take Example 1:
```
img1 = [[1,1,0],
        [0,1,0],
        [0,1,0]]

img2 = [[0,0,0],
        [0,1,1],
        [0,0,1]]
```

* `img1`'s `1`s are located at: `(0,0), (0,1), (1,1), (2,1)`.
* `img2`'s `1`s are located at: `(1,1), (1,2), (2,2)`.
* We want to find some shift `(dy, dx)` such that, after moving *every* `1` of `img1` by that same amount, the number of resulting positions that also hold a `1` in `img2` is as large as possible.
* Why does it matter that we listed out just the `1` positions, rather than looking at the whole 3×3 grid? Because the `0` cells can never contribute to an overlap count — only matching up `1`-with-`1` matters, so we can completely ignore the `0`s from the very start.

---

## 5. Understand the Output

Output: `3`

* The explanation says: shift `img1` right by 1 and down by 1 — that's a shift vector of `(dy=1, dx=1)`.
* Let's verify: applying `(dy=1,dx=1)` to each of `img1`'s `1`-positions:
  * `(0,0) → (1,1)` — is `(1,1)` a `1` in `img2`? Yes!
  * `(0,1) → (1,2)` — is `(1,2)` a `1` in `img2`? Yes!
  * `(1,1) → (2,2)` — is `(2,2)` a `1` in `img2`? Yes!
  * `(2,1) → (3,2)` — this is now **outside** the 3×3 grid (row 3 doesn't exist for a 3-row grid, indices 0-2 only) — this `1` gets erased, contributing nothing.
* Matches found: 3 (the first three). ✔️ matches the expected output!

---

## 6. Solve the Example Manually

Let's manually work through the logic behind *why* `(dy=1, dx=1)` turns out to be the best shift, by considering **every pair** of (an `img1` 1-position, an `img2` 1-position) and figuring out what shift each pair would "vote for."

`img1`'s 1s: `A1=(0,0), A2=(0,1), A3=(1,1), A4=(2,1)`.  
`img2`'s 1s: `B1=(1,1), B2=(1,2), B3=(2,2)`.

For every pair `(Ai, Bj)`, the shift that would align them is `Bj - Ai` (row difference, column difference):

| Pair | Ai | Bj | Shift (dy, dx) = Bj - Ai |
|---|---|---|---|
| A1,B1 | (0,0) | (1,1) | (1,1) |
| A1,B2 | (0,0) | (1,2) | (1,2) |
| A1,B3 | (0,0) | (2,2) | (2,2) |
| A2,B1 | (0,1) | (1,1) | (1,0) |
| A2,B2 | (0,1) | (1,2) | (1,1) |
| A2,B3 | (0,1) | (2,2) | (2,1) |
| A3,B1 | (1,1) | (1,1) | (0,0) |
| A3,B2 | (1,1) | (1,2) | (0,1) |
| A3,B3 | (1,1) | (2,2) | (1,1) |
| A4,B1 | (2,1) | (1,1) | (-1,0) |
| A4,B2 | (2,1) | (1,2) | (-1,1) |
| A4,B3 | (2,1) | (2,2) | (0,1) |

Now let's **tally up** how many times each distinct shift vector appears:

* `(1,1)` appears for pairs A1-B1, A2-B2, A3-B3 → **3 times**.
* `(0,1)` appears for pairs A3-B2, A4-B3 → 2 times.
* All other shifts appear only once each.

The shift `(1,1)` has the highest tally, **3**, meaning: if we apply shift `(dy=1,dx=1)` to the *entire* `img1`, exactly 3 of its `1`s will land on `1`s in `img2` (precisely the 3 pairs that "voted" for this shift). This matches both our direct check in Section 5, and the expected output of `3`. ✔️

**Why does counting "votes" per shift work?** Because a specific shift `(dy,dx)`, when applied to the *whole* `img1`, causes `Ai` to land exactly on `Bj` if and only if `Bj - Ai` equals that exact shift — so the total number of `img1` `1`s that successfully land on an `img2` `1` under a given shift is *exactly* the number of `(Ai, Bj)` pairs whose difference equals that shift. Tallying all pairs' differences and taking the highest tally directly gives us the best possible shift's overlap count.

---

## 7. Think Like a Programmer

* **What do I know?** For any shift `(dy, dx)` applied to all of `img1`, the overlap count equals the number of `(Ai, Bj)` pairs where `Bj - Ai == (dy, dx)`.
* **What do I need to find?** The shift with the maximum such count.
* **What can I try?** The most direct idea: try *every possible* shift `(dy, dx)` (ranging from `-(n-1)` to `n-1` in each direction, since shifting further than that would push everything off-grid), and for each one, actually apply it to the whole grid and count matches. This is a valid, direct simulation.
* **What happens if I try every possibility this way?** There are $O(n^2)$ possible shift vectors (roughly $(2n-1) \times (2n-1)$), and for each one, checking the whole grid takes $O(n^2)$ — giving $O(n^4)$ total. For $n=30$, that's $30^4 = 810,000$ — actually still quite fast in absolute terms, but let's see if there's a cleverer, more targeted approach.
* **Can I make it faster / more targeted?** Yes — as discovered in Section 6, we don't need to try shifts "blindly" and rescan the whole grid each time. Instead, we only care about pairing up **actual `1`-positions** from each image and tallying up the *shift each pair implies*. If both images are sparse (relatively few `1`s), this can be much faster than scanning the whole grid for every candidate shift.
* **What information should I remember?** The list of `1`-positions in `img1`, the list of `1`-positions in `img2`, and a running tally (a `HashMap`) of "how many pairs imply this exact shift."
* **What pattern do I notice?** This is a "vote counting" or "convolution-style" trick: instead of checking every possible transformation directly against the full data, look at every pair of "interesting" points (the `1`s) and let each pair "vote" for the specific transformation that would align it — then find the transformation with the most votes.

---

## 8. Start With the Brute Force Solution

**Brute force idea:** Try every possible shift `(dy, dx)` (both ranging from `-(n-1)` to `n-1`). For each one, scan through *every* cell of `img1`; if it's a `1`, compute where it would land after the shift, check if that landing spot is both within bounds and a `1` in `img2`; count all such successful landings. Track the best (maximum) count found across all shifts.

**Why it works:** It directly simulates the problem's description — physically trying every possible slide amount and counting the resulting overlap for each.

```java
class Solution {
    public int largestOverlap(int[][] img1, int[][] img2) {
        int n = img1.length;
        int best = 0;

        for (int dy = -(n - 1); dy <= n - 1; dy++) {
            for (int dx = -(n - 1); dx <= n - 1; dx++) {
                int count = 0;
                for (int r = 0; r < n; r++) {
                    for (int c = 0; c < n; c++) {
                        if (img1[r][c] == 1) {
                            int nr = r + dy;
                            int nc = c + dx;
                            if (nr >= 0 && nr < n && nc >= 0 && nc < n && img2[nr][nc] == 1) {
                                count++;
                            }
                        }
                    }
                }
                best = Math.max(best, count);
            }
        }

        return best;
    }
}
```

**Why it's correct:** It exhaustively tries every possible shift and directly counts the resulting overlap for each, exactly matching the problem's definition — guaranteed to find the true maximum.

**Time complexity:** $O(n^2)$ possible shifts, times $O(n^2)$ work to check each one $\rightarrow O(n^4)$. For $n=30$, that's about $810,000$ operations.

**Space complexity:** $O(1)$ extra memory.

---

## 9. Explain the Brute Force Code Line by Line

* `int n = img1.length;` — the grid's size.
* `int best = 0;` — tracks the best (largest) overlap found across all tried shifts.
* The two outer loops (`dy`, `dx`) — try every possible shift amount, from `-(n-1)` to `n-1` in each direction. (Shifting further than `n-1` in either direction would push *every* `1` off the grid, guaranteeing zero overlap, so there's no need to check beyond this range.)
* `int count = 0;` — resets the overlap counter for this specific shift attempt.
* The two inner loops (`r`, `c`) — scan every cell of `img1`.
* `if (img1[r][c] == 1)` — only bother checking cells that are actually `1` (a `0` can never contribute to overlap).
* `int nr = r + dy; int nc = c + dx;` — compute where this `1` would land after applying the current shift.
* `if (nr >= 0 && nr < n && nc >= 0 && nc < n && img2[nr][nc] == 1)` — check that the landing spot is still within the grid's bounds (otherwise it's erased, per the problem's rule) AND that `img2` has a `1` there too.
* `count++;` — if both conditions hold, this is a successful overlap; increment the count for this shift.
* `best = Math.max(best, count);` — after fully evaluating this shift, update our overall best-so-far if this shift did better.
* `return best;` — after trying every possible shift, return the best overlap found.

---

## 10. Why Might We Want Something Faster?

For $n=30$ specifically, the brute force above (`~810,000` operations) runs essentially instantly — there's no real performance problem here. But notice something wasteful: even when `img1` and `img2` are mostly `0`s (sparse), we're still looping over *every* cell of the grid, for *every* candidate shift, even though only the relatively few `1`-cells can ever actually matter. If $n$ were much larger, or if we wanted a more targeted approach that scales with "how many `1`s there are" rather than "how big the grid is," we'd want the pairing/voting trick from Section 6.

---

## 11. Find the Better (Voting) Approach

> "Can we focus only on the cells that actually matter?"

Yes — using the insight from Section 6:

```text
Brute Force:
Try every shift, rescan the WHOLE grid for each one
        ↓
O(n⁴) — wasteful when most cells are 0
        ↓
Realize: only 1-positions ever matter for overlap
        ↓
List out img1's 1-positions (call them A) and img2's 1-positions (call them B)
        ↓
For every pair (Ai, Bj), the shift Bj - Ai is the ONE shift that aligns THIS pair
        ↓
Tally up how many pairs "vote" for each distinct shift, using a HashMap
        ↓
The shift with the most votes IS the answer (its vote count = its overlap count)
        ↓
O(|A| × |B|) — proportional to how many 1s exist, not the grid's total size
```

---

## ⭐ Key Insight

### Before the insight
It seems like we need to physically try every possible shift and rescan the whole grid to measure its resulting overlap.

### The problem
Most of the grid is often `0`s, which can never contribute to overlap — rescanning them repeatedly, once per candidate shift, is wasted effort.

### The insight
**Every possible overlapping pair (an `img1` `1` at position `Ai`, an `img2` `1` at position `Bj`) determines EXACTLY ONE shift — namely `Bj - Ai` — that would cause `Ai` to land on `Bj`.** If we consider *every* such pair and tally which shift each one "votes for," then the total number of votes any particular shift receives is *exactly* the total overlap count that shift would produce if actually applied to the whole image (since it's counting, precisely, how many `img1` `1`s land on `img2` `1`s under that shift). So instead of testing shifts directly, we can discover the best shift (and its overlap count) purely by counting votes among pairs of `1`-positions.

### After the insight
We never need to "apply" any shift to the whole grid at all — we just enumerate all `(Ai, Bj)` pairs, compute their implied shift, tally it in a `HashMap`, and read off the maximum tally at the end.

---

## 13. Dry Run the Optimized Solution

We already did the full dry run in **Section 6** for Example 1 — every pair's implied shift was computed and tallied, with `(1,1)` winning with 3 votes, matching the expected output of `3`.

Let's also quickly dry-run **Example 2**: `img1 = [[1]]`, `img2 = [[1]]`.

* `img1`'s 1-positions: just `A1 = (0,0)`.
* `img2`'s 1-positions: just `B1 = (0,0)`.
* Only one pair to consider: `(A1, B1)`, implied shift = `B1 - A1 = (0,0) - (0,0) = (0,0)`.
* Tally: shift `(0,0)` gets 1 vote.
* Maximum tally: `1`.
* Output: `1` ✔️ (makes sense — no shift at all is needed, since the single `1` is already aligned).

And **Example 3**: `img1 = [[0]]`, `img2 = [[0]]`. Neither image has *any* `1`s at all — there are no pairs to consider whatsoever, so our tally map stays completely empty. The maximum of an empty collection of tallies should be treated as `0` (no overlap is possible, since there's nothing to overlap). Output: `0` ✔️.

---

## 14. Optimized Code

```java
import java.util.*;

class Solution {
    public int largestOverlap(int[][] img1, int[][] img2) {
        int n = img1.length;

        List<int[]> onesInImg1 = new ArrayList<>();
        List<int[]> onesInImg2 = new ArrayList<>();

        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                if (img1[r][c] == 1) {
                    onesInImg1.add(new int[]{r, c});
                }
                if (img2[r][c] == 1) {
                    onesInImg2.add(new int[]{r, c});
                }
            }
        }

        Map<Integer, Integer> shiftVotes = new HashMap<>();
        int best = 0;

        for (int[] a : onesInImg1) {
            for (int[] b : onesInImg2) {
                int dy = b[0] - a[0];
                int dx = b[1] - a[1];

                // Encode (dy, dx) into a single integer key.
                // Offsetting by n keeps values non-negative (since dy, dx range
                // from -(n-1) to (n-1)), and multiplying by a large enough base
                // (2n is safely bigger than any possible dx range) keeps dy and dx
                // from colliding with each other in the encoded key.
                int key = (dy + n) * (2 * n) + (dx + n);

                int newCount = shiftVotes.getOrDefault(key, 0) + 1;
                shiftVotes.put(key, newCount);
                best = Math.max(best, newCount);
            }
        }

        return best;
    }
}
```

```javascript
/**
 * @param {number[][]} img1
 * @param {number[][]} img2
 * @return {number}
 */
var largestOverlap = function(img1, img2) {
    const n = img1.length;
    const ones1 = [];
    const ones2 = [];

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (img1[r][c] === 1) ones1.push([r, c]);
            if (img2[r][c] === 1) ones2.push([r, c]);
        }
    }

    const shiftVotes = new Map();
    let best = 0;

    for (const [r1, c1] of ones1) {
        for (const [r2, c2] of ones2) {
            const dy = r2 - r1;
            const dx = c2 - c1;
            const key = (dy + n) * (2 * n) + (dx + n);

            const count = (shiftVotes.get(key) || 0) + 1;
            shiftVotes.set(key, count);
            if (count > best) {
                best = count;
            }
        }
    }

    return best;
};
```

---

## 15. Explain Optimized Code Line by Line

* `List<int[]> onesInImg1 = new ArrayList<>();` / `onesInImg2` — will hold the `(row, col)` coordinates of every `1` in each respective image.
* The double loop over `r, c` — scans the grid *once* to collect all `1`-positions from both images simultaneously (a single pass does double duty here).
* `if (img1[r][c] == 1) onesInImg1.add(new int[]{r, c});` — record this position if it's a `1` in `img1`. Same idea for `img2`.
* `Map<Integer, Integer> shiftVotes = new HashMap<>();` — our tally: maps an *encoded* shift vector to how many `(Ai, Bj)` pairs have implied that exact shift so far.
* `int best = 0;` — tracks the highest tally seen (which directly corresponds to the best overlap count).
* The nested `for (int[] a : onesInImg1) { for (int[] b : onesInImg2) { ... } }` — tries every possible pairing of an `img1` `1`-position with an `img2` `1`-position.
* `int dy = b[0] - a[0]; int dx = b[1] - a[1];` — computes the exact shift that would move `a` onto `b`.
* `int key = (dy + n) * (2 * n) + (dx + n);` — since `dy` and `dx` can each range from `-(n-1)` to `(n-1)` (so they can be negative, which doesn't work well as a raw array index or simple map key without care), we shift both by `+n` to make them non-negative (`dy+n` ranges from `1` to `2n-1`, always positive), then combine them into a single unique integer using a technique similar to how you'd flatten a 2D array index into 1D (`row * width + col`) — here using `2*n` as a safely-large "width" so that different `(dy, dx)` pairs never accidentally produce the same combined key.
* `int newCount = shiftVotes.getOrDefault(key, 0) + 1;` — look up how many votes this shift has received so far (or `0` if it's never been seen), and add one more vote for the current pair.
* `shiftVotes.put(key, newCount);` — save this updated vote count back into the map.
* `best = Math.max(best, newCount);` — keep track of the highest vote count seen across all pairs processed so far — this running maximum, once every pair has been processed, is exactly our final answer (no need for a separate final pass over the map).
* `return best;` — return the largest overlap found.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`img1=[[1,1,0],[0,1,0],[0,1,0]], img2=[[0,0,0],[0,1,1],[0,0,1]]` → dry-ran fully in Section 6 → Output: `3` ✔️

### Example 2 — Different Case
`img1=[[1]], img2=[[1]]` → dry-ran in Section 13 → Output: `1` ✔️

### Example 3 — Edge Case (no 1s at all)
`img1=[[0]], img2=[[0]]` → dry-ran in Section 13 → Output: `0` ✔️

---

## 17. Edge Cases

* **One or both images have no `1`s at all** → no pairs exist to vote → `shiftVotes` stays empty → correctly returns the initial `best = 0`.
* **Both images are identical** → the shift `(0,0)` (no movement at all) will receive votes from every matching pair, and in particular, every `1` in `img1` pairs with the *same-position* `1` in `img2`, so `(0,0)` gets at least as many votes as there are `1`s total.
* **`n = 1` (smallest possible grid)** → only one possible cell; if both `img1[0][0]` and `img2[0][0]` are `1`, output is `1`; otherwise `0` — handled correctly and trivially by the general algorithm.
* **Very sparse images** (very few `1`s in a large grid) → the voting approach shines here, since we only ever process pairs of *actual* `1`-positions, never wasting time on the many `0`-cells.
* **Very dense images** (most cells are `1`) → in the worst case (e.g., all cells are `1` in both images), the number of pairs is $n^2 \times n^2 = n^4$ — the same order as the brute force's worst case, but for $n \le 30$ this remains entirely manageable either way.

---

## 18. Time Complexity

**What is time complexity?** An estimate of how the total work grows as input size grows.

```text
Brute Force:
O(n⁴) — always, regardless of how many 1s are actually present

Optimized (voting):
O(A × B) — where A = number of 1s in img1, B = number of 1s in img2
           (in the worst case, A and B can each be up to n², giving O(n⁴) too,
            but for SPARSE images, this is much better than the brute force)
```

**Why:** The brute-force approach always pays the full $O(n^4)$ cost, no matter how few `1`s actually exist. The voting approach's cost scales directly with *how many `1`s there actually are* in each image — for sparse images, this can be dramatically faster; for maximally dense images, it converges to the same worst-case bound as brute force. For this problem's specific constraint ($n \le 30$), both approaches are comfortably fast in practice, but the voting technique is the more broadly scalable and commonly-expected solution for this type of "best alignment" problem.

---

## 19. Space Complexity

* `onesInImg1`, `onesInImg2` — store up to $O(n^2)$ coordinate pairs each, in the worst case (a fully-`1` image).
* `shiftVotes` — stores at most $O((2n-1)^2)$ distinct shift-key entries (since there are only that many possible distinct `(dy,dx)` combinations).

Overall space: $O(n^2)$.

---

## 20. Common Mistakes Beginners Make

* ❌ "I should compute the shift as `Ai - Bj` instead of `Bj - Ai`."  
  ✅ We want the shift that, when applied to `img1`'s point `Ai`, lands it on `img2`'s point `Bj` — that's `Bj - Ai` (the destination minus the source). Reversing this would compute the *opposite* shift, effectively solving the mirror-image version of the intended question.

* ❌ "I can just use a `String` like `dy + "," + dx` as the HashMap key, no need to encode into a single integer."  
  ✅ This works too, and is arguably simpler to read — using an encoded integer key (as shown) is just a common performance-minded alternative that avoids the overhead of string concatenation and string-based hashing; both approaches are valid, and beginners should feel free to use whichever is clearer to them.

* ❌ "I need to also check the reverse direction — shifting `img2` instead of `img1`."  
  ✅ Shifting `img1` by `(dy,dx)` and shifting `img2` by `(-dy,-dx)` produce the exact same *relative* alignment (and thus the same overlap count) — so considering all shifts of `img1` alone (across the full range of positive and negative `dy,dx`) already covers every meaningful relative positioning.

* ❌ "The valid shift range should be `0` to `n-1` only (non-negative), since 'sliding' sounds like it should always move things in a positive direction."  
  ✅ Shifts can be negative too (sliding left or up) — the full valid range is `-(n-1)` to `(n-1)` in each direction, covering every meaningful relative offset between the two images.

* ❌ "If both images are empty (`n=1` with all zeros, or larger all-zero grids), I should return something other than `0`, since there's 'no overlap to compute'."  
  ✅ Zero `1`s means zero possible overlap, by definition — `0` is exactly the correct answer, and the algorithm naturally produces it without needing any special-case handling.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Translate/slide/shift one [image/pattern/set of points] to align with another"
"Maximum overlap/alignment between two point sets"
Problems involving finding the BEST relative offset between two sparse structures
```

Whenever a problem asks you to find the best possible *translation* (shift) to align two sets of points/marked cells, and you'd otherwise need to "try every shift and rescan everything," think: **enumerate every pair of points (one from each set), compute the shift each pair implies, and tally votes for each distinct shift in a HashMap** — the shift with the most votes is the answer, and this scales with the number of *marked points*, not the size of the full grid.

---

## 22. Interview Thinking

```text
1. Understand the input    → two n×n binary grids
2. Understand the output   → maximum overlap count achievable via some translation
3. Try brute force         → try every shift, rescan the whole grid for each
4. Find what makes it slow → O(n⁴), rescanning many irrelevant 0-cells repeatedly
5. Identify repeated work  → only 1-positions ever matter; each (Ai,Bj) pair implies
                              exactly one specific shift
6. What can be stored?     → a HashMap tallying how many pairs imply each distinct shift
7. Optimize                → enumerate all pairs, tally shifts, take the max tally
8. Check edge cases        → no 1s at all, identical images, n=1, fully-dense images
9. Analyze complexity      → O(A×B) instead of O(n⁴) — much better for sparse inputs
```

Applied here: the "aha" is realizing that a *pair* of matched points fully determines a *specific* shift — turning a "try every transformation" search into a "count how many pairs agree on each transformation" tally, a very reusable trick for alignment-style problems.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why does the shift implied by a pair `(Ai, Bj)` have to be computed as `Bj - Ai`, and not, say, the midpoint or sum of the two points?
2. If `img1` has 5 ones and `img2` has 4 ones, what is the maximum possible number of `(Ai, Bj)` pairs we'd need to consider, and why can't the final answer (the best overlap count) exceed the smaller of these two counts (4)?
3. Why is it safe to update `best` incrementally, pair by pair, rather than waiting until the entire `shiftVotes` map is fully built before scanning it for the maximum?

<br>

### Answer to Mini Challenge

1. A "shift" represents "how far and in what direction do I move a point to get from its old location to its new location" — that's precisely `newLocation - oldLocation`. Since we're moving `img1`'s point `Ai` to hopefully land on `img2`'s point `Bj`, the required shift is `Bj (destination) - Ai (source)`. A midpoint or sum wouldn't represent "a translation amount" at all.
2. There are at most $5 \times 4 = 20$ pairs to consider. The final answer can never exceed $4$ (the smaller count) because the overlap count for any given shift can never be larger than the total number of `1`s in *either* image individually — you can't have more matching pairs than the total number of `1`s available in the smaller image to match against.
3. Because `Math.max` is commutative and order-independent — updating `best` immediately after processing each pair, versus waiting and scanning the whole completed map at the very end, both arrive at the exact same final maximum value; doing it incrementally just avoids a separate final pass over the map, saving a small amount of extra work.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Find the translation of one binary grid that maximizes the number of positions where both grids have a `1`.

### 🔑 Main Idea
Every pair of (a `1` in img1, a `1` in img2) implies exactly one shift that would align them; tally how many pairs imply each distinct shift, and the highest tally is the answer.

### ⚙️ Algorithm
1. Collect the `(row, col)` positions of all `1`s in `img1` and in `img2`.
2. For every pair `(Ai, Bj)`, compute the implied shift `(Bj.row - Ai.row, Bj.col - Ai.col)`.
3. Tally each distinct shift's vote count in a `HashMap` (using an encoded integer key).
4. Track and return the maximum tally seen across all pairs.

### ⏱️ Complexity
Time: $O(A \times B)$, where $A, B$ are the counts of `1`s in each image (worst case $O(n^4)$ for fully-dense images)  
Space: $O(n^2)$

### 🎯 Pattern to Remember
"Best translation/alignment between two point sets" $\rightarrow$ enumerate point pairs, tally the shift each pair implies, take the shift with the most votes — rather than testing every possible shift directly against the full grid.

---

## 25. Beginner Quiz

1. **(Understanding)** Why can we completely ignore all the `0`-cells in both images when solving this problem?
2. **(Basic concept)** What does the shift value `Bj - Ai` represent, in plain words?
3. **(Logic)** Why does the number of votes a particular shift receives exactly equal the overlap count that shift would produce if actually applied to the whole image?
4. **(Dry run)** For `img1 = [[1,0],[0,0]]` and `img2 = [[0,0],[0,1]]`, list the 1-positions in each, compute the implied shift(s), and determine the final answer.
5. **(Complexity/pattern)** Why does the voting approach's time complexity depend on the number of `1`s rather than the grid's total size, and in what scenario (sparse vs. dense images) does this actually provide a meaningful speed advantage over the brute-force approach?
