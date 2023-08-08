<template>
  <TransitionGroup ref="containerRef" tag="div" move-class="move-item" text-sm flex="~ gap-2 wrap" mt-5>
    <template v-for="(num, index) in array" :key="num">
      <div
        ref="itemsRef"
        :class="{ 'jump': index === to, 'will-move': [from, to].includes(index) }" :data-index="index"
        size-8 flex="~ items-center justify-center" transition="all duration-360" bg-teal-3 el-2
      >
        {{ num }}
      </div>
    </template>
  </TransitionGroup>

  <div flex="~ items-center gap-3" mt-10>
    <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
      from: <el-input-number v-model="from" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" />
      to: <el-input-number v-model="to" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" />
    </div>
    <button m-btn @click="move(array, from, to)">移动</button>
  </div>

  <div ref="fromFloatingRef" m-popover :style="fromFloatingStyles">from</div>
  <div ref="toFloatingRef" m-popover :style="toFloatingStyles">to</div>
</template>

<script lang="ts" setup>
  import { move } from 'mixte';
  import { offset, useFloating } from '@floating-ui/vue';

  const containerRef = ref<HTMLElement>();
  const itemsRef = ref<HTMLElement[]>([]);
  const fromFloatingRef = ref<HTMLElement>();
  const toFloatingRef = ref<HTMLElement>();

  const array = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const from = ref(0);
  const to = ref(5);

  const fromRef = computed(() => itemsRef.value.find(item => item.dataset.index === `${from.value}`));
  const toRef = computed(() => itemsRef.value.find(item => item.dataset.index === `${to.value}`));

  const { floatingStyles: fromFloatingStyles, update: fromFloatingUpdate } = useFloating(fromRef, fromFloatingRef, {
    placement: 'top',
    middleware: [offset(6)],
  });
  const { floatingStyles: toFloatingStyles, update: toFloatingUpdate } = useFloating(toRef, toFloatingRef, {
    placement: 'bottom',
    middleware: [offset(6)],
  });

  watch(useElementSize(containerRef).width, () => {
    fromFloatingUpdate();
    toFloatingUpdate();
  });
</script>

<style lang="sass" scoped>
  .move-item.jump
    @apply -translate-y-8 z-1

  .will-move
    @apply relative
    &::before
      @apply content-[''] size-10 absolute b-(1 dashed gray rounded) z-666
</style>
