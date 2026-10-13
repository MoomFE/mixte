<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# 响应式与副作用选择

> 触发条件：新增、修改、重构、替换或排查 `ref` / `reactive` / `computed` / `watch` / `watchEffect` / `whenever` 相关逻辑；或判断某段响应式逻辑应该留在组件还是下沉到 composable。既有代码的迁移与 bug 修复同样触发。
> 范围说明：这是个人长期形成的响应式习惯。项目已有实现优先；工具不存在时不要为了匹配个人习惯引入新依赖。
>
> 边界：本文件负责“如何选择响应式实现、是否应该下沉”；一旦已经决定需要设计一个可复用 composable，停止在这里继续讨论 API 形状，转读 `composable-design.md`。

## 1. `ref` 优先，但不是机械禁用 `reactive`

默认状态优先使用 `ref`，因为状态边界更明确、与组合式 API 的输入输出形式一致。

适合继续使用 `reactive` 的场景：

- 表单模型或多字段编辑状态；
- 需要自然对象字段读写的对象状态；
- 包装第三方组合式返回值；
- 动态键的字典 / 参数对象；
- 需要保持对象引用稳定的配置对象。

原则：**新代码默认 ref；已有代码不要为了统一风格机械改写 reactive。**

## 2. `computed` 表达派生关系

如果一个值可以完全由现有状态计算得到，就不要再维护第二份状态。

典型场景：

```text
可见性
标题
请求参数
格式化结果
按钮 disabled 状态
列表过滤结果
```

判断方式：

```text
已有状态
  ↓ 能直接计算？
computed
  ↓ 不能，需要等待 / 触发外部动作？
副作用
```

## 3. `watch` 只表达真正的命令式副作用

不要使用 `watch` 来模拟状态推导：

```ts
watch(source, value => {
  derived.value = transform(value)
})
```

优先改成：

```ts
const derived = computed(() => transform(source.value))
```

也不要把下面这种样板重复散落在业务代码中：

```ts
watch(source, value => {
  if (value) {
    doSomething()
  }
})
```

如果项目存在 `@mixte/use` / vueuse 的语义化工具，优先使用语义匹配的封装，而不是简单比较哪种写法更短：

| 真实语义 | 优先检查 |
| --- | --- |
| 只在 source 为 truthy 时执行回调 | `whenever` |
| 监听开始时若当前值 truthy，也立即执行回调 | `wheneverImmediate` |
| source 变为 `null` / `undefined` / `false` 等 falsy 值时也必须执行回调 | `watch` 族；若还需要立即执行，优先检查 `watchImmediate` |
| 条件成立期间注册一组副作用，并在条件失效时清理 | `wheneverEffectScope` / `wheneverEffectScopeImmediate` |
| 需要 deep / immediate + deep 预设 | `watchDeep` / `watchImmediateDeep` |

例如，清空文件时要重置状态或执行 abort，那么“清空”本身就是必须被处理的状态变化；`wheneverImmediate` 的 truthy 语义不匹配。若 `watchImmediate` 可以表达该行为，应优先用它，而不是直接手写 `watch(..., { immediate: true })`。

如果项目没有语义匹配的工具，或现有工具无法表达需要的行为，也不要为了形式一致而添加依赖。此时才使用原生 `watch`，让它直接表达命令式副作用，并尽量把复杂逻辑下沉到 composable。

## 4. 副作用的几个判断问题

准备写 `watch` 前，依次问：

1. 这实际上是不是一个 `computed`？
2. 项目已有工具能不能用语义化方式表达？
3. 这是一次性动作、持续监听，还是条件成立期间的一组副作用？
4. 这个副作用本身是否已经具备独立语义？如果是，考虑下沉到 composable；一旦决定封装，转读 `composable-design.md`。
5. 这个 watch 是否只是为了同步第二份状态？如果是，停止并重新设计数据流。

## 5. 请求属于副作用，不要用 watch 搭请求样板

如果参数变化需要刷新请求：

- 优先使用项目已有 `useRequest*` / `useAsyncData` / `useFetch` 等请求链路；
- 如果必须 watch 参数，watch 应负责“触发”，请求生命周期与 loading / error / cleanup 应由请求封装承担；
- 不要在多个组件中复制相同的 `watch + loading + try/catch/finally` 组合。

## 6. 什么时候应该下沉到 composable

以下任一情况出现，可以开始考虑下沉：

- watch 逻辑已经有独立语义；
- 需要管理监听、定时器、事件等多个副作用并统一清理；
- 同一响应式逻辑出现第二个使用方；
- 组件已经变成“状态 + 副作用”的杂糅层。

这里的职责只到“是否值得形成抽象”为止。**不要在本文件里继续设计 composable 的命名、输入、输出或内部实现协议；确定封装后读取 `composable-design.md`。**


## 7. 修改既有监听时的迁移检查

修改监听逻辑前，先明确：

1. 原回调会在什么状态触发，是否只处理 truthy 值？
2. 新需求是否要求处理 `null` / `undefined` / `false`、初始化状态或清理场景？
3. 从现有工具切换到另一个工具后，是否改变了首次执行、触发条件、deep 行为或清理时机？
4. 是否先检查了同包邻居和工具实现，再决定是否降级到原生 `watch`？

**迁移原则：修复目标行为，不顺手降级无关抽象。** 如果不得不使用更底层的 API，应能明确说出更高层工具缺少什么能力。
