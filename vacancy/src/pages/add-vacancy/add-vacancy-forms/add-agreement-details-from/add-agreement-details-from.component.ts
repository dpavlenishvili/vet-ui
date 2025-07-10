import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { AddVacancyService } from '../../add-vacancy.service';
import { VacancyService } from '@vet/backend';
import { ToastService } from '@vet/shared';
import { catchError, finalize } from 'rxjs';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-agreement-details-form',
  imports: [
    KENDO_DATEINPUTS,
    KENDO_INPUTS,
    KENDO_DATEINPUTS,
    KENDO_LABEL,
    KENDO_LOADER,
    KENDO_BUTTON,
    TranslocoPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './add-agreement-details-from.component.html',
  styleUrl: './add-agreement-details-from.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAgreementDetailsFormComponent {
  clicNext = output();
  clicBack = output();

  private addService = inject(AddVacancyService);
  private vacService = inject(VacancyService);
  private toastService = inject(ToastService);
  private userRoleService = inject(UserRolesService);
  private translateService = inject(TranslocoService);

  readonly agreementFormGroup = this.addService.agreementFormGroup;

  loader = signal<boolean>(false);

  onValidate() {
    this.loader.set(true);
    this.vacService
      .validateVacancyAgreement({
        organisation: this.userRoleService.getOrganisation(),
        ...this.agreementFormGroup.getRawValue(),
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
        this.clicNext.emit();
      });
  }
}
