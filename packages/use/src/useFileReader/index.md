---
outline: [1,3]
---

读取文件内容

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
  import { ref } from 'vue';
  import { useFileReader } from '@mixte/use';

  const inputRef = ref<HTMLInputElement>();
  const file = ref<File>();

  const { result, isReading, error } = useFileReader(file, 'DataURL');
</script>
```
