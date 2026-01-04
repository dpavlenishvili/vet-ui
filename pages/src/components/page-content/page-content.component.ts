import { ChangeDetectionStrategy, Component, HostListener, inject, input } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared/utils';
import { SanitizePipe } from '@vet/shared/pipes';
import { FormatPageContentPipe } from '../../pipes/format-page-content.pipe';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'vet-page-content',
  imports: [FormatPageContentPipe, SanitizePipe],
  templateUrl: './page-content.component.html',
  styleUrl: './page-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PageContentComponent {
  content = input.required<string | undefined | null>();

  document = inject(DOCUMENT);
  apiBaseUrl = useBaseApiUrl();

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const downloadLink = this.findDownloadLink(target);

    if (downloadLink) {
      event.preventDefault();
      event.stopPropagation();

      const { href, filename } = downloadLink.dataset;

      if (href && filename) {
        this.downloadFile(href, filename);
      }
    }
  }

  private findDownloadLink(element: HTMLElement | null): HTMLElement | null {
    while (element) {
      if (element.tagName === 'A' && element.getAttribute('data-type') === 'download') {
        return element;
      }
      element = element.parentElement;
    }

    return null;
  }

  private downloadFile(href: string, filename: string): void {
    fetch(`${this.apiBaseUrl}/download-file?url=${encodeURIComponent(href)}&v=${Date.now()}`)
      .then(response => response.blob())
      .then(blob => {
        const link = this.document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        this.document.body.appendChild(link);
        link.click();
        this.document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(link.href), 100);
      })
      .catch(error => console.error('Download failed:', error));
  }
}
