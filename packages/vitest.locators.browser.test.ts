import { page } from 'vitest/browser';
import '@/vitest.locators';

describe('vitest.locators', () => {
  let root: HTMLDivElement;
  let activeItem: HTMLDivElement;
  let secondItem: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    root.id = 'mixte-locators-root';
    root.className = 'mixte-locators';
    root.dataset.role = 'root';

    activeItem = document.createElement('div');
    activeItem.className = 'mixte-locators-item active';
    activeItem.dataset.index = '0';

    secondItem = document.createElement('div');
    secondItem.className = 'mixte-locators-item';
    secondItem.dataset.index = '1';
    secondItem.dataset.role = 'item';

    root.append(activeItem, secondItem);
    document.body.appendChild(root);
  });

  afterEach(() => {
    root.remove();
  });

  it('getById', () => {
    expect(page.getById('mixte-locators-root').query()).toBe(root);
  });

  it('getByClass', () => {
    // 传入类名
    const items = page.getByClass('mixte-locators-item').elements() as HTMLDivElement[];

    expect(items).toStrictEqual([activeItem, secondItem]);

    // 传入完整的类选择器
    expect(page.getByClass('.mixte-locators-item.active').query()).toBe(activeItem);
  });

  it('getByAttr', () => {
    expect(page.getByAttr('data-role', 'root').query()).toBe(root);
  });

  it('getByAttrs', () => {
    // 不传类名
    expect(page.getByAttrs({ 'data-index': '0' }).query()).toBe(activeItem);

    // 传入类名
    expect(page.getByAttrs({ 'data-index': '1' }, 'mixte-locators-item').query()).toBe(secondItem);

    // 传入完整的类选择器, 支持多个属性
    expect(page.getByAttrs({ 'data-index': '1', 'data-role': 'item' }, '.mixte-locators-item').query()).toBe(secondItem);
  });
});
