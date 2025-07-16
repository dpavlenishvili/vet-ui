import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { GridDataResult, KENDO_GRID } from '@progress/kendo-angular-grid';
import { DividerComponent, useAlert, useFilters, useFiltersUpdater, vetIcons } from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { CommissionService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommissionReviewDialogComponent } from './commission-review-dialog/commission-review-dialog.component';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { CommissionReviewFiltersComponent } from './commission-review-filters/commission-review-filters.component';

export type ReviewFilters = {
  program?: string | null;
  pid?: string | null;
  fullname?: string | null;
};

@Component({
  selector: 'vet-commission-review',
  imports: [
    KENDO_GRID,
    KENDO_BUTTON,
    KENDO_TOOLTIP,
    TranslocoPipe,
    DividerComponent,
    CommissionReviewDialogComponent,
    CommissionReviewFiltersComponent,
  ],
  templateUrl: './commission-review.component.html',
  styleUrl: './commission-review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionReviewComponent {
  selectedProgramName = signal('');
  vetIcons = vetIcons;

  isMembersDialogOpen = signal(false);
  userRolesService = inject(UserRolesService);
  commissionService = inject(CommissionService);

  isCommissionReviewDialogOpen = signal(false);

  selectedProgramId = signal(0);
  selectedAdmissionId = signal(0);

  filters = useFilters<ReviewFilters>();
  updateFilters = useFiltersUpdater<ReviewFilters>();

  private alert = useAlert();

  programsWithCommissionReview$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filters: this.filters(),
    }),
    loader: ({ request: { organisation, filters } }) => {
      return this.commissionService.commissionReview({ organisation, filter: JSON.stringify(filters) });
    },
  });

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
    const val = this.programsWithCommissionReview$.value();
    const data = val?.data ?? [];
    return {
      data,
      total: data.length,
    } as GridDataResult;
  });

  openCommissionReviewDialog(admissionId: number, programId: number) {
    this.selectedAdmissionId.set(admissionId);
    this.selectedProgramId.set(programId);
    this.isCommissionReviewDialogOpen.set(true);
  }

  closeDialog() {
    this.isCommissionReviewDialogOpen.set(false);
  }

  closeDialogWithWarning() {
    this.isCommissionReviewDialogOpen.set(false);
    this.alert.show({
      text: 'programs.review_not_added',
      variant: 'warning',
    });
  }

  reloadCommissionReview() {
    this.programsWithCommissionReview$.reload();
  }

  onFiltersChange(filters: ReviewFilters) {
    this.updateFilters(filters);
  }
}
