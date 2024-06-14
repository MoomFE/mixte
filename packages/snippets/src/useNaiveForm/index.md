定义一个 [Naive UI 表单](https://www.naiveui.com/zh-CN/os-theme/components/form) 数据及数据验证规则

::: warning 注意
  - 依赖于 [Naive UI](https://www.npmjs.com/package/naive-ui) 组件库
  - 该组合式函数仅支持 `Vue 3`
:::

### 类型

```ts
interface UseNaiveFormOptions<Form extends object> {
  /**
   * 表单组件引用
   *  - 如果有多个表单组件, 可以传入数组
   */
  formRef?: NFormRef | NFormRef[];
  /** 表单数据 */
  form?: MaybeRefOrGetter<Form>;
  /** 表单数据验证规则 */
  formValidateRules?: MaybeRefOrGetter<Partial<Record<keyof Form, FormItemRule[]>>>;
}

function useNaiveForm<Form extends object>(options: UseNaiveFormOptions<Form>): {
  form: Form;
  formValidateRules: Partial<Record<keyof Form, FormItemRule[]>> | undefined;
  formProps: {
    model: Form;
    rules: Partial<Record<keyof Form, FormItemRule[]>> | undefined;
  };
  validate: () => Promise<void>;
  resetValidation: () => void;
  resetForm: () => void;
  reset: () => void;
};
```
