import type { PropType } from 'vue-demi';
import { pascalCase } from 'mixte';
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
};

export const acroDynamicFormProps = {
  /** 字段列表 */
  fields: Array as PropType<DynamicFormField[]>,
} as const;

export default defineComponent({
  props: acroDynamicFormProps,
  setup(props) {
    return () => {
      return h(
        Form,
        null,
        props.fields?.map((field) => {
          return h(
            FormItem,
            {
              field: field.field,
              label: field.label,
            },
            h(ArcoDesign[pascalCase(field.type)]),
          );
        }),
      );
    };
  },
});
