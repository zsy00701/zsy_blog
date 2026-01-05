## 																																																																																																																									定义

二项队列是一群 heap 的集合，每个 heap 都是一个二项队列

Bk*B**k* 是将一个 Bk−1*B**k*−1 连接到另一个 Bk−1*B**k*−1 的根结点上形成的

![Img 1](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch5_img1.png)

二项队列类比二进制数

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch5_img2.png)

整个二项队列放在一个数组中，每个位置放相应的 heap，heap 用 left-child-next-sibling 实现

### findmin

最小值在其中一个根结点上

T=O(log⁡N)*T*=*O*(log*N*)

但是通过一些手段可以将时间变为 T=O(1)*T*=*O*(1)，比如我们可以“记录”最小值结点，每次变动的时候更新“记录”，这样每次找的时候就 O(1)*O*(1) 了

### merge

类比二进制加法

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch5_img3.png)

### insert

当作merge来处理

### deletemin

1. 找到 min 所在的 heap，剩下的 heap 当作 H'
2. 删除 min 结点后，该 heap 会分成一个新的二项队列 H''
3. 合并 H' 和 H''

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch5_img4.png)

## tanhuan分析

N 个元素的二项队列可以通过 N 次 insert 形成，共 T=O(N)*T*=*O*(*N*)Tamortized=O(1)*T**am**or**t**i**ze**d*=*O*(1)

![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch5_img5.png)

![Img 6](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch5_img6.png)