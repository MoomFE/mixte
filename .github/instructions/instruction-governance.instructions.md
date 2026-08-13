---
description: "Use when 创建、更新、审查、重命名、拆分或删除 copilot-instructions.md、*.instructions.md，判断 recurring repository convention 是否应沉淀为长期指令，或涉及 memory / /memories/ 笔记、记忆、教训的记录（本仓库禁止写入）。"
applyTo: "**"
---

# 仓库指令治理

## 长期规则

- 稳定、可执行且仅适用于本仓库的规则，应写入 `.github/instructions/` 下主题最接近的现有文件。
- 只有关注点足够独立、值得单独发现和限定范围时，才新建 instruction。
- `.github/copilot-instructions.md` 只保留 workspace-wide 必要规则和 instruction routing table。
- 不要同时维护根目录 `AGENTS.md` 与 `.github/copilot-instructions.md`，避免形成两个竞争的项目级来源。

## 发现与作用域

- 每个 `*.instructions.md` 必须提供带引号、关键词充分的 `description`，并使用 “Use when…” 模式；包含 Agent 可能检索的具体任务术语。
- 每个 `*.instructions.md` 必须始终提供 `applyTo`，限定规则自动附加的文件范围。使用尽可能窄的 glob；除非所有仓库任务都需要全文，否则避免 `**`。
- 每个文件只处理一个关注点。通过引用关联指令，避免复制规则。
- 对应指令新增、重命名、拆分或删除时，同步维护总入口路由项。

## Memory 边界

- 在本仓库工作时，禁止创建、更新、删除、重命名或迁移任何 `/memories/` scope 下的文件。
- 仅当用户明确要求检查 memory 时才可只读查看。仓库文档和 instructions 始终是可维护的 source of truth。

## 不应沉淀的内容

- 不要将一次性上下文、临时决定、未经验证的假设或个人偏好写成仓库指令。
- 尚不稳定的指导应保留在当前对话或合适的业务/架构文档中，直到它具备长期性和可执行性。

## 审查清单

1. 确认关注点稳定、可执行且属于本仓库。
2. 删除与总入口及相邻 instructions 的重复内容。
3. 验证 YAML frontmatter 和文件位置。
4. 确认 `description` 支持 on-demand discovery，且 `applyTo` 不会无谓占用上下文。
5. 示例保持简短，并与当前 codebase 一致。
6. 更新 `.github/copilot-instructions.md` 路由。
