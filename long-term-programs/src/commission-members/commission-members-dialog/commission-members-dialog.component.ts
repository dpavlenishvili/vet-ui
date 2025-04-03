import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { ChangeDetectionStrategy, Component, inject, input, output, DestroyRef, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { CommissionService } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-commission-members-dialog',
  imports: [KENDO_DIALOG, TranslocoPipe, ReactiveFormsModule, InputsModule, KENDO_BUTTON],
  templateUrl: './commission-members-dialog.component.html',
  styleUrl: './commission-members-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionMembersDialogComponent {
  dialogClose = output();
  programName = input();

  commissionMemberForm = this.createFormGroup();

  commissionService = inject(CommissionService);
  destroyRef = inject(DestroyRef);

  isCommissionMemberValid = signal(false);

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl(),
      name: new FormControl(),
      first_name: new FormControl(),
      last_name: new FormControl(),
      phone: new FormControl(),
    });
  }

  handleClose() {
    this.dialogClose.emit();
  }

  checkCommissionMember() {
    const value = this.commissionMemberForm.value;
    this.commissionService
      .findCommissionMember({ pid: value.pid, name: value.name })
      .pipe(
        tap((member) => {
          this.commissionMemberForm.get('first_name')?.setValue(member.data?.first_name);
          this.commissionMemberForm.get('last_name')?.setValue(member.data?.last_name);
          this.commissionMemberForm.get('phone')?.setValue(member.data?.phone);
          this.isCommissionMemberValid.set(true);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
