import { Injectable, signal } from '@angular/core';
import type { ConfirmationDialogParams } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  currentDialogParams = signal<ConfirmationDialogParams | null>(null);

  show(params: ConfirmationDialogParams) {
    this.currentDialogParams.set(params);
  }
}
