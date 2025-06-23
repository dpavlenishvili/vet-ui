import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { UserRolesService } from '@vet/auth';
import { CommissionService } from '@vet/backend';
import { tap } from 'rxjs';
import { Criteria, ScorePayload } from 'long-term-programs/src/long-term-programs.types';
import { InfoComponent, scoreValidator } from '@vet/shared';

@Component({
  selector: 'vet-commission-review-dialog',
  imports: [KENDO_DIALOG, ReactiveFormsModule, InputsModule, KENDO_BUTTON, KENDO_GRID, TranslocoPipe, InfoComponent],
  templateUrl: './commission-review-dialog.component.html',
  styleUrl: './commission-review-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionReviewDialogComponent {
  dialogClose = output();
  dialogCloseWithWarning = output();
  reloadProgramsWithCommissionReview = output();
  programId = input();
  admissionId = input();

  commissionService = inject(CommissionService);
  destroyRef = inject(DestroyRef);
  userRolesService = inject(UserRolesService);

  organisation = this.userRolesService.getOrganisation();
  commissionScoresFormGroup: FormGroup | undefined;
  allowedScores = ['0', '1', '2', '3', '4'];

  commissionCriteria$ = rxResource({
    request: () => ({ admission: this.admissionId() as number, program: this.programId() as number }),
    loader: ({ request }) =>
      this.commissionService.motivationalCriteria(request).pipe(
        tap((response) => {
          this.commissionScoresFormGroup = this.createCommissionScoresForm(response.data);
        }),
      ),
  });

  createCommissionScoresForm(criteria: Criteria[] | undefined) {
    if (criteria) {
      return new FormGroup({
        scores: new FormArray<FormGroup>(
          criteria.map(
            (item) =>
              new FormGroup({
                criteria_id: new FormControl(item.id),
                score: new FormControl(item.score, [Validators.required, scoreValidator]),
              }),
          ),
        ),
      });
    }

    return;
  }

  allowOnlyScore(event: KeyboardEvent) {
    if (!this.allowedScores.includes(event.key)) {
      event.preventDefault();
    }
  }

  get CommissionCriteria() {
    return this.commissionScoresFormGroup?.controls['scores'] as FormArray<FormGroup>;
  }

  handleClose() {
    this.dialogClose.emit();
  }

  handleCloseWithWarning() {
    this.dialogCloseWithWarning.emit();
  }

  handleSave() {
    if (this.commissionScoresFormGroup?.invalid) {
      this.commissionScoresFormGroup.markAllAsTouched();
      return;
    }

    const value = this.commissionScoresFormGroup?.value;
    const payload: ScorePayload = {
      admission: this.admissionId() as number,
      program: this.programId() as number,
      scores: value.scores,
    };

    this.commissionService
      .setScores(payload)
      .pipe(
        tap({
          next: () => {
            this.reloadProgramsWithCommissionReview.emit();
            this.dialogClose.emit();
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
