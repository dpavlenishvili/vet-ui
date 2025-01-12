import { Injectable, isDevMode } from '@angular/core';
import { provideTransloco, TranslocoLoader } from '@jsverse/transloco';
import { loadTranslations } from "./i18n";

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
      // Remove this option if your application doesn't support changing language in runtime.
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  });
}
