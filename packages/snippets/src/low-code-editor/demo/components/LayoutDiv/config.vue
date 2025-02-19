<template>
  <n-form
    class="flex-(~ col gap-2)"
    label-placement="left" label-width="80px" size="small"
    :show-feedback="false"
  >
    <n-form-item label="文本">
      <n-input v-model:value="config.config.text" type="textarea" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
  import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';
  import type { Config } from './config';

  const config = defineModel<ComponentConfig<Config>>('config', {
    required: true,
  });
</script>
