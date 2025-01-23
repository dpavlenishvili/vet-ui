import { computed, Injectable, type Signal, signal } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { STORED_STATE_STORAGE_KEY } from '../shared.constants';
import type { UpdateFn } from '../shared.types';

@Injectable({ providedIn: 'root' })
export class StoredStateService {
  private state = signal<Record<string, unknown>>({});

  constructor(private localStorageService: LocalStorageService) {
    this.state.set(this.localStorageService.getJSON(STORED_STATE_STORAGE_KEY) ?? {});
  }

  get<T>(key: string): Signal<T | null>;
  get<T>(key: string, fallback: T): Signal<T>;
  get<T>(key: string, fallback: T | null = null): Signal<T | null> {
    return computed(() => (this.state()[key] as T | undefined) ?? (fallback as T | null));
  }

  set<T>(key: string, value: T): void;
  set<T>(key: string, updateFn: UpdateFn<T>): void;
  set<T>(key: string, valueOrUpdateFn: T | UpdateFn<T>): void {
    this.state.update((state) => {
      const previousValue = (state[key] ?? null) as T | null;
      const newValue =
        typeof valueOrUpdateFn === 'function' ? (valueOrUpdateFn as UpdateFn<T>)(previousValue) : valueOrUpdateFn;
      const newState = {
        ...state,
        [key]: newValue,
      };
      this.localStorageService.setJSON(STORED_STATE_STORAGE_KEY, newState);
      console.log({
        previousValue,
        newValue,
      });

      return newState;
    });
  }
}
