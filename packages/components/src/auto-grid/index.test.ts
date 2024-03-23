import { MixteAutoGrid } from '@mixte/components';
import { mount } from '@vue/test-utils';
import { h } from 'vue-demi';
import postcss from 'postcss';
import postcssJs from 'postcss-js';

describe('AutoGrid', () => {
  const emptyOptions = {
    template: '<MixteAutoGrid />',
    components: {
      MixteAutoGrid,
    },
  };

  const defaultStyle = {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(0, 1fr)',
    columnGap: '0px',
    rowGap: '0px',
  };

  test('未给组件传入子节点', () => {
    const wrapper = mount(emptyOptions);

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual(defaultStyle);
  });

  test('给组件传入各个类型的子节点', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid>

          123

          <!-- comment -->

          <div>456</div>

          <MixteAutoGrid />

          <template v-for="i in 6" :key="i">
            <div>item-{{ i }}</div>
          </template>

          <div v-if="false">789</div>

        </MixteAutoGrid>
      `,
    });

    const element = wrapper.element;
    const children = Array.from(element.children);

    // 渲染节点数量
    expect(children.length).toBe(9);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

    // 子节点包裹层及其样式
    Array.from(children).forEach((child) => {
      expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
    });

    // 子节点内容
    expect(children[0].innerHTML.trim()).toBe('123');
    expect(children[1].innerHTML.trim()).toBe('<div>456</div>');
    expect(children[2].innerHTML.trim()).toBe(mount(emptyOptions).element.outerHTML);
    expect(children[3].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(children[4].innerHTML.trim()).toBe('<div>item-2</div>');
    expect(children[5].innerHTML.trim()).toBe('<div>item-3</div>');
    expect(children[6].innerHTML.trim()).toBe('<div>item-4</div>');
    expect(children[7].innerHTML.trim()).toBe('<div>item-5</div>');
    expect(children[8].innerHTML.trim()).toBe('<div>item-6</div>');
  });

  test('使用渲染函数给组件传入各个类型的子节点', () => {
    const wrapper = mount({
      render() {
        return h(MixteAutoGrid, {}, {
          default: () => [
            123,
            '<!-- fake comment -->',
            h('div', '456'),
            h(MixteAutoGrid),
            Array.from({ length: 6 }).map((_, i) => h('div', `item-${i + 1}`)),
            '789',
            [1, '2'],
            null,
            false,
          ],
        });
      },
    });

    const element = wrapper.element;
    const children = Array.from(element.children);

    // 渲染节点数量
    expect(children.length).toBe(13);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual(defaultStyle);

    // 子节点包裹层及其样式
    Array.from(children).forEach((child) => {
      expect((child.cloneNode() as HTMLDivElement).outerHTML).toBe('<div style="overflow: hidden;"></div>');
    });

    // 子节点内容
    expect(children[0].innerHTML.trim()).toBe('123');
    expect(children[1].innerHTML.trim()).toBe('&lt;!-- fake comment --&gt;');
    expect(children[2].innerHTML.trim()).toBe('<div>456</div>');
    expect(children[3].innerHTML.trim()).toBe(mount(emptyOptions).element.outerHTML);
    expect(children[4].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(children[5].innerHTML.trim()).toBe('<div>item-2</div>');
    expect(children[6].innerHTML.trim()).toBe('<div>item-3</div>');
    expect(children[7].innerHTML.trim()).toBe('<div>item-4</div>');
    expect(children[8].innerHTML.trim()).toBe('<div>item-5</div>');
    expect(children[9].innerHTML.trim()).toBe('<div>item-6</div>');
    expect(children[10].innerHTML.trim()).toBe('789');
    expect(children[11].innerHTML.trim()).toBe('1');
    expect(children[12].innerHTML.trim()).toBe('2');
  });

  test('支持手动传入组件宽度, 会使用传入宽度进行宽度计算每列子元素个数', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid width="400" item-width="200" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :width="400" :item-width="200" />',
    });

    const element = wrapper.element;

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '400px',
      gridTemplateColumns: 'repeat(2, 1fr)',
    });
  });

  test('设置横纵间距 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid gap="2" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :gap="2" />',
    });

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      columnGap: '2px',
      rowGap: '2px',
    });
  });

  test('同时设置横纵间距和 "横向间距/纵向间距" 时, 以 "横向间距/纵向间距" 为准 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid gap="6" gapX="2" gapY="4" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :gap="6" :gapX="2" :gapY="4" />',
    });

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      columnGap: '2px',
      rowGap: '4px',
    });
  });

  test('设置横向间距 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid gapX="2" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :gapX="2" />',
    });

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      columnGap: '2px',
    });
  });

  test('同时设置横纵间距和横向间距时, 以横向间距为准 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid gap="6" gapX="2" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :gap="6" :gapX="2" />',
    });

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      columnGap: '2px',
      rowGap: '6px',
    });
  });

  test('设置纵向间距 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid gapY="2" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :gapY="2" />',
    });

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      rowGap: '2px',
    });
  });

  test('同时设置横纵间距和纵向间距时, 以纵向间距为准 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid gap="6" gapY="2" />',
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: '<MixteAutoGrid :gap="6" :gapY="2" />',
    });

    // 不同传参方式的渲染结果一致
    expect(wrapper.html()).toBe(wrapper2.html());

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      columnGap: '6px',
      rowGap: '2px',
    });
  });
});
