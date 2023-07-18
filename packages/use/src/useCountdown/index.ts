import type { MaybeRefOrGetter } from 'vue-demi';
import { TransitionPresets, toValue, useTransition } from '@vueuse/core';
import { computed, ref, watch } from 'vue-demi';

export interface UseCountdownOptions {
  /**
   * 倒计时所使用的时间 ( 毫秒 )
   * @default 60 * 1000
   */
  duration?: MaybeRefOrGetter<number>
}

/**
 * 创建一个倒计时
 * @param source 倒计时初始数字
 * @param options 倒计时选项
 */
export function useCountdown(source: MaybeRefOrGetter<number>, options: UseCountdownOptions = {}) {
  const {
    duration = 60 * 1000,
  } = options;

  /** 是否开始倒计时 */
  const isStart = ref(false);
  /** 是否禁用倒计时转换计算 */
  const isDisabled = computed(() => !isStart.value);

  /** 倒计时初始数字 */
  const finalSource = ref(toValue(source));
  /** 倒计时所使用的时间 */
  const finalDuration = computed(() => toValue(duration));

  /** 倒计时输出数字 */
  const output = useTransition(finalSource, {
    duration: finalDuration,
    transition: TransitionPresets.linear,
    disabled: isDisabled,
    onFinished: () => (isStart.value = false),
  });

  /**
   * 开启倒计时
   */
  function start() {
    isStart.value = true;
  }
  /**
   * 结束倒计时
   */
  function stop() {
    isStart.value = false;
  }

  // 重置倒计时时间
  watch(isStart, (value) => {
    finalSource.value = value ? 0 : toValue(source);
  });

  return {
    isStart,
    output,
    start,
    stop,
  };
}
