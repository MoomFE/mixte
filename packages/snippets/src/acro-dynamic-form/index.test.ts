import { AcroDynamicForm } from '@mixte/snippets/acro-dynamic-form';
import type { DOMWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';

// 来源: arco-design/arco-design-vue/packages/web-vue/scripts/demo-test.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('<acro-dynamic-form /> 基础测试', () => {
  it('未传入任何参数, 只会渲染一个含有操作按钮的空表单', () => {
    const wrapper = mount(AcroDynamicForm);

    const form = wrapper.findAll('.arco-form');
    const formItems = wrapper.findAll('.arco-form-item');
    const btns = formItems[0].findAll('.arco-btn');

    expect(form.length).toBe(1);
    expect(formItems.length).toBe(1);
    expect(btns.length).toBe(2);
  });

  it('组件可传入 model 参数以收集及控制表单数据', async () => {
    const model = ref<Record<string, any>>({});
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input', defaultValue: '张三' },
          { field: 'age', label: '年龄', type: 'input', defaultValue: '18' },
        ],
        model,
        showActionButtonArea: false,
      },
    });

    const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

    expect(model.value).toStrictEqual({ name: '张三', age: '18' });
    expect(nameInput.element.value).toBe('张三');
    expect(ageInput.element.value).toBe('18');

    await nameInput.setValue('李四');
    await ageInput.setValue('20');

    expect(model.value).toStrictEqual({ name: '李四', age: '20' });
    expect(nameInput.element.value).toBe('李四');
    expect(ageInput.element.value).toBe('20');

    model.value.name = '王五';
    model.value.age = '22';
    await wrapper.vm.$nextTick();

    expect(nameInput.element.value).toBe('王五');
    expect(ageInput.element.value).toBe('22');

    model.value = { name: '赵六', age: '24' };
    await wrapper.vm.$nextTick();

    expect(nameInput.element.value).toBe('赵六');
    expect(ageInput.element.value).toBe('24');
  });

  it('非组件本身的参数, 会继承至 a-form 上', async () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input', defaultValue: '张三' },
          { field: 'age', label: '年龄', type: 'input', defaultValue: '18' },
        ],
        disabled: false,
      },
    });

    expect(wrapper.findAll('.arco-input-disabled').length).toBe(0);

    // @ts-expect-error
    wrapper.setProps({ disabled: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.arco-input-disabled').length).toBe(2);
  });
});

describe('<acro-dynamic-form /> 导出方法', () => {
  it('提供 validate 方法, 可以对表单进行校验', async () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input', rules: { required: true, message: '请输入姓名' } },
          { field: 'age', label: '年龄', type: 'input' },
        ],
      },
    });

    const validate = wrapper.vm.validate as Function;

    expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);

    await validate();

    expect(wrapper.find('.arco-form-item-message').exists()).toBe(true);
    expect(wrapper.find('.arco-form-item-message').text()).toBe('请输入姓名');
  });
});

describe('<acro-dynamic-form /> 字段配置', () => {
  it('传入字段配置, 会根据配置渲染表单项', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input' },
          { field: 'age', label: '年龄', type: 'input-number' },
        ],
        showActionButtonArea: false,
      },
    });

    const formItems = wrapper.findAll('.arco-form-item');

    expect(formItems.length).toBe(2);

    expect(formItems[0].find('.arco-input').exists()).toBe(true);
    expect(formItems[1].find('.arco-input-number').exists()).toBe(true);

    expect(formItems.map(item => item.find('.arco-form-item-label').text())).toEqual(['姓名', '年龄']);
  });
});

describe('<acro-dynamic-form /> 操作按钮', () => {
  it('默认情况下, 提交按钮和重置按钮都会显示', () => {
    const wrapper = mount(AcroDynamicForm);

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(2);
    expect(btns[0].text()).toBe('提交');
    expect(btns[1].text()).toBe('重置');
  });

  it('点击提交按钮, 会对表单进行校验', async () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input', rules: { required: true, message: '请输入姓名' } },
          { field: 'age', label: '年龄', type: 'input-number' },
        ],
      },
    });

    const submitBtn = wrapper.findAll('.arco-btn').find(btn => btn.text() === '提交')!;

    expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);

    submitBtn.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.arco-form-item-message').exists()).toBe(true);
    expect(wrapper.find('.arco-form-item-message').text()).toBe('请输入姓名');
  });

  it('点击重置按钮, 会重置表单', async () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input', defaultValue: '张三' },
          { field: 'age', label: '年龄', type: 'input', defaultValue: '18' },
        ],
      },
    });

    const resetBtn = wrapper.findAll('.arco-btn').find(btn => btn.text() === '重置')!;
    const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

    expect(nameInput.element.value).toBe('张三');
    expect(ageInput.element.value).toBe('18');

    await nameInput.setValue('李四');
    await ageInput.setValue('20');

    expect(nameInput.element.value).toBe('李四');
    expect(ageInput.element.value).toBe('20');

    resetBtn.trigger('click');
    await wrapper.vm.$nextTick();

    expect(nameInput.element.value).toBe('张三');
    expect(ageInput.element.value).toBe('18');
  });

  it('配置不显示操作按钮区域, a-form-item 及提交按钮、重置按钮不会渲染', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        showActionButtonArea: false,
      },
    });

    const formItems = wrapper.findAll('.arco-form-item');
    const btns = wrapper.findAll('.arco-btn');

    expect(formItems.length).toBe(0);
    expect(btns.length).toBe(0);
  });

  it('配置不显示提交按钮', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        showSubmitButton: false,
      },
    });

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(1);
    expect(btns[0].text()).toBe('重置');
  });

  it('配置不显示重置按钮', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        showResetButton: false,
      },
    });

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(1);
    expect(btns[0].text()).toBe('提交');
  });

  it('配置提交按钮和重置按钮都不显示时, a-form-item 也不会渲染', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        showSubmitButton: false,
        showResetButton: false,
      },
    });

    expect(wrapper.findAll('.arco-form-item').length).toBe(0);
  });

  it('配置提交按钮和重置按钮的文字', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        submitButtonText: '自定义提交',
        resetButtonText: '自定义重置',
      },
    });

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(2);
    expect(btns[0].text()).toBe('自定义提交');
    expect(btns[1].text()).toBe('自定义重置');
  });
});
