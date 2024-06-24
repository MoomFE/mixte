import { toArray } from 'mixte';
import { mergeProps } from 'vue';
import type { AcroDynamicFormField } from '../types';

type PresetAcroDynamicFormField = Omit<AcroDynamicFormField, 'field'>;

/**
 * 预设映射缓存
 * @private
 */
export const presetMap = new WeakMap<symbol, PresetAcroDynamicFormField>();

/**
 * 定义 AcroDynamicForm 预设
 */
export function defineAcroDynamicFormPreset<P extends Record<string, PresetAcroDynamicFormField>>(presets: P) {
  const presetKeyMap = {} as Record<keyof P, symbol>;

  Object.entries(presets).forEach(([name, preset]) => {
    const key = Symbol(name);
    presetMap.set(key, preset);
    presetKeyMap[name as keyof P] = key;
  });

  return presetKeyMap;
}

/**
 * 解析字段配置, 合并预设
 * @private
 */
export function resolveAcroDynamicFormFieldConfig(field: AcroDynamicFormField) {
  const preset = toArray(field.preset);

  if (!preset.length)
    return field;

  const configs = preset.map(key => presetMap.get(key)!) as AcroDynamicFormField[];

  return mergeAcroDynamicFormFieldConfig(
    configs.reduce(
      (presetFieldConfig, field) => mergeAcroDynamicFormFieldConfig(presetFieldConfig, field),
      {} as AcroDynamicFormField,
    ),
    field,
  );
}

/**
 * 合并字段配置
 */
export function mergeAcroDynamicFormFieldConfig(presetFieldConfig: AcroDynamicFormField, field: AcroDynamicFormField): AcroDynamicFormField {
  return {
    ...presetFieldConfig,
    ...field,

    field: field.field,

    formItemProps: mergeProps(presetFieldConfig.formItemProps ?? {}, field.formItemProps ?? {}),
    formItemSlots: {
      ...presetFieldConfig.formItemSlots,
      ...field.formItemSlots,
    },

    componentProps: mergeProps(presetFieldConfig.componentProps ?? {}, field.componentProps ?? {}),
    componentSlots: {
      ...presetFieldConfig.componentSlots,
      ...field.componentSlots,
    },
  };
}
