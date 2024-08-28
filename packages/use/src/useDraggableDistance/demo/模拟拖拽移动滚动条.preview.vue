<template>
  <div
    ref="rootRef"
    w-full h-40vmin b="1 solid neutral-3 dark:neutral-5" el="6 op-60" overflow-scroll
  >
    <div class="size-600%">
      <n-watermark class="size-full" content="在容器内拖拽试试" :width="200" :height="100" :x-offset="60" :y-offset="30" :rotate="15" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useDraggableDistance, watchImmediate, wheneverEffectScopeImmediate, wheneverImmediate } from '@mixte/use';
  import { ref } from 'vue';

  const rootRef = ref<HTMLElement>();

  const { x, y, isDragging } = useDraggableDistance(rootRef);

  // 拖拽后, 将本次拖拽距离加到滚动条上
  wheneverEffectScopeImmediate(isDragging, () => {
    const startX = rootRef.value!.scrollLeft;
    const startY = rootRef.value!.scrollTop;

    watchImmediate([x, y], () => {
      rootRef.value!.scrollTo({
        top: startY - y.value,
        left: startX - x.value,
      });
    });
  });

  // 防止拖拽时选中文本 ( 按实际情况使用 )
  wheneverImmediate(isDragging, (_, __, onCleanup) => {
    document.body.style.userSelect = 'none';
    onCleanup(() => {
      document.body.style.userSelect = '';
    });
  });
</script>
