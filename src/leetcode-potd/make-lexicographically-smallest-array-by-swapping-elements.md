---
title: "2948. Make Lexicographically Smallest Array by Swapping Elements"
slug: 'make-lexicographically-smallest-array-by-swapping-elements'
date: '2026-08-29'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(n log n)'
spaceComplexity: 'O(n)'
tags: ['Union-Find', 'Sorting', 'Greedy', 'Graph']
excerpt: "Learn how to find the lexicographically smallest array reachable by swapping elements with difference less than or equal to a limit using sorting and Union-Find."
---

# 2948. Make Lexicographically Smallest Array by Swapping Elements

Let's teach this one from absolute zero too, following the same structure.

---

## 1. Problem in Very Simple Language

You have a list of positive numbers, `nums`, and a number called `limit`.

You are allowed to **swap** any two numbers in the list, but only if the difference between them (ignoring sign) is `limit` or less. You can do this swap **as many times as you want**, on any pair of positions, as long as each individual swap obeys that rule.

Your job: figure out the smallest possible arrangement of the list you can reach, where "smallest" means: compare position by position (like comparing words in a dictionary, but with numbers) — the first list that has a smaller number at the first position where the two lists differ, wins.

* **What's given:** the array `nums`, and the max allowed difference `limit`.
* **What to find:** the arrangement of these same numbers that is lexicographically smallest, reachable using only swaps of numbers that differ by at most `limit`.
* **What to return:** that rearranged array.

---

## 2. Real-Life Analogy

Imagine a row of people standing in line, each holding a card with a number on it (their height, say). Two people are allowed to **swap their cards** only if their heights are close enough — within `limit` of each other. But here's the key trick: if person A can swap with person B, and person B can swap with person C, then even though A and C might be too far apart to swap *directly*, cards can still "travel" from A to C by hopping through B. So really, we should think of people as being sorted into **friend groups** — everyone in a group can (indirectly) trade cards with everyone else in that same group, no matter how many hops it takes, as long as each hop individually satisfies the `limit` rule.

Once we know the friend groups, within each group we can freely rearrange cards among the *positions* that belong to that group, so we should hand out the smallest cards to the earliest (leftmost) positions in each group to make the whole line look as small as possible from left to right.

---

## 3. Important Programming Concepts I Need First

### Array
* **Concept:** A numbered list of values, positions starting at 0.
* **Example:** `nums = [1,5,3,9,8]` — position 0 has `1`, position 4 has `8`.
* **Why we need it:** The entire input and output are arrays.

### Sorting
* **Concept:** Arranging values from smallest to largest.
* **Example:** `[5,3,1]` sorted becomes `[1,3,5]`.
* **Why we need it:** We'll want to look at numbers in increasing order to figure out which ones are "close enough" to chain together.

### Graph
* **Concept:** A collection of "things" (called nodes) with "connections" (called edges) between some pairs of them. Not necessarily roads on a map — it can be *any* relationship.
* **Example:** If numbers `1` and `3` are close enough to swap, draw a connecting line between them. That's an edge in a graph where each number is a node.
* **Why we need it:** We can think of each number as a node, and "these two numbers can be swapped" as an edge. Numbers that are connected (even indirectly, through other numbers) form one big cluster.

### Connected Components (a graph concept)
* **Concept:** If you group all nodes that can reach each other (directly or through a chain of connections) into clusters, each cluster is called a "connected component."
* **Example:** If `1-3` are connected and `3-5` are connected, then `1, 3, 5` are all in the same component, even though `1` and `5` might not be directly connected.
* **Why we need it:** This is *exactly* our "friend group" idea from the analogy — all numbers in one connected component can be freely rearranged among each other's original positions.

### HashMap
* **Concept:** A structure that lets you store and instantly look up a value using a "key" (like looking up a word's meaning using the word itself, instead of reading a whole dictionary page by page).
* **Example:** `groupId → list of numbers`
* **Why we need it:** After finding which group each number belongs to, we need to quickly gather "all the numbers in group 5" together.

### Sorting (again, applied to indices too)
We'll also need to remember *where* (which positions) each number in a group originally came from, then place the sorted numbers back into those sorted positions.

### Union-Find (Disjoint Set Union) — a new, important concept
* **Concept:** A clever data structure specifically built to answer "are these two things in the same group?" and "merge these two groups into one" extremely fast, without needing to actually build and search a full graph every time.
* **Simple Example:** Think of it like a bunch of small friend circles that can merge into bigger friend circles. Each person starts in their own circle. When you learn `A` and `B` are friends, you merge their circles into one. Later, you can instantly ask "are `A` and `C` in the same circle?" even if their connection required many merges.
* **Why we need it for this problem:** After sorting `nums`, we check each pair of *neighboring* sorted values — if they're within `limit`, they belong in the same group. Union-Find lets us build these groups very efficiently as we scan through.

### Time Complexity
We'll need this to explain why our final solution is fast enough for up to 100,000 numbers.

---

## 4. Understand the Input

Take Example 1:
```text
nums  = [1, 5, 3, 9, 8]
limit = 2
```

* `nums` is our starting arrangement of 5 numbers, at positions 0 through 4: position 0 = `1`, position 1 = `5`, position 2 = `3`, position 3 = `9`, position 4 = `8`.
* `limit = 2` means: we're only allowed to directly swap two numbers if their difference is **2 or less**.
* We are looking for: the smallest possible final arrangement, using any sequence of allowed swaps.
* Why does it matter that `3` and `1` are 2 apart? Because `|3 - 1| = 2 <= limit`, so a direct swap between wherever `1` and `3` sit is legal. Similarly `9` and `8` differ by `1 <= 2`, so they can swap too.

---

## 5. Understand the Output

Output: `[1, 3, 5, 8, 9]`

* This is the smallest number placed first, then the next smallest, and so on — it's actually just the fully sorted version of the array!
* Why is this achievable? Because as the explanation shows, `1-3-5` are all within `limit=2` of their neighbors when sorted (`|1-3|=2`, `|3-5|=2`), so they form one big connected group — meaning we can rearrange all three of them freely among their three original positions (0, 1, 2). Likewise `8` and `9` differ by `1`, forming their own group, freely rearrangeable among positions 3 and 4.
* Since each group can be freely sorted internally, and putting the smallest value first within each group is always best for lexicographic order, we sort each group and place the values back into the group's positions in increasing order.

---

## 6. Solve the Example Manually

Let's solve Example 1 by hand.

**Step 1: Sort the numbers to see which ones are \"close\" to each other.**
Sorted: `1, 3, 5, 8, 9`

**Step 2: Walk through the sorted list, checking each pair of neighbors — are they within `limit`?**

| Pair | Difference | ≤ limit (2)? | Same group? |
|---|---|---|---|
| 1, 3 | 2 | Yes | Group together |
| 3, 5 | 2 | Yes | Group together |
| 5, 8 | 3 | No | New group starts |
| 8, 9 | 1 | Yes | Group together |

So our groups (by value) are: `{1, 3, 5}` and `{8, 9}`.

**Step 3: Figure out which original positions each group's numbers came from.**

Original array: `[1, 5, 3, 9, 8]` at positions `[0, 1, 2, 3, 4]`.

* Value `1` was at position 0.
* Value `5` was at position 1.
* Value `3` was at position 2.
* Value `9` was at position 3.
* Value `8` was at position 4.

Group `{1, 3, 5}` occupies **positions** `{0, 1, 2}`.
Group `{8, 9}` occupies **positions** `{3, 4}`.

**Step 4: Within each group, sort the positions AND sort the values, then match smallest value to smallest position.**

Group `{1, 3, 5}`: positions sorted = `[0, 1, 2]`, values sorted = `[1, 3, 5]`. Assign: position 0 → 1, position 1 → 3, position 2 → 5.

Group `{8, 9}`: positions sorted = `[3, 4]`, values sorted = `[8, 9]`. Assign: position 3 → 8, position 4 → 9.

**Step 5: Build the final array from these assignments.**

| Position | 0 | 1 | 2 | 3 | 4 |
|---|---|---|---|---|---|
| Value | 1 | 3 | 5 | 8 | 9 |

Final answer: `[1, 3, 5, 8, 9]` ✔️ matches!

---

## 7. Think Like a Programmer

* **What do I know?** Which pairs of numbers are directly swappable (difference ≤ limit).
* **What do I need to find?** The smallest possible rearrangement.
* **What can I try?** If I try to reason about individual swaps one at a time, I'll get lost — there could be thousands of possible swap sequences. I need a bigger-picture idea.
* **What happens if I try every possibility?** Way too slow — with up to 100,000 numbers, trying different swap sequences directly is hopeless.
* **Can I make it faster?** Yes — realize that swapping is like a \"connection\" between two numbers, and connections chain together transitively (if A can reach B and B can reach C, then A's card can eventually end up where C was, via a chain of legal swaps). This screams \"connected components.\"
* **What information should I remember?** For each number, which group (component) it belongs to, and which original positions belong to that group.
* **What pattern do I notice?** Numbers that are *close in value* (within `limit` of their neighbor, once sorted) end up chained into the same group. This means **sorting first** makes it very easy to spot the groups — you just walk through the sorted list and start a new group whenever the gap to the previous number exceeds `limit`.
* **What should happen at each step?** Within each group, assign the smallest available value to the smallest available position, since that greedily minimizes the array from left to right — and it's always safe to do, because within a group, ALL rearrangements are achievable (we can freely permute).

---

## 8. Start With the Brute Force Solution

**Brute force idea:** Try to simulate the swapping process directly — repeatedly scan for any swappable pair that would improve the lexicographic order, perform it, and repeat until no more improving swaps exist.

**Why it's tempting:** It directly mimics \"do the operation any number of times,\" which is literally what the problem describes.

**Why it's a bad idea in practice:** There's no obvious, cheap way to know *which* swap to do next without deeply understanding the structure — and repeatedly scanning all pairs for a swappable, improving pair takes `O(n^2)` per pass, and might need many passes. With `n` up to 100,000, `n^2` is 10 billion — far too slow.

**Time complexity:** Roughly `O(n^2)` or worse per full attempt, and it's not even guaranteed to be simple to implement correctly (how do you know when you're truly done, or that a locally-improving swap doesn't block a better global rearrangement?).

**Space complexity:** `O(n)` for the array itself.

Since actually writing \"keep swapping while it helps\" correctly is tricky and slow, let's skip straight past this shaky brute force and go directly to reasoning about *structure* (Section 7's insight), which is really the natural next step for this problem. (Unlike Two Sum-style problems, here the \"obvious\" brute force isn't even clearly correct without a lot of extra care — so the real lesson is: recognize the connected-components structure early.)

---

## 9. Why Is a Naive Simulation Not Ideal?

Imagine 100,000 people in a line, and you're trying to figure out the best swap to do next by comparing every pair of people to every other pair, over and over, until nobody wants to swap anymore. Even a single full scan of all pairs is about 10 billion comparisons — your computer would take way too long. We need an approach that figures out the *entire* answer using just a small number of passes over the data, not repeated pairwise scanning.

---

## 11. Find the Better Approach

> "Can we avoid doing unnecessary work?"

Yes — instead of thinking swap-by-swap, think **group-by-group**.

```text
Naive simulation:
Repeatedly find an improving swap and perform it
        ↓
Too slow, and hard to know when to stop
        ↓
Realize: swappability is transitive (chains through equal-or-less differences)
        ↓
This is exactly "connected components" in a graph
        ↓
Build groups using Union-Find, after sorting
        ↓
Within each group, freely place smallest values at smallest positions
        ↓
Fast, correct solution
```

---

## ⭐ Key Insight

### Before the insight
We were thinking about this as a sequence of individual swap actions, trying to decide \"what should I swap right now?\"

### The problem
Individual swaps are hard to reason about directly, and there are too many of them to try.

### The insight
**\"Can swap\" is a transitive relationship** (if A can trade with B, and B can trade with C, then eventually A's value can end up wherever C was, and vice versa, via intermediate swaps) — so all numbers reachable from each other through a chain of legal swaps form one interchangeable group. Within a group, **any rearrangement of that group's values among that group's original positions is achievable.** And once we know that, the best (lexicographically smallest) thing to do within a group is obvious: put the smallest values at the earliest positions.

### After the insight
The whole problem reduces to: (1) find these groups (connected components), (2) for each group, sort its values and sort its positions, and (3) match them up smallest-to-smallest. No simulation of individual swaps needed at all — and finding the groups is fast if we first **sort the numbers**, because then two numbers can only possibly be \"linked\" if they're within `limit`, and if we scan the sorted list, consecutive elements within `limit` of each other are guaranteed to be linkable directly, and this chains naturally into full groups.

---

## 13. Dry Run the Optimized Solution

Let's dry run **Example 2** this time, to see a case with more moving parts.

```text
nums  = [1, 7, 6, 18, 2, 1]
limit = 3
```

**Step 1: Pair each value with its original index, then sort by value.**

Original (value, index) pairs: `(1,0), (7,1), (6,2), (18,3), (2,4), (1,5)`

Sorted by value: `(1,0), (1,5), (2,4), (6,2), (7,1), (18,3)`

**Step 2: Scan through sorted values, grouping consecutive ones that differ by ≤ limit (3).**

| Compare | Values | Difference | ≤ 3? | Same group? |
|---|---|---|---|---|
| (1,0) vs (1,5) | 1, 1 | 0 | Yes | same group |
| (1,5) vs (2,4) | 1, 2 | 1 | Yes | same group |
| (2,4) vs (6,2) | 2, 6 | 4 | No | new group |
| (6,2) vs (7,1) | 6, 7 | 1 | Yes | same group |
| (7,1) vs (18,3) | 7, 18 | 11 | No | new group |

Groups formed (by value, with original index attached):
* Group A: `(1,0), (1,5), (2,4)`
* Group B: `(6,2), (7,1)`
* Group C: `(18,3)`

**Step 3: Within each group, sort by original index, and match to sorted values in order.**

Group A: indices `[0, 4, 5]` (sorted), values `[1, 1, 2]` (already sorted) → position 0 gets 1, position 4 gets 1, position 5 gets 2.

Group B: indices `[1, 2]` (sorted), values `[6, 7]` (already sorted) → position 1 gets 6, position 2 gets 7.

Group C: index `[3]`, value `[18]` → position 3 gets 18.

**Step 4: Assemble the final array.**

| Position | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| Value | 1 | 6 | 7 | 18 | 1 | 2 |

Final answer: `[1, 6, 7, 18, 1, 2]` ✔️ matches the expected output!

---

## 14. Optimized Code

```java
import java.util.*;

class Solution {

    // Union-Find (Disjoint Set Union) helper arrays
    private int[] parent;
    private int[] rank_;

    public int[] lexicographicallySmallestArray(int[] nums, int limit) {
        int n = nums.length;

        // Step 1: initialize Union-Find, one set per index initially
        parent = new int[n];
        rank_ = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }

        // Step 2: create (value, originalIndex) pairs and sort by value
        int[][] pairs = new int[n][2];
        for (int i = 0; i < n; i++) {
            pairs[i][0] = nums[i];
            pairs[i][1] = i;
        }
        Arrays.sort(pairs, (a, b) -> a[0] - b[0]);

        // Step 3: union consecutive sorted values that are within limit
        for (int i = 1; i < n; i++) {
            if (pairs[i][0] - pairs[i - 1][0] <= limit) {
                union(pairs[i][1], pairs[i - 1][1]);
            }
        }

        // Step 4: group original indices by their root (their component)
        Map<Integer, List<Integer>> groupIndices = new HashMap<>();
        for (int i = 0; i < n; i++) {
            int root = find(i);
            groupIndices.computeIfAbsent(root, k -> new ArrayList<>()).add(i);
        }

        // Step 5: for each group, sort the indices, gather+sort the values,
        // and assign smallest value to smallest index
        int[] result = new int[n];
        for (List<Integer> indices : groupIndices.values()) {
            Collections.sort(indices);

            List<Integer> values = new ArrayList<>();
            for (int idx : indices) {
                values.add(nums[idx]);
            }
            Collections.sort(values);

            for (int k = 0; k < indices.size(); k++) {
                result[indices.get(k)] = values.get(k);
            }
        }

        return result;
    }

    // Find the "representative" (root) of the group that index x belongs to
    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]); // path compression
        }
        return parent[x];
    }

    // Merge the groups containing x and y
    private void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return;

        // union by rank, to keep the structure shallow/fast
        if (rank_[rootX] < rank_[rootY]) {
            parent[rootX] = rootY;
        } else if (rank_[rootX] > rank_[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank_[rootX]++;
        }
    }
}
```

```javascript
class Solution {
    lexicographicallySmallestArray(nums, limit) {
        const n = nums.length;
        
        // DSU Arrays
        const parent = new Array(n);
        const rank = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            parent[i] = i;
        }
        
        // Find with path compression
        const find = (x) => {
            if (parent[x] !== x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        };
        
        // Union by rank
        const union = (x, y) => {
            const rootX = find(x);
            const rootY = find(y);
            if (rootX === rootY) return;
            
            if (rank[rootX] < rank[rootY]) {
                parent[rootX] = rootY;
            } else if (rank[rootX] > rank[rootY]) {
                parent[rootY] = rootX;
            } else {
                parent[rootY] = rootX;
                rank[rootX]++;
            }
        };
        
        // Create (value, originalIndex) pairs and sort by value
        const pairs = [];
        for (let i = 0; i < n; i++) {
            pairs.push([nums[i], i]);
        }
        pairs.sort((a, b) => a[0] - b[0]);
        
        // Union consecutive sorted values within limit
        for (let i = 1; i < n; i++) {
            if (pairs[i][0] - pairs[i - 1][0] <= limit) {
                union(pairs[i][1], pairs[i - 1][1]);
            }
        }
        
        // Group indices by root
        const groupIndices = new Map();
        for (let i = 0; i < n; i++) {
            const root = find(i);
            if (!groupIndices.has(root)) {
                groupIndices.set(root, []);
            }
            groupIndices.get(root).push(i);
        }
        
        // Reconstruct result
        const result = new Array(n);
        for (const indices of groupIndices.values()) {
            // Sort positions ascending
            indices.sort((a, b) => a - b);
            
            // Gather and sort values ascending
            const values = indices.map(idx => nums[idx]);
            values.sort((a, b) => a - b);
            
            // Match values to positions
            for (let k = 0; k < indices.length; k++) {
                result[indices[k]] = values[k];
            }
        }
        
        return result;
    }
}
```

---

## 15. Explain Optimized Code Line by Line

* `parent = new int[n]; rank_ = new int[n];` — these two arrays are the core of Union-Find. `parent[i]` tells you \"who is index `i` currently pointing to as its group leader.\" `rank_[i]` is a rough measure of how \"tall\" a group's tree structure is, used just to keep things efficient.
* `for (int i = 0; i < n; i++) parent[i] = i;` — at the very start, every index is its own separate group (pointing to itself).
* `pairs[i][0] = nums[i]; pairs[i][1] = i;` — we bundle each value together with its original position, because after sorting by value, we still need to remember *where* it came from.
* `Arrays.sort(pairs, (a, b) -> a[0] - b[0]);` — sort these pairs purely by value (ascending), keeping the original index attached to each.
* The `for (int i = 1; i < n; i++)` loop with `union(...)` — this is where we build our groups. We check every *consecutive* pair in the sorted-by-value list; if their values are close enough (`≤ limit`), we merge their original indices into the same Union-Find group. We only need to check consecutive pairs because if a chain exists at all, it will show up as a sequence of consecutive \"close enough\" jumps once sorted.
* `find(int x)` — this function walks up the \"parent\" pointers until it finds an index that points to itself (the group's leader / root), and *path compression* (`parent[x] = find(parent[x]);`) flattens the structure as we go, making future lookups faster.
* `union(int x, int y)` — finds each side's group leader; if they're already the same, nothing to do. Otherwise, it attaches one group under the other, using `rank_` to decide which one becomes the new leader (keeping the overall structure shallow, so `find` stays fast).
* `Map<Integer, List<Integer>> groupIndices` — after all unions are done, we go through every index `0..n-1`, ask \"who's your group leader (root)?\", and collect all indices sharing the same leader into one list. This effectively rebuilds our \"friend groups\" from the analogy.
* Inside the `for (List<Integer> indices : groupIndices.values())` loop:
  * `Collections.sort(indices);` — sort the *positions* in this group in increasing order (so we know which position is \"first,\" \"second,\" etc., within the group).
  * We gather all the actual `nums` values that live at those positions, into a list called `values`, then sort *that* list too.
  * `result[indices.get(k)] = values.get(k);` — this is the final matching step: the smallest position in the group gets the smallest value, the second-smallest position gets the second-smallest value, and so on.
* Finally, we return `result`, the completed answer array.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`nums = [1,5,3,9,8], limit = 2` → dry-ran manually in Section 6 → Output: `[1,3,5,8,9]` ✔️

### Example 2 — Different Case
`nums = [1,7,6,18,2,1], limit = 3` → dry-ran in Section 13 → Output: `[1,6,7,18,1,2]` ✔️

### Example 3 — Edge Case (no operations possible at all)
`nums = [1,7,28,19,10], limit = 3`. Sort: `1, 7, 10, 19, 28`. Check consecutive gaps: `7-1=6` (no), `10-7=3` (yes! within limit), `19-10=9` (no), `28-19=9` (no). So `7` and `10` actually *do* form a small group together — but wait, in the original array they're at positions: value `7` is at index 1, value `10` is at index 4. Group `{1(index 1), 4}`: sorted indices `[1,4]`, sorted values `[7,10]` → position 1 gets 7 (unchanged), position 4 gets 10 (unchanged)! Since the group happens to already have its smallest value at its smallest position, nothing visibly changes. All other values are alone in their own groups (no legal swap partner), so they also stay put. Final output: `[1,7,28,19,10]` — unchanged ✔️, matching the expected output, and showing why even a \"matched\" group can result in no visible change if it was already optimally arranged.

---

## 17. Edge Cases

* **Array has only one element** → trivially, it's already the smallest possible arrangement (no swaps needed or possible).
* **No two numbers are within `limit` of each other** → every number is its own group of size 1 → output equals input, unchanged.
* **All numbers are within `limit` of each other (one giant group)** → the entire array becomes fully sorted, just like a normal sort.
* **Duplicate values** → they'll always be within `limit` (difference `0`), so duplicates always end up in the same group as each other (and often pull in more neighbors too).
* **Very large values close to the max (`10^9`)** — since we only ever compute differences between actual array values (never adding unrelated large numbers together in a way that could overflow), we're safe using regular `int` subtraction here in Java, as both values fit well within int range and the difference does too.

---

## 18. Time Complexity

**What is time complexity?** It estimates how the total amount of work grows as your input grows — like estimating that alphabetizing a bigger stack of files takes proportionally longer, using a general rule of thumb rather than a stopwatch.

```text
Sorting the (value, index) pairs:      O(n log n)
Union-Find operations (n unions/finds): O(n) — practically constant time each,
                                         due to path compression + union by rank
Grouping indices by root:               O(n)
Sorting indices and values per group:   O(n log n) total, across all groups combined
                                         (since groups partition all n elements)

Overall: O(n log n)
```

**Why:** The dominant cost is sorting — both the initial sort of all values, and later, all the little per-group sorts (which together touch each element only a constant number of times, but still cost a log factor). Union-Find itself is famously close to `O(1)` per operation on average (technically `O(α(n))`, an extremely slowly-growing function you can safely think of as \"basically constant\"). Compare this to brute-force `O(n^2)` simulation: for `n=100,005`, `n log n` is about 1.7 million operations, while `n^2` would be 10,000,000,000 — a massive, practically-infinite difference in real time.

---

## 19. Space Complexity

* `parent` and `rank_` arrays: size `n` each.
* The `pairs` array: size `n` (each holding 2 numbers).
* The `groupIndices` map and its lists: together hold every index exactly once, so `O(n)` total.
* The `result` array: size `n`.

Overall extra space: `O(n)`.

---

## 20. Common Mistakes Beginners Make

❌ \"I should check every pair of numbers in the array to see if they're within `limit`, and connect them directly.\"
✅ You only need to check **consecutive pairs after sorting** — if a longer chain exists, it will always show up as a sequence of consecutive close-enough jumps in the sorted order, so checking neighbors is enough and much faster.

❌ \"Since I can only directly swap numbers within `limit`, only *directly* swappable pairs can end up trading places.\"
✅ Swaps can chain — if `A` can swap with `B`, and `B` can swap with `C`, then `A`'s value can eventually reach where `C` was (through a sequence of swaps), even if `A` and `C` themselves are too far apart to swap directly.

❌ \"I should sort the whole array and just return that.\"
✅ Full sorting is only correct when *everything* forms one giant group. If some values are too far apart to ever connect (directly or indirectly), those values must stay confined to their own original group's positions — sorting everything blindly would be an illegal rearrangement.

❌ \"I'll assign the smallest position to whatever value happens to come first.\"
✅ You must sort **both** the group's positions and the group's values independently, then match them up smallest-to-smallest — this greedy matching is what actually produces the lexicographically smallest result.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Swap if [some condition] is satisfied"
"Perform the operation any number of times"
"Connected" / "reachable" / "can be grouped"
"Smallest/largest arrangement achievable"
"Union" or "merge" of items based on a threshold or relationship
```

Whenever swapping/merging is allowed **transitively** (through chains, not just direct pairs) and you need to find what's ultimately interchangeable, think **Union-Find / connected components**.

---

## 22. Interview Thinking

```text
1. Understand the input   → array of numbers + a max allowed swap difference
2. Understand the output  → lexicographically smallest achievable rearrangement
3. Try brute force        → simulate swaps directly (too slow, hard to prove correct)
4. Find what makes it slow→ reasoning swap-by-swap instead of structurally
5. Identify repeated work → "can A reach B" is being recomputed many times implicitly
6. What can be stored?    → group membership for each index (Union-Find)
7. Optimize               → sort values, union consecutive close pairs, then match
                             smallest values to smallest positions within each group
8. Check edge cases       → all-isolated, all-one-group, duplicates, single element
9. Analyze complexity     → O(n log n) time, O(n) space
```

Applied here: sorting first exposes the chain structure cheaply, Union-Find captures \"who's ultimately interchangeable with whom,\" and the final greedy match (smallest value ↔ smallest position, per group) finishes the job.

---

## 23. Mini Challenge

Try these before checking the answers:

1. If `nums = [4, 2, 6]` and `limit = 2`, which pairs (by value) are directly within `limit` of each other? Are all three numbers in one group, or split into groups?
2. Once you know the groups from Question 1, and you know which original positions each group's numbers came from, what's the final rule for assigning values back to positions?
3. Why do we only need to compare **consecutive** elements in the sorted array to build all the groups, instead of comparing every pair?

<br>

## Answer to Mini Challenge

1. Sorted: `2, 4, 6`. `|4-2|=2 ≤ 2` (connected), `|6-4|=2 ≤ 2` (connected). So all three end up in **one single group** (2 connects to 4, 4 connects to 6, so 2 and 6 are indirectly linked too, even though `|6-2|=4 > 2` directly).
2. Sort the group's original positions, sort the group's values, then assign the smallest value to the smallest position, the second-smallest value to the second-smallest position, and so on.
3. Because if two values are far apart in *sorted order* with nothing \"in between\" close enough, checking non-consecutive pairs can never reveal a connection that consecutive-pair-checking would miss — any indirect chain between two far-apart values must physically pass through the values sitted between them once sorted, so scanning neighbor-to-neighbor is guaranteed to catch every real connection.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Group numbers that can be transitively swapped (chain of differences ≤ limit), then within each group place the smallest values at the smallest original positions.

## 🔑 Main Idea
\"Can swap\" is transitive, so this is a connected-components problem — solve it with sorting + Union-Find, then greedily match sorted values to sorted positions within each group.

## ⚙️ Algorithm
1. Pair each value with its original index; sort these pairs by value.
2. Union consecutive pairs (by value) whenever their difference is ≤ limit.
3. Group all original indices by their final Union-Find root.
4. For each group: sort its positions, sort its values, assign smallest value → smallest position, and so on.
5. Return the assembled result array.

## ⏱️ Complexity
Time: `O(n log n)`
Space: `O(n)`

## 🎯 Pattern to Remember
Transitive \"can-connect\" relationship + \"make it smallest\" → sort + Union-Find (connected components) + greedy match within each group.

---

## 25. Beginner Quiz

1. **(Understanding)** Why can two numbers end up swappable even if their direct difference is bigger than `limit`?
2. **(Basic concept)** What does a \"connected component\" mean in your own words, using this problem as the example?
3. **(Logic)** Why is it enough to check only *consecutive* elements in the sorted array when building groups, instead of checking all pairs?
4. **(Dry run)** For `nums = [5, 3, 9, 1], limit = 2`, sort the values, identify the groups, and figure out the final answer array.
5. **(Complexity/pattern)** Why is the final time complexity `O(n log n)` rather than `O(n)`, and what key phrase in a problem statement should make you think \"Union-Find / connected components\" in the future?

Take your time — send me your answers whenever you're ready, and I'll walk through them with you!
