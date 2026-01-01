## 判定问题与最优化问题[¶](https://wintermelonc.github.io/WintermelonC_Docs/zju/compulsory_courses/ADS/ch10/#1-判定问题与最优化问题)

很多问题都是 **最优化问题**（optimization problem）。然而 NP 完全性不适合应用于最优化问题，但适合用于 **判定问题**（decision problem），因为这种问题的答案是简单的“是”或“否”。通常，我们可以将一个给定的最优化问题转化为一个相关的判定问题

## 多项式时间

### 形式语言体系[¶](https://wintermelonc.github.io/WintermelonC_Docs/zju/compulsory_courses/ADS/ch10/#形式语言体系)

**字母表**（alphabet）ΣΣ 是符号的有限集合。字母表 ΣΣ 上的 **语言**（language）L*L* 由表中符号组成的串的任意集合

定理

P={L:L能被一个多项式时间算法所接受}*P*={*L*:*L*能被一个多项式时间算法所接受}

## 多项式时间的验证[¶](https://wintermelonc.github.io/WintermelonC_Docs/zju/compulsory_courses/ADS/ch10/#3-多项式时间的验证)

定义 **验证算法**（verification algorithm）为含两个自变量的算法 A*A*，其中一个自变量是普通输入串 x*x*，另一个是称为“证书”（certificate）的二进制串 y*y*。如果存在一个证书 y*y* 满足 A(x,y)=1*A*(*x*,*y*)=1，则该含两个自变量的算法 A*A* 验证了输入串 x

> 🟢 **PTA 10.5**
>
> **If a problem can be solved by dynamic programming, it must be solved in polynomial time.**
>
> - T  
> - F  
>
> ✅ **答案：F**
>
> 比如01背包，旅行商问题

## NP 完全性与可归约性

语言 L1*L*1 在多项式时间内可以规约为语言 L2*L*2，记作 L1⩽PL2*L*1⩽*P**L*2，如果存在一个多项式时间可计算的函数 f:{0,1}∗→{0,1}∗*f*:{0,1}∗→{0,1}∗，满足对所有的 x∈{0,1}∗*x*∈{0,1}∗，x∈L1当且仅当f(x)=L2*x*∈*L*1当且仅当*f*(*x*)=*L*2，则称函数 f*f* 为 **规约函数**（reduction function），计算 f*f* 的多项式时间算法 F*F* 称为 **规约算法**（reduction algorithm）

定理

如果 L1,L2⊆{0,1}∗*L*1,*L*2⊆{0,1}∗ 是满足 L1⩽PL2*L*1⩽*P**L*2 的语言，则 L2∈P⇒L1∈P*L*2∈*P*⇒*L*1∈*P*

### NPC

> 1. *L*∈*NP*
> 2. 每一个NP问题都可以归约为该问题

### NPH

> 每一个NP问题都可以归约为该问题

### 电路可满足性

1. 电路可满足性问题属于 class NP
2. 电路可满足性问题属于 NP-Hard
3. 电路可满足性问题属于 NP-Completeness
4. 所有 NP 问题均可规约为 SAT（Satisfiability problem，满足性问题）

## NP完全性的证明

> 1.NP
>
> 2.归约

布尔公式的可满足性问题是 NP-Completeness

3-CNF 形式的布尔公式的可满足性问题是 NP-Completeness

## NP完全问题

### Clique Problem

在无向图 $G = (V, E)$ 中，**团 (Clique)** 是顶点集 $V$ 的一个子集，该子集中的**任意两个顶点之间都存在边直接相连**。简单来说，团就是原图中的一个“完全子图”（Complete Subgraph）。

**团的大小 (Size)：** 团中所包含的顶点数量。

**极大团 (Maximal Clique)：** 一个团，如果不能通过添加另一个顶点来扩大，则称为极大团。

**最大团 (Maximum Clique)：** 在给定的图中，顶点数最多的团。

**团数 $\omega(G)$：** 图 $G$ 中最大团的顶点数量。

![image-20260101165130333](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101165130333.png)

## Vertex Cover Problem

![image-20260101165752745](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260101165752745.png)

### Hamiltonian cycle



### Traveling Salesman Problem



### Subset-sum Problem

子集和问题：给定一个正整数的有限集 S*S* 和一个整数目标 t>0*t*>0，试问是否存在一个子集 S′⊆S*S*′⊆*S*，其元素和为 t*t*