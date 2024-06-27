<template>
  <AcroDynamicForm
    ref="formRef"
    class="max-w-84"
    :fields="fields"
    :model="model"
    :disabled="login.isLoading"
    :action-button-area="{
      props: { class: 'mb-0!', hideLabel: true },
      spaceProps: { class: 'w-full', direction: 'vertical' },
    }"
    :submit-button="{
      text: '登录 / 注册',
      props: { class: 'mt-1', long: true, loading: login.isLoading, htmlType: 'submit' },
    }"
    :reset-button="false"
    @submit="submit()"
  />
</template>

<script lang="tsx" setup>
  import type { AcroDynamicFormInstance } from '@mixte/snippets/acro-dynamic-form';
  import { delay, random } from 'mixte';
  import { useRequestReactive } from '@mixte/use';
  import { Button, Link, Message } from '@arco-design/web-vue';
  import { AcroDynamicForm, defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';
  import { isMobileReg } from '@mixte/validator';

  const formRef = ref<AcroDynamicFormInstance>();

  const { output, isStart, start, stop } = useCountdown(60, {
    duration: 60 * 1000,
  });

  const model = reactive({
    mobile: '',
    code: '',
    agreedToTerms: false,
  });

  const fields = defineAcroDynamicFormFields([
    {
      field: 'mobile',
      type: 'input',
      componentProps: { placeholder: '请输入手机号', allowClear: true },
      formItemProps: { hideLabel: true },
      rules: [
        { required: true, message: '请输入手机号' },
        { match: isMobileReg, message: '请输入正确的手机号' },
      ],
    },
    {
      field: 'code',
      type: 'input',
      componentProps: {
        class: '[&_.arco-input-append]-(b-y-none b-r-none px-0)',
        placeholder: '请输入验证码 ( 1234 )',
        allowClear: true,
      },
      componentSlots: {
        append: () => (
          <Button
            class="h-full! rounded-l-none!"
            type="text"
            size="small"
            disabled={isStart.value}
            onClick={sendCode}
          >
            {isStart.value ? `${Math.floor(output.value)}秒后重发` : '获取验证码'}
          </Button>
        ),
      },
      formItemProps: { hideLabel: true },
      rules: { required: true, message: '请输入验证码' },
    },
    {
      field: 'agreedToTerms',
      type: 'checkbox',
      formItemProps: { class: 'mt-1', hideLabel: true },
      componentProps: { class: 'items-start!' },
      componentSlots: {
        default: () => (
          <div class="text-xs [&>.arco-link]-(inline text-xs px-0)">
            我已阅读并同意<Link>《用户协议》</Link>、<Link>《隐私政策》</Link>和<Link>《服务协议》</Link>，未注册的手机号将自动创建账号
          </div>
        ),
      },
      rules: {
        validator: (value, callback) => value ? callback() : callback('请阅读并接受协议'),
      },
    },
  ]);

  const login = useRequestReactive(async (info: typeof model) => {
    await delay(random(120, 800));
    if (info.code !== '1234')
      throw new Error('验证码错误');
  });

  async function sendCode() {
    if (await formRef.value!.validateField('mobile')) return;

    try {
      await delay(random(120, 800)); // 正式环境换成真实请求
      start();
      Message.success('验证码发送成功');
    }
    catch (error) {
      stop();
      console.error(error);
    }
  }

  async function submit() {
    if (await formRef.value!.validate()) return;

    try {
      await login.execute(model);
      formRef.value!.reset();
      stop();
      Message.success('登录成功');
    }
    catch (error: any) {
      Message.error(error.message);
    }
  }
</script>
