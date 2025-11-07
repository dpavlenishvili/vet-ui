import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { kendoIcons, TransPipe, vetIcons } from '@vet/shared';
import { LongTerm, NonFormalShow, ShortProgramShow } from '@vet/backend';
import { ProgramDetailItem } from '@vet/programs-common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-program-details',
  imports: [KENDO_ICONS, TransPipe, TranslocoPipe],
  templateUrl: './program-details.component.html',
  styleUrl: './program-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramDetailsComponent {
  program = input.required<ShortProgramShow | LongTerm | NonFormalShow | undefined>();
  items = input<ProgramDetailItem[]>([]);
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;

  // Track expanded state for each item by index
  expandedItems = signal<Set<number>>(new Set());

  toggleExpand(index: number) {
    const current = this.expandedItems();
    const newSet = new Set(current);

    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }

    this.expandedItems.set(newSet);
  }

  isExpanded(index: number): boolean {
    return this.expandedItems().has(index);
  }

  shouldShowToggle(value: any): boolean {
    if (typeof value !== 'string') {
      return false;
    }
    return (value?.length ?? 0) > 300;
  }
}
