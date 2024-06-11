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
      renderComponent() {
        const field = this.field;
        const type = field.type as AcroDynamicFormComponentField['type'];

        if (type) {
          const Component = ArcoDesign[pascalCase(type)];

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
        }
      },
    },
    render() {
      const field = this.field;

      // 使用渲染函数渲染自定义组件
      if (field.render)
        return field.render(this.model, { Component: this.renderComponent });

      // 渲染指定组件
      if (field.type)
        return this.renderComponent();

      return null;
    },
  };
</script>
