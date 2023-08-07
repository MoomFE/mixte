<template>
  <TransitionGroup tag="div" text-sm flex="~ gap-2" mt-5>
    <template v-for="num in array" :key="num">
      <div ref="itemsRef" size-8 flex="~ items-center justify-center" transition-all bg-teal-3 el-2>
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

  <div ref="fromFloatingRef" transition-transform m-popover :style="fromFloatingStyles">from</div>
  <div ref="toFloatingRef" transition-transform m-popover :style="toFloatingStyles">to</div>
</template>

<script lang="ts" setup>
  import { move } from 'mixte';
  import { offset, useFloating } from '@floating-ui/vue';

  const itemsRef = ref<HTMLElement[]>([]);
  const fromFloatingRef = ref<HTMLElement>();
  const toFloatingRef = ref<HTMLElement>();

  const array = reactive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const from = ref(0);
  const to = ref(5);

  const fromRef = computed(() => itemsRef.value[from.value]);
  const toRef = computed(() => itemsRef.value[to.value]);

  const { floatingStyles: fromFloatingStyles } = useFloating(fromRef, fromFloatingRef, {
    placement: 'top',
    middleware: [offset(6)],
  });
  const { floatingStyles: toFloatingStyles } = useFloating(toRef, toFloatingRef, {
    placement: 'bottom',
    middleware: [offset(6)],
  });
</script>
