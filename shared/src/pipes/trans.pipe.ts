import { inject, Pipe, type PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { getTranslatableKey, getTranslatableParams, isTranslatable, Translatable } from '../shared.utils';

@Pipe({
  name: 'trans',
  pure: true,
  standalone: true,
})
export class TransPipe implements PipeTransform {
  private readonly transloco = inject(TranslocoService);

  transform(value: string | number | undefined | null | false | Translatable): string {
    if (isTranslatable(value)) {
      return this.transloco.translate(
        getTranslatableKey(value),
        getTranslatableParams(value),
      );
    }

    return value?.toString() ?? '';
  }
}
