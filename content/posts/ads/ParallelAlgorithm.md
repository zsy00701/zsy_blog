---
title: 并行算法
date: '2026-01-01T10:46:33.227Z'
excerpt: Work-Depth 模型与 PRAM 并行计算
category: ads
---
### 1. 核心评估模型：Work-Depth Model

在 PRAM (Parallel Random Access Machine) 模型中，我们主要关注两个指标：

- **Work ($W$ 或 $T_1$):** 总工作量。即假设只有 1 个处理器时，执行该算法所需的操作总数。这通常等同于串行算法的时间复杂度。
- **Depth ($D$ 或 $T_\infty$):** 深度（有时叫 Span）。即假设有**无限**个处理器时，算法运行的最长时间。它由算法中必须顺序执行的最长依赖链决定。

#### Brent's Theorem (布伦特定理)

这是并行计算的基石，它联系了 $W, D$ 和实际处理器数量 $p$ 之间的关系：

$$T_p \le \frac{W}{p} + D$$

- **直观理解：** 实际运行时间 $T_p$ 由两部分组成：
  1. $\frac{W}{p}$: 把总工作量平均分配给 $p$ 个处理器（理想加速）。
  2. $D$: 无论有多少处理器，都无法压缩的路径（由于数据依赖）。

> **考点提示 (PTA 14.1):** 并行算法不仅仅要减少 $W$（Work load），更关键的是要减少 $D$（Depth/Time in worst-case）。如果 $D$ 很大，增加处理器也无济于事。

### 2. The Summation Problem (求和)

这是一个最基础的并行范式，利用**平衡二叉树**结构。

- **算法逻辑：**
  - 将数组两两分组，并行相加。
  - 递归向上，直到根节点。
- **复杂度：**
  - $W(n) = O(n)$ (总共做了 $n-1$ 次加法)
  - $D(n) = O(\log n)$ (树的高度)

> PTA 14.3 解析：
>
> 文档提到 "B(1,6) is found before B(2,1)"。
>
> 在求和的 Up-sweep 过程中，是从叶子（Level 0）向根（Level $\log n$）计算的。
>
> Level 1 的节点肯定比 Level 2 的节点先计算出来。所以是 True。

![Img 1](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img1.png)

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img2.png)

### 3. Prefix-Sums (前缀和)

这是本章最重要、也是最复杂的算法之一。串行只需 $O(n)$，并行为了达到 $O(\log n)$ 的深度，需要两个阶段。

#### 阶段一：Up-Sweep (Reduce / Summation)

和上面的求和问题一样，自底向上构建一棵树，每个节点保存子树的和。

- $B(h, i)$ 表示第 $h$ 层第 $i$ 个节点的值。

#### 阶段二：Down-Sweep (Distribute)

这是关键。我们需要把“左边的和”传给“右边的孩子”。

- 自顶向下（从 Root 到 Leaves）。
- 计算公式通常涉及：`C(h, i) = C(h+1, parent) + left_sibling`。（分情况讨论，整体是从上到下）

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img3.png)

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img4.png)

### 4. Merge Two Non-decreasing Arrays (归并)

假设有两个有序数组 $A$ 和 $B$，长度均为 $N$。

如何并行合并？关键思想是 Ranking (排名)。

- **核心逻辑 (Partitioning / Binary Search)：**

  - 对于 $A$ 中的每一个元素 $A[i]$，我们在 $B$ 中通过**二分查找**找到它的位置（即有多少个元素比它小）。
  - 因为所有 $A[i]$ 的查找是独立的，可以完全并行。

- **复杂度：**

  - Time (Depth): $O(\log n)$ (二分查找的耗时)。
  - Work: 如果对 $A$ 和 $B$ 所有元素都做二分，总 Work 是 $O(n \log n)$。
  - **优化：** 为了让 Work 降到 $O(n)$，我们通常不针对所有元素查，而是选这就“枢轴” (Pivot) 切分问题（如文档 PTA 14.9 选项 C 提到的思路，虽然选项 C 本身描述可能有误导，但核心是 Partitioning）。
  - **文档结论 (PTA 14.9 D)：** 存在并行算法可以做到 **Time $O(\log n)$ 和 Work $O(n)$**。

  ![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img5.png)

  ![Img 6](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img6.png)

  ![Img 7](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img7.png)

  ![Img 8](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img8.png)

  ### Stage 1: Partitioning (划分/选点)

  这是算法最关键的一步。既然对*所有*元素做二分查找太贵，我们只对*一部分*代表元素做二分查找。

  - **选点策略（Selectors）：**

    - 我们不计算每一个元素的 Rank，而是每隔 $\log n$ 个元素选出一个“代表”。
    - 选出的元素数量 $p = n / \log n$。
    - 公式 $A\_Select(i) = A(1 + (i-1)\log n)$ 表示选取下标为 $1, 1+\log n, 1+2\log n, \dots$ 的元素。

  - **计算 Rank：**

    - 只对这 $2p$ 个（A和B各 $p$ 个）选出来的元素，使用之前的 **Binary Search** 方法计算它们在对方数组中的 Rank。

  - **复杂度分析（重点）：**

    - **深度 (Depth/Time):** 因为还是用二分查找，每个元素的查找耗时 $O(\log n)$。所有选出的元素并行查找，所以 $D = O(\log n)$。

    - 工作量 (Work): 这里的计算非常巧妙。

      $$Work = (\text{选出的元素个数}) \times (\text{每个元素的查找代价})$$

      $$W = 2p \times O(\log n)$$

      代入 $p = n / \log n$：

      $$W = 2 \cdot (n / \log n) \cdot \log n = O(n)$$

    - **结论：** 这一步就把总工作量控制在了 $O(n)$ 级别，这就做到了 **Work-Efficient**。

  - **图示解析：**

    - 图中 **红色方框**（如 A 中的 4, 16... 和 B 中的 1, 7...）就是被选出来的“代表”。
    - **箭头** 代表 Rank 的计算过程（二分查找）。
    - **绿色阴影区域**：代表被切分出来的“子块（Blocks）”。通过确定代表元素的 Rank，我们实际上把两个大数组切成了很多个小的对应区间。

  ### Stage 2: Actual Ranking (实际排名)

  在 Stage 1 结束后，我们虽然没有算出所有元素的 Rank，但我们确定了大概的范围。

  - **子问题（Sub-problems）：**
    - 两个选定元素（Splitters）之间的元素个数大约是 $\log n$。
    - 我们现在有了很多个独立的小任务（图中的绿色条带之间）。每个任务只需要处理 $\log n$ 规模的数据。
    - Slide 提到有“至多 $2p$ 个规模较小（$O(\log n)$）的问题”。
  - **处理方法：**
    - 对于这些小块内部的元素，我们可以并行地处理每个块。
    - 因为块很小（只有 $\log n$ 大小），哪怕在块内部使用简单的串行合并，或者再做一次二分查找，代价都很低。
  - **复杂度分析：**
    - **深度 (Depth):** 处理 $\log n$ 大小的数据，即便是串行处理，耗时也是 $O(\log n)$。
    - **工作量 (Work):** 所有小块的大小加起来总共还是 $n$ 个元素。每个元素被处理常数次，所以总工作量 $W = O(n)$。

  ### Overall (总体结论)

  - **$D = O(\log n)$**：整个过程的关键路径由 Stage 1 的二分查找和 Stage 2 的块内处理决定，都是对数级别。
  - **$W = O(n)$**：我们在任何阶段都没有做多余的计算（没有像原始二分查找那样让 $n$ 个元素都去查 $\log n$ 次）。

  ### 5. Maximum Finding (找最大值)

  这是展示 PRAM 模型威力（以及 Random Sampling 技巧）的经典案例。

  #### 方法 A: 比较所有对 (Compare All Pairs)

  - 逻辑：对于每个元素 $x$，和其他所有元素比较。如果 $x$ 赢了所有人，$x$ 就是最大值。
  - Time: $O(1)$ (并发极高)。
  - Work: $O(n^2)$ (太浪费资源)。

  ![Img 9](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img9.png)

  #### 方法 B: 树形归约 (Tree Reduction)

  - 逻辑：同 Summation，两两PK，胜者晋级。
  - Time: $O(\log n)$。
  - Work: $O(n)$。

  **进阶**：

  ![Img 10](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img10.png)

  ![Img 11](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img11.png)

  ####  C: 随机采样 (Random Sampling) - **重点**

  为了在 $O(1)$ 时间内通过 $O(n)$ 的 Work 解决问题（with high probability）：

  1. **采样：** 随机选 $n^{7/8}$ (或其他比例) 个元素。
  2. **暴力找最大：** 用 $O(1)$ 时间、$O(n)$ Work 的方法（即 Compare All）在这些样本里找到最大值 $m$。
  3. **过滤：** 将原数组中所有小于 $m$ 的元素扔掉。
  4. **结论：** 剩下的元素极少，可以再次用暴力法 $O(1)$ 解决。

  ![Img 12](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img12.png)

  ![Img 13](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch14_img13.png)

  > ** 14.5 & 14.7 解析：**
  >
  > - **14.5:** Random Sampling 可以达到 $T=O(1)$ 且 $W=O(n)$ (概率性)。**True**。
  > - **14.7:** 串行最快 $O(n)$ (A错)；并行可以 $O(1)$ (B错)；Partition 无法减少 Depth (C错)；**D 是正确的**，描述了随机采样的性能。

  ### 
