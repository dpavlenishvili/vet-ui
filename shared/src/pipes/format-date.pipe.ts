import { Pipe, type PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import { useDefaultDateFallback, useDefaultDisplayDateFormat } from '../shared.injectors';

@Pipe({
  name: 'formatDate',
  pure: true,
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  private readonly defaultDisplayDateFormat = useDefaultDisplayDateFormat();
  private readonly defaultDateFallback = useDefaultDateFallback();

  transform(
    date: string | number | Date | dayjs.Dayjs,
    params: {
      format?: string;
      fallback?: string;
    } = {},
  ): string {
    const format = params.format ?? this.defaultDisplayDateFormat;
    const fallback = params.fallback ?? this.defaultDateFallback;

    return date ? dayjs(date).format(format) : fallback;
  }
}
