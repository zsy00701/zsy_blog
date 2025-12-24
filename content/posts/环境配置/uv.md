## 









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

~~~python
uv sync        # 按 uv.lock 把环境装成一致
uv lock        # 生成/更新 uv.lock
uv lock --upgrade                 # 升级全部（受约束限制）
uv lock --upgrade-package httpx   # 只升级一个
~~~

## 运行命令

```
uv run python -c "import requests; print(requests.__version__)"
uv run -- flask run -p 3000
```

`uv run` 会在运行前检查锁文件/环境保持同步，让命令跑在“锁定的一致环境”里。