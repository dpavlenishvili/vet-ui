import { Injectable, signal } from '@angular/core';
import type { AlertDialogParams } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class AlertDialogService {
  readonly currentDialogParams = signal<AlertDialogParams | null>(null);

  show(params: string | AlertDialogParams) {
    const dialogParams = typeof params === 'string'
      ? { text: params, variant: 'success' as const }
      : { ...params, variant: params.variant || 'success' };

    this.currentDialogParams.set(dialogParams);
  }

  success(params: string | Omit<AlertDialogParams, 'variant'>) {
    return this.showVariant('success', params);
  }

  error(params: string | Omit<AlertDialogParams, 'variant'>) {
    return this.showVariant('error', params);
  }

  info(params: string | Omit<AlertDialogParams, 'variant'>) {
    return this.showVariant('info', params);
  }

  warning(params: string | Omit<AlertDialogParams, 'variant'>) {
    return this.showVariant('warning', params);
  }

  close() {
    this.currentDialogParams.set(null);
  }

  private showVariant(
    type: AlertDialogParams['variant'],
    params: string | Omit<AlertDialogParams, 'variant'>,
  ) {
    return this.show({
      ...(typeof params === 'string' ? {} : params),
      variant: type,
      text: typeof params === 'string' ? params : params.text,
    })
  }
}
