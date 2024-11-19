import { MelSelect } from '@mixte/mel-components/mel-select';
import { mount } from '@vue/test-utils';
import * as cheerio from 'cheerio';
import { ElOption, ElSelect } from 'element-plus';

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
    it('通过参数传入 options 以渲染选项', () => {
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

    it('通过参数传入 options 以渲染选项, 支持禁用', () => {
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
});
