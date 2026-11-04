---
title: "836. Rectangle Overlap"
slug: 'rectangle-overlap'
date: '2026-09-14'
difficulty: 'Easy'
platform: 'LeetCode POTD'
timeComplexity: 'O(1)'
spaceComplexity: 'O(1)'
tags: ['Math', 'Geometry', 'Intervals']
excerpt: "Determine whether two axis-aligned rectangles overlap with positive area by decomposing 2D geometry into independent 1D interval overlap checks."
---

# 836. Rectangle Overlap

Let's teach this one from absolute zero, same structure as always. This one is a nice geometry/logic problem rather than an algorithmic-complexity one.

---

## 1. Problem in Very Simple Language

You're given two rectangles, each described by 4 numbers: `[x1, y1, x2, y2]`. `(x1, y1)` is the rectangle's **bottom-left corner**, and `(x2, y2)` is its **top-right corner**. Every rectangle here is "axis-aligned," meaning its sides are perfectly horizontal and vertical (no tilting).

You need to determine: do these two rectangles **overlap** — meaning, is there some region of positive area that belongs to *both* rectangles at once?

Important detail: if the rectangles only **touch** (share an edge or a single corner point, with zero actual overlapping area), that does **NOT** count as overlapping. They must share a genuine 2D region with real area.

* **What's given:** two rectangles, each as `[x1, y1, x2, y2]`.
* **What to find:** whether they share any region of positive area.
* **What to return:** `true` if they overlap, `false` otherwise.

---

## 2. Real-Life Analogy

Imagine two rectangular rugs laid out on a floor, each perfectly aligned with the walls (no rugs at an angle). You want to know: do these two rugs actually **overlap** — is there some patch of floor covered by *both* rugs at once? If the rugs are just touching edges (like two rugs placed side by side, sharing a boundary line but not actually piled on top of each other anywhere), that's *not* overlapping — there's no floor patch covered by both.

---

## 3. Important Programming Concepts I Need First

### Coordinate System (X and Y axes)
* **Concept:** Every point on a 2D plane can be described by two numbers: `x` (how far right/left) and `y` (how far up/down). A rectangle is fully described by its bottom-left corner and top-right corner.
* **Why we need it:** The entire problem is expressed in terms of these coordinates.

### Interval (a range on a single axis)
* **Concept:** An interval is just a range between two numbers, like "from 2 to 7." A rectangle can be thought of as **two separate intervals combined**: an x-interval (from `x1` to `x2`, describing how far left-to-right it spans) and a y-interval (from `y1` to `y2`, describing how far bottom-to-top it spans).
* **Why we need it:** This is the key simplifying idea for the whole problem — see Section 7.

### Interval Overlap (1-dimensional version of our problem)
* **Concept:** Two intervals `[a1, a2]` and `[b1, b2]` overlap (with positive length) exactly when `a1 < b2` AND `b1 < a2`. In plain words: each interval must start *before* the other one ends.
* **Simple Example:** Interval `[1, 5]` and interval `[3, 8]`: is `1 < 8`? Yes. Is `3 < 5`? Yes. Both true → they overlap (the overlapping region is `[3,5]`). Interval `[1, 5]` and interval `[5, 8]`: is `1 < 8`? Yes. Is `5 < 5`? **No** (they're equal, not strictly less) → they do NOT overlap (they just touch at the single point `5`).
* **Why we need it:** As we'll see, 2D rectangle overlap breaks down into exactly this same check, applied twice (once for x, once for y).

### Boolean logic (AND)
* **Concept:** Two conditions combined with `&&` (AND) are only jointly `true` if *both* individual conditions are `true`.
* **Why we need it:** Two rectangles overlap only when *both* their x-ranges overlap AND their y-ranges overlap — missing either one means no real 2D overlap.

### Strict vs. Non-Strict Inequality
* **Concept:** `<` means "strictly less than" (not equal), while `<=` means "less than OR equal to." This distinction matters a lot here, since the problem explicitly says *touching* edges/corners do NOT count as overlapping.
* **Why we need it:** Getting this exactly right (`<` vs `<=`) is the single most common source of bugs in this problem.

---

## 4. Understand the Input

Take Example 1:
```
rec1 = [0, 0, 2, 2]
rec2 = [1, 1, 3, 3]
```

* `rec1` spans from `(0,0)` (bottom-left) to `(2,2)` (top-right) — so its x-range is `[0,2]` and its y-range is `[0,2]`.
* `rec2` spans from `(1,1)` to `(3,3)` — x-range `[1,3]`, y-range `[1,3]`.
* We want to know: is there a genuine 2D region (with positive area) belonging to both rectangles?
* Visually, `rec1` is a 2×2 square in the bottom-left area, and `rec2` is a 2×2 square shifted up-and-right by 1 unit — they should visibly overlap in the middle region from `(1,1)` to `(2,2)`.

---

## 5. Understand the Output

Output: `true`

* The overlapping region is the square from `(1,1)` to `(2,2)` — which has area `(2-1) × (2-1) = 1`, a genuinely positive area.
* Checking our x-ranges: `rec1`'s x-range `[0,2]` and `rec2`'s x-range `[1,3]` — do these overlap? `0 < 3`? Yes. `1 < 2`? Yes. Both true → x-ranges overlap.
* Checking our y-ranges: `rec1`'s y-range `[0,2]` and `rec2`'s y-range `[1,3]` — same check: `0 < 3`? Yes. `1 < 2`? Yes. Both true → y-ranges overlap.
* Since **both** the x-ranges and y-ranges overlap, the full 2D rectangles overlap → `true`.

---

## 6. Solve the Example Manually

Let's manually work through **Example 2**, the interesting "just touching" case: `rec1 = [0,0,1,1]`, `rec2 = [1,0,2,1]`.

* `rec1`'s x-range: `[0, 1]`. `rec2`'s x-range: `[1, 2]`.
* `rec1`'s y-range: `[0, 1]`. `rec2`'s y-range: `[0, 1]` (identical y-ranges, interesting!).

**Step 1: Check x-range overlap.** Using our rule (`a1 < b2` AND `b1 < a2`): is `rec1.x1 (0) < rec2.x2 (2)`? Yes. Is `rec2.x1 (1) < rec1.x2 (1)`? Is `1 < 1`? **No!** (They're exactly equal, not strictly less.)

Since this second condition fails, the x-ranges do **NOT** overlap (with positive length) — they just touch at the single point `x=1` (rec1 ends exactly where rec2 begins, on the x-axis).

**Step 2: Since the x-ranges already fail to overlap, we don't even need to check the y-ranges** — both conditions (x-overlap AND y-overlap) must hold for the rectangles to truly overlap, and we've already found one that fails.

**Conclusion:** `false`. ✔️ matches! Visually, these two 1×1 squares are sitting right next to each other, sharing only the vertical line segment `x=1` (from `y=0` to `y=1`) — a shared *edge*, but zero actual overlapping *area*, exactly matching the problem's rule that edge-touching doesn't count.

---

## 7. Think Like a Programmer

* **What do I know?** Each rectangle can be described as an x-interval combined with a y-interval.
* **What do I need to find?** Whether the two rectangles share a positive-area 2D region.
* **What can I try?** Break the 2D problem down into two separate 1D problems: do the x-intervals overlap (with positive length)? Do the y-intervals overlap (with positive length)? If **both** are true, the rectangles overlap in 2D; if **either** fails, they don't.
* **Why does this "split into x and y" trick actually work?** Because for axis-aligned rectangles, the overlapping region (if any) is itself always a rectangle, whose x-span is exactly "the overlap of the two x-ranges," and whose y-span is exactly "the overlap of the two y-ranges." That combined region has positive area if and only if *both* its width (from the x-overlap) and its height (from the y-overlap) are positive — which is exactly "both the x-ranges and y-ranges overlap with positive length."
* **What's the exact 1D overlap check?** For two intervals `[a1,a2]` and `[b1,b2]`, they overlap with positive length exactly when `a1 < b2` AND `b1 < a2` (using **strict** inequality, since touching-but-not-overlapping, like sharing just an endpoint, must NOT count).
* **What information should I remember?** Nothing beyond the input itself — this problem needs no loops, no extra data structures, just a handful of direct comparisons.
* **What pattern do I notice?** "2D overlap = 1D overlap on x AND 1D overlap on y" is a very general, reusable geometric trick for axis-aligned rectangles.

---

## 8. Start With the Brute Force Solution

There isn't really a meaningfully different "slow" approach here to contrast against — the direct mathematical check *is* the natural, immediate solution, with no loops or search involved at all. Let's build it directly, reasoning through each piece.

**The idea:** Apply the 1D interval-overlap check (Section 7) separately to the x-coordinates and the y-coordinates of both rectangles, and require **both** to succeed.

```java
class Solution {
    public boolean isRectangleOverlap(int[] rec1, int[] rec2) {
        int rec1X1 = rec1[0], rec1Y1 = rec1[1], rec1X2 = rec1[2], rec1Y2 = rec1[3];
        int rec2X1 = rec2[0], rec2Y1 = rec2[1], rec2X2 = rec2[2], rec2Y2 = rec2[3];

        boolean xOverlap = rec1X1 < rec2X2 && rec2X1 < rec1X2;
        boolean yOverlap = rec1Y1 < rec2Y2 && rec2Y1 < rec1Y2;

        return xOverlap && yOverlap;
    }
}
```

**Why it works:** As reasoned in Section 7, positive-area 2D overlap happens exactly when both the x-projections and y-projections of the two rectangles overlap with positive length.

**Time complexity:** `O(1)` — a fixed handful of comparisons, no loops.

**Space complexity:** `O(1)` — just a few local variables.

Since this is already optimal (no loops, no data structures, pure constant-time math), there's no separate "optimized version" to build afterward — this **is** the final, efficient solution.

---

## 9. Explain the Code Line by Line

* `int rec1X1 = rec1[0], rec1Y1 = rec1[1], rec1X2 = rec1[2], rec1Y2 = rec1[3];` — unpack `rec1`'s four numbers into clearly-named variables: its bottom-left corner `(rec1X1, rec1Y1)` and top-right corner `(rec1X2, rec1Y2)`.
* `int rec2X1 = rec2[0], ...` — same unpacking for `rec2`.
* `boolean xOverlap = rec1X1 < rec2X2 && rec2X1 < rec1X2;` — applies the 1D interval-overlap rule to the x-coordinates: `rec1`'s x-range is `[rec1X1, rec1X2]`, `rec2`'s x-range is `[rec2X1, rec2X2]`. They overlap (with positive width) exactly when `rec1X1 < rec2X2` (rec1 starts before rec2 ends) AND `rec2X1 < rec1X2` (rec2 starts before rec1 ends).
* `boolean yOverlap = rec1Y1 < rec2Y2 && rec2Y1 < rec1Y2;` — the exact same rule, applied to the y-coordinates instead.
* `return xOverlap && yOverlap;` — the rectangles genuinely overlap in 2D (with positive area) if and only if **both** the x-ranges and y-ranges overlap; if either one fails, there's no true overlapping region, so we return `false` in that case.

---

## 10. Why Is This Already Ideal?

There's no loop, no search, no data structure — just a small, fixed set of arithmetic comparisons. This is about as fast as any solution could possibly be (`O(1)`), so there's nothing further to "optimize" — the real work in this problem was in the *geometric reasoning* (Section 7's insight), not in algorithmic efficiency.

---

## 11. Double-Checking the Insight with a Trickier Case

Let's use Example 3 to confirm our understanding handles a case where the rectangles are far apart in **both** dimensions: `rec1 = [0,0,1,1]`, `rec2 = [2,2,3,3]`.

* x-check: `rec1X1(0) < rec2X2(3)`? Yes. `rec2X1(2) < rec1X2(1)`? Is `2 < 1`? **No.**
* Since the x-check already fails, `xOverlap = false`, and therefore `xOverlap && yOverlap` is automatically `false` regardless of the y-check (Java's `&&` would actually short-circuit and not even bother evaluating `yOverlap` here, though in our code we compute both booleans upfront for clarity — either way, the final answer is correctly `false`).
* Output: `false`. ✔️ matches! These two 1×1 squares are diagonally separated, with a gap in both x and y — clearly no overlap.

---

## ⭐ Key Insight

### Before the insight
2D rectangle overlap might feel like it needs some complex geometric case-analysis (is one rectangle fully inside the other? partially overlapping on one side? etc.).

### The problem
Trying to enumerate all the different "shapes" of possible overlap (partial overlap on the left, right, top, bottom, full containment, etc.) by hand would be error-prone and repetitive.

### The insight
**An axis-aligned rectangle is just the combination of an independent x-interval and an independent y-interval.** Two such rectangles overlap (with positive area) *if and only if* their x-intervals overlap (with positive length) AND their y-intervals overlap (with positive length) — this single, uniform rule automatically and correctly handles every possible relative positioning of the two rectangles, without needing separate cases for "overlapping on the left" vs. "fully containing" vs. any other specific configuration.

### After the insight
The entire 2D geometry problem collapses into two simple 1D interval-overlap checks, combined with a logical AND.

---

## 13. Dry Run — One More Confirmation

Let's also verify a "fully contains" scenario isn't accidentally missed: `rec1 = [0,0,10,10]`, `rec2 = [2,2,4,4]` (rec2 entirely inside rec1).

* x-check: `rec1X1(0) < rec2X2(4)`? Yes. `rec2X1(2) < rec1X2(10)`? Yes. → `xOverlap = true`.
* y-check: `rec1Y1(0) < rec2Y2(4)`? Yes. `rec2Y1(2) < rec1Y2(10)`? Yes. → `yOverlap = true`.
* Both true → `true`. Correctly detects that a fully-contained rectangle still counts as overlapping (it clearly shares a large, positive-area region with the containing rectangle) — no special-casing needed for "containment" as a separate scenario.

---

## 14. Optimized Code

```java
class Solution {
    public boolean isRectangleOverlap(int[] rec1, int[] rec2) {
        int rec1X1 = rec1[0], rec1Y1 = rec1[1], rec1X2 = rec1[2], rec1Y2 = rec1[3];
        int rec2X1 = rec2[0], rec2Y1 = rec2[1], rec2X2 = rec2[2], rec2Y2 = rec2[3];

        boolean xOverlap = rec1X1 < rec2X2 && rec2X1 < rec1X2;
        boolean yOverlap = rec1Y1 < rec2Y2 && rec2Y1 < rec1Y2;

        return xOverlap && yOverlap;
    }
}
```

```javascript
/**
 * @param {number[]} rec1
 * @param {number[]} rec2
 * @return {boolean}
 */
var isRectangleOverlap = function(rec1, rec2) {
    const [rec1X1, rec1Y1, rec1X2, rec1Y2] = rec1;
    const [rec2X1, rec2Y1, rec2X2, rec2Y2] = rec2;

    const xOverlap = rec1X1 < rec2X2 && rec2X1 < rec1X2;
    const yOverlap = rec1Y1 < rec2Y2 && rec2Y1 < rec1Y2;

    return xOverlap && yOverlap;
};
```

---

## 15. Explain Code Line by Line

Already fully covered in Section 9.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`rec1=[0,0,2,2], rec2=[1,1,3,3]` → dry-ran in Section 5 → Output: `true` ✔️

### Example 2 — Different Case (edge-touching)
`rec1=[0,0,1,1], rec2=[1,0,2,1]` → dry-ran in Section 6 → Output: `false` ✔️

### Example 3 — Edge Case (fully separated)
`rec1=[0,0,1,1], rec2=[2,2,3,3]` → dry-ran in Section 11 → Output: `false` ✔️

---

## 17. Edge Cases

* **Rectangles touching only at a single corner point** (e.g., `rec1=[0,0,1,1]`, `rec2=[1,1,2,2]`, touching only at point `(1,1)`) → x-check: `0 < 2`? Yes. `1 < 1`? **No** → `xOverlap=false` → overall `false`, correctly identifying that a single shared *point* has zero area, not a genuine overlap.
* **One rectangle entirely inside another** → correctly returns `true`, as shown in Section 13 — no special-casing needed, the general rule naturally covers this.
* **Rectangles sharing an entire edge** (like Example 2) → correctly returns `false`, since shared edges have zero width or zero height in one dimension, making that dimension's strict inequality fail.
* **Very large coordinate values** (up to `±10^9` per the constraints) → since we're only ever comparing values directly (`<`) and never multiplying or adding them together in a way that could overflow a standard 32-bit `int` (which comfortably handles values up to about `±2.1 billion`), this is safe with plain `int` arithmetic.
* **Identical rectangles** (both rectangles have the exact same coordinates) → both x-check and y-check will clearly pass (since each rectangle's own range trivially "overlaps" with an identical copy of itself, with full positive width/height) → correctly returns `true`.

---

## 18. Time Complexity

**What is time complexity?** An estimate of how much work an algorithm does as its input grows.

```text
O(1) — a small, fixed number of comparisons and logical operations,
        completely independent of any changing "size" of input
        (there's no array to loop over, no list of points — just 8 fixed numbers total)
```

**Why:** There's no looping, searching, or recursion at all — we simply unpack 8 numbers (4 from each rectangle) and perform 4 direct numeric comparisons, combined with basic AND logic. This is as fast as computation gets.

---

## 19. Space Complexity

`O(1)` — a handful of local variables to hold the unpacked coordinates and two boolean results; nothing that scales with any notion of "input size" (the input is always exactly 4 numbers per rectangle, fixed).

---

## 20. Common Mistakes Beginners Make

* ❌ "I should use `<=` instead of `<`, since 'overlap' sounds like it should include touching."  
  ✅ The problem explicitly states that rectangles which only touch at a corner or edge do **NOT** count as overlapping — using `<=` would incorrectly return `true` for those touching-only cases. Strict `<` is essential here.

* ❌ "I need separate case-checks for 'rec1 is to the left of rec2,' 'rec1 is above rec2,' 'rec1 fully contains rec2,' etc."  
  ✅ The unified x-overlap-AND-y-overlap rule automatically and correctly handles *every* possible relative configuration — there's no need to enumerate separate geometric cases by hand.

* ❌ "I should check if either rectangle's corner point lies inside the other rectangle."  
  ✅ This corner-point-containment check is actually **insufficient** — there are configurations where two rectangles genuinely overlap without either one's *corner* lying inside the other (imagine a very long, thin horizontal rectangle crossing through a very long, thin vertical rectangle, like a plus-sign shape — neither rectangle's corners are inside the other, yet they clearly overlap in the middle). The interval-overlap approach correctly handles this "cross" pattern too, while a naive corner-check approach would incorrectly miss it.

* ❌ "The x-coordinates and y-coordinates need to be checked together in a single combined comparison, not separately."  
  ✅ Precisely the opposite is true and is the core insight — checking them as two **independent** 1D overlap problems (and combining with AND) is exactly what correctly solves the 2D problem, thanks to the axis-aligned, rectangular nature of the shapes involved.

* ❌ "I should worry about which rectangle is 'first' or 'bigger' and handle them asymmetrically."  
  ✅ The formula `a1 < b2 && b1 < a2` is fully symmetric — it doesn't matter which rectangle you call `rec1` versus `rec2`, or which one happens to be positioned further left/right/up/down; the same check works correctly regardless of their relative sizes or positions.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Axis-aligned rectangles" (or axis-aligned boxes, in higher dimensions)
"Overlap," "intersect," or "collide" between simple geometric shapes
Problems where a shape can be decomposed into independent per-axis intervals
```

Whenever you're dealing with axis-aligned rectangles (or boxes, in 3D), remember: **the shape's behavior along each axis is independent of the other axes** — so many 2D (or 3D) geometric questions (overlap, containment, even computing the intersection's actual area) can be broken down into simpler 1D interval problems, solved separately per axis, then combined.

---

## 22. Interview Thinking

```text
1. Understand the input    → two rectangles, each as [x1,y1,x2,y2]
2. Understand the output   → true/false: do they share positive-area overlap?
3. Try brute force         → (no meaningful "slow" version exists — direct math is the natural approach)
4. Find what makes it slow → n/a, already O(1)
5. Identify the key trick  → decompose each rectangle into an independent x-interval and y-interval
6. What can be stored?     → nothing extra needed
7. Optimize / formalize    → apply the 1D overlap rule (a1 < b2 && b1 < a2) to x, then to y; AND them
8. Check edge cases        → corner-touching, edge-touching, full containment, identical rectangles
9. Analyze complexity      → O(1) time, O(1) space
```

Applied here: the interview-winning move is recognizing the **axis-decomposition trick** immediately, rather than trying to enumerate geometric cases by hand — this single realization turns a seemingly fiddly 2D geometry problem into two simple, symmetric 1D checks.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why does the check use `<` (strict) instead of `<=`, given the problem's specific definition of "overlap"?
2. If `rec1 = [0,0,5,5]` and `rec2 = [5,0,10,5]` (sharing the vertical edge `x=5`), what would `xOverlap` evaluate to, and why?
3. Can you construct two rectangles that overlap in a "plus-sign crossing" pattern (neither rectangle's corners lie inside the other), and verify the formula still correctly returns `true`?

<br>

### Answer to Mini Challenge

1. Because the problem explicitly states that rectangles merely *touching* (sharing only a boundary, with zero actual area in common) do NOT count as overlapping — `<=` would incorrectly treat touching as overlapping (since touching means exactly `a1 == b2` or `b1 == a2` at the shared boundary), so strict `<` is required to correctly exclude these zero-area touching cases.
2. `rec1X1(0) < rec2X2(10)`? Yes. `rec2X1(5) < rec1X2(5)`? Is `5 < 5`? **No.** So `xOverlap = false` — correctly identifying that these two rectangles only share the vertical line `x=5` (zero width), not any actual overlapping area.
3. Example: `rec1 = [0, 2, 10, 3]` (a long, thin horizontal rectangle) and `rec2 = [4, 0, 5, 10]` (a long, thin vertical rectangle) — they cross in the middle like a plus sign, forming a small overlapping square around `(4,2)`-`(5,3)`, even though neither rectangle's corner points lie inside the other. Checking: x-overlap: `0 < 5`? Yes. `4 < 10`? Yes. → true. y-overlap: `2 < 10`? Yes. `0 < 3`? Yes. → true. Both true → `true`, correctly detected despite no corner-containment.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Determine whether two axis-aligned rectangles share a region of positive area (touching alone doesn't count).

### 🔑 Main Idea
Decompose each rectangle into an independent x-interval and y-interval; the rectangles overlap with positive area exactly when both their x-intervals and y-intervals overlap with positive length (checked via strict inequalities).

### ⚙️ Algorithm
1. Extract each rectangle's `x1, y1, x2, y2`.
2. Check `xOverlap = rec1X1 < rec2X2 && rec2X1 < rec1X2`.
3. Check `yOverlap = rec1Y1 < rec2Y2 && rec2Y1 < rec1Y2`.
4. Return `xOverlap && yOverlap`.

### ⏱️ Complexity
Time: `O(1)`  
Space: `O(1)`

### 🎯 Pattern to Remember
For axis-aligned rectangles/boxes, decompose into independent per-axis intervals and solve simpler 1D overlap problems separately, combining the results with AND.

---

## 25. Beginner Quiz

1. **(Understanding)** Why doesn't the problem count two rectangles that only touch along a shared edge as "overlapping"?
2. **(Basic concept)** What is the 1D interval-overlap condition for two ranges `[a1,a2]` and `[b1,b2]`, and why must the inequalities be strict?
3. **(Logic)** Why is it correct to check x-overlap and y-overlap completely independently of each other, rather than needing some combined check?
4. **(Dry run)** For `rec1 = [1,1,4,4]` and `rec2 = [3,3,6,6]`, compute `xOverlap` and `yOverlap` by hand, and determine the final answer.
5. **(Complexity/pattern)** Why is this problem's solution `O(1)` rather than needing any loop or search, and what general category of geometry problems (mentioned in the pattern-recognition section) should make you think of this same "decompose into independent axes" trick?
