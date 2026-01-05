Leftist Heap（左偏树）和 Skew Heap（斜堆）设计的最核心**目的**只有一个：

### **为了解决普通二叉堆（Binary Heap）难以高效“合并”的问题。**

简单来说，它们存在的意义就是为了让 **Merge（合并两个堆）** 这个操作变得极其快速（从 $O(N)$ 提升到 $O(\log N)$）。



## Leftist Heaps

定义 null path length，Npl(X)*Npl*(*X*) 是从 X 至一个没有孩子的结点的路径的最短长度，规定 Npl(NULL)=−1*Npl*(*N**ULL*)=−1

Npl(X)=min{Npl(left child),Npl(right child)}+1*Npl*(*X*)=*min*{*Npl*(*l**e**f**t* *c**hi**l**d*),*Npl*(*r**i**g**h**t* *c**hi**l**d*)}+1

![image-20260103001112432](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260103001112432.png)

### merge

#### recursive version

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch4_img2.png)

#### iterative version

1. 根据 right paths 上结点值的大小 merge
2. 如果需要的话交换左右孩子

## skew heaps

**斜堆 (Skew Heap)** 是一种高级的数据结构，它是**左偏树 (Leftist Heap)** 的一种自适应（Self-adjusting）变体。

------

### 1. 斜堆的核心特点

1. **结构**：它是一棵二叉树，满足堆序性质（父节点 $\le$ 子节点，假设是小顶堆）。
2. **与左偏树的区别**：
   - **不记录 `npl` (Null Path Length)**：不需要像左偏树那样维护“距离最近空节点的距离”。
   - **不强制左偏**：左偏树强制要求“左边重右边轻”，斜堆不强制。
   - **无条件交换**：在合并操作中，斜堆**总是**交换左右子树（除了右子树为空这种特例）。
3. **类比**：
   - 如果说 **AVL树** 对应 **左偏树**（依靠显式的平衡因子/NPL来维持平衡）。
   - 那么 **Splay树 (伸展树)** 就对应 **斜堆**（不记平衡信息，通过每次操作后的调整，达到**摊还 (Amortized)** $O(\log N)$ 的效率）。

### 2. 核心操作：Merge (合并)

斜堆的所有操作（插入、删除最小、合并）最终都归结为 **Merge**。

#### 算法流程 (递归定义)

假设我们要合并两个斜堆 $H_1$ 和 $H_2$：

1. **判空**：如果 $H_1$ 为空，返回 $H_2$；如果 $H_2$ 为空，返回 $H_1$。
2. **比较根节点**：
   - 确保 $H_1$ 的根节点小于 $H_2$ 的根节点（如果是小顶堆）。如果 $H_1.root > H_2.root$，则交换 $H_1$ 和 $H_2$ 的名字（保证 $H_1$ 总是根最小的那个）。
3. **递归合并**：
   - 将 $H_1$ 的**右子树**与 $H_2$ 进行合并。
4. **交换左右子树 (关键步骤)**：
   - 合并完成后，**交换 $H_1$ 的左子树和右子树**。
5. **返回** $H_1$。

#### 伪代码

```cpp
Node* merge(Node* h1, Node* h2) {
    // 1. 判空
    if (h1 == null) return h2;
    if (h2 == null) return h1;

    // 2. 确保 h1 是根节点较小的那个
    if (h1->val > h2->val) swap(h1, h2);

    // 3. 递归合并 h1 的右子树 和 h2，结果暂时作为 h1 的右子树
    h1->right = merge(h1->right, h2);

    // 4. 【核心】无条件交换 h1 的左右孩子
    swap(h1->left, h1->right);

    return h1;
}
```

### 3. 为什么“总是交换”有效？

你可能会问：*“瞎交换一通，树不会变得很深吗？”*

- **直觉上的解释**：左偏树之所以要把重节点往左边赶，是为了让右路径（Right Path）尽可能短，因为合并是沿着右路径进行的。斜堆通过**每次合并都交换左右子树**，实际上是在把新合并进来的（可能很长的）右路径甩到左边去。这使得任何一条路径都不会持续地变长。
- **数学保证**：虽然单词操作的最坏情况可能是 $O(N)$（比如退化成一条链），但数学证明指出，进行 $M$ 次操作的总时间复杂度是 $O(M \log N)$。因此，单次操作的**摊还时间复杂度 (Amortized Time Complexity)** 是 $O(\log N)$。

根据 right paths 上的结点值的大小进行 merge，但是每次 merge 要交换左右孩子，除了 right paths 上值最大的那个结点





![image-20260103071424835](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260103071424835.png)