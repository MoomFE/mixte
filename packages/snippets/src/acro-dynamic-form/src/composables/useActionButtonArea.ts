import { computed } from 'vue';
import { isBoolean } from 'mixte';
import type { AcroDynamicFormProps, AcroDynamicFormSlots } from '../types';

export function useActionButtonArea(props: AcroDynamicFormProps, slots: AcroDynamicFormSlots) {
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

    return show && (
      showSubmitButton.value || showResetButton.value || slots.actionButtonPrepend || slots.actionButtonAppend
    );
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

  /** 传递给操作按钮区域 FormItem 组件的参数 */
  const actionButtonAreaProps = computed(() => {
    const options = props.actionButtonArea;
    return isBoolean(options) ? undefined : options?.props;
  });
  /** 传递给提交按钮组件的参数 */
  const submitButtonProps = computed(() => {
    const options = props.submitButton;
    return isBoolean(options) ? undefined : options?.props;
  });
  /** 传递给重置按钮组件的参数 */
  const resetButtonProps = computed(() => {
    const options = props.resetButton;
    return isBoolean(options) ? undefined : options?.props;
  });

  return {
    showActionButtonArea,
    showSubmitButton,
    showResetButton,

    submitButtonText,
    resetButtonText,

    actionButtonAreaProps,
    submitButtonProps,
    resetButtonProps,
  };
}
