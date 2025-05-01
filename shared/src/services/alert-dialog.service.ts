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

  close() {
    this.currentDialogParams.set(null);
  }
}
