import type { Ref } from 'vue-demi';
import { delay } from 'mixte';
import { nextTick, toValue } from 'vue-demi';
import styleText from './index.scss?inline';

interface ToggleThemeViewTransitionOptions {
  x?: number;
  y?: number;
  reverse?: Ref<boolean> | (() => boolean);
}

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
  } = options;

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))}px at ${x}px ${y}px)`,
  ];

  const style = document.createElement('style');
  style.appendChild(document.createTextNode(styleText));
  document.head.appendChild(style);

  // eslint-disable-next-line ts/no-unused-expressions
  window.getComputedStyle(style).opacity;

  // @ts-expect-error
  await document.startViewTransition(async () => {
    toggle();
    await nextTick();
  }).ready;

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
  });
}
