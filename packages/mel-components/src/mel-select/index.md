---
outline: [2,3]
---

## 演示

### 使用 options 传递数据源

不用再写 `<el-option>` 循环了, 数据直接传给 `options` 即可

### 使用 optionsApi 传递请求数据源的方法

直接把请求数据源的方法传给 `optionsApi`, 组件会自动调用并渲染

### 使用 optionsApi 传递请求数据源的参数

可以给 `optionsApi` 传递对象, 以控制 `是否立即发起请求`、`请求参数` 等, 具体可参考 [SelectOptionsApi](#SelectOptionsApi) 类型<br>
· <small>*该示例还演示了如何手动触发请求*</small>

### 使用 optionsApi 远程筛选选项

当启用了 `filterable` 和 `remote` 并且定义了 `optionsApi.remoteKey` 字段名, 搜索时会将输入值作为 `optionsApi.remoteKey` 字段名的值传入 `optionsApi.api` 的方法并发起请求

### 筛选选项

通过 `filterOptionMethod` 传入方法对数据源选项进行筛选, 返回 `false` 则表示这个选项会被隐藏<br>
· <small>*方法第一个参数为启用 `filterable` 时的输入值, 若未启用则始终为 `''`*</small><br>
· <small>*方法第二个参数为当前筛选的选项数据*</small>

### 自定义渲染选项: 使用 options 传递 render

当数据源是在代码中定义时, 可以直接在 `options` 里传入 `render` 方法, 来自定义渲染选项<br>
· <small c-red>*注意, 使用 `render` 时, 需要通过 `<el-option>` 渲染选项*</small>

### 自定义渲染选项: 使用 option 插槽

当数据源不是在代码中定义时, 可以使用 `option` 插槽, 来自定义渲染选项<br>
· <small c-red>*注意, 使用 `option` 插槽时, 需要通过 `<el-option>` 渲染选项*</small>

### 自定义渲染选项内容: 使用 option-label 插槽

使用 `option-label` 插槽, 来自定义渲染选项内容 ( 仅内容部分, 而非整个选项 )

### 自定义渲染选项内容和标签: 使用 all-label 插槽

使用 `all-label` 插槽, 自定义渲染选项内容和标签<br>
· <small>*自定义渲染选项内容 ( 仅内容部分, 而非整个选项, 和 `option-label` 的作用一致 )*</small><br>
· <small>*在未传入 label 插槽时代替 label 插槽来渲染标签*</small>

## API

### Props

| 参数名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| options | 选项数据源 | `MaybeRefOrGetter<MelSelectOption[]>` | - |
| optionsApi | 请求数据源的方法 | [`SelectOptionsApi`](#SelectOptionsApi) | - |
| filterOptionMethod | 对数据源选项进行筛选时执行的方法, 返回 `false` 则表示这个选项会被隐藏<br>&nbsp;- <small>方法第一个参数为启用 `filterable` 时的输入值, 若未启用则始终为 `''`</small><br>&nbsp;- <small>方法第二个参数为当前筛选的选项数据</small> | `(query: string, option: MelSelectOption) => boolean \| undefined` | - |
| ... | 其它 [el-select](https://element-plus.org/zh-CN/component/select.html#select-attributes) 属性均可使用 | - | - |

### Expose

| 方法名 | 描述 | 类型 |
| --- | --- | --- |
| selectRef | Select 组件实例 | `SelectInstance` |
| options | 选项数据源 | `MelSelectOption[]` |
| api | 请求数据源的组合式函数实例 | `Reactive<UseRequestReturn>` |

### Slots

| 名称 | 描述 |
| --- | --- |
| option | 自定义渲染选项 |
| option-label | 自定义渲染选项内容 ( 仅内容部分, 而非整个选项 ) |
| all-label | 自定义渲染选项内容和标签<br>&nbsp;- <small>自定义渲染选项内容 ( 仅内容部分, 而非整个选项, 和 `option-label` 的作用一致 )</small><br>&nbsp;- <small>在未传入 label 插槽时代替 label 插槽来渲染标签</small> |
| ... | 其它 [el-select](https://element-plus.org/zh-CN/component/select.html#select-slots) 插槽均可使用 |

## 类型定义

### SelectOptionsApi{#SelectOptionsApi}

<<< ./src/types.ts#SelectOptionsApi
<<< ./src/types.ts#SelectOptionsApiConfig
<<< ../utils/useOptionsApi.ts#OptionsApiConfig
<<< ../utils/useOptionsApi.ts#OptionsApiRequest
