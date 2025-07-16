import { CommissionResultsFiltersComponent } from './commission-results-filters/commission-results-filters.component';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommissionService, CommissionsReview } from '@vet/backend';
import { DividerComponent, kendoIcons, useFilters, useFiltersUpdater, vetIcons } from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { GridDataResult, KENDO_GRID } from '@progress/kendo-angular-grid';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

export type CommissionReviewFilters = {
  program?: string;
  pid?: string;
  fullname?: string;
};

@Component({
  selector: 'vet-commission-results',
  imports: [
    DividerComponent,
    KENDO_GRID,
    KENDO_TOOLTIP,
    SVGIconModule,
    CommissionResultsFiltersComponent,
    TranslocoPipe,
  ],
  templateUrl: './commission-results.component.html',
  styleUrl: './commission-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionResultsComponent {
  activatedRoute = inject(ActivatedRoute);
  vetIcons = vetIcons;

  kendoIcons = kendoIcons;

  userRolesService = inject(UserRolesService);
  commissionService = inject(CommissionService);

  filters = useFilters<CommissionReviewFilters>();
  updateFilters = useFiltersUpdater<CommissionReviewFilters>();

  commissionResults$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filters: this.filters(),
    }),
    loader: ({ request: { organisation, filters } }) => {
      return this.commissionService.commissionResult({ organisation, filter: JSON.stringify(filters) });
    },
  });

  readonly gridData = computed(() => {
    const val = this.commissionResults$.value() as CommissionsReview & {
      meta?: {
        total?: number;
      };
    };

    return {
      data: val?.data || [],
      total: val?.meta?.total || 0,
    } as GridDataResult;
  });

  onFiltersChange(filters: CommissionReviewFilters) {
    this.updateFilters(filters);
  }
}
