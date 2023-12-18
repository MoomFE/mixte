<template>
  <div h66 flex="~ justify-center items-center" relative>
    <div size-6 pointer-events-none relative>
      <i-ant-design-drag-outlined class="size-6 op-36" />
      <i-ant-design-drag-outlined
        ref="targetRef"
        class="size-6 pointer-events-auto absolute top-0 left-0"
        :class="{ 'transition-transform': !isDragging }" :style="{ transform: `translate(${x}px, ${y}px)` }"
      />
    </div>

    <i-teenyicons-drag-outline class="absolute top-0 right-0 op-66" />

    <div ref="floatingRef" m-popover transition-none :style="floatingStyles">
      <template v-if="isDragging">x: {{ x }}, y: {{ y }}</template>
      <div v-else flex="~ items-center gap-.6">
        <i-mdi-arrow-top-right-bold-outline class="size-5 relative top-.2 op-66 -ml-.9" />
        试着拖动一下
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { autoUpdate, offset, shift, useFloating } from '@floating-ui/vue';
  import { useDraggableDistance } from '@mixte/use';

  const targetRef = ref();
  const floatingRef = ref();

  const { x, y, isDragging } = useDraggableDistance(targetRef);

  const { floatingStyles } = useFloating(targetRef, floatingRef, {
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(6),
      shift({ crossAxis: true }),
    ],
  });

  watch(isDragging, (isDragging) => {
    document.body.style.userSelect = isDragging ? 'none' : '';
  });
</script>
