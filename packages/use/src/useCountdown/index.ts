import type { Ref } from 'vue-demi';
import type { MaybeRefOrGetter, TransitionOptions } from '@vueuse/core';
import { whenever, wheneverEffectScopeImmediate } from '@mixte/use';
import { TransitionPresets, executeTransition, syncRef, toValue, tryOnScopeDispose } from '@vueuse/core';
import { computed, ref, watch } from 'vue-demi';

export interface UseCountdownOptions {
  /**
   * 倒计时所使用的时间 ( 毫秒 )
   * @default 60 * 1000
   */
  duration?: MaybeRefOrGetter<number>;
}

/**
 * 创建一个倒计时
 *
 * @see https://mixte.moomfe.com/mixte/use/useCountdown
 * @param source 倒计时初始数字
 * @param options 倒计时选项
 */
export function useCountdown(source: MaybeRefOrGetter<number>, options: UseCountdownOptions = {}) {
  const {
    duration = 60 * 1000,
  } = options;

  /** 是否开始倒计时 */
  const isStart = ref(false);

  /** 倒计时初始数字 */
  const finalSource = ref(toValue(source));
  /** 倒计时所使用的时间 */
  const finalDuration = computed(() => toValue(duration));

  /** 倒计时输出数字 */
  const output = useTransition(finalSource, {
    duration: finalDuration,
    transition: TransitionPresets.linear,
    disabled: () => !isStart.value,
    onFinished: () => isStart.value = false,
  });

  /**
   * 开启倒计时
   */
  function start() {
    isStart.value = true;
    finalSource.value = 0;
  }
  /**
   * 结束倒计时
   */
  function stop() {
    isStart.value = false;
  }

  // 未开始倒计时时, 同步初始数字
  wheneverEffectScopeImmediate(() => !isStart.value, () => {
    syncRef(finalSource, computed(() => toValue(source)), { direction: 'rtl' });
  });

  return {
    isStart,
    output,
    start,
    stop,
  };
}

/**
 * 改造自 @vueuse/core 中的 useTransition
 * @see https://vueuse.org/core/useTransition
 */
function useTransition(source: Ref<number>, options: UseTransitionOptions): Ref<number> {
  const outputRef = ref(source.value);
  let currentId = 0;

  watch(source, async (toVal) => {
    if (toValue(options.disabled)) {
      outputRef.value = toVal;
      return;
    }

    const id = ++currentId;

    await executeTransition(outputRef, outputRef.value, toVal, {
      ...options,
      abort: () => id !== currentId,
    });

    id === currentId && options.onFinished();
  });

  whenever(() => options.disabled(), () => {
    currentId++;
  });

  tryOnScopeDispose(() => {
    currentId++;
  });

  return computed(() => options.disabled() ? source.value : outputRef.value);
}

interface UseTransitionOptions extends TransitionOptions {
  /**
   * Disables the transition
   */
  disabled: () => boolean;
  /**
   * Callback to execute after transition finishes
   */
  onFinished: () => void;
}
