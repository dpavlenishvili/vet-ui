import { inject, Pipe, type PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitize',
  pure: true,
  standalone: true,
})
export class SanitizePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(html: string | null | undefined): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, html ?? '') ?? '';
  }
}
