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
import { vetIcons, InfoComponent, ToastService, georgianLettersValidator, personalNumberValidator } from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { KENDO_LABEL } from '@progress/kendo-angular-label';

@Component({
  selector: 'vet-commission-members-dialog',
  imports: [
    KENDO_DIALOG,
    TranslocoPipe,
    ReactiveFormsModule,
    InputsModule,
    KENDO_BUTTON,
    KENDO_GRID,
    InfoComponent,
    KENDO_SVGICON,
    KENDO_LABEL,
  ],
  templateUrl: './commission-members-dialog.component.html',
  styleUrl: './commission-members-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))]),
    ]),
  ],
})
export class CommissionMembersDialogComponent implements OnInit {
  dialogClose = output();
  dialogCloseWithWarning = output();
  reloadProgramsWithCommissionMembers = output();
  programCode = input<string>();
  programId = input<string>();
  programName = input<string>();
  commissionMembers = input<User[]>();

  commissionMemberForm = this.createFormGroup();

  commissionService = inject(CommissionService);
  destroyRef = inject(DestroyRef);
  userRolesService = inject(UserRolesService);
  toastService = inject(ToastService);

  organisation = this.userRolesService.getOrganisation();

  ngOnInit(): void {
    this.setCommissionMembersGridData();
    this.clearTemporaryError();
  }

  showTemporaryError(error: string): void {
    this.temporaryErrorMessage.set(error);
  }

  clearTemporaryError() {
    this.commissionMemberForm.valueChanges
      .pipe(
        tap(() => {
          this.temporaryErrorMessage.set(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  isCommissionMemberValid = signal(false);
  updatedCommissionMembers = signal<User[]>([]);
  temporaryErrorMessage = signal<string | null>(null);

  vetIcons = vetIcons;

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl('', [Validators.required, personalNumberValidator]),
      name: new FormControl('', [Validators.required, georgianLettersValidator]),
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

  handleCloseWithWarning() {
    this.dialogCloseWithWarning.emit();
  }

  checkCommissionMember() {
    this.isCommissionMemberValid.set(false);
    this.commissionMemberForm.markAllAsTouched();

    const value = this.commissionMemberForm.value;
    this.commissionService
      .findCommissionMember({ pid: value.pid, name: value.name })
      .pipe(
        tap({
          next: (member) => {
            if (this.validateCommissonMembers()) {
              this.isCommissionMemberValid.set(true);
              this.commissionMemberForm.patchValue({
                first_name: member.data?.first_name,
                last_name: member.data?.last_name,
                phone: member.data?.phone,
                program_code: this.programId(),
                program_name: `${this.programCode()} - ${this.programName()}`,
              });

              ['first_name', 'phone', 'program_code', 'program_name'].forEach((field) => {
                this.commissionMemberForm.get(field)?.disable();
              });
            }
          },
          error: () => {
            const commissionMember = this.commissionMemberForm.value;

            if (commissionMember.pid && commissionMember.name) {
              this.showTemporaryError('programs.user_is_not_registered');
            }
          },
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

  private getNewCommissionMember(): User {
    const formValue = this.commissionMemberForm.getRawValue();
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      pid: formValue.pid!,
      firstName: formValue.first_name,
      lastName: formValue.last_name,
      phone: formValue.phone,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      name: formValue.name!,
    };
  }

  validateCommissonMembers(): boolean {
    const newMember = this.getNewCommissionMember();
    const currentMembers = this.updatedCommissionMembers();

    if (currentMembers.some((member) => member.pid === newMember.pid)) {
      this.showTemporaryError('programs.member_already_added');
      return false;
    }

    if (currentMembers.length >= 6) {
      this.showTemporaryError('programs.commission_member_maximum_warning');
      return false;
    }

    this.temporaryErrorMessage.set(null);
    return true;
  }

  addCommissionMember() {
    if (this.commissionMemberForm.invalid) {
      return;
    }

    const newMember = this.getNewCommissionMember();

    this.updatedCommissionMembers.update((members) => [...members, newMember]);
    this.isCommissionMemberValid.set(false);
    this.commissionMemberForm.get('name')?.reset();
    this.commissionMemberForm.get('pid')?.reset();
  }

  removeCommissionMember(user: User) {
    this.updatedCommissionMembers.update((members) => members.filter((member) => member.pid !== user.pid));
  }

  saveChanges() {
    const currentMembers = this.updatedCommissionMembers();
    
    if (currentMembers.length < 3) {
      this.showTemporaryError('programs.commission_member_minimum_warning');
      return;
    }

    const payload = {
      program: this.programId() as string,
      pids: this.getCommissionMembersPids() as string[],
    };

    this.commissionService
      .createProgramCommission({ organisation: this.organisation as string }, payload)
      .pipe(
        tap({
          next: () => {
            this.reloadProgramsWithCommissionMembers.emit();
            this.dialogClose.emit();
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
