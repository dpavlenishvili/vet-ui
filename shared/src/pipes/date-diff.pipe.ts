import { Pipe, type PipeTransform } from '@angular/core';
import dayjs from 'dayjs';

@Pipe({
  name: 'dateDiff',
  pure: true,
  standalone: true,
})
export class DateDiffPipe implements PipeTransform {
  transform = dateDiff();
}

export const dateDiff = () => {
  return (
    dateA: string | number | undefined | null | Date | dayjs.Dayjs | 'now',
    dateB: string | number | undefined | null | Date | dayjs.Dayjs | 'now',
  ) => {
    if (dateA === 'now') {
      dateA = dayjs(dayjs().format('YYYY-MM-DD'));
    }

    if (dateB === 'now') {
      dateB = dayjs(dayjs().format('YYYY-MM-DD'));
    }

    return dateA && dateB ? dayjs(dateA).toDate().getTime() - dayjs(dateB).toDate().getTime() : 0;
  };
};
