import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LongTermStatisticsFiltersComponent } from './long-term-statistics-filters/long-term-statistics-filters.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { useFilters, useFiltersUpdater, vetIcons } from '@vet/shared';
import { StatsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserRolesService } from '@vet/auth';

export type StatisticsFilters = {
  program?: string | null;
  kind?: string | null;
  integrated?: boolean | null;
};

@Component({
  selector: 'vet-long-term-statistics',
  imports: [LongTermStatisticsFiltersComponent, KENDO_GRID, TranslocoPipe],
  templateUrl: './long-term-statistics.component.html',
  styleUrl: './long-term-statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongTermStatisticsComponent {
  vetIcons = vetIcons;

  statsService = inject(StatsService);
  userRolesService = inject(UserRolesService);

  filters = useFilters<StatisticsFilters>();
  updateFilters = useFiltersUpdater<StatisticsFilters>();

  statisticsRes = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filter: this.filters(),
    }),
    loader: ({ request: { organisation, filter } }) => {
      return this.statsService.statistics({ organisation, filter: JSON.stringify(filter) });
    },
  });

  onFiltersChange(filters: StatisticsFilters) {
    this.updateFilters(filters);
  }
}
