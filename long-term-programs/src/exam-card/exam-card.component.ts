import { vetIcons } from '@vet/shared';
import { CardService } from '@vet/backend';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ExamCardFilterComponent } from './exam-card-filter/exam-card-filter.component';
import { KENDO_CARD } from '@progress/kendo-angular-layout';
import { TranslocoPipe } from '@jsverse/transloco';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { JsonPipe } from '@angular/common';
import { KENDO_GRID } from '@progress/kendo-angular-grid';

export type ExamCardFilters = {
  filters: {
    pid?: string | null;
  };
};

@Component({
  selector: 'vet-exam-card',
  imports: [ExamCardFilterComponent, TranslocoPipe, KENDO_CARD, KENDO_SVGICON, KENDO_GRID],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCardComponent {
  vetIcons = vetIcons;

  cardService = inject(CardService);
  protected filters = signal<string | undefined>(undefined);

  examCard$ = rxResource({
    request: () => {
      const currentFilters = this.filters();
      return currentFilters !== undefined ? { filters: currentFilters } : null;
    },
    loader: ({ request }) => {
      if (!request) {
        return of(null);
      }
      return this.cardService.examCard({ pid: request.filters });
    },
  });

  onFiltersChange(filters: ExamCardFilters) {
    const filterString = filters.filters.pid as string
    this.filters.set(filterString)
  }
}
