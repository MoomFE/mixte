import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';
import { omit } from 'lodash-es';
import { asyncForEach, deepClone, delay } from 'mixte';

describe('toggleThemeViewTransition', () => {
  const mockStartViewTransition = vi.fn(async (fn) => {
    return {
      ready: Promise.resolve(fn()),
    };
  });
  const mockDocumentElementAnimate = vi.fn(() => {
    return {
      finished: delay(300),
    };
  });

  let mockMatchMediaMatches = false;
  const mockMatchMedia = vi.fn(() => {
    return {
      matches: mockMatchMediaMatches,
    };
  });

  let startViewTransition: any;
  let documentElementAnimate: any;
  let matchMedia: any;

  beforeEach(() => { // @ts-expect-error
    startViewTransition = document.startViewTransition;// @ts-expect-error
    document.startViewTransition = mockStartViewTransition;
    mockStartViewTransition.mockClear();

    documentElementAnimate = document.documentElement.animate; // @ts-expect-error
    document.documentElement.animate = mockDocumentElementAnimate;
    mockDocumentElementAnimate.mockClear();

    matchMedia = window.matchMedia; // @ts-expect-error
    window.matchMedia = mockMatchMedia;
    mockMatchMediaMatches = false;
    mockMatchMedia.mockClear();
  });

  afterEach(async () => { // @ts-expect-error
    document.startViewTransition = startViewTransition;
    document.documentElement.animate = documentElementAnimate;
    window.matchMedia = matchMedia;
  });

  it('若浏览器不支持 `document.startViewTransition`, 传入的方法会被直接执行', async () => {
    const headChildrenLength = document.head.children.length;
    let isRun = false;

    // @ts-expect-error
    document.startViewTransition = undefined;

    const result = toggleThemeViewTransition(() => {
      isRun = true;
    });

    expect(mockStartViewTransition).toHaveBeenCalledTimes(0);
    expect(mockDocumentElementAnimate).toHaveBeenCalledTimes(0);
    expect(document.head.children.length).toBe(headChildrenLength);
    expect(isRun).toBe(true);

    await result;

    expect(mockStartViewTransition).toHaveBeenCalledTimes(0);
    expect(mockDocumentElementAnimate).toHaveBeenCalledTimes(0);
    expect(document.head.children.length).toBe(headChildrenLength);
  });

  it('若浏览器支持 `document.startViewTransition`, 执行正常流程', async () => {
    const headChildrenLength = document.head.children.length;
    let isRun = false;

    const result = toggleThemeViewTransition(() => {
      isRun = true;
    });

    expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
    expect(mockDocumentElementAnimate).toHaveBeenCalledTimes(0);
    expect(document.head.children.length).toBe(headChildrenLength + 1);
    expect(isRun).toBe(true);

    await nextTick();

    expect(mockStartViewTransition).toHaveBeenCalledTimes(1);
    expect(mockDocumentElementAnimate).toHaveBeenCalledTimes(1);
    expect(document.head.children.length).toBe(headChildrenLength + 1);

    await result;

    expect(document.head.children.length).toBe(headChildrenLength);
  });

  it('传入 reverse 选项时, 会根据 reverse 的值来决定动画的方向', async () => {
    let noClipPath: Keyframe[] = [];
    let trueClipPath: Keyframe[] = [];
    let falseClipPath: Keyframe[] = [];

    // 不传入
    {
      const result = toggleThemeViewTransition(() => {});

      await nextTick();

      noClipPath = deepClone(mockDocumentElementAnimate.mock.calls[0]);
      mockDocumentElementAnimate.mockClear();

      expect(noClipPath.length).not.toBe(0);

      await result;
    }

    // 传入 true
    {
      const result = toggleThemeViewTransition(() => {}, {
        reverse: () => true,
      });

      await nextTick();

      trueClipPath = deepClone(mockDocumentElementAnimate.mock.calls[0]);
      mockDocumentElementAnimate.mockClear();

      expect(trueClipPath.length).not.toBe(0);

      await result;
    }

    // 传入 false
    {
      const result = toggleThemeViewTransition(() => {}, {
        reverse: () => false,
      });

      await nextTick();

      falseClipPath = deepClone(mockDocumentElementAnimate.mock.calls[0]);
      mockDocumentElementAnimate.mockClear();

      expect(falseClipPath.length).not.toBe(0);

      await result;
    }

    expect(noClipPath[0].clipPath).toEqual((trueClipPath[0].clipPath as unknown as string[])!.toReversed());
    expect(noClipPath[0].clipPath).toEqual(falseClipPath[0].clipPath);

    expect(omit(noClipPath[1], 'pseudoElement')).toEqual(omit(trueClipPath[1], 'pseudoElement'));
    expect(omit(noClipPath[1], 'pseudoElement')).toEqual(omit(falseClipPath[1], 'pseudoElement'));

    expect(noClipPath[1].pseudoElement).toBe('::view-transition-new(root)');
    expect(trueClipPath[1].pseudoElement).toBe('::view-transition-old(root)');
    expect(falseClipPath[1].pseudoElement).toBe('::view-transition-new(root)');
  });

  it('传入 prefersReducedMotion 选项时, 若设置了偏好减少动画则不进行动画, 传入的方法会被直接执行', async () => {
    const headChildrenLength = document.head.children.length;
    let isRun = false;

    await asyncForEach([
      [undefined, false] as const,
      [true, false] as const,
      [false, false] as const,
      [undefined, true] as const,
      [true, true] as const,
      [false, true] as const,
    ], async ([prefersReducedMotion, _mockMatchMediaMatches]) => {
      isRun = false;
      mockMatchMediaMatches = _mockMatchMediaMatches;
      mockMatchMedia.mockClear();

      const result = toggleThemeViewTransition(() => {
        isRun = true;
      }, {
        prefersReducedMotion,
      });

      // 设置了检测 ( 不传时默认检测 ), 那么就会执行 window.matchMedia 方法
      expect(mockMatchMedia).toBeCalledTimes([undefined, true].includes(prefersReducedMotion) ? 1 : 0);
      // 测试是否执行了动画, 通过是否插入了样式来判断
      expect(document.head.children.length).toBe(
        // 设置了检测
        [undefined, true].includes(prefersReducedMotion)
          // 检测通过, 那就会执行动画
          ? !mockMatchMediaMatches ? headChildrenLength + 1 : headChildrenLength
          // 设置了不检测, 无论检测是否通过, 都会执行动画
          : headChildrenLength + 1,
      );
      // 无论如何, 传入的方法都会被执行
      expect(isRun).toBe(true);

      await result;

      // 插入的样式都会被重置
      expect(document.head.children.length).toBe(headChildrenLength);
    });
  });
});
