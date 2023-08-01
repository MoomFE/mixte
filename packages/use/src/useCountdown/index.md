# useCountdown
- 创建一个倒计时

## 演示

<DemoCard>
  <Demo />
</DemoCard>

## 用法

```html
<template>
  {{ output }}
</template>

<script lang="ts" setup>
  import { useCountdown } from '@mixte/use';

  const { output, isStart, start, stop } = useCountdown(60, {
    duration: 60 * 1000,
  });

  onMounted(() => {
    start();
  });
</script>
```

<script setup>
  import Demo from './demo.vue';
</script>