---
title: '-uv'
date: '2025-12-24T17:49:21.281Z'
excerpt: >-
  ## uv的各个文件 ### pyproject.toml: uv 完全基于 `pyproject.toml` 工作，它同时承担了： -
  项目元数据（名称、版本、作者） - Python 版本要求 - 依赖声明 - 构建系统 - uv 的专属配置 `举例`： ~~~toml [p…
category: 环境配置
---
## uv的各个文件

### pyproject.toml:

uv 完全基于 `pyproject.toml` 工作，它同时承担了：

- 项目元数据（名称、版本、作者）
- Python 版本要求
- 依赖声明
- 构建系统
- uv 的专属配置

`举例`：

~~~toml
[project]
name = "my_project"
version = "0.1.0"
requires-python = ">=3.10"

dependencies = [
    "torch",
    "transformers",
]

[tool.uv]
index-url = "https://pypi.org/simple"
~~~

### uv.lock:

>  精确依赖锁定文件

- 记录**每一个依赖的精确版本**
- 包含：
  - 直接依赖
  - 间接依赖
  - 哈希值
  - 下载源

示例：

```toml
[[package]]
name = "numpy"
version = "1.26.4"
```

## 新建项目

~~~python
uv init hello-world
cd hello-world
uv run main.py
~~~

`uv init` 会生成 `pyproject.toml`、示例 `main.py`、`.python-version` 等；第一次跑 `uv run/uv sync/uv lock` 时会自动出现 `.venv` 和 `uv.lock`.

## 添加/删除依赖

~~~python
uv add requests
uv remove requests
~~~

`uv add/uv remove` 会更新 `pyproject.toml`，并同步更新锁文件和环境.

### 例子

```
uv add torch
```

### 它**做了什么**

#### ① 修改 `pyproject.toml`（声明你“需要它”）

```
[project]
dependencies = [
  "torch"
]
```

#### ② 解析完整依赖树（包括间接依赖）   

比如：

```
torch
 ├─ numpy
 ├─ filelock
 ├─ sympy
 └─ ...
```

uv 做的是：

- ❌ 不下载 wheel
- ❌ 不改 `.venv`
- ✅ 解析依赖关系
- ✅ 写入 `pyproject.toml`
- ✅ 写入 `uv.lock`

#### ③ 更新 `uv.lock`（锁定所有精确版本）

```toml
[[package]]
name = "torch"
version = "2.3.1"

[[package]]
name = "numpy"
version = "1.26.4"
```

📌 **这一步非常重要**：
 它保证“任何机器都装出一模一样的环境”。

------

#### ❌ ④ 它**不会**做的事

- ❌ 不安装到 `.venv`
- ❌ 不修改当前 Python 环境
- ❌ 不等价于 `pip install`

## 







## 锁定和安装

>**uv 不需要你手动创建或激活虚拟环境**
  **`uv sync` / `uv run` 就够了**



~~~python
uv sync        # 按 uv.lock 把环境装成一致
uv lock        # 生成/更新 uv.lock
uv lock --upgrade                 # 升级全部（受约束限制）
uv lock --upgrade-package httpx   # 只升级一个
~~~

**uv sync**: 优先使用 `uv.lock`，没有才回退到 `pyproject.toml`

1. uv 检查当前目录是否有 `pyproject.toml`

2. 自动创建：

   ```
   .venv/
   ```

3. 在 `.venv` 中安装 `uv.lock` 或 `pyproject.toml` 里的依赖



## 运行命令

```
uv run python -c "import requests; print(requests.__version__)"
uv run -- flask run -p 3000
```

`uv run` 会在运行前检查锁文件/环境保持同步，让命令跑在“锁定的一致环境”里。

特点：

- 自动使用 `.venv`
- 不污染全局 shell
- 不需要 `source .venv/bin/activate`

**步骤 1️⃣：定位项目**

uv 会：

- 找当前目录
- 找 `pyproject.toml`
- 找 `.venv`
- 找 `uv.lock`

**步骤 2️⃣：确定 Python 解释器**

- 如果 `.venv` 存在 → 用 `.venv/bin/python`
- 如果不存在 → **创建 `.venv`**
- 如果有 `.python-version` → 用指定版本

👉 **不依赖你 shell 是否激活**

**步骤 3️⃣：检查依赖是否满足 `uv.lock`*8

uv 会对比：

```
uv.lock   vs   .venv/site-packages
```

可能出现三种情况：

✅ 情况 A：环境已经是最新

👉 直接运行命令

⚠️ 情况 B：缺包 / 版本不对

👉 uv 会：

- 下载缺失包
- 安装到 `.venv`
- **只补齐，不乱升级**

❌ 情况 C：lock 和项目不一致（极端）

👉 报错（尤其在 `--frozen` 模式）

**步骤 4️⃣：在“已校验的环境”中运行命令**

最终等价于：

```
/path/to/.venv/bin/python train.py
```

## 激活 uv 管理的虚拟环境

## `uv shell`

```bash
uv shell
```

执行后你会看到：

```bash
(.venv) $
```

这表示：

- 当前 shell 已绑定 `.venv`
- `python`、`pip`、`pytest` 等全部指向虚拟环境

现在你可以直接：

```bash
python main.py
pip list
pytest
```

退出：

```bash
exit
```
