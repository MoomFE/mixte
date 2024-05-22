<script lang="tsx" setup>
  import { FormItem } from '@arco-design/web-vue';
  import type { AcroDynamicFormField } from '../types';

  defineProps<{ field: AcroDynamicFormField }>();
</script>

<script lang="tsx">
  export default {
    render() {
      const field = this.field;

      return (
        <FormItem
          {...field.formItemProps}
          field={field.field}
          label={field.label}
          rules={field.rules}
          validate-trigger={field.validateTrigger ?? ['change', 'blur']}
        >
          {{
            ...field.formItemSlots,
            default: this.$slots.default,
          }}
        </FormItem>
      );
    },
  };
</script>
