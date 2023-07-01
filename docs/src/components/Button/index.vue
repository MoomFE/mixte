<template>
  <button
    class="
      px-4 py-1 rounded
      text-white
      bg-primary hover:bg-primary-hover active:bg-primary-active disabled:bg-gray-400!
    "
    :disabled="props.disabled"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
  interface Props {
    disabled?: boolean
  }

  const props = defineProps<Props>();
  const emit = defineEmits(['click']);
</script>
