<script lang="tsx" setup>
  import * as ArcoDesign from '@arco-design/web-vue';
  import { pascalCase } from 'mixte';
  import type { AcroDynamicFormComponentField, AcroDynamicFormProps } from '../types';

  interface Props {
    field: AcroDynamicFormComponentField;
    model: NonNullable<AcroDynamicFormProps['model']>;
  }

  defineProps<Props>();
</script>

<script lang="tsx">
  export default {
    render() {
      const field = this.field;

      if (field.type) {
        const Component = ArcoDesign[pascalCase(field.type)];

        return ( // @ts-expect-error
          <Component
            v-model={this.model[field.field]}
            {...field.componentProps}
          >
            {{
            ...field.componentSlots,
          }}
          </Component>
        );
      }

      return null;
    },
  };
</script>
