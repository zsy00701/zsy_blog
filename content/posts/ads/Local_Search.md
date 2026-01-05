局部搜索能够找到局部最优解，但不一定是全局最优解

![Img 1](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img1.png)

先随机选取一个点，并在其 neighborhood 的当中找到更好的解并更新，直到找不到为止

## Vertex Cover Problem

从 S = V 开始，不断删除一个 node 并检查 S’ 是否满足条件

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img2.png)

找到的解是局部最优解，不一定是全局最优解

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img3.png)

尝试跳出局部最优解

## Hopfied Neural Networks

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img4.png)

![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img5.png)

不断翻转 unstable 的 node

![Img 6](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img6.png)

## Maximum Cut Problem

> NP-Hard

![Img 7](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img7-20260102123835556.png)

### Local Search

![Img 8](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img8-20260102124140425.png)

![Img 10](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img10-20260102124328499.png)

### Greedy Algorithm

![Img 9](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch12_img9-20260102124248352.png)



![image-20260102125053373](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260102125053373.png)

#### 题目描述的算法：迭代优化 (Iterative Improvement / Lloyd-like)

题目描述的算法是：先随机选 k 个点，然后不断地“分配点到最近中心” -> “重新计算最小覆盖圆中心” -> “重复”。

- **致命弱点**：这个算法**完全依赖于初始值的选择**。如果初始位置不好，它会卡死在一个错误的划分里动弹不得。

##### 反例证明 (Counter-Example)

我们可以构造一个简单的例子，证明该算法的结果可以比最优解差 **100 倍** 甚至更多。

想象平面上有 4 个点，构成一个**又宽又扁的长方形**：

- **坐标**：
  - 左上 A: $(-100, 1)$
  - 右上 B: $(100, 1)$
  - 左下 C: $(-100, -1)$
  - 右下 D: $(100, -1)$
- **我们要选 k=2 个中心。**

**【全局最优解 (Optimal Solution)】**

- **切法**：**左右切**。
- **中心**：左边两个点 {A, C} 的中心 $(-100, 0)$，右边两个点 {B, D} 的中心 $(100, 0)$。
- **半径**：从 $(-100, 0)$ 到 $(-100, 1)$ 的距离是 **1**。
- **最优半径 $R_{opt} = 1$**。

【该算法的糟糕情况 (Bad Local Optima)】

假设一开始运气不好，初始选的两个中心分别落在上方和下方的中间位置：

- 初始中心 $c_1$ 在 $(0, 1)$ 附近（靠近上边）。
- 初始中心 $c_2$ 在 $(0, -1)$ 附近（靠近下边）。

**算法执行过程**：

1. **分配 (Step 1)**：
   - 点 A, B 离 $c_1$ 更近（因为它们都在 $y=1$ 线上），所以 $S_1 = \{A, B\}$。
   - 点 C, D 离 $c_2$ 更近，所以 $S_2 = \{C, D\}$。
   - **切法变成了“上下切”**。
2. **更新中心 (Step 2)**：
   - $S_1$ (上边两点) 的最小覆盖圆中心是 A 和 B 的中点：**$(0, 1)$**。覆盖半径是 A 到中点的距离 = **100**。
   - $S_2$ (下边两点) 的最小覆盖圆中心是 C 和 D 的中点：**$(0, -1)$**。覆盖半径也是 **100**。
3. **判断终止**：
   - 现在的中心位置是 $(0, 1)$ 和 $(0, -1)$。
   - 如果我们再次通过这些中心分配点，A、B 还是离 $(0, 1)$ 近，C、D 还是离 $(0, -1)$ 近。
   - **划分没有变，中心没有变，算法终止。**

**【结果对比】**

- **算法得到的半径**：100
- **最优半径**：1
- **比率**：100 倍（显然 $> 2$）。

只要长方形足够长，这个比率可以是无穷大。因此，题目中的说法是**错误的**。

#### 真正的 2-近似算法：最远点采样 (Gonzalez's Algorithm)

真正能保证 **2-近似 (2-Approximation)** 的算法是 **Gonzalez 的贪心算法**（Farthest Point Clustering）。

- **做法**：随机选一个点做第一个中心，然后每次选一个**离当前所有中心最远**的点做下一个中心，直到选满 k 个。
- **结论**：这个贪心算法保证结果不超过最优半径的 2 倍。