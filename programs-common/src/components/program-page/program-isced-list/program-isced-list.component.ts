import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-program-isced-list',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './program-isced-list.component.html',
  styleUrl: './program-isced-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramIscedListComponent {
  iscedList = input.required<string[] | string | null | undefined>();
  vetIcons = vetIcons;

  readonly normalizedList = computed(() => {
    const value = this.iscedList();
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  });
}

