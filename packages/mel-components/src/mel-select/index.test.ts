import type { MelSelectOption } from './src/types';
import { MelSelect } from '@mixte/mel-components/mel-select';
import { mount } from '@vue/test-utils';
import * as cheerio from 'cheerio';
import { ElOption, ElSelect } from 'element-plus';
import { delay } from 'mixte';

function removeUnusedAttribute(html: string) {
  const $ = cheerio.load(html);

  $('*').each((_, el) => {
    const $el = $(el);

    $el.removeAttr('id');
    $el.removeAttr('tabindex');

    $el.css('z-index') && $el.css('z-index', '');

    Object.keys($el.attr()!).forEach((key) => {
      key.startsWith('aria-') && $el.removeAttr(key);
    });
  });

  return $.html();
}

async function getOptions() {
  await delay(100);
  return [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }];
}
async function getOptions2() {
  await delay(100);
  return {
    data: [{ label: 'Option 3', value: '3' }, { label: 'Option 4', value: '4' }],
  };
}
async function getOptions3() {
  await delay(100);
  return {
    data: {
      data: [{ label: 'Option 5', value: '5' }, { label: 'Option 6', value: '6' }],
    },
  };
}

const optionsLabels = new Map<() => Promise<any>, string[]>();

optionsLabels.set(getOptions, ['Option 1', 'Option 2']);
optionsLabels.set(getOptions2, ['Option 3', 'Option 4']);
optionsLabels.set(getOptions3, ['Option 5', 'Option 6']);

describe('mel-select', () => {
  it('正常使用, 和原组件 DOM 结构一致', async () => {
    // 空组件
    {
      const mel = mount(MelSelect);
      const el = mount(ElSelect);

      expect(removeUnusedAttribute(el.html())).toBe(removeUnusedAttribute(mel.html()));
    }

    // 使用默认插槽渲染 options
    {
      const defaultOptionsSlot = () => [
        h(ElOption, { value: '1', label: '1' }),
        h(ElOption, { value: '2' }, {
          default: () => '2',
        }),
      ];

      const mel = mount(MelSelect, {
        props: { teleported: false },
        slots: { default: defaultOptionsSlot },
      });
      const el = mount(ElSelect, {
        props: { teleported: false },
        slots: { default: defaultOptionsSlot },
      });

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(2);
      expect(options[0].text()).toBe('1');
      expect(options[1].text()).toBe('2');
      expect(removeUnusedAttribute(el.html())).toBe(removeUnusedAttribute(mel.html()));
    }
  });

  describe('新增参数: options', () => {
    it('传入 options 以渲染选项', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [{ label: '1', value: '2' }, { label: '2', value: '2' }],
        },
      });
      const el = mount(ElSelect, {
        props: { teleported: false },
        slots: {
          default: () => [
            h(ElOption, { value: '1', label: '1' }),
            h(ElOption, { value: '2', label: '2' }),
          ],
        },
      });

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(2);
      expect(options[0].text()).toBe('1');
      expect(options[1].text()).toBe('2');
      expect(removeUnusedAttribute(el.html())).toBe(removeUnusedAttribute(mel.html()));
    });

    it('传入 options 以渲染选项, 支持禁用', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [{ label: '1', value: '2', disabled: true }, { label: '2', value: '2' }],
        },
      });
      const el = mount(ElSelect, {
        props: { teleported: false },
        slots: {
          default: () => [
            h(ElOption, { value: '1', label: '1', disabled: true }),
            h(ElOption, { value: '2', label: '2' }),
          ],
        },
      });

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(2);
      expect(options[0].text()).toBe('1');
      expect(options[0].classes()).toContain('is-disabled');
      expect(options[1].text()).toBe('2');
      expect(removeUnusedAttribute(el.html())).toBe(removeUnusedAttribute(mel.html()));
    });

    it('支持通过 render 自定义渲染选项', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [
            {
              label: '选项1',
              value: '1',
              render: (option: MelSelectOption) => (
                h(ElOption, { value: option.value }, {
                  default: () => (
                    h('div', { class: 'custom-option' }, [
                      h('span', { class: 'prefix' }, '前缀-'),
                      h('span', { class: 'label' }, option.label),
                      h('span', { class: 'value' }, `(${option.value})`),
                    ])
                  ),
                })
              ),
            },
            {
              label: '选项2',
              value: '2',
              render: (option: MelSelectOption) => (
                h(ElOption, { value: option.value }, {
                  default: () => h('div', { class: 'custom-option highlight' }, option.label),
                })
              ),
            },
            {
              label: '选项3',
              value: '3',
            },
          ],
        },
      });

      const options = mel.findAll('.el-select-dropdown__item');
      expect(options.length).toBe(3);

      const option1 = options[0];
      expect(option1.find('.custom-option').exists()).toBe(true);
      expect(option1.find('.prefix').text()).toBe('前缀-');
      expect(option1.find('.label').text()).toBe('选项1');
      expect(option1.find('.value').text()).toBe('(1)');

      const option2 = options[1];
      expect(option2.find('.custom-option').exists()).toBe(true);
      expect(option2.find('.custom-option').classes()).toContain('highlight');
      expect(option2.text()).toBe('选项2');

      const option3 = options[2];
      expect(option3.find('.custom-option').exists()).toBe(false);
      expect(option3.text()).toBe('选项3');
    });
  });

  describe('新增参数: optionsApi', () => {
    it('传入方法给 optionsApi 参数请求选项数据', async () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          optionsApi: getOptions,
        },
      });

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
      expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
      expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);

      await delay(100);

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(2);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
    });

    it('对象形式传入方法给 optionsApi 参数请求选项数据', async () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          optionsApi: {
            api: getOptions,
          },
        },
      });

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
      expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
      expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);

      await delay(100);

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(2);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
    });

    it('配置不立即请求', async () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          optionsApi: {
            api: getOptions,
            immediate: false,
          },
        },
      });

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
      expect(mel.find('.el-select-dropdown__empty').text()).toBe('No data');

      mel.vm.api.execute();
      await nextTick();

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
      expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');

      await delay(100);

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(2);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
    });

    it('支持更深层次的数据返回', async () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
        },
      });

      for (const [api, labels] of optionsLabels.entries()) {
        await mel.setProps({
          optionsApi: api,
        });

        mel.vm.api.reset();
        mel.vm.api.execute();
        await nextTick();

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
        expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
        expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);

        await delay(100);

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);

        const options = mel.findAll('.el-select-dropdown__item');

        expect(options.length).toBe(labels.length);
        expect(options[0].text()).toBe(labels[0]);
        expect(options[1].text()).toBe(labels[1]);
      }
    });
  });

  describe('新增插槽: option', () => {
    it('支持通过 option 插槽自定义渲染选项, render 属性优先级高于 option 插槽', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [
            {
              label: '选项1',
              value: '1',
              render: (option: MelSelectOption) => (
                h(ElOption, { value: option.value }, {
                  default: () => h('div', { class: 'render-option' }, `Render方式-${option.label}`),
                })
              ),
            },
            {
              label: '选项2',
              value: '2',
              // 这个选项没有 render 方法，应该使用 option 插槽
            },
          ],
        },
        slots: {
          option: (option: MelSelectOption) => (
            h(ElOption, { value: option.value }, {
              default: () => h('div', { class: 'slot-option' }, `Slot方式-${option.label}`),
            })
          ),
        },
      });

      const options = mel.findAll('.el-select-dropdown__item');
      expect(options.length).toBe(2);

      // 第一个选项应该使用 render 方法
      const option1 = options[0];
      expect(option1.find('.render-option').exists()).toBe(true);
      expect(option1.find('.slot-option').exists()).toBe(false);
      expect(option1.text()).toBe('Render方式-选项1');

      // 第二个选项应该使用 option 插槽
      const option2 = options[1];
      expect(option2.find('.render-option').exists()).toBe(false);
      expect(option2.find('.slot-option').exists()).toBe(true);
      expect(option2.text()).toBe('Slot方式-选项2');
    });
  });

  describe('新增插槽: option-label', () => {
    it('支持通过 option-label 插槽自定义渲染选项内容', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
          ],
        },
        slots: {
          'option-label': (option: MelSelectOption) => (
            h('div', { class: 'custom-label' }, `自定义内容-${option.label}`)
          ),
        },
      });

      const options = mel.findAll('.el-select-dropdown__item');
      expect(options.length).toBe(2);

      // 应该使用 option-label 插槽
      expect(options[0].find('.custom-label').exists()).toBe(true);
      expect(options[0].text()).toBe('自定义内容-选项1');
      expect(options[1].find('.custom-label').exists()).toBe(true);
      expect(options[1].text()).toBe('自定义内容-选项2');
    });
  });

  describe('新增插槽: all-label', () => {
    it('功能一: 通过 all-label 插槽自定义标签, 和 label 插槽作用一致', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [{ label: '选项1', value: '1' }],
          modelValue: '1',
        },
        slots: {
          'all-label': () => '自定义标签 all-label',
        },
      });

      const mel2 = mount(MelSelect, {
        props: {
          teleported: false,
          options: [{ label: '选项1', value: '1' }],
          modelValue: '1',
        },
        slots: {
          label: () => '自定义标签 label',
        },
      });

      expect(mel.find('.el-select__placeholder').text()).toBe('自定义标签 all-label');
      expect(mel2.find('.el-select__placeholder').text()).toBe('自定义标签 label');
    });

    it('功能二: 通过 all-label 插槽自定义标签, 和 option-label 插槽作用一致', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
          ],
        },
        slots: {
          'all-label': (option: MelSelectOption) => (
            h('div', { class: 'custom-label' }, `自定义内容-${option.label}`)
          ),
        },
      });

      const options = mel.findAll('.el-select-dropdown__item');
      expect(options.length).toBe(2);

      // 应该使用 all-label 插槽
      expect(options[0].find('.custom-label').exists()).toBe(true);
      expect(options[0].text()).toBe('自定义内容-选项1');
      expect(options[1].find('.custom-label').exists()).toBe(true);
      expect(options[1].text()).toBe('自定义内容-选项2');
    });

    it('all-label 插槽优先级低于 label 插槽', () => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: [{ label: '选项1', value: '1' }],
          modelValue: '1',
        },
        slots: {
          'all-label': () => '自定义标签 all-label',
          'label': () => '自定义标签 label',
        },
      });

      expect(mel.find('.el-select__placeholder').text()).toBe('自定义标签 label');
    });
  });
});
