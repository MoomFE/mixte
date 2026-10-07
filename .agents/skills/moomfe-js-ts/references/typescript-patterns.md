<!-- 跨项目共享参考：普通任务只读不改；项目特例写 ../notes/；仅用户明确要求更新通用 Skill 时才修改。 -->

# TypeScript 类型决策

本文件只讨论类型层面的具体选择。项目已有类型风格与 TypeScript 配置优先于以下默认偏好。

## type / interface

| 场景 | 默认选择 |
| --- | --- |
| 对象形状、options、DTO、返回对象、公共契约 | `interface` |
| 联合、交叉、函数类型 | `type` |
| 条件类型、映射类型、递归类型 | `type` |
| interface 组合 | `extends` |

核心原则：**形状优先 interface，组合和类型运算优先 type。**

如果对象形状天然需要 `T & {...}` 等组合能力，再退回 `type`，不要为了“绝对统一”制造别扭的 interface。

## 类型推导

- 默认让 TypeScript 推导；只有公共契约、复杂返回、泛型边界或明确需要约束时才补显式类型。
- 参数类型必须清晰；内部简单变量不必重复声明与表达式完全一致的类型。
- 公共 API 的复杂返回优先显式标注；实现细节优先保持推导。
- `const common: SomeContract = {...}` 这类写法可用于让实现主动接受接口约束。

## 泛型

- 泛型用于表达“调用方类型会影响结果类型”的关系，而不是单纯增加形式上的复用。
- 有稳定合理的默认值时提供默认值，降低调用方负担。
- 优先使用已有工具类型完成解包：`Parameters`、`ReturnType`、`AsyncReturnType` 等。
- 复杂类型可以留在类型层，但不要把调用方逼进条件类型、层层泛型参数和大量显式类型参数。

## any / unknown

个人默认不是“禁用 any”，而是**把 any 控制在动态边界**：

- 动态 body、缓存、重载实现签名、测试非法输入可以使用 `any`；
- `unknown` 适合需要运行时收窄的真实未知输入；
- 不为了形式上的安全把所有动态数据改造成多层 `unknown` + 类型守卫。

这个边界要服从项目实际需要。

## 断言与非空断言

- `as` 用来桥接运行时已知事实、第三方类型缺口或 TypeScript 无法表达的约束。
- `as unknown as` 只作为最后的类型重塑手段；使用时应能说清楚运行时为什么成立。
- 前面已有可靠保证时允许使用 `!`，例如已经完成存在性判断后的 `find(...)!`。
- 断言不能替代本应建立的类型关系。

## 收窄

运行时判断优先使用类型谓词，并优先复用个人工具生态或项目已有 `is*` 工具：

```ts
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

需要“校验失败就抛错”时可以提供 `assertXxx` 形式。

## 字面量类型与枚举

- 固定取值集合优先用字面量联合，不使用 `enum`。
- 数字状态可以保留清晰的 `1 | -1` 等字面量类型；对外展示与机器值不同的情况下，允许分别建模。
- 字符串化数字等稳定格式可以使用模板字面量类型，例如 `` `${number}` ``。

## Utility Types

常用的原生工具类型包括：

```ts
Pick<T, K>
Omit<T, K>
Record<K, V>
Partial<T>
ReturnType<F>
Parameters<F>
```

个人项目优先检查 `type-fest`，例如：

```ts
Merge
Get
Paths
PickDeep
Primitive
Promisable
PartialDeep
AsyncReturnType
```

如果项目没有 `type-fest`，使用原生工具类型或项目已有工具；不要为了一个类型工具临时引入新依赖。

## 重载

当同一个语义确实存在多种稳定调用形态时，优先使用重载：

```ts
function find(data: Data, predicate: Predicate): Item | undefined;
function find(data: Data, key: string, predicate: Predicate): Item | undefined;
function find(data: Data, keyOrPredicate: string | Predicate, predicate?: Predicate) {
  // 内部统一分派
}
```

- 重载签名应该描述调用方视角；
- 实现签名允许适度放宽；
- 重载超过调用方容易理解的范围时，优先改成 `options` 或重新设计 API。

## 类型建模

- 同一领域类型如果已经有稳定名字就复用；不要随意制造多个近义类型。
- 输入、输出、配置、列表项等不同生命周期如果语义确实不同，可以拆成不同类型。
- 接受 `null` 就显式标注；不要为了省事把它隐藏进宽泛类型。
- 相关公共类型优先和对应模块放在一起，而不是建立一个巨大的全局 types 文件。
