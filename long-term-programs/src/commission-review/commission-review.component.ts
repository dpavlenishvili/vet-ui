import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_CARD } from '@progress/kendo-angular-layout';
import { DividerComponent, vetIcons } from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { CommissionService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { CommissionReviewDialogComponent } from './commission-review-dialog/commission-review-dialog.component';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

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

  programsWithCommissionReview$ = rxResource({
    request: () => ({ organisation: this.userRolesService.getOrganisation() }),
    loader: ({ request: organisation }) => this.commissionService.commissionReview(organisation),
  });

  openCommissionReviewDialog(admissionId: number, programId: number) {
    this.selectedAdmissionId.set(admissionId);
    this.selectedProgramId.set(programId);
    this.isCommissionReviewDialogOpen.set(true);
  }

  closeCommissionReviewDialog() {
    this.isCommissionReviewDialogOpen.set(false);
  }

  reloadCommissionReview() {
    this.programsWithCommissionReview$.reload();
  }
}
