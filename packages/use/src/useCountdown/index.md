---
outline: [1,3]
---

- 创建一个倒计时


### 类型

```ts
function useCountdown(
  source: MaybeRefOrGetter<number>,
  options?: UseCountdownOptions
): {
  isStart: Ref<boolean>
  output: Ref<number>
  start: () => void
  stop: () => void
};

interface UseCountdownOptions {
  /**
   * 倒计时所使用的时间 ( 毫秒 )
   * @default 60 * 1000
   */
  duration?: MaybeRefOrGetter<number>
}
```

### 用法

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
