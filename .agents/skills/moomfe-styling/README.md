# moomfe-styling Skill

这是一个可跨项目复制的通用样式编写 Skill。

## 目录

```text
moomfe-styling/
├── SKILL.md
├── README.md
├── references/
│   ├── README.md
│   ├── writing-css.md
│   ├── unocss.md
│   ├── tailwind-v3.md
│   ├── tailwind-v4.md
│   └── troubleshooting.md
└── notes/
    └── README.md
```

## 核心分层

```text
SKILL.md
  │
  ├── 通用决策规则 / 个人习惯
  │
  └── references/
        通用技术参考

notes/
  └── 当前项目的具体事实 / 例外 / 沉淀
```

### `SKILL.md`

跨项目复用的核心行为规范。描述的是“应该如何判断和写样式”，而不是某个仓库的具体配置。

### `references/`

跨项目复用的技术参考。里面可以包含 UnoCSS、Tailwind、原生 CSS 等通用知识，但**默认视为共享、稳定内容**。普通开发任务不应该因为当前项目的具体情况去修改它。

### `notes/`

当前宿主项目的私有沉淀区。例如：

- 当前项目实际使用的 breakpoint；
- 已有 shortcut / token；
- 第三方 UI 库的覆盖方式；
- 特殊的样式例外；
- 已知坑点与历史兼容问题。

复制 moomfe-styling 到其他项目时，可以直接忽略整个 `notes/` 目录。

## 使用方式

将 `moomfe-styling` 放到：

```text
.agents/skills/moomfe-styling/
```

如果是把这个 Skill 从一个项目复制到另一个项目：

```text
复制：SKILL.md + references/
不复制：notes/
```

## 规则强度

- MUST：必须遵守
- SHOULD：默认遵守
- PREFER：偏好
- AVOID：通常避免
- NEVER：明确禁止
