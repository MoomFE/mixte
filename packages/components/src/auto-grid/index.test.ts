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
});
