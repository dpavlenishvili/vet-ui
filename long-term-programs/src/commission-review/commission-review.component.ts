import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { GridDataResult, KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_CARD } from '@progress/kendo-angular-layout';
import { DividerComponent, filterNullValues, useAlert, vetIcons } from '@vet/shared';
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
    KENDO_CARD,
    KENDO_GRID,
    KENDO_BUTTON,
    KENDO_TOOLTIP,
    TranslocoPipe,
    DividerComponent,
    CommissionReviewDialogComponent,
    CommissionReviewFiltersComponent
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

  private alert = useAlert();
  protected filters = signal<string | undefined>(undefined);

  programsWithCommissionReview$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filter: this.filters(),
    }),
    loader: ({ request }) => {
      return this.commissionService.commissionReview(request);
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

  closeCommissionReviewDialog() {
    this.isCommissionReviewDialogOpen.set(false);
    this.alert.show({
      text: 'programs.review_not_added',
      variant: 'warning',
    });
  }

  reloadCommissionReview() {
    this.programsWithCommissionReview$.reload();
  }

  onFiltersChange(filterValue: ReviewFilters) {
    const filterString = JSON.stringify(filterNullValues(filterValue));
    this.filters.set(filterString);
  }
}
