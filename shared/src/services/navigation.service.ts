import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private _returnUrl: string | null = null;

  setReturnUrl(url: string) {
    this._returnUrl = url;
  }

  getReturnUrl(): string | null {
    const url = this._returnUrl;
    this._returnUrl = null;
    return url;
  }
}
