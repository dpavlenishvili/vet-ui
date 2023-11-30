import { computed, DestroyRef, inject, Injectable, Signal, signal } from '@angular/core';
import { LOCAL_STORAGE, WINDOW } from '@ng-web-apis/common';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    protected _storage = inject(LOCAL_STORAGE);
    protected _window = inject<Window>(WINDOW);
    protected _store = signal<Record<string, string>>({});
    protected _destroyRef = inject(DestroyRef);

    constructor() {
        this._handleStorageChange = this._handleStorageChange.bind(this);
        this._window.addEventListener('storage', this._handleStorageChange);
        this._destroyRef.onDestroy(() => {
            this._window.removeEventListener('storage', this._handleStorageChange);
        });
    }

    preload(key: string) {
        this._updateStorageKey(key);
    }

    getValue<T>(key: string): T | null;
    getValue<T>(key: string, defaultValue: T): T;
    getValue<T>(key: string, defaultValue?: T): T | null {
        const value = this._store()[key];
        if (value === null || value === undefined) {
            return defaultValue === undefined ? null : defaultValue;
        }
        this._updateStorageKey(key);
        // @ts-expect-error TODO: fix this
        return this._store()[key];
    }

    setValue<T>(key: string, value: T) {
        this._storage.setItem(key, JSON.stringify(value));
        this._updateStorageKey(key);
    }

    getValueSignal<T>(key: string): Signal<T | null>;
    getValueSignal<T>(key: string, defaultValue: T): Signal<T>;
    getValueSignal<T>(key: string, defaultValue?: T): Signal<T | null> {
        // @ts-expect-error TODO: fix this
        return computed(() => {
            const _store = this._store();
            const value = _store[key];
            if (value === null || value === undefined) {
                return defaultValue === undefined ? null : defaultValue;
            }
            return value;
        });
    }

    protected _updateStorageKey(key: string | null) {
        if (!key) {
            return this._store.set({});
        }
        const value = this._parseValue(this._storage.getItem(key));

        this._store.set({
            ...this._store(),
            [key]: value,
        });
    }

    protected _parseValue(value: string | null) {
        if (value === null) {
            return null;
        }
        try {
            return JSON.parse(value);
        } catch (e) {
            const isNumber = !isNaN(Number(value));
            if (isNumber) {
                return Number(value);
            }
            return value;
        }
    }

    protected _handleStorageChange($event: StorageEvent) {
        this._updateStorageKey($event.key);
    }
}
