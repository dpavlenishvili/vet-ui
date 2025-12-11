import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { WA_WINDOW } from '@ng-web-apis/common';

import { NonFormalApplicationStepperComponent } from './non-formal-application-stepper/non-formal-application-stepper.component';
import { NonFormalFieldSelectionStepComponent } from './non-formal-field-selection-step/non-formal-field-selection-step.component';
import { NonFormalSelectedFieldsStepComponent } from './non-formal-selected-fields-step/non-formal-selected-fields-step.component';
import { NonFormalQuestionnaireStepComponent } from './non-formal-questionnaire-step/non-formal-questionnaire-step.component';
import { NonFormalDocumentsStepComponent } from './non-formal-documents-step/non-formal-documents-step.component';
import { NonFormalConfirmationStepComponent } from './non-formal-confirmation-step/non-formal-confirmation-step.component';
import { WizardStepDefinition } from '@vet/shared';
import { numericValidator } from '@vet/shared/validators';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 992;

export interface NonFormalApplicationData {
  id?: number;
  user_id?: number;
  non_formal_id?: number;
  status?: {
    id?: string;
    name?: string;
    changed_at?: string;
  };
  status_id?: number | string;
  is_draft?: boolean;
  recognition_purpose?: string | null;
  action_description?: string | null;
  who_taught_you?: string | null;
  experience_years?: string | null;
  source_of_information?: string | null;
  like_your_job?: boolean | null;
  education_level_id?: number | null;
  created_at?: string;
  updated_at?: string;
  media?: {
    certificate?: Array<{ id?: number; file_name?: string; url?: string }>;
    employment_contract?: Array<{ id?: number; file_name?: string; url?: string }>;
    certificate_from_workplace?: Array<{ id?: number; file_name?: string; url?: string }>;
    other?: Array<{ id?: number; file_name?: string; url?: string }>;
  };
  can_change_program?: boolean;
}

export interface ApplicationRequest {
  non_formal_id?: number;
  education_level_id?: number;
  recognition_purpose?: string;
  action_description?: string;
  who_taught_you?: string;
  source_of_information?: string;
  like_your_job?: boolean;
  experience_years?: string;
  certificate?: File[];
  employment_contract?: File[];
  certificate_from_workplace?: File[];
  other?: File[];
  who_taught_you_other?: string | null;
  source_of_information_other?: string | null;
}

export interface StepBody<T> {
  step: string;
  body: {
    id: string | null;
    payload: T;
  };
}

@Component({
  selector: 'vet-application-wizard',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NonFormalApplicationStepperComponent,
    NonFormalFieldSelectionStepComponent,
    NonFormalSelectedFieldsStepComponent,
    NonFormalQuestionnaireStepComponent,
    NonFormalDocumentsStepComponent,
    NonFormalConfirmationStepComponent,
  ],
  templateUrl: './application-wizard.component.html',
  styleUrl: './application-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationWizardComponent implements OnInit {
  readonly applicationId = input<string | null>(null);
  readonly applicationData = input<NonFormalApplicationData | null>(null);
  readonly isViewMode = input<boolean>(false);

  readonly createApplication = output<ApplicationRequest>();
  readonly updateApplication = output<StepBody<ApplicationRequest>>();
  readonly reloadApplicationData = output<void>();

  protected readonly formGroup = signal<FormGroup | null | any>(null);
  protected readonly currentStepIndex = signal(0);
  protected readonly isMobile = signal(false);
  protected readonly currentStep = computed(() => this.steps()[this.currentStepIndex()]);
  private readonly initialFormValues = signal<any>(null);

  private readonly _fieldSelectionStepTmpl = viewChild.required<TemplateRef<unknown>>('fieldSelectionStepTemplate');
  private readonly _selectedFieldsStepTmpl = viewChild.required<TemplateRef<unknown>>('selectedFieldsStepTemplate');
  private readonly _questionnaireStepTmpl = viewChild.required<TemplateRef<unknown>>('questionnaireStepTemplate');
  private readonly _documentsStepTmpl = viewChild.required<TemplateRef<unknown>>('documentsStepTemplate');
  private readonly _confirmationStepTmpl = viewChild.required<TemplateRef<unknown>>('confirmationStepTemplate');

  protected readonly steps = computed((): WizardStepDefinition[] => {
    const form = this.formGroup();

    if (
      !form ||
      !this._fieldSelectionStepTmpl() ||
      !this._selectedFieldsStepTmpl() ||
      !this._questionnaireStepTmpl() ||
      !this._documentsStepTmpl() ||
      !this._confirmationStepTmpl()
    ) {
      return [];
    }

    return this.buildSteps(form);
  });

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly isFormInitialized = signal(false);
  private readonly window = inject(WA_WINDOW);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (!this.isFormInitialized()) {
        const form = this.createFormGroup();
        this.formGroup.set(form);
        this.isFormInitialized.set(true);
        this.setupConditionalValidators(form);
        this.initializeFormData();
        this.initializeRouting();
      }
    });

    fromEvent(this.window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateResponsiveState();
      });
  }

  ngOnInit(): void {
    this.updateResponsiveState();
  }

  onProgramDelete() {
    const fieldSelectionGroup = this.formGroup().get('field_selection');
    fieldSelectionGroup?.patchValue({ selected_program_id: null });
    fieldSelectionGroup?.get('selected_program_id')?.markAsTouched();
    fieldSelectionGroup?.get('selected_program_id')?.updateValueAndValidity();
  }

  protected isStepValid(index: number): boolean {
    if (this.isViewMode()) {
      return true;
    }

    const step = this.steps()[index];
    return step?.form()?.valid ?? false;
  }

  protected onStepIndexChange(stepIndex: number): void {
    const currentIndex = this.currentStepIndex();

    if (this.isViewMode()) {
      this.currentStepIndex.set(stepIndex);
      this.navigateToStep(stepIndex);
    } else {
      if (stepIndex < currentIndex || this.isStepValid(currentIndex)) {
        this.currentStepIndex.set(stepIndex);
        this.navigateToStep(stepIndex);
      }
    }
  }

  protected onNext(): void {
    const form = this.formGroup();
    if (!form) return;

    const currentIndex = this.currentStepIndex();
    const currentStepPath = this.steps()[currentIndex].path;

    if (this.isViewMode()) {
      const isLastStep = currentIndex === this.steps().length - 1;

      if (!isLastStep) {
        this.currentStepIndex.set(currentIndex + 1);
        this.navigateToStep(currentIndex + 1);
      } else {
        this.router.navigate(['dashboard', 'programs', 'non-formal']);
      }
      return;
    }

    if (!this.isStepValid(currentIndex)) {
      this.steps()[currentIndex].form()?.markAllAsTouched();
      return;
    }

    const isLastStep = currentIndex === this.steps().length - 1;

    const stepsWithoutApiCall = ['selected-fields', 'documents'];

    if (stepsWithoutApiCall.includes(currentStepPath)) {
      if (!isLastStep) {
        this.currentStepIndex.set(currentIndex + 1);
        this.navigateToStep(currentIndex + 1);
      }
      return;
    }

    const applicationId = this.applicationId();
    const isUpdateMode = !!applicationId;

    if (isUpdateMode && !this.hasFormChanged(currentStepPath)) {
      if (!isLastStep) {
        this.currentStepIndex.set(currentIndex + 1);
        this.navigateToStep(currentIndex + 1);
      }
      return;
    }

    const payload = this.preparePayload(currentStepPath);

    if (!isLastStep) {
      this.currentStepIndex.set(currentIndex + 1);
    }

    if (isUpdateMode) {
      this.initialFormValues.set(this.getFormSnapshot());
    }

    this.emitUpdate(payload, currentStepPath);
  }

  protected onBack(): void {
    const currentIndex = this.currentStepIndex();
    if (currentIndex > 0) {
      this.currentStepIndex.set(currentIndex - 1);
      this.navigateToStep(currentIndex - 1);
    }
  }

  protected onSubmit(): void {
    if (this.isViewMode()) {
      this.router.navigate(['dashboard', 'programs', 'non-formal']);
      return;
    }

    const form = this.formGroup();
    if (!form) return;

    const payload = this.preparePayload('confirmation');
    this.emitUpdate(payload, 'confirmation');
  }

  protected onDocumentsUploaded(): void {
    this.reloadApplicationData.emit();
  }

  private initializeFormData(): void {
    const form = this.formGroup();
    if (!form) return;

    const applicationData = this.applicationData();
    if (applicationData) {
      this.patchApplication(applicationData);
      this.initialFormValues.set(this.getFormSnapshot());
    }

    this.disableFormControlsInViewMode();
  }

  private disableFormControlsInViewMode(): void {
    if (!this.isViewMode()) return;

    const form = this.formGroup();
    if (!form) return;

    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control instanceof FormGroup) {
        this.disableFormGroup(control);
      } else {
        control?.disable();
      }
    });
  }

  private disableFormGroup(group: FormGroup): void {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control instanceof FormGroup) {
        this.disableFormGroup(control);
      } else {
        control?.disable();
      }
    });
  }

  private initializeRouting(): void {
    if (!this.applicationData()) {
      return;
    }

    let routeSnapshot = this.activatedRoute.snapshot;
    while (routeSnapshot.firstChild) {
      routeSnapshot = routeSnapshot.firstChild;
    }

    const urlSegments = routeSnapshot.url;
    const stepPath = urlSegments.length ? urlSegments[urlSegments.length - 1].path : null;
    const idx = this.steps().findIndex((step) => step.path === stepPath);

    if (this.isViewMode()) {
      this.currentStepIndex.set(idx > -1 ? idx : 0);
    } else {
      if (idx > 0 && this.isStepValid(idx - 1)) {
        this.currentStepIndex.set(idx);
      } else {
        this.currentStepIndex.set(0);
      }
    }
  }

  private createFormGroup(): FormGroup {
    return new FormGroup({
      field_selection: new FormGroup({
        selected_program_id: new FormControl<number | null>(null, Validators.required),
      }),
      questionnaire: new FormGroup({
        education_level_id: new FormControl<number | null>(null, Validators.required),
        recognition_purpose: new FormControl<string | null>(null, Validators.required),
        action_description: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(2000)]),
        who_taught_you: new FormControl<string | null>(null, Validators.required),
        who_taught_you_other: new FormControl<string | null>(null),
        source_of_information: new FormControl<string | null>(null, Validators.required),
        source_of_information_other: new FormControl<string | null>(null),
        like_your_job: new FormControl<boolean | null>(false),
        experience_years: new FormControl<string | null>(null, [Validators.required, numericValidator]),
      }),
      documents: new FormGroup({
        certificate: new FormControl<any[]>([], Validators.required),
        employment_contract: new FormControl<any[]>([], Validators.required),
        certificate_from_workplace: new FormControl<any[]>([], Validators.required),
        other: new FormControl<any[]>([]),
      }),
    });
  }

  private setupConditionalValidators(form: FormGroup): void {
    const questionnaireGroup = form.get('questionnaire') as FormGroup;
    if (!questionnaireGroup) return;

    const whoTaughtYouControl = questionnaireGroup.get('who_taught_you');
    const whoTaughtYouOtherControl = questionnaireGroup.get('who_taught_you_other');
    const sourceOfInfoControl = questionnaireGroup.get('source_of_information');
    const sourceOfInfoOtherControl = questionnaireGroup.get('source_of_information_other');

    whoTaughtYouControl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      try {
        const selectedIds = JSON.parse(value || '[]');
        if (Array.isArray(selectedIds) && selectedIds.includes(1000)) {
          whoTaughtYouOtherControl?.setValidators([Validators.required]);
        } else {
          whoTaughtYouOtherControl?.clearValidators();
          whoTaughtYouOtherControl?.patchValue(null);
        }
        whoTaughtYouOtherControl?.updateValueAndValidity();
      } catch {
        whoTaughtYouOtherControl?.clearValidators();
        whoTaughtYouOtherControl?.updateValueAndValidity();
      }
    });

    sourceOfInfoControl?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      try {
        const selectedIds = JSON.parse(value || '[]');
        if (Array.isArray(selectedIds) && selectedIds.includes(1000)) {
          sourceOfInfoOtherControl?.setValidators([Validators.required]);
        } else {
          sourceOfInfoOtherControl?.clearValidators();
          sourceOfInfoOtherControl?.patchValue(null);
        }
        sourceOfInfoOtherControl?.updateValueAndValidity();
      } catch {
        sourceOfInfoOtherControl?.clearValidators();
        sourceOfInfoOtherControl?.updateValueAndValidity();
      }
    });
  }

  private updateResponsiveState(): void {
    const width = this.window.innerWidth;
    const mobile = width < MOBILE_BREAKPOINT;
    this.isMobile.set(mobile);
  }

  private patchApplication(data: NonFormalApplicationData): void {
    const form = this.formGroup();
    if (!form) return;

    form.patchValue({
      field_selection: {
        selected_program_id: data.non_formal_id ?? null,
      },
      questionnaire: {
        education_level_id: data.education_level_id ?? null,
        recognition_purpose: data.recognition_purpose ?? null,
        action_description: data.action_description ?? null,
        who_taught_you: data.who_taught_you ?? null,
        who_taught_you_other: (data as any).who_taught_you_other ?? null,
        source_of_information: data.source_of_information ?? null,
        source_of_information_other: (data as any).source_of_information_other ?? null,
        like_your_job: data.like_your_job ?? null,
        experience_years: data.experience_years ? Number(data.experience_years) : null,
      },
      documents: {
        certificate: data.media?.certificate ?? [],
        employment_contract: data.media?.employment_contract ?? [],
        certificate_from_workplace: data.media?.certificate_from_workplace ?? [],
        other: data.media?.other ?? [],
      },
    });
  }

  private preparePayload(stepPath: string): ApplicationRequest {
    const form = this.formGroup();
    if (!form) return {} as ApplicationRequest;

    let payload: ApplicationRequest = {};

    switch (stepPath) {
      case 'field-selection':
      case 'selected-fields':
        payload = {
          non_formal_id: form.get('field_selection.selected_program_id')?.value ?? null,
        };
        break;
      case 'questionnaire':
        payload = form.get('questionnaire')?.getRawValue() || {};
        if (payload.experience_years !== null && payload.experience_years !== undefined) {
          payload.experience_years = String(payload.experience_years);
        }

        if (payload.like_your_job === null) {
          payload.like_your_job = false;
        }
        break;
      case 'documents':
        payload = form.get('documents')?.getRawValue() || {};
        break;
      case 'confirmation':
        break;
    }

    return payload;
  }

  private emitUpdate(payload: ApplicationRequest, stepPath: string): void {
    const applicationId = this.applicationId();

    this.updateApplication.emit({
      step: stepPath,
      body: {
        id: applicationId,
        payload,
      },
    });
  }

  private buildSteps(form: FormGroup): WizardStepDefinition[] {
    const stepConfigs = [
      {
        i18nKey: 'field_selection',
        formControlName: 'field_selection',
        template: this._fieldSelectionStepTmpl,
      },
      {
        i18nKey: 'selected_fields',
        formControlName: 'field_selection',
        template: this._selectedFieldsStepTmpl,
      },
      {
        i18nKey: 'questionnaire',
        formControlName: 'questionnaire',
        template: this._questionnaireStepTmpl,
      },
      {
        i18nKey: 'documents',
        formControlName: 'documents',
        template: this._documentsStepTmpl,
      },
      {
        i18nKey: 'confirmation',
        formControlName: 'field_selection',
        template: this._confirmationStepTmpl,
      },
    ];

    return stepConfigs.map((config) => ({
      label: `non_formal.${config.i18nKey}`,
      title: `non_formal.${config.i18nKey}`,
      form: () => form.controls[config.formControlName] as FormGroup,
      template: config.template,
      path: config.i18nKey.replace(/_/g, '-'),
    }));
  }

  private navigateToStep(index: number): void {
    const step = this.steps()[index];
    if (!step) return;

    const stepPath = step.path;
    const applicationId = this.applicationId();

    if (applicationId) {
      const routePrefix = this.isViewMode() ? 'view-application' : 'update-application';
      void this.router.navigate([`/programs/non-formal/${routePrefix}/${applicationId}/${stepPath}`]);
    } else {
      void this.router.navigate([`/programs/non-formal/register-application/${stepPath}`]);
    }
  }

  private getFormSnapshot(): any {
    const form = this.formGroup();
    if (!form) return null;

    return JSON.parse(JSON.stringify(form.getRawValue()));
  }

  private hasFormChanged(stepPath: string): boolean {
    const initial = this.initialFormValues();
    if (!initial) return true;

    const current = this.getFormSnapshot();
    if (!current) return false;

    switch (stepPath) {
      case 'field-selection':
      case 'selected-fields':
        return JSON.stringify(initial.field_selection) !== JSON.stringify(current.field_selection);
      case 'questionnaire':
        return JSON.stringify(initial.questionnaire) !== JSON.stringify(current.questionnaire);
      case 'documents':
        return JSON.stringify(initial.documents) !== JSON.stringify(current.documents);
      default:
        return true;
    }
  }
}
