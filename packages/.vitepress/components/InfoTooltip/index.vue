<template>
  <ElTooltip :content="content">
    <span inline-flex="~ items-center">
      <ElTag type="info">{{ name }}</ElTag>
      <i-ant-design-info-circle-outlined class="size-5 ml-1" />
    </span>
  </ElTooltip>
</template>

<script lang="ts" setup>
  interface Props {
    name?: string;
    content: string;
  }

  withDefaults(defineProps<Props>(), {
    name: 'Details',
  });
</script>
