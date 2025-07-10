import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNS, KENDO_MULTISELECT } from '@progress/kendo-angular-dropdowns';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { ToastService, vetIcons } from '@vet/shared';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIPS } from '@progress/kendo-angular-tooltip';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AddVacancyService } from '../../add-vacancy.service';
import { VacancyService } from '@vet/backend';
import { catchError, finalize } from 'rxjs';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-extra-details-form',
  imports: [
    KENDO_TOOLTIPS,
    KENDO_DROPDOWNS,
    KENDO_LABEL,
    KENDO_INPUTS,
    KENDO_BUTTON,
    FormsModule,
    KENDO_SVGICON,
    TranslocoPipe,
    ReactiveFormsModule,
    KENDO_LOADER,
    KENDO_MULTISELECT,
  ],
  templateUrl: './add-extra-details-form.component.html',
  styleUrl: './add-extra-details-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExtraDetailsFormComponent {
  clicNext = output();
  clicBack = output();

  private addService = inject(AddVacancyService);
  private vacService = inject(VacancyService);
  private toastService = inject(ToastService);
  private userRoleService = inject(UserRolesService);
  private translateService = inject(TranslocoService);
  readonly extraDetailsForm = this.addService.extraDetailsForm;
  positions = this.addService.positions;

  icons = vetIcons;
  loader = signal<boolean>(false);
  public listItems = this.addService.listItems;

  onValidate() {
    this.loader.set(true);
    this.vacService
      .validateVacancySelection({
        organisation: this.userRoleService.getOrganisation(),
        ...this.extraDetailsForm.getRawValue(),
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
