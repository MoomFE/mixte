import type { ComponentConfig, ComponentInfo } from './types';
import { useComponent, useComponentStore, useEditor, useEditorStore, usePreview, usePreviewStore, useProvideStore, useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';

const Slot = defineComponent({ setup: () => () => null });
const SlotPlaceholder = defineComponent({ setup: () => () => null });

function createConfig(id: string, name: string): ComponentConfig<any> {
  return { id, name, displayName: name, config: {} };
}

/** 挂载一个提供低代码编辑器注入状态的组件, 并返回在组件内注入到的状态 */
function mountStore() {
  const list = ref<ComponentConfig<any>[]>([
    createConfig('component-1', 'LayoutDiv'),
    createConfig('component-2', 'LayoutText'),
  ]);
  const componentsInfo: Record<string, ComponentInfo<any>> = {};
  const groupEnum = { layout: '布局组件' };

  let store!: NonNullable<ReturnType<typeof useStore>>;
  let editor!: NonNullable<ReturnType<typeof useEditor>>;

  const Harness = defineComponent({
    setup() {
      useProvideStore({ componentsInfo, groupEnum }, list);
      store = useStore()!;
      useEditorStore();
      editor = useEditor()!;
      return () => null;
    },
  });

  const wrapper = mount(Harness);

  return {
    wrapper,
    list,
    componentsInfo,
    groupEnum,
    store,
    editor,
  };
}

describe('low-code-editor/config-provider-Injection-state', () => {
  describe('useStore', () => {
    it('返回传入的组件列表与组件信息', () => {
      const { store, list, componentsInfo, groupEnum } = mountStore();

      expect(store.list).toBe(list);
      expect(store.componentsInfo.value).toBe(componentsInfo);
      expect(store.groupEnum.value).toBe(groupEnum);
    });
  });

  describe('useEditor', () => {
    it('activeComponentConfig 根据当前激活的组件 ID 计算', () => {
      const { editor, list } = mountStore();

      expect(editor.activeComponentConfig.value).toBeUndefined();

      editor.activeComponentId.value = 'component-2';
      expect(editor.activeComponentConfig.value).toBe(list.value[1]);

      editor.activeComponentId.value = 'not-exist';
      expect(editor.activeComponentConfig.value).toBeUndefined();
    });

    it('拖拽 / 悬浮组件时同步页面光标样式', async () => {
      const { editor } = mountStore();

      expect(document.documentElement.style.cursor).toBe('');

      editor.hoverComponentId.value = 'component-1';
      await nextTick();
      expect(document.documentElement.style.cursor).toBe('pointer');

      editor.dragComponentId.value = 'component-1';
      await nextTick();
      expect(document.documentElement.style.cursor).toBe('grabbing');

      editor.dragComponentId.value = undefined;
      editor.hoverComponentId.value = undefined;
      await nextTick();
      expect(document.documentElement.style.cursor).toBe('');
    });
  });

  describe('usePreview / useComponent', () => {
    it('返回传入的 Slot 与 SlotPlaceholder', () => {
      let preview!: NonNullable<ReturnType<typeof usePreview>>;
      let component!: NonNullable<ReturnType<typeof useComponent>>;

      const Harness = defineComponent({
        setup() {
          usePreviewStore({ Slot });
          preview = usePreview()!;
          useComponentStore({ SlotPlaceholder });
          component = useComponent()!;
          return () => null;
        },
      });

      mount(Harness);

      expect(preview.Slot.value).toBe(Slot);
      expect(component.SlotPlaceholder.value).toBe(SlotPlaceholder);
    });

    it('未传入 SlotPlaceholder 时为 undefined', () => {
      let component!: NonNullable<ReturnType<typeof useComponent>>;

      const Harness = defineComponent({
        setup() {
          useComponentStore({});
          component = useComponent()!;
          return () => null;
        },
      });

      mount(Harness);

      expect(component.SlotPlaceholder.value).toBeUndefined();
    });
  });
});
