import { Scalar } from '@vet/shared';
import { FormGroup } from '@angular/forms';
import { Signal, TemplateRef } from '@angular/core';

export interface Option {
  label: string;
  value: Scalar;
}

export interface District {
  id?: number;
  name?: string;
  region_id?: number;
  region_name?: string;
}

export interface DictionaryType<ID = number> {
  id: ID;
  name: string;
}

export interface IdValue {
  id: string;
  value: string;
}

export interface ValueLabel<T extends string | number = string | number> {
  value: T;
  label: string;
}

export type ProgramType = 'short-term' | 'long-term';

export interface DistrictDictionaryType extends DictionaryType<number> {
  region_id: number;
  region_name: string;
}

export interface DistrictOption extends ValueLabel<number> {
  regionId: number;
  regionName: string;
}
