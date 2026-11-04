---
title: "1477. Find Two Non-overlapping Sub-arrays Each With Target Sum"
slug: 'find-two-non-overlapping-sub-arrays-each-with-target-sum'
date: '2026-09-17'
difficulty: 'Medium'
platform: 'LeetCode POTD'
timeComplexity: 'O(N)'
spaceComplexity: 'O(N)'
tags: ['Array', 'Hash Table', 'Dynamic Programming', 'Sliding Window', 'Prefix Sum']
excerpt: "Find two non-overlapping sub-arrays each with sum equal to target minimizing their combined length using sliding window and prefix dynamic programming."
---

# 1477. Find Two Non-overlapping Sub-arrays Each With Target Sum

Since all elements in `arr` are strictly positive (`arr[i] >= 1`), running subarray sums are strictly monotonic. This allows us to locate every subarray with sum exactly `target` in a single linear **sliding window** pass, while simultaneously maintaining a running **prefix-minimum DP table of shortest valid lengths** to pair each found subarray with the best non-overlapping candidate to its left in $O(1)$ time.

---

## 1. Problem in Very Simple Language

You are given an array of positive integers `arr` and an integer `target`.

You need to pick **two separate (non-overlapping) continuous chunks (subarrays)** from `arr` such that:
* The sum of elements in Chunk 1 is **exactly equal to `target`**.
* The sum of elements in Chunk 2 is **also exactly equal to `target`**.
* Chunk 1 and Chunk 2 do **not share any indices** (they cannot overlap at all).

**Goal:** Find two such non-overlapping chunks such that the **sum of their lengths** is as **small as possible**.

* **What's given:** An integer array `arr` (where every number is $\ge 1$) and an integer `target`.
* **What to find:** Two non-overlapping subarrays that each sum to `target` with minimal combined length.
* **What to return:** The minimum total length (`length1 + length2`), or `-1` if it is impossible to find two valid non-overlapping subarrays.

---

## 2. Real-Life Analogy

Imagine a continuous ribbon with numbers printed in consecutive sections. You need to cut out **two separate pieces** of ribbon, each containing numbers that add up to a prize score of `target`. Because ribbon material costs money, your boss wants you to use as few total inches of ribbon as possible. You cannot reuse any cut section of the ribbon for both pieces. You want to scan along the ribbon once, spot every piece that totals `target`, and pair each one with the shortest valid piece found completely to its left.

---

## 3. Important Programming Concepts I Need First

### Subarray vs Subsequence
* A **subarray** is a contiguous, unbroken slice of an array: `arr[left...right]`.
* You cannot skip elements within a subarray.

### Monotonicity of Running Sums
* Because every element in `arr` is positive (`arr[i] >= 1`), expanding the window (`right++`) strictly increases the sum, and shrinking the window from the left (`left++`) strictly decreases the sum.
* This property enables a pure two-pointer **sliding window** in $O(N)$ time without backtracking.

### Prefix Minimum Dynamic Programming (`dp[i]`)
* Let `dp[i]` store the **minimum length of any valid target-sum subarray** whose right endpoint ends at or before index `i`.
* If a valid subarray `[left, right]` is discovered, its length is `len = right - left + 1`.
* The shortest valid subarray completely to its left ends at or before index `left - 1`, which is stored in `dp[left - 1]`.
* Combining them gives a total length of `dp[left - 1] + len` in $O(1)$ time!

---

## 4. Understand the Input

Take **Example 1**:
```text
arr = [3, 2, 2, 4, 3], target = 3
```

* Target is `3`.
* Subarrays that sum to 3:
  * `[3]` at index `0` (length 1)
  * `[3]` at index `4` (length 1)
* Indices `0` and `4` do not overlap.
* Combined length = $1 + 1 = 2$.

Take **Example 2**:
```text
arr = [7, 3, 4, 7], target = 7
```

* Target is `7`.
* Subarrays that sum to 7:
  * `[7]` at index `0` (length 1)
  * `[3, 4]` at indices `[1, 2]` (length 2)
  * `[7]` at index `3` (length 1)
* Pairs of non-overlapping subarrays:
  * Pair 1: `[7]` at index 0 and `[3, 4]` at [1, 2] $\rightarrow$ length = $1 + 2 = 3$.
  * Pair 2: `[7]` at index 0 and `[7]` at index 3 $\rightarrow$ length = $1 + 1 = 2$.
  * Pair 3: `[3, 4]` at [1, 2] and `[7]` at index 3 $\rightarrow$ length = $2 + 1 = 3$.
* The minimum combined length across all valid pairs is **2**.

---

## 5. Understand the Output

* Return an integer representing the smallest combined length `len1 + len2`.
* If fewer than 2 non-overlapping target-sum subarrays exist, return `-1`.

---

## 6. Solve the Example Manually

Let's manually walk through **Example 2**: `arr = [7, 3, 4, 7], target = 7`.

```text
Array: [ 7,  3,  4,  7 ]
Index:   0   1   2   3
```

1. **At `right = 0` (`val = 7`):**
   * Window: `[0..0]`, `sum = 7 == target`.
   * Length `len = 1`.
   * Left partner needed before index `0 - 1 = -1`. None exists yet.
   * Best subarray up to index 0: `dp[0] = 1`.

2. **At `right = 1` (`val = 3`):**
   * Window: `[0..1]`, `sum = 10 > 7`. Shrink left: `left = 1`, `sum = 3 < 7`.
   * No valid target sum ending at index 1.
   * Best subarray up to index 1: `dp[1] = dp[0] = 1`.

3. **At `right = 2` (`val = 4`):**
   * Window: `[1..2]`, `sum = 3 + 4 = 7 == target`.
   * Length `len = 2` (from index 1 to 2).
   * Left partner needed before index `left - 1 = 0`. Best left length = `dp[0] = 1`.
   * Total pair length = `dp[0] + len = 1 + 2 = 3`. Candidate answer = 3.
   * Best subarray up to index 2: `dp[2] = min(dp[1], len) = min(1, 2) = 1`.

4. **At `right = 3` (`val = 7`):**
   * Window: `[1..3]`, `sum = 3 + 4 + 7 = 14 > 7`. Shrink left:
     * `left = 2`, `sum = 11 > 7`.
     * `left = 3`, `sum = 7 == target`.
   * Length `len = 1` (at index 3).
   * Left partner needed before index `left - 1 = 2`. Best left length = `dp[2] = 1`.
   * Total pair length = `dp[2] + len = 1 + 1 = 2`.
   * Best total answer = `min(3, 2) = 2`.
   * Best subarray up to index 3: `dp[3] = min(dp[2], len) = min(1, 1) = 1`.

Final Answer: **2** ✔️

---

## 7. Think Like a Programmer

* **What do I know?**
  * All elements are positive $(\ge 1)$.
  * Any subarray summing to `target` has a specific start `left` and end `right`.
* **What is the challenge?**
  * We need two non-overlapping subarrays.
  * If we find a subarray ending at `right`, what is the best subarray that ends **before** `left`?
* **Why naive searching fails:**
  * If there are $K$ valid subarrays, checking all pairs takes $O(K^2)$. In the worst case, $K = O(N)$, leading to an $O(N^2)$ time limit exceeded (TLE).
* **The DP optimization:**
  * By storing the minimum length of any valid subarray seen up to index $i$ in a 1D array `dp[i]`, looking up the best non-overlapping left partner takes exactly **$O(1)$** time!

---

## 8. Start With the Brute Force Solution

**Brute force idea:**
1. Find all pairs of `(start, end)` where $\sum \text{arr}[\text{start}..\text{end}] = \text{target}$.
2. Compare every pair of intervals $(I_1, I_2)$ that do not overlap: $\text{end}_1 < \text{start}_2$.
3. Track the minimum sum of lengths $\text{len}(I_1) + \text{len}(I_2)$.

```java
class Solution {
    public int minSumOfLengths(int[] arr, int target) {
        int n = arr.length;
        List<int[]> intervals = new ArrayList<>();

        for (int i = 0; i < n; i++) {
            int sum = 0;
            for (int j = i; j < n; j++) {
                sum += arr[j];
                if (sum == target) {
                    intervals.add(new int[]{i, j, j - i + 1});
                    break;
                }
                if (sum > target) break;
            }
        }

        int minLen = Integer.MAX_VALUE;
        int m = intervals.size();
        for (int i = 0; i < m; i++) {
            for (int j = i + 1; j < m; j++) {
                int[] a = intervals.get(i);
                int[] b = intervals.get(j);
                if (a[1] < b[0] || b[1] < a[0]) {
                    minLen = Math.min(minLen, a[2] + b[2]);
                }
            }
        }

        return minLen == Integer.MAX_VALUE ? -1 : minLen;
    }
}
```

**Time Complexity:** $O(N^2)$ to find intervals and $O(M^2)$ to compare pairs. With $N = 10^5$, this will exceed the 2-second time limit.
**Space Complexity:** $O(M)$ to store intervals.

---

## 9. Explain the Brute Force Code Line by Line

* `List<int[]> intervals = new ArrayList<>();` — collects all intervals that sum to `target`.
* Nested loops `i` and `j` compute subarray sums; when `sum == target`, records `[start, end, length]`.
* Second nested loop checks all pairs of intervals for non-overlap condition (`a[1] < b[0]` or `b[1] < a[0]`).
* Returns the minimum combined length found or `-1`.

---

## 10. Why Is Brute Force Inefficient?

* Finding intervals and comparing all combinations pairwise performs redundant comparisons.
* When we consider a valid subarray ending at `right`, we do not need to check *every* previous valid subarray individually. We only care about the **single smallest length** among all previous subarrays ending at or before `left - 1`.

---

## 11. Find the Better Approach

> "Can we maintain a running prefix minimum of valid subarray lengths while scanning with a sliding window?"

Yes!
1. Maintain a two-pointer sliding window `[left, right]` with running sum `sum`.
2. Array `dp[i]` tracks $\min \text{length}$ of any valid target-sum subarray ending at index $\le i$.
3. When `sum == target` at window `[left, right]`:
   * Current window length is `len = right - left + 1`.
   * If `left > 0` and `dp[left - 1] < INF`, a valid non-overlapping pair exists with combined length `dp[left - 1] + len`.
   * Update global answer: `ans = min(ans, dp[left - 1] + len)`.
   * Update running prefix minimum: `dp[right] = min(dp[right - 1], len)`.
4. If `sum != target`:
   * `dp[right] = dp[right - 1]`.

---

## 12. ⭐ Key Insight

### Before the insight
Checking all pairs of non-overlapping intervals requires $O(N^2)$ combinations.

### The insight
1. Because all values in `arr` are positive, a simple **sliding window** discovers every valid subarray in $O(N)$ time.
2. A **1D prefix-minimum DP array** (`dp[i] = min valid length in [0..i]`) allows $O(1)$ query of the shortest non-overlapping subarray to the left.
3. Evaluating the pair **before** recording the current window into `dp[right]` guarantees the two chosen subarrays never overlap or reuse the same segment.

### After the insight
The solution runs in a single clean $O(N)$ pass with $O(N)$ auxiliary space.

---

## 13. Dry Run the Optimized Solution

Let's trace `arr = [7, 3, 4, 7]`, `target = 7`, `INF = 10^9`.

| `right` | `arr[right]` | `sum` (after shrink) | `left` | `sum == target`? | `len` | Left Partner (`dp[left-1]`) | Candidate Pair | `dp[right]` | Best `ans` |
|---|---|---|---|---|---|---|---|---|---|
| **0** | 7 | 7 | 0 | Yes | 1 | None (`left-1 = -1`) | - | 1 | INF |
| **1** | 3 | 3 | 1 | No | - | - | - | 1 | INF |
| **2** | 4 | 7 | 1 | Yes | 2 | `dp[0] = 1` | $1 + 2 = 3$ | $\min(1, 2) = 1$ | 3 |
| **3** | 7 | 7 | 3 | Yes | 1 | `dp[2] = 1` | $1 + 1 = 2$ | $\min(1, 1) = 1$ | 2 |

**Final Result:** `2` ✔️

---

## 14. Optimized Solution Code

### Java
```java
class Solution {
    public int minSumOfLengths(int[] arr, int target) {
        int n = arr.length;
        int[] dp = new int[n]; // dp[i] = min length of a valid subarray ending at or before index i
        final int INF = Integer.MAX_VALUE / 2; // Guard against integer overflow on addition

        int left = 0;
        int sum = 0;
        int best = INF;

        for (int right = 0; right < n; right++) {
            sum += arr[right];

            // Shrink window while sum exceeds target
            while (sum > target) {
                sum -= arr[left];
                left++;
            }

            // Carry forward previous best length
            int currBest = (right > 0) ? dp[right - 1] : INF;

            // If a valid subarray is found
            if (sum == target) {
                int len = right - left + 1;

                // Pair with best valid subarray strictly before 'left'
                if (left - 1 >= 0 && dp[left - 1] < INF) {
                    best = Math.min(best, dp[left - 1] + len);
                }

                // Update best length seen so far
                currBest = Math.min(currBest, len);
            }

            dp[right] = currBest;
        }

        return best >= INF ? -1 : best;
    }
}
```

### Python3
```python
class Solution:
    def minSumOfLengths(self, arr: list[int], target: int) -> int:
        n = len(arr)
        dp = [float('inf')] * n
        INF = float('inf')
        
        left = 0
        current_sum = 0
        best = INF
        
        for right in range(n):
            current_sum += arr[right]
            
            while current_sum > target:
                current_sum -= arr[left]
                left += 1
                
            curr_best = dp[right - 1] if right > 0 else INF
            
            if current_sum == target:
                length = right - left + 1
                
                if left > 0 and dp[left - 1] < INF:
                    best = min(best, dp[left - 1] + length)
                    
                curr_best = min(curr_best, length)
                
            dp[right] = curr_best
            
        return -1 if best == INF else best
```

### JavaScript
```javascript
/**
 * @param {number[]} arr
 * @param {number} target
 * @return {number}
 */
var minSumOfLengths = function(arr, target) {
    const n = arr.length;
    const dp = new Array(n).fill(Infinity);
    const INF = Infinity;
    
    let left = 0;
    let sum = 0;
    let best = INF;
    
    for (let right = 0; right < n; right++) {
        sum += arr[right];
        
        while (sum > target) {
            sum -= arr[left];
            left++;
        }
        
        let currBest = (right > 0) ? dp[right - 1] : INF;
        
        if (sum === target) {
            const len = right - left + 1;
            
            if (left > 0 && dp[left - 1] < INF) {
                best = Math.min(best, dp[left - 1] + len);
            }
            
            currBest = Math.min(currBest, len);
        }
        
        dp[right] = currBest;
    }
    
    return best === INF ? -1 : best;
};
```

### C++
```cpp
#include <vector>
#include <algorithm>
#include <climits>

using namespace std;

class Solution {
public:
    int minSumOfLengths(vector<int>& arr, int target) {
        int n = arr.size();
        const int INF = 1e9;
        vector<int> dp(n, INF);
        
        int left = 0;
        int sum = 0;
        int best = INF;
        
        for (int right = 0; right < n; right++) {
            sum += arr[right];
            
            while (sum > target) {
                sum -= arr[left];
                left++;
            }
            
            int currBest = (right > 0) ? dp[right - 1] : INF;
            
            if (sum == target) {
                int len = right - left + 1;
                
                if (left > 0 && dp[left - 1] < INF) {
                    best = min(best, dp[left - 1] + len);
                }
                
                currBest = min(currBest, len);
            }
            
            dp[right] = currBest;
        }
        
        return best >= INF ? -1 : best;
    }
};
```

---

## 15. Explain the Optimized Code Line by Line

* `final int INF = Integer.MAX_VALUE / 2;` — sentinel value representing no valid subarray found yet, halved to prevent integer overflow during `dp[left - 1] + len`.
* `int left = 0, sum = 0, best = INF;` — initializes two pointers and the global minimum answer.
* `sum += arr[right];` — expands the sliding window by including the element at `right`.
* `while (sum > target) { sum -= arr[left]; left++; }` — shrinks window until `sum <= target`.
* `int currBest = (right > 0) ? dp[right - 1] : INF;` — carries forward the shortest valid subarray length found up to index `right - 1`.
* `if (sum == target)` — checks if the current window is a match.
  * `int len = right - left + 1;` — calculates the length of the current matching subarray.
  * `if (left - 1 >= 0 && dp[left - 1] < INF)` — if a non-overlapping valid subarray exists to the left, update `best = Math.min(best, dp[left - 1] + len)`.
  * `currBest = Math.min(currBest, len);` — updates the minimum length for the prefix ending at `right`.
* `dp[right] = currBest;` — stores the prefix minimum into `dp`.
* `return best >= INF ? -1 : best;` — returns the answer if at least two non-overlapping subarrays were found, otherwise `-1`.

---

## 16. Test With Multiple Examples

### Example 1: `arr = [3, 2, 2, 4, 3], target = 3`
* Subarrays with sum 3: `[3]` at index 0 (len 1) and `[3]` at index 4 (len 1).
* Output: `2` ✔️

### Example 2: `arr = [7, 3, 4, 7], target = 7`
* Subarrays: `[7]` at 0 (len 1), `[3, 4]` at 1..2 (len 2), `[7]` at 3 (len 1).
* Best pair: index 0 and index 3 $\rightarrow$ combined length = $1 + 1 = 2$.
* Output: `2` ✔️

### Example 3: `arr = [4, 3, 2, 6, 2, 3, 4], target = 6`
* Subarrays: `[4, 2]` is not contiguous; valid contiguous subarrays are `[6]` at index 3 (len 1) and `[4, 3, 2]` (sum 9 > 6).
* Output: `-1` (only 1 valid subarray exists) ✔️

---

## 17. Edge Cases

* **No valid subarray exists:** If no subarray sums to `target`, returns `-1`.
* **Only one valid subarray exists:** If only 1 subarray sums to `target`, no non-overlapping pair can be formed $\rightarrow$ returns `-1`.
* **Multiple identical target elements:** E.g., `arr = [5, 5, 5, 5], target = 5` $\rightarrow$ pairs `[0]` and `[1]` to return `2`.
* **Overlapping matches:** E.g., `arr = [3, 1, 1, 1, 5, 1, 2, 1], target = 3` $\rightarrow$ ignores overlapping matches and strictly pairs non-overlapping segments.
* **Large constraints ($N = 10^5$):** Linear $O(N)$ execution completes in $< 15$ ms.

---

## 18. Time Complexity

* **Sliding Window:** Each index is visited at most twice (once by `right`, once by `left`), taking $O(N)$ operations.
* **DP Updates:** Each step performs $O(1)$ constant-time arithmetic and lookups.
* **Total Time Complexity:** $\mathcal{O}(N)$, optimal for $N = 10^5$.

---

## 19. Space Complexity

* **DP Array:** Requires an array of size $N$ to store prefix minimums.
* **Total Space Complexity:** $\mathcal{O}(N)$.

---

## 20. Common Mistakes Beginners Make

* ❌ **"Updating `dp[right]` before pairing with `dp[left - 1]`."**
  * If you update the DP array with the current window before evaluating candidate pairs, a subarray could accidentally pair with a piece of itself or an overlapping segment.
* ❌ **"Using Integer.MAX_VALUE directly without halving."**
  * Evaluating `Integer.MAX_VALUE + len` causes integer overflow into negative values, corrupting `Math.min`. Always use a safe sentinel like `Integer.MAX_VALUE / 2` or `1e9`.
* ❌ **"Assuming negative numbers can be present."**
  * The problem constraints state $arr[i] \ge 1$. If negative numbers were allowed, sliding window would fail and a prefix sum hash table with a segment tree or monotonic stack would be needed.

---

## 21. How to Recognize This Pattern in Other Problems

Look for these key identifiers:
1. **"Find two non-overlapping sub-arrays..."**
2. **"Minimize or maximize the sum of their metrics (lengths, sums, profits)..."**
3. **Array with non-negative / monotonic properties.**

Whenever you see "find 2 non-overlapping subarrays," use the **Left-to-Right Prefix DP + Current Subarray** pattern:
* Compute the best candidate ending $\le i$ from the left.
* Scan the second subarray and look up the best non-overlapping answer from the prefix DP in $O(1)$.

---

## 22. Interview Thinking

```text
1. Understand the goal      -> Find 2 non-overlapping subarrays each summing to target with minimal total length.
2. Spot constraints         -> arr[i] >= 1 (strictly positive) means monotonic window sums!
3. Sliding Window           -> O(N) window finds every valid (left, right) segment.
4. Prefix DP optimization   -> dp[i] = min length of any valid subarray in arr[0..i].
5. O(1) Pairing             -> candidate = dp[left - 1] + (right - left + 1).
6. Time & Space             -> O(N) time, O(N) space.
```

---

## 23. Quiz & Practice Challenge

1. **Question 1:** Why does sliding window work here instead of requiring a hash map for prefix sums?
   * *Answer:* Because all elements are positive ($arr[i] \ge 1$), which ensures subarray sums are strictly monotonic when expanding and shrinking.
2. **Question 2:** What would be the time complexity if we used a Hash Map to find all $K$ valid intervals and then compared all pairs?
   * *Answer:* $O(K^2)$, which degrades to $O(N^2)$ in the worst case (e.g., all 1s).
3. **Question 3:** Can this pattern be extended to find **$k$ non-overlapping subarrays**?
   * *Answer:* Yes, using a 2D DP table `dp[count][index]` where `count` ranges from $1$ to $k$.
