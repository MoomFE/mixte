import type { CSS3DObject } from './CSS3DRenderer';
import type { User } from './types';
import { addHighlight, createCard, createElement, createHighlight, removeHighlight, updateCard, updateCardBg } from '@mixte/snippets/lottery/utils';

const user: User = {
  id: '1',
  name: '张三',
  jobNumber: '666',
};

/** 构造一个只包含 element 的假卡片, 用于测试卡片相关的工具方法 */
function createFakeCard(element: HTMLDivElement) {
  return { element } as unknown as CSS3DObject;
}

describe('lottery/utils', () => {
  describe('createHighlight', () => {
    it('根据年份生成高亮单元格坐标', () => {
      const highlight = createHighlight('2026');

      // 数字 2 / 0 / 2 / 6 的点阵, x 偏移依次为 1 / 5 / 9 / 13, y 偏移为 1
      expect(highlight.length).toBe(11 + 12 + 11 + 12);
      expect(new Set(highlight).size).toBe(highlight.length);

      // 第 1 个数字 2
      expect(highlight).toContain('1-1');
      expect(highlight).toContain('3-1');
      expect(highlight).toContain('2-5');
      // 第 2 个数字 0
      expect(highlight).toContain('5-1');
      expect(highlight).toContain('7-2');
      // 第 3 个数字 2
      expect(highlight).toContain('9-1');
      expect(highlight).toContain('11-5');
      // 第 4 个数字 6
      expect(highlight).toContain('13-1');
      expect(highlight).toContain('15-5');
    });

    it('默认使用当前年份', () => {
      expect(createHighlight()).toStrictEqual(
        createHighlight(`${new Date().getFullYear()}`),
      );
    });

    it('不同年份生成不同的高亮单元格', () => {
      expect(createHighlight('2026')).not.toStrictEqual(createHighlight('2025'));
    });
  });

  describe('createElement', () => {
    it('创建 div 元素, 并设置类名与内容', () => {
      const empty = createElement();

      expect(empty.tagName).toBe('DIV');
      expect(empty.className).toBe('');
      expect(empty.innerHTML).toBe('');

      const element = createElement('mixte', '<span>mixte</span>');

      expect(element.className).toBe('mixte');
      expect(element.innerHTML).toBe('<span>mixte</span>');
    });
  });

  describe('createCard', () => {
    it('设置卡片 ID / 类名 / 用户名 / 工号', () => {
      const card = createCard(user, false, 'a', false);

      expect(card.id).toBe('card-a');
      expect(card.classList.contains('mixte-lottery-card')).toBe(true);
      expect(card.querySelector('.name')!.textContent).toBe('张三');
      expect(card.querySelector('.details')!.textContent).toBe('666');
    });

    it('没有工号时不渲染工号节点', () => {
      const card = createCard({ id: '2', name: '李四' }, false, 2, false);

      expect(card.querySelector('.name')!.textContent).toBe('李四');
      expect(card.querySelector('.details')).toBeNull();
    });

    it('根据是否加粗与是否显示高亮来设置类名', () => {
      expect(createCard(user, false, 1, false).classList.contains('lightitem')).toBe(false);

      expect(createCard(user, true, 1, false).classList.contains('lightitem')).toBe(true);
      expect(createCard(user, true, 1, false).classList.contains('highlight')).toBe(false);

      expect(createCard(user, true, 1, true).classList.contains('highlight')).toBe(true);
    });

    it('设置随机透明度的背景色', () => {
      const card = createCard(user, false, 1, false);

      expect(card.style.backgroundColor).toMatch(/^rgba\(var\(--mixte-lottery-primary-rgb\), 0\.\d+\)$/);
    });
  });

  describe('updateCard', () => {
    it('使用新的用户信息更新卡片内容', () => {
      const element = createCard(user, false, 1, false);

      updateCard(createFakeCard(element), { id: '2', name: '李四', jobNumber: '888' });

      expect(element.querySelector('.name')!.textContent).toBe('李四');
      expect(element.querySelector('.details')!.textContent).toBe('888');
    });
  });

  describe('updateCardBg', () => {
    it('重新设置卡片背景色', () => {
      const element = createCard(user, false, 1, false);

      updateCardBg(createFakeCard(element));

      expect(element.style.backgroundColor).toMatch(/^rgba\(var\(--mixte-lottery-primary-rgb\), 0\.\d+\)$/);
    });
  });

  describe('addHighlight / removeHighlight', () => {
    it('只会给加粗的卡片添加高亮, 并移除所有高亮与中奖样式', () => {
      const boldElement = createCard(user, true, 1, false);
      const normalElement = createCard(user, false, 2, false);
      const cards = [createFakeCard(boldElement), createFakeCard(normalElement)];

      addHighlight(cards);
      expect(boldElement.classList.contains('highlight')).toBe(true);
      expect(normalElement.classList.contains('highlight')).toBe(false);

      boldElement.classList.add('prize');

      removeHighlight(cards);
      expect(boldElement.classList.contains('highlight')).toBe(false);
      expect(boldElement.classList.contains('prize')).toBe(false);
      expect(normalElement.classList.contains('highlight')).toBe(false);
    });
  });
});
