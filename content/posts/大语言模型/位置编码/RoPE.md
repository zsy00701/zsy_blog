## 1.Introduction

> Rotary Position Embedding

**核心思想：**通过旋转矩阵来编码绝对位置，使得在计算注意力（Attention）时，其结果自然包含相对位置信息。

RoPE 的目标是寻找一个变换 $f(\mathbf{x}, m)$（其中 $\mathbf{x}$ 是向量，$m$ 是位置），使得两个向量变换后的内积只与它们的相对距离 $m-n$ 有关：

$$\langle f(\mathbf{q}, m), f(\mathbf{k}, n) \rangle = g(\mathbf{q}, \mathbf{k}, m-n)$$

## 2.二维的证明

### 2.1 复数形式的表示

将 2 维向量 $\mathbf{x} = [x_1, x_2]^\top$ 看作复数 $z = x_1 + ix_2$。

在复平面上，将一个复数旋转角度 $\theta$ 等同于乘以 $e^{i\theta}$。

RoPE 定义位置 $m$ 的旋转角度为 $m\theta$。则位置 $m$ 处的查询向量 $\mathbf{q}$ 和位置 $n$ 处的键向量 $\mathbf{k}$ 可以表示为：

$$f(\mathbf{q}, m) = \mathbf{q} e^{im\theta}$$

$$f(\mathbf{k}, n) = \mathbf{k} e^{in\theta}$$

### 2.2 内积的恒等变换

在复空间中，两个向量的内积（点积）等于一个向量与另一个向量共轭的乘积的实部：

$$\langle f(\mathbf{q}, m), f(\mathbf{k}, n) \rangle = \text{Re} \left[ (q e^{im\theta}) (k e^{in\theta})^* \right]$$

利用指数运算法则 $(e^{in\theta})^* = e^{-in\theta}$：

$$\text{Re} \left[ q \cdot k^* \cdot e^{im\theta} \cdot e^{-in\theta} \right] = \text{Re} \left[ q \cdot k^* \cdot e^{i(m-n)\theta} \right]$$

**证明结论：** 最后的结果中，位置信息只以 $(m-n)\theta$ 的形式出现。这意味着，**虽然我们对每个向量应用了绝对位置的旋转，但它们之间的交互只取决于相对距离**。

> $$
> (z_1z_2)*=(z_1)*(z_2)*
> $$

## 3.高维

对于 $d$ 维向量，RoPE 将维度两两分组，每一组都在一个 2 维平面上旋转，但旋转的频率（步进）不同。

### 3.1 旋转矩阵 $R_{\Theta, m}$

对于向量 $\mathbf{x} \in \mathbb{R}^d$，RoPE 的变换可以写成矩阵乘法：

$$f(\mathbf{x}, m) = \mathbf{R}_{\Theta, m} \mathbf{x}$$

其中 $\mathbf{R}_{\Theta, m}$ 是一个分块对角矩阵：



$$\mathbf{R}_{\Theta, m} = \begin{pmatrix}  \cos m\theta_1 & -\sin m\theta_1 & 0 & 0 & \cdots \\ \sin m\theta_1 & \cos m\theta_1 & 0 & 0 & \cdots \\ 0 & 0 & \cos m\theta_2 & -\sin m\theta_2 & \cdots \\ 0 & 0 & \sin m\theta_2 & \cos m\theta_2 & \cdots \\ \vdots & \vdots & \vdots & \vdots & \ddots \end{pmatrix}$$

角度序列 $\theta_i$ 通常沿用 Sinusoidal 的定义：$\theta_i = 10000^{-2i/d}$。

> $$
> \begin{matrix}
> cosm\theta & -sinm\theta \\
> sinm\theta & cosm\theta
> \end{matrix}
> $$
>
> 旋转矩阵：逆时针旋转$\theta$
>
> 证明：证明（0,1）和（1,0）这两个基向量旋转了$\theta$

### 3.2 高维的证明

$$\mathbf{R}_{\Theta, m}^d = \begin{pmatrix}  \mathbf{M}_1 & \mathbf{0} & \cdots & \mathbf{0} \\ \mathbf{0} & \mathbf{M}_2 & \cdots & \mathbf{0} \\ \vdots & \vdots & \ddots & \vdots \\ \mathbf{0} & \mathbf{0} & \cdots & \mathbf{M}_{d/2} \end{pmatrix}$$

其中每一个分块 $\mathbf{M}_i$ 都是一个 2 维旋转矩阵：

$$\mathbf{M}_i = \begin{pmatrix} \cos m\theta_i & -\sin m\theta_i \\ \sin m\theta_i & \cos m\theta_i \end{pmatrix}$$

我们要证明对于位置 $m$ 的 $\mathbf{q}$ 和位置 $n$ 的 $\mathbf{k}$，它们的内积只取决于 $m-n$。

#### 第一步：写出内积表达式

根据矩阵乘法，变换后的内积为：

$$\langle f(\mathbf{q}, m), f(\mathbf{k}, n) \rangle = (\mathbf{R}_{\Theta, m}^d \mathbf{q})^\top (\mathbf{R}_{\Theta, n}^d \mathbf{k}) = \mathbf{q}^\top (\mathbf{R}_{\Theta, m}^d)^\top \mathbf{R}_{\Theta, n}^d \mathbf{k}$$

#### 第二步：利用分块矩阵的性质

由于 $\mathbf{R}$ 是分块对角矩阵，其转置和乘法可以逐块进行：

$$(\mathbf{R}_{\Theta, m}^d)^\top \mathbf{R}_{\Theta, n}^d = \begin{pmatrix}  \mathbf{M}_1(m)^\top \mathbf{M}_1(n) & \cdots & \mathbf{0} \\ \vdots & \ddots & \vdots \\ \mathbf{0} & \cdots & \mathbf{M}_{d/2}(m)^\top \mathbf{M}_{d/2}(n) \end{pmatrix}$$

#### 第三步：计算单个分块的乘积

对于任意一个分块 $i$，根据旋转矩阵的性质（$\mathbf{M}(\alpha)^\top = \mathbf{M}(-\alpha)$）：

$$\mathbf{M}_i(m)^\top \mathbf{M}_i(n) = \mathbf{M}_i(-m\theta_i) \mathbf{M}_i(n\theta_i)$$

两个旋转矩阵相乘，

$$\mathbf{M}_i(-m\theta_i + n\theta_i) = \mathbf{M}_i((n-m)\theta_i)$$

#### 第四步：得出结论

将上述结果带回原式，可以看到整个乘积矩阵：

$$(\mathbf{R}_{\Theta, m}^d)^\top \mathbf{R}_{\Theta, n}^d = \mathbf{R}_{\Theta, n-m}^d$$

最终的内积结果为：

$$\langle f(\mathbf{q}, m), f(\mathbf{k}, n) \rangle = \mathbf{q}^\top \mathbf{R}_{\Theta, n-m}^d \mathbf{k}$$

### 3.3 远程衰减特性 (Long-term Decay)

RoPE 还有一个非常优美的性质：随着相对距离 $|m-n|$ 的增加，内积的期望值会趋于衰减。这符合直觉——距离越远的词，相互关联的可能性通常越小。

> 证明：待补充

