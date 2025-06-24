import { locators } from '@vitest/browser/context';

locators.extend({
  getById(id: string) {
    return `#${id}`;
  },
  getByClass(className: string) {
    return className.includes('.') ? className : `.${className}`;
  },
});

declare module '@vitest/browser/context' {
  interface LocatorSelectors {
    getById: (id: string) => Locator;
    getByClass: (className: string) => Locator;
  }
}
