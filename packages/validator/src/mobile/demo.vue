<template>
  <el-form ref="formRef" :model="form" label-suffix=":" status-icon>
    <el-form-item prop="value" :label="fnName" :rules="rules">
      <el-input v-model="form.value" class="w-66!" clearable placeholder="请输入" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import type { InjectCode } from '@/.vitepress/components/DemoCard/types';
  import type { FormInstance, FormItemRule } from 'element-plus';
  import { isMobile } from '@mixte/validator';

  interface Props {
    fn?: (str: string) => boolean;
    fnName?: string;
    defaultValue?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    fn: isMobile,
    fnName: 'isMobile',
    defaultValue: '16666666666',
  });

  const formRef = ref<FormInstance>();

  const form = reactive({
    value: props.defaultValue,
  });

  const rules: FormItemRule[] = [{
    validator: (_, value) => props.fn(value),
    message: '验证失败',
    trigger: ['change', 'blur'],
  }];

  onMounted(() => {
    formRef.value!.validate();
  });

  syncRef(
    inject<InjectCode>('code')!,
    computed(() => `${props.fnName}('${form.value}'); // -> ${props.fn(form.value)}`),
    { direction: 'rtl' },
  );
</script>
