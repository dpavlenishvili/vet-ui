import { CommissionResultsFiltersComponent } from './commission-results-filters/commission-results-filters.component';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { CommissionService, CommissionsReview, User } from '@vet/backend';
import { DividerComponent, vetIcons, kendoIcons, useFilters, useFiltersUpdater } from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { GridDataResult, KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_CARD } from '@progress/kendo-angular-layout';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

export type CommissionReviewFilters = {
  program?: string;
  pid?: string;
  fullname?: string;
};

@Component({
  selector: 'vet-commission-results',
  imports: [
    CommonModule,
    TranslocoModule,
    DividerComponent,
    KENDO_CARD,
    KENDO_GRID,
    KENDO_BUTTON,
    KENDO_LOADER,
    KENDO_TOOLTIP,
    SVGIconModule,
    CommissionResultsFiltersComponent,
  ],
  templateUrl: './commission-results.component.html',
  styleUrl: './commission-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionResultsComponent {
  activatedRoute = inject(ActivatedRoute);
  selectedProgramCommissionMembers = signal<User[]>([]);
  vetIcons = vetIcons;

  kendoIcons = kendoIcons;

  isMembersDialogOpen = signal(false);
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
