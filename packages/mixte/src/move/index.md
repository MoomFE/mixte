- 数组内元素移动

## `move`

移动数组内的某个元素到指定的下标位置

### 示例

```ts
import { move } from 'mixte';

const array = [1, 2, 3, 4, 5, 6];

move(array, 0, 5); // -> [2, 3, 4, 5, 6, 1]
```

### 类型

```ts
/**
 * @param array 数组
 * @param from 要移动的元素的下标
 * @param to 要移动到的位置的下标
 */
function move<T>(array: T[], from: number, to: number): T[];
```


## `moveRange`

移动数组内一个范围内的元素到指定的下标位置

### 示例

```ts
import { moveRange } from 'mixte';

const array = [1, 2, 3, 4, 5, 6];

moveRange(array, 1, 3, 3); // -> [1, 5, 6, 2, 3, 4]
```

### 类型

```ts
/**
 * @param array 数组
 * @param start 要移动的元素的起始下标
 * @param moveCount 要移动的元素的个数
 * @param to 要移动到的位置的下标
 */
function moveRange<T>(array: T[], start: number, moveCount: number, to: number): T[];
```
