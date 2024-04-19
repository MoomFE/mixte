- 数组内元素移动

## `move`

移动数组内的某个元素到指定的下标位置

### 示例

```ts twoslash
import { move } from 'mixte';

const array = [1, 2, 3, 4, 5, 6];

move(array, 0, 5); // -> [2, 3, 4, 5, 6, 1]
```

## `moveRange` {#moveRange}

移动数组内一个范围内的元素到指定的下标位置

### 示例

```ts twoslash
import { moveRange } from 'mixte';

const array = [1, 2, 3, 4, 5, 6];

moveRange(array, 1, 3, 3); // -> [1, 5, 6, 2, 3, 4]
```
