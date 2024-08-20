---
outline: [2,4]
---

## `useRequest` {#useRequest}

发起请求的组合式函数
  - 旨在解决请求前中后的状态管理、响应数据存储及提供事件钩子
  - 可与任意请求库搭配使用

### 示例

<br>

#### 基础示例

```ts twoslash
import { useRequest } from '@mixte/use';
// ---cut-start---
import axios from 'axios';
// ---cut-end---

const {
  response,
  data,
  error,
  isExecuted,
  isLoading,
  isFinished,
  isSuccess,
  execute,
  reset,
  onSuccess,
  onError,
  onFinally,
  reactive,
} = useRequest(() => {
  return axios.get('https://httpbin.org/uuid');
});
```

#### 在现有项目中使用

:::info 修改步骤
1. 把现有定义接口的方式从:

```js twoslash
// ---cut-start---
import axios from 'axios';
// ---cut-end---
function login(info) {
  return axios.post('/api/user/login', info);
}
```

改为使用 `useRequest` 的方式:

```js twoslash
import { useRequest } from '@mixte/use';

function login() {
  return useRequest((info) => {
    return axios.post('/api/user/login', info);
  });
}
```

2. 在调用端, 从:

```js twoslash
// ---cut-start---
import { reactive, ref } from 'vue';
import axios from 'axios';
const login = info => axios.post('/api/user/login', info);
// ---cut-end---
const form = reactive({ username: '', password: '' });
const data = ref();
const loading = ref(false);

async function submit() {
  loading.value = true;

  try {
    data.value = (await login(form))?.data;
    // do something
  }
  finally {
    loading.value = false;
  }
}
```

改为:

```js twoslash
// ---cut-start---
import { useRequest } from '@mixte/use';
import { reactive } from 'vue';
import axios from 'axios';
const login = () => useRequest(info => axios.post('/api/user/login', info));
// ---cut-end---
const form = reactive({ username: '', password: '' });
const { data, isLoading, execute } = login();

async function submit() {
  await execute(form);
  // do something
}
```

大功告成 !
:::

#### 同时定义多个请求

:::info
通常, 在页面或组件中都会发起多次请求, 这时候, 可以使用一个变量接受所有的返回值:

```ts twoslash {3,4,10,11}
// ---cut-start---
import { useRequest } from '@mixte/use';
import axios from 'axios';
const login = () => useRequest(() => axios.post('/api/user/login'));
const getUserInfo = () => useRequest(() => axios.post('/api/user/info'));
// ---cut-end---
// import { getUserInfo, login } from '@/api/auth';

const loginInfo = login();
const userInfo = getUserInfo();

async function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.value.name);
  console.log(userInfo.data.value.age);
}
```

::: tip
因为 `data`、`isLoading`、`...` 是一个 `ref` 变量, 所以需要加 `.value` 取值, 导致调用链很长

往下看, 下面就有解决方案
:::

#### 使用响应式代理式的返回值

:::info
当使用变量接受所有的返回值时, 会导致调用链很长, 这时候, 可以使用响应式代理式的返回值:

```ts twoslash {3,4,10,11}
// ---cut-start---
import { useRequest } from '@mixte/use';
import axios from 'axios';
const login = () => useRequest(() => axios.post('/api/user/login'));
const getUserInfo = () => useRequest(() => axios.post('/api/user/info'));
// ---cut-end---
// import { getUserInfo, login } from '@/api/auth';

const loginInfo = login().reactive;
const userInfo = getUserInfo().reactive;

async function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.name);
  console.log(userInfo.data.age);
}
```
:::

#### 统一在请求完成后数据处理

```ts twoslash {6,7,8,14,20}
// ---cut-start---
import { useRequest } from '@mixte/use';
import axios from 'axios';
const login = () => useRequest(() => axios.post('/api/user/login'));
const getUserInfo = () => useRequest(() => axios.post('/api/user/info'));
// ---cut-end---
// import { getUserInfo, login } from '@/api/auth';

const loginInfo = login().reactive;
const userInfo = getUserInfo().reactive;

userInfo.onSuccess(() => {
  userInfo.data.name = 'Mixte';
});

async function submit() {
  await loginInfo.execute(/* {...} */);
  await userInfo.execute();

  console.log(userInfo.data.name); // -> Mixte
}

async function otherLogic() {
  await userInfo.execute();

  console.log(userInfo.data.name); // -> Mixte
}
```

#### 配置项

:::info
在定义接口处配置:

```ts twoslash {4}
// ---cut-start---
import { useRequest } from '@mixte/use';
import axios from 'axios';
// ---cut-end---
function login() {
  return useRequest(
    info => axios.post('/api/user/login', info),
    { immediate: true }
  );
}

const loginInfo = login();
```

也可以在定义接口处接收相关配置选项, 在调用端根据需求自行配置:

```ts twoslash {3,6,10,11,12,13}
// ---cut-start---
import { useRequest } from '@mixte/use';
import axios from 'axios';
// ---cut-end---
import type { UseRequestOptions } from '@mixte/use';

function login(options?: UseRequestOptions) {
  return useRequest(
    info => axios.post('/api/user/login', info),
    options
  );
}

const loginInfo = login({
  immediate: true,
  resetOnExecute: false,
});
```
:::

## `useRequestReactive` {#useRequestReactive}

发起请求的组合式函数
  - 和 `useRequest` 方法一致, 只是返回响应式代理对象

### 示例

<br>

#### 从 `useRequest` 改为使用 `useRequestReactive`

:::info 修改步骤
1. 原有使用 `useRequest` 时:

```ts twoslash {1,5,6,7}
// ---cut-start---
import { useRequest } from '@mixte/use';
import axios from 'axios';
// ---cut-end---
const uuid = useRequest(() => {
  return axios.get('https://httpbin.org/uuid');
});

console.log(uuid.response.value); // 需要使用 `.value` 获取值
console.log(uuid.data.value); // 需要使用 `.value` 获取值
console.log(uuid.error.value); // 需要使用 `.value` 获取值
```

2. 修改方法为 `useRequestReactive` 后:

```ts twoslash {1,5,6,7}
// ---cut-start---
import { useRequestReactive } from '@mixte/use';
import axios from 'axios';
// ---cut-end---
const uuid = useRequestReactive(() => {
  return axios.get('https://httpbin.org/uuid');
});

console.log(uuid.response); // 不用再使用 `.value` 了
console.log(uuid.data); // 不用再使用 `.value` 了
console.log(uuid.error); // 不用再使用 `.value` 了
```
:::
