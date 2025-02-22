<template>
  <div ref="containerRef" text-sm flex="~ gap-2 wrap" mt-5>
    <div
      v-for="(num, index) in array" :key="index"
      ref="itemsRef"
      :class="{ 'will-move': [from, to].includes(index) }" :data-index="index"
      size-8 flex="~ items-center justify-center" bg="#098E59" c-white el-2
    >
      {{ num }}
    </div>
  </div>

  <div flex="~ items-center gap-3" mt-10>
    <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
      from: <el-input-number v-model="from" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" :disabled="isMove" />
      to: <el-input-number v-model="to" class="w-32!" controls-position="right" :min="0" :max="array.length - 1" :disabled="isMove" />
    </div>
    <el-button class="c-white!" type="primary" :disabled="isMove" @click="toMove">移动</el-button>
  </div>

  <div ref="fromFloatingRef" m-popover :style="fromFloatingStyles">from</div>
  <div ref="toFloatingRef" m-popover :style="toFloatingStyles">to</div>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import { offset, useFloating } from '@floating-ui/vue';
  import { gsap } from 'gsap';
  import { delay, move } from 'mixte';

  const containerRef = ref<HTMLElement>();
  const fromFloatingRef = ref<HTMLElement>();
  const toFloatingRef = ref<HTMLElement>();
  const itemsRef = ref<HTMLElement[]>([]);
  const itemsSortRef = computed(() => itemsRef.value.toSorted((a, b) => Number(a.dataset.index) - Number(b.dataset.index)));

  const array = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  const from = ref(2);
  const to = ref(10);

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

  const isMove = ref(false);

  function toMove() {
    isMove.value = true;

    const fromEl = fromRef.value!;
    const [fromV, toV] = [from.value, to.value];
    const [max, min] = [fromV, toV].sort((a, b) => b - a);
    const itemsBounding = itemsSortRef.value.map(item => item.getBoundingClientRect());

    const timeline = gsap.timeline();
    const range: [HTMLElement, DOMRect, DOMRect][] = [];

    itemsSortRef.value.forEach((el, index) => {
      if (el !== fromEl && index >= min && index <= max)
        range.push([el, itemsBounding[index]!, itemsBounding[index + (index > fromV ? -1 : 1)]!]);
    });

    // 移动到目标位置上方
    timeline.to(fromEl, {
      x: itemsBounding[toV]!.x - itemsBounding[fromV]!.x,
      y: itemsBounding[toV]!.y - itemsBounding[fromV]!.y - 50,
      zIndex: 6,
      ease: 'circ.out',
      duration: Math.max(range.length / 10, 0.5),
    });
    // 移动范围内的元素
    timeline.to(
      (fromV > toV ? range.reverse() : range).map(([el]) => el),
      {
        x: i => range[i][2].x - range[i][1].x,
        y: i => range[i][2].y - range[i][1].y,
        duration: 0.08,
        stagger: 0.08,
      },
      '<=0.3',
    );
    // 移动到目标位置
    timeline.to(fromEl, {
      y: '+=50',
      ease: 'circ.in',
      duration: 0.3,
      onComplete() {
        delay(300).then(() => {
          itemsSortRef.value.forEach(el => gsap.set(el, { x: 0, y: 0, zIndex: 'auto' }));
          move(array, fromV, toV);
          isMove.value = false;
        });
      },
    });
  }

  watch(useElementSize(containerRef).width, () => {
    fromFloatingUpdate();
    toFloatingUpdate();
  });

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `move(${JSON.stringify(array)}, ${from.value}, ${to.value});`),
    { direction: 'rtl' },
  );
</script>

<style lang="sass" scoped>
  .will-move::before
    @apply content-[''] size-10 absolute b-(1 dashed gray rounded) z-1
</style>
