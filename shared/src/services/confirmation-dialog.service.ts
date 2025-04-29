import { Injectable, signal } from '@angular/core';
import type { ConfirmationDialogParams } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class ConfirmationDialogService {
  currentDialogParams = signal<ConfirmationDialogParams | null>(null);

  show(params: ConfirmationDialogParams) {
    params.showYesNoButtons = typeof params.showYesNoButtons === 'boolean' ? params.showYesNoButtons : true;
    this.currentDialogParams.set(params);
  }

  close() {
    this.currentDialogParams.set(null);
  }
}
