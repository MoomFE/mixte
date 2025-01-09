<template>
  <div ref="rootRef" v-once class="mixte-lottery" />
</template>

<script lang="ts" setup>
  import type { LotteryProps } from './types';
  import { useInit, useProvideStore, useShine, useStore } from '@mixte/snippets/lottery/config-provider-Injection-state';

  const props = withDefaults(defineProps<LotteryProps>(), {
    shine: true,
  });

  const {
    rootRef,

    transformToTable,
    transformToSphere,
    isTransforming,
    isTable,
    isSphere,

    rotate,
    stopRotate,
    isRotating,

    selectCard,
    resetCard,
  } = useStore() ?? useProvideStore();

  useInit(props);

  useShine(props);

  defineExpose({
    transformToTable,
    transformToSphere,
    isTransforming,
    isTable,
    isSphere,

    rotate,
    stopRotate,
    isRotating,

    selectCard,
    resetCard,
  });
</script>
