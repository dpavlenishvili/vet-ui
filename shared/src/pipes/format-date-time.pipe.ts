import { Pipe, type PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import { useDefaultDateTimeFallback, useDefaultDisplayDateTimeFormat } from '../shared.injectors';

@Pipe({
  name: 'formatDateTime',
  pure: true,
  standalone: true,
})
export class FormatDateTimePipe implements PipeTransform {
  private readonly defaultDisplayDateTimeFormat = useDefaultDisplayDateTimeFormat();
  private readonly defaultDateTimeFallback = useDefaultDateTimeFallback();

  transform(
    date: string | number | Date | dayjs.Dayjs,
    params: {
      format?: string;
      fallback?: string;
    } = {},
  ): string {
    const format = params.format ?? this.defaultDisplayDateTimeFormat;
    const fallback = params.fallback ?? this.defaultDateTimeFallback;

    if (typeof date === 'string') {
      date = date.replace(/(\.\d{3})\d+/, '$1');
    }

    const dayjsDate = dayjs(date);

    return dayjsDate.isValid() ? dayjsDate.format(format) : fallback;
  }
}
