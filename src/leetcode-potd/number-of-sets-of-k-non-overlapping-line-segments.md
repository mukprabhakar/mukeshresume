---
title: "1621. Number of Sets of K Non-Overlapping Line Segments"
slug: 'number-of-sets-of-k-non-overlapping-line-segments'
date: '2026-09-16'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(N * K)'
spaceComplexity: 'O(N * K)'
tags: ['Dynamic Programming', 'Prefix Sum', 'Math', 'Combinatorics']
excerpt: "Count the number of ways to draw k non-overlapping line segments over n points using prefix-sum optimized 2D dynamic programming."
---

# 1621. Number of Sets of K Non-Overlapping Line Segments

This is a beautiful combinatorial DP problem where understanding the rules of endpoint sharing leads directly to an additive recurrence, which is then accelerated from $O(N^2 K)$ to $O(NK)$ using running prefix sums. Let's build it up carefully from zero.

---

## 1. Problem in Very Simple Language

You're given $n$ points along a single 1D number line at positions `0, 1, 2, ..., n-1`, and an integer `k`.

You want to draw **exactly `k` line segments** between these points such that:
* Every segment has a length of at least 1 (starts and ends at two different points).
* The segments do **not overlap** — meaning they cannot cross or share any interior line area.
* **Important rule:** Segments **ARE allowed to share endpoints**! For example, one segment can span `(0, 2)` and the next can span `(2, 3)` — touching at point `2` is completely valid.

**Goal:** Calculate the total number of distinct ways to choose and draw these `k` segments. Since the answer can be huge, return it modulo $10^9 + 7$.

* **What's given:** `n` (the number of points, $0 \dots n-1$) and `k` (the number of segments to draw).
* **What to find:** The total number of valid sets of `k` segments.
* **What to return:** That count modulo $10^9 + 7$.

---

## 2. Real-Life Analogy

Imagine a wooden fence with $n$ evenly spaced posts numbered $0$ to $n-1$. You have $k$ rolls of ribbon. You want to stretch each ribbon between two posts so that no ribbons overlap along the railing. Two ribbons can tie to the exact same post (the end of one ribbon can be the start of the next), but they can't double up over the same stretch of rail. You want to count how many distinct ways you can place all $k$ ribbons across the posts.

---

## 3. Important Programming Concepts I Need First

### 1D Coordinates & Segments
* A segment $(u, v)$ with $u < v$ occupies the interval $[u, v]$ with length $v - u \ge 1$.
* Two segments $(u_1, v_1)$ and $(u_2, v_2)$ with $v_1 \le u_2$ do not overlap. When $v_1 = u_2$, they touch at a single point without overlapping interior area.

### 2D Dynamic Programming State
* Let `dp[i][j]` represent the number of ways to place exactly `j` valid segments using only the first `i` points (indices $0 \dots i-1$).
* By building up `i` (number of points available) and `j` (segments needed), we solve the full problem at `dp[n][k]`.

### Prefix Sum Optimization
* If a state depends on the sum of many previous states: $\sum_{q=1}^{i-1} \text{previous}[q]$, recomputing this sum from scratch takes $O(N)$ per cell.
* Maintaining a running cumulative sum as $i$ increases reduces this transition to $O(1)$.

### Modular Arithmetic
* Additions are taken modulo $10^9 + 7$ at every step: `(a + b) % MOD` to prevent integer overflow.

---

## 4. Understand the Input

Take **Example 1**:
```
n = 4, k = 2
```
* The points are `0, 1, 2, 3` (4 points total).
* We need to choose $k = 2$ non-overlapping segments.

Possible combinations:
1. `(0, 1)` and `(1, 2)` (touching at 1)
2. `(0, 1)` and `(2, 3)` (separated by a gap)
3. `(0, 1)` and `(1, 3)` (touching at 1)
4. `(0, 2)` and `(2, 3)` (touching at 2)
5. `(1, 2)` and `(2, 3)` (touching at 2)

Total valid ways = **5**.

---

## 5. Understand the Output

Output: `5` (matches the manual enumeration above).

---

## 6. Solve the Example Manually

Let's manually examine **Example 2**: `n = 3, k = 1`.
* Points available: `0, 1, 2`.
* We need $k = 1$ segment of length $\ge 1$.
* Any pair of distinct points $(u, v)$ with $u < v$ forms a valid segment:
  1. `(0, 1)`
  2. `(1, 2)`
  3. `(0, 2)`
* Total valid ways = **3**. ✔️

Now consider **Example 3**: `n = 3, k = 2`.
* Points available: `0, 1, 2`.
* We need 2 segments. The only way to fit two segments on 3 points without overlap is:
  1. `(0, 1)` and `(1, 2)` (sharing endpoint 1).
* Total valid ways = **1**. ✔️

---

## 7. Think Like a Programmer

* **What do I know?** For any subproblem on the first $i$ points (indices $0 \dots i-1$), let's focus on the rightmost point $x = i-1$.
* **Case 1: Point $i-1$ is NOT used as the right endpoint of ANY segment.**
  * In this case, all $j$ segments must be formed entirely within the first $i-1$ points (indices $0 \dots i-2$).
  * Contribution: `dp[i-1][j]`.
* **Case 2: Point $i-1$ IS the right endpoint of the $j$-th segment.**
  * That segment must start at some point $p$, where $0 \le p \le i-2$.
  * The segment is $(p, i-1)$.
  * Because segments can touch at endpoints, the remaining $j-1$ segments can be drawn using points $0 \dots p$ freely!
  * Points $0 \dots p$ constitute exactly $p+1$ points.
  * Therefore, for a fixed starting point $p$, there are `dp[p+1][j-1]` ways to place the remaining $j-1$ segments.
* **Combining all possible start points $p$:**
  $$\text{Ways} = \sum_{p=0}^{i-2} dp[p+1][j-1] = \sum_{q=1}^{i-1} dp[q][j-1]$$
* **Total Recurrence:**
  $$dp[i][j] = dp[i-1][j] + \sum_{q=1}^{i-1} dp[q][j-1]$$
* **The running sum trick:** As $i$ increases by 1, the sum $\sum_{q=1}^{i-1} dp[q][j-1]$ simply gains one new term: $dp[i-1][j-1]$. By keeping a running `prefixSum`, we compute each cell in $O(1)$!

---

## 8. Start With the Naive DP Solution

Without prefix sum optimization, we'd compute the summation with an inner loop:

```java
// O(N^2 * K) Naive DP
class Solution {
    public int numberOfSets(int n, int k) {
        final int MOD = 1_000_000_007;
        long[][] dp = new long[n + 1][k + 1];

        for (int i = 0; i <= n; i++) {
            dp[i][0] = 1; // 0 segments: 1 way
        }

        for (int j = 1; j <= k; j++) {
            for (int i = 2; i <= n; i++) {
                dp[i][j] = dp[i - 1][j]; // Point i-1 unused
                for (int q = 1; q <= i - 1; q++) { // Resumming from scratch
                    dp[i][j] = (dp[i][j] + dp[q][j - 1]) % MOD;
                }
            }
        }

        return (int) dp[n][k];
    }
}
```

* **Time complexity:** $O(N^2 K)$ — three nested loops. For $N=1000, K=1000$, $N^2 K = 10^9$ operations $\rightarrow$ **Time Limit Exceeded**.
* **Space complexity:** $O(NK)$.

---

## 9. Explain the Naive DP Line by Line

* `dp[i][0] = 1;` — Base case: drawing 0 segments over $i$ points has exactly 1 way (place no segments).
* `for (int j = 1; j <= k; j++)` — Outer loop iterating through segment counts.
* `for (int i = 2; i <= n; i++)` — Middle loop iterating through available points (need at least 2 points to draw $\ge 1$ segment).
* `dp[i][j] = dp[i - 1][j];` — Option 1: point $i-1$ is not used.
* `for (int q = 1; q <= i - 1; q++)` — Option 2: point $i-1$ is the right endpoint; sum over all possible left endpoints.

---

## 10. Why Do We Need Optimization?

Notice that in the naive version, when moving from $i$ to $i+1$, the inner loop computes:
* For $i$: $\sum_{q=1}^{i-1} dp[q][j-1]$
* For $i+1$: $\sum_{q=1}^{i} dp[q][j-1] = \left(\sum_{q=1}^{i-1} dp[q][j-1]\right) + dp[i][j-1]$

The sum for $i+1$ is simply the previous sum plus $dp[i][j-1]$. Recalculating the full sum from $q=1$ every single time is completely redundant!

---

## 11. Find the Better Approach

```text
Naive Transition:
For each (i, j), loop q from 1 to i-1 to sum dp[q][j-1]
        ↓
Cost: O(N) per cell → O(N² K) total (Too Slow!)
        ↓
Realize: The summation is a standard prefix sum over the previous j-1 row
        ↓
Maintain a single variable `prefixSum` as i sweeps from 2 to n:
prefixSum = (prefixSum + dp[i-1][j-1]) % MOD
dp[i][j]  = (dp[i-1][j] + prefixSum) % MOD
        ↓
Cost: O(1) per cell → O(NK) total (Fast & Optimal!)
```

---

## ⭐ Key Insight

### Before the insight
Counting non-overlapping segments with shared endpoints seems tricky because segments can chain together arbitrarily (e.g. $(0,1), (1,2), (2,3)$).

### The problem
Naively tracking whether the previous point was used or searching through all possible cut points leads to complex $O(N^2 K)$ state transitions.

### The insight
**Because touching endpoints are permitted, fixing the rightmost segment $(p, i-1)$ leaves points $0 \dots p$ completely unrestricted.** This means the subproblem to the left is simply $dp[p+1][j-1]$. Summing this over all valid $p$ produces a running prefix sum of the previous DP row, allowing an $O(1)$ state update.

### After the insight
The entire problem collapses into a clean 2D table filled in $O(N K)$ time using a single running accumulator.

---

## 13. Dry Run the Optimized Solution

Let's dry-run **Example 1**: $n = 4, k = 2$.

### Base Row ($j = 0$):
* `dp[0][0] = 1, dp[1][0] = 1, dp[2][0] = 1, dp[3][0] = 1, dp[4][0] = 1`

### Row $j = 1$ (1 segment):
* `prefixSum = 0`
* $i = 2$: `prefixSum = 0 + dp[1][0] = 1` $\rightarrow$ `dp[2][1] = dp[1][1] + 1 = 0 + 1 = 1`
* $i = 3$: `prefixSum = 1 + dp[2][0] = 2` $\rightarrow$ `dp[3][1] = dp[2][1] + 2 = 1 + 2 = 3`
* $i = 4$: `prefixSum = 2 + dp[3][0] = 3` $\rightarrow$ `dp[4][1] = dp[3][1] + 3 = 3 + 3 = 6`

### Row $j = 2$ (2 segments):
* `prefixSum = 0`
* $i = 2$: `prefixSum = 0 + dp[1][1] = 0` $\rightarrow$ `dp[2][2] = dp[1][2] + 0 = 0`
* $i = 3$: `prefixSum = 0 + dp[2][1] = 1` $\rightarrow$ `dp[3][2] = dp[2][2] + 1 = 0 + 1 = 1`
* $i = 4$: `prefixSum = 1 + dp[3][1] = 1 + 3 = 4` $\rightarrow$ `dp[4][2] = dp[3][2] + 4 = 1 + 4 = 5`

Final Answer: `dp[4][2] = 5`. ✔️ Exactly matches!

---

## 14. Optimized Code

```java
class Solution {
    public int numberOfSets(int n, int k) {
        final int MOD = 1_000_000_007;
        long[][] dp = new long[n + 1][k + 1];

        // Base case: 0 segments can always be drawn in exactly 1 way (do nothing)
        for (int i = 0; i <= n; i++) {
            dp[i][0] = 1;
        }

        // Fill the DP table row by row for each segment count j
        for (int j = 1; j <= k; j++) {
            long prefixSum = 0; // Running sum of dp[q][j-1] for q = 1 .. i-1
            for (int i = 2; i <= n; i++) {
                prefixSum = (prefixSum + dp[i - 1][j - 1]) % MOD;
                dp[i][j] = (dp[i - 1][j] + prefixSum) % MOD;
            }
        }

        return (int) dp[n][k];
    }
}
```

```javascript
/**
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var numberOfSets = function(n, k) {
    const MOD = 1000000007;
    const dp = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));

    // Base case: 0 segments can always be drawn in exactly 1 way
    for (let i = 0; i <= n; i++) {
        dp[i][0] = 1;
    }

    // Fill table row by row
    for (let j = 1; j <= k; j++) {
        let prefixSum = 0;
        for (let i = 2; i <= n; i++) {
            prefixSum = (prefixSum + dp[i - 1][j - 1]) % MOD;
            dp[i][j] = (dp[i - 1][j] + prefixSum) % MOD;
        }
    }

    return dp[n][k];
};
```

---

## 15. Explain Optimized Code Line by Line

* `final int MOD = 1_000_000_007;` — modulo constant to prevent integer overflow.
* `long[][] dp = new long[n + 1][k + 1];` — `dp[i][j]` stores ways to form `j` segments from `i` points.
* `for (int i = 0; i <= n; i++) dp[i][0] = 1;` — base case: drawing 0 segments has 1 way.
* `for (int j = 1; j <= k; j++)` — outer loop increments segment target from 1 to $k$.
* `long prefixSum = 0;` — initializes the running accumulator for the $(j-1)$-th row.
* `for (int i = 2; i <= n; i++)` — inner loop sweeps through available point counts.
* `prefixSum = (prefixSum + dp[i - 1][j - 1]) % MOD;` — adds the new potential left endpoint option $dp[i-1][j-1]$ into the running sum.
* `dp[i][j] = (dp[i - 1][j] + prefixSum) % MOD;` — combines the option where point $i-1$ is unused with all options where point $i-1$ serves as the right endpoint.
* `return (int) dp[n][k];` — returns the computed answer for all $n$ points and $k$ segments.

---

## 16. Test With Multiple Examples

### Example 1 — Normal Case
`n = 4, k = 2` $\rightarrow$ Dry run in Section 13 $\rightarrow$ Output: `5` ✔️

### Example 2 — Minimum Case
`n = 3, k = 1` $\rightarrow$ Dry run in Section 6 $\rightarrow$ Output: `3` ✔️

### Example 3 — Tightly Packed Segments
`n = 3, k = 2` $\rightarrow$ Dry run in Section 6 $\rightarrow$ Output: `1` ✔️

### Example 4 — Impossible Configuration
`n = 2, k = 2` $\rightarrow$ Only 2 points, cannot form 2 non-overlapping segments of length $\ge 1$ $\rightarrow$ Output: `0` ✔️

---

## 17. Edge Cases

* **$k = n - 1$ (Maximum possible segments):** Segments must all be unit length and touch end-to-end: $(0,1), (1,2), \dots, (n-2, n-1)$. There is exactly $1$ way. The DP correctly returns `1`.
* **$k \ge n$ (More segments than can fit):** Impossible since each segment needs length $\ge 1$. The loops correctly produce `0`.
* **$k = 1$ (Single segment):** Equivalent to choosing any 2 distinct endpoints out of $n$, which is $\binom{n}{2} = \frac{n(n-1)}{2}$. For $n=4, k=1$: $\frac{4 \times 3}{2} = 6$, correctly matching $dp[4][1] = 6$.
* **Large constraints ($N, K = 1000$):** Modulo operations at each addition step guarantee no 64-bit integer overflow occurs.

---

## 18. Time Complexity

```text
Outer loop: k iterations (1 to k)
Inner loop: n iterations (2 to n)
Work per cell: O(1) arithmetic operations with running prefixSum

Total Time Complexity: O(n * k)
```

For $n = 1000, k = 1000$, the table has $10^6$ operations, executing in under $15\text{ ms}$.

---

## 19. Space Complexity

* `dp` table of size $(n+1) \times (k+1)$ takes $O(n \cdot k)$ space.
* For $n=1000, k=1000$, this uses $\approx 8\text{ MB}$ of memory, well within standard limits.
* *(Note: Space can further be optimized to $O(n)$ by keeping only the current and previous rows).*

---

## 20. Common Mistakes Beginners Make

* ❌ "Segments cannot touch at endpoints."  
  ✅ The problem explicitly allows segments to share endpoints (e.g. $(0,2)$ and $(2,3)$ is valid). If touching were forbidden, the left subproblem would be $dp[p][j-1]$ instead of $dp[p+1][j-1]$.

* ❌ "Recomputing the summation $\sum_{q=1}^{i-1} dp[q][j-1]$ with an inner loop."  
  ✅ This creates an $O(n^2 k)$ solution that will Time Out on LeetCode. Maintaining a running `prefixSum` variable is essential for $O(n k)$ performance.

* ❌ "Forgetting modulo during intermediate additions."  
  ✅ Without `% MOD` inside the inner loop, `prefixSum` and `dp[i][j]` will quickly overflow 64-bit integers.

---

## 21. How to Recognize This Pattern in Other Problems

Watch for these signals:
```text
"Choose k non-overlapping intervals / sub-arrays / segments"
"Endpoints may touch / overlap at boundary points"
"Count the number of ways modulo 10^9 + 7"
```

Whenever you partition an array or sequence into $k$ non-overlapping parts, setup `dp[i][j]` for the prefix of length $i$ with $j$ parts. If the transition involves a sum over all previous cut points $p$, immediately check if that sum is an incremental prefix sum that can be updated in $O(1)$.

---

## 22. Interview Thinking

```text
1. Understand the problem   → Place k non-overlapping segments over n points (endpoints can touch).
2. Formulate state          → dp[i][j] = ways to place j segments on first i points.
3. Establish base cases     → dp[i][0] = 1 (1 way to place 0 segments).
4. Derive transition        → Point i-1 is either unused (dp[i-1][j]) or used as right endpoint.
5. Identify the bottleneck  → Summing over left endpoints takes O(n), giving O(n²k).
6. Optimize with prefix sum → Keep running accumulator of the previous row to achieve O(1) per state.
7. Implement & dry-run      → Code with modulo arithmetic; test small n, k cases.
8. Analyze complexity       → O(nk) time, O(nk) space.
```

---

## 23. Mini Challenge

1. If segments were **forbidden** from sharing endpoints (must have at least 1 empty point between them), how would the transition $\sum dp[p+1][j-1]$ change?
2. What is the value of $dp[n][1]$ in terms of standard combinatorics?
3. How can we optimize the space complexity from $O(n \cdot k)$ down to $O(n)$?

<br>

### Answer to Mini Challenge

1. If endpoints could not be shared, a segment ending at $i-1$ starting at $p$ would require all previous segments to finish at or before $p-1$. Thus, the subproblem would only have $p$ points available: $\sum dp[p][j-1]$.
2. $dp[n][1] = \binom{n}{2} = \frac{n(n-1)}{2}$, because choosing 1 segment is equivalent to picking any 2 distinct endpoints out of the $n$ points.
3. Since computing row $j$ only depends on values from row $j-1$ and the current row $j$, we only need two 1D arrays (`prevDp` and `currDp`) of size $n+1$, reducing auxiliary space to $O(n)$.

---

## 24. Final Revision

### 🧠 Problem in One Sentence
Find the number of ways to draw $k$ non-overlapping line segments (endpoints may touch) across $n$ points modulo $10^9+7$.

### 🔑 Main Idea
Fix the rightmost point $x = i-1$: either it is unused ($dp[i-1][j]$) or it serves as the right endpoint of the $j$-th segment, allowing the remaining $j-1$ segments to be placed freely on the remaining left points. A running prefix sum makes the transition $O(1)$.

### ⚙️ Algorithm
1. Allocate `dp[n+1][k+1]` with base case `dp[i][0] = 1`.
2. For each $j$ from $1$ to $k$:
   - Initialize `prefixSum = 0`.
   - For each $i$ from $2$ to $n$:
     - `prefixSum = (prefixSum + dp[i-1][j-1]) % MOD`
     - `dp[i][j] = (dp[i-1][j] + prefixSum) % MOD`
3. Return `dp[n][k]`.

### ⏱️ Complexity
Time: $O(n \cdot k)$  
Space: $O(n \cdot k)$

---

## 25. Beginner Quiz

1. **(Understanding)** Why is `(0, 2)` and `(2, 4)` considered a valid non-overlapping pair of segments?
2. **(Recurrence)** Why does fixing the rightmost segment as $(p, i-1)$ leave $p+1$ points available for the remaining $j-1$ segments?
3. **(Optimization)** Why does maintaining `prefixSum` reduce the time complexity from $O(N^2 K)$ to $O(NK)$?
4. **(Dry Run)** Calculate $dp[3][1]$ by hand using the recurrence formula.
5. **(Edge Case)** Why does $dp[n][k] = 0$ whenever $k \ge n$?
