import { Injectable, signal } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { DialogHandle, DialogModel, DialogParams } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class AppDialogService {
  private _openedDialogs = signal<Array<DialogModel<any>>>([]);

  readonly openedDialogs = this._openedDialogs.asReadonly();

  show<T>(params: DialogParams<T>): DialogHandle {
    const id = uuid();

    this._openedDialogs.update(items => [
      ...items,
      { id, ...params },
    ]);

    return {
      id,
      hide: () => this.hide(id),
    }
  }

  hide(id: string) {
    this._openedDialogs.update(items => items.filter(item => item.id !== id));
  }
}
