判断字符串是否是 18 位身份证号码

### 示例

```ts twoslash
import { isCitizenID } from '@mixte/validator';

isCitizenID('360602199901239999'); // -> true
isCitizenID('36060219990123999x'); // -> true
isCitizenID('36060219990123999X'); // -> true
isCitizenID('360609999999999999'); // -> false
```
