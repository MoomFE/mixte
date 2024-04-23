- 字符串命名法转换

## `camelCase` {#camelCase}

将字符串转换为小驼峰命名

### 示例

```ts
import { camelCase } from 'mixte';

camelCase('foo-bar-baz'); // -> 'fooBarBaz'
camelCase('Foo_Bar_Baz'); // -> 'fooBarBaz'
```

## `pascalCase` {#pascalCase}

将字符串转换为大驼峰命名

### 示例

```ts
import { pascalCase } from 'mixte';

pascalCase('foo-bar-baz'); // -> 'FooBarBaz'
pascalCase('Foo_Bar_Baz'); // -> 'FooBarBaz'
```

## `kebabCase` {#kebabCase}

将字符串转换为短横线命名

### 示例

```ts
import { kebabCase } from 'mixte';

kebabCase('fooBarBaz'); // -> 'foo-bar-baz'
kebabCase('FooBarBaz'); // -> 'foo-bar-baz'
```

## snakeCase {#snakeCase}

将字符串转换为下划线命名

### 示例

```ts
import { snakeCase } from 'mixte';

snakeCase('fooBarBaz'); // -> 'foo_bar_baz'
snakeCase('FooBarBaz'); // -> 'foo_bar_baz'
```

## lowerFirst {#lowerFirst}

将字符串的首字母转换为小写

### 示例

```ts
import { lowerFirst } from 'mixte';

lowerFirst('FooBarBaz'); // -> 'fooBarBaz'
lowerFirst('fooBarBaz'); // -> 'fooBarBaz'
```

## upperFirst {#upperFirst}

将字符串的首字母转换为大写

### 示例

```ts
import { upperFirst } from 'mixte';

upperFirst('fooBarBaz'); // -> 'FooBarBaz'
upperFirst('FooBarBaz'); // -> 'FooBarBaz'
```
