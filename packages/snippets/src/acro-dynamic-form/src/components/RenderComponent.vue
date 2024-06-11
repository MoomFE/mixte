<script lang="tsx" setup>
  import * as ArcoDesign from '@arco-design/web-vue';
  import { pascalCase } from 'mixte';
  import type { AcroDynamicFormComponentField, AcroDynamicFormField, AcroDynamicFormProps } from '../types';

  interface Props {
    field: AcroDynamicFormField;
    model: NonNullable<AcroDynamicFormProps['model']>;
  }

  defineProps<Props>();
</script>

<script lang="tsx">
  export default {
    methods: {
      renderComponent(field: AcroDynamicFormField) {
        const Component = ArcoDesign[pascalCase(field.type as AcroDynamicFormComponentField['type'])];

        return ( // @ts-expect-error
          <Component
            {...field.componentProps}
            v-model={this.model[field.field]}
          >
            {{
              ...field.componentSlots,
            }}
          </Component>
        );
      },
    },
    render() {
      const field = this.field;

      // 渲染指定组件
      if (field.type)
        return this.renderComponent(field);

      // 使用渲染函数渲染自定义组件
      if (field.render)
        return field.render(this.model);

      return null;
    },
  };
</script>
