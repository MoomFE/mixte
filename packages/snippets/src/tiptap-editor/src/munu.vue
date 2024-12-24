<template>
  <Render />
</template>

<script lang="tsx" setup>
  import type { ChainedCommands, Editor } from '@tiptap/core';
  import type { FunctionalComponent } from 'vue';
  import type { MenuKeys, TiptapEditorMenuProps } from './types';
  import { useStore } from '@mixte/snippets/tiptap-editor/config-provider-Injection-state';
  import { Bold, Code, Italic, Redo, Strike, Underline, Undo } from '@mixte/snippets/tiptap-editor/icons';
  import { computed } from 'vue';

  const props = defineProps<TiptapEditorMenuProps>();

  const editor = useStore()?.editor;

  interface MenuOption {
    icon: FunctionalComponent;
    action: (chain: ChainedCommands) => ChainedCommands;
    active?: (editor: Editor) => boolean;
    disabled?: (editor: Editor) => boolean;
  }

  const menus: Partial<Record<MenuKeys, MenuOption>> = {
    undo: {
      icon: Undo,
      action: chain => chain.undo(),
      disabled: editor => !editor.can().undo(),
    },
    redo: {
      icon: Redo,
      action: chain => chain.redo(),
      disabled: editor => !editor.can().redo(),
    },
    bold: {
      icon: Bold,
      action: chain => chain.toggleBold(),
    },
    italic: {
      icon: Italic,
      action: chain => chain.toggleItalic(),
    },
    underline: {
      icon: Underline,
      action: chain => chain.toggleUnderline(),
    },
    strike: {
      icon: Strike,
      action: chain => chain.toggleStrike(),
    },
    code: {
      icon: Code,
      action: chain => chain.toggleCode(),
    },
  };

  const keys = computed<MenuKeys[]>(() => {
    if (props.keys?.length) return props.keys;
    return ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'strike', 'code'];
  });

  function RenderMenu(key: MenuKeys, menu?: MenuOption) {
    if (!menu) return;

    const active = menu.active?.(editor!.value!) ?? editor!.value!.isActive(key);
    const disabled = menu.disabled?.(editor!.value!) ?? false;

    return (
      <button
        class={{ active, disabled }}
        disabled={disabled}
        onClick={() => {
          menu.action(editor!.value!.chain().focus()).run();
        }}
      >
        <menu.icon />
      </button>
    );
  }

  function Render() {
    if (!editor?.value || !keys.value.length) return;

    return (
      <div class="mixte-tiptap-editor-menu">
        {
          keys.value.map((key) => {
            if (key === '|')
              return <div class="mixte-tiptap-editor-menu-split" />;

            return RenderMenu(key, menus[key]);
          })
        }
      </div>
    );
  }
</script>
