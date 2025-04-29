import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { ChangeDetectionStrategy, Component, inject, input, output, DestroyRef, signal, OnInit } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { CommissionService, User } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { vetIcons, InfoComponent, ToastService } from '@vet/shared';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-commission-members-dialog',
  imports: [KENDO_DIALOG, TranslocoPipe, ReactiveFormsModule, InputsModule, KENDO_BUTTON, KENDO_GRID, InfoComponent],
  templateUrl: './commission-members-dialog.component.html',
  styleUrl: './commission-members-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionMembersDialogComponent implements OnInit {
  dialogClose = output();
  reloadProgramsWithCommissionMembers = output();
  programCode = input<string>();
  programName = input<string>();
  commissionMembers = input<User[]>();

  commissionMemberForm = this.createFormGroup();

  commissionService = inject(CommissionService);
  destroyRef = inject(DestroyRef);
  userRolesService = inject(UserRolesService);
  toastService = inject(ToastService);

  organisation = this.userRolesService.getOrganisation();;

  ngOnInit(): void {
    this.setCommissionMembersGridData();
  }

  isCommissionMemberValid = signal(false);
  updatedCommissionMembers = signal<User[]>([]);

  vetIcons = vetIcons;
  isCommissionMembersGridVisible = signal(false);

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      first_name: new FormControl(),
      last_name: new FormControl(),
      phone: new FormControl(),
      program_code: new FormControl(),
      program_name: new FormControl(),
    });
  }

  handleClose() {
    this.dialogClose.emit();
  }

  checkCommissionMember() {
    this.isCommissionMemberValid.set(false);

    const value = this.commissionMemberForm.value;
    this.commissionService
      .findCommissionMember({ pid: value.pid, name: value.name })
      .pipe(
        tap((member) => {
          this.isCommissionMemberValid.set(true);
          this.commissionMemberForm.get('first_name')?.setValue(member.data?.first_name);
          this.commissionMemberForm.get('last_name')?.setValue(member.data?.last_name);
          this.commissionMemberForm.get('phone')?.setValue(member.data?.phone);
          this.commissionMemberForm.get('program_code')?.setValue(this.programCode());
          this.commissionMemberForm.get('program_name')?.setValue(this.programName());
          this.commissionMemberForm.get('first_name')?.disable();
          this.commissionMemberForm.get('phone')?.disable();
          this.commissionMemberForm.get('program_code')?.disable();
          this.commissionMemberForm.get('program_name')?.disable();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  setCommissionMembersGridData() {
    const members = this.commissionMembers();

    if (members) {
      this.updatedCommissionMembers.set(members);
    }
  }

  getCommissionMembersPids() {
    return this.updatedCommissionMembers().map((member) => member.pid);
  }

  addCommissionMember() {
    if(this.commissionMemberForm.invalid) {
      return
    }

    const formValue = this.commissionMemberForm.value;
    const newMember: User = {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pid: formValue.pid!,
      firstName: formValue.first_name,
      lastName: formValue.last_name,
      phone: formValue.phone,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: formValue.name!,
    };

    if(this.updatedCommissionMembers().length < 6) {
      this.updatedCommissionMembers.update((members) => {
        const exists = members.some((member) => member.pid === newMember.pid);
        return exists ? members : [...members, newMember];
      });

      this.isCommissionMembersGridVisible.set(true);
      this.isCommissionMemberValid.set(false);
      this.commissionMemberForm.get('name')?.reset();
      this.commissionMemberForm.get('pid')?.reset();
    } else {
      this.toastService.error('programs.commission_members_add_rules')
    }
  }

  removeCommissionMember(user: User) {
    this.updatedCommissionMembers.update((members) => members.filter((member) => member.pid !== user.pid));
  }

  saveChanges() {
    const formValue = this.commissionMemberForm.value;

    const payload = {
      program: formValue.program_code as string,
      pids: this.getCommissionMembersPids() as string[],
    };

    this.commissionService
      .createProgramCommission({ organisation: this.organisation as string }, payload)
      .pipe(
        tap({
          next: () => {
            this.isCommissionMembersGridVisible.set(true);
            this.reloadProgramsWithCommissionMembers.emit();
            this.dialogClose.emit();
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
