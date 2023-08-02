- 各种随机函数

## `randomNatural`

在传入的两个自然数之间随机生成一个自然数

## 演示

<DemoCard>
  <RandomNatural />
</DemoCard>

### 类型

```ts
function randomNatural(from: number, to: number): number;
```

### 示例

```ts
import { randomNatural } from 'mixte';

randomNatural(0, 10); // -> 0 ~ 10
```

<script setup>
  import RandomNatural from './demo/randomNatural.vue'

</script>