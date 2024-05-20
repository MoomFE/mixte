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
      const Component = ArcoDesign[pascalCase(this.field.type)];

      return (
        <Component
          v-model={this.model[this.field.field]}
          {...this.field.componentProps}
        >
          {{
            ...this.field.componentSlots,
          }}
        </Component>
      );
    },
  };
</script>
