## 一些概念

### PTAS (多项式时间近似模式)

**定义要求：** 对于任何**固定**的 $\epsilon > 0$，算法的运行时间是 $n$ 的多项式。

#### 这里的“坑”在哪里？

在 PTAS 中，$\epsilon$ 可以出现在指数位置上。

- **典型的运行时间：** $O(n^{1/\epsilon})$
- **分析：**
  - 如果 $\epsilon = 0.5$，运行时间是 $O(n^2)$（挺快）。
  - 如果 $\epsilon = 0.1$，运行时间是 $O(n^{10})$（开始变慢）。
  - 如果 $\epsilon = 0.01$，运行时间是 $O(n^{100})$。

**结论：** 虽然对于任何固定的 $\epsilon$，这在数学定义上都是“多项式时间”，但随着你要求的精度提高，指数会爆炸。这种算法在 $\epsilon$ 很小时，在工程上是不可用

### FPTAS (完全多项式时间近似模式)

**定义要求：** 运行时间必须既是 $n$ 的多项式，又是 $(1/\epsilon)$ 的多项式。

#### 为什么它更强大？

在 FPTAS 中，$(1/\epsilon)$ **不能**出现在指数上，只能作为底数。

- **典型的运行时间：** $O((\frac{1}{\epsilon})^2 \cdot n^3)$
- **分析：**
  - 如果 $\epsilon = 0.1$，运行时间大概是 $100 \cdot n^3$。
  - 如果 $\epsilon = 0.01$，运行时间大概是 $10000 \cdot n^3$。

**结论：** 即使你要求极高的精度（$\epsilon$ 极小），计算量的增加也是相对平缓的（多项式级别增加，而不是指数级别）。这是近似算法中**最理想**的状态。

### 算法的紧确性 (Tightness of an Algorithm)

当我们说一个 $\alpha$-近似算法是“紧确的”时，我们的意思是：

> 存在某些具体的输入实例，使得该算法得到的解恰好是最优解的 $\alpha$ 倍。

这仅仅说明**这个特定的算法 (ALG)** 也就到此为止了，你无法在证明中把它的近似比改进到比 $\alpha$ 更小。

## Bin Packing

![Img 1](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img1.png)

### Next Fit

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img2.png)

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img3.png)

### Best Fit and First Fit

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img4.png)

### On-line Algoriths

![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img5.png)

### Off-line Algorithms

能够看到所有的 item

将所有 items 从大到小排序，再使用 first / best fit，称为 first / best fit decreasing

![Img 6](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img6.png)

## Knapsack Problem

![Img 9](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img9.png)

### K-center Problem

![Img 7](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img7.png)



![Img 8](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch11_img8.png)

> 除非 P=NP*P*=*NP*，否则没有满足 ρ<2*ρ*<2 的 ρ*ρ*-approximation 解决 center-selection problem

### Vertex Cover Problem

