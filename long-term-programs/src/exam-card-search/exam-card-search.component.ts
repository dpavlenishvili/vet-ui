import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { ExamCardComponent } from '@vet/programs-common';
import { ExamCardFilterComponent } from './exam-card-filter/exam-card-filter.component';

export type ExamCardFilters = {
  filters: {
    pid?: string | null;
  };
};

@Component({
  selector: 'vet-exam-card-search',
  imports: [ExamCardFilterComponent, ExamCardComponent],
  templateUrl: './exam-card-search.component.html',
  styleUrl: './exam-card-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCardSearchComponent {
  vetIcons = vetIcons;
  protected selectedPid = signal<string | undefined>(undefined);

  onFiltersChange(filters: ExamCardFilters) {
    const filterString = filters.filters.pid as string;
    this.selectedPid.set(filterString);
  }
}
