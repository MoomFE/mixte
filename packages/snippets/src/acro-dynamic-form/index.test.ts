import type { DOMWrapper } from '@vue/test-utils';
import { AcroDynamicForm, defineAcroDynamicFormField, defineAcroDynamicFormFields, defineAcroDynamicFormPreset } from '@mixte/snippets/acro-dynamic-form';
import { config, mount } from '@vue/test-utils';
import type { CheckboxInstance, FormItemInstance, InputInstance } from '@arco-design/web-vue';
import type { StringKeyOf, ValueOf } from 'type-fest';
import { Button } from '@arco-design/web-vue';
import { deepClone } from 'mixte';
import type { VNodeChild } from 'vue';
import type { AcroDynamicFormField, AcroDynamicFormProps } from './src/types';

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

config.global.config.warnHandler = (msg) => {
  if (msg.includes(`' was accessed via 'this'.`)) return;

  console.error(msg);
};

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

    wrapper.setProps({ disabled: true });
    await wrapper.vm.$nextTick();

    expect(wrapper.findAll('.arco-input-disabled').length).toBe(2);
  });
});

describe('<acro-dynamic-form /> 字段配置', () => {
  it('传入字段配置, 会根据配置渲染表单项', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: defineAcroDynamicFormFields([
          { field: 'name', label: '姓名', type: 'input' },
          { field: 'age', label: '年龄', type: 'input-number' },
        ]),
        actionButtonArea: false,
      },
    });

    const formItems = wrapper.findAll('.arco-form-item');

    expect(formItems.length).toBe(2);

    expect(formItems[0].find('.arco-input').exists()).toBe(true);
    expect(formItems[1].find('.arco-input-number').exists()).toBe(true);

    expect(formItems.map(item => item.find('.arco-form-item-label').text())).toEqual(['姓名', '年龄']);
  });

  describe('type & componentProps', () => {
    it('类型测试: 当 type 为支持的表单类组件时, componentProps 会切换为对应组件的类型', () => {
      // Input
      {
        const field: AcroDynamicFormField = { field: 'name', type: 'input' };

        type ComponentProps = NonNullable<(typeof field)['componentProps']>;

        expectTypeOf<StringKeyOf<ComponentProps>>().not.toEqualTypeOf<StringKeyOf<InputInstance['$props']>>();
        expectTypeOf<
          StringKeyOf<ComponentProps> | 'modelValue'
        >().toEqualTypeOf<
          StringKeyOf<InputInstance['$props']>
        >();
      }

      // Checkbox
      {
        const field: AcroDynamicFormField = { field: 'name', type: 'checkbox' };

        type ComponentProps = NonNullable<(typeof field)['componentProps']>;

        expectTypeOf<StringKeyOf<ComponentProps>>().not.toEqualTypeOf<StringKeyOf<CheckboxInstance['$props']>>();
        expectTypeOf<
          StringKeyOf<ComponentProps> | 'modelValue'
        >().toEqualTypeOf<
          StringKeyOf<CheckboxInstance['$props']>
        >();
      }
    });

    it('类型测试: 当 type 为空, 此时 componentProps 为随意输入内容的对象', () => {
      expectTypeOf<AcroDynamicFormField>().toMatchTypeOf<{ type?: string }>();

      const field: AcroDynamicFormField = { field: 'name' };

      type ComponentProps = NonNullable<(typeof field)['componentProps']>;

      expectTypeOf<ComponentProps>().toEqualTypeOf<Record<string, any>>();
    });

    it('类型测试: 当 type 为非支持的表单类组件时, 此时 componentProps 为随意输入内容的对象', () => {
      const field: AcroDynamicFormField = { field: 'name', type: 'button' };

      type ComponentProps = NonNullable<(typeof field)['componentProps']>;

      expectTypeOf<ComponentProps>().toEqualTypeOf<Record<string, any>>();
    });
  });

  describe('render', () => {
    describe('render 传入函数', () => {
      it('传入函数渲染自定义组件', () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            fields: defineAcroDynamicFormFields([
              { field: 'name', label: '姓名', render: () => h('div', { class: 'custom-render' }, '张三') },
              { field: 'age', label: '年龄', render: () => h('div', { class: 'custom-render' }, '18') },
            ]),
            actionButtonArea: false,
          },
        });

        const formItems = wrapper.findAll('.arco-form-item .custom-render');

        expect(formItems.length).toBe(2);

        expect(formItems[0].text()).toBe('张三');
        expect(formItems[1].text()).toBe('18');
      });

      it('函数会传入 model 参数, 为当前表单的表单数据', () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            model: { name: '张三', age: '18' },
            fields: defineAcroDynamicFormFields([
              { field: 'name', type: 'input', label: '姓名', render: ({ model }) => h('div', { class: 'custom-render' }, model.name) },
              { field: 'age', type: 'input', label: '年龄', render: ({ model }) => h('div', { class: 'custom-render' }, model.age) },
            ]),
            actionButtonArea: false,
          },
        });

        const formItems = wrapper.findAll('.arco-form-item .custom-render');

        expect(formItems.length).toBe(2);

        expect(formItems[0].text()).toBe('张三');
        expect(formItems[1].text()).toBe('18');
      });

      it('函数会传入 Component 参数, 为原组件渲染函数', () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            model: { name: '张三', age: '18' },
            fields: defineAcroDynamicFormFields([
              { field: 'name', type: 'input', label: '姓名', render: ({ Component }) => h('div', { class: 'custom-render' }, [Component()]) },
              { field: 'age', type: 'input', label: '年龄', render: ({ Component }) => h('div', { class: 'custom-render' }, [Component()]) },
            ]),
            actionButtonArea: false,
          },
        });

        const [nameInput, ageInput] = wrapper.findAll('.arco-form-item .custom-render .arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

        expect(nameInput.element.value).toBe('张三');
        expect(ageInput.element.value).toBe('18');
      });
    });

    describe('render 传入插槽名称', () => {
      it('传入插槽名称时, 将使用指定名称的插槽来渲染自定义组件', () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            fields: defineAcroDynamicFormFields([
              { field: 'name', label: '姓名', render: 'name' },
              { field: 'age', label: '年龄', render: 'age' },
            ]),
            actionButtonArea: false,
          },
          slots: {
            name: () => h('div', { class: 'custom-render' }, '张三'),
            age: () => h('div', { class: 'custom-render' }, '18'),
          },
        });

        const formItems = wrapper.findAll('.arco-form-item .custom-render');

        expect(formItems.length).toBe(2);

        expect(formItems[0].text()).toBe('张三');
        expect(formItems[1].text()).toBe('18');
      });

      it('插槽会传入 model 参数, 为当前表单的表单数据', () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            model: { name: '张三', age: '18' },
            fields: defineAcroDynamicFormFields([
              { field: 'name', label: '姓名', render: 'name' },
              { field: 'age', label: '年龄', render: 'age' },
            ]),
            actionButtonArea: false,
          },
          slots: {
            name: ({ model }) => h('div', { class: 'custom-render' }, model.name),
            age: ({ model }) => h('div', { class: 'custom-render' }, model.age),
          },
        });

        const formItems = wrapper.findAll('.arco-form-item .custom-render');

        expect(formItems.length).toBe(2);

        expect(formItems[0].text()).toBe('张三');
        expect(formItems[1].text()).toBe('18');
      });

      it('插槽会传入 Component 参数, 为原组件渲染函数', () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            model: { name: '张三', age: '18' },
            fields: defineAcroDynamicFormFields([
              { field: 'name', type: 'input', label: '姓名', render: 'name' },
              { field: 'age', type: 'input', label: '年龄', render: 'age' },
            ]),
            actionButtonArea: false,
          },
          slots: {
            name: ({ Component }) => h('div', { class: 'custom-render' }, [Component()]),
            age: ({ Component }) => h('div', { class: 'custom-render' }, [Component()]),
          },
        });

        const [nameInput, ageInput] = wrapper.findAll('.arco-form-item .custom-render .arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

        expect(nameInput.element.value).toBe('张三');
        expect(ageInput.element.value).toBe('18');
      });
    });
  });

  describe('defaultValue', () => {
    it('组件初始化时, 会设置表单项的初始值', () => {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: defineAcroDynamicFormFields([
            { field: 'name', label: '姓名', type: 'input', defaultValue: '张三' },
            { field: 'age', label: '年龄', type: 'input' },
          ]),
        },
      });

      const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

      expect(nameInput.element.value).toBe('张三');
      expect(ageInput.element.value).toBe('');

      expect(wrapper.vm.model).toStrictEqual({ name: '张三' });
    });

    it('若未设置该选项, 不会写入值', () => {
      const model = reactive<Record<string, any>>({ name: '张三' });

      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: defineAcroDynamicFormFields([
            { field: 'name', label: '姓名', type: 'input' },
            { field: 'age', label: '年龄', type: 'input' },
          ]),
          model,
        },
      });

      const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

      expect(nameInput.element.value).toBe('张三');
      expect(ageInput.element.value).toBe('');

      expect(wrapper.vm.model).toStrictEqual({ name: '张三' });
    });

    it('当从外部传入 model 时, defaultValue 不会覆盖有值的数据', () => {
      const model = reactive<Record<string, any>>({ name: '张三' });

      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: defineAcroDynamicFormFields([
            { field: 'name', label: '姓名', type: 'input', defaultValue: '李四' },
            { field: 'age', label: '年龄', type: 'input' },
          ]),
          model,
        },
      });

      const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

      expect(nameInput.element.value).toBe('张三');
      expect(ageInput.element.value).toBe('');

      expect(wrapper.vm.model).toStrictEqual({ name: '张三' });
    });
  });

  describe('componentProps', () => {
    describe('modelValue', () => {
      it('使用 componentProps 传递的 modelValue 不会覆盖 v-model 的值', async () => {
        const model = reactive<Record<string, any>>({});
        const componentProps = reactive<Record<string, any>>({});

        const wrapper = mount(AcroDynamicForm, {
          props: {
            fields: defineAcroDynamicFormFields([{ field: 'name', label: '姓名', type: 'input', defaultValue: '', componentProps }]),
            model,
          },
        });

        expect(model.name).toBe('');
        expect((wrapper.find('.arco-input').element as HTMLInputElement).value).toBe('');

        // 组件修改值 √
        await wrapper.find('.arco-input').setValue('张三');
        expect(model.name).toBe('张三');
        expect((wrapper.find('.arco-input').element as HTMLInputElement).value).toBe('张三');

        // model 修改值 √
        model.name = '李四';
        await wrapper.vm.$nextTick();
        expect(model.name).toBe('李四');
        expect((wrapper.find('.arco-input').element as HTMLInputElement).value).toBe('李四');

        // 通过 componentProps 修改值 ×
        componentProps.modelValue = '王五';
        await wrapper.vm.$nextTick();
        expect(model.name).toBe('李四');
        expect((wrapper.find('.arco-input').element as HTMLInputElement).value).toBe('李四');
      });

      it('使用 componentProps 传递的 onUpdate:modelValue 事件依旧可以触发', async () => {
        const model = reactive<Record<string, any>>({});
        let value = '';

        const wrapper = mount(AcroDynamicForm, {
          props: {
            fields: defineAcroDynamicFormFields([{
              field: 'name',
              label: '姓名',
              type: 'input',
              defaultValue: '',
              componentProps: {
                'onUpdate:modelValue': (val) => {
                  value = val;
                },
              },
            }]),
            model,
          },
        });

        expect(value).toBe('');
        expect(model.name).toBe('');
        expect((wrapper.find('.arco-input').element as HTMLInputElement).value).toBe('');

        await wrapper.find('.arco-input').setValue('张三');

        expect(value).toBe('张三');
        expect(model.name).toBe('张三');
        expect((wrapper.find('.arco-input').element as HTMLInputElement).value).toBe('张三');
      });

      it('类型测试: 已从 componentProps 中排除 modelValue 字段', () => {
        const field: AcroDynamicFormField = { field: 'name', type: 'input' };

        type ComponentProps = NonNullable<(typeof field)['componentProps']>;

        expectTypeOf<StringKeyOf<ComponentProps>>().not.toEqualTypeOf<StringKeyOf<InputInstance['$props']>>();
        expectTypeOf<
          StringKeyOf<ComponentProps> | 'modelValue'
        >().toEqualTypeOf<
          StringKeyOf<InputInstance['$props']>
        >();
      });
    });
  });

  describe('componentSlots', () => {
    it('使用 componentSlots 可传递插槽给组件', async () => {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: [{ field: 'name', label: '姓名', type: 'input' }],
        },
      });

      expect(wrapper.find('.slot-666').exists()).toBe(false);
      expect(wrapper.find('.slot-777').exists()).toBe(false); // 默认插槽不生效

      wrapper.setProps({
        fields: [{
          field: 'name',
          label: '姓名',
          type: 'input',
          componentSlots: {
            suffix: () => h('div', { class: 'slot-666' }),
            default: () => h('div', { class: 'slot-777' }),
          },
        }],
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.find('.slot-666').exists()).toBe(true);
      expect(wrapper.find('.slot-777').exists()).toBe(false); // 默认插槽不生效
    });

    it('类型测试: 不限制插槽方法传参类型, 插槽方法返回值为 VNodeChild', () => {
      type ComponentSlots = NonNullable<AcroDynamicFormField['componentSlots']>;
      type ComponentSlotValue = ValueOf<ComponentSlots>;

      expectTypeOf<Parameters<ComponentSlotValue>>().toEqualTypeOf<any[]>();
      expectTypeOf<ReturnType<ComponentSlotValue>>().toEqualTypeOf<VNodeChild>();
    });
  });

  describe('formItemProps', () => {
    it('使用 formItemProps 可传递参数给 a-form-item 组件', async () => {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: defineAcroDynamicFormFields([{ field: 'name', label: '姓名', type: 'input' }]),
        },
      });

      expect(wrapper.find('.test-666').exists()).toBe(false);

      await wrapper.setProps({
        fields: defineAcroDynamicFormFields([{
          field: 'name',
          label: '姓名',
          type: 'input',
          formItemProps: {
            class: 'test-666',
          },
        }]),
      });

      expect(wrapper.find('.test-666').exists()).toBe(true);
    });

    describe('已排除的字段', () => {
      it('传递的 field,label,rules,validateTrigger 不会覆盖表单项配置中的对应字段', async () => {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            fields: [{
              field: 'name',
              label: '姓名',
              type: 'input',
              rules: [{ required: true }],
              validateTrigger: 'blur',
            }],
          },
        });

        expect(wrapper.find('.arco-form-item-wrapper-col').attributes('id')).toBe('name');
        expect(wrapper.find('.arco-form-item-label').text()).toBe('姓名');
        expect(wrapper.find('.arco-form-item-label-required-symbol').exists()).toBe(true);

        expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);
        await wrapper.find('.arco-input').trigger('blur');
        expect(wrapper.find('.arco-form-item-message').exists()).toBe(true);

        wrapper.vm.reset();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);

        // 同时存在时, 以表单项配置为准

        await wrapper.setProps({
          fields: [{
            field: 'name',
            label: '姓名',
            type: 'input',
            rules: [{ required: true }],
            validateTrigger: 'blur', // @ts-expect-error
            formItemProps: { field: 'name-666', label: '姓名-666', rules: [{ required: true }], validateTrigger: 'change' },
          }],
        });

        expect(wrapper.find('.arco-form-item-wrapper-col').attributes('id')).toBe('name');
        expect(wrapper.find('.arco-form-item-label').text()).toBe('姓名');
        expect(wrapper.find('.arco-form-item-label-required-symbol').exists()).toBe(true);

        expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);
        await wrapper.find('.arco-input').trigger('blur');
        expect(wrapper.find('.arco-form-item-message').exists()).toBe(true);

        wrapper.vm.reset();
        await wrapper.vm.$nextTick();
        expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);

        // 单独在 formItemProps 中配置, 不会生效

        await wrapper.setProps({
          fields: [{
            type: 'input', // @ts-expect-error
            formItemProps: { field: 'name-666', label: '姓名-666', rules: [{ required: true }], validateTrigger: 'change' },
          }],
        });

        expect(wrapper.find('.arco-form-item-wrapper-col').attributes('id')).toBe(undefined);
        expect(wrapper.find('.arco-form-item-label').text()).toBe('');
        expect(wrapper.find('.arco-form-item-label-required-symbol').exists()).toBe(false);

        expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);
        await wrapper.find('.arco-input').trigger('blur');
        expect(wrapper.find('.arco-form-item-message').exists()).toBe(false);
      });

      it('类型测试: 已排除 field,label,rules,validateTrigger 字段', () => {
        expectTypeOf<StringKeyOf<NonNullable<AcroDynamicFormField['formItemProps']>>>().not.toEqualTypeOf<StringKeyOf<FormItemInstance['$props']>>();
        expectTypeOf<
          StringKeyOf<NonNullable<AcroDynamicFormField['formItemProps']>> | 'field' | 'label' | 'rules' | 'validateTrigger'
        >().toEqualTypeOf<
          StringKeyOf<FormItemInstance['$props']>
        >();
      });
    });
  });

  describe('formItemSlots', () => {
    it('使用 formItemSlots 可传递插槽给 a-form-item 组件', async () => {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: [{ field: 'name', label: '姓名', type: 'input' }],
        },
      });

      expect(wrapper.find('.arco-form-item-label > .slot-666').exists()).toBe(false);
      expect(wrapper.find('.arco-form-item-message-help > .slot-777').exists()).toBe(false);
      expect(wrapper.find('.arco-form-item-extra > .slot-888').exists()).toBe(false);
      expect(wrapper.find('.slot-999').exists()).toBe(false); // 默认插槽不生效

      await wrapper.setProps({
        fields: [{
          field: 'name',
          label: '姓名',
          type: 'input',
          formItemSlots: {
            label: () => h('div', { class: 'slot-666' }),
            help: () => h('div', { class: 'slot-777' }),
            extra: () => h('div', { class: 'slot-888' }),
            default: () => h('div', { class: 'slot-999' }),
          },
        }],
      });

      expect(wrapper.find('.arco-form-item-label > .slot-666').exists()).toBe(true);
      expect(wrapper.find('.arco-form-item-message-help > .slot-777').exists()).toBe(true);
      expect(wrapper.find('.arco-form-item-extra > .slot-888').exists()).toBe(true);
      expect(wrapper.find('.slot-999').exists()).toBe(false); // 默认插槽不生效
    });

    it('类型测试: 不限制插槽方法传参类型, 插槽方法返回值为 VNodeChild', () => {
      type FormItemSlots = NonNullable<AcroDynamicFormField['formItemSlots']>;
      type FormItemSlotValue = ValueOf<FormItemSlots>;

      expectTypeOf<Parameters<NonNullable<FormItemSlotValue>>>().toEqualTypeOf<any[]>();
      expectTypeOf<ReturnType<NonNullable<FormItemSlotValue>>>().toEqualTypeOf<VNodeChild>();
    });
  });
});

describe('<acro-dynamic-form /> 导出方法及对象', () => {
  describe('methods', () => {
    it('组件导出的 a-form 组件本身的方法', () => {
      const wrapper = mount(AcroDynamicForm);

      // 校验全部表单数据
      expect(wrapper.vm.validate).toBeInstanceOf(Function);
      // 校验部分表单数据
      expect(wrapper.vm.validateField).toBeInstanceOf(Function);
      // 重置表单数据
      expect(wrapper.vm.resetFields).toBeInstanceOf(Function);
      // 清除校验状态
      expect(wrapper.vm.clearValidate).toBeInstanceOf(Function);
      // 设置表单项的值和状态
      expect(wrapper.vm.setFields).toBeInstanceOf(Function);
      // 滚动到指定表单项
      expect(wrapper.vm.scrollToField).toBeInstanceOf(Function);
    });

    it('组件导出的额外扩展方法', () => {
      const wrapper = mount(AcroDynamicForm);

      // 重置表单数据, 是 `resetFields` 方法的别名
      expect(wrapper.vm.reset).toBeInstanceOf(Function);
      expect(wrapper.vm.reset).toBe(wrapper.vm.resetFields);
    });
  });

  describe('data', () => {
    it('组件导出的 model 为收集的表单数据, 也可对值进行修改', async () => {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          fields: defineAcroDynamicFormFields([
            { field: 'name', label: '姓名', type: 'input' },
            { field: 'age', label: '年龄', type: 'input' },
          ]),
        },
      });

      expect(wrapper.vm.model).toStrictEqual({});

      const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];

      await nameInput.setValue('张三');
      await ageInput.setValue('18');

      expect(wrapper.vm.model).toStrictEqual({ name: '张三', age: '18' });

      wrapper.vm.model.name = '李四';
      wrapper.vm.model.age = '20';

      await wrapper.vm.$nextTick();

      expect(nameInput.element.value).toBe('李四');
      expect(ageInput.element.value).toBe('20');
    });

    it('若组件传入 model 参数, 那么组件内定义的 model 传入的参数, 但是会重新包装一下', () => {
      const model = reactive<Record<string, any>>({ name: '张三' });

      const wrapper = mount(AcroDynamicForm, {
        props: {
          model,
          fields: defineAcroDynamicFormFields([
            { field: 'age', label: '年龄', type: 'input' },
          ]),
        },
      });

      expect(model).toStrictEqual(wrapper.vm.model);
      expect(model).not.toBe(wrapper.vm.model);

      // 修改已有的值

      model.name = '李四';
      expect(wrapper.vm.model.name).toBe('李四');

      wrapper.vm.model.name = '王五';
      expect(model.name).toBe('王五');

      // 新增值

      wrapper.vm.model.age = '20';
      expect(model.age).toBe('20');

      model.age = '22';
      expect(wrapper.vm.model.age).toBe('22');
    });
  });
});

describe('<acro-dynamic-form /> 事件', () => {
  it('点击提交按钮, 会触发 submit 事件', async () => {
    let submitData: Record<string, any> = {};
    let submitCount = 0;

    function handleSubmit(model: Record<string, any>) {
      submitData = model;
      submitCount++;
    }

    const wrapper = mount(AcroDynamicForm, {
      props: {
        fields: [
          { field: 'name', label: '姓名', type: 'input' },
          { field: 'age', label: '年龄', type: 'input' },
        ],
        onSubmit: handleSubmit,
      },
    });

    const [nameInput, ageInput] = wrapper.findAll('.arco-input') as [DOMWrapper<HTMLInputElement>, DOMWrapper<HTMLInputElement>];
    const submitBtn = wrapper.findAll('.arco-btn').find(btn => btn.text() === '提交')!;

    expect(submitCount).toBe(0);
    expect(submitData).toStrictEqual({});

    submitBtn.trigger('click');
    expect(submitCount).toBe(1);
    expect(submitData).toStrictEqual({});

    await nameInput.setValue('张三');
    await ageInput.setValue('18');

    submitBtn.trigger('click');
    expect(submitCount).toBe(2);
    expect(submitData).toStrictEqual({ name: '张三', age: '18' });
  });

  it('点击重置按钮, 会触发 reset 事件', async () => {
    let resetCount = 0;

    function handleReset() {
      resetCount++;
    }

    const wrapper = mount(AcroDynamicForm, {
      props: {
        onReset: handleReset,
      },
    });

    const resetBtn = wrapper.findAll('.arco-btn').find(btn => btn.text() === '重置')!;

    expect(resetCount).toBe(0);

    resetBtn.trigger('click');

    expect(resetCount).toBe(1);

    resetBtn.trigger('click');

    expect(resetCount).toBe(2);
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

  it('配置不显示操作按钮区域, a-form-item 及提交按钮、重置按钮不会渲染', () => {
    // boolean 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          actionButtonArea: false,
        },
      });

      const formItems = wrapper.findAll('.arco-form-item');
      const btns = wrapper.findAll('.arco-btn');

      expect(formItems.length).toBe(0);
      expect(btns.length).toBe(0);
    }

    // options 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          actionButtonArea: { show: false },
        },
      });

      const formItems = wrapper.findAll('.arco-form-item');
      const btns = wrapper.findAll('.arco-btn');

      expect(formItems.length).toBe(0);
      expect(btns.length).toBe(0);
    }
  });

  it('配置不显示提交按钮', () => {
    // boolean 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          submitButton: false,
        },
      });

      const btns = wrapper.findAll('.arco-form-item .arco-btn');

      expect(btns.length).toBe(1);
      expect(btns[0].text()).toBe('重置');
    }

    // options 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          submitButton: { show: false },
        },
      });

      const btns = wrapper.findAll('.arco-form-item .arco-btn');

      expect(btns.length).toBe(1);
      expect(btns[0].text()).toBe('重置');
    }
  });

  it('配置不显示重置按钮', () => {
    // boolean 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          resetButton: false,
        },
      });

      const btns = wrapper.findAll('.arco-form-item .arco-btn');

      expect(btns.length).toBe(1);
      expect(btns[0].text()).toBe('提交');
    }

    // options 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          resetButton: { show: false },
        },
      });

      const btns = wrapper.findAll('.arco-form-item .arco-btn');

      expect(btns.length).toBe(1);
      expect(btns[0].text()).toBe('提交');
    }
  });

  it('配置提交按钮和重置按钮都不显示时, a-form-item 也不会渲染', () => {
    // boolean 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          submitButton: false,
          resetButton: false,
        },
      });

      expect(wrapper.findAll('.arco-form-item').length).toBe(0);
    }

    // options 传值
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          submitButton: { show: false },
          resetButton: { show: false },
        },
      });

      expect(wrapper.findAll('.arco-form-item').length).toBe(0);
    }
  });

  it('配置提交按钮和重置按钮的文字', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        submitButton: { text: '自定义提交' },
        resetButton: { text: '自定义重置' },
      },
    });

    const btns = wrapper.findAll('.arco-form-item .arco-btn');

    expect(btns.length).toBe(2);
    expect(btns[0].text()).toBe('自定义提交');
    expect(btns[1].text()).toBe('自定义重置');
  });

  it('配置操作按钮区域 FormItem 组件的参数', () => {
    // 不传值情况下
    {
      const wrapper = mount(AcroDynamicForm);
      const formItem = wrapper.find('.arco-form-item');

      expect(formItem.exists()).toBe(true);
      expect(formItem.classes()).not.includes('arco-form-item-status-success');
    }

    // 传值情况下
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          actionButtonArea: {
            props: { validateStatus: 'success' },
          },
        },
      });
      const formItem = wrapper.find('.arco-form-item');

      expect(formItem.exists()).toBe(true);
      expect(formItem.classes()).includes('arco-form-item-status-success');
    }
  });

  it('传递给操作按钮区域 Space 组件的参数', () => {
    // 不传值情况下
    {
      const wrapper = mount(AcroDynamicForm);
      const space = wrapper.find('.arco-space');

      expect(space.exists()).toBe(true);
      expect(space.classes()).includes('arco-space-horizontal');
      expect(space.classes()).not.includes('arco-space-vertical');
    }

    // 传值情况下
    {
      const wrapper = mount(AcroDynamicForm, {
        props: {
          actionButtonArea: {
            spaceProps: { direction: 'vertical' },
          },
        },
      });

      const space = wrapper.find('.arco-space');

      expect(space.exists()).toBe(true);
      expect(space.classes()).not.includes('arco-space-horizontal');
      expect(space.classes()).includes('arco-space-vertical');
    }
  });

  it('配置提交按钮组件的参数', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        submitButton: {
          props: { size: 'mini' },
        },
      },
    });

    const submitBtn = wrapper.find('.arco-btn.arco-btn-size-mini');

    expect(submitBtn.exists()).toBe(true);
    expect(submitBtn.text()).toBe('提交');
  });

  it('配置重置按钮组件的参数', () => {
    const wrapper = mount(AcroDynamicForm, {
      props: {
        resetButton: {
          props: { size: 'mini' },
        },
      },
    });

    const resetBtn = wrapper.find('.arco-btn.arco-btn-size-mini');

    expect(resetBtn.exists()).toBe(true);
    expect(resetBtn.text()).toBe('重置');
  });

  describe('操作按钮区域插槽, 及按钮前后置插槽', () => {
    it('支持传入 actionButtonArea 插槽, 可使用该插槽代替操作按钮区域的渲染', () => {
      const wrapper = mount(AcroDynamicForm, {
        slots: {
          actionButtonArea: () => h('div', { class: 'slot-666' }),
        },
      });

      expect(wrapper.findAll('.arco-form-item').length).toBe(0);
      expect(wrapper.find('.slot-666').exists()).toBe(true);
    });

    it('支持传入 actionButtonPrepend 插槽, 可插入内容到提交按钮前面', () => {
      const wrapper = mount(AcroDynamicForm, {
        slots: {
          actionButtonPrepend: () => h(Button, {}, '前置按钮'),
        },
      });

      const btns = wrapper.findAll('.arco-form-item .arco-btn');

      expect(btns.length).toBe(3);
      expect(btns[0].text()).toBe('前置按钮');
      expect(btns[1].text()).toBe('提交');
      expect(btns[2].text()).toBe('重置');
    });

    it('支持传入 actionButtonAppend 插槽, 可插入内容到重置按钮后面', () => {
      const wrapper = mount(AcroDynamicForm, {
        slots: {
          actionButtonAppend: () => h(Button, {}, '后置按钮'),
        },
      });

      const btns = wrapper.findAll('.arco-form-item .arco-btn');

      expect(btns.length).toBe(3);
      expect(btns[0].text()).toBe('提交');
      expect(btns[1].text()).toBe('重置');
      expect(btns[2].text()).toBe('后置按钮');
    });

    it('配置提交按钮和重置按钮都不显示时, 只传入 actionButtonPrepend 和 actionButtonAppend 插槽, a-form-item 也会渲染', () => {
      // actionButtonPrepend
      {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            submitButton: false,
            resetButton: false,
          },
          slots: {
            actionButtonPrepend: () => h(Button, {}, '前置按钮'),
          },
        });

        const formItems = wrapper.findAll('.arco-form-item');
        const btns = wrapper.findAll('.arco-form-item .arco-btn');

        expect(formItems.length).toBe(1);
        expect(btns.length).toBe(1);
        expect(btns[0].text()).toBe('前置按钮');
      }

      // actionButtonAppend
      {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            submitButton: false,
            resetButton: false,
          },
          slots: {
            actionButtonAppend: () => h(Button, {}, '后置按钮'),
          },
        });

        const formItems = wrapper.findAll('.arco-form-item');
        const btns = wrapper.findAll('.arco-form-item .arco-btn');

        expect(formItems.length).toBe(1);
        expect(btns.length).toBe(1);
        expect(btns[0].text()).toBe('后置按钮');
      }

      // actionButtonPrepend & actionButtonAppend
      {
        const wrapper = mount(AcroDynamicForm, {
          props: {
            submitButton: false,
            resetButton: false,
          },
          slots: {
            actionButtonPrepend: () => h(Button, {}, '前置按钮'),
            actionButtonAppend: () => h(Button, {}, '后置按钮'),
          },
        });

        const formItems = wrapper.findAll('.arco-form-item');
        const btns = wrapper.findAll('.arco-form-item .arco-btn');

        expect(formItems.length).toBe(1);
        expect(btns.length).toBe(2);
        expect(btns[0].text()).toBe('前置按钮');
        expect(btns[1].text()).toBe('后置按钮');
      }
    });

    it('当使用 actionButtonArea 插槽时, actionButtonPrepend 和 actionButtonAppend 插槽不生效', () => {
      const wrapper = mount(AcroDynamicForm, {
        slots: {
          actionButtonArea: () => h('div', { class: 'slot-666' }),
          actionButtonPrepend: () => h(Button, {}, '前置按钮'),
          actionButtonAppend: () => h(Button, {}, '后置按钮'),
        },
      });

      expect(wrapper.findAll('.arco-form-item').length).toBe(0);
      expect(wrapper.find('.slot-666').exists()).toBe(true);
    });
  });
});

describe('导出的工具方法', () => {
  describe('defineAcroDynamicFormField', () => {
    it('方法原样返回传入的字段配置', () => {
      const field = { field: 'name', label: '姓名', type: 'input' };
      const fieldClone = deepClone(field);

      expect(defineAcroDynamicFormField(field)).toBe(field);
      expect(defineAcroDynamicFormField(field)).toStrictEqual(fieldClone);
    });

    it('类型测试: 用于定义单个字段配置', () => {
      expectTypeOf<Parameters<typeof defineAcroDynamicFormField>>().toEqualTypeOf<[AcroDynamicFormField]>();
      expectTypeOf<ReturnType<typeof defineAcroDynamicFormField>>().toEqualTypeOf<AcroDynamicFormField>();
    });
  });

  describe('defineAcroDynamicFormFields', () => {
    it('方法原样返回传入的字段配置数组', () => {
      const fields = [
        { field: 'name', label: '姓名', type: 'input' },
        { field: 'age', label: '年龄', type: 'input-number' },
      ];
      const fieldsClone = deepClone(fields);

      expect(defineAcroDynamicFormFields(fields)).toBe(fields);
      expect(defineAcroDynamicFormFields(fields)).toStrictEqual(fieldsClone);
    });

    it('类型测试: 用于定义多个字段配置', () => {
      expectTypeOf<Parameters<typeof defineAcroDynamicFormFields>>().toEqualTypeOf<[AcroDynamicFormField[]]>();
      expectTypeOf<ReturnType<typeof defineAcroDynamicFormFields>>().toEqualTypeOf<AcroDynamicFormField[]>();
    });
  });

  describe('defineAcroDynamicFormPreset', () => {
    it('方法返回值为一个 Symbol, 并且多个方法不会返回一样的 Symbol', () => {
      const preset1 = defineAcroDynamicFormPreset(() => {});
      const preset2 = defineAcroDynamicFormPreset(() => {});

      expect(typeof preset1).toBe('symbol');
      expect(typeof preset2).toBe('symbol');
      expect(preset1).not.toBe(preset2);
    });

    it('类型测试: 方法传参为一个方法, 返回值为 Symbol', () => {
      expectTypeOf<Parameters<typeof defineAcroDynamicFormPreset>>().toEqualTypeOf<[
        (form: {
          defineFormConfig: (config: AcroDynamicFormProps) => void;
          defineFieldsConfig: (fields: AcroDynamicFormField[]) => void;
        }) => void,
      ]>();
      expectTypeOf<ReturnType<typeof defineAcroDynamicFormPreset>>().toEqualTypeOf<symbol>();
    });
  });
});
