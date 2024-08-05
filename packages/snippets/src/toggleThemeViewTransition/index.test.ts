import { toggleThemeViewTransition } from '@mixte/snippets/toggleThemeViewTransition';
import { omit } from 'lodash-es';
import { deepClone, delay } from 'mixte';

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

  let startViewTransition: any;
  let documentElementAnimate: any;

  beforeEach(() => { // @ts-expect-error
    startViewTransition = document.startViewTransition;// @ts-expect-error
    document.startViewTransition = mockStartViewTransition;
    mockStartViewTransition.mockClear();

    documentElementAnimate = document.documentElement.animate; // @ts-expect-error
    document.documentElement.animate = mockDocumentElementAnimate;
    mockDocumentElementAnimate.mockClear();
  });

  afterEach(async () => { // @ts-expect-error
    document.startViewTransition = startViewTransition;
    document.documentElement.animate = documentElementAnimate;
  });

  it('若浏览器不支持 `document.startViewTransition`, 传入的方法会被直接执行', () => {
    const headChildrenLength = document.head.children.length;
    let isRun = false;

    // @ts-expect-error
    document.startViewTransition = undefined;

    toggleThemeViewTransition(() => {
      isRun = true;
    });

    expect(document.head.children.length).toBe(headChildrenLength);
    expect(isRun).toBe(true);
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

    expect(mockDocumentElementAnimate).toHaveBeenCalledTimes(1);

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
});
