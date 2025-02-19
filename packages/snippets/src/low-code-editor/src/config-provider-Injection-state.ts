import type { ComponentConfig, LowCodeEditorProps } from '@mixte/snippets/low-code-editor/types';
import type { CSSProperties, defineComponent, Ref } from 'vue';
import { createInjectionState } from '@vueuse/core';
import { computed, ref, toRef, watchEffect } from 'vue';

/** 低代码编辑器相关注入 */
export const [
  useProvideStore,
  useStore,
] = createInjectionState(<Config extends Record<string, any>>(props: LowCodeEditorProps<Config>, list: Ref<ComponentConfig<Config>[]>) => {
  const componentsInfo = toRef(props, 'componentsInfo');
  const groupEnum = toRef(props, 'groupEnum');

  return {
    componentsInfo,
    groupEnum,
    list,
  };
});

/** 编辑区域相关注入 */
export const [
  useEditorStore,
  useEditor,
] = createInjectionState(() => {
  const { list } = useStore()!;

  /** 正在拖拽的组件 ID */
  const dragComponentId = ref<string>();

  /** 当前鼠标悬浮的组件 ID */
  const hoverComponentId = ref<string>();
  /** 当前鼠标悬浮的组件元素 */
  const hoverComponentElement = ref<HTMLElement>();

  /** 当前激活的组件 ID */
  const activeComponentId = ref<string>();
  /** 当前激活的组件元素 */
  const activeComponentElement = ref<HTMLElement>();
  /** 当前激活的组件配置 */
  const activeComponentConfig = computed(() => {
    return list.value.find(item => item.id === activeComponentId.value);
  });

  watchEffect(() => {
    let cursor: CSSProperties['cursor'];

    if (dragComponentId.value) cursor = 'grabbing';
    else if (hoverComponentId.value) cursor = 'pointer';

    document.documentElement.style.cursor = cursor ?? '';
  });

  return {
    dragComponentId,

    hoverComponentId,
    hoverComponentElement,

    activeComponentId,
    activeComponentElement,
    activeComponentConfig,
  };
});

interface PreviewStoreProps {
  /** 组件列表渲染 ( 编辑和预览时使用不同的渲染 ) */
  Slot: ReturnType<typeof defineComponent>;
}

/** 预览区域相关注入 */
export const [
  usePreviewStore,
  usePreview,
] = createInjectionState((props: PreviewStoreProps) => {
  const Slot = toRef(props, 'Slot');

  return {
    Slot,
  };
});

interface ComponentStoreProps {
  /** 渲染空内容 */
  SlotPlaceholder?: ReturnType<typeof defineComponent>;
}

/** 组件相关注入 */
export const [
  useComponentStore,
  useComponent,
] = createInjectionState((props: ComponentStoreProps) => {
  const SlotPlaceholder = toRef(props, 'SlotPlaceholder');

  return {
    SlotPlaceholder,
  };
});
