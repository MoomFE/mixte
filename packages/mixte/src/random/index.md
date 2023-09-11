- 各种随机函数


## `randomNatural`

在传入的两个自然数之间随机生成一个自然数

### 示例

```ts
import { randomNatural } from 'mixte';

randomNatural(0, 10); // -> 0 ~ 10
```

### 类型

```ts
/**
 * @param from 最小的自然数
 * @param to 最大的自然数
 */
function randomNatural(from: number, to: number): number;
```


## `random`

在传入的两个数字之间随机生成一个数字

### 示例

```ts
import { random } from 'mixte';

random(0, 10); // -> 0 ~ 10
random(10, 0); // -> 0 ~ 10
random(-10, 10); // -> -10 ~ 10

random(10); // -> 0 ~ 10
random(-10); // -> -10 ~ 0

random(); // -> 0 ~ 10
```

### 类型

```ts
/**
 * 在传入的两个数字之间随机生成一个数字
 * @param from 第一个数字
 * @param to 第二个数字
 */
function random(from: number, to: number): number;
/**
 * 在 0 和传入数字之间随机生成一个数字
 * @param to 传入的数字
 */
function random(to: number): number;
/**
 * 在 0 和 10 之间随机生成一个数字
 */
function random(): number;
```


## `randomLowercaseLetter`

随机一个小写英文字母

### 示例

```ts
import { randomLowercaseLetter } from 'mixte';

randomLowercaseLetter(); // -> a ~ z
```

### 类型

```ts
function randomLowercaseLetter(): string;
```


## `randomUppercaseLetter`

随机一个大写英文字母

### 示例

```ts
import { randomUppercaseLetter } from 'mixte';

randomUppercaseLetter(); // -> A ~ Z
```

### 类型

```ts
function randomUppercaseLetter(): string;
```


## `randomLetter`

随机一个英文字母

### 示例

```ts
import { randomLetter } from 'mixte';

randomLetter(); // -> a ~ z, A ~ Z
randomLetter(true); // -> A ~ Z
randomLetter(false); // -> a ~ z
```

### 类型

```ts
/**
 * @param uppercase 是否大写
 */
function randomLetter(uppercase?: boolean): string;
```


## `randomString`

生成一个随机的字符串

### 示例

```ts
import { randomString } from 'mixte';

// -> 默认生成 12 位的仅有小写字母的字符串
randomString();
// -> 生成 18 位的包含小写字母和大写字母的字符串
randomString(18, { uppercase: true });
// -> 生成 18 位的包含小写字母、大写字母和数字的字符串
randomString(18, { uppercase: true, number: true });
// -> 生成 18 位的包含大写字母和数字的字符串
randomString(18, { uppercase: true, number: true, lowercase: false });
```

### 类型

```ts
/**
 * @param length 字符串的长度 ( default: 12 )
 * @param options 生成字符串的选项
 */
function randomString(length?: number, options?: RandomStringOptions): string;

interface RandomStringOptions {
  /** 是否包含小写字母 ( default: true ) */
  lowercase?: boolean
  /** 是否包含大写字母 ( default: false ) */
  uppercase?: boolean
  /** 是否包含数字 ( default: false ) */
  number?: boolean
}
```


## `randomBoolean`

生成一个随机的 boolean 值

### 示例

```ts
import { randomBoolean } from 'mixte';

randomBoolean(); // -> true or false
```

### 类型

```ts
function randomBoolean(): boolean;
```
