---
title: "3568. Minimum Moves to Clean the Classroom"
slug: 'minimum-moves-to-clean-the-classroom'
date: '2026-09-01'
difficulty: 'Hard'
platform: 'LeetCode POTD'
timeComplexity: 'O(R * C * Energy * 2^L)'
spaceComplexity: 'O(R * C * Energy * 2^L)'
tags: ['BFS', 'Bitmask', 'Grid', 'Graph']
excerpt: "Find the minimum total number of moves needed to collect all litter in a grid classroom using state-space BFS with bitmasks and energy tracking."
---

# 3568. Minimum Moves to Clean the Classroom

This one is meaningfully harder than the previous problems — it introduces two new big ideas (BFS and bitmasks) — so let's build up carefully, same structure as before.

---

## 1. Problem in Very Simple Language

You're in a classroom represented as a grid of rows and columns. Each cell is one of:

* `'S'` — where the student starts (exactly one of these).
* `'L'` — a piece of litter that must be picked up (there are at most 10 of these).
* `'R'` — a "recharge station." Stepping on it fully restores the student's energy, no matter how little energy they had left.
* `'X'` — a wall/obstacle. The student can never step here.
* `'.'` — just empty floor, walk through freely.

The student also has a maximum energy capacity, `energy`, and starts completely full. Every single step (up/down/left/right to a neighboring cell) costs exactly 1 energy. If energy would hit 0 and the student isn't standing on an `'R'`, they're stuck — they cannot take another step unless they're on a reset tile.

**Goal:** find the minimum total number of moves needed to walk over *every* `'L'` cell at least once (collecting all litter), or return `-1` if it's impossible no matter what path is taken.

* **What's given:** the grid, and the energy capacity.
* **What to find:** the shortest walking path (respecting obstacles and the energy/recharge rule) that touches every litter cell.
* **What to return:** the number of moves in that shortest path, or `-1`.

---

## 2. Real-Life Analogy

Imagine a robot vacuum with a battery that only lasts, say, 20 minutes of driving. Scattered around the house are 10 dirty spots it must visit, some walls it can't drive through, and a few charging pads that instantly top the battery back to full the moment it drives over one — no matter how low the battery was.

The robot needs to plan a route that hits all 10 dirty spots, is allowed to swing by charging pads as many times as it likes along the way, but can never let the battery hit zero anywhere except *while standing on* a charging pad. You want the *shortest possible total driving time* (in minutes) that gets every spot cleaned.

---

## 3. Important Programming Concepts I Need First

### Grid / 2D Array
* **Concept:** A grid is just a 2D array — rows and columns of cells, each reachable by `grid[row][col]`.
* **Why we need it:** The classroom itself is the input, given as an array of strings (each string is one row).

### Queue (new!)
* **Concept:** A queue is a "first in, first out" (FIFO) structure — like a line at a coffee shop: whoever joined the line first gets served first. You add items at the back (`enqueue`/`offer`) and remove items from the front (`dequeue`/`poll`).
* **Simple Example:** Add `A`, then `B`, then `C` → the queue is `[A, B, C]` → removing gives you `A` first, then `B`, then `C`.
* **Why we need it:** We're about to use **BFS** (below), and BFS *always* uses a queue to control the order in which we explore things.

### Breadth-First Search (BFS) (new — the central idea of this problem!)
* **Concept:** BFS is a way to explore a graph (or grid) "layer by layer" — first you look at everything reachable in 1 step, then everything reachable in exactly 2 steps, then 3, and so on. Because it expands in complete layers, **the very first time BFS reaches some target, that's guaranteed to be via the shortest possible number of steps.** This makes BFS the standard tool whenever a problem asks for a *minimum number of moves/steps* on a grid, with all moves costing the same (1 each).
* **Simple Example:** Starting at a cell, BFS visits all 4 direct neighbors first (distance 1), then all cells reachable from those (distance 2), etc., never revisiting a cell once it's been reached.
* **Why we need it:** The entire problem is "minimum number of moves" — a textbook signal for BFS.

### State (a very important concept for this problem)
* **Concept:** Normally in a grid BFS, "where you are" (just row, column) is enough information to know what you can do next. But here, two students standing on the *exact same cell* might be able to do very different things depending on **how much energy they have left** and **which litter they've already picked up** — so "state" here must include more than position. A *state* is simply "all the information needed to know exactly what happens next."
* **Why we need it:** This problem's state is `(row, column, energy remaining, which litter collected so far)` — not just `(row, column)`.

### Bitmask (new!)
* **Concept:** A bitmask is a compact way to represent "which items from a small set have been chosen," using the binary digits (bits) of a single number. If you have up to 10 litter items, number them `0` through `9`. A number's bit at position `i` being `1` means "litter item `i` has been collected"; `0` means "not yet." For example, if litter items `0` and `2` are collected but not `1`, the mask in binary is `101`, which is the number `5`.
* **Simple Example:** With 3 litter items, `mask = 0` means "none collected," `mask = 7` (binary `111`) means "all 3 collected." Checking bit `i`: `(mask >> i) & 1`. Setting bit `i`: `mask | (1 << i)`.
* **Why we need it:** Since there are at most 10 litter pieces, there are at most `2^10 = 1024` possible "which ones are collected" combinations — small enough to treat as just another number in our state, instead of tracking a whole separate list/set.

### 4-directional movement
* **Concept:** From any cell `(r, c)`, the 4 neighbors are `(r-1,c)` up, `(r+1,c)` down, `(r,c-1)` left, `(r,c+1)` right.
* **Why we need it:** Every move in this problem is exactly one of these 4 steps.

### Array (multi-dimensional, for tracking "have I already visited this exact state?")
* **Concept:** Just like a 1D array has one index, we can have arrays indexed by multiple things at once (conceptually a 4D array here: row, column, energy, mask).
* **Why we need it:** BFS needs to avoid revisiting the exact same state twice (otherwise it could loop forever or waste huge amounts of time) — we need a fast way to check "have I been in this exact (position, energy, collected-so-far) situation before?"

---

## 4. Understand the Input

Take Example 2:
```text
classroom = ["LS", "RL"]
energy = 4
```

This is a 2-row, 2-column grid:

| | col 0 | col 1 |
|---|---|---|
| **row 0** | `L` | `S` |
| **row 1** | `R` | `L` |

* The student starts at `(0, 1)` (row 0, col 1), the `'S'` cell, with `4` energy.
* There are two litter cells: `(0,0)` and `(1,1)`.
* There's one recharge cell at `(1,0)`.
* No obstacles here.
* We need to find the fewest moves to visit both `(0,0)` and `(1,1)`, potentially passing through `(1,0)` if the energy math requires it, without ever running out of energy off of an `'R'`.

---

## 5. Understand the Output

Output: `3`

* Path: `(0,1) → (0,0)` [collect litter #1, energy: 4→3] → `(1,0)` [step on R, energy resets to 4] → `(1,1)` [collect litter #2, energy: 4→3].
* That's 3 total moves, and litter is fully collected. There's no way to do it in fewer moves (you need at least 1 move to reach each litter cell from a shared adjacent cell, and here neither litter cell is adjacent to the other, so at least 3 moves are structurally required, and 3 is achievable) — so `3` is optimal.
* Notice the recharge wasn't even strictly needed for the *energy* here (energy stayed positive throughout even without it) — it's just naturally on the shortest path between the two litter pieces. In harder cases, you'd be *forced* through an `'R'` purely to survive long stretches without running out of energy.

---

## 6. Solve the Example Manually

Let's manually reason through **Example 3**, since it's the trickiest (`-1` case):

```text
classroom = ["L.S", "RXL"]
energy = 3
```

Grid:

| | col 0 | col 1 | col 2 |
|---|---|---|---|
| **row 0** | `L` | `.` | `S` |
| **row 1** | `R` | `X` | `L` |

Student starts at `(0,2)` with energy `3`.

Let's see what's reachable:
* From `(0,2)`, moves left to `(0,1)` [energy 3→2], then `(0,0)` [energy 2→1] — that's litter #1 collected, using 2 moves, energy left = 1.
* From `(0,0)`, energy is 1. Can we get to `(1,0)` (the `R`)? Yes — that's adjacent, 1 move, energy would hit 0 upon arrival, but since `(1,0)` is `'R'`, energy resets to full (3) the instant we land there. 
* Now from `(1,0)` with energy 3 (freshly reset), we need to reach `(1,2)` (litter #2). But `(1,1)` is `'X'` — a wall! We cannot go directly right. Is there any other route from `(1,0)` to `(1,2)`? Going back up to `(0,0)` → `(0,1)` → `(0,2)` → down to `(1,2)`... let's check: `(1,0)→(0,0)` [1 move] `→(0,1)` [1] `→(0,2)` [1] `→(1,2)` [1] = 4 moves, but we only have 3 energy after the reset, and no `R` along this new sub-route. We run out of energy exactly at `(0,2)` (having used all 3), unable to take the 4th move down to `(1,2)`.
* Is there any other path to `(1,2)` at all? The only way into `(1,2)` is from `(0,2)` (above) or `(1,1)` (blocked by `X`). And reaching `(0,2)` from anywhere requires passing through the top row, which (from the `R` at `(1,0)`) costs at least 3 moves just to reach `(0,2)`, leaving 0 energy — not enough for the 4th move into `(1,2)`.
* No matter how we shuffle the order, litter cell `(1,2)` is simply **unreachable** within the energy budget. So the answer is `-1`. ✔️ matches!

This example really shows why we can't just think "shortest path ignoring energy" — the energy budget can make an otherwise-reachable cell permanently unreachable.

---

## 7. Think Like a Programmer

* **What do I know?** The grid layout, where obstacles/recharges/litter are, and the energy cap.
* **What do I need to find?** The minimum moves to touch all litter cells, respecting the energy rule.
* **What can I try?** Since "minimum moves on a grid" is the classic signal for BFS, my first instinct is BFS. But normal grid BFS only tracks position — here I also need to know how much energy I have left (since that affects what moves are even legal) AND which litter I've already picked up (since I need ALL of it, not just any one piece).
* **What happens if I try every possibility?** If I tried every possible *order* of visiting the 10 litter pieces (10! ≈ 3.6 million orderings) and, for each order, tried to find full paths between them, that's technically finite, but doesn't cleanly account for energy carrying over between litter pickups (energy left when you finish leg 1 affects what's affordable on leg 2) — this naive ordering approach gets complicated fast and doesn't obviously give minimum moves easily.
* **Can I make it faster / cleaner?** Yes — bundle *everything relevant* into a single BFS **state**: `(row, col, energy remaining, bitmask of litter collected)`. Now a single BFS, expanding one state at a time, naturally handles "try every order," "track energy correctly across the whole journey (including resets)," and "know exactly when we're fully done (mask is complete)" — all at once, and BFS guarantees the *first* time we reach a "mask is complete" state is via the minimum number of moves.
* **What information should I remember?** For every combination of (cell, energy level, litter collected so far), have I already visited it? If yes, skip it (no point re-exploring identical situations).
* **What pattern do I notice?** This is a "shortest path in an enlarged graph" — the "nodes" of our graph aren't just grid cells, they're `(cell, energy, mask)` triples. Once you see it this way, it's just ordinary BFS on a bigger graph.

---

## 8. Start With the Brute Force Solution

Here, "brute force" and "correct optimized approach" are actually the **same core idea** — full-state BFS — because trying to shortcut it (e.g., ignoring energy, or ignoring litter-order) produces *wrong* answers, not just *slow* ones. So let's build the full-state BFS directly, understanding *why* each piece of the state is necessary, rather than starting from something naively wrong.

**Why full-state BFS works:** Every legal sequence of moves corresponds to some walk through these `(cell, energy, mask)` states. BFS explores all such walks in order of increasing move-count, so the first time it finds any state where `mask` equals "everything collected," that's provably the minimum possible number of moves.

**Time complexity:** Number of distinct states ≤ `(rows × cols) × (energy + 1) × 2^(number of litter)`. With the given limits (`rows, cols ≤ 20`, `energy ≤ 50`, `litter ≤ 10`), that's at most `400 × 51 × 1024 ≈ 20.9 million` states, each with 4 possible moves — a large but *finite and manageable* amount of work for a computer.

**Space complexity:** We need to remember whether each of those ~20.9 million states has been visited — an array of that size.

---

## 9. Explain the Core Idea Piece by Piece

Before jumping to code, let's make sure each part of the state makes sense:

* **Why include `row, col`?** Obviously — we need to know where the student physically is, to know which moves are legal (not into a wall, not off the grid).
* **Why include `energy remaining`?** Because the *same cell* can be in two very different "situations" depending on how much energy is left — with 5 energy left you might be able to reach a far-away litter cell directly, but with 1 energy left from that same cell, you might need to detour through a recharge station first. Two students on the same cell with different energy can have completely different futures — so energy must be part of the state, not just a side detail.
* **Why include the litter bitmask?** Because we need to know the *goal condition*: "have we collected everything?" A student standing on a specific cell having collected litter `{0, 2}` versus having collected `{0, 2, 5}` are in genuinely different situations for the rest of the problem (different amounts of remaining work) — bundling this into the state lets BFS naturally explore "all possible orders" of collection without us having to code that separately.
* **What happens when we step onto an `'R'` cell?** Regardless of what our energy was *before* the move, the moment we land on `'R'`, energy becomes full again. This is a simple rule to encode: `newEnergy = (targetCell == 'R') ? energyCap : currentEnergy - 1`.
* **What happens when we step onto an `'L'` cell?** We simply turn on that litter's bit in the mask: `newMask = mask | (1 << litterIndex)`. (Stepping on an already-collected litter cell again just leaves the bit already-on — no harm, no special case needed.)
* **When can we NOT move at all?** If current energy is `0` and we're not on an `'R'` (but remember: if we're currently on `'R'`, our energy in the state is already full, since we reset it the instant we arrived — so energy being `0` in our state representation always means "genuinely stuck," never "on a recharge tile with 0 shown").

---

## 11. From Idea to Algorithm

```text
Represent every "situation" as (row, col, energy, mask)
        ↓
Start state: (S's row, S's col, full energy, mask = 0)
        ↓
BFS layer by layer, trying all 4 moves from each state
        ↓
Skip any (row, col, energy, mask) we've already visited
        ↓
The MOMENT we pop a state where mask == "all litter collected",
that state's move-count is the answer
        ↓
If BFS runs out of new states without ever completing the mask → -1
```

---

## ⭐ Key Insight

### Before the insight
It's tempting to think of this as "find shortest path to each litter piece separately, then combine," treating energy resets as something to handle per-leg.

### The problem
Energy does **not** reset between litter pickups — only when you physically step on an `'R'` tile. So how much energy you have left when you *start* trying to reach the next litter piece depends entirely on your whole journey so far, not just "which litter is next." Treating legs independently (assuming full energy at the start of each leg) silently gives **wrong answers** whenever a path *needs* to arrive at a litter cell with some energy still in reserve to continue onward, or conversely, a path only barely limps to a litter cell with 0 energy left and *must* detour to a recharge before doing anything else.

### The insight
**Fold energy and "litter collected so far" directly into the definition of a BFS node.** Once you do that, there's no more separate bookkeeping needed for orderings or energy resets — plain BFS, expanding one move at a time, automatically discovers the correct minimum-move journey through any order of litter and any number of recharges, because it's exploring the *true* space of possible situations, not a simplified (and subtly incorrect) approximation of it.

### After the insight
The "hard" combinatorial parts of this problem (which order to visit litter in, when to detour for a recharge) are never explicitly coded at all — they fall out for free from letting BFS explore the full, correctly-defined state graph.

---

## 13. Dry Run (Conceptual) on Example 1

```text
classroom = ["S.", "XL"], energy = 2
```

Grid:

| | col 0 | col 1 |
|---|---|---|
| **row 0** | `S` | `.` |
| **row 1** | `X` | `L` |

There's 1 litter piece (bit 0), at `(1,1)`. Start state: `(row=0, col=0, energy=2, mask=0b0)`, distance 0.

| Move | From state | To state | Distance |
|---|---|---|---|
| 1 | (0,0,e=2,mask=0) | (0,1,e=1,mask=0) [moved right; `(0,1)` is `.`] | 1 |
| 2 | (0,1,e=1,mask=0) | (1,1,e=0,mask=**1**) [moved down; `(1,1)` is `L`, so bit 0 turns on] | 2 |

At distance 2, we reach a state with `mask = 1 = maskFull` (only 1 litter piece exists) → **answer is 2** ✔️. Note that `(1,0)` was never explored at all, since it's `'X'` (obstacle) — BFS simply never generates a move into it.

---

## 14. Optimized Code

```java
import java.util.*;

class Solution {
    public int minMoves(String[] classroom, int energy) {
        int rows = classroom.length;
        int cols = classroom[0].length();
        char[][] grid = new char[rows][cols];
        for (int r = 0; r < rows; r++) {
            grid[r] = classroom[r].toCharArray();
        }

        // Locate the start, and assign each litter cell a bit index
        int startR = -1, startC = -1;
        int[][] litterBit = new int[rows][cols];
        for (int[] row : litterBit) Arrays.fill(row, -1);

        int litterCount = 0;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 'S') {
                    startR = r;
                    startC = c;
                } else if (grid[r][c] == 'L') {
                    litterBit[r][c] = litterCount;
                    litterCount++;
                }
            }
        }

        int maskFull = (1 << litterCount) - 1;
        if (litterCount == 0) {
            return 0; // nothing to collect
        }

        int energyLevels = energy + 1;     // possible energy values: 0..energy
        int maskCount = 1 << litterCount;  // possible litter combinations

        // visited[r][c][e][mask] flattened into one array
        boolean[] visited = new boolean[rows * cols * energyLevels * maskCount];

        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        ArrayDeque<int[]> queue = new ArrayDeque<>(); // {r, c, e, mask, dist}

        int startMask = 0; // 'S' cell is never litter
        int startIdx = encode(startR, startC, energy, startMask, cols, energyLevels, maskCount);
        visited[startIdx] = true;
        queue.add(new int[]{startR, startC, energy, startMask, 0});

        while (!queue.isEmpty()) {
            int[] cur = queue.poll();
            int r = cur[0], c = cur[1], e = cur[2], mask = cur[3], dist = cur[4];

            if (mask == maskFull) {
                return dist;
            }

            if (e == 0) {
                continue; // stuck: no energy and not on a fresh reset
            }

            for (int dir = 0; dir < 4; dir++) {
                int nr = r + dr[dir];
                int nc = c + dc[dir];
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                if (grid[nr][nc] == 'X') continue;

                int newEnergy = (grid[nr][nc] == 'R') ? energy : e - 1;
                int newMask = mask;
                if (litterBit[nr][nc] != -1) {
                    newMask = mask | (1 << litterBit[nr][nc]);
                }

                int idx = encode(nr, nc, newEnergy, newMask, cols, energyLevels, maskCount);
                if (!visited[idx]) {
                    visited[idx] = true;
                    queue.add(new int[]{nr, nc, newEnergy, newMask, dist + 1});
                }
            }
        }

        return -1; // BFS exhausted without ever completing the mask
    }

    private int encode(int r, int c, int e, int mask, int cols, int energyLevels, int maskCount) {
        return ((r * cols + c) * energyLevels + e) * maskCount + mask;
    }
}
```

```javascript
class Solution {
    minMoves(classroom, energy) {
        const rows = classroom.length;
        const cols = classroom[0].length;
        
        let startR = -1, startC = -1;
        const litterBit = Array.from({ length: rows }, () => new Array(cols).fill(-1));
        
        let litterCount = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (classroom[r][c] === 'S') {
                    startR = r;
                    startC = c;
                } else if (classroom[r][c] === 'L') {
                    litterBit[r][c] = litterCount;
                    litterCount++;
                }
            }
        }
        
        const maskFull = (1 << litterCount) - 1;
        if (litterCount === 0) {
            return 0;
        }
        
        const energyLevels = energy + 1;
        const maskCount = 1 << litterCount;
        
        const encode = (r, c, e, mask) => {
            return ((r * cols + c) * energyLevels + e) * maskCount + mask;
        };
        
        const totalStates = rows * cols * energyLevels * maskCount;
        const visited = new Uint8Array(totalStates);
        
        const dr = [-1, 1, 0, 0];
        const dc = [0, 0, -1, 1];
        
        const queue = [];
        let head = 0;
        
        const startMask = 0;
        const startIdx = encode(startR, startC, energy, startMask);
        visited[startIdx] = 1;
        queue.push([startR, startC, energy, startMask, 0]);
        
        while (head < queue.length) {
            const [r, c, e, mask, dist] = queue[head++];
            
            if (mask === maskFull) {
                return dist;
            }
            
            if (e === 0) {
                continue;
            }
            
            for (let dir = 0; dir < 4; dir++) {
                const nr = r + dr[dir];
                const nc = c + dc[dir];
                
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
                if (classroom[nr][nc] === 'X') continue;
                
                const newEnergy = (classroom[nr][nc] === 'R') ? energy : e - 1;
                let newMask = mask;
                if (litterBit[nr][nc] !== -1) {
                    newMask = mask | (1 << litterBit[nr][nc]);
                }
                
                const idx = encode(nr, nc, newEnergy, newMask);
                if (!visited[idx]) {
                    visited[idx] = 1;
                    queue.push([nr, nc, newEnergy, newMask, dist + 1]);
                }
            }
        }
        
        return -1;
    }
}
```

---

## 15. Explain the Code Line by Line

* `char[][] grid = ...` — convert the array of strings into a 2D character grid, so we can index `grid[r][c]` directly.
* The first double loop — scans every cell once to find the single `'S'` (recording `startR, startC`) and to assign each `'L'` cell a unique bit index (`0, 1, 2, ...`), stored in `litterBit[r][c]`. Any cell that isn't litter keeps `-1` in `litterBit`.
* `int maskFull = (1 << litterCount) - 1;` — this produces a number whose lowest `litterCount` bits are all `1` — e.g., with 3 litter pieces, `maskFull = 0b111 = 7`. This is our "everything collected" target.
* `if (litterCount == 0) return 0;` — an edge case: if there's no litter at all, we're already done with zero moves.
* `boolean[] visited = ...` — this is our giant "have I been in this exact `(r, c, e, mask)` situation before?" tracker, flattened into a single 1D array for speed (Java doesn't handle huge multi-dimensional arrays as efficiently as one big 1D array with manual index math).
* `encode(...)` — converts a `(r, c, e, mask)` combination into one unique integer index into that flat `visited` array, similar to how you'd convert a 2D grid position into a 1D array index (`r * cols + c`), just extended with two more "digits" (`e` and `mask`).
* `ArrayDeque<int[]> queue` — our BFS queue. Each entry stores `{row, col, energy, mask, distanceSoFar}` bundled together.
* We seed the queue with the starting state: student's start position, full energy, empty mask, distance `0`. We also immediately mark it visited.
* The main `while (!queue.isEmpty())` loop — this is the heart of BFS: keep pulling the *oldest* item off the front of the queue (guaranteed by the queue's FIFO behavior to be processed in increasing distance order) and process it.
* `if (mask == maskFull) return dist;` — the moment we pop a state where everything's been collected, we're done — and because BFS processes states in non-decreasing distance order, this is guaranteed to be the *minimum* possible distance.
* `if (e == 0) continue;` — if there's no energy left, this state is a dead end; we don't try to generate any moves from it.
* The `for (int dir = 0; dir < 4; dir++)` loop — tries each of the 4 directions.
* Boundary and obstacle checks — skip anything off the grid or blocked by `'X'`.
* `int newEnergy = (grid[nr][nc] == 'R') ? energy : e - 1;` — implements the recharge rule exactly as discussed: full reset if stepping onto `'R'`, otherwise spend 1 energy.
* `newMask` update — if the target cell is litter, turn on its bit; otherwise the mask is unchanged.
* We compute the new state's flat index, and if it's never been visited, we mark it visited and add it to the queue with `dist + 1`.
* If the queue empties out completely without ever hitting `mask == maskFull`, we `return -1` — meaning it's truly impossible.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`["S.", "XL"], energy=2` → dry-ran in Section 13 → Output: `2` ✔️

### Example 2 — Different Case
`["LS", "RL"], energy=4` → BFS explores from `(0,1)`; shortest path to collecting both litter bits is 3 moves (`(0,1)→(0,0)→(1,0)→(1,1)`, mask becomes complete exactly when the litter at `(1,1)` is stepped on) → Output: `3` ✔️

### Example 3 — Edge Case
`["L.X", "RXL"], energy=3` (as reasoned by hand in Section 6) → the state `(1,2)` with the second litter bit set is never generated by BFS, no matter the energy value, because every route into `(1,2)` requires more consecutive moves than any reachable energy level allows → Output: `-1` ✔️

---

## 17. Edge Cases

* **No litter at all (`litterCount == 0`)** → answer is immediately `0`; handled by an early return before BFS even starts.
* **A litter cell is fully walled off** (surrounded by `'X'` with no path in) → BFS simply never reaches any state containing that cell, so `mask == maskFull` is never achieved → `-1`.
* **Energy exactly enough, no slack at all** → still works correctly, since BFS only ever generates a move when `e > 0` at the moment of the move, so it naturally respects "just barely enough energy" paths without any special-casing.
* **Multiple recharge stations, and a path that needs several of them in sequence** → handled naturally, since every time we land on `'R'` in the BFS transition, energy resets, no matter how many times this has already happened along the path.
* **Only 1 litter piece and it's directly reachable with no recharge needed** → works like a normal single-target BFS, degrading gracefully.
* **The grid is 1 row or 1 column** → no special handling needed; the same 4-direction logic just has fewer valid moves in practice (moves off the single row/column are rejected by the boundary check).

---

## 18. Time Complexity

**What is time complexity?** It estimates how much work grows as inputs grow — the same "twice the input, roughly twice (or more) the work" idea as before, just now applied to a state space instead of a plain array.

```text
Total distinct states: (rows × cols) × (energy + 1) × 2^(litterCount)
Bounded by: 20 × 20 × 51 × 1024 ≈ 20.9 million states

Each state generates at most 4 transitions (one per direction)

Overall: O(rows × cols × energy × 2^litterCount)
```

**Why:** Every state is visited (and its 4 neighbors examined) **at most once**, thanks to the `visited` array preventing re-processing. So the total work is proportional to the total number of possible states, times a small constant (4 directions). With the problem's guaranteed small limits (`rows, cols ≤ 20`, `energy ≤ 50`, `litter ≤ 10`), this comes out to roughly 20 million states — large, but a fixed, bounded amount of work a computer can chew through, unlike something that grows explosively (like trying every possible *order* of visiting 10 litter pieces, which would be `10! ≈ 3.6` million *orderings*, each potentially requiring its own separate search — the state-based BFS elegantly avoids needing to enumerate orderings at all).

---

## 19. Space Complexity

* The `visited` boolean array has one entry per possible state: `rows × cols × (energy+1) × 2^litterCount` — up to about 20.9 million `boolean` entries.
* The BFS queue, at any moment, holds a subset of these states (bounded by the same total).

So overall extra space is `O(rows × cols × energy × 2^litterCount)` — the same bound as the time complexity, since we need to remember every state we might visit.

---

## 20. Common Mistakes Beginners Make

❌ "I'll just do BFS on `(row, col)` only, like a normal shortest-path grid problem."
✅ Plain `(row, col)` BFS can't tell the difference between "I'm here with lots of energy" and "I'm here with almost none," nor can it know which litter has already been collected — both are essential to correctness here, not just optimizations.

❌ "I'll compute shortest distances between each pair of key points (S and each L) separately, assuming full energy at the start of each leg, then combine them like a traveling-salesman problem."
✅ This silently assumes energy resets between litter pickups, which isn't true — energy only resets at `'R'` tiles. This approach can give wrong (too optimistic or too pessimistic) answers, as shown conceptually in Section 8's introduction.

❌ "If energy hits exactly 0, but I'm about to *arrive* at an `'R'` cell, that's not allowed."
✅ It's allowed — the check is about whether you have energy *before* making a move (`e > 0` to attempt any move at all), and if the *destination* of that move is `'R'`, the energy resets to full immediately upon arrival, regardless of how little was left just before the move.

❌ "I only need to mark a cell as visited once, regardless of energy or mask."
✅ You must track visited status per *entire state* `(cell, energy, mask)` — the same cell can legitimately be revisited many times throughout a solution, as long as it's with a genuinely new energy level or litter combination not seen before at that cell.

❌ "Since there could be up to 10 litter pieces, I should try all `10!` orderings explicitly."
✅ Unnecessary — folding the collected-litter bitmask into the BFS state already implicitly explores every meaningful ordering, without you ever having to generate permutations by hand.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signal phrases:

```text
"Minimum number of moves/steps" on a grid → strongly suggests BFS
"At most 10/12/15 of some special item" → suggests a bitmask can represent "which ones are done"
"Energy/fuel/keys that reset or get consumed" → suggests the resource must be folded INTO the search state, not handled separately
"Must collect/visit all of X" → often combines naturally with a bitmask-based BFS/DP
```

Whenever a shortest-path problem has some extra resource (energy, keys, fuel) that changes what moves are legal, and/or a small set of "must-visit" items, think: **expand the BFS state to include that resource and/or a bitmask of progress**, rather than trying to handle it as a separate calculation layered on top of plain positional BFS.

---

## 22. Interview Thinking

```text
1. Understand the input    → grid with S/L/R/X/., plus an energy cap
2. Understand the output   → minimum moves to collect all litter, or -1
3. Try brute force         → naive idea: BFS on position alone — quickly realize it's WRONG,
                              not just slow, because energy and progress matter too
4. Find what makes it slow/wrong → position alone doesn't capture enough information
5. Identify what's missing → remaining energy, and which litter has been collected
6. What can be stored?     → fold both into the BFS state itself
7. Optimize                → single BFS over (row, col, energy, mask); first completion = answer
8. Check edge cases        → no litter at all, unreachable litter, multiple recharges needed
9. Analyze complexity      → O(rows × cols × energy × 2^litterCount) time and space
```

Applied here: the real "aha" isn't a clever formula — it's recognizing that the *state itself* was too small, and the fix is enlarging what a BFS "node" represents until it captures everything that actually affects the future.

---

## 23. Mini Challenge

Try these before checking the answers:

1. Why can't we just track `(row, col)` and separately remember "current energy" and "mask" as plain variables outside the BFS state, updating them as we go?
2. If a cell has already been visited with `energy = 5, mask = 0b011`, and later BFS reaches the *same cell* with `energy = 2, mask = 0b011`, should we explore from this new state too, or skip it? Why?
3. Why is it fine to stop and return the answer the *moment* we pop a state with the full mask, instead of continuing to check if some other completion is even shorter?

<br>

## Answer to Mini Challenge

1. Because BFS naturally explores *many different paths at once*, branching in all directions — there isn't just one single "current" energy or mask at any moment; different branches of the search are simultaneously at different cells with different energy/mask combinations. The state must travel *with* each branch, which is exactly what bundling it into the queue entries accomplishes.
2. We should explore it — `(2, 0b011)` is a genuinely different state from `(5, 0b011)` at the same cell, since with less energy remaining, different future moves may or may not be affordable. It's not automatically "worse" in a way that lets us skip it — treating it as unvisited is required for correctness (although as noted in Section 19, this is exactly why the state space includes the energy dimension explicitly, rather than just row/col).
3. Because BFS explores states in strictly non-decreasing order of distance (it processes everything at distance `d` before anything at distance `d+1`), the very first time we encounter a "fully collected" state is guaranteed to have the smallest possible distance — no other completion, found later in the queue, could ever have a smaller distance than one found earlier.

---

## 24. Final Revision

## 🧠 Problem in One Sentence
Find the minimum number of grid moves to collect all litter, where energy depletes with each move and only fully resets when standing on a recharge tile.

## 🔑 Main Idea
Treat `(position, remaining energy, bitmask of litter collected)` as a single BFS state, and run ordinary breadth-first search over this enlarged state space — the first time the mask becomes "everything collected" gives the minimum moves.

## ⚙️ Algorithm
1. Locate the start cell and assign each litter cell a unique bit.
2. BFS from `(start, full energy, mask=0)`, exploring 4 directions per state.
3. On each move: energy resets to full if landing on `'R'`, otherwise drops by 1; mask gains a bit if landing on unlit litter.
4. Skip moves where current energy is 0, and skip states already visited.
5. Return the distance the instant a state with the full mask is popped; if BFS exhausts without that, return `-1`.

## ⏱️ Complexity
Time: `O(rows × cols × energy × 2^litterCount)`
Space: `O(rows × cols × energy × 2^litterCount)`

## 🎯 Pattern to Remember
When a grid shortest-path problem has an extra depletable/resettable resource and a small "must-collect-all" set, enlarge the BFS state to `(position, resource, bitmask)` rather than trying to bolt these on separately.

---

## 25. Beginner Quiz

1. **(Understanding)** Why does energy need to be part of the BFS state instead of just checked as a side condition?
2. **(Basic concept)** If there are 4 litter pieces and you've collected the 2nd and 4th (using 0-indexed positions 0,1,2,3), what is the mask in binary, and as a decimal number?
3. **(Logic)** Why can't we safely assume energy resets to full every time we start heading toward the next litter piece?
4. **(Dry run)** For a tiny 1×3 grid `["S", "L", "R"]` written as a single row `"SLR"` with `energy = 1`, walk through what BFS would do, and give the final answer.
5. **(Complexity/pattern)** Why does this problem's state space multiply `rows × cols × energy × 2^litterCount` instead of just `rows × cols`, and what specific phrase in the problem (about energy resetting) is the clue that a plain positional BFS would be incorrect, not just slow?
