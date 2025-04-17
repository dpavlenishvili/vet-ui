import { Injectable, signal } from '@angular/core';
import type { AlertDialogParams } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class AlertDialogService {
  currentDialogParams = signal<AlertDialogParams | null>(null);

  show(params: string | AlertDialogParams) {
    this.currentDialogParams.set(typeof params === 'string' ? {
      text: params
    } : params);
  }

  close() {
    this.currentDialogParams.set(null);
  }
}
