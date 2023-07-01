<template>
  <div class="relative" :class="props.size">
    <i-logos-vue class="size-full" />
    <i-carbon-template class="size-1/2 absolute right-0 bottom-0" />
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    size: {
      type: String,
      default: 'size-12',
    },
  });
</script>
