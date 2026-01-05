## 什么是汇编语言

```
高级语言(C):     int a = 5;
                ↓ 编译
汇编语言:        mov ax, 5
                ↓ 汇编
机器码:          B8 05 00
```

**汇编语言**是最接近计算机硬件的编程语言，每条指令几乎对应一条机器指令。

## 寄存器



8086有14个16位寄存器：

#### **通用寄存器（最常用）**

assembly

```assembly
AX (Accumulator)     - 累加器，算术运算
BX (Base)           - 基址寄存器，存地址
CX (Counter)        - 计数器，循环计数
DX (Data)           - 数据寄存器

; 每个16位寄存器可分成两个8位：
AX = AH (高8位) + AL (低8位)
BX = BH + BL
CX = CH + CL
DX = DH + DL
```

**示例：**

assembly

```assembly
mov ax, 1234h    ; ax = 1234h (十六进制)
                 ; ah = 12h, al = 34h
```

#### **变址寄存器**

assembly

```assembly
SI (Source Index)        - 源变址
DI (Destination Index)   - 目的变址
BP (Base Pointer)        - 基址指针
SP (Stack Pointer)       - 栈指针
```

#### **段寄存器**

assembly

```assembly
CS (Code Segment)     - 代码段
DS (Data Segment)     - 数据段
SS (Stack Segment)    - 栈段
ES (Extra Segment)    - 附加段
```

#### **控制寄存器**

assembly

~~~assembly
IP (Instruction Pointer)  - 指令指针
FLAGS                     - 标志寄存器
```
~~~

## 内存寻址

> 8086使用**段：偏移**模式：

**物理地址=段地址✖️16+偏移地址**

例如：DS=1000h, BX=0050h 

物理地址 = 1000h × 16 + 0050h  = 10000h + 0050h   = 10050h

## 基本指令

### 数据传输指令

#### **MOV - 最基本的指令**

assembly

```assembly
; 格式：MOV 目的, 源
; 功能：把源的值复制到目的

mov ax, 5        ; ax = 5 (立即数→寄存器)
mov bx, ax       ; bx = ax (寄存器→寄存器)
mov [1234h], ax  ; 内存[1234h] = ax (寄存器→内存)
mov cx, [1234h]  ; cx = 内存[1234h] (内存→寄存器)

; ❌ 不允许的操作：
mov [1234h], [5678h]  ; 内存→内存 (错误!)
mov cs, ax            ; 不能直接改CS
```

#### **XCHG - 交换**

assembly

```assembly
xchg ax, bx     ; 交换ax和bx的值
```

 你可以交换两个寄存器，或者一个寄存器与一个内存地址。但受限于 x86 架构设计，你**不能**直接交换两个内存地址。

| **操作数 1** | **操作数 2** | **示例**          | **说明**                     |
| ------------ | ------------ | ----------------- | ---------------------------- |
| **寄存器**   | **寄存器**   | `XCHG EAX, EBX`   | 极快（通常 0 延迟）          |
| **寄存器**   | **内存**     | `XCHG EAX, [var]` | 较慢（隐含锁总线/缓存）      |
| **内存**     | **寄存器**   | `XCHG [var], EAX` | 同上                         |
| **内存**     | **内存**     | **非法**          | x86 不允许内存对内存直接操作 |
| **立即数**   | **任意**     | **非法**          | 不能跟常数（如 5）交换       |

#### **LEA - 加载有效地址**

assembly

```assembly
lea si, [bx+10]  ; si = bx+10 (地址运算)
```

### 算术指令

assembly

```assembly
; ADD - 加法
add ax, 5       ; ax = ax + 5
add ax, bx      ; ax = ax + bx

; SUB - 减法
sub ax, 3       ; ax = ax - 3

; INC/DEC - 加1/减1
inc cx          ; cx = cx + 1
dec cx          ; cx = cx - 1

; MUL - 无符号乘法
mov al, 5
mov bl, 3
mul bl          ; ax = al × bl = 15

; DIV - 无符号除法
mov ax, 17
mov bl, 5
div bl          ; al = 商(3), ah = 余数(2)
```

核心规则：被乘数和结果位置是固定的

CPU 根据你提供的 `source` 的大小（8位、16位、32位），自动决定跟谁乘，以及结果存哪。

| **source 大小**       | **隐含的被乘数** | **结果存放位置 (高位:低位)** | **说明**                                         |
| --------------------- | ---------------- | ---------------------------- | ------------------------------------------------ |
| **8-bit** (如 `BL`)   | `AL`             | **AX**                       | 结果可能变大，所以用 16 位存                     |
| **16-bit** (如 `BX`)  | `AX`             | **DX:AX**                    | 结果存入两个寄存器，高 16 位在 DX，低 16 位在 AX |
| **32-bit** (如 `EBX`) | `EAX`            | **EDX:EAX**                  | 高 32 位在 EDX，低 32 位在 EAX                   |
| **64-bit** (如 `RBX`) | `RAX`            | **RDX:RAX**                  | 高 64 位在 RDX，低 64 位在 RAX                   |

核心规则：被除数必须比除数“宽”一倍

这是新手最容易报错的地方。如果你用 16 位数做除数，CPU 会默认被除数是 32 位的（即便你的被除数很小）。

| **source (除数)**     | **隐含的被除数** | **商 (Quotient)** | **余数 (Remainder)** |
| --------------------- | ---------------- | ----------------- | -------------------- |
| **8-bit** (如 `BL`)   | **AX**           | `AL`              | `AH`                 |
| **16-bit** (如 `BX`)  | **DX:AX**        | `AX`              | `DX`                 |
| **32-bit** (如 `EBX`) | **EDX:EAX**      | `EAX`             | `EDX`                |
| **64-bit** (如 `RBX`) | **RDX:RAX**      | `RAX`             | `RDX`                |





### 逻辑指令

assembly

```assembly
; AND - 与
mov al, 0Fh     ; al = 00001111b
and al, 33h     ; al = 00000011b

; OR - 或
mov al, 0Fh     ; al = 00001111b
or al, 30h      ; al = 00111111b

; XOR - 异或（常用于清零）
xor ax, ax      ; ax = 0 (最快的清零方法)

; NOT - 取反
not al          ; al = ~al

; SHL/SHR - 左移/右移
shl al, 1       ; al = al × 2
shr al, 1       ; al = al / 2
```

### 比较和跳转

assembly

```assembly
; CMP - 比较（相当于减法但不保存结果）
cmp ax, bx      ; 比较ax和bx

; 条件跳转
je  label       ; 等于则跳转 (Jump if Equal)
jne label       ; 不等则跳转
jg  label       ; 大于则跳转 (Greater)
jl  label       ; 小于则跳转 (Less)
jge label       ; 大于等于
jle label       ; 小于等于

; 无条件跳转
jmp label       ; 直接跳转
```

**示例：**

assembly

```assembly
    mov ax, 5
    cmp ax, 3
    jg  greater     ; ax>3，跳转到greater
    mov bx, 0
    jmp done
greater:
    mov bx, 1
done:
    ; bx = 1
```

## 循环结构

### 使用CX作为计数器

assembly

```assembly
; 打印10个字符'A'
    mov cx, 10      ; 循环10次
loop_start:
    mov ah, 02h     ; DOS功能：显示字符
    mov dl, 'A'
    int 21h
    loop loop_start ; cx自动减1，不为0则跳转

; loop指令 = dec cx + jnz
```

### 完整的循环示例

assembly

```assembly
; 计算1+2+3+...+100
    mov cx, 100     ; 计数器
    mov ax, 0       ; 累加器
    mov bx, 1       ; 当前数
sum_loop:
    add ax, bx      ; ax += bx
    inc bx          ; bx++
    loop sum_loop   ; 循环
    ; 结果：ax = 5050
```

## 数组和内存操作

### 定义数组

assembly

```assembly
data segment
    arr db 1, 2, 3, 4, 5    ; 字节数组
    num dw 10, 20, 30       ; 字数组
    str db 'Hello$'         ; 字符串
data ends
```

### 访问数组

assembly

```assembly
; 方法1：使用BX作为索引
    mov bx, 0
    mov al, arr[bx]     ; al = arr[0] = 1
    
    mov bx, 2
    mov al, arr[bx]     ; al = arr[2] = 3

; 方法2：使用SI/DI
    mov si, offset arr
    mov al, [si]        ; al = arr[0]
    inc si
    mov al, [si]        ; al = arr[1]
```

### 字符串操作

assembly

~~~assembly
; MOVSB - 移动字节
    mov si, offset source
    mov di, offset dest
    mov cx, 5
    cld                 ; 清除方向标志（正向）
    rep movsb           ; 重复移动5个字节

; STOSB - 存储字节
    mov di, offset buffer
    mov al, 'A'
    mov cx, 10
    rep stosb           ; 填充10个'A'
```
~~~

## 栈操作

### 栈的基本概念

在 x86 架构中，堆栈在内存中是**从高地址向低地址生长**的。

- **栈底（Stack Bottom）**：是高地址（比如 `0x1000`），这是堆栈的起点。
- **栈顶（Stack Top）**：是低地址（比如 `0x0FFA`），随着你放入数据，地址会变小。
- **SP (Stack Pointer)**：栈顶指针寄存器。它始终指向当前的栈顶。

### 栈指令

assembly

```assembly
; PUSH - 压栈
push ax         ; SP-=2, [SP]=ax

; POP - 出栈
pop bx          ; bx=[SP], SP+=2

; 示例：
    mov ax, 100
    push ax     ; 保存ax
    mov ax, 200 ; 修改ax
    pop ax      ; 恢复ax (ax=100)
```

## 子程序

### 基本子程序

assembly

```assembly
; 定义子程序
my_func:
    ; 函数体
    ret         ; 返回

; 调用子程序
main:
    call my_func
    ; 继续执行
```

### 带参数的子程序

assembly

```assembly
; 计算两数之和
; 参数：ax, bx
; 返回：ax = ax + bx
add_func:
    add ax, bx
    ret

; 调用
    mov ax, 5
    mov bx, 3
    call add_func
    ; ax = 8
```

### 使用栈传递参数

assembly

```assembly
; int add(int a, int b)
add_func:
    push bp
    mov bp, sp      ; 建立栈帧
    
    mov ax, [bp+4]  ; 取第一个参数
    add ax, [bp+6]  ; 加第二个参数
    
    pop bp
    ret

; 调用
    push 3          ; 参数b
    push 5          ; 参数a
    call add_func
    add sp, 4       ; 清理栈
    ; ax = 8
```

## 完整程序结构

### 程序模板

assembly

```assembly
.386                    ; 使用386指令集
data segment use16      ; 数据段
    msg db 'Hello, World!$'
data ends

code segment use16      ; 代码段
assume cs:code, ds:data

main:
    ; 初始化数据段
    mov ax, data
    mov ds, ax
    
    ; 显示字符串
    mov ah, 09h
    mov dx, offset msg
    int 21h
    
    ; 退出程序
    mov ah, 4Ch
    int 21h
    
code ends
end main

```

### DOS中断（系统调用）

assembly

```assembly
; INT 21h - DOS功能调用

; 功能01h：读取字符
    mov ah, 01h
    int 21h
    ; al = 读取的字符

; 功能02h：显示字符
    mov ah, 02h
    mov dl, 'A'
    int 21h

; 功能09h：显示字符串（$结尾）
    mov ah, 09h
    mov dx, offset msg
    int 21h

; 功能4Ch：退出程序
    mov ah, 4Ch
    int 21h
```

## 实战练习

### 练习1：输出字符串

assembly

```assembly
data segment
    msg db 'Hello$'
data ends

code segment
assume cs:code, ds:data
main:
    mov ax, data
    mov ds, ax
    
    mov ah, 09h
    mov dx, offset msg
    int 21h
    
    mov ah, 4Ch
    int 21h
code ends
end main
```

### 练习2：计算数组和

assembly

```assembly
data segment
    arr db 1, 2, 3, 4, 5
    len equ 5
data ends

code segment
assume cs:code, ds:data
main:
    mov ax, data
    mov ds, ax
    
    mov cx, len
    mov bx, 0       ; 索引
    mov ax, 0       ; 累加器
    
sum_loop:
    add al, arr[bx]
    inc bx
    loop sum_loop
    
    ; al = 15
    
    mov ah, 4Ch
    int 21h
code ends
end main
```

### 练习3：字符串反转

assembly

```assembly
data segment
    str db 'HELLO'
    len equ 5
data ends

code segment
assume cs:code, ds:data
main:
    mov ax, data
    mov ds, ax
    
    mov cx, len/2
    mov si, 0
    mov di, len-1
    
    
reverse_loop:
    mov al, str[si]
    mov bl, str[di]
    mov str[si], bl
    mov str[di], al
    
    inc si
    dec di
    loop reverse_loop
    
    ; str = 'OLLEH'
    
    mov ah, 4Ch
    int 21h
code ends
end main 
```

## 常见错误

### 语法错误

assembly

```assembly
; ❌ 错误
mov 5, ax           ; 立即数不能作为目的
mov [1234h], [5678h] ; 不能内存到内存

; ✅ 正确
mov ax, 5
mov ax, [1234h]
mov bx, [5678h]
mov [1234h], bx
```

### 段错误

assembly

```assembly
; ❌ 忘记初始化DS
mov ax, [1234h]     ; 可能访问错误的段

; ✅ 正确
mov ax, data
mov ds, ax
mov ax, [1234h]
```