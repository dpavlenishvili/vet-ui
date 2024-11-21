import { Pipe, PipeTransform } from '@angular/core';

import { baseUrl } from '../shared.injectors';

@Pipe({
    name: 'vetUploadedFileUri',
    standalone: true,
})
export class UploadedFileUriPipe implements PipeTransform {
    baseUrl = `${baseUrl()}/uploads`;

    transform(value?: string): string {
        if (!value || value.startsWith('http')) {
            return value || '';
        }
        return `${this.baseUrl}/${value}`;
    }
}
