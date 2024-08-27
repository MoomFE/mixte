import { MixteListAutoGrid } from '@mixte/components/list-auto-grid';
import { mount } from '@vue/test-utils';
import postcss from 'postcss';
import postcssJs from 'postcss-js';
import { defaultStyle, sharedTest } from '../auto-grid/shared-test';

describe('list-auto-grid', () => {
  describe('列表数据传入数组', () => {
    it('以数组渲染列表', async () => {
      const wrapper = mount(MixteListAutoGrid, {
        props: {
          list: [{}, {}, {}],
        },
      });

      const element = wrapper.element as HTMLDivElement;
      const children = Array.from(element.children);

      // 渲染节点数量
      expect(children.length).toBe(3);

      // 组件样式
      expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

      // 子节点包裹层及其样式
      Array.from(children).forEach((child) => {
        expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
      });

      // 更新列表数据
      await wrapper.setProps({
        list: [{}, {}, {}, {}, {}],
      });

      // 渲染节点数量
      expect(element.children.length).toBe(5);

      // 组件样式
      expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

      // 子节点包裹层及其样式
      Array.from(children).forEach((child) => {
        expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
      });
    });

    it('使用默认插槽接收传参及内容渲染', () => {
      const wrapper = mount(MixteListAutoGrid, {
        props: {
          list: [{ a: 1 }, { b: 2 }, { c: 3 }],
        },
        slots: {
          default: ({ item, index }: any) => {
            if (index === 0) return JSON.stringify(item);
            if (index === 1) return `${index}:${JSON.stringify(item)}`;
            return h('div', JSON.stringify(item));
          },
        },
      });

      const element = wrapper.element as HTMLDivElement;
      const children = Array.from(element.children);

      // 渲染节点数量
      expect(children.length).toBe(3);

      // 组件样式
      expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

      // 子节点包裹层及其样式
      Array.from(children).forEach((child) => {
        expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
      });

      // 子节点内容
      expect(children[0].innerHTML.trim()).toBe('{"a":1}');
      expect(children[1].innerHTML.trim()).toBe('1:{"b":2}');
      expect(children[2].innerHTML.trim()).toBe('<div>{"c":3}</div>');
    });
  });

  describe('列表数据传入数值', () => {
    it('以数值渲染列表', async () => {
      const wrapper = mount(MixteListAutoGrid, {
        props: {
          list: 3,
        },
      });

      const element = wrapper.element as HTMLDivElement;
      const children = Array.from(element.children);

      // 渲染节点数量
      expect(children.length).toBe(3);

      // 组件样式
      expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

      // 子节点包裹层及其样式
      Array.from(children).forEach((child) => {
        expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
      });

      // 更新列表数据
      await wrapper.setProps({
        list: 5,
      });

      // 渲染节点数量
      expect(element.children.length).toBe(5);

      // 组件样式
      expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

      // 子节点包裹层及其样式
      Array.from(children).forEach((child) => {
        expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
      });
    });

    it('使用默认插槽接收传参及内容渲染', () => {
      const wrapper = mount(MixteListAutoGrid, {
        props: {
          list: 3,
        },
        slots: {
          default: ({ item, index }: any) => {
            if (index === 0) return JSON.stringify(item);
            if (index === 1) return `${index}:${JSON.stringify(item)}`;
            return h('div', JSON.stringify(item));
          },
        },
      });

      const element = wrapper.element as HTMLDivElement;
      const children = Array.from(element.children);

      // 渲染节点数量
      expect(children.length).toBe(3);

      // 组件样式
      expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

      // 子节点包裹层及其样式
      Array.from(children).forEach((child) => {
        expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
      });

      // 子节点内容
      expect(children[0].innerHTML.trim()).toBe('1');
      expect(children[1].innerHTML.trim()).toBe('1:2');
      expect(children[2].innerHTML.trim()).toBe('<div>3</div>');
    });
  });

  sharedTest(MixteListAutoGrid);
});
