import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { BaseStoredStateService } from './base-stored-state.service';

@Injectable({ providedIn: 'root' })
export class LocalStoredStateService extends BaseStoredStateService {
  constructor(localStorageService: LocalStorageService) {
    super(localStorageService);
  }
}
