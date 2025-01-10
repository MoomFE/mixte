import type { CSS3DObject } from './CSS3DRenderer';
import type { User } from './types';
import { randomNatural } from 'mixte';

const numberMatrix = [
  // 0
  [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2], [0, 3], [2, 3], [0, 4], [1, 4], [2, 4]],
  // 1
  [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3], [0, 4], [1, 4], [2, 4]],
  // 2
  [[0, 0], [1, 0], [2, 0], [2, 1], [0, 2], [1, 2], [2, 2], [0, 3], [0, 4], [1, 4], [2, 4]],
  // 3
  [[0, 0], [1, 0], [2, 0], [2, 1], [0, 2], [1, 2], [2, 2], [2, 3], [0, 4], [1, 4], [2, 4]],
  // 4
  [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2], [2, 3], [2, 4]],
  // 5
  [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [2, 3], [0, 4], [1, 4], [2, 4]],
  // 6
  [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2], [1, 2], [2, 2], [0, 3], [2, 3], [0, 4], [1, 4], [2, 4]],
  // 7
  [[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [2, 3], [2, 4]],
  // 8
  [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2], [0, 3], [2, 3], [0, 4], [1, 4], [2, 4]],
  // 9
  [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2], [2, 3], [0, 4], [1, 4], [2, 4]],
] as const;

/**
 * 根据年份生成特殊高亮单元格
 * @param year 年份
 */
export function createHighlight(year = `${new Date().getFullYear()}`) {
  const highlight: string[] = [];
  const step = 4;
  const yoffset = 1;
  let xoffset = 1;

  year.split('').forEach((k) => {
    highlight.push(
      ...numberMatrix[k as unknown as number].map((item) => {
        return `${item[0] + xoffset}-${item[1] + yoffset}`;
      }),
    );
    xoffset += step;
  });

  return highlight;
}

/**
 * 创建元素
 */
export function createElement(className?: string, html?: string) {
  const div = document.createElement('div');
  div.className = className ?? '';
  div.innerHTML = html ?? '';
  return div;
}

/**
 * 创建卡片
 */
export function createCard(user: User, isBold: boolean, id: string | number, showTable: boolean) {
  const el = createElement();
  el.id = `card-${id}`;
  el.className = 'mixte-lottery-card';
  el.style.backgroundColor = `rgba(var(--mixte-lottery-primary-rgb), ${randomNatural(25, 95) / 100})`;

  if (isBold) {
    el.classList.add('lightitem');
    if (showTable) {
      el.classList.add('highlight');
    }
  }

  el.appendChild(
    createElement('name', user.name),
  );

  user.jobNumber && el.appendChild(
    createElement('details', `${user.jobNumber}`),
  );

  return el;
}

/**
 * 修改指定卡片
 */
export function updateCard(card: CSS3DObject, user: User) {
  const el = card.element;
  const newEl = createCard(user, true, 1, false);

  el.innerHTML = newEl.innerHTML;
}

/**
 * 更新指定卡片背景
 */
export function updateCardBg(card: CSS3DObject) {
  card.element.style.backgroundColor = `rgba(var(--mixte-lottery-primary-rgb), ${randomNatural(25, 95) / 100})`;
}

/**
 * 移除所有的高亮单元格
 */
export function removeHighlight(cards: CSS3DObject[]) {
  cards.forEach((card) => {
    const classList = card.element.classList;

    classList.remove('highlight');
    classList.remove('prize');
  });
}

/**
 * 添加高亮单元格
 */
export function addHighlight(cards: CSS3DObject[]) {
  cards.forEach((card) => {
    const el = card.element;

    if (el.classList.contains('lightitem')) {
      el.classList.add('highlight');
    }
  });
}
