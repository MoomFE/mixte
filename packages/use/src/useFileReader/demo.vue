<template>
  <el-form>
    <el-form-item label="读取方式">
      <el-radio-group v-model="readAs">
        <el-radio value="DataURL">readAsDataURL</el-radio>
        <el-radio value="Text">readAsText</el-radio>
        <el-radio value="ArrayBuffer">readAsArrayBuffer</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>

  <input
    ref="inputRef"
    type="file" style="display: none"
    @change="() => file = inputRef!.files?.[0]"
  >

  <el-button type="primary" :loading="isReading" @click="inputRef!.click()">选择文件</el-button>

  <div mt-5>
    <div v-if="readAs === 'ArrayBuffer'" text="sm neutral">// 在控制台查看读取 ArrayBuffer 的结果</div>
    <el-input
      v-else
      type="textarea" readonly
      :value="result"
      :autosize="{ minRows: 6, maxRows: 8 }"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { InjectCode, InjectCodeLang } from '@/.vitepress/components/DemoCard/types';
  import { useFileReader } from '@mixte/use';

  const inputRef = ref<HTMLInputElement>();

  const file = ref<File>();

  const readAs = ref<'DataURL' | 'Text' | 'ArrayBuffer'>('DataURL');

  const isReading = ref(false);
  const result = ref<string | ArrayBuffer | null | undefined>();
  const error = ref<any>();

  wheneverEffectScopeImmediate(readAs, (readAs) => {
    file.value = undefined;
    inputRef.value && (inputRef.value.value = '');

    const res = useFileReader(file, readAs);

    syncRef(isReading, res.isReading, { direction: 'rtl' });
    syncRef(result, res.result, { direction: 'rtl' });
    syncRef(error, res.error, { direction: 'rtl' });

    whenever(() => readAs === 'ArrayBuffer' && !res.isReading.value && res.result.value, (result) => {
      console.log(result); // eslint-disable-line no-console
    });
  });

  inject<InjectCodeLang>('codeLang')!.value = 'vue';
  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `
<template>
  <input
    ref="inputRef"
    type="file" style="display: none"
    @change="() => file = inputRef!.files?.[0]"
  >

  <el-button type="primary" :loading="isReading" @click="inputRef!.click()">选择文件</el-button>
</template>

<script lang="ts" setup>
  import { useFileReader } from '@mixte/use';

  const inputRef = ref<HTMLInputElement>();
  const file = ref<File>();

  const {
    result, // -> ...
    isReading, // -> ${isReading.value}
    error, // -> ${error.value}
  } = useFileReader(file, '${readAs.value}');
<\/script>
    `),
    { direction: 'rtl' },
  );
</script>
