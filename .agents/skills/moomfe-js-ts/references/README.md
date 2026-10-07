# moomfe-js-ts References

这里放**跨项目可复用、但不需要每次都加载**的 JavaScript / TypeScript 参考规则。

## 读取原则

- `SKILL.md` 负责高频行为规则与决策顺序；references 负责具体模式与边界。
- 当前项目事实、依赖、例外、历史包袱放 `../notes/`，不要写进这里。
- references 默认作为跨项目共享内容维护；普通开发任务不要因为当前项目特例修改它们。
- 如果某个 reference 与项目实际代码或配置冲突，以项目实际情况为准。

## 文件边界

- `javascript-patterns.md`：函数、参数、控制流、集合、mutation / 复制、表达式复杂度与可读性。
- `typescript-patterns.md`：type / interface、泛型、类型推导、断言、any / unknown、utility types、重载与类型建模。
- `async-and-errors.md`：async / await、并发、错误传播、清理、竞态与请求状态；个人工具生态中的 `@mixte/use` 只作为默认复用来源。
- `api-design.md`：导出、命名、`define*` / `create*`、参数与返回值、公共 API 边界和抽象阈值。

references 描述“怎么落地”，不重复讲完整技术原理，也不记录具体项目目录或历史证据。
