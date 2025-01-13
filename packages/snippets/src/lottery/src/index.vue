<template>
  <div ref="rootRef" v-once class="mixte-lottery" />
</template>

<script lang="ts" setup>
  import type { LotteryProps } from './types';
  import { useInit, useProvide, useProvideStore, useShared, useShine } from '@mixte/snippets/lottery/config-provider-Injection-state';
  import { syncRef } from '@vueuse/core';
  import { toRef } from 'vue';

  const props = withDefaults(defineProps<LotteryProps>(), {
    shine: true,
  });

  const {
    transformToTable,
    transformToSphere,
    isTransforming,

    reset,
    isResetting,

    rotate,
    stopRotate,
    isRotating,

    select,
    isSelecting,
  } = useProvide() ?? useProvideStore();

  const {
    rootRef,
    isTable,
    isSphere,

    updateSelectCard,
  } = useShared()!;

  syncRef(updateSelectCard, toRef(props, 'updateSelectCard'), {
    direction: 'rtl',
  });

  useInit(props);
  useShine(props);

  defineExpose({
    transformToTable,
    transformToSphere,
    isTransforming,
    isTable,
    isSphere,

    reset,
    isResetting,

    rotate,
    stopRotate,
    isRotating,

    select,
    isSelecting,
  });
</script>
