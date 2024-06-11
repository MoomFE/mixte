import { computed } from 'vue';
import { isBoolean } from 'mixte';
import type { AcroDynamicFormProps } from '../types';

export function useActionButtonArea(props: AcroDynamicFormProps) {
  /** 是否显示提交按钮 */
  const showSubmitButton = computed(() => {
    const options = props.submitButton;
    return isBoolean(options) ? options : (options?.show ?? true);
  });

  /** 是否显示重置按钮 */
  const showResetButton = computed(() => {
    const options = props.resetButton;
    return isBoolean(options) ? options : (options?.show ?? true);
  });

  /** 是否显示操作按钮区域 */
  const showActionButtonArea = computed(() => {
    const options = props.actionButtonArea;
    const show = isBoolean(options) ? options : (options?.show ?? true);

    return show && (showSubmitButton.value || showResetButton.value);
  });

  /** 提交按钮文字 */
  const submitButtonText = computed(() => {
    const options = props.submitButton;
    return (isBoolean(options) ? undefined : options?.text) ?? '提交';
  });

  /** 重置按钮文字 */
  const resetButtonText = computed(() => {
    const options = props.resetButton;
    return (isBoolean(options) ? undefined : options?.text) ?? '重置';
  });

  return {
    showSubmitButton,
    showResetButton,
    showActionButtonArea,

    submitButtonText,
    resetButtonText,
  };
}
