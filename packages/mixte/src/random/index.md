- 各种随机函数

## `randomNatural` {#randomNatural}

在传入的两个自然数之间随机生成一个自然数

### 示例

```ts twoslash
import { randomNatural } from 'mixte';

randomNatural(0, 10); // -> 0 ~ 10
```

## `random` {#random}

在传入的两个数字之间随机生成一个数字

### 示例

```ts twoslash
import { random } from 'mixte';

random(0, 10); // -> 0 ~ 10
random(10, 0); // -> 0 ~ 10
random(-10, 10); // -> -10 ~ 10

random(10); // -> 0 ~ 10
random(-10); // -> -10 ~ 0

random(); // -> 0 ~ 10
```

## `randomLowercaseLetter` {#randomLowercaseLetter}

随机一个小写英文字母

### 示例

```ts twoslash
import { randomLowercaseLetter } from 'mixte';

randomLowercaseLetter(); // -> a ~ z
```

## `randomUppercaseLetter` {#randomUppercaseLetter}

随机一个大写英文字母

### 示例

```ts twoslash
import { randomUppercaseLetter } from 'mixte';

randomUppercaseLetter(); // -> A ~ Z
```

## `randomLetter` {#randomLetter}

随机一个英文字母

### 示例

```ts twoslash
import { randomLetter } from 'mixte';

randomLetter(); // -> a ~ z, A ~ Z
randomLetter(true); // -> A ~ Z
randomLetter(false); // -> a ~ z
```

## `randomString` {#randomString}

生成一个随机的字符串

### 示例

```ts twoslash
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

## `randomBoolean` {#randomBoolean}

生成一个随机的 boolean 值

### 示例

```ts twoslash
import { randomBoolean } from 'mixte';

randomBoolean(); // -> true or false
```
