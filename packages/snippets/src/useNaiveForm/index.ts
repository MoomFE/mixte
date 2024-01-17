import type { FormItemRule, NForm } from 'naive-ui';
import type { Ref } from 'vue-demi';
import type { MaybeRefOrGetter } from '@vueuse/core';
import { isReactive, reactive } from 'vue-demi';
import { toValue } from '@vueuse/core';
import { deepClone, deepMerge, onceRun, toArray } from 'mixte';

type NFormRef = Ref<InstanceType<typeof NForm> | undefined>;

export interface UseNaiveFormOptions<Form extends object> {
  /**
   * 表单组件引用
   *  - 如果有多个表单组件, 可以传入数组
   */
  formRef?: NFormRef | NFormRef[]
  /** 表单数据 */
  form?: MaybeRefOrGetter<Form>
  /** 表单数据验证规则 */
  formValidateRules?: MaybeRefOrGetter<Partial<Record<keyof Form, FormItemRule[]>>>
}

/**
 * 定义一个 [Naive UI 表单](https://www.naiveui.com/zh-CN/os-theme/components/form) 数据及数据验证规则
 *
 * @see https://mixte.moomfe.com/mixte/snippets/useNaiveForm
 */
export function useNaiveForm<Form extends object>(options: UseNaiveFormOptions<Form>) {
  const userForm = toValue(options.form) ?? {};
  const formValidateRules = toValue(options.formValidateRules);

  /** 表单数据 */
  const form = (isReactive(userForm) ? userForm : reactive(userForm)) as Form;
  /** 表单初始值缓存 */
  const formInitialValues = deepClone(userForm);

  /**
   * 生成的默认的表单参数
   *  - 可使用 v-bind="formProps" 绑定到 <n-form /> 表单组件上
   */
  const formProps = {
    model: form,
    rules: formValidateRules,
  };

  /** 验证表单 */
  const validate = onceRun(async () => {
    const formRefs = toArray(options.formRef);

    formRefs.length && await Promise.all(
      formRefs.map(formRef => formRef.value?.validate()),
    );
  });

  /** 重置表单数据 */
  function reset() {
    // 清空表单验证
    toArray(options.formRef).forEach((formRef) => {
      formRef.value?.restoreValidation();
    });
    // 清空表单数据
    Object.keys(form).forEach((key) => { // @ts-expect-error
      delete form[key];
    });
    // 重置表单初始值
    deepMerge(form, formInitialValues);
  }

  return {
    form,
    formValidateRules,
    formProps,
    validate,
    reset,
  };
}
