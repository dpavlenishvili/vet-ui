import { Admission, IdName, ProgramPartner, RegistereCount } from '@vet/backend';
import { Translatable } from '@vet/shared';
import { TemplateRef } from '@angular/core';

export interface ProgramFilters {
  search?: string | null;
  program_name_or_code?: string | null;
  field?: string | null;
  region?: string | null;
  district?: string | null;
  organisation_name?: string | null;
  program_kind?: string | null;
  program_types?: string | null;
  duration?: string | null;
  tuition_start_date?: string | null;
  tuition_end_date?: string | null;
  financing_type?: string | null;
  partner?: string | null;
  current?: boolean | null;
  planned?: boolean | null;
  integrated?: boolean | null;
  admission_open?: boolean | null;
}

export interface ProgramShow {
  id?: number;
  program_name?: string;
  isced_code?: string;
  isced_description?: string[] | null;
  goal?: string;
  program_kind?: IdName;
  education_level?: IdName;
  region?: IdName;
  program_duration?: string;
  organisation?: {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    website?: string;
  };
  path?: string;
  type?: string;
  program_id?: number;
  specialization_code?: string;
  specialization_name?: string;
  qualification_name?: string;
  program_code?: string;
  address?: string;
  email?: string;
  responsible_person_phone?: string;
  language_id?: number;
  is_integrated?: boolean;
  district?: IdName;
  description?: string;
  partner?: string;
  video_url?: string | null;
  is_eligible?: boolean | null;
  registered?: RegistereCount;
  gallery?: string[] | null;
  partners?: ProgramPartner[];
  admissions?: Admission[];
}

export interface Organisation {
  name?: string;
  id?: number;
  website?: string;
  email?: string;
  phone?: string;
}

export interface RegisteredCount {
  count?: number | null;
  spec_count?: number | null;
}

export interface FinancingType {
  id: number | null;
  name: string | null;
}

export interface ProgramSectionItem {
  title: string | Translatable;
  content?: string | number | null | undefined | false | Translatable;
  template?: TemplateRef<unknown>;
}

export interface ProgramDetailItem {
  label: string | Translatable;
  value: string | number | null | undefined | false | Translatable;
}
