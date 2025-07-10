import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textArrayFromIds',
})
export class TextArrayFromIdsPipe implements PipeTransform {
  transform(ids: (number | string)[] | undefined, source: { id: number; text: string }[]) {
    if (!Array.isArray(ids) || ids.length === 0) return ['---'];
    const normalizedIds = ids.map((id) => Number(id));
    return source.filter((item) => normalizedIds.includes(item.id)).map((item) => item.text);
  }
}
