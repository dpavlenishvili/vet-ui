import { WritableSignal } from '@angular/core';
import { VetIcon } from '@vet/shared';
import { AccessControl } from '@vet/auth';

export interface DashboardSidebarMenuItemBase {
  id: string;
  text: string;
  url: string | null;
  children?: DashboardSidebarMenuItemBase[];
  accessControl?: AccessControl;
}

export interface DashboardSidebarMenuItem extends DashboardSidebarMenuItemBase {
  icon: VetIcon;
  isExpanded: WritableSignal<boolean>;
}
