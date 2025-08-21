import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { useFilters, useFiltersUpdater } from '@vet/shared';
import { ShortApplicationsListenersFilters } from '../short-term-programs.types';
import { useShortApplicationsForOrganisation } from '../short-term.resources';
import { ShortTermRegisteredListenersFiltersComponent } from './short-term-registered-listeners-filters/short-term-registered-listeners-filters.component';

@Component({
  selector: 'vet-short-term-registered-listeners',
  imports: [KENDO_GRID, TranslocoPipe, ShortTermRegisteredListenersFiltersComponent],
  templateUrl: './short-term-registered-listeners.component.html',
  styleUrl: './short-term-registered-listeners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermRegisteredListenersComponent {
  filters = useFilters<ShortApplicationsListenersFilters>();
  updateFilters = useFiltersUpdater<ShortApplicationsListenersFilters>();
  registeredListeners = useShortApplicationsForOrganisation(this.filters);
}
