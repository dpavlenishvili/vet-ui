import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import type { Page } from 'backend';
import { useSanitizedHtml } from '@vet/shared';
import { DomSanitizer } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vet-static-page',
  templateUrl: './static-page.component.html',
  styleUrl: './static-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class StaticPageComponent {
  page = input.required<Page>();
  sanitizer = inject(DomSanitizer);
  document = inject(DOCUMENT);
  sanitizedContent = computed(() => {
    const content = this.page().content ?? '';

    const div = this.document.createElement('div');
    div.innerHTML = content;

    div.querySelectorAll('img').forEach(img => {
      const width = parseInt(img.getAttribute('width') || '0');
      const height = parseInt(img.getAttribute('height') || '0');

      if (width < 100) img.classList.add('vet-img', 'img-small');
      else if (width > 800) img.classList.add('vet-img', 'img-large');
      else img.classList.add('vet-img', 'img-medium');

      img.setAttribute('loading', 'lazy');
    });

    return this.sanitizer.bypassSecurityTrustHtml(div.innerHTML);
  })


}
