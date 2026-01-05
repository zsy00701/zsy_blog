## DP

将一个问题拆分为一系列的 **子问题**，且这些子问题 **相互重叠**

通常按如下 4 个步骤来设计一个动态规划算法：

1. 刻画一个最优解的结构特征
2. 递归地定义最优解的值
3. 计算最优解的值，通常采用自底向上的方法
4. 利用计算出的信息构造一个最优解

如果仅需要一个最优解的值，可忽略步骤 4，如果需要步骤 4，有时就需要在执行步骤 3 的过程中维护一些额外信息，以便用来构造一个最优解

## Shortest Path in DAGs

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img2.png)

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img3.png)

### Maximum subsequence sum

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img4.png)

![image-20260102140814622](https://raw.githubusercontent.com/zsy00701/typora-images/main/image-20260102140814622.png)

## Optimal Binary Search Tree

![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img5.png)

![Img 6](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img6.png)

![Img 7](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img7.png)

## 0-1 knapsack

![Img 8](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img8.png)

![Img 9](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img9.png)

![Img 10](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img10.png)

## Product assemby

![Img 11](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img11.png)

~~~cpp
f[0][0] = 0;
f[1][0] = 0;
L[0][0] = 0;
L[1][0] = 0;
for (stage = 1; stage <= n; stage++) {
    for (line = 0; line <= 1; line++) {
        f_stay = f[line][stage - 1] + t_process[line][stage - 1];
        f_move = f[1 - line][stage - 1] + t_transit[1 - line][stage - 1];
        if (f_stay < f_move) {
            f[line][stage] = f_stay;
            L[line][stage] = line;
        } else {
            f[line][stage] = f_move;
            L[line][stage] = 1 - line;
        }
    }
}

line = f[0][n] < f[1][n] ? 0 : 1;
for (stage = n; stage > 0; stage--) {
    plan[stage] = line;
    line = L[line][stage];
}
~~~

## All-Pairs Shortest Path

![Img 12](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img12.png)

![Img 13](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch8_img13.png)