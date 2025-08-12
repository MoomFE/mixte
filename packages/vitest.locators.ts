import { locators } from '@vitest/browser/context';

locators.extend({
  getById(id: string) {
    return `#${id}`;
  },
  getByClass(className: string) {
    return className.includes('.') ? className : `.${className}`;
  },
  getByAttr(attr: string, value: string) {
    return `[${attr}="${value}"]`;
  },
  getByAttrs(attrs: Record<string, string>) {
    return Object.entries(attrs)
      .map(([attr, value]) => `[${attr}="${value}"]`)
      .join('');
  },
});

declare module '@vitest/browser/context' {
  interface LocatorSelectors {
    getById: (id: string) => Locator;
    getByClass: (className: string) => Locator;
    getByAttr: (attr: string, value: string) => Locator;
    getByAttrs: (attrs: Record<string, string>) => Locator;
  }
}
