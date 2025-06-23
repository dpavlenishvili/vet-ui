import { computed, type Signal, signal } from '@angular/core';
import { STORED_STATE_STORAGE_KEY } from '../shared.constants';
import type { Storage, StoredStateItem } from '../shared.types';

export abstract class BaseStoredStateService {
  private state = signal<Record<string, StoredStateItem<unknown>>>({});

  protected constructor(private storage: Storage) {
    this.state.set(
      (this.storage.getJSON(STORED_STATE_STORAGE_KEY) ?? {}) as Record<string, StoredStateItem<unknown>>
    );
  }

  get<T>(key: string, fallback: T): Signal<T> {
    return computed(() => {
      const state = this.state();
      const item = state[key] as StoredStateItem<T> | undefined;
      const now = Date.now();
      const isValid = item && (item.ttl == null || item.timestamp + item.ttl > now);

      return item && isValid ? item.value : fallback;
    });
  }

  set<T>(key: string, value: T, ttl?: number): void {
    this.state.update((state) => {
      const newState: Record<string, StoredStateItem<unknown>> = {
        ...state,
        [key]: {
          value,
          timestamp: Date.now(),
          ttl,
        },
      };
      this.storage.setJSON(STORED_STATE_STORAGE_KEY, newState);

      return newState;
    });
  }

  update<T>(key: string, cb: (prev: T) => T, initialValue: T, ttl?: number): void {
    this.state.update((state) => {
      const now = Date.now();
      const item = state[key] as StoredStateItem<T> | undefined;
      const previousValue = item && (item.ttl == null || item.timestamp + item.ttl > now) ? item.value : initialValue;
      const newValue = cb(previousValue);
      const newState: Record<string, StoredStateItem<unknown>> = {
        ...state,
        [key]: {
          value: newValue,
          timestamp: now,
          ttl,
        } as StoredStateItem<T>,
      };
      this.storage.setJSON(STORED_STATE_STORAGE_KEY, newState);

      return newState;
    });
  }
}
