import type { ReactElement } from 'react';
import type { Component, VNodeChild } from 'vue';
import { isFunction } from 'mixte';
import React from 'react';
import { applyPureVueInReact } from 'veaury';

/**
 * Vue 组件或插槽参数类型
 */
export type VueCompOrSlot<T> = T | (() => VNodeChild) | Component;

/**
 * 在 React 中渲染 Vue 组件或插槽
 */
export function renderVueCompOrSlot(comp?: VueCompOrSlot<any>): ReactElement {
  if (isFunction(comp) || comp?.setup || comp?.render) {
    return React.createElement(
      applyPureVueInReact(comp) as () => ReactElement,
    );
  }

  return comp;
}
