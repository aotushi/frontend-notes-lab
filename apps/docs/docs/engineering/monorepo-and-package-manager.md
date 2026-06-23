# Monorepo 与包管理器

## 问题

- 什么是 Monorepo？优缺点是什么？
- Monorepo 常见的实现方式有哪些？
- pnpm 为什么比 npm/yarn 更快、更省磁盘？

## 结论

### 理解路径

Monorepo 是把多个项目放在同一仓库的代码管理方式。pnpm 是为解决 npm/yarn 依赖管理问题而生的包管理器，两者结合（pnpm workspace）是当前流行的前端 Monorepo 方案。

### Monorepo

**优点：**
- 代码复用更方便，公共逻辑可直接引用而不需要发包
- 共享基础设施（ESLint 配置、tsconfig、CI 脚本等），不需要每个项目各建一套
- 子项目之间的依赖关系透明，可一次命令完成全量构建和部署
- 依赖版本统一管理，减少版本冲突
- 代码可见性高，有利于团队协作和代码审查

**缺点：**
- 代码权限管理复杂（所有人都能看到所有代码）
- 仓库体积大，`clone` / `pull` 变慢
- 上手成本高，需要理解子项目间的依赖关系
- 对构建工具、分支模型、依赖治理等工程能力要求高

### 常见 Monorepo 实现

| 工具 | 说明 |
| --- | --- |
| `pnpm workspace` | 在 `pnpm-workspace.yaml` 中声明子包，原生支持，配合 pnpm 使用 |
| `yarn/npm workspace` | `package.json` 中声明 `workspaces`，基础能力，无构建调度 |
| `Turborepo` | Vercel 开源，支持任务缓存和并行构建，目前最流行 |
| `Nx` | 强大的构建系统，内置代码生成、依赖图可视化、按需构建 |
| `Lerna` | 早期主流，基本任务调度，不支持离线缓存，现已较少单独使用 |
| `Rush` | 微软开源，适合大型企业级 Monorepo |

### pnpm 为什么更快更省磁盘

**npm/yarn 的问题：**

npm v2 及之前安装依赖是嵌套树结构，同一个包在不同子依赖中会重复安装，占用大量磁盘空间：

```
node_modules
└─ a
   └─ node_modules
      └─ b   # b 被重复安装
```

npm v3 / yarn 引入**扁平化**，把所有包提升到根 `node_modules`，解决了重复安装问题，但引入了**幽灵依赖**（Ghost Dependencies）：

```
node_modules
├─ a
└─ b   # b 是 a 的依赖，但被提升到根，可以被项目直接 import
```

幽灵依赖的风险：项目代码直接使用了 b，但 `package.json` 里没有声明 b。如果哪天去掉 a，b 也一起消失，项目就会报错。

**pnpm 的方案：**

pnpm 使用**全局内容寻址存储**（pnpm store）+ **硬链接** + **符号链接**：

1. 所有包只在磁盘上存一份（`pnpm store`，通常在 `~/.pnpm-store`）
2. 安装时，`node_modules/.pnpm/` 下通过**硬链接**指向 store 中的文件，不占额外磁盘
3. 项目 `node_modules` 下只有**符号链接**指向 `.pnpm/` 中对应的包

```
node_modules
├── a -> ./.pnpm/a@1.0.0/node_modules/a   # 符号链接
└── .pnpm
    ├── a@1.0.0
    │   └── node_modules
    │       ├── a -> <store>/a             # 硬链接到 store
    │       └── b -> ../../b@1.0.0/...    # a 的依赖 b 在 .pnpm 内部链接
    └── b@1.0.0
        └── node_modules
            └── b -> <store>/b
```

**带来的好处：**
- **节省磁盘**：多个项目共用同一份 store，相同版本的包只存一次
- **安装更快**：store 中已有的包直接创建硬链接，跳过下载
- **消除幽灵依赖**：`node_modules` 根目录下只有 `package.json` 明确声明的包，未声明的子依赖不可直接访问

## 参考来源

- [pnpm: 动机](https://pnpm.io/zh/motivation)
- [pnpm: 工作区](https://pnpm.io/zh/workspaces)
- [Turborepo: 为什么选择 Turborepo](https://turbo.build/repo/docs/crafting-your-repository/why-turborepo)
