import {Pipe, type PipeTransform} from '@angular/core';
import dayjs from 'dayjs';
import {useDefaultDateFallback, useDefaultDisplayDateFormat} from '../shared.injectors';

@Pipe({
  name: 'formatDate',
  pure: true,
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform = formatDateFn();
}

export const formatDateFn = (defaultDisplayDateFormat = useDefaultDisplayDateFormat(), defaultDateFallback = useDefaultDateFallback()) => {
  return (
    date: string | number | Date | dayjs.Dayjs,
    params: {
      format?: string;
      fallback?: string;
    } = {}
  ) => {
    const format = params.format ?? defaultDisplayDateFormat;
    const fallback = params.fallback ?? defaultDateFallback;

    return date ? dayjs(date).format(format) : fallback;
  }
}

export type FormatDateFn = ReturnType<typeof formatDateFn>;
