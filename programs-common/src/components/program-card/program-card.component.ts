import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslocoPipe } from '@jsverse/transloco';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared/icons';
import { RouterLink } from '@angular/router';
import { LongTerm, ShortProgram } from '@vet/backend';
import { ProgramIscedIconComponent } from '../program-isced-icon/program-isced-icon.component';

@Component({
  selector: 'vet-program-card',
  imports: [TranslocoPipe, SVGIconComponent, RouterLink, ProgramIscedIconComponent],
  templateUrl: './program-card.component.html',
  styleUrl: './program-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramCardComponent {
  program = input.required<ShortProgram | LongTerm>();
  programDetailsPath = input<string | null>(null);
  iscedCode = input<string | null | undefined>(null);

  sanitizer = inject(DomSanitizer);
  sanitizedProgram = computed(() => ({
    ...this.program(),
  }));

  get organisationName(): string {
    const org = this.program()?.organisation;
    if (org && typeof org === 'object' && 'name' in org) {
      return (org as { name?: string }).name ?? '';
    }
    return '';
  }

  protected readonly vetIcons = vetIcons;
}
