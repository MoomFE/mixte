<template>
  <div h66 flex="~ justify-center items-center" relative>
    <div size-6 pointer-events-none relative>
      <i-ant-design-drag-outlined class="size-6 op-36" />
      <i-ant-design-drag-outlined
        ref="target"
        class="size-6 pointer-events-auto absolute"
        :class="{ 'transition-transform': !isDragging }" :style="{ top: `${y}px`, left: `${x}px` }"
      />
    </div>

    <i-teenyicons-drag-outline class="absolute top-0 right-0 op-66" />
  </div>

  <div v-if="isDragging" ref="floatingRef" m-popover transition-none :style="floatingStyles">
    x: {{ x }}, y: {{ y }}
  </div>
</template>

<script lang="ts" setup>
  import { offset, useFloating } from '@floating-ui/vue';
  import { useDraggableDistance } from '@mixte/use';

  const target = ref();
  const floatingRef = ref();

  const { x, y, isDragging } = useDraggableDistance(target);

  const { floatingStyles, update: fromFloatingUpdate } = useFloating(target, floatingRef, {
    placement: 'bottom',
    middleware: [offset(6)],
  });

  watch([x, y], () => {
    fromFloatingUpdate();
  });
</script>
