import { Observable } from 'rxjs';
import type { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TemplateRef } from '@angular/core';

export interface QueryParams {
  [key: string]: any; // Allow any value type
}

export interface DictionaryType {
  id: number;
  name: string;
}

export interface ValueLabel {
  value: string | number;
  label: string;
}

export type Scalar = string | number | boolean;

export interface Option {
  label: string;
  value: Scalar;
}

export type UpdateFn<T> = (previousValue: T | null) => T;

export type DialogVariant = 'success' | 'error' | 'info' | 'warning';

export interface AlertDialogParams {
  variant?: DialogVariant;
  title?: string;
  text?: string;
  template?: TemplateRef<unknown>;
  onClose?: () => void | Observable<unknown>;
}

export interface ResolvedAlertDialogParams {
  variant: 'success' | 'error';
  title?: string;
  text?: string;
  template?: TemplateRef<unknown>;
  onClose?: () => void | Observable<unknown>;
}

export interface ConfirmationDialogParams {
  title?: string;
  content?: string;
  confirmButtonText?: string;
  dismissButtonText?: string;
  singleTypeDialogActionText?: string;
  showYesNoButtons?: boolean;
  onConfirm: () => void | Observable<unknown>;
  onDismiss?: () => void | Observable<unknown>;
}

export interface AppBreadCrumbItem extends Omit<BreadCrumbItem, 'text'> {
  path: string | null
  text: string | ((routeSnapshot: ActivatedRouteSnapshot) => string);
}

export interface ResolvedBreadCrumbItem extends Omit<BreadCrumbItem, 'text'> {
  path: string[];
  text: string | ((routeSnapshot: ActivatedRouteSnapshot) => string);
}

export interface UploadedFile {
  filename?: string;
  id?: string | number;
  file_name?: string;
  path?: string;
  download_url?: string;
  downloadUrl?: string;
  extension?: string;
  base64?: string;
}

export interface District {
  id?: number;
  name?: string;
  region_id?: number;
  region_name?: string;
}
