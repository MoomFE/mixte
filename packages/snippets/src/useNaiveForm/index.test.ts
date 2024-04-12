import { useNaiveForm } from '@mixte/snippets/useNaiveForm';

describe('useNaiveForm', () => {
  it('定义一个表单数据及数据验证规则', () => {
    const userForm = {
      name: '张三',
      age: 18,
    };
    const userFormValidateRules = {
      name: [{ required: true, message: '请输入姓名' }],
      age: [{ required: true, message: '请输入年龄' }],
    };

    const form = useNaiveForm({
      formRef: ref(),
      form: userForm,
      formValidateRules: userFormValidateRules,
    });

    expect(Object.keys(form)).toStrictEqual([
      'form',
      'formValidateRules',
      'formProps',
      'validate',
      'resetValidation',
      'resetForm',
      'reset',
    ]);

    // form
    expect(form.form).not.toBe(userForm);
    expect(form.form).toStrictEqual(userForm);
    expect(isReactive(form.form)).toBe(true);

    // formInitialValues
    expect(form.formValidateRules).toBe(userFormValidateRules);
    expect(isReactive(form.formValidateRules)).toBe(false);

    // formProps
    expect(form.formProps.model).toBe(form.form);
    expect(form.formProps.rules).toBe(userFormValidateRules);
    expect(form.formProps).toStrictEqual({
      model: userForm,
      rules: userFormValidateRules,
    });
    expect(isReactive(form.formProps)).toBe(false);

    // validate, resetValidation, resetForm, reset
    (['validate', 'resetValidation', 'resetForm', 'reset'] as const).forEach((key) => {
      expect(form[key]).toBeInstanceOf(Function);
    });
  });

  it('form 传入普通对象时, 将会使用 reactive 包装传入的对象', () => {
    const userForm = {
      name: '张三',
      age: 18,
    };

    const form = useNaiveForm({
      form: userForm,
    });

    expect(form.form).not.toBe(userForm);
    expect(form.form).toStrictEqual(userForm);
    expect(isReactive(form.form)).toBe(true);

    userForm.name = '李四';
    expect(form.form.name).toBe('李四');

    form.form.name = '王五';
    expect(userForm.name).toBe('王五');
  });

  it('form 支持传入 reactive 对象, 将直接使用', () => {
    const userForm = reactive({
      name: '张三',
      age: 18,
    });

    const form = useNaiveForm({
      formRef: ref(),
      form: userForm,
    });

    expect(form.form).toBe(userForm);
    expect(form.formProps.model).toBe(userForm);

    userForm.name = '李四';
    expect(form.form.name).toBe('李四');

    form.form.name = '王五';
    expect(userForm.name).toBe('王五');
  });

  it('form 选项支持传入 MaybeRefOrGetter 类型对象', () => {
    // Ref
    {
      const userForm = ref({
        name: '张三',
        age: 18,
      });

      const form = useNaiveForm({
        formRef: ref(),
        form: userForm,
      });

      expect(form.form).toBe(userForm.value);
      expect(form.formProps.model).toBe(userForm.value);
    }

    // Getter
    {
      const userForm = {
        name: '张三',
        age: 18,
      };

      const form = useNaiveForm({
        formRef: ref(),
        form: () => userForm,
      });

      expect(form.form).toStrictEqual(userForm);
      expect(form.formProps.model).toStrictEqual(userForm);
    }
  });

  it('formValidateRules 选项支持传入 MaybeRefOrGetter 类型对象', () => {
    // Ref
    {
      const userFormValidateRules = ref({
        name: [{ required: true, message: '请输入姓名' }],
        age: [{ required: true, message: '请输入年龄' }],
      });

      const form = useNaiveForm({
        formRef: ref(),
        form: {},
        formValidateRules: userFormValidateRules,
      });

      expect(form.formValidateRules).toBe(userFormValidateRules.value);
      expect(form.formProps.rules).toBe(userFormValidateRules.value);
    }

    // Getter
    {
      const userFormValidateRules = {
        name: [{ required: true, message: '请输入姓名' }],
        age: [{ required: true, message: '请输入年龄' }],
      };

      const form = useNaiveForm({
        formRef: ref(),
        form: {},
        formValidateRules: () => userFormValidateRules,
      });

      expect(form.formValidateRules).toStrictEqual(userFormValidateRules);
      expect(form.formProps.rules).toStrictEqual(userFormValidateRules);
    }
  });

  it('formRef 支持传入表单组件引用 ref 对象, 支持以数组形式传入多个表单组件引用', () => {
    const formRef1 = ref();
    const formRef2 = ref();

    useNaiveForm({
      formRef: formRef1,
    });

    useNaiveForm({
      formRef: [formRef1, formRef2],
    });
  });

  it('返回的 reset 和 resetForm 方法会重置 form 数据为初始状态', () => {
    const form = useNaiveForm({
      form: {
        name: '张三',
        age: 18,
      },
    });

    // reset

    form.form.name = '李四';
    form.form.age = 20;

    expect(form.form).toStrictEqual({
      name: '李四',
      age: 20,
    });

    form.reset();

    expect(form.form).toStrictEqual({
      name: '张三',
      age: 18,
    });

    // resetForm

    form.form.name = '王五';
    form.form.age = 22;

    expect(form.form).toStrictEqual({
      name: '王五',
      age: 22,
    });

    form.resetForm();

    expect(form.form).toStrictEqual({
      name: '张三',
      age: 18,
    });
  });

  it('返回的 reset 和 resetValidation 方法会重置表单验证, 调用传入的 formRef 的 restoreValidation 方法', () => {
    const formRef = {
      restoreValidation: vi.fn(),
    };
    const formRef2 = {
      restoreValidation: vi.fn(),
    };

    // 单个 formRef
    const form = useNaiveForm({ // @ts-expect-error
      formRef: ref(formRef),
      form: {
        name: '张三',
        age: 18,
      },
    });

    form.reset();

    expect(formRef.restoreValidation).toBeCalledTimes(1);
    expect(formRef2.restoreValidation).not.toBeCalled();

    form.resetValidation();

    expect(formRef.restoreValidation).toBeCalledTimes(2);
    expect(formRef2.restoreValidation).not.toBeCalled();

    // 多个 formRef
    const form2 = useNaiveForm({ // @ts-expect-error
      formRef: [ref(formRef), ref(formRef2)],
      form: {
        name: '张三',
        age: 18,
      },
    });

    form2.reset();

    expect(formRef.restoreValidation).toBeCalledTimes(3);
    expect(formRef2.restoreValidation).toBeCalledTimes(1);

    form2.resetValidation();

    expect(formRef.restoreValidation).toBeCalledTimes(4);
    expect(formRef2.restoreValidation).toBeCalledTimes(2);
  });

  it('返回的 validate 方法会验证表单, 调用传入的 formRef 的 validate 方法', async () => {
    const formRef = {
      validate: vi.fn(async () => {}),
    };
    const formRef2 = {
      validate: vi.fn(async () => {}),
    };

    // 单个 formRef
    const form = useNaiveForm({ // @ts-expect-error
      formRef: ref(formRef),
      form: {
        name: '张三',
        age: 18,
      },
    });

    await form.validate();

    expect(formRef.validate).toBeCalledTimes(1);
    expect(formRef2.validate).not.toBeCalled();

    // 多个 formRef
    const form2 = useNaiveForm({ // @ts-expect-error
      formRef: [ref(formRef), ref(formRef2)],
      form: {
        name: '张三',
        age: 18,
      },
    });

    await form2.validate();

    expect(formRef.validate).toBeCalledTimes(2);
    expect(formRef2.validate).toBeCalledTimes(1);
  });
});
