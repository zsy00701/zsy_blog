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

`uv add/uv remove` 会更新 `pyproject.toml`，并同步更新锁文件和环境（典型用法）.

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