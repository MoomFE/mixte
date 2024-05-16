import type { PropType } from 'vue-demi';
import { deepClone, isFunction, pascalCase } from 'mixte';
import { defineComponent, h } from 'vue-demi';
import { Form, FormItem } from '@arco-design/web-vue';
import * as ArcoDesign from '@arco-design/web-vue';

export interface DynamicFormField {
  /** 字段类型 */
  type: 'input' | 'input-number' | 'textarea';
  /** 字段名 */
  field: string;
  /** 标签 */
  label?: string;
  /** 默认值 */
  defaultValue?: any;
  /** 传递给组件的参数 */
  componentProps?: Record<string, any>;
};

export const acroDynamicFormProps = {
  /** 字段列表 */
  fields: Array as PropType<DynamicFormField[]>,
} as const;

export default defineComponent({
  props: acroDynamicFormProps,
  setup(props) {
    const form = reactive<Record<string, any>>({});

    props.fields?.forEach((field) => {
      const defaultValue = field.defaultValue;
      form[field.field] = deepClone(isFunction(defaultValue) ? defaultValue() : defaultValue);
    });

    return () => {
      return h(
        Form,
        {
          model: form,
        },
        props.fields?.map((field) => {
          return h(
            FormItem,
            {
              field: field.field,
              label: field.label,
            },
            h(
              // @ts-expect-error
              ArcoDesign[pascalCase(field.type)],
              {
                ...field.componentProps,
                'modelValue': form[field.field],
                'onUpdate:modelValue': (value: any) => {
                  form[field.field] = value;
                },
              },
            ),
          );
        }),
      );
    };
  },
});
