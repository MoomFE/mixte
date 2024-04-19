## `uniqueKey` {#uniqueKey}

为数组中对象的某个字段生成一个唯一的 key
  - 可用于为新增的数据生成唯一 key

### 示例

```ts twoslash
import { uniqueKey } from 'mixte';

const arr = [{ id: '1' }, { id: '2' }];

arr.push({
  id: uniqueKey(arr), // -> 'qCy7oZjp3CcDB6NMQ4'
});
```

## `uniqueKeyCustomizer` {#uniqueKeyCustomizer}

uniqueKey 方法默认的 key 生成器
  - 返回长度为 18 且首字母不为数字的字符串

### 示例

```ts twoslash
import { uniqueKeyCustomizer } from 'mixte';

uniqueKeyCustomizer(); // -> 'b3Ll5Kw6gQF5ens0H3'
uniqueKeyCustomizer(); // -> 'L1U1NsxTIEEKG098pB'
uniqueKeyCustomizer(); // -> 'Y8j5JqmvnICB24GUou'
uniqueKeyCustomizer(); // -> 'H6TK7p1M9zJ32HOfzE'
```
