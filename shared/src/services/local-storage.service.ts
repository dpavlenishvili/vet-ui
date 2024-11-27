import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  has(key: string) {
    return this.document.defaultView?.localStorage.getItem(key) !== null;
  }

  get(key: string) {
    return this.document.defaultView?.localStorage.getItem(key) ?? null;
  }

  set(key: string, value: string) {
    this.document.defaultView?.localStorage.setItem(key, value);
  }

  remove(key: string) {
    this.document.defaultView?.localStorage.removeItem(key);
  }

  getJSON(key: string) {
    return this.has(key) ? JSON.parse(this.get(key) as string) : null;
  }

  setJSON(key: string, value: object) {
    this.set(key, JSON.stringify(value));
  }
}
