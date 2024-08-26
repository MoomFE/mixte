import { mount } from '@vue/test-utils';
import postcss from 'postcss';
import postcssJs from 'postcss-js';

export const defaultStyle = {
  width: '100%',
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  columnGap: '0px',
  rowGap: '0px',
};

/**
 * 组件 MixteAutoGrid 和组件 MixteListAutoGrid 共用的单元测试
 */
export function sharedTest(component: ReturnType<typeof defineComponent>) {
  it('未给组件传入子节点', () => {
    const wrapper = mount(component);

    // 渲染节点数量
    expect(wrapper.element.children.length).toBe(0);

    // 组件样式
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual(defaultStyle);
  });

  it('支持手动传入组件宽度, 会使用传入宽度进行宽度计算每列子元素个数 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { width: '400', itemWidth: '200' },
    });
    const wrapper2 = mount(component, {
      props: { width: 400, itemWidth: 200 },
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

  it('设置横纵间距 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { gap: '2' },
    });
    const wrapper2 = mount(component, {
      props: { gap: 2 },
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

  it('同时设置横纵间距和 "横向间距/纵向间距" 时, 以 "横向间距/纵向间距" 为准 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { gap: '6', gapX: '2', gapY: '4' },
    });
    const wrapper2 = mount(component, {
      props: { gap: 6, gapX: 2, gapY: 4 },
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

  it('设置横向间距 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { gapX: '2' },
    });
    const wrapper2 = mount(component, {
      props: { gapX: 2 },
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

  it('同时设置横纵间距和横向间距时, 以横向间距为准 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { gap: '6', gapX: '2' },
    });
    const wrapper2 = mount(component, {
      props: { gap: 6, gapX: 2 },
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

  it('设置纵向间距 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { gapY: '2' },
    });
    const wrapper2 = mount(component, {
      props: { gapY: 2 },
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

  it('同时设置横纵间距和纵向间距时, 以纵向间距为准 ( 样式测试 )', () => {
    const wrapper = mount(component, {
      props: { gap: '6', gapY: '2' },
    });
    const wrapper2 = mount(component, {
      props: { gap: 6, gapY: 2 },
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

  it('调整组件宽度时, 会重新计算每列子元素个数', async () => {
    const wrapper = mount(component, {
      props: { itemWidth: '200' },
    });

    wrapper.setProps({ width: '199' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '199px',
      gridTemplateColumns: 'repeat(1, 1fr)',
    });

    wrapper.setProps({ width: '200' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '200px',
      gridTemplateColumns: 'repeat(1, 1fr)',
    });

    wrapper.setProps({ width: '399' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '399px',
      gridTemplateColumns: 'repeat(1, 1fr)',
    });

    wrapper.setProps({ width: '400' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '400px',
      gridTemplateColumns: 'repeat(2, 1fr)',
    });

    wrapper.setProps({ width: '401' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '401px',
      gridTemplateColumns: 'repeat(2, 1fr)',
    });

    wrapper.setProps({ width: '599' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '599px',
      gridTemplateColumns: 'repeat(2, 1fr)',
    });

    wrapper.setProps({ width: '600' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '600px',
      gridTemplateColumns: 'repeat(3, 1fr)',
    });
  });

  it('横向间距会影响每列子元素个数', async () => {
    const wrapper = mount(component, {
      props: { itemWidth: '200' },
      slots: {
        default: Array.from({ length: 6 }).map((_, i) => h('div', `item-${i + 1}`)),
      },
    });

    wrapper.setProps({ width: '400', gapX: '100' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '400px',
      gridTemplateColumns: 'repeat(1, 1fr)',
      columnGap: '100px',
    });

    wrapper.setProps({ width: '499', gapX: '100' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '499px',
      gridTemplateColumns: 'repeat(1, 1fr)',
      columnGap: '100px',
    });

    wrapper.setProps({ width: '500', gapX: '100' });
    await nextTick();
    expect(postcssJs.objectify(postcss.parse(wrapper.element.getAttribute('style')!))).toStrictEqual({
      ...defaultStyle,
      width: '500px',
      gridTemplateColumns: 'repeat(2, 1fr)',
      columnGap: '100px',
    });
  });
}
