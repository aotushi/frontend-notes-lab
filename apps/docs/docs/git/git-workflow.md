# Git 常用命令与分支合并

## 问题

- git 和 SVN 有什么区别？
- 常用的 git 命令有哪些？
- git pull 和 git fetch 的区别？
- git rebase 和 git merge 有什么区别？

## 结论

### 理解路径

git 操作围绕三个区域流转：工作区（修改文件）→ 暂存区（`git add`）→ 本地仓库（`git commit`）→ 远程仓库（`git push`）。rebase 和 merge 都能合并分支，核心区别在于是否保留分叉的提交历史。

### git vs SVN

| | git | SVN |
| --- | --- | --- |
| 架构 | **分布式**：每个开发者本地有完整仓库（含全部历史/分支/标签） | **集中式**：历史记录保存在中央服务器，离线无法提交 |
| 分支 | 指针指向某次 commit，创建开销极小，不影响他人 | 复制整个目录，开销大，分支变化影响所有人 |
| 版本号 | 无全局版本号，用 SHA-1 哈希唯一标识 commit | 有全局递增版本号 |
| 完整性 | SHA-1 哈希保证内容完整性 | 无哈希校验 |
| 容灾 | 任何一份克隆都包含完整历史，单点宕机不影响开发 | 服务器宕机则无法提交 |

### git pull vs git fetch

- `git fetch`：从远程仓库**下载**最新提交，但不合并到当前分支——只更新远程跟踪分支（如 `origin/main`）
- `git pull`：等价于 `git fetch` + `git merge`，下载后立即合并到当前分支

用法建议：先 `fetch` 看差异再手动 `merge/rebase`，可以更安全地控制合并时机。

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `git clone <url>` | 克隆远程仓库到本地 |
| `git init` | 在当前目录初始化新仓库 |
| `git add <file>` | 将文件加入暂存区 |
| `git commit -m "msg"` | 提交暂存区改动到本地仓库 |
| `git status` | 查看工作区和暂存区状态 |
| `git diff` | 工作区与暂存区的差异 |
| `git diff --staged` | 暂存区与上次提交的差异 |
| `git log` | 查看提交历史（哈希、作者、日期） |
| `git branch` | 列出所有分支（当前分支前有 `*`） |
| `git checkout <branch>` | 切换到指定分支 |
| `git checkout -b <branch>` | 创建并切换到新分支 |
| `git merge <branch>` | 将指定分支合并到当前分支 |
| `git pull` | 拉取远程更新并合并到当前分支 |
| `git push` | 推送本地分支到远程 |

### git merge vs git rebase

**git merge**：将两个分支的历史合并，生成一个新的 merge commit，提交图呈**分叉结构**，完整保留各分支的开发记录。

**git rebase**：找到两分支的共同祖先 commit，把当前分支之后的所有 commit 提取出来，按顺序"移植"到目标分支顶端，合并后提交历史是**线性结构**，看起来像从头在一条线上开发。

**如何选择：**
- 需要保留完整合并记录（适合多人协作主干）→ merge
- 需要整洁的线性提交历史（feature 分支 merge 前同步主干）→ rebase
- **不要对已推送到远程的公共分支做 rebase**，会改写提交历史，影响其他人。

## 参考来源

- [git-scm.com: git merge](https://git-scm.com/docs/git-merge)
- [git-scm.com: git rebase](https://git-scm.com/docs/git-rebase)
