import { defineComponentConfig, nanoid, transformPathRecord } from '@mixte/snippets/low-code-editor/utils';

describe('low-code-editor/utils', () => {
  describe('nanoid', () => {
    it('生成 18 位字符串 ID', () => {
      const id = nanoid();

      expect(id).toHaveLength(18);
      expect(id).toMatch(/^[\w-]{18}$/);
      expect(nanoid()).not.toBe(id);
    });
  });

  describe('defineComponentConfig', () => {
    it('原样返回组件配置', () => {
      const config = {
        name: 'LayoutDiv',
        displayName: '布局容器',
        config: { text: '' },
      };

      expect(defineComponentConfig(config)).toBe(config);
    });
  });

  describe('transformPathRecord', () => {
    const record = {
      './LayoutDiv/config.ts': { config: { a: 1 } },
      './LayoutText/config.ts': { config: { b: 2 } },
    };

    it('默认使用路径的上级目录名作为键', () => {
      expect(transformPathRecord(record)).toStrictEqual({
        LayoutDiv: { config: { a: 1 } },
        LayoutText: { config: { b: 2 } },
      });
    });

    it('支持自定义值的处理', () => {
      expect(transformPathRecord(record, v => v.config)).toStrictEqual({
        LayoutDiv: { a: 1 },
        LayoutText: { b: 2 },
      });
    });

    it('支持自定义键的提取', () => {
      expect(transformPathRecord(record, v => v, path => path)).toStrictEqual(record);
    });
  });
});
