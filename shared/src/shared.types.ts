import { Observable } from 'rxjs';
import type { BreadCrumbItem } from '@progress/kendo-angular-navigation';
import { ActivatedRouteSnapshot, Params } from '@angular/router';
import { Signal, TemplateRef, Type, WritableSignal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Translatable } from './shared.utils';

export interface QueryParams {
  [key: string]: any; // Allow any value type
}

export type Scalar = string | number | boolean;

export type UpdateFn<T> = (previousValue: T | null) => T;

export type DialogVariant = 'success' | 'error' | 'warning';

export interface DialogParams<T, Inputs = Record<string, unknown>> {
  id?: string;
  title?: string | Translatable;
  component?: Type<T>;
  template?: TemplateRef<unknown>;
  inputs?: Partial<Inputs>;
  outputs?: Record<string, (event?: any) => void>;
  text?: string;
  width?: string | number;
  height?: string | number;
  showHeader?: boolean;
  showActionsBar?: boolean;
  disablePadding?: boolean;
  transparent?: boolean;
  onClose?: () => void | Observable<unknown>;
}

export interface DialogModel<T, Inputs = Record<string, unknown>> extends Omit<DialogParams<T, Inputs>, 'id'> {
  id: string;
}

export interface DialogRef<T, Inputs = Record<string, unknown>> extends Omit<DialogParams<T, Inputs>, 'id'> {
  id: string;
  show(inputs?: Partial<Inputs>): void;
  hide(): void;
}

export interface DialogHandle {
  id: string;
  hide(): void;
}

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
  preventCloseOnKeyDown?: boolean;
  variant?: DialogVariant | 'default';
  onConfirm: () => void | Observable<unknown>;
  onDismiss?: () => void | Observable<unknown>;
}

export interface AppBreadCrumbItem extends Omit<BreadCrumbItem, 'text'> {
  path: string | null | ((routeSnapshot: ActivatedRouteSnapshot, params: Params) => string | null);
  text: string | ((routeSnapshot: ActivatedRouteSnapshot, params: Params) => string);
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

export interface SelectOption<T> {
  label: string;
  value: T | null;
}

export type FilterOptionsMap = Map<string, SelectOption<string>[]>;

export interface Storage {
  has(key: string): boolean;

  get(key: string): string | null;

  set(key: string, value: string): void;

  remove(key: string): void;

  getJSON(key: string): unknown | null;

  setJSON(key: string, value: object): void;
}

export interface StoredStateItem<T> {
  value: T;
  timestamp: number;
  ttl?: number;
}

export interface FrozenStoredSignal<T> {
  (): T;
}

export interface StoredSignal<T> {
  (): T;

  set(value: T): void;

  update(cb: (prev: T) => T): void;

  asReadonly(): FrozenStoredSignal<T>;
}

export type FormControls<T extends object> = {
  [K in keyof T]: FormControl<T[K]>;
};

export interface PaginatedGridResult<T = any> {
  data: T[];
  size: number;
  skip: number;
  total: number;
}

export interface ToggleSignal extends WritableSignal<boolean> {
  toggle: () => void;
}

export interface WizardStepDefinition {
  label: string;
  title: string;
  form: () => FormGroup;
  template: Signal<TemplateRef<unknown>>;
  path: string;
}
