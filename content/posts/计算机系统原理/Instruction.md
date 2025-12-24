## 概念梳理

- PC: Program Counter (当前正在执行的指令地址)
- ra：return address (x1)



## Instruction Set

> Different computers have different instruction sets

## RISC-V Instruction Set

- Used as the example throughout the book
- UC Berkeley
- Typical of many modern ISAs
- Similar ISAs have a large share of embedded core market.

## Design Principle



## 32个寄存器

> 一条指令只能对存放在寄存器中的数据执行算术运算，不能直接对内存。

| Register number  | Usage                         | Saver |
| ---------------- | ----------------------------- | ----- |
| X0               | the constant value 0          |       |
| X1               | return address                |       |
| x2(sp)           | Stack pointer                 |       |
| X3(gp)           | Global pointer                |       |
| X4(tp)           | thread pointer                |       |
| X5 - x7 ,x28-x31 | temporary registers           |       |
| X10 - x17        | Arguments or return values    |       |
| X9,x18-x27       | saved registers               |       |
| X8               | saved registers/frame pointer |       |

## 指令

> Load:memory->register
>
> operation:register<->register
>
> Store:register->memory



| 指令                                                         | 举例           | 说明          |
| ------------------------------------------------------------ | -------------- | ------------- |
| add                                                          | Add x5,x6,x7   | x5=x6+x7      |
| add immedite                                                 | Addi x5,x6,20  | x5=x6+20      |
| load double word                                             | ld x5,40(x6)   | X5=Mem[x6+40] |
| store double word                                            | sd x5,40(x6)   | Mem[x6+40]=x5 |
|                                                              |                |               |
| load upper immediate(把一个立即数的高 20 位装进寄存器，低位补 0) | lui x5,0x12345 | x5=0x12345000 |
|                                                              |                |               |
|                                                              |                |               |
|                                                              |                |               |

| and                    | and x5,x6,x7 | x5=x6&x7  |
| ---------------------- | ------------ | --------- |
| or                     | or x5,x6,x7  | x5=x6\|x7 |
| xor                    |              |           |
| shift left logical     | sll          |           |
| shift right logical    | Srl          |           |
| Shift right arithmetic |              |           |
| ······                 |              |           |

> 逻辑左移：低位补 0
>
> 逻辑右移：高位补 0
>
> 算术右移：高位补符号位

**条件分支：**

| branch on equal     | beq x5,x6,100 | if (x5==x6) go to PC+100 |
| ------------------- | ------------- | ------------------------ |
| branch on not equal | Bne x5,x6,100 | If(x5!=x6) go to PC+100  |

**无条件跳转：**

| jump and link          | jal x1,100     | x1=PC+4;go to PC+100 |
| ---------------------- | -------------- | -------------------- |
| jump and link register | jal x1,100(x5) | x1=PC+4;go to x5+100 |

## R-type Instruction

> 所有的操作数都在寄存器中，不需要立即数、不访问内存

- includes arithmetic, logic and shift instructions with all operands in registers
  - 算术
  - 逻辑
  - 移位
- opcode：0110011,0111011(word)

![image-20251223103719192](/Users/zhoushengyao/Library/Application Support/typora-user-images/image-20251223103719192.png)

**Arithmetic instructions use register
operands**：：**寄存器比内存快得多**，CPU可以在一个或几个时钟周期内访问寄存器。

## Memory Operands

- load
- store

- Each address identifies an 8-bit byte

- RISC-V is Little Endian
- RISC-V does not require words to be aligned in memory

> 对齐：某种大小的数据，最好（或必须）放在“地址是它大小整数倍”的位置上。

- Values must be fetched from memory before instructions can operate on them

`How is memory-address determined?`:

- The compiler organizes data in memory

## Endian-ness（字节序）

`Little Endian`:

- Least-significant byte at least address of a word
- Big Endian: Most-significant byte at least 
  address

![image-20251224140741707](/Users/zhoushengyao/Library/Application Support/typora-user-images/image-20251224140741707.png)

> 在 RISC-V 架构中：
>
> Word = 32bit =4字节 
>
> Double word=64bit=8字节 

## Register vs Memory

- Register is faster to access than memory
- Operating on memory data requires loads and stores (so on)
- Compiler must use registers for variables as  much as possible
  - Only spill to memory for less frequently used variables
  - Register optimazation is important

## Immediate Operands

- No subtract immediate instruction
  - just use a negtive constant

