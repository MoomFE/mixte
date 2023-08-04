## [Unreleased]
  - 💄 优化 `random`, `randomString` 工具方法类型定义

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

[Unreleased]: https://github.com/MoomFE/mixte/compare/v0.0.1-beta.13...HEAD
[v0.0.1-beta.13]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.13
[v0.0.1-beta.12]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.12
[v0.0.1-beta.11]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.11
[v0.0.1-beta.10]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.10
[v0.0.1-beta.9]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.9
[v0.0.1-beta.8]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.8
[v0.0.1-beta.7]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.7
[v0.0.1-beta.6]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.6
[v0.0.1-beta.5]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.5
[v0.0.1-beta.4]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.4
[v0.0.1-beta.3]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.3
[v0.0.1-beta.2]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.2
[v0.0.1-beta.1]: https://github.com/MoomFE/Small-Utils/releases/tag/v0.0.1-beta.1
