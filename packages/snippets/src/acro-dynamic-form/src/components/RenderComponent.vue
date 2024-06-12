<script lang="tsx" setup>
  import * as ArcoDesign from '@arco-design/web-vue';
  import { isString, pascalCase } from 'mixte';
  import type { AcroDynamicFormComponentField, AcroDynamicFormField, AcroDynamicFormProps, AcroDynamicFormSlots } from '../types';

  interface Props {
    field: AcroDynamicFormField;
    model: NonNullable<AcroDynamicFormProps['model']>;
    slots: AcroDynamicFormSlots;
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
      const { render } = field;

      // 使用渲染函数或指定插槽渲染自定义组件
      if (render) {
        const props = { model: this.model, Component: this.renderComponent };

        // 渲染插槽
        if (isString(render))
          return this.slots[render]?.(props);

        return render(props);
      }

      // 渲染指定组件
      if (field.type)
        return this.renderComponent();

      return null;
    },
  };
</script>
