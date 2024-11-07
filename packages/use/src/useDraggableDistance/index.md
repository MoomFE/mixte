---
outline: [1,3]
---

获取拖拽距离

### 示例

```vue twoslash
<template>
  <div ref="targetRef" :style="{ transform: `translate(${x}px, ${y}px)` }">
    ...
  </div>
</template>

<script lang="ts" setup>
  import { useDraggableDistance } from '@mixte/use';
  import { ref } from 'vue';

  const targetRef = ref();

  const { x, y, isDragging } = useDraggableDistance(targetRef);
</script>
```

## 完整示例

### 模拟拖拽移动滚动条
