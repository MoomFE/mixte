import type { ReactElement } from 'react';
import type { Component, VNodeChild } from 'vue';
import type { RewriteRolesType } from './types';
import { isFunction } from 'mixte';
import React from 'react';
import { applyPureReactInVue, applyPureVueInReact, VueContainer } from 'veaury';
import { isVNode, shallowRef } from 'vue';

/**
 * Vue 组件或插槽参数类型
 */
export type VueCompOrSlot<T = string> = T | (() => VNodeChild) | Component;

/**
 * 在 React 中渲染 Vue 组件或插槽
 */
export function renderVueCompOrSlot(comp?: VueCompOrSlot<any>): ReactElement {
  if (isFunction(comp) || comp?.setup || comp?.render) {
    return React.createElement(
      applyPureVueInReact(comp) as () => ReactElement,
    );
  }

  if (isVNode(comp)) {
    return React.createElement(VueContainer as any, { node: comp });
  }

  return comp;
}

/**
 * 在 Vue 环境中执行 React 函数并捕获其返回值
 * 创建一个不渲染任何内容的React组件, 但可以获取函数执行的结果
 * @param fn 要在React上下文中执行的函数
 * @returns 包含不可见组件和状态引用的对象
 */
export function useReactFunction<
  T,
>(fn: () => T) {
  const status = shallowRef<T>();

  const Comp: Component = applyPureReactInVue(() => {
    status.value = fn();

    return null;
  });

  return {
    Comp,
    status,
  };
}

/**
 * 定义 BubbleList 气泡默认属性
 */
export function defineBubbleListRoles<T extends RewriteRolesType>(roles: T): T {
  return roles;
}
