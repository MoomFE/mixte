import { deepClone, toArray } from 'mixte';
import type { AcroDynamicFormField, AcroDynamicFormProps } from '../types';

type PresetAcroDynamicFormProps = AcroDynamicFormProps;
type PresetAcroDynamicFormField = Omit<AcroDynamicFormField, 'field'>;

interface Preset {
  form: PresetAcroDynamicFormProps;
  fields: PresetAcroDynamicFormField[];
}

interface PresetSetupOptions {
  /** 定义该预设下的组件配置 */
  defineFormConfig: (config: PresetAcroDynamicFormProps) => void;
  /** 定义该预设下的字段配置 */
  defineFieldsConfig: (fields: PresetAcroDynamicFormField[]) => void;
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

  function defineFormConfig(config: PresetAcroDynamicFormProps) {
    preset.form = config;
  }

  function defineFieldsConfig(fields: PresetAcroDynamicFormField[]) {
    preset.fields = fields;
  }

  setup({
    defineFormConfig,
    defineFieldsConfig,
  });

  presetMap.set(key, preset);

  return key;
}

/**
 * 解析字段配置, 合并预设
 * @private
 */
export function resolveAcroDynamicFormFieldConfig(field: AcroDynamicFormField) {
  const preset = toArray(field.preset);

  if (!preset.length)
    return field;

  const configs = preset.map(key => presetMap.get(key)!);

  return configs.reduce(
    (finalField, { fields }) => {
      const config = fields.find(({ type }) => field.type === type);

      return {
        ...finalField,
        ...config,
      };
    },
    deepClone(field),
  );
}
