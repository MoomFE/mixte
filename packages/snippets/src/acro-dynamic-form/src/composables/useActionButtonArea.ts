import type { SetRequired } from 'type-fest';
import { computed } from 'vue';
import { deepMerge, isBoolean } from 'mixte';
import { reactiveComputed } from '@vueuse/core';
import type { AcroDynamicFormProps, AcroDynamicFormSlots, ActionButtonAreaOptions, SubmitButtonOptions } from '../types';

export function useActionButtonArea(props: AcroDynamicFormProps, slots: AcroDynamicFormSlots) {
  /** 操作按钮区域配置 */
  const actionButtonArea = reactiveComputed(() => {
    const actionButtonArea = props.actionButtonArea;
    const options: SetRequired<ActionButtonAreaOptions, 'show'> = { show: true };

    if (isBoolean(actionButtonArea)) options.show = actionButtonArea;
    else deepMerge(options, actionButtonArea);

    return options;
  });

  /** 提交按钮配置 */
  const submitButton = reactiveComputed(() => {
    const submitButton = props.submitButton;
    const options: SetRequired<SubmitButtonOptions, 'show' | 'text'> = { show: true, text: '提交' };

    if (isBoolean(submitButton)) options.show = submitButton;
    else deepMerge(options, submitButton);

    return options;
  });

  /** 重置按钮配置 */
  const resetButton = reactiveComputed(() => {
    const resetButton = props.resetButton;
    const options: SetRequired<SubmitButtonOptions, 'show' | 'text'> = { show: true, text: '重置' };

    if (isBoolean(resetButton)) options.show = resetButton;
    else deepMerge(options, resetButton);

    return options;
  });

  /** 是否显示操作按钮区域 */
  const showActionButtonArea = computed(() => {
    return actionButtonArea.show && (
      submitButton.show || resetButton.show || slots.actionButtonPrepend || slots.actionButtonAppend
    );
  });

  return {
    showActionButtonArea,

    actionButtonArea,
    submitButton,
    resetButton,
  };
}
