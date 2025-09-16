import type { MelSelectOption } from './src/types';
import { MelSelect } from '@mixte/mel-components/mel-select';
import { mount } from '@vue/test-utils';
import * as cheerio from 'cheerio';
import { ElOption, ElSelect } from 'element-plus';
import { deepClone, delay } from 'mixte';

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

const options = [{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }, { label: 'Option 12', value: '12' }];
const options2 = [{ label: 'Option 3', value: '3' }, { label: 'Option 4', value: '4' }];
const options3 = [{ label: 'Option 5', value: '5' }, { label: 'Option 6', value: '6' }];

const getOptions = vi.fn(async ({ name }: { name?: string }) => {
  await delay(100);
  return deepClone(options).filter(item => !name || item.label.includes(name));
});

const getOptions2 = vi.fn(async ({ name }: { name?: string }) => {
  await delay(100);
  return {
    data: deepClone(options2).filter(item => !name || item.label.includes(name)),
  };
});

const getOptions3 = vi.fn(async ({ name }: { name?: string }) => {
  await delay(100);
  return {
    data: {
      data: deepClone(options3).filter(item => !name || item.label.includes(name)),
    },
  };
});

const optionsLabels = new Map<(...args: any[]) => Promise<any>, string[]>();

optionsLabels.set(getOptions, options.map(item => item.label));
optionsLabels.set(getOptions2, options2.map(item => item.label));
optionsLabels.set(getOptions3, options3.map(item => item.label));

beforeEach(() => {
  vi.useFakeTimers();
  getOptions.mockReset();
  getOptions2.mockReset();
  getOptions3.mockReset();
});
afterEach(() => {
  vi.useRealTimers();
});

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
    it.each([
      [
        '传入 `options` 以渲染选项',
        [{ label: '1', value: '2' }, { label: '2', value: '2' }],
      ],
      [
        '传入 `() => options` 以渲染选项',
        () => [{ label: '1', value: '2' }, { label: '2', value: '2' }],
      ],
      [
        '传入 `ref(options)` 以渲染选项',
        ref([{ label: '1', value: '2' }, { label: '2', value: '2' }]),
      ],
    ])('%s', (_, _options) => {
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          options: _options,
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
      expect(getOptions).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(100);

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
      expect(getOptions).toHaveBeenCalledTimes(1);

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(3);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
      expect(options[2].text()).toBe('Option 12');
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
      expect(getOptions).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(100);

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
      expect(getOptions).toHaveBeenCalledTimes(1);

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(3);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
      expect(options[2].text()).toBe('Option 12');
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
      expect(getOptions).toHaveBeenCalledTimes(0);

      mel.vm.api.execute();
      await nextTick();

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
      expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
      expect(getOptions).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(100);

      expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
      expect(getOptions).toHaveBeenCalledTimes(1);

      const options = mel.findAll('.el-select-dropdown__item');

      expect(options.length).toBe(3);
      expect(options[0].text()).toBe('Option 1');
      expect(options[1].text()).toBe('Option 2');
      expect(options[2].text()).toBe('Option 12');
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
        expect(api).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(100);

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
        expect(api).toHaveBeenCalledTimes(1);

        const options = mel.findAll('.el-select-dropdown__item');

        expect(options.length).toBe(labels.length);
        expect(options[0].text()).toBe(labels[0]);
        expect(options[1].text()).toBe(labels[1]);
      }
    });

    describe('配置请求参数', () => {
      it('会传递给 api 方法', async () => {
        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            optionsApi: {
              api: getOptions,
              params: { a: 1, b: 2 },
            },
          },
        });

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
        expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
        expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
        expect(getOptions).toHaveBeenCalledTimes(1);
        expect(getOptions).toHaveBeenCalledWith({ a: 1, b: 2 });

        await vi.advanceTimersByTimeAsync(100);

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
        expect(getOptions).toHaveBeenCalledTimes(1);

        const options = mel.findAll('.el-select-dropdown__item');

        expect(options.length).toBe(3);
        expect(options[0].text()).toBe('Option 1');
        expect(options[1].text()).toBe('Option 2');
        expect(options[2].text()).toBe('Option 12');
      });

      it('返回数组不会认为是 iterator, 而是直接传入', async () => {
        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            optionsApi: {
              api: getOptions,
              params: [{ a: 1, b: 2 }],
            },
          },
        });

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
        expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
        expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
        expect(getOptions).toHaveBeenCalledTimes(1);
        expect(getOptions).toHaveBeenCalledWith([{ a: 1, b: 2 }]);

        await vi.advanceTimersByTimeAsync(100);

        expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
        expect(getOptions).toHaveBeenCalledTimes(1);

        const options = mel.findAll('.el-select-dropdown__item');

        expect(options.length).toBe(3);
        expect(options[0].text()).toBe('Option 1');
        expect(options[1].text()).toBe('Option 2');
        expect(options[2].text()).toBe('Option 12');
      });

      it('支持传入函数, 返回请求参数, 变化时会重新请求', async () => {
        const index = ref(1);

        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            optionsApi: {
              api: getOptions,
              params: () => ({ a: index.value, b: index.value + 1 }),
            },
          },
        });

        {
          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
          expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
          expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
          expect(getOptions).toHaveBeenCalledTimes(1);
          expect(getOptions).toHaveBeenCalledWith({ a: 1, b: 2 });

          await vi.advanceTimersByTimeAsync(100);

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(1);

          const options = mel.findAll('.el-select-dropdown__item');

          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }

        {
          index.value = 2;

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(1);

          await nextTick();

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
          expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
          expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
          expect(getOptions).toHaveBeenCalledTimes(2);
          expect(getOptions).toHaveBeenCalledWith({ a: 2, b: 3 });

          await vi.advanceTimersByTimeAsync(100);

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(2);

          const options = mel.findAll('.el-select-dropdown__item');
          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }

        {
          index.value = 3;

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(2);

          await nextTick();

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
          expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
          expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
          expect(getOptions).toHaveBeenCalledTimes(3);
          expect(getOptions).toHaveBeenCalledWith({ a: 3, b: 4 });

          await vi.advanceTimersByTimeAsync(100);

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(3);

          const options = mel.findAll('.el-select-dropdown__item');
          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }
      });

      it('支持传入 MaybeRef 对象, 变化时会重新请求', async () => {
        const index = ref(1);

        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            optionsApi: {
              api: getOptions,
              params: computed(() => ({ a: index.value, b: index.value + 1 })),
            },
          },
        });

        {
          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
          expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
          expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
          expect(getOptions).toHaveBeenCalledTimes(1);
          expect(getOptions).toHaveBeenCalledWith({ a: 1, b: 2 });

          await vi.advanceTimersByTimeAsync(100);

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(1);

          const options = mel.findAll('.el-select-dropdown__item');

          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }

        {
          index.value = 2;

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(1);

          await nextTick();

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
          expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
          expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
          expect(getOptions).toHaveBeenCalledTimes(2);
          expect(getOptions).toHaveBeenCalledWith({ a: 2, b: 3 });

          await vi.advanceTimersByTimeAsync(100);

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(2);

          const options = mel.findAll('.el-select-dropdown__item');
          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }

        {
          index.value = 3;

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(2);

          await nextTick();

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(true);
          expect(mel.find('.el-select-dropdown__empty').text()).toBe('Loading');
          expect(mel.findAll('.el-select-dropdown__item').length).toBe(0);
          expect(getOptions).toHaveBeenCalledTimes(3);
          expect(getOptions).toHaveBeenCalledWith({ a: 3, b: 4 });

          await vi.advanceTimersByTimeAsync(100);

          expect(mel.find('.el-select-dropdown__empty').exists()).toBe(false);
          expect(getOptions).toHaveBeenCalledTimes(3);

          const options = mel.findAll('.el-select-dropdown__item');
          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }
      });
    });

    describe('远程筛选', () => {
      it('正常使用', async () => {
        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            filterable: true,
            remote: true,
            optionsApi: {
              api: getOptions,
              remoteKey: 'name',
            },
          },
        });

        await vi.advanceTimersByTimeAsync(100);

        {
          const options = mel.findAll('.el-select-dropdown__item');

          expect(getOptions).toHaveBeenCalledTimes(1);
          expect(getOptions).toHaveBeenCalledWith({ name: '' });
          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }

        {
          await mel.find('input').setValue('1');
          await vi.advanceTimersByTimeAsync(500);

          const options = mel.findAll('.el-select-dropdown__item');

          expect(getOptions).toHaveBeenCalledTimes(2);
          expect(getOptions).toHaveBeenCalledWith({ name: '1' });
          expect(options.length).toBe(2);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 12');
        }

        {
          await mel.find('input').setValue('2');
          await vi.advanceTimersByTimeAsync(500);

          const options = mel.findAll('.el-select-dropdown__item');

          expect(getOptions).toHaveBeenCalledTimes(3);
          expect(getOptions).toHaveBeenCalledWith({ name: '2' });
          expect(options.length).toBe(2);
          expect(options[0].text()).toBe('Option 2');
          expect(options[1].text()).toBe('Option 12');
        }
      });

      it('配置 remoteKey 但未启用 filterable 和 remote 时不传递关键词', async () => {
        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            optionsApi: {
              api: getOptions,
              remoteKey: 'mixte',
            },
          },
        });

        await vi.advanceTimersByTimeAsync(100);
        expect(getOptions).toHaveBeenCalledTimes(1);
        expect(getOptions).toHaveBeenCalledWith({});

        await mel.setProps({ filterable: true });
        await vi.advanceTimersByTimeAsync(100);
        expect(getOptions).toHaveBeenCalledTimes(1);
        expect(getOptions).toHaveBeenCalledWith({});

        await mel.setProps({ remote: true });
        await vi.advanceTimersByTimeAsync(100);
        expect(getOptions).toHaveBeenCalledTimes(2);
        expect(getOptions).toHaveBeenCalledWith({ mixte: '' });
      });

      it('和 filterOptionMethod 配合使用', async () => {
        const filterValue = ref('');
        const filterOptionMethod = vi.fn((query: string, option: MelSelectOption) => {
          return `${option.label}`.includes(query) && `${option.label}`.includes(filterValue.value);
        });

        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            optionsApi: {
              api: getOptions,
              remoteKey: 'name',
            },
            remote: true,
            filterable: true,
            filterOptionMethod,
          },
        });

        await vi.advanceTimersByTimeAsync(100);

        {
          const options = mel.findAll('.el-select-dropdown__item');

          expect(getOptions).toHaveBeenCalledTimes(1);
          expect(getOptions).toHaveBeenCalledWith({ name: '' });
          expect(filterOptionMethod).toHaveBeenCalledTimes(3);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(3);
          expect(options[0].text()).toBe('Option 1');
          expect(options[1].text()).toBe('Option 2');
          expect(options[2].text()).toBe('Option 12');
        }

        {
          await mel.find('input').setValue('1');
          filterValue.value = '2';
          await vi.advanceTimersByTimeAsync(500);

          const options = mel.findAll('.el-select-dropdown__item');

          expect(getOptions).toHaveBeenCalledTimes(2);
          expect(getOptions).toHaveBeenCalledWith({ name: '1' });
          expect(filterOptionMethod).toHaveBeenCalledTimes(3 + 3 + 2);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(1);
          expect(options[0].text()).toBe('Option 12');
        }

        {
          await mel.find('input').setValue('2');
          await vi.advanceTimersByTimeAsync(500);

          const options = mel.findAll('.el-select-dropdown__item');

          expect(getOptions).toHaveBeenCalledTimes(3);
          expect(getOptions).toHaveBeenCalledWith({ name: '2' });
          expect(filterOptionMethod).toHaveBeenCalledTimes(3 + 3 + 2 + 2);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(2);
          expect(options[0].text()).toBe('Option 2');
          expect(options[1].text()).toBe('Option 12');
        }
      });
    });
  });

  describe('新增参数: filterOptionMethod', () => {
    describe('使用外部关键词进行筛选', () => {
      it.each([
        ['使用 options 参数', { options }, false],
        ['使用 optionsApi 参数', { optionsApi: getOptions }, true],
      ])('%s', async (_, props, isApi) => {
        const filterValue = ref('');
        const filterOptionMethod = vi.fn((query: string, option: MelSelectOption) => {
          return `${option.label}`.includes(query) && `${option.label}`.includes(filterValue.value);
        });

        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            ...props,
            filterOptionMethod,
          },
        });

        isApi && await vi.advanceTimersByTimeAsync(100);

        {
          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(3);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(3);
          expect(options.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        }

        {
          filterValue.value = '1';
          await nextTick();

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(6);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(2);
          expect(options.map(op => op.text())).toStrictEqual(['Option 1', 'Option 12']);
        }

        {
          filterValue.value = '2';
          await nextTick();

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(9);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(2);
          expect(options.map(op => op.text())).toStrictEqual(['Option 2', 'Option 12']);
        }

        {
          filterValue.value = '3';
          await nextTick();

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(12);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(0);
        }

        {
          filterValue.value = '';
          await nextTick();

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(15);

          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(3);
          expect(options.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        }
      });
    });

    describe('使用 `filterable` 时用户输入的关键词进行筛选', () => {
      it.each([
        ['使用 options 参数', { options }, false],
        ['使用 optionsApi 参数', { optionsApi: getOptions }, true],
      ])('%s', async (_, props, isApi) => {
        const filterValue = ref('');
        const filterOptionMethod = vi.fn((query: string, option: MelSelectOption) => {
          return `${option.label}`.includes(query) && `${option.label}`.includes(filterValue.value);
        });

        const mel = mount(MelSelect, {
          props: {
            teleported: false,
            ...props,
            filterable: true,
            filterOptionMethod,
          },
        });

        isApi && await vi.advanceTimersByTimeAsync(100);

        {
          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(3);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(3);
          expect(options.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        }

        {
          await mel.find('input').setValue('1');

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(6);
          expect(filterOptionMethod).toHaveBeenCalledWith('1', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('1', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('1', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(2);
          expect(options.map(op => op.text())).toStrictEqual(['Option 1', 'Option 12']);
        }

        {
          await mel.find('input').setValue('2');

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(9);
          expect(filterOptionMethod).toHaveBeenCalledWith('2', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('2', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('2', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(2);
          expect(options.map(op => op.text())).toStrictEqual(['Option 2', 'Option 12']);
        }

        {
          await mel.find('input').setValue('3');

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(12);
          expect(filterOptionMethod).toHaveBeenCalledWith('3', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('3', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('3', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(0);
        }

        {
          await mel.find('input').setValue('');

          const options = mel.findAll('.el-select-dropdown__item');

          expect(filterOptionMethod).toHaveBeenCalledTimes(15);
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 1', value: '1' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 2', value: '2' });
          expect(filterOptionMethod).toHaveBeenCalledWith('', { label: 'Option 12', value: '12' });
          expect(options.length).toBe(3);
          expect(options.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        }
      });
    });

    it('不使用 filterOptionMethod 时的默认筛选行为和 ElSelect 一致', async () => {
      const el = mount(ElSelect, {
        props: {
          teleported: false,
          filterable: true,
        },
        slots: {
          default: () => options.map(option => h(ElOption, { key: option.value, label: option.label, value: option.value })),
        },
      });
      const mel = mount(MelSelect, {
        props: {
          teleported: false,
          filterable: true,
          options,
        },
      });

      {
        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(3);
        expect(elOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        expect(melOptions.length).toBe(3);
        expect(melOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
      }

      {
        await el.find('input').setValue('1');
        await mel.find('input').setValue('1');

        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(2);
        expect(elOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 12']);
        expect(melOptions.length).toBe(2);
        expect(melOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 12']);
      }

      {
        await el.find('input').setValue('2');
        await mel.find('input').setValue('2');

        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(2);
        expect(elOptions.map(op => op.text())).toStrictEqual(['Option 2', 'Option 12']);
        expect(melOptions.length).toBe(2);
        expect(melOptions.map(op => op.text())).toStrictEqual(['Option 2', 'Option 12']);
      }

      {
        await el.find('input').setValue('3');
        await mel.find('input').setValue('3');

        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(0);
        expect(melOptions.length).toBe(0);
      }

      {
        await el.find('input').setValue('op');
        await mel.find('input').setValue('op');

        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(3);
        expect(elOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        expect(melOptions.length).toBe(3);
        expect(melOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
      }

      {
        await el.find('input').setValue('OP');
        await mel.find('input').setValue('OP');

        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(3);
        expect(elOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        expect(melOptions.length).toBe(3);
        expect(melOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
      }

      {
        await el.find('input').setValue('');
        await mel.find('input').setValue('');

        const elOptions = el.findAll('.el-select-dropdown__item').filter(op => op.attributes('style') !== 'display: none;');
        const melOptions = mel.findAll('.el-select-dropdown__item');

        expect(elOptions.length).toBe(3);
        expect(elOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
        expect(melOptions.length).toBe(3);
        expect(melOptions.map(op => op.text())).toStrictEqual(['Option 1', 'Option 2', 'Option 12']);
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
