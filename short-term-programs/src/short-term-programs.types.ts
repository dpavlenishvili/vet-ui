import { SVGIcon } from '@progress/kendo-angular-icons';
import { Signal, TemplateRef, WritableSignal } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
