import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import {
  provideTransloco,
  Translation,
  TranslocoLoader,
} from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);

  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export function initializeTransolco() {
  return provideTransloco({
    config: {
      availableLangs: ['ka', 'en'],
      defaultLang: 'ka',
      // Remove this option if your application doesn't support changing language in runtime.
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  });
}
