判断字符串是否是电子邮件地址

## 示例

```ts twoslash
import { isEmail } from '@mixte/validator';

isEmail('test@example.com'); // -> true
isEmail('john.doe@example.co.uk'); // -> true
isEmail('notanemail'); // -> false
isEmail('user@'); // -> false
isEmail('user@example'); // -> false
isEmail('user@example.'); // -> false
isEmail('user@example..com'); // -> false
```
