---
outline: [2, 3]
---

# `asyncForEach`

异步地遍历数组, 并对每个元素执行回调函数

### 示例

```ts twoslash
import { asyncForEach, delay } from 'mixte';

const array = [1, 2, 3, 4, 5];

await asyncForEach(array, async (value, index, array) => {
  console.log(`正在处理索引为 ${index} 的元素 ${value}`);
  await delay(value); // 一些异步处理操作
  console.log(`元素 ${value} 处理完毕`);
});

console.log('所有元素已处理完毕');
```
