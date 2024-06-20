import type { AcroDynamicFormField, AcroDynamicFormProps } from '../types';

interface PresetSetupOptions {
  /** 定义该预设下的组件配置 */
  defineFormConfig: (config: AcroDynamicFormProps) => void;
  /** 定义该预设下的字段配置 */
  defineFieldsConfig: (fields: AcroDynamicFormField[]) => void;
}

interface Preset {
  form: AcroDynamicFormProps;
  fields: AcroDynamicFormField[];
}

/**
 * 预设映射缓存
 * @private
 */
export const presetMap = new WeakMap<symbol, Preset>();

/**
 * 定义 AcroDynamicForm 预设
 */
export function defineAcroDynamicFormPreset(
  setup: (options: PresetSetupOptions) => void,
) {
  const key = Symbol('AcroDynamicFormPreset');
  const preset: Preset = {
    form: {},
    fields: [],
  };

  function defineFormConfig(config: AcroDynamicFormProps) {
    preset.form = config;
  }

  function defineFieldsConfig(fields: AcroDynamicFormField[]) {
    preset.fields = fields;
  }

  setup({
    defineFormConfig,
    defineFieldsConfig,
  });

  presetMap.set(key, preset);

  return key;
}
