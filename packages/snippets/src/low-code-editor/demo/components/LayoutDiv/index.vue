<template>
  <div>
    <span v-if="config.text">{{ config.text }}</span>
    <SlotPlaceholder v-else />
  </div>
</template>

<script lang="ts" setup>
  import type { ComponentConfig } from '@mixte/snippets/low-code-editor/types';
  import type { Config } from './config';
  import { useComponent } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { toRef } from 'vue';

  const props = defineProps<{ config: ComponentConfig<Config> }>();

  const config = toRef(props.config, 'config');

  const SlotPlaceholder = useComponent()?.SlotPlaceholder;
</script>
