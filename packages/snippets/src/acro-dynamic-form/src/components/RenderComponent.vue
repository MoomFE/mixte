<script lang="tsx" setup>
  import * as ArcoDesign from '@arco-design/web-vue';
  import { pascalCase } from 'mixte';
  import type { AcroDynamicFormField, AcroDynamicFormProps } from '../types';

  interface Props {
    field: AcroDynamicFormField;
    model: NonNullable<AcroDynamicFormProps['model']>;
  }

  defineProps<Props>();
</script>

<script lang="tsx">
  export default {
    render() {
      const field = this.field;
      const Component = ArcoDesign[pascalCase(field.type)];

      return (
        <Component
          v-model={this.model[field.field]}
          {...field.componentProps}
        >
          {{
            ...field.componentSlots,
          }}
        </Component>
      );
    },
  };
</script>
