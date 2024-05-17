import type { PropType } from 'vue';
import { deepClone, isFunction, pascalCase } from 'mixte';
import { defineComponent, reactive, ref } from 'vue';
import { Button, Form, FormItem, Space } from '@arco-design/web-vue';
import * as ArcoDesign from '@arco-design/web-vue';
import type { DynamicFormField } from './types';

export const acroDynamicFormProps = {
  /** 字段配置列表 */
  fields: Array as PropType<DynamicFormField[]>,
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
  setup(props) {
    const formRef = ref<InstanceType<typeof Form>>();

    const form = reactive<Record<string, any>>({});

    props.fields?.forEach((field) => {
      const defaultValue = field.defaultValue;
      form[field.field] = deepClone(isFunction(defaultValue) ? defaultValue() : defaultValue);
    });

    function reset() {
      formRef.value?.resetFields();
    }

    function onSubmit() {
      formRef.value?.validate();
    }

    return () => {
      return (
        <Form ref={formRef} model={form}>
          {props.fields?.map((field) => {
            const Component = ArcoDesign[pascalCase(field.type)] as ReturnType<typeof defineComponent>;

            return (
              <FormItem
                field={field.field}
                label={field.label}
                rules={field.rules}
                validateTrigger={field.validateTrigger ?? ['change', 'blur']}
              >
                <Component v-model={form[field.field]} {...field.componentProps} />
              </FormItem>
            );
          })}

          {(props.showSubmitButton || props.showResetButton) && (
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
