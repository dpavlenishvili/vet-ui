import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { vetIcons } from '@vet/shared';
import { NgClass } from '@angular/common';

@Component({
  selector: 'vet-program-isced-icon',
  imports: [NgClass],
  templateUrl: './program-isced-icon.component.html',
  styleUrl: './program-isced-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramIscedIconComponent {
  iconId = input<string | null | undefined>();

  sanitizer = inject(DomSanitizer);

  iconData = computed(() => {
    const rawId = this.iconId() || '04';
    const id = rawId.slice(0, 2);
    const iconKey = `isced_${id}`;
    const icon = vetIcons[iconKey as keyof typeof vetIcons];

    return {
      content: this.sanitizer.bypassSecurityTrustHtml(icon?.content || vetIcons.isced_04.content),
      backgroundClass: `program-bg-isced-${id}`,
    };
  });
}
