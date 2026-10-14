---
outline: [2,3]
---

读取文件内容

- 当 `file` 被置为 `null` / `undefined` 时, 会中断当前读取, 并将 `result` / `error` 重置为 `undefined`、`isReading` 置为 `false`

### 示例

```vue twoslash
<template>
  <input
    ref="inputRef"
    type="file" style="display: none"
    @change="() => file = inputRef!.files?.[0]"
  >

  <button @click="inputRef!.click()">选择文件</button>
</template>

<script lang="ts" setup>
  import { useFileReader } from '@mixte/use';
  import { ref } from 'vue';

  const inputRef = ref<HTMLInputElement>();
  const file = ref<File>();

  const { result, isReading, error } = useFileReader(file, 'DataURL');
</script>
```
