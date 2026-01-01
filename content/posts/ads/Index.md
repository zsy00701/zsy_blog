## 定义

存储每个单词出现的次数，和出现过此单词的文档

![Img 1](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch3_img1.png)

也可以存储单词在每个文档中的位置

![Img 2](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch3_img2.png)

### word stemming

> 处理单词时，只记录此单词的词干

![Img 3](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch3_img3.png)

### stop words

一些单词非常常见，在搜索的过程中，这些单词对文档的选择作用不大，因此在倒排索引表中，不记录这些单词

### accessing terms

1. 使用 search tree
2. 使用 hash
   1. 搜索单个单词速度很快
   2. 范围搜索的开销很大

## distributed indexing

1. Term-partitioned index

![Img 4](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch3_img4.png)

2. document-partitioned index

![Img 5](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch3_img5.png)

## threshold

> 用户搜索后，根据某种规则将搜索到的文档排序，并只展示前 x 个文档给用户

## 评价搜索引擎

### 性能评估[¶](https://wintermelonc.github.io/WintermelonC_Docs/zju/compulsory_courses/ADS/ch3/#性能评估)

1. 响应时间
2. 索引表大小

> When evaluating the performance of data retrieval, it is important to measure the relevancy of the answer set.
>
> T
> F
>
> 答案：F
>
> 搜索性能与答案集文档相关性无关。可以说文档相关性和搜索准确性有关，但是和搜索性能无关

### 答案集相关性

![Img 6](https://wintermelonc.github.io/WintermelonC_Docs/img/ADS/ch3/ADS_ch3_img6.png)

1. Precision 反映了在展示出的文档中，与用户搜索相关性大的文档的占比
2. Recall 反映了在与用户搜索相关性大的文档中，展示出的文档的占比

![Img 7](https://raw.githubusercontent.com/zsy00701/typora-images/main/ADS_ch3_img7-20260101182606971.png)

1. Precision 大，Recall 小：大多数展示的文档都是相关的，但仍会遗漏一些相关的文档
2. Precision 小，Recall 大：大多数相关的文档都展示了，但仍会包含一些不相关的文档
3. Precision 大，Recall 大：理想情况

> Precision is more important than recall when evaluating the explosive detection in airport security.
>
> T
> F
>
> 答案：F
>
> 机场安检时，为了安全起见，怀疑的东西都检查一下，即使会误判，Recall 反映了在所有爆炸品中，被检查的占比。所以 Recall 更重要一些