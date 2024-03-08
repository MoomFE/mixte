import { MixteAutoGrid } from '@mixte/components';
import { mount } from '@vue/test-utils';
import { h } from 'vue-demi';

describe('AutoGrid', () => {
  const emptyOptions = {
    template: '<MixteAutoGrid />',
    components: {
      MixteAutoGrid,
    },
  };

  test('未给组件传入子节点', () => {
    const wrapper = mount(emptyOptions);
    expect(wrapper.html()).matchSnapshot();
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

    expect(wrapper.html()).matchSnapshot();
  });

  test('使用渲染函数给组件传入各个类型的子节点', () => {
    const wrapper = mount({
      render() {
        return h(MixteAutoGrid, {}, {
          default: () => [
            123,
            '<!-- comment -->',
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

    expect(wrapper.html()).matchSnapshot();
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

  test('设置横纵间距', () => {
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

  test('设置横向间距', () => {
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

  test('设置纵向间距', () => {
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
