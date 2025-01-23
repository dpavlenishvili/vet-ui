import { Pipe, type PipeTransform } from '@angular/core';

import { useBaseUrl } from '../shared.injectors';

@Pipe({
  name: 'vetUploadedFileUri',
  standalone: true,
})
export class UploadedFileUriPipe implements PipeTransform {
  baseUrl = `${useBaseUrl()}/uploads`;

  transform(value?: string): string {
    if (!value || value.startsWith('http')) {
      return value || '';
    }
    return `${this.baseUrl}/${value}`;
  }
}
