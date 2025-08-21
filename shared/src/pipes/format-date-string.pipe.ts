import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDateString',
})
export class FormatDateStringPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const parts = value.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}-${month}-${year}`;
    }

    return value;
  }
}
