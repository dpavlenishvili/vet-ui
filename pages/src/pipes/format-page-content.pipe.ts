import { inject, Pipe, type PipeTransform } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Pipe({
  name: 'formatPageContent',
  pure: true,
  standalone: true,
})
export class FormatPageContentPipe implements PipeTransform {
  private document = inject(DOCUMENT);

  transform(content: string | null | undefined): string {
    if (!content) {
      return '';
    }

    const div = this.document.createElement('div');
    div.innerHTML = content;

    div.querySelectorAll('img').forEach((img) => {
      const width = parseInt(img.getAttribute('width') || '0');
      const height = parseInt(img.getAttribute('height') || '0');

      if (width < 100) img.classList.add('vet-img', 'img-small');
      else if (width > 800) img.classList.add('vet-img', 'img-large');
      else img.classList.add('vet-img', 'img-medium');

      img.setAttribute('loading', 'lazy');
    });

    div.querySelectorAll('figure:not([data-trix-content-type^="image/"])').forEach((file) => {
      file.querySelectorAll('a').forEach((url) => {
        const caption = file.querySelector('.attachment__name');
        const href = url.href;
        const filename = caption?.textContent ?? '';

        if (caption) {
          caption.textContent = filename.split(/\./g).slice(0, -1).join('.');
        }

        url.removeAttribute('href');
        url.removeAttribute('download');
        url.removeAttribute('target');

        url.dataset['type'] = 'download';
        url.dataset['href'] = href;
        url.dataset['filename'] = filename;

        url.style.cursor = 'pointer';
      });
    });

    return div.innerHTML;
  }
}
