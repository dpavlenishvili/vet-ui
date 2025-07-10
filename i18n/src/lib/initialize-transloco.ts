import { Injectable, isDevMode } from '@angular/core';
import { provideTransloco, type TranslocoLoader } from '@jsverse/transloco';
import { loadTranslations } from './i18n';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: 'ka' | 'en') {
    return loadTranslations(lang);
  }
}

export function initializeTransolco() {
  return provideTransloco({
    config: {
      availableLangs: ['ka', 'en'],
      defaultLang: 'ka',
      fallbackLang: 'ka',
      // Remove this option if your application doesn't support changing language in runtime.
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
      missingHandler: {
        useFallbackTranslation: true
      },
    },
    loader: TranslocoHttpLoader,
  });
}
