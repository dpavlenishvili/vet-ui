import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNS, KENDO_MULTISELECT } from '@progress/kendo-angular-dropdowns';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { AddVacancyService } from '../../add-vacancy.service';
import { VacancyService } from '@vet/backend';
import { ToastService } from '@vet/shared';
import { catchError, finalize } from 'rxjs';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-position-details-form',
  imports: [
    KENDO_INPUTS,
    KENDO_DROPDOWNS,
    KENDO_LABEL,
    TranslocoPipe,
    ReactiveFormsModule,
    KENDO_LOADER,
    KENDO_MULTISELECT,
    KENDO_BUTTON,
  ],
  templateUrl: './add-position-details-form.component.html',
  styleUrl: './add-position-details-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionDetailsFormComponent implements OnInit {
  clickNext = output();
  clickBack = output();

  private addService = inject(AddVacancyService);
  private vacService = inject(VacancyService);
  private toastService = inject(ToastService);
  private userRoleService = inject(UserRolesService);
  private translateService = inject(TranslocoService);
  loader = signal<boolean>(false);

  readonly addPositionFormGroup = this.addService.addPositionFormGroup;

  positionTypes = this.addService.positionTypes;
  modulslist = this.addService.modulslist;
  positions = this.addService.positions;
  contactPersons = this.addService.contactPersons;
  addresses = this.addService.addresses;
  programsList = this.addService.programsList;
  listItems = this.addService.listItems;

  ngOnInit(): void {
    const form = this.addPositionFormGroup;

    form.get('teaching_professional_programs')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        form.get('modules')?.setValidators(Validators.required);
        form.get('modules')?.updateValueAndValidity();

        form.get('teaching_short_term_programs')?.setValue(false, { emitEvent: false });

        if (!form.contains('programs')) {
          form.addControl('programs', new FormControl(null));
        }
        form.get('programs')?.setValue(null);
      } else {
        form.get('modules')?.setValue(null);
        form.get('modules')?.clearValidators();
        form.get('modules')?.updateValueAndValidity();
      }
    });

    form.get('teaching_short_term_programs')?.valueChanges.subscribe((val: boolean) => {
      if (val) {
        form.get('programs')?.setValidators(Validators.required);
        form.get('programs')?.updateValueAndValidity();

        form.get('teaching_professional_programs')?.setValue(false, { emitEvent: false });

        if (!form.contains('modules')) {
          form.addControl('modules', new FormControl(null));
        }
        form.get('modules')?.setValue(null);
      } else {
        form.get('programs')?.clearValidators();
        form.get('programs')?.updateValueAndValidity();
      }
    });
  }

  onValidate() {
    this.loader.set(true);
    this.vacService
      .validateVacancyDetails({
        organisation: this.userRoleService.getOrganisation(),
        ...this.addPositionFormGroup.getRawValue(),
      })
      .pipe(
        catchError((error) => {
          this.toastService.error(error?.error?.errors[0] ?? this.translateService.translate('shared.errorOccurred'));
          throw error;
        }),
        finalize(() => {
          this.loader.set(false);
        }),
      )
      .subscribe(() => {
        this.clickNext.emit();
      });
  }
}
