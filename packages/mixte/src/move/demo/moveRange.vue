<template>
  <div ref="containerRef" text-sm flex="~ gap-2 wrap" mt-5>
    <div
      v-for="(num, index) in array" :key="index"
      ref="itemsRef"
      :class="{
        'will-move-range': index >= start && index < start + moveCount,
        'will-move-range-start': index === start,
        'will-move-range-end': index === start + moveCount - 1,
        'will-move-to': index === to,
        'array-end': index === array.length - 1,
      }"
      :data-index="index"
      size-8 flex="~ items-center justify-center" bg-teal-3 el-2
    >
      {{ num }}
    </div>
  </div>

  <div flex="~ items-center gap-3" mt-10>
    <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
      start: <el-input-number v-model="start" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" :disabled="isMove" />
      moveCount: <el-input-number v-model="moveCount" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" :disabled="isMove" />
      to: <el-input-number v-model="to" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" :disabled="isMove" />
    </div>
    <el-button class="c-white!" color="#14b8a6" :disabled="isMove" @click="toMoveRange">移动</el-button>
  </div>

  <div ref="startFloatingRef" m-popover :style="rangeFloatingStyles">start</div>
  <div ref="toFloatingRef" m-popover :style="toFloatingStyles">to</div>
</template>

<script lang="ts" setup>
  import { delay, moveRange } from 'mixte';
  import { gsap } from 'gsap';
  import { offset, useFloating } from '@floating-ui/vue';

  const containerRef = ref<HTMLElement>();
  const startFloatingRef = ref<HTMLElement>();
  const toFloatingRef = ref<HTMLElement>();
  const itemsRef = ref<HTMLElement[]>([]);
  const itemsSortRef = computed(() => itemsRef.value.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index)));

  const array = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const start = ref(1);
  const moveCount = ref(3);
  const to = ref(8);

  const startRef = computed(() => itemsRef.value.find(item => item.dataset.index === `${start.value}`));
  const toRef = computed(() => itemsRef.value.find(item => item.dataset.index === `${to.value}`));

  const { floatingStyles: rangeFloatingStyles, update: rangeFloatingUpdate } = useFloating(startRef, startFloatingRef, {
    placement: 'top',
    middleware: [offset(6)],
  });
  const { floatingStyles: toFloatingStyles, update: toFloatingUpdate } = useFloating(toRef, toFloatingRef, {
    placement: 'bottom',
    middleware: [offset(6)],
  });

  const isMove = ref(false);

  function toMoveRange() {
    isMove.value = true;

    const [startV, moveCountV, toV] = [start.value, moveCount.value, to.value];
    const [max, min] = [startV, toV].sort((a, b) => b - a);
    const itemsBounding = itemsSortRef.value.map(item => item.getBoundingClientRect());

    const timeline = gsap.timeline();
    const startRange: [HTMLElement, DOMRect, DOMRect][] = [];
    const range: [HTMLElement, DOMRect, DOMRect][] = [];

    itemsSortRef.value.forEach((el, index, list) => {
      if (index >= startV && index < startV + moveCountV) {
        const diff = (toV + moveCountV) > list.length ? (toV + moveCountV) - list.length : 0;
        const toIndex = toV + index - startV - diff;
        startRange.push([el, itemsBounding[index], itemsBounding[toIndex]]);
      }
      else if (index >= min && index < max + moveCountV) {
        const toIndex = toV > startV ? index - moveCountV : index + moveCountV;
        range.push([el, itemsBounding[index], itemsBounding[toIndex]]);
      }
    });

    // 移动到目标位置上方
    timeline.to(startRange.map(([el]) => el), {
      x: i => startRange[i][2].x - startRange[i][1].x,
      y: i => startRange[i][2].y - startRange[i][1].y - 50,
      zIndex: 6,
      ease: 'circ.out',
      duration: Math.max(range.length / 10, 0.5),
    });
    // 移动范围内的元素
    timeline.to(
      (startV > toV ? range.reverse() : range).map(([el]) => el),
      {
        x: i => range[i][2].x - range[i][1].x,
        y: i => range[i][2].y - range[i][1].y,
        duration: 0.08,
        stagger: 0.08,
      },
      '<+=0.3',
    );
    // 移动到目标位置
    timeline.to(startRange.map(([el]) => el), {
      y: '+=50',
      ease: 'circ.in',
      duration: 0.3,
      onComplete() {
        delay(300).then(() => {
          itemsSortRef.value.forEach(el => gsap.set(el, { x: 0, y: 0, zIndex: 'auto' }));
          moveRange(array, startV, moveCountV, toV);
          isMove.value = false;
        });
      },
    });
  }

  watch(useElementSize(containerRef).width, () => {
    rangeFloatingUpdate();
    toFloatingUpdate();
  });
</script>

<style lang="sass" scoped>
  .will-move-range, .will-move-to
    &::before
      @apply content-[''] size-10 absolute b-(1 dashed gray rounded) z-1

  .will-move-range
    &.will-move-range-start:not(.will-move-range-end):not(.array-end):not(.will-move-to)::before
      @apply b-r-none rounded-r-none
    &:not(.will-move-range-start):not(.will-move-range-end):not(.array-end):not(.will-move-to)::before
      @apply b-r-none rounded-r-none
    &:not(.will-move-range-start):not(.will-move-range-end):not(.will-move-to)::before
      @apply b-l-none rounded-l-none
    &.will-move-range-end:not(.will-move-range-start):not(.will-move-to)::before
      @apply b-l-none rounded-l-none
</style>
