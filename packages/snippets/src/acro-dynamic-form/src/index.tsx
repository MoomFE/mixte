import type { PropType } from 'vue';
import type { FormInstance } from '@arco-design/web-vue';
import { pascalCase } from 'mixte';
import { toReactive } from '@vueuse/core';
import { defineComponent, reactive, ref, toRef } from 'vue';
import { Button, Form, FormItem, Space } from '@arco-design/web-vue';
import * as ArcoDesign from '@arco-design/web-vue';
import type { AcroDynamicFormField } from './types';

export const acroDynamicFormProps = {
  /** 字段配置列表 */
  fields: Array as PropType<AcroDynamicFormField[]>,
  /** 表单数据 */
  model: Object as PropType<Record<string, any>>,
  /** 是否显示操作按钮区域 (提交/重置) */
  showActionButtonArea: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 是否显示提交按钮 */
  showSubmitButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 提交按钮文字 */
  submitButtonText: {
    type: String as PropType<string>,
    default: '提交',
  },
  /** 是否显示重置按钮 */
  showResetButton: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /** 重置按钮文字 */
  resetButtonText: {
    type: String as PropType<string>,
    default: '重置',
  },
} as const;

export default defineComponent({
  props: acroDynamicFormProps,
  setup(props, { attrs, expose }) {
    const formRef = ref<FormInstance>();

    const model = (props.model ? toReactive(toRef(props, 'model')) : reactive({})) as Record<string, any>;

    props.fields?.forEach((field) => {
      model[field.field] = field.defaultValue;
    });

    function reset() {
      formRef.value!.resetFields();
    }
    function onSubmit() {
      formRef.value!.validate();
    }

    const validate: FormInstance['validate'] = (...args) => {
      return formRef.value!.validate(...args);
    };
    const validateField: FormInstance['validateField'] = (...args) => {
      return formRef.value!.validateField(...args);
    };
    const resetFields: FormInstance['resetFields'] = (...args) => {
      return formRef.value!.resetFields(...args);
    };
    const clearValidate: FormInstance['clearValidate'] = (...args) => {
      return formRef.value!.clearValidate(...args);
    };
    const setFields: FormInstance['setFields'] = (...args) => {
      return formRef.value!.setFields(...args);
    };

    expose({
      validate,
      validateField,
      resetFields,
      clearValidate,
      setFields,
    });

    return () => {
      return (
        <Form ref={formRef} model={model} {...attrs}>
          {props.fields?.map((field) => {
            const Component = ArcoDesign[pascalCase(field.type)] as ReturnType<typeof defineComponent>;

            return (
              <FormItem
                field={field.field}
                label={field.label}
                rules={field.rules}
                validateTrigger={field.validateTrigger ?? ['change', 'blur']}
              >
                <Component v-model={model[field.field]} {...field.componentProps} />
              </FormItem>
            );
          })}

          {props.showActionButtonArea && (props.showSubmitButton || props.showResetButton) && (
            <FormItem>
              <Space>
                {props.showSubmitButton && (
                  <Button type="primary" onClick={onSubmit}>
                    { props.submitButtonText }
                  </Button>
                )}
                {props.showResetButton && (
                  <Button onClick={reset}>
                    { props.resetButtonText }
                  </Button>
                )}
              </Space>
            </FormItem>
          )}
        </Form>
      );
    };
  },
});
