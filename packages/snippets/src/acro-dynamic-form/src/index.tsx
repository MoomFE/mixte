import type { PropType } from 'vue';
import { deepClone, isFunction, pascalCase } from 'mixte';
import { defineComponent, reactive } from 'vue';
import { Form, FormItem } from '@arco-design/web-vue';
import * as ArcoDesign from '@arco-design/web-vue';
import type { DynamicFormField } from './types';

export const acroDynamicFormProps = {
  /** 字段配置列表 */
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
      return (
        <Form model={form}>
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
        </Form>
      );
    };
  },
});
