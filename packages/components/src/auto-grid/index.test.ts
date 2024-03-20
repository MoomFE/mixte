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

  test('未给组件传入子节点', () => {
    const wrapper = mount(emptyOptions);

    expect(wrapper.element.children.length).toBe(0);

    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(0, 1fr)',
      columnGap: '0px',
      rowGap: '0px',
    });
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
      template: `
        <MixteAutoGrid width="400" item-width="200">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :width="400" :item-width="200">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html = wrapper.html();
    const html2 = wrapper2.html();

    expect(html).toBe(html2);
    expect(html).matchSnapshot();
  });

  test('设置横纵间距 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid gap="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :gap="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html = wrapper.html();
    const html2 = wrapper2.html();

    expect(html).toBe(html2);
    expect(html).matchSnapshot();

    // 同时设置横纵间距和"横向间距/纵向间距"时, 以"横向间距/纵向间距"为准
    const wrapper3 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid gap="6" gapX="2" gapY="4">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper4 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :gap="6" :gapX="2" :gapY="4">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html3 = wrapper3.html();
    const html4 = wrapper4.html();

    expect(html3).toBe(html4);
    expect(html3).matchSnapshot();
  });

  test('设置横向间距 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid gapX="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :gapX="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html = wrapper.html();
    const html2 = wrapper2.html();

    expect(html).toBe(html2);
    expect(html).matchSnapshot();

    // 同时设置横纵间距和横向间距时, 以横向间距为准
    const wrapper3 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid gap="6" gapX="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper4 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :gap="6" :gapX="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html3 = wrapper3.html();
    const html4 = wrapper4.html();

    expect(html3).toBe(html4);
    expect(html3).matchSnapshot();
  });

  test('设置纵向间距 ( 样式测试 )', () => {
    const wrapper = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid gapY="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper2 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :gapY="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html = wrapper.html();
    const html2 = wrapper2.html();

    expect(html).toBe(html2);
    expect(html).matchSnapshot();

    // 同时设置横纵间距和纵向间距时, 以纵向间距为准
    const wrapper3 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid gap="6" gapY="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });
    const wrapper4 = mount({
      ...emptyOptions,
      template: `
        <MixteAutoGrid :gap="6" :gapY="2">
          <div>item-1</div>
          <div>item-2</div>
        </MixteAutoGrid>
      `,
    });

    const html3 = wrapper3.html();
    const html4 = wrapper4.html();

    expect(html3).toBe(html4);
    expect(html3).matchSnapshot();
  });
});
