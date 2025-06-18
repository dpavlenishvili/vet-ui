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

  info(params: string | Omit<ConfirmationDialogParams, 'variant'>) {
    return this.showVariant('info', params);
  }

  warning(params: string | Omit<ConfirmationDialogParams, 'variant'>) {
    return this.showVariant('warning', params);
  }

  // Convenience method for simple yes/no confirmations with variant
  confirm(
    content: string,
    options: {
      title?: string;
      variant?: DialogVariant | 'default';
      confirmText?: string;
      dismissText?: string;
    } = {}
  ) {
    return new Promise<boolean>((resolve) => {
      this.show({
        title: options.title,
        content,
        variant: options.variant,
        confirmButtonText: options.confirmText,
        dismissButtonText: options.dismissText,
        onConfirm: () => resolve(true),
        onDismiss: () => resolve(false),
      });
    });
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
