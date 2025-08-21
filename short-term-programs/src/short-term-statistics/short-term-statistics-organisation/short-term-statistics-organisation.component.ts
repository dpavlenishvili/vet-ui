import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { ShortTermStatisticsFiltersComponent } from '../short-term-statistics-filters/short-term-statistics-filters.component';
import { useShortStatsOrganisation } from 'short-term-programs/src/short-term.resources';
import { useFilters, useFiltersUpdater } from '@vet/shared';
import { ShortStatsFilters } from 'short-term-programs/src/short-term-programs.types';

@Component({
  selector: 'vet-short-term-statistics-organisation',
  imports: [KENDO_GRID, TranslocoPipe, ShortTermStatisticsFiltersComponent, RouterLink],
  templateUrl: './short-term-statistics-organisation.component.html',
  styleUrl: './short-term-statistics-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermStatisticsOrganisationComponent {
  private route = inject(ActivatedRoute);

  filters = useFilters<ShortStatsFilters>();
  updateFilters = useFiltersUpdater<ShortStatsFilters>();
  organisationId = this.route.snapshot.paramMap.get('organisationId');

  stats = useShortStatsOrganisation(String(this.organisationId), this.filters);
}
