import { Injectable } from '@angular/core';
import { BaseStoredStateService } from './base-stored-state.service';
import { SessionStorageService } from './session-storage.service';

@Injectable({ providedIn: 'root' })
export class SessionStoredStateService extends BaseStoredStateService {
  constructor(sessionStorageService: SessionStorageService) {
    super(sessionStorageService);
  }
}
