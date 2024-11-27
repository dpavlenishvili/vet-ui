import { Observable } from 'rxjs';

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

export interface ConfirmationDialogParams {
    title?: string;
    content?: string;
    confirmButtonText?: string;
    dismissButtonText?: string;
    onConfirm: () => void | Observable<unknown>;
    onDismiss?: () => void | Observable<unknown>;
}
