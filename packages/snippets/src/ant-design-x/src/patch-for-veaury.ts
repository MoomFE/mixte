import { isBrowser } from 'mixte';

if (isBrowser) {
  document.head.appendChild(document.createElement('style')).innerHTML = `
    div[__use_react_component_wrap], div[data-use-vue-component-wrap] {
      display: contents !important;
    }
  `;
}
