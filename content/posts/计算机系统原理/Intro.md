## Classes of Computers

- Personal computers(个人 PC)

1. General purpose，variety of software
2. subject to cost/performance tradeoff

- Server computers

1. Network Based
2. High capacity，performance，reliability
3. Range from small servers to building sized

> 服务器

- Supercomputers

1. Type of server  
2. High-end scientific and engineering calculations
3. Highest capacity but represent a small fraction of the overall computer market

- Embedded computers

1. Hidden as components of systems
2. Stringent power/performance/cost constraints 

## The PostPC Era

- personal mobile device(PMD)

​	

- cloud computing

1. Warehouse Scale Computers(WSC)    仓库级计算机

> 由成千上万台普通服务器连接在一起

1. Software as a Service(SaaS)
2. Portion of software run on PMD and a portion run in the Cloud

## understanding performance

- Algorithm
- I/O system
- Processor and memory system
- Programming language, compiler,architecture

## Below Your Program

### Application software

> written in high-level language

### System software

1. compiler
2. operating system

### Hardware

> Processor,memory,I/O controllers

## Levels of Program language

- High-level language
- Assembly language
- Hardware representation

## Inside the Processor

- Datapath：perform operations on data
- Control：sequences datapath，memory
- Cache memory

## Place for data

- volatile main memory

> Loses instructions and data when power off

- Non-volatile secondary memory
  - Magnetic disk(HDD-Hard Disk Drive)
  - Flash memory(Solid State Drive)
  - Optical disk(CDROM,DVD)

## Network

- Local area network
- Wide area network
- Wireless network

## Response Time and Throughput

- Response time（Elapsed time）

How long it takes to do a task

- Throughput（吞吐量）

Total work done per unit time

## Measuring execution time 

- Elapsed time(总的时间)

  - Total response time,including all aspects
    - Processing,I/O,OS overhead and system CPU time

- CPU time

  - Time spent processing a given job
    - Discounts I/O time ，other job's shares
  - Comprises user CPU time and system CPU time
  - Different programs are affected differently by CPU and system performance 

  

  ## CPU Clocking

  - Clock Cycle(一个时钟周期)
  - Clock Cycles(时钟周期数)
  - Clock Period（duration of a clock cycle)
  - Clock frequency(Cycles per second)=Clock Rate

  - CPU Clock Cycles * Clock Cycles Time=CPU Time

  ## Instruction Count and CPI

  > CPI: Cycles per instruction

  $$
  Clock\ Cycles=Instruction Count*Cycles per instruction
  $$

  **Detailed**
  $$
  Clock Cycles=  \sum_{i=1}^{n}(CPI_i*Instruction\ Count_i)
  $$

  ## Perfomance Summary

  | 因素 (Affecting Factor)                            | 影响的性能指标                 | 解释                                                         |
  | :------------------------------------------------- | :----------------------------- | :----------------------------------------------------------- |
  | **Algorithm (算法)**                               | 影响 **IC**，可能影响 **CPI**  | 算法决定了需要执行多少基本操作，从而直接影响所需的指令总数 (IC)。如果算法严重依赖某种复杂指令，也可能间接影响 CPI 。 |
  | **Programming Language (编程语言)**                | 影响 **IC**，**CPI**           | 不同的语言及其构造方式会影响编译器生成的机器指令的数量和类型 。 |
  | **Compiler (编译器)**                              | 影响 **IC**，**CPI**           | 编译器优化的好坏直接决定了程序被翻译成机器代码的效率。编译器可以选择生成更少的指令 (IC)，或选择更低 CPI 的指令组合 。 |
  | **Instruction Set Architecture (ISA, 指令集架构)** | 影响 **IC**，**CPI*            | ISA 是硬件和软件之间的接口，它定义了指令的集合。ISA 影响了程序编译后生成的指令数量 (IC)，不同指令集的设计也会影响执行指令所需的平均周期数 (CPI)，同时还限制了硬件设计者能够实现的最小时钟周期时间 (*T*ccycle) 。 |
  | **Processor and Memory System (处理器和内存系统)** | 影响 **CPI** 和 ***T\*ccycle** | 处理器和内存系统的设计（例如 CPU 缓存、流水线等）决定了指令执行的速度（CPI）和时钟频率（1/*T*ccycle） 。 |

  

  

  

