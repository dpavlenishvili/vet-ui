import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { VacancyStepperComponent } from './vacancy-stepper/vacancy-stepper.component';
import { PositionDetailsFormComponent } from './add-vacancy-forms/add-position-details-form/add-position-details-form.component';
import { AddAgreementDetailsFormComponent } from './add-vacancy-forms/add-agreement-details-from/add-agreement-details-from.component';
import { AddExtraDetailsFormComponent } from './add-vacancy-forms/add-extra-details-form/add-extra-details-form.component';
import { AddVacancyService } from './add-vacancy.service';
import { VacancyResource, VacancyResourceRes, VacancyService } from '@vet/backend';
import { ToastService } from '@vet/shared';
import { catchError, finalize } from 'rxjs';
import { UserRolesService } from '@vet/auth';
import { TranslocoService } from '@jsverse/transloco';
import { VacancyDetailsInfoComponent } from '../../components/vacancy-detailed-info/vacancy-detailed-info.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vet-vacancy',
  imports: [
    VacancyStepperComponent,
    AddAgreementDetailsFormComponent,
    PositionDetailsFormComponent,
    AddExtraDetailsFormComponent,
    VacancyDetailsInfoComponent,
  ],
  templateUrl: './add-vacancy.component.html',
  styleUrl: './add-vacancy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddVacancyComponent implements OnInit {
  toastService = inject(ToastService);
  vacancyService = inject(VacancyService);
  addService = inject(AddVacancyService);
  userRoleService = inject(UserRolesService);
  translateService = inject(TranslocoService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentStep = signal(1);
  loader = signal(false);
  isEdit = signal(false);
  vacancyId = signal<number | null>(null);

  vacancyData = computed(() => ({
    ...this.addService.addPositionFormGroup.getRawValue(),
    ...this.addService.agreementFormGroup.getRawValue(),
    ...this.addService.extraDetailsForm.getRawValue(),
  }));

  changeStep(step: number) {
    if (step >= 1 && step <= 5) {
      this.currentStep.set(step);
    }
  }

  onSubmit(): void {
    this.loader.set(true);
    const positionData = this.addService.addPositionFormGroup.getRawValue();
    const agreementData = this.addService.agreementFormGroup.getRawValue();
    const extraDetailsData = this.addService.extraDetailsForm.getRawValue();

    agreementData.publish_date = this.formatDateToYMD(agreementData.publish_date);
    agreementData.deadline_date = this.formatDateToYMD(agreementData.deadline_date);

    const payload = {
      ...positionData,
      ...agreementData,
      ...extraDetailsData,
    };

    if (this.isEdit()) {
      this.vacancyService
        .updateVacancy(this.vacancyId() ?? 0, { organisation: this.userRoleService.getOrganisation(), ...payload })
        .pipe(
          finalize(() => {
            this.loader.set(false);
          }),
        )
        .subscribe(() => {
          this.toastService.success(this.translateService.translate('vacancy.update_success'));
          this.changeStep(1);
          this.addService.resetAllForms();
        });
    } else {
      this.vacancyService
        .createVacancy({
          organisation: this.userRoleService.getOrganisation(),
          ...payload,
        })
        .pipe(
          finalize(() => {
            this.loader.set(false);
          }),
          catchError((error) => {
            this.toastService.error(error?.error?.errors[0] ?? this.translateService.translate('shared.errorOccurred'));
            throw error;
          }),
        )
        .subscribe((res: VacancyResourceRes) => {
          this.toastService.success(this.translateService.translate('vacancy.add_success'));
          this.changeStep(1);
          this.addService.resetAllForms();
          this.router.navigate(['/vacancy/details', res.data?.id]);
        });
    }
  }

  formatDateToYMD(date: string | Date | null | undefined): string | null {
    if (!date) return null;

    const d = new Date(date);
    if (isNaN(d.getTime())) return null;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.vacancyService.getVacancy(params['id']).subscribe((vacancy: VacancyResourceRes) => {
          const patchedData = {
            ...vacancy.data,
            start_date: vacancy.data?.start_date
              ? `${new Date(vacancy.data.start_date).getFullYear()} ${new Date(vacancy.data.start_date).toLocaleString('en-US', { month: 'long' })}`
              : undefined,

            publish_date: vacancy.data?.publish_date ? new Date(vacancy.data.publish_date) : undefined,
            deadline_date: vacancy.data?.deadline_date ? new Date(vacancy.data.deadline_date) : undefined,
          };

          this.addService.patchAllForms(patchedData as VacancyResource);
          this.isEdit.set(true);
          this.vacancyId.set(params['id']);
        });
      }
    });
  }
}
