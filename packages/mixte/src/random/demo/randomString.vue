<template>
  <div flex items-center gap="x3 y2" lt-sm:flex-col>
    <div text-sm grid="~ cols-[auto_1fr] items-center gap-(x2 y1)">
      字符串长度: <el-input-number v-model="length" class="w-32!" controls-position="right" :min="1" />
      包含小写字母: <el-checkbox v-model="lowercase" />
      包含大写字母: <el-checkbox v-model="uppercase" />
      包含数字: <el-checkbox v-model="number" />
    </div>
    <button m-btn="~ primary" @click="setValue">点击随机</button>
    <el-input :value="value" class="w-46! [&_input]-text-center" readonly />
  </div>
</template>

<script lang="ts" setup>
  import { randomString } from 'mixte';
  import { ElMessage } from 'element-plus';

  const length = ref<number>(12);
  const lowercase = ref<boolean>(true);
  const uppercase = ref<boolean>(false);
  const number = ref<boolean>(false);
  const value = ref(
    randomString(),
  );

  function setValue() {
    try {
      value.value = randomString(length.value, {
        lowercase: lowercase.value,
        uppercase: uppercase.value,
        number: number.value,
      });
    }
    catch (error: unknown) {
      ElMessage.error((error as Error).message);
      lowercase.value = true;
      setValue();
    }
  }

  watchImmediate([length, lowercase, uppercase, number], setValue);
</script>
