import { SVGIcon } from '@progress/kendo-angular-icons';
import { WritableSignal } from '@angular/core';

export interface ShortTermProgram {
  id: number;
  name: string;
  icon: string;
  institutionName: string;
  level: number;
  type: string;
  durationWeeks: number;
  field: string;
  location: string;
}

export interface ShortRegistrationSidebarMenuItemBase {
  id: string;
  text: string;
  isActive: boolean;
  url: string | null;
}

export interface ShortRegistrationSidebarMenuItem extends ShortRegistrationSidebarMenuItemBase {
  icon: SVGIcon;
  isExpanded: WritableSignal<boolean>;
  children?: ShortRegistrationSidebarMenuItemBase[];
}

export interface ShortTermProgramFilters {
  search?: string | null;
  program_name_or_code?: string | null;
  field?: string | null;
  region?: number | null;
  district?: number | null;
  organisation_name?: string | null;
  program_kind?: string | null;
  start_study?: string | null;
  end_study?: string | null;
  financing_type?: string | null;
  partner?: string | null;
  current?: boolean | null;
  planned?: boolean | null;
}

export interface ShortTermRegisteredListenersFilters {
  organisation_name?: string | null;
  program_name_or_code?: string | null;
  tuition_start_date?: string | null;
}

export interface ShortApplicationsListenersFilters {
  organisation_id: string;
  program_id?: string;
  program_admission_id?: string;
}

export interface ShortStatsFilters {
  organisation_id?: string;
  program?: string;
  program_kind?: string;
}

export interface ShortAdmissionEligibility {
  eligibility: {
    eligible: boolean;
    flowId: number;
    personsExistingFlowsErrors: {
      error: ShortAdmissionErrors;
      id: number;
      state: {
        id: number;
        name: string;
      };
      studyEndDate: string | null;
    }[];
    programPreRequisiteErrors: ShortAdmissionErrors[];
  };
}

export interface ShortAdmissionErrors {
  errorCode: string;
  reason: string;
}
