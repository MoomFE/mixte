<template>
  <AcroDynamicForm
    ref="formRef"
    class="max-w-82"
    :fields="fields"
    :model="model"
    :disabled="login.isLoading"
    :action-button-area="{
      props: { class: 'mb-0!', hideLabel: true },
      spaceProps: { class: 'w-full', direction: 'vertical' },
    }"
    :submit-button="{
      text: '登录',
      props: { long: true, loading: login.isLoading, htmlType: 'submit' },
    }"
    :reset-button="false"
    @submit="submit()"
  >
    <template #actionButtonAppend>
      <a-button type="text" long style="color: var(--color-text-3)">注册账号</a-button>
    </template>
  </AcroDynamicForm>
</template>

<script lang="tsx" setup>
  import type { AcroDynamicFormInstance } from '@mixte/snippets/acro-dynamic-form';
  import { delay, random } from 'mixte';
  import { useRequestReactive } from '@mixte/use';
  import { Message } from '@arco-design/web-vue';
  import { AcroDynamicForm, defineAcroDynamicFormFields } from '@mixte/snippets/acro-dynamic-form';

  const formRef = ref<AcroDynamicFormInstance>();

  const model = reactive({
    username: '',
    password: '',
    rememberPassword: false,
  });

  const fields = defineAcroDynamicFormFields([
    {
      field: 'username',
      formItemProps: { hideLabel: true },
      type: 'input',
      componentProps: { placeholder: '请输入用户名 ( admin )', allowClear: true },
      componentSlots: {
        prefix: () => <i-ant-design-user-outlined />,
      },
      rules: [{ required: true, message: '请输入用户名' }],
    },
    {
      field: 'password',
      formItemProps: { hideLabel: true },
      type: 'input-password',
      componentProps: { placeholder: '请输入密码 ( admin )', allowClear: true },
      componentSlots: {
        prefix: () => <i-ant-design-lock-outlined />,
      },
      rules: [{ required: true, message: '请输入密码' }],
    },
    {
      field: 'rememberPassword',
      type: 'checkbox',
      formItemProps: { hideLabel: true },
      componentSlots: {
        default: () => '记住密码',
      },
      render: ({ Component }) => (
        <div class="w-full flex justify-between">
          {Component()}
          <a-link>忘记密码</a-link>
        </div>
      ),
    },
  ]);

  const login = useRequestReactive(async (info: Omit<typeof model, 'rememberPassword'>) => {
    await delay(random(120, 800));
    if (!(info.username === 'admin' && info.password === 'admin'))
      throw new Error('用户名或密码错误');
  });

  async function submit() {
    if (await formRef.value!.validate()) return;

    try {
      await login.execute(model);
      Message.success('登录成功');
    }
    catch (error: any) {
      Message.error(error.message);
    }
  }
</script>
