import type { MixteDynamicFormField } from '@mixte/snippets/acro-dynamic-form';
import { MixteAcroDynamicForm } from '@mixte/snippets/acro-dynamic-form';
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
    const wrapper = mount(MixteAcroDynamicForm);

    const form = wrapper.findAll('.arco-form');
    const formItems = wrapper.findAll('.arco-form-item');
    const btns = formItems[0].findAll('.arco-btn');

    expect(form.length).toBe(1);
    expect(formItems.length).toBe(1);
    expect(btns.length).toBe(2);
  });
});

describe('<acro-dynamic-form /> 字段渲染', () => {
  const fields: MixteDynamicFormField[] = [
    { field: 'name', label: '姓名', type: 'input' },
    { field: 'age', label: '年龄', type: 'input-number' },
  ];

  it('传入字段配置, 会根据配置渲染表单项', () => {
    const wrapper = mount(MixteAcroDynamicForm, {
      props: {
        fields,
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
    const wrapper = mount(MixteAcroDynamicForm);

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(2);
    expect(btns[0].text()).toBe('提交');
    expect(btns[1].text()).toBe('重置');
  });

  it('配置不显示操作按钮区域, form-item 及提交按钮、重置按钮不会渲染', () => {
    const wrapper = mount(MixteAcroDynamicForm, {
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
    const wrapper = mount(MixteAcroDynamicForm, {
      props: {
        showSubmitButton: false,
      },
    });

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(1);
    expect(btns[0].text()).toBe('重置');
  });

  it('配置不显示重置按钮', () => {
    const wrapper = mount(MixteAcroDynamicForm, {
      props: {
        showResetButton: false,
      },
    });

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(1);
    expect(btns[0].text()).toBe('提交');
  });

  it('配置提交按钮和重置按钮都不显示时, form-item 也不会渲染', () => {
    const wrapper = mount(MixteAcroDynamicForm, {
      props: {
        showSubmitButton: false,
        showResetButton: false,
      },
    });

    expect(wrapper.findAll('.arco-form-item').length).toBe(0);
  });

  it('配置提交按钮和重置按钮的文字', () => {
    const wrapper = mount(MixteAcroDynamicForm, {
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
