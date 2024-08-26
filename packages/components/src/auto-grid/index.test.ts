import type { VNodeChild } from 'vue';
import { MixteAutoGrid } from '@mixte/components/auto-grid';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import postcss from 'postcss';
import postcssJs from 'postcss-js';
import { defaultStyle, sharedTest } from './shared-test';

describe('auto-grid', () => {
  it('给组件传入各个类型的子节点', () => {
    const wrapper = mount({
      components: { MixteAutoGrid },
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

    const element = wrapper.element as HTMLDivElement;
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
    expect(children[2].innerHTML.trim()).toBe(mount(MixteAutoGrid).element.outerHTML);
    expect(children[3].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(children[4].innerHTML.trim()).toBe('<div>item-2</div>');
    expect(children[5].innerHTML.trim()).toBe('<div>item-3</div>');
    expect(children[6].innerHTML.trim()).toBe('<div>item-4</div>');
    expect(children[7].innerHTML.trim()).toBe('<div>item-5</div>');
    expect(children[8].innerHTML.trim()).toBe('<div>item-6</div>');
  });

  it('使用渲染函数给组件传入各个类型的子节点', () => {
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

    const element = wrapper.element as HTMLDivElement;
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
    expect(children[3].innerHTML.trim()).toBe(mount(MixteAutoGrid).element.outerHTML);
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

  it('横向间距会影响每列子元素个数 ( 单子组件测试 )', async () => {
    const wrapper = mount(MixteAutoGrid, {
      props: { itemWidth: '200' },
      slots: {
        default: h('div', 'item'),
      },
    });

    wrapper.setProps({ width: '1400', gapX: '1000' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '1400px',
      gridTemplateColumns: 'repeat(2, 1fr)',
      columnGap: '1000px',
    });

    wrapper.setProps({ width: '2600', gapX: '1000' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '2600px',
      gridTemplateColumns: 'repeat(3, 1fr)',
      columnGap: '1000px',
    });

    wrapper.setProps({ width: '3600', gapX: '1000' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '3600px',
      gridTemplateColumns: 'repeat(3, 1fr)',
      columnGap: '1000px',
    });

    wrapper.setProps({ width: '3800', gapX: '1000' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '3800px',
      gridTemplateColumns: 'repeat(4, 1fr)',
      columnGap: '1000px',
    });
  });

  it('启用折叠时, 超出指定显示行数的子元素不会渲染', async () => {
    const wrapper = mount(MixteAutoGrid, {
      props: { itemWidth: 200, collapsed: true },
      slots: {
        default: Array.from({ length: 10 }).map((_, i) => h('div', `item-${i + 1}`)),
      },
    });

    // 未设置显示行数时, 默认只显示一行
    wrapper.setProps({ width: '400' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(2);

    // 设置显示行数为 1
    wrapper.setProps({ width: '400', collapsedRows: '1' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(2);

    // 设置显示行数为 2
    wrapper.setProps({ width: '400', collapsedRows: '2' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(4);

    // 行数足够时, 显示所有子元素
    wrapper.setProps({ width: '400', collapsedRows: '5' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(10);

    // 宽度足够时, 显示所有子元素
    wrapper.setProps({ width: '2000', collapsedRows: '1' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(10);
  });

  it('启用折叠时并且有子元素溢出时, 可以使用 overflowSuffix 插槽替代最后一个子节点显示', async () => {
    const renderCount = ref(0);
    const wrapper = mount(MixteAutoGrid, {
      props: { itemWidth: 200, collapsed: true },
      slots: {
        default: () => Array.from({ length: renderCount.value }).map((_, i) => h('div', `item-${i + 1}`)),
        overflowSuffix: 'item-overflowSuffix',
      },
    });

    // 单行无节点溢出, 不显示 overflowSuffix 插槽
    renderCount.value = 10;
    wrapper.setProps({ width: '2000', collapsedRows: '1' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(10);
    Array.from((wrapper.element as HTMLDivElement).children).forEach((child, i) => {
      expect(child.innerHTML.trim()).toBe(`<div>item-${i + 1}</div>`);
    });

    // 单行有节点溢出, 显示 overflowSuffix 插槽
    renderCount.value = 11;
    wrapper.setProps({ width: '2000', collapsedRows: '1' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(10);
    Array.from((wrapper.element as HTMLDivElement).children).forEach((child, i) => {
      if (i < 9) expect(child.innerHTML.trim()).toBe(`<div>item-${i + 1}</div>`);
      else expect(child.innerHTML.trim()).toBe('item-overflowSuffix');
    });

    // 多行无节点溢出, 不显示 overflowSuffix 插槽
    renderCount.value = 20;
    wrapper.setProps({ width: '2000', collapsedRows: '2' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(20);
    Array.from((wrapper.element as HTMLDivElement).children).forEach((child, i) => {
      expect(child.innerHTML.trim()).toBe(`<div>item-${i + 1}</div>`);
    });

    // 多行有节点溢出, 显示 overflowSuffix 插槽
    renderCount.value = 21;
    wrapper.setProps({ width: '2000', collapsedRows: '2' });
    await nextTick();
    expect(wrapper.element.children.length).toBe(20);
    Array.from((wrapper.element as HTMLDivElement).children).forEach((child, i) => {
      if (i < 19) expect(child.innerHTML.trim()).toBe(`<div>item-${i + 1}</div>`);
      else expect(child.innerHTML.trim()).toBe('item-overflowSuffix');
    });
  });

  it('启用折叠时并且有子元素溢出时, 切换 overflowSuffix 插槽', async () => {
    const wrapper = mount(
      defineComponent({
        props: {
          renderOverflowSuffix: {
            type: Boolean,
            default: true,
          },
        },
        render() {
          const other: Record<string, () => VNodeChild> = {};

          if (this.renderOverflowSuffix)
            other.overflowSuffix = () => 'item-overflowSuffix';

          return h(MixteAutoGrid, { width: 400, itemWidth: 200, collapsed: true }, {
            default: () => Array.from({ length: 3 }).map((_, i) => h('div', `item-${i + 1}`)),
            ...other,
          });
        },
      }),
    );

    // 默认显示 overflowSuffix 插槽
    expect(wrapper.element.children.length).toBe(2);
    expect(wrapper.element.children[0].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(wrapper.element.children[1].innerHTML.trim()).toBe('item-overflowSuffix');

    // 切换 overflowSuffix 插槽
    await wrapper.setProps({ renderOverflowSuffix: false });
    expect(wrapper.element.children.length).toBe(2);
    expect(wrapper.element.children[0].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(wrapper.element.children[1].innerHTML.trim()).toBe('<div>item-2</div>');

    // 切换 overflowSuffix 插槽
    await wrapper.setProps({ renderOverflowSuffix: true });
    expect(wrapper.element.children.length).toBe(2);
    expect(wrapper.element.children[0].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(wrapper.element.children[1].innerHTML.trim()).toBe('item-overflowSuffix');

    // 切换 overflowSuffix 插槽
    await wrapper.setProps({ renderOverflowSuffix: false });
    expect(wrapper.element.children.length).toBe(2);
    expect(wrapper.element.children[0].innerHTML.trim()).toBe('<div>item-1</div>');
    expect(wrapper.element.children[1].innerHTML.trim()).toBe('<div>item-2</div>');
  });

  sharedTest(MixteAutoGrid);
});
