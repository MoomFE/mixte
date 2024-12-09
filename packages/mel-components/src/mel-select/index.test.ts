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
  return [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
  ];
}

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
  });
});
