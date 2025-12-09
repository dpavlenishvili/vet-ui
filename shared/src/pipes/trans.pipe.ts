import { inject, Pipe, type PipeTransform } from '@angular/core';
import { HashMap, Translation, TranslocoService } from '@jsverse/transloco';
import { getTranslatableKey, getTranslatableParams, isTranslatable, Translatable } from '../shared.utils';

@Pipe({
  name: 'trans',
  pure: true,
  standalone: true,
})
export class TransPipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);
  private readonly translations = new Map<string, Translation>();

  transform(value: string | number | undefined | null | false | Translatable, params?: HashMap): string {
    if (isTranslatable(value)) {
      return this.transloco.translate(
        getTranslatableKey(value),
        getTranslatableParams(value),
      );
    }

    if (!value || typeof value !== 'string') {
      return value?.toString() ?? '';
    }

    const lang = this.transloco.getActiveLang();
    let translation: Translation | undefined = this.translations.get(lang);

    if (!translation) {
      translation = this.transloco.getTranslation(this.transloco.getActiveLang());
      this.translations.set(lang, translation);
    }

    if (value in translation) {
      return this.transloco.translate(value, params);
    }

    return value;
  }
}
