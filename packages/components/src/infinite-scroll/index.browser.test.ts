import type { MixteInfiniteScrollInstance } from '@mixte/components/infinite-scroll';
import type { PropType, SlotsType } from 'vue';
import type { SlotProps } from './src/types';
import { MixteInfiniteScroll } from '@mixte/components/infinite-scroll';
import { delay, pick } from 'mixte';
import { render } from 'vitest-browser-vue';
import 'uno.css';

// @unocss-include

describe('infinite-scroll', () => {
  /** 数据源 */
  const data = ref<number[]>([]);

  /** 使 `加载数据方法` 报错 */
  let loadDataError = false;
  /**
   * 使 `加载数据方法` 返回指定条目数据
   *   - 如果不指定, 则返回 `pageSize` 条数据
   *   - 如果指定未 `-1`, 则不返回数组, 返回 undefined
   */
  let loadDataCount: number | undefined;
  /** 使 `加载数据方法` 进行等待, 不返回数据 */
  const loadDataWait = ref(false);

  /** 加载数据方法 */
  const load = vi.fn(async (pageNum: number, pageSize: number) => {
    if (loadDataError) {
      return Promise.reject(new Error('加载数据失败'));
    }
    if (loadDataCount === -1) {
      return Promise.resolve(undefined);
    }
    if (loadDataWait.value) {
      await until(loadDataWait).toBe(false);
    }

    const resData = Array.from({ length: loadDataCount ?? pageSize })
      .map((_, i) => (i + 1) + (pageNum - 1) * pageSize);

    data.value.push(
      ...resData,
    );

    return resData;
  });

  /* 前置内容插槽 */
  const prependSlot = vi.fn(() => null);
  /* 后置内容插槽 */
  const appendSlot = vi.fn(() => null);

  /** 正常默认插槽 */
  const normalDefaultSlot = () => {
    return data.value.map(value => (
      h('div', { class: 'h-10 flex-(~ justify-center items-center) b-(1 solid neutral-2)' }, [value])
    ));
  };

  /** 正常组件 */
  const NormalComponent = defineComponent({
    props: {
      targetRef: Object as PropType<Ref<MixteInfiniteScrollInstance | undefined>>,
      isVisible: Object as PropType<Ref<boolean>>,
    },
    slots: Object as SlotsType<{
      prepend?: SlotProps;
      append?: SlotProps;
    }>,
    setup(props, { attrs, slots }) {
      const targetRef = props.targetRef ?? ref<MixteInfiniteScrollInstance>();
      const isVisible = useElementVisibility(targetRef as any);

      wheneverEffectScopeImmediate(() => props.isVisible, () => {
        syncRef(props.isVisible!, isVisible, {
          direction: 'rtl',
        });
      });

      function Render() {
        return h(MixteInfiniteScroll, {
          'ref': targetRef,
          'class': 'h-66 overflow-y-auto flex-(~ col gap-2) text-center',
          'data': data.value,
          'onUpdate:data': (v: number[] | undefined) => {
            data.value = v ?? [];
          },
          load,
          ...attrs,
        }, {
          default: normalDefaultSlot,
          prepend: prependSlot,
          append: appendSlot,
          ...slots,
        });
      }

      return {
        targetRef,
        Render,
      };
    },
    render() {
      return this.Render();
    },
  });

  beforeEach(() => {
    data.value = [];
    loadDataError = false;
    loadDataCount = undefined;
    loadDataWait.value = false;
    load.mockReset();
    prependSlot.mockReset();
    appendSlot.mockReset();
  });

  describe('数据加载', () => {
    it('初始加载数据, 触底加载数据', async () => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
      });
      const el = unrefElement(targetRef as any)!;

      await until(targetIsVisible).toBe(true);

      // 初始加载数据
      await delay(100);
      expect(load).toHaveBeenCalledTimes(1);
      expect(load).toHaveBeenCalledWith(1, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 10 }).map((_, i) => i + 1));

      // 滚动到底加载数据
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenCalledWith(2, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 20 }).map((_, i) => i + 1));

      // 未滚动到底不加载数据
      el.scrollTop = el.scrollHeight - el.clientHeight - 2;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenCalledWith(2, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 20 }).map((_, i) => i + 1));

      // 滚动到底加载数据
      el.scrollTop += 10;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(3);
      expect(load).toHaveBeenCalledWith(3, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 30 }).map((_, i) => i + 1));
    });

    it('加载数据失败后, 触底不会再次加载数据', async () => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
      });
      const el = unrefElement(targetRef as any)!;

      await until(targetIsVisible).toBe(true);

      // 初始加载数据
      await delay(100);
      expect(load).toHaveBeenCalledTimes(1);
      expect(load).toHaveBeenCalledWith(1, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 10 }).map((_, i) => i + 1));
      expect(targetRef.value?.error).toBeUndefined();

      // 数据加载失败
      loadDataError = true;
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenCalledWith(2, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 10 }).map((_, i) => i + 1));
      expect(targetRef.value?.error).toBeInstanceOf(Error);
      expect(targetRef.value?.error?.message).toBe('加载数据失败');

      // 尝试再次触底
      el.scrollTop = 0;
      await delay(100);
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenCalledWith(2, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 10 }).map((_, i) => i + 1));
      expect(targetRef.value?.error).toBeInstanceOf(Error);
      expect(targetRef.value?.error?.message).toBe('加载数据失败');
    });

    it.each([
      ['数据小于 pageSiz', 6],
      ['无更多数据', 0],
      ['未返回', -1],
    ])('加载结束后 ( %s ), 再次触底不会再次加载数据', async (_, num) => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
      });
      const el = unrefElement(targetRef as any)!;

      await until(targetIsVisible).toBe(true);

      // 初始加载数据
      await delay(100);
      expect(load).toHaveBeenCalledTimes(1);
      expect(load).toHaveBeenCalledWith(1, 10);
      expect(data.value).toStrictEqual(Array.from({ length: 10 }).map((_, i) => i + 1));

      // 二次加载数据 - 加载结束
      loadDataCount = num;
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenCalledWith(2, 10);
      expect(data.value).toStrictEqual(
        Array
          .from({
            length: 10 + (num === -1 ? 0 : num),
          })
          .map((_, i) => i + 1),
      );

      // 尝试再次触底
      el.scrollTop = 0;
      await delay(100);
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(load).toHaveBeenCalledTimes(2);
      expect(load).toHaveBeenCalledWith(2, 10);
      expect(data.value).toStrictEqual(
        Array
          .from({
            length: 10 + (num === -1 ? 0 : num),
          })
          .map((_, i) => i + 1),
      );
    });
  });

  describe('组件状态 & reset()', () => {
    it('isLoading', async () => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
      });
      const el = unrefElement(targetRef as any)!;

      // 组件还未加载数据
      expect(targetRef.value?.isLoading).toBe(false);
      expect(load).toHaveBeenCalledTimes(0);

      // 组件加载数据中
      loadDataWait.value = true;
      await until(targetIsVisible).toBe(true);
      await delay(100);
      expect(targetRef.value?.isLoading).toBe(true);
      expect(load).toHaveBeenCalledTimes(1);

      // 组件加载数据完成
      loadDataWait.value = false;
      await delay(100);
      expect(targetRef.value?.isLoading).toBe(false);
      expect(load).toHaveBeenCalledTimes(1);

      // 第二次加载数据
      loadDataWait.value = true;
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(targetRef.value?.isLoading).toBe(true);
      expect(load).toHaveBeenCalledTimes(2);

      // 第二次加载数据完成
      loadDataWait.value = false;
      await delay(100);
      expect(targetRef.value?.isLoading).toBe(false);
      expect(load).toHaveBeenCalledTimes(2);
    });

    describe('isEmpty', async () => {
      it('基础测试', async () => {
        const targetRef = ref<MixteInfiniteScrollInstance>();
        const targetIsVisible = ref(false);
        render(NormalComponent, {
          props: { targetRef, isVisible: targetIsVisible, interval: 0 },
        });
        const el = unrefElement(targetRef as any)!;

        // 组件还未加载数据
        expect(targetRef.value?.isEmpty).toBe(true);
        expect(load).toHaveBeenCalledTimes(0);

        // 初始加载数据
        await until(targetIsVisible).toBe(true);
        await delay(100);
        expect(targetRef.value?.isEmpty).toBe(false);
        expect(load).toHaveBeenCalledTimes(1);

        // 滚动到底加载数据
        el.scrollTop = el.scrollHeight;
        await delay(100);
        expect(targetRef.value?.isEmpty).toBe(false);
        expect(load).toHaveBeenCalledTimes(2);
      });

      it('未传 data 时, isEmpty 为 undefined', async () => {
        const targetRef = ref<MixteInfiniteScrollInstance>();
        const targetIsVisible = ref(false);
        render(NormalComponent, {
          props: { targetRef, isVisible: targetIsVisible, interval: 0 },
          attrs: {
            data: undefined,
          },
        });
        const el = unrefElement(targetRef as any)!;

        expect(targetRef.value?.isEmpty).toBeUndefined();
        expect(load).toHaveBeenCalledTimes(0);

        await until(targetIsVisible).toBe(true);

        // 初始加载数据
        await delay(100);
        expect(targetRef.value?.isEmpty).toBeUndefined();
        expect(load).toHaveBeenCalledTimes(1);

        // 滚动到底加载数据
        el.scrollTop = el.scrollHeight;
        await delay(100);
        expect(targetRef.value?.isEmpty).toBeUndefined();
        expect(load).toHaveBeenCalledTimes(2);
      });
    });

    describe('isFinished', () => {
      it.each([
        ['数据小于 pageSiz', 6],
        ['无更多数据', 0],
        ['未返回', -1],
      ])('加载结束后 ( %s ), isFinished 为 true, 再次触底不会再次加载数据', async (_, num) => {
        const targetRef = ref<MixteInfiniteScrollInstance>();
        const targetIsVisible = ref(false);
        render(NormalComponent, {
          props: { targetRef, isVisible: targetIsVisible, interval: 0 },
        });
        const el = unrefElement(targetRef as any)!;

        // 组件还未加载数据
        expect(targetRef.value?.isFinished).toBe(false);
        expect(load).toHaveBeenCalledTimes(0);

        // 初始加载数据
        await until(targetIsVisible).toBe(true);
        await delay(100);
        expect(targetRef.value?.isFinished).toBe(false);
        expect(load).toHaveBeenCalledTimes(1);

        // 二次加载数据 - 加载结束
        loadDataCount = num;
        el.scrollTop = el.scrollHeight;
        await delay(100);
        expect(targetRef.value?.isFinished).toBe(true);
        expect(load).toHaveBeenCalledTimes(2);

        // 尝试再次触底
        el.scrollTop = 0;
        await delay(100);
        el.scrollTop = el.scrollHeight;
        await delay(100);
        expect(targetRef.value?.isFinished).toBe(true);
        expect(load).toHaveBeenCalledTimes(2);
      });
    });

    it('error', async () => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
      });

      // 组件还未加载数据
      expect(targetRef.value?.error).toBeUndefined();
      expect(load).toHaveBeenCalledTimes(0);

      // 触发加载失败
      loadDataError = true;
      await until(targetIsVisible).toBe(true);
      await delay(100);
      expect(targetRef.value?.error).toBeInstanceOf(Error);
      expect(targetRef.value?.error?.message).toBe('加载数据失败');
    });

    describe('reset()', () => {
      it('执行后会清空双向绑定的数据', async () => {
        const targetRef = ref<MixteInfiniteScrollInstance>();
        const targetIsVisible = ref(false);
        render(NormalComponent, {
          props: { targetRef, isVisible: targetIsVisible, interval: 0 },
        });

        // 初始加载数据
        await until(targetIsVisible).toBe(true);
        await delay(100);
        expect(data.value).toStrictEqual(Array.from({ length: 10 }).map((_, i) => i + 1));
        targetRef.value!.reset();
        expect(data.value).toStrictEqual([]);
      });

      it('执行后 error 被清空', async () => {
        const targetRef = ref<MixteInfiniteScrollInstance>();
        const targetIsVisible = ref(false);
        render(NormalComponent, {
          props: { targetRef, isVisible: targetIsVisible, interval: 0 },
        });

        // 组件还未加载数据
        loadDataError = true;
        expect(targetRef.value?.error).toBeUndefined();
        expect(load).toHaveBeenCalledTimes(0);

        // 触发加载失败
        await until(targetIsVisible).toBe(true);
        await delay(100);
        expect(targetRef.value?.error).toBeInstanceOf(Error);
        expect(targetRef.value?.error?.message).toBe('加载数据失败');
        expect(load).toHaveBeenCalledTimes(1);

        // reset 后 error 清空
        targetRef.value!.reset();
        expect(targetRef.value?.error).toBeUndefined();
      });

      it('执行后 isFinished 被重置', async () => {
        const targetRef = ref<MixteInfiniteScrollInstance>();
        const targetIsVisible = ref(false);
        render(NormalComponent, {
          props: { targetRef, isVisible: targetIsVisible, interval: 0 },
        });

        // 组件还未加载数据
        loadDataCount = 0;
        expect(targetRef.value?.isFinished).toBe(false);
        expect(load).toHaveBeenCalledTimes(0);

        // 触发加载结束
        await until(targetIsVisible).toBe(true);
        await delay(100);
        expect(targetRef.value?.isFinished).toBe(true);
        expect(load).toHaveBeenCalledTimes(1);

        // reset 后 isFinished 被重置为 false
        targetRef.value!.reset();
        expect(targetRef.value?.isFinished).toBe(false);
      });
    });
  });

  describe('插槽', () => {
    it('前置内容插槽 / 后置内容插槽', async () => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      const prependRef = ref<HTMLDivElement>();
      const appendRef = ref<HTMLDivElement>();
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
        slots: {
          prepend: () => h('div', {
            ref: prependRef,
            class: 'prepend',
          }),
          append: () => h('div', {
            ref: appendRef,
            class: 'append',
          }),
        },
      });

      const el = unrefElement<HTMLDivElement>(targetRef as any)!;

      // 组件还未加载数据
      expect(prependRef.value!.className).toBe('prepend');
      expect(appendRef.value!.className).toBe('append');
      expect(el.firstElementChild).toBe(prependRef.value);
      expect(el.lastElementChild).toBe(appendRef.value);
      expect(el.children.length).toBe(2);

      // 组件加载数据完成
      await until(targetIsVisible).toBe(true);
      await delay(100);
      expect(prependRef.value!.className).toBe('prepend');
      expect(appendRef.value!.className).toBe('append');
      expect(el.firstElementChild).toBe(prependRef.value);
      expect(el.lastElementChild).toBe(appendRef.value);
      expect(el.children.length).toBe(12);
    });

    it('前置内容及后置内容插槽会传入组件状态', async () => {
      const targetRef = ref<MixteInfiniteScrollInstance>();
      const targetIsVisible = ref(false);
      render(NormalComponent, {
        props: { targetRef, isVisible: targetIsVisible, interval: 0 },
      });
      const el = unrefElement(targetRef as any)!;

      function getStatus() {
        return pick(targetRef.value!, ['isLoading', 'isEmpty', 'isFinished', 'error']);
      }

      // 组件还未加载数据
      expect(prependSlot).toHaveBeenCalled();
      expect(appendSlot).toHaveBeenCalled();
      expect(prependSlot).toHaveBeenCalledWith(getStatus());
      expect(appendSlot).toHaveBeenCalledWith(getStatus());

      // 初始加载数据
      await until(targetIsVisible).toBe(true);
      await delay(100);
      expect(prependSlot).toHaveBeenCalledWith(getStatus());
      expect(appendSlot).toHaveBeenCalledWith(getStatus());

      // 二次加载数据 - 加载结束
      loadDataCount = 0;
      el.scrollTop = el.scrollHeight;
      await delay(100);
      expect(prependSlot).toHaveBeenCalledWith(getStatus());
      expect(appendSlot).toHaveBeenCalledWith(getStatus());
    });
  });
});
