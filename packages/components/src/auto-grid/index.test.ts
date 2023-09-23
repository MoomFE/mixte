import { MixteAutoGrid } from '@mixte/components';
import { mount } from '@vue/test-utils';

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
  });
});
