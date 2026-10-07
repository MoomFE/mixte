# moomfe-vue References

这里放 **跨项目可复用、但不需要每次都加载** 的 Vue 相关参考资料。

## 读取原则

- `SKILL.md` 是行为规则；references 是按需读取的补充知识。
- 当前项目事实、依赖、例外、历史包袱放 `../notes/`，不要写进这里。
- references 默认作为跨项目共享内容维护；普通开发任务不要因为当前项目特例修改它们。
- 如果某个 reference 与项目实际代码或配置冲突，以项目实际情况为准。
- 两个有明确边界的 reference 不重复承担同一层决策：`reactivity-patterns.md` 负责“选什么响应式实现 / 是否下沉”，`composable-design.md` 负责“已经决定封装后怎么设计这个抽象”。

## 当前文件

- `reactivity-patterns.md`：`ref` / `reactive` / `computed` / `watch` / `whenever` 等响应式选择，以及何时考虑下沉到 composable。
- `composable-design.md`：已经决定封装后的组合式函数与组件 API、输入输出、生命周期、类型和复用设计。
- `jsx-render-fragments.md`：JSX 渲染片段的使用边界与写法。
- `nuxt.md`：Nuxt 场景下的少量稳定做法。
