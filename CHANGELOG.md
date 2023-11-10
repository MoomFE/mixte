## [Unreleased]
  - 💄 [@mixte/use] 移除 `useRequest` 的 `onFinally` 事件钩子的 `null` 传参

## [v1.6.0]
  - 📅 2023-10-13
  - 🌟 [@mixte/use] 新增 `useRequestReactive` 方法

## [v1.5.0]
  - 📅 2023-10-05
  - 🌟 [@mixte/use] 新增 `createNamedSharedComposable` 方法
  - 💄 [mixte] 优化 `leastRun` 方法类型定义
  - 💄 [mixte] 移除 `onceRun` 方法无用代码逻辑

## [v1.4.2]
  - 📅 2023-09-25
  - 💄 [@mixte/use] 优化在 vue2 下 `useCountdown` 和 `useRequest` 方法的类型定义
  - 🐞 [@mixte/use] 修复 vue2 下使用 `useRequest` 方法的 `reactive` 返回值时, 部分返回值未被响应式代理的问题

## [v1.4.1]
  - 📅 2023-09-23
  - 🐞 修复上个版本的发版错误

## [v1.4.0]
  - 📅 2023-09-23
  - 🌟 [@mixte/components] 新的组件库包
  - 🌟 [@mixte/components] 新增 `AutoGrid` 组件

## [v1.3.0]
  - 📅 2023-09-15
  - 🌟 [@mixte/use] 方法 `useRequest` 新增 `reactive` 返回值, 是原有返回值的响应式代理对象

## [v1.2.0]
  - 📅 2023-09-15
  - 🌟 [@mixte/use] 新增 `deepUnref` 方法
  - 🌟 [@mixte/use] 新增 `useRequest` 方法
  - 💄 [mixte] 优化 `random` 工具方法类型定义
  - 🐞 [mixte] 修复 `deepMerge` 方法合并对象中的数组时, 没有遵循 `值为 undefined 的属性会被跳过` 规则的问题

## [v1.1.1]
  - 📅 2023-08-31
  - 💄 [@mixte/use] 设置依赖类库 `@vueuse/core` 最低版本号
  - 🐞 [mixte] 修改 `leastRun` 工具方法注释及文档错误

## [v1.1.0-beta.0], [v1.1.0-beta.1] ~ [v1.1.0]
  - 📅 2023-08-23
  - 🐞 [@mixte/use] 修复引入 `@mixte/use/register` 时类型错误的问题

## [v1.0.0]
  - 📅 2023-08-19
  - 🌟 [mixte] 新增 `onceRun` 工具方法
  - 🌟 [mixte] 新增 `leastRun` 工具方法
  - 🌟 [mixte] 新增 `defineArgs` 工具方法
  - 🌟 [mixte] 新增 `isBrowser` 变量导出

## [v0.0.1-beta.14]
  - 📅 2023-08-17
  - 🌟 [mixte] 新增 `isBoolean` 工具方法
  - 💄 [mixte] 优化 `random`, `randomLetter`, `randomString` 工具方法类型定义
  - 💄 [mixte] 优化 `uniqueKey` 方法类型定义
  - 💄 [@mixte/use] 优化 `watchImmediate`, `watchDeep`, `watchImmediateDeep` 方法类型定义
  - 💄 [@mixte/use] 优化 `wheneverEffectScope`, `wheneverEffectScopeImmediate`, `wheneverEffectScopeDeep`, `wheneverEffectScopeImmediateDeep` 方法类型定义
  - 💄 [@mixte/use] 优化 `deepClone` 方法类型定义
  - 🐞 [@mixte/use] 修复 `useCountdown` 开启倒计时未使用最新初始数字进行倒计时的问题
  - ⚠️ [mixte] 修改 `randomLetter` 工具方法逻辑, 当传参不是布尔值时, 随机一个小写或大写英文字母 ( 之前是随机一个小写字母 )

## [v0.0.1-beta.13]
  - 📅 2023-07-22
  - 🌟 [mixte] 新增 `toArray` 工具方法
  - 🌟 [mixte] 新增 `deepClone` 工具方法
  - 🌟 [mixte] 新增 `deepMerge` 工具方法

## [v0.0.1-beta.12]
  - 📅 2023-07-18
  - 🐞 [@mixte/use] 修复在 `vue2` 环境下导入 `toValue` 导致的报错

## [v0.0.1-beta.11]
  - 📅 2023-07-18
  - 🌟 [mixte] 新增 `asyncForEach` 工具方法

## [v0.0.1-beta.10]
  - 📅 2023-07-12
  - 🌟 [@mixte/use] 新增 `useCountdown` 方法

## [v0.0.1-beta.9]
  - 📅 2023-07-10
  - 🌟 [mixte] 新增 `move`, `moveRange` 工具方法
  - ⚠️ [@mixte/use] 按需导入重命名, 改为使用 `@mixte/use/register` 引用

## [v0.0.1-beta.8]
  - 📅 2023-07-03
  - 🌟 [@mixte/use] 新增 `wheneverEffectScopeDeep`, `wheneverEffectScopeImmediateDeep` 方法
  - 🌟 [@mixte/use] 新增 `whenever` 方法, 来自 `@vueuse/core`
  - 🌟 [@mixte/use] 按需导入支持传入 `useWithVueUseCore` 选项排除与 `@vueuse/core` 功能相同且名称相同的方法
  - ⚠️ [@mixte/use] 按需导入转为函数形式

## [v0.0.1-beta.7]
  - 📅 2023-07-01
  - 💄 [@mixte/use] 使按需导入可使用 `@mixte/use/vite` 引用

## [v0.0.1-beta.6]
  - 📅 2023-07-01
  - 💄 [@mixte/use] 使按需导入可使用 `@mixte/use/vite` 引用

## [v0.0.1-beta.5]
  - 📅 2023-07-01
  - 🌟 [@mixte/use] 新增供 [unplugin-auto-import](https://github.com/antfu/unplugin-auto-import) 使用的按需导入

## [v0.0.1-beta.4]
  - 📅 2023-07-01
  - 💄 调试 Github Actions

## [v0.0.1-beta.3]
  - 📅 2023-06-30
  - 🐞 [mixte] 修复 `uniqueKey`, `delay`, `wait` 工具方法未导出的问题

## [v0.0.1-beta.2]
  - 📅 2023-06-30
  - 🌟 [mixte] 新增 `uniqueKey` 工具方法
  - 🐞 [mixte] 修复 `delay`, `wait` 工具方法未导出的问题

## [v0.0.1-beta.1]
  - 📅 2023-06-30
  - 🌟 [mixte] 新增 `isString` 工具方法
  - 🌟 [mixte] 新增 `isNumber`, `isNumericString`, `isNumeric` 工具方法
  - 🌟 [mixte] 新增 `isObject`, `isPlainObject` 工具方法
  - 🌟 [mixte] 新增 `isFunction` 工具方法
  - 🌟 [mixte] 新增 `isNativePromise`, `isPromise` 工具方法
  - 🌟 [mixte] 新增 `isReference`, `isPrimitive` 工具方法
  - 🌟 [mixte] 新增 `isEmptyObject` 工具方法
  - 🌟 [mixte] 新增 `isESModule` 工具方法
  - 🌟 [mixte] 新增 `randomNatural`, `random` 工具方法
  - 🌟 [mixte] 新增 `randomLowercaseLetter`, `randomUppercaseLetter`, `randomLetter` 工具方法
  - 🌟 [mixte] 新增 `randomString` 工具方法
  - 🌟 [mixte] 新增 `randomBoolean` 工具方法
  - 🌟 [mixte] 新增 `delay`, `wait` 工具方法
  - 🌟 [@mixte/use] 新增 `watchImmediate`, `watchDeep`, `watchImmediateDeep` 方法
  - 🌟 [@mixte/use] 新增 `wheneverImmediate`, `wheneverDeep`, `wheneverImmediateDeep` 方法
  - 🌟 [@mixte/use] 新增 `wheneverEffectScope`, `wheneverEffectScopeImmediate` 方法

<br>
<hr>
<br>

版本规范

1. 主版本号: 破坏性更新和新特性
2. 次版本号: 向下兼容的功能新增、功能更改、功能优化
3. 修订版本号: 向下兼容的问题修正、一般功能优化

<br>
<hr>
<br>

CHANGELOG 图标规范

- 🌟: 功能新增<br>
- 💄: 功能更改、功能优化<br>
- ⚠️: 与上一版本可能不兼容的功能更改<br>
- 🐞: 问题修正<br>
- 📅: 版本发布日期

<br>
<hr>
<br>

[Unreleased]: https://github.com/MoomFE/mixte/compare/v1.5.0...HEAD
[v1.5.0]: https://github.com/MoomFE/mixte/releases/tag/v1.5.0
[v1.4.2]: https://github.com/MoomFE/mixte/releases/tag/v1.4.2
[v1.4.1]: https://github.com/MoomFE/mixte/releases/tag/v1.4.1
[v1.4.0]: https://github.com/MoomFE/mixte/releases/tag/v1.4.0
[v1.3.0]: https://github.com/MoomFE/mixte/releases/tag/v1.3.0
[v1.2.0]: https://github.com/MoomFE/mixte/releases/tag/v1.2.0
[v1.1.1]: https://github.com/MoomFE/mixte/releases/tag/v1.1.1
[v1.1.0]: https://github.com/MoomFE/mixte/releases/tag/v1.1.0
[v1.1.0-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v1.1.0-beta.1
[v1.1.0-beta.0]: https://github.com/MoomFE/mixte/releases/tag/v1.1.0-beta.0
[v1.0.0]: https://github.com/MoomFE/mixte/releases/tag/v1.0.0
[v0.0.1-beta.14]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.14
[v0.0.1-beta.13]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.13
[v0.0.1-beta.12]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.12
[v0.0.1-beta.11]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.11
[v0.0.1-beta.10]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.10
[v0.0.1-beta.9]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.9
[v0.0.1-beta.8]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.8
[v0.0.1-beta.7]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.7
[v0.0.1-beta.6]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.6
[v0.0.1-beta.5]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.5
[v0.0.1-beta.4]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.4
[v0.0.1-beta.3]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.3
[v0.0.1-beta.2]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.2
[v0.0.1-beta.1]: https://github.com/MoomFE/mixte/releases/tag/v0.0.1-beta.1
