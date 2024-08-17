import type { Ref } from 'vue-demi';
import { delay } from 'mixte';
import { nextTick, toValue } from 'vue-demi';
import styleText from './index.scss?inline';

interface ToggleThemeViewTransitionOptions {
  /** X 轴坐标 ( 传递鼠标事件的 clientX ) */
  x?: number;
  /** Y 轴坐标 ( 传递鼠标事件的 clientY ) */
  y?: number;
  /** 是否反转动画 */
  reverse?: Ref<boolean> | (() => boolean);
  /**
   * 反转动画时匹配的选择器
   * @default '.dark'
   */
  reverseSelector?: string;
}

/**
 * 切换主题时的视图过渡动画
 *
 * @see https://vitepress.dev/guide/extending-default-theme#using-view-transitions-api
 * @param toggle 切换主题的方法
 * @param options 可选项
 */
export async function toggleThemeViewTransition(
  toggle: () => void,
  options: ToggleThemeViewTransitionOptions = {},
) {
  // @ts-expect-error
  if (!document.startViewTransition) {
    toggle();
    return;
  }

  const {
    x = 0,
    y = 0,
    reverse = () => false,
    reverseSelector = '.dark',
  } = options;

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
  ];

  const style = document.createElement('style');
  style.appendChild(document.createTextNode(styleText.replaceAll('._', reverseSelector)));
  document.head.appendChild(style);

  // eslint-disable-next-line ts/no-unused-expressions
  window.getComputedStyle(style).opacity;

  // @ts-expect-error
  await document.startViewTransition(async () => {
    toggle();
    await nextTick();
  }).ready;

  return new Promise<void>((resolve) => {
    const isReverse = toValue(reverse);
    const animation = document.documentElement.animate(
      { clipPath: isReverse ? clipPath.reverse() : clipPath },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: `::view-transition-${isReverse ? 'old' : 'new'}(root)`,
      },
    );

    animation.finished.then(async () => {
      await delay(1);
      document.head.removeChild(style);
      resolve();
    });
  });
}
