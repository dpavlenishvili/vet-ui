import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NonFormal } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '@vet/shared/icons';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { ProgramIscedIconComponent } from '@vet/programs-common';

@Component({
  selector: 'vet-non-formal-program-card',
  standalone: true,
  imports: [TranslocoPipe, RouterLink, SVGIconComponent, ProgramIscedIconComponent],
  templateUrl: './non-formal-program-card.component.html',
  styleUrl: './non-formal-program-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalProgramCardComponent {
  program = input.required<NonFormal>();

  sanitizer = inject(DomSanitizer);
  vetIcons = vetIcons;

  sanitizedProgram = computed(() => ({
    ...this.program(),
    icon: this.sanitizer.bypassSecurityTrustHtml(
      `
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="60" height="60" rx="10" fill="#E3C7C9"/>
          <path d="M30 15C21.716 15 15 21.716 15 30C15 38.284 21.716 45 30 45C38.284 45 45 38.284 45 30C45 21.716 38.284 15 30 15ZM30 42C23.383 42 18 36.617 18 30C18 23.383 23.383 18 30 18C36.617 18 42 23.383 42 30C42 36.617 36.617 42 30 42Z" fill="white"/>
          <path d="M35 28H32V25C32 23.895 31.105 23 30 23C28.895 23 28 23.895 28 25V28H25C23.895 28 23 28.895 23 30C23 31.105 23.895 32 25 32H28V35C28 36.105 28.895 37 30 37C31.105 37 32 36.105 32 35V32H35C36.105 32 37 31.105 37 30C37 28.895 36.105 28 35 28Z" fill="white"/>
        </svg>
      `,
    ),
  }));
}
