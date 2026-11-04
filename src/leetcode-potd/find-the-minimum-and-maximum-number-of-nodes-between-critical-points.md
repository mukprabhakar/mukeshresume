---
title: "2058. Find the Minimum and Maximum Number of Nodes Between Critical Points"
slug: 'find-the-minimum-and-maximum-number-of-nodes-between-critical-points'
date: '2026-08-31'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(n)'
spaceComplexity: 'O(1)'
tags: ['Linked List', 'Two Pointers']
excerpt: "Find the minimum and maximum distance between critical points (local maxima/minima) in a linked list in a single pass."
---

# 2058. Find the Minimum and Maximum Number of Nodes Between Critical Points

Let's teach this from absolute zero, same structure as before.

---

## 1. Problem in Very Simple Language

You're given a **linked list** — a chain of nodes, where each node holds a number and points to the next node in the chain (we'll explain "linked list" fully in a moment).

Walking through this chain, some nodes are special. A node is called a **critical point** if it's either:

* a **local maxima** — its value is *strictly bigger* than both the node right before it AND the node right after it (like a little "peak"), or
* a **local minima** — its value is *strictly smaller* than both the node right before it AND the node right after it (like a little "valley").

Important rule: the very **first** node and the very **last** node can *never* be critical points, because a first node has no "previous" node, and a last node has no "next" node — and you need both neighbors to even check.

Once you've found all the critical points (there could be zero, one, two, or many), you look at their **positions** (not their values — their positions/indices in the chain) and compute:

* `minDistance` = the smallest gap (in positions) between any two critical points.
* `maxDistance` = the largest gap (in positions) between any two critical points.

If there are fewer than 2 critical points total, you can't compute any distance, so you return `[-1, -1]`.

* **What's given:** the head (starting node) of a linked list.
* **What to find:** all critical points' positions, then the smallest and largest gap between any two of them.
* **What to return:** a 2-element array `[minDistance, maxDistance]`.

---

## 2. Real-Life Analogy

Imagine you're walking along a mountain trail, and at various points along the trail there are little signposts marking your **distance from the start** (like "3 km", "4 km", "5 km", ...). As you walk, the trail's *elevation* goes up and down. Some spots are exactly at the top of a little hill (higher than the ground just before and just after you) — those are "peaks." Some spots are exactly at the bottom of a little dip (lower than the ground just before and just after) — those are "valleys."

Peaks and valleys are your "critical points." You want to know: among all these peaks and valleys, what's the *shortest* distance (in km, using those signposts) between any two of them, and what's the *longest* distance between any two of them? Note you're comparing **signpost numbers** (positions), not how high or low the ground was at each point.

---

## 3. Important Programming Concepts I Need First

### Linked List
* **Concept:** A linked list is a chain of "nodes." Each node holds a value AND a pointer (a reference/arrow) to the *next* node in the chain. Unlike an array, you can't jump straight to "position 5" — you have to walk node by node, starting from the `head` (the first node), following the `next` pointers one at a time.
* **Simple Example:** `head → [3] → [1] → [4] → [1] → null`. Here, the node holding `3` points to the node holding `1`, which points to `4`, which points to `1`, which points to `null` (meaning "nothing after this, I'm the last one").
* **Why we need it:** The input to this problem is a linked list, not a plain array, so we must walk through it using `.next` instead of indexing with `[i]`.

### Node (and its two parts)
* **Concept:** In Java, a node here is an object with two fields: `val` (the number it stores) and `next` (a reference to the next node, or `null` if it's the last one).
* **Example:** `node.val` gives you the number; `node.next` gives you the next node in the chain (or `null`).
* **Why we need it:** We'll be constantly reading `.val` to compare values, and following `.next` to move forward.

### Variable
* **Concept:** A named "box" to store a value for later use.
* **Example:** `int prevVal = 3;` remembers "the previous node's value was 3."
* **Why we need it:** As we walk the list, we need to remember "what was the previous node's value" and "what was the previous node's position," since we don't have array indexing to look backward.

### Loop (specifically, a `while` loop)
* **Concept:** Repeats an action until some condition becomes false. A `while` loop is especially natural for linked lists because we don't know the length in advance — we just keep going `while (currentNode != null)`.
* **Example:** `while (node != null) { ...; node = node.next; }` walks through every node exactly once.
* **Why we need it:** We must walk the entire linked list from head to end, and a `while` loop (checking for `null`) is the standard way to do that.

### If/else
* **Concept:** Lets the program branch based on a condition.
* **Example:** "If the current value is bigger than both neighbors, mark it as a local maxima."
* **Why we need it:** Detecting whether a node is a critical point (and if so, whether it's a max or min) is fundamentally an if/else decision.

### Index / Position tracking (manual, since linked lists have no built-in indexing)
* **Concept:** Since a linked list doesn't let you ask "what's at position 5?" directly, if we want to know *where* something is, we have to count it ourselves as we walk — using a variable that increases by 1 each step.
* **Why we need it:** `minDistance` and `maxDistance` are computed using **positions**, so we must track "which position am I currently at?" manually with a counter variable.

### Function / Method
* **Concept:** A reusable named block of code.
* **Why we need it:** Not strictly required to introduce a new one here, but our solution itself is a method (`nodesBetweenCriticalPoints`) that we'll build step by step.

### Array (for the final output)
* **Concept:** A small fixed list of values.
* **Example:** `int[] result = new int[2];` creates a 2-box array; `result[0]` and `result[1]` are the two boxes.
* **Why we need it:** Our answer must be returned as a 2-element array: `[minDistance, maxDistance]`.

### Time Complexity
We'll use this at the end to explain why our solution is fast enough for lists up to 100,000 nodes long.

---

## 4. Understand the Input

Take Example 2:
```text
head = [5, 3, 1, 2, 5, 1, 2]
```

This represents a linked list: `5 → 3 → 1 → 2 → 5 → 1 → 2 → null`.

Let's number the positions starting from 0, just like array indices, even though it's technically a linked list:

| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|---|
| Value | 5 | 3 | 1 | 2 | 5 | 1 | 2 |

* `head` points to the very first node, whose value is `5`.
* Each number is connected to the next by a `.next` pointer, ending in `null` after the last node (`2` at position 6).
* We are looking for: which positions are local maxima or minima, then the min/max distance between them.
* Why can't position 0 (value `5`) or position 6 (value `2`) ever be critical points? Because position 0 has no "previous" node, and position 6 has no "next" node — the rule explicitly requires both neighbors to exist.

---

## 5. Understand the Output

Output: `[1, 3]`

* Walking through, we check every "middle" position (1 through 5, since 0 and 6 can't qualify):
  * Position 1 (value `3`): previous is `5`, next is `1`. Is `3` bigger than both? No (`3 < 5`). Is `3` smaller than both? No (`3 > 1`). Not critical.
  * Position 2 (value `1`): previous is `3`, next is `2`. Is `1` smaller than both `3` and `2`? Yes! **Local minima** at position 2.
  * Position 3 (value `2`): previous is `1`, next is `5`. Not bigger than both, not smaller than both. Not critical.
  * Position 4 (value `5`): previous is `2`, next is `1`. Is `5` bigger than both `2` and `1`? Yes! **Local maxima** at position 4.
  * Position 5 (value `1`): previous is `5`, next is `2`. Is `1` smaller than both `5` and `2`? Yes! **Local minima** at position 5.
* So critical points are at positions `[2, 4, 5]`.
* Gaps between consecutive critical points: `4 - 2 = 2`, and `5 - 4 = 1`.
* `minDistance` = the smallest of all pairwise gaps = `1` (between positions 4 and 5).
* `maxDistance` = the gap between the very **first** and very **last** critical point = `5 - 2 = 3` (between positions 2 and 5).
* Final answer: `[1, 3]` — matches!

---

## 6. Solve the Example Manually

Let's carefully solve Example 2 by hand, walking node by node like a human (and like our code eventually will).

`5 → 3 → 1 → 2 → 5 → 1 → 2`, positions 0 through 6.

We can only check a node for critical-point status once we know its previous value, its own value, and its next value. Let's walk through step by step, sliding a little 3-node window along the list:

| Step | Position being checked | Prev value | Current value | Next value | Bigger than both? | Smaller than both? | Critical? |
|---|---|---|---|---|---|---|---|
| 1 | 1 | 5 | 3 | 1 | No | No | No |
| 2 | 2 | 3 | 1 | 2 | No | Yes | **Local minima** |
| 3 | 3 | 1 | 2 | 5 | No | No | No |
| 4 | 4 | 2 | 5 | 1 | Yes | No | **Local maxima** |
| 5 | 5 | 5 | 1 | 2 | No | Yes | **Local minima** |

(We never check position 0 or position 6, since they lack a full previous/next pair.)

Critical points found, in order: position 2, position 4, position 5.

Now let's track two things as we would while scanning left to right:
* The position of the **very first** critical point we ever found (call it `firstCriticalPos`) — this only gets set once, and never changes after that.
* The position of the **most recently seen** critical point (call it `prevCriticalPos`) — this updates every time we find a new one, and each time we update it, we can immediately check "how far is this one from the previous one?" to possibly update our running `minDistance`.

| Critical point found at position | firstCriticalPos | prevCriticalPos (before this one) | Gap to prevCriticalPos | Running minDistance | 
|---|---|---|---|---|
| 2 | 2 (just set, first one!) | none yet | — | still infinity (nothing to compare yet) |
| 4 | 2 (unchanged) | 2 | 4 - 2 = 2 | 2 |
| 5 | 2 (unchanged) | 4 | 5 - 4 = 1 | min(2, 1) = 1 |

After scanning everything:
* `firstCriticalPos = 2`, and the **last** critical point we found was at position `5`.
* `maxDistance = lastCriticalPos - firstCriticalPos = 5 - 2 = 3` (this is always the gap between the very first and very last critical point — more on *why* in Section 7).
* `minDistance = 1` (the smallest gap we ever saw between two *consecutive* critical points, tracked as we went).

Final answer: `[1, 3]` ✔️ matches!

---

## 7. Think Like a Programmer

* **What do I know?** I can walk the list node by node, and at each node (except the first and last), I can check its previous, current, and next values.
* **What do I need to find?** The smallest and largest gap between any two critical points' positions.
* **What can I try?** The most direct idea: first collect *all* critical point positions into a list, then afterward, compare every pair of positions to find the smallest and largest gap.
* **What happens if I try every possibility?** If there are `k` critical points, comparing every pair takes about `k × k` comparisons. In the worst case `k` could be close to `n/2` (roughly half of all nodes could be peaks/valleys alternating), so this could be slow-ish, though not catastrophically slow. But we can do even better — we don't actually need to compare *every* pair.
* **Can I make it faster?** Yes! Here's the key realization: **the maximum distance is always simply the gap between the very first critical point and the very last critical point.** Why? Because any two critical points that are *both* strictly between the first and last one will always have a *smaller* gap between them than the outermost pair does (since positions only increase as we walk forward, the first-to-last span is the biggest possible span you could ever measure). So for max distance, we don't need to compare all pairs at all — just remember the first and last critical positions.
* For **minimum distance**, on the other hand, the smallest gap is *always* between two **consecutive** critical points (right next to each other in our found-order), never between two that have another critical point in between them (since skipping over a middle one can only make the gap bigger, not smaller). So we only ever need to compare each critical point to the *previous* critical point we found — never to older ones further back.
* **What information should I remember?** As we scan: the position of the first critical point ever found, the position of the most recently found critical point (to compute consecutive gaps), and running best values for min/max distance.
* **What pattern do I notice?** We can find the entire answer in **one single pass** through the list, without ever storing all critical points in a separate list at all!

---

## 8. Start With the Brute Force Solution

**Brute force idea:** First, walk the entire list once and record the position of every critical point into a list (e.g., an `ArrayList<Integer>`). Then, use two nested loops to compare every pair of positions in that list, tracking the smallest and largest difference found.

**Why it works:** By checking literally every pair, we're guaranteed to find the true minimum and maximum gap — no risk of missing anything.

**Why it's correct:** Exhaustively comparing all pairs can never miss the actual smallest or largest gap, since every possible pair gets checked.

**Time complexity:** `O(n)` to walk the list and find critical points, plus `O(k²)` to compare all pairs, where `k` is the number of critical points found (and `k` can be up to roughly `n/2`). So worst case, this is `O(n²)`.

**Space complexity:** `O(k)` to store the list of critical point positions.

```java
import java.util.*;

class Solution {
    public int[] nodesBetweenCriticalPoints(ListNode head) {
        List<Integer> criticalPositions = new ArrayList<>();

        ListNode prev = head;
        ListNode curr = head.next;
        int position = 1;

        // Walk through, checking every "middle" node
        while (curr != null && curr.next != null) {
            boolean isMax = curr.val > prev.val && curr.val > curr.next.val;
            boolean isMin = curr.val < prev.val && curr.val < curr.next.val;
            if (isMax || isMin) {
                criticalPositions.add(position);
            }
            prev = curr;
            curr = curr.next;
            position++;
        }

        if (criticalPositions.size() < 2) {
            return new int[]{-1, -1};
        }

        int minDistance = Integer.MAX_VALUE;
        int maxDistance = Integer.MIN_VALUE;

        // Compare every pair (brute force!)
        for (int i = 0; i < criticalPositions.size(); i++) {
            for (int j = i + 1; j < criticalPositions.size(); j++) {
                int gap = criticalPositions.get(j) - criticalPositions.get(i);
                minDistance = Math.min(minDistance, gap);
                maxDistance = Math.max(maxDistance, gap);
            }
        }

        return new int[]{minDistance, maxDistance};
    }
}
```

---

## 9. Explain the Brute Force Code Line by Line

* `List<Integer> criticalPositions = new ArrayList<>();` — an empty, growable list where we'll collect the positions of every critical point we find.
* `ListNode prev = head; ListNode curr = head.next;` — we set up two "pointers" (references): `prev` starts at the first node, `curr` starts at the second node. This way, `curr` is always the node we're currently examining, and `prev` is always the node right before it.
* `int position = 1;` — since `curr` starts at the *second* node (index 1, if we imagine array-style indexing), we initialize our position counter to `1` to match.
* `while (curr != null && curr.next != null)` — we keep looping as long as `curr` exists AND `curr` has a next node — because without both a previous node (`prev`, guaranteed to exist here) and a next node (`curr.next`), `curr` can never be a critical point, so there's no point checking it.
* `boolean isMax = curr.val > prev.val && curr.val > curr.next.val;` — checks: is the current node's value strictly bigger than *both* its previous and next neighbor's values? If so, it's a local maxima.
* `boolean isMin = curr.val < prev.val && curr.val < curr.next.val;` — same idea, but checking for strictly smaller than both, meaning local minima.
* `if (isMax || isMin) { criticalPositions.add(position); }` — if either condition is true, we record this position as a critical point.
* `prev = curr; curr = curr.next; position++;` — this is how we "slide the window" forward: what was `curr` becomes the new `prev`, we move `curr` one step further using `.next`, and we increment our manual position counter to match.
* After the loop, `criticalPositions` holds every critical point's position, in increasing order (since we found them while walking left to right).
* `if (criticalPositions.size() < 2) return new int[]{-1, -1};` — the problem says if there are fewer than 2 critical points, we can't compute any distance, so we return `[-1, -1]` immediately.
* The nested `for` loops — `i` picks one critical position, `j` (starting right after `i`) picks another; together they examine every possible pair exactly once (never comparing something to itself, and never comparing the same pair twice).
* `int gap = criticalPositions.get(j) - criticalPositions.get(i);` — since our list is in increasing order and `j > i`, this gap is always positive.
* `minDistance = Math.min(minDistance, gap); maxDistance = Math.max(maxDistance, gap);` — we keep running track of the smallest and largest gap seen across all pairs.

---

## 10. Why Is the Brute Force Solution Not Ideal?

Imagine a linked list with 100,000 nodes, arranged so that roughly half of them (about 50,000) end up being critical points (values zig-zagging up and down the whole way, like `1,3,1,3,1,3,...`). Comparing every pair among 50,000 critical points means roughly `50,000 × 50,000 / 2`, which is over a billion comparisons — way too slow for a single test case. We need a way to compute the answer using far fewer comparisons.

---

## 11. Find the Better Approach

> "Can we avoid doing unnecessary work?"

Yes — remember our two realizations from Section 7:

1. **`maxDistance` only ever needs the FIRST and LAST critical point positions** — nothing in between matters at all for computing it.
2. **`minDistance` only ever needs to compare each critical point to the ONE right before it** (the "previous" critical point found), never to any critical point further back.

```text
Brute Force:
Collect all critical positions
        ↓
Compare every pair → O(k²)
        ↓
Realize: max gap is always (last - first)
        ↓
Realize: min gap is always between two CONSECUTIVE critical points
        ↓
Track "first found" and "most recently found" as we scan
        ↓
One single pass, no pair-comparisons needed at all
```

---

## ⭐ Key Insight

### Before the insight
We were thinking we'd need to gather every critical point first, then go back and compare all of them against each other to find the best min/max gaps.

### The problem
Comparing all pairs is wasteful — most of that comparison work turns out to be completely unnecessary once we understand the structure of the positions.

### The insight
Since critical point positions only ever **increase** as we scan through the list (we find them in left-to-right order, never out of order), two facts become guaranteed:
* The gap between the very first critical point found and the very last one found is **always at least as large** as the gap between any other two critical points — because any "inner" pair is, by definition, squeezed inside that outer span. So `maxDistance = lastCriticalPos - firstCriticalPos`, always, no comparison needed.
* The smallest possible gap between any two critical points must be between two that are **immediately next to each other** in the found-order — if you skip over a middle critical point to compare two further-apart ones, that gap can only be equal to or bigger than the sum of the smaller consecutive gaps, never smaller. So we only ever need to compare **consecutive pairs**, which we can do live, as we scan, using just one "previous critical point" variable.

### After the insight
We never need to store the full list of critical positions at all (though it's fine to, for clarity) — we can compute the entire answer in a **single left-to-right pass**, updating a few running variables: the first critical position found, the most recently found critical position, and running min/max values.

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 3** to see a slightly different case.

```text
head = [1, 3, 2, 2, 3, 2, 2, 2, 7]
```

| Position | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| Value | 1 | 3 | 2 | 2 | 3 | 2 | 2 | 2 | 7 |

We scan positions 1 through 7 (positions 0 and 8 can never qualify).

| Position | Prev | Curr | Next | isMax? | isMin? | Critical? | firstCriticalPos | prevCriticalPos | minDistance so far | lastCriticalPos so far |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | 3 | 2 | Yes (3>1 and 3>2) | — | **Critical (max)** | set to 1 | none yet | ∞ (nothing to compare) | 1 |
| 2 | 3 | 2 | 2 | No | No (2 is not < 2, they're equal — "strictly smaller" fails) | Not critical | 1 | 1 | ∞ | 1 |
| 3 | 2 | 2 | 3 | No | No | Not critical | 1 | 1 | ∞ | 1 |
| 4 | 2 | 3 | 2 | Yes (3>2 and 3>2) | — | **Critical (max)** | 1 (unchanged) | 1 → gap = 4-1=3 | 3 | 4 |
| 5 | 3 | 2 | 2 | No | No (equal, not strictly smaller) | Not critical | 1 | 4 | 3 | 4 |
| 6 | 2 | 2 | 2 | No | No | Not critical | 1 | 4 | 3 | 4 |
| 7 | 2 | 2 | 7 | No | No | Not critical | 1 | 4 | 3 | 4 |

After the full scan: `firstCriticalPos = 1`, `lastCriticalPos = 4`, `minDistance = 3` (the only consecutive gap we found, between positions 1 and 4).

`maxDistance = lastCriticalPos - firstCriticalPos = 4 - 1 = 3`.

Final answer: `[3, 3]` ✔️ matches the expected output! This also nicely demonstrates *why* equal neighboring values (like the repeated `2`s) never count as critical — the condition requires **strictly** greater or smaller.

---

## 14. Optimized Code

```java
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public int[] nodesBetweenCriticalPoints(ListNode head) {
        int firstCriticalPos = -1;
        int prevCriticalPos = -1;
        int minDistance = Integer.MAX_VALUE;
        int currentPosition = 1;

        ListNode prev = head;
        ListNode curr = head.next;

        while (curr.next != null) {
            boolean isMax = curr.val > prev.val && curr.val > curr.next.val;
            boolean isMin = curr.val < prev.val && curr.val < curr.next.val;

            if (isMax || isMin) {
                if (firstCriticalPos == -1) {
                    firstCriticalPos = currentPosition;
                } else {
                    minDistance = Math.min(minDistance, currentPosition - prevCriticalPos);
                }
                prevCriticalPos = currentPosition;
            }

            prev = curr;
            curr = curr.next;
            currentPosition++;
        }

        if (firstCriticalPos == -1 || prevCriticalPos == firstCriticalPos) {
            return new int[]{-1, -1};
        }

        int maxDistance = prevCriticalPos - firstCriticalPos;
        return new int[]{minDistance, maxDistance};
    }
}
```

```javascript
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
class Solution {
    nodesBetweenCriticalPoints(head) {
        let firstCriticalPos = -1;
        let prevCriticalPos = -1;
        let minDistance = Infinity;
        let currentPosition = 1;

        let prev = head;
        let curr = head.next;

        while (curr.next !== null) {
            const isMax = curr.val > prev.val && curr.val > curr.next.val;
            const isMin = curr.val < prev.val && curr.val < curr.next.val;

            if (isMax || isMin) {
                if (firstCriticalPos === -1) {
                    firstCriticalPos = currentPosition;
                } else {
                    minDistance = Math.min(minDistance, currentPosition - prevCriticalPos);
                }
                prevCriticalPos = currentPosition;
            }

            prev = curr;
            curr = curr.next;
            currentPosition++;
        }

        if (firstCriticalPos === -1 || prevCriticalPos === firstCriticalPos) {
            return [-1, -1];
        }

        const maxDistance = prevCriticalPos - firstCriticalPos;
        return [minDistance, maxDistance];
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `int firstCriticalPos = -1;` — will hold the position of the first critical point we ever find. We start it at `-1` to mean \"not found yet\" (a valid position can never actually be `-1`, so this is a safe \"empty\" marker).
* `int prevCriticalPos = -1;` — will hold the position of the *most recently found* critical point, updated every time we find a new one. Also starts as \"not found yet.\"
* `int minDistance = Integer.MAX_VALUE;` — we start this at the largest possible integer value, so that the very first real gap we compute is guaranteed to be smaller than it, and will correctly become our new minimum (this is the same \"start with an impossibly bad value, then improve it\" trick from other problems).
* `int currentPosition = 1;` — our manual position counter, matching where `curr` starts (the second node).
* `ListNode prev = head; ListNode curr = head.next;` — set up our two walking references, same as brute force: `prev` trails one step behind `curr`.
* `while (curr.next != null)` — we loop as long as `curr` has a next node (meaning `curr` isn't the very last node). We don't need to separately check `curr != null` here, because `curr` starts at `head.next` and the problem guarantees at least 2 nodes exist, so `curr` is never `null` going into a valid iteration.
* `boolean isMax = ...; boolean isMin = ...;` — exactly the same critical-point check as brute force: strictly bigger than both neighbors, or strictly smaller than both.
* `if (isMax || isMin) { ... }` — whenever we find a critical point:
  * `if (firstCriticalPos == -1)` — if this is the *first* critical point we've ever seen (our \"first\" tracker is still unset), we record its position as `firstCriticalPos`. We do NOT compute a gap here, since there's nothing before it to compare to yet.
  * `else { minDistance = Math.min(minDistance, currentPosition - prevCriticalPos); }` — otherwise, this is at least our *second* critical point (or later), so we compute the gap between this one and the immediately previous critical point we found, and update `minDistance` if this gap is smaller than anything seen so far.
  * `prevCriticalPos = currentPosition;` — regardless of which branch we took, we always update \"most recently found critical point\" to be this one, so the *next* critical point (if any) can correctly compare against it.
* `prev = curr; curr = curr.next; currentPosition++;` — slide our window forward by one node, same as brute force.
* After the loop: `if (firstCriticalPos == -1 || prevCriticalPos == firstCriticalPos)` — this checks: did we find *zero* critical points at all (`firstCriticalPos` never got set), OR did we find *exactly one* critical point (in which case `prevCriticalPos` would have only ever been set to the same value as `firstCriticalPos`, since the `else` branch — which updates `prevCriticalPos` after the first — never ran)? Either way, that's fewer than 2 critical points, so we return `[-1, -1]`.
* `int maxDistance = prevCriticalPos - firstCriticalPos;` — by the time we reach here, `prevCriticalPos` holds the position of the *very last* critical point found (since it gets overwritten every time), and `firstCriticalPos` holds the very first one — exactly the pair we proved gives the maximum distance.
* `return new int[]{minDistance, maxDistance};` — return our final answer.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case (fewer than 2 critical points)
`head = [3, 1]`. Here `curr = head.next` is the node with value `1`, and `curr.next` is `null` immediately — so the `while (curr.next != null)` loop body never executes even once! `firstCriticalPos` stays `-1` → Output: `[-1, -1]` ✔️

### Example 2 — Different Case
`head = [5,3,1,2,5,1,2]` → dry-ran conceptually in Section 6 → Output: `[1, 3]` ✔️

### Example 3 — Edge Case
`head = [1,3,2,2,3,2,2,2,7]` → dry-ran in Section 13 → Output: `[3, 3]` ✔️

---

## 17. Edge Cases

* **List has only 2 nodes** → `curr.next` is `null` right away, loop never runs, `firstCriticalPos` stays `-1` → return `[-1, -1]` (there's no possible \"middle\" node with both a previous and next neighbor).
* **List has exactly one critical point** → `firstCriticalPos` gets set once, but `prevCriticalPos` ends up equal to `firstCriticalPos` (since the `else` branch that would update it differently never executes for a second point) → we correctly detect this via `prevCriticalPos == firstCriticalPos` and return `[-1, -1]`.
* **All values are identical** (e.g., `[2,2,2,2]`) → no node is ever *strictly* bigger or smaller than its neighbors → zero critical points found → `[-1, -1]`.
* **Critical points are adjacent in *value* pattern but not truly \"back to back\" in a zigzag** — doesn't matter; our algorithm only cares about *positions* of found critical points, which naturally handles any spacing.
* **Very long list (up to 100,000 nodes)** — our single-pass approach handles this efficiently, unlike the brute-force pairwise comparison.
* **First and last actual list nodes look locally \"extreme\"** — irrelevant, since they're structurally excluded from ever being checked (no previous/next respectively) by our loop bounds.

---

## 18. Time Complexity

**What is time complexity?** It's a way of estimating how the amount of work grows as the input grows — like noticing that reading a book twice as long takes roughly twice as long to read, using a general rule rather than a stopwatch.

```text
Brute Force:
O(n) to scan + O(k²) to compare all critical point pairs
= O(n²) in the worst case (when k is proportional to n)

Optimized:
O(n) — a single pass through the list, constant work per node
```

**Why:** In the optimized version, we visit each node exactly once, and at each node we do only a small, fixed amount of work (a couple of comparisons and variable updates) — no matter how many critical points we've found so far, checking a new one against \"the previous one\" is always instant, since we only keep track of a single number (`prevCriticalPos`), never a growing list to search through. Compare this to brute force, where as more critical points pile up, comparing all of them to each other gets slower and slower — like re-checking your entire guest list every time one more person RSVPs, instead of just noting \"how far apart is this RSVP from the last one?\"

---

## 19. Space Complexity

* We only ever store a small, fixed number of extra variables: `firstCriticalPos`, `prevCriticalPos`, `minDistance`, `currentPosition`, `prev`, `curr` — none of these grow as the list grows.
* We don't build any list, array, or other structure that scales with `n` (unlike the brute-force version, which stored every critical position in an `ArrayList`).

So extra space used is `O(1)` — constant, regardless of how long the linked list is.

---

## 20. Common Mistakes Beginners Make

❌ \"I should check if the head node or the last node is a critical point too.\"
✅ The problem explicitly rules this out — a node can only be critical if it has *both* a previous and a next node, which the first and last nodes never do.

❌ \"Local maxima/minima just means bigger or smaller than the immediate neighbors — equal counts too.\"
✅ The comparison must be **strictly** greater or strictly smaller. If a neighbor has the *exact same* value, that node cannot be a critical point (this trips people up with repeated/plateau values, like in Example 3).

❌ \"I need to store all critical positions in a list and compare every pair to be safe.\"
✅ You only need the *first* and *last* found positions for `maxDistance`, and *consecutive* pairs for `minDistance` — storing everything and comparing all pairs is unnecessary extra work (and slower).

❌ \"I can just use array indices since it's basically like an array.\"
✅ It's a linked list — there's no `nums[i]` here. You must manually track position with a counter variable as you walk using `.next`, since linked lists don't support direct indexing.

❌ \"I'll check `curr != null` in my loop condition.\"
✅ Since we need `curr.next` to exist too (to check the \"next neighbor\"), the real stopping condition should be based on `curr.next != null` — and since the problem guarantees at least 2 nodes, `curr` itself (starting at `head.next`) is safely non-null throughout.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Local maxima / local minima"
"Peak" or "valley" detection
"Distance between two positions/indices" in a sequential structure
"Previous and next" comparisons while scanning
"Fewer than two ... return [-1, -1]" (a common 'not enough data' guard)
```

Whenever you're scanning a sequence and only need to compare each element to its **immediate neighbors** (not the whole sequence), and the final answer involves gaps between *found* positions, think: **track "first found" and "most recent found" as you scan — you rarely need to store everything and compare all pairs.**

---

## 22. Interview Thinking

```text
1. Understand the input    → a singly linked list of positive integers
2. Understand the output   → [minDistance, maxDistance] between critical points, or [-1,-1]
3. Try brute force         → collect all critical positions, then compare every pair
4. Find what makes it slow → comparing all pairs is O(k²), unnecessary work
5. Identify repeated work  → we don't need old critical points once a newer one appears
                              (for min); we don't need "middle" ones at all (for max)
6. What can be stored?     → just the first-found position and the most-recent-found position
7. Optimize                → single pass, update min/max running values as we go
8. Check edge cases        → fewer than 2 critical points, adjacent equal values, short lists
9. Analyze complexity      → O(n) time, O(1) space
```

Applied here: recognizing that max-distance only needs the two extreme endpoints, and min-distance only needs consecutive comparisons, collapses an apparent \"compare everything\" problem into a simple single pass.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why is it guaranteed that `maxDistance` is always exactly `(position of last critical point) - (position of first critical point)`, and never some other pair?
2. If we find critical points at positions `2, 5, 9, 20`, what is `minDistance`? (Hint: you don't need to check `9-2` or `20-2`.)
3. Why do we start `minDistance` at `Integer.MAX_VALUE` instead of, say, `0`?

<br>

## Answer to Mini Challenge

1. Because critical point positions are discovered in strictly increasing order as we scan left to right, the very first one is the smallest position and the very last one is the largest position among all critical points — so the gap between them is automatically the largest possible gap you could form from any two critical points in the whole set.
2. `minDistance = 3`, from the gap `5 - 2 = 3`, since `9 - 5 = 4` and `20 - 9 = 11` are both larger. We only ever needed to compare consecutive pairs: `(2,5)`, `(5,9)`, `(9,20)` — never the non-consecutive ones.
3. We start at `Integer.MAX_VALUE` because we're about to repeatedly take the *minimum* of this variable and newly computed gaps — starting \"impossibly high\" guarantees that the very first real gap we compute will correctly replace it, the same trick used whenever you're hunting for a running minimum.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Find every local max/min node in a linked list (by position), then report the smallest and largest gap between any two of them.

## 🔑 Main Idea
The maximum distance is always between the very first and very last critical point found; the minimum distance is always between two consecutive critical points — so a single left-to-right pass, tracking only \"first found\" and \"most recently found,\" is enough.

## ⚙️ Algorithm
1. Walk the list with two references (`prev`, `curr`), tracking position manually.
2. At each \"middle\" node (has both a previous and next), check if it's a local maxima or minima.
3. On finding a critical point: if it's the first one, just record its position. Otherwise, compute the gap to the previous critical point and update `minDistance`.
4. Always update \"most recently found critical point\" after checking.
5. After the scan: if fewer than 2 critical points were found, return `[-1,-1]`. Otherwise, `maxDistance` = last found position − first found position.

## ⏱️ Complexity
Time: `O(n)`
Space: `O(1)`

## 🎯 Pattern to Remember
\"Scan once, track first + most-recent\" beats \"collect everything, then compare all pairs\" whenever max needs only the extremes and min needs only neighbors.

---

## 25. Beginner Quiz

1. **(Understanding)** Why can the head node and the tail node of the list never be critical points, no matter what their values are?
2. **(Basic concept)** What's the difference between checking `curr.val > prev.val` (not strict... wait, it IS strict) versus using `>=` instead of `>` — why would that be wrong here?
3. **(Logic)** Why don't we ever need to compare a critical point to one that is two or more critical points back (not the immediately previous one)?
4. **(Dry run)** For `head = [2, 1, 5, 3, 1]`, find all critical points (by position) and compute `[minDistance, maxDistance]`.
5. **(Complexity/pattern)** Why is this solution `O(n)` and `O(1)` space instead of needing an array to store all node values first, and what key phrase in the problem (\"previous and next node\") should make you think of a \"sliding trio\" scan rather than random access?
