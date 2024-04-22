---
outline: [1,3]
---

创建一个倒计时

### 示例

```vue twoslash
<template>
  {{ output }}
</template>

<script lang="ts" setup>
  import { onMounted } from 'vue';
  import { useCountdown } from '@mixte/use';

  const { output, isStart, start, stop } = useCountdown(60, {
    duration: 60 * 1000,
  });

  onMounted(() => {
    start();
  });
</script>
```
