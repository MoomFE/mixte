---
outline: [2,3]
---

创建一个倒计时

### 示例

```vue twoslash
<template>
  {{ output }}
</template>

<script lang="ts" setup>
  import { useCountdown } from '@mixte/use';
  import { onMounted } from 'vue';

  const { output, isStart, start, stop } = useCountdown(60, {
    duration: 60 * 1000,
  });

  onMounted(() => {
    start();
  });
</script>
```
