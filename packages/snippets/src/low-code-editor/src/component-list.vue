<!--
  组件列表
    - 展现组件分组, 可拖拽组件至画布中
-->

<template>
  <div class="mixte-lce-component-list">
    <template v-for="(list, name) in groups" :key="name">
      <!-- 分组名称 -->
      <div class="mixte-lcecl-group-name">
        <b>{{ groupEnum?.[name] || name }}</b>
      </div>
      <!-- 组件列表 -->
      <VueDraggable
        v-if="list.length"
        class="mixte-lcecl-group"
        :model-value="list"
        :sort="false"
        :group="{ name: 'component', pull: 'clone', put: false }"
        :animation="150"
        :force-fallback="true"
        :fallback-tolerance="10"
        :clone="clone"
        @start="() => dragComponentId = '666'"
        @end="() => dragComponentId = undefined"
      >
        <template v-for="{ config } in list" :key="config.name">
          <button class="mixte-lceclg-item">
            <div>{{ config.displayName }}</div>
          </button>
        </template>
      </VueDraggable>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { ComponentInfo } from '@mixte/snippets/low-code-editor/types';
  import { useEditor, useStore } from '@mixte/snippets/low-code-editor/config-provider-Injection-state';
  import { nanoid } from '@mixte/snippets/low-code-editor/utils';
  import { groupBy } from 'lodash-es';
  import { deepClone, omit } from 'mixte';
  import { computed } from 'vue';
  import { VueDraggable } from 'vue-draggable-plus';

  const { componentsInfo, groupEnum } = useStore()!;
  const { dragComponentId } = useEditor()!;

  const groups = computed(() => {
    return groupBy(componentsInfo.value ?? {}, 'config.group');
  });

  function clone({ config }: ComponentInfo<any>) {
    return omit(
      Object.assign(deepClone(config), {
        id: nanoid(),
      }),
      ['group'],
    );
  }
</script>
