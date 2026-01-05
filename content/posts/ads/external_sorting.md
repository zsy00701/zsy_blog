---
title: 外部排序
date: '2026-01-01T10:46:33.228Z'
excerpt: 大规模数据的外存排序算法
category: ads
---

假设内存一次只能处理 M = 3 个单位的数据

![Img 1](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch15_img1.png)

k-way merge：将 k 个有序序列合并为 1 个有序序列。这里的有序序列被称为 run，而将 k⋅c*k*⋅*c* 个 run 合并成 c*c* 个 run 的过程，称为 1 个 pass

Pass 1：2-way merge，将 T1*T*1 的 5 段数据均分到两条 tape 上

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch15_img2.png)

Pass 2：

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch15_img3.png)

Pass 3：

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch15_img4.png)

Pass 4：

![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch15_img5.png)

number of passes =1+⌈log⁡kNM⌉*n**u**mb**er* *o**f* *p**a**sses* =1+⌈log*k**M**N*⌉

使用 k-way merge 至少需要 2k 个 tape

## 减少pass的数量

### 增加k

> In external sorting, a k-way merging is usually used in order to reduce the number of passes and we will take the k as large as possible as long as we have enough amount of tapes.
>
> T
> F
>
> 答案：F
>
> k 过大时，硬件错误率会上升



### 减少tape的数量

如果 run 的数量是某个斐波那契数 FN*F**N*，那么最好的方法就是分成 FN−1*F**N*−1 和 FN−2*F**N*−2 两个 runs

对于 k-way merge，FNk=FN−1k+⋯FN−kk, FNk=0(0⩽N⩽k−2), Fk−1k=1*F**N**k*=*F**N*−1*k*+⋯*F**N*−*k**k*, *F**N**k*=0(0⩽*N*⩽*k*−2), *F**k*−1*k*=1

只需要 k + 1 个 tapes

假设 T1*T*1 有 34 个 runs 需要 merge，若采用 2-way merge，首先将其拆分成 21 和 13 两段

| T1*T*1 | T2*T*2 | T3*T*3 | 说明                                              |
| :----: | :----: | :----: | :------------------------------------------------ |
|   21   |   13   |   -    |                                                   |
|   8    |   -    |   13   | T1*T*1 的前 13 个 run 与 T2*T*2 合并，写入 T3*T*3 |
|   -    |   8    |   5    | T3*T*3 的前 8 个 run 与 T1*T*1 合并，写入 T2*T*2  |
|   5    |   3    |   -    |                                                   |
|   2    |   -    |   3    |                                                   |
|   -    |   2    |   1    |                                                   |
|   1    |   1    |   -    |                                                   |
|   -    |   -    |   1    |                                                   |

### k-way 内排序优化

![Img 6](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch15_img6-20260102004228583.png)

### 并行

在这里，**“并行”**（Parallelism）并不是指有多个 CPU 在同时计算，而是指 **CPU（负责计算）** 和 **磁盘/磁带控制器（负责数据搬运）** 两个不同的硬件设备在**同一时间、各忙各的**。

> 通常对于 k-way merge，我们需要 2k 个 input buffers 和 2 个 output buffer

- **CPU**：处理速度极快，像法拉利。
- **磁盘 (Disk)**：读取数据极慢，像蜗牛。
- **缓冲区 (Buffer)**：就是内存里的一块临时空间。

在进行 $k$ 路归并时，CPU 需要同时看 $k$ 个顺串（文件）里的数据，把最小的那个挑出来。



### Replacement Selection Sorting

**置换选择排序（Replacement Selection Sorting）** 是外排序（External Sorting）中一种非常高效的算法，其主要目的是**产生尽可能长的初始顺串（Initial Runs）**。

传统的排序方法（如快速排序）在内存中只能生成长度等于内存容量 $M$ 的顺串。

而置换选择排序利用了“边输入、边排序、边输出”的逻辑，使得生成的顺串平均长度可以达到 $2M$，在最好情况下，如果输入数据已经是升序的，甚至能一次性生成一个包含所有数据的超长顺串。

为了实现这个过程，我们需要在内存中维护一个**最小堆（Min-Heap）**，或者更高效的**败者树（Loser Tree）**。

### 算法步骤：

1. **初始化**：从输入文件中读取 $M$ 条记录到内存，建立一个最小堆。
2. **输出与替换**：
   - 从堆顶选出最小的记录（记为 `MIN`），将其写入当前的输出顺串。
   - 从输入文件中读取下一条记录（记为 `NEXT`）来替换堆顶的位置。
3. **关键判断（冻结机制）**：
   - **如果 `NEXT > MIN`**：说明新记录比刚刚输出的记录大，它可以继续参与到当前的顺串排序中。我们将堆调整，继续寻找新的最小值。
   - **如果 `NEXT < MIN`**：说明新记录比刚刚输出的记录小。由于当前顺串已经输出到了 `MIN`，这个 `NEXT` 已经无法加入当前顺串了。此时，我们将这个位置**“冻结”**。被冻结的记录不参与当前堆的排序，直到下一个顺串开始。
4. **切换顺串**：
   - 当堆中所有的位置都被冻结时，说明当前顺串无法再延长了。
   - 关闭当前顺串文件，将所有冻结的记录“解冻”，重新建堆，开始生成下一个新的顺串。
