import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFromId',
})
export class TextFromIdPipe implements PipeTransform {
  transform(id: number | string | undefined, source: { id: number; text: string }[]): string {
    if (id === undefined || id === null) return '---';
    const numericId = Number(id);
    const match = source.find((item) => item.id === numericId);
    return match ? match.text : '---';
  }
}
