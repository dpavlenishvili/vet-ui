import { DictionaryType, DistrictDictionaryType, DistrictOption, IdValue, Option, ValueLabel } from './types';

export function dictionaryItemToOption(dictionaryItem: DictionaryType): Option {
  return {
    value: dictionaryItem.id,
    label: dictionaryItem.name,
  };
}

export function isValidIdValue(input: Partial<IdValue>): input is IdValue {
  return input.id != null && input.value != null;
}

export function isValidDictionaryItem<T extends string | number>(
  input: Partial<DictionaryType<T>>,
): input is DictionaryType<T> {
  return input.id != null && input.name != null;
}

export function mapIdValueToOption(idValue: IdValue): ValueLabel {
  return {
    value: idValue.id,
    label: idValue.value,
  };
}

export function mapDictionaryItemToOption<T extends string | number>(item: DictionaryType<T>): ValueLabel<T> {
  return {
    value: item.id,
    label: item.name,
  };
}

export function isValidDistrictDictionaryType(input: Partial<DistrictDictionaryType>): input is DistrictDictionaryType {
  return input.region_id != null;
}

export function mapDistrictItemToOption(item: DistrictDictionaryType): DistrictOption {
  return {
    value: item.id,
    label: item.name,
    regionId: item.region_id,
    regionName: item.region_name,
  };
}
