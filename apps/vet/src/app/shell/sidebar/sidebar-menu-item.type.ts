import { WritableSignal } from '@angular/core';
import { AccessControl } from '@vet/auth';
import { VetIcon } from '@vet/shared/icons';

export interface SidebarMenuItem {
  id: string | number;
  text: string;
  url?: string | null;
  children?: this[];
  accessControl?: AccessControl;
  icon?: VetIcon;
  isExpanded?: WritableSignal<boolean>;
}
