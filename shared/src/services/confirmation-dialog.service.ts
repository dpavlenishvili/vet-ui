import { Injectable, signal } from '@angular/core';
import type { ConfirmationDialogParams, DialogVariant } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  currentDialogParams = signal<ConfirmationDialogParams | null>(null);

  show(params: ConfirmationDialogParams) {
    params.showYesNoButtons = typeof params.showYesNoButtons === 'boolean' ? params.showYesNoButtons : true;
    this.currentDialogParams.set(params);
  }

  success(params: string | Omit<ConfirmationDialogParams, 'variant'>) {
    return this.showVariant('success', params);
  }

  error(params: string | Omit<ConfirmationDialogParams, 'variant'>) {
    return this.showVariant('error', params);
  }

  warning(params: string | Omit<ConfirmationDialogParams, 'variant'>) {
    return this.showVariant('warning', params);
  }

  close() {
    this.currentDialogParams.set(null);
  }

  private showVariant(
    type: DialogVariant,
    params: string | Omit<ConfirmationDialogParams, 'variant'>,
  ) {
    const dialogParams = typeof params === 'string'
      ? { content: params, onConfirm: () => {} }
      : params;

    return this.show({
      ...dialogParams,
      variant: type,
    });
  }
}
