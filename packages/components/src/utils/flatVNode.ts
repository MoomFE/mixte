import { isNumber, isObject, isString } from 'mixte';
import { Comment, Fragment, createTextVNode } from 'vue-demi';
import type { VNode, VNodeChild } from 'vue-demi';

export function flatVNode(vNodes?: VNodeChild[], nodes: VNode[] = []) {
  vNodes?.forEach((vNode) => {
    if (vNode == null) return;
    if (!isObject(vNode)) {
      if (isString(vNode) || isNumber(vNode))
        nodes.push(createTextVNode(`${vNode}`));
      return;
    }
    if (Array.isArray(vNode))
      return flatVNode(vNode, nodes);
    if (vNode.type === Fragment) {
      if (Array.isArray(vNode.children))
        return flatVNode(vNode.children, nodes);
    }
    if (vNode.type !== Comment)
      nodes.push(vNode);
  });
  return nodes;
}
