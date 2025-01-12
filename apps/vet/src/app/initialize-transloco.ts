import { Injectable, isDevMode } from '@angular/core';
import { provideTransloco, Translation, TranslocoLoader } from '@jsverse/transloco';

const translations = {
  ka: () => import('../i18n/ka.json').then((m) => m.default) as Promise<Translation>,
  en: () => import('../i18n/en.json').then((m) => m.default) as Promise<Translation>,
};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  getTranslation(lang: 'ka' | 'en') {
    return translations[lang]();
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
