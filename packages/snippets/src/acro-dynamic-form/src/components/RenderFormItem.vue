<script lang="tsx" setup>
  import { FormItem } from '@arco-design/web-vue';
  import type { AcroDynamicFormField } from '../types';

  defineProps<{ field: AcroDynamicFormField }>();
</script>

<script lang="tsx">
  export default {
    render() {
      return (
        <FormItem
          field={this.field.field}
          label={this.field.label}
          rules={this.field.rules}
          validate-trigger={this.field.validateTrigger ?? ['change', 'blur']}
        >
          {this.$slots.default?.()}
        </FormItem>
      );
    },
  };
</script>
