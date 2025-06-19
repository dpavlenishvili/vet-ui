import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_LAYOUT, StepperActivateEvent } from '@progress/kendo-angular-layout';
import { NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { ProgramGeneralInformationStepComponent } from './program-general-information-step/program-general-information-step.component';
import { ProgramSsmStepComponent } from './program-ssm-step/program-ssm-step.component';
import { ProgramSelectionStepComponent } from './program-selection-step/program-selection-step.component';
import { ProgramSelectedProgramsStepComponent } from './program-selected-programs-step/program-selected-programs-step.component';
import { ProgramConfirmationStepComponent } from './program-confirmation-step/program-confirmation-step.component';
import { TranslocoPipe } from '@jsverse/transloco';

import { AdmissionReq, type AdmissionRequest } from '@vet/backend';
import { AuthenticationService } from '@vet/auth';
import { Citizenship, georgianMobileValidator, vetIcons } from '@vet/shared';
import { StepBody, StepDefinition } from '../long-term-programs.types';
import { ButtonComponent } from '@progress/kendo-angular-buttons';

// Constants
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 992;
const STEPPER_PANEL_BREAKPOINT = 993;

@Component({
  selector: 'vet-admission-wizard',
  standalone: true,
  imports: [
    KENDO_LAYOUT,
    ReactiveFormsModule,
    NgTemplateOutlet,
    TranslocoPipe,
    ProgramGeneralInformationStepComponent,
    ProgramSsmStepComponent,
    ProgramSelectionStepComponent,
    ProgramSelectedProgramsStepComponent,
    ProgramConfirmationStepComponent,
    ButtonComponent,
  ],
  templateUrl: './admission-wizard.component.html',
  styleUrl: './admission-wizard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionWizardComponent implements OnInit {
  // Inputs and Outputs
  readonly admissionId = input<string | null>(null);
  readonly admissionData = input<AdmissionReq | null>(null);
  readonly educationStatus = input<{ level?: string; levelId?: number } | null>(null);

  readonly createAdmission = output<AdmissionRequest>();
  readonly updateAdmission = output<StepBody<AdmissionRequest>>();

  // UI State
  protected readonly isExpanded = signal(true);
  protected readonly vetIcons = vetIcons;
  protected readonly currentStepIndex = signal(0);
  protected readonly currentStep = computed(() => this.steps()[this.currentStepIndex()]);

  // Responsive properties
  protected readonly isMobile = signal(false);
  protected readonly stepperOrientation = signal<'horizontal' | 'vertical'>('horizontal');
  protected readonly stepType = signal<'indicator' | 'label' | 'full'>('full');

  // Template references
  private readonly _programGeneralInformationStepTmpl = viewChild.required('programGeneralInformationStepTmpl', {
    read: TemplateRef,
  });
  private readonly _programSsmStepTmpl = viewChild.required('programSsmStepTmpl', { read: TemplateRef });
  private readonly _programSelectionStepTmpl = viewChild.required('programSelectionStepTmpl', { read: TemplateRef });
  private readonly _programSelectedProgramsStepTmpl = viewChild.required('programSelectedProgramsStepTmpl', {
    read: TemplateRef,
  });
  private readonly _programConfirmationStepTmpl = viewChild.required('programConfirmationStepTmpl', {
    read: TemplateRef,
  });

  // Dependencies
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly authService = inject(AuthenticationService);
  private readonly destroyRef = inject(DestroyRef);

  // Form group - initialized once
  protected readonly formGroup: any = this.createFormGroup();

  // Citizenship type for template
  protected readonly CitizenshipType = Citizenship;

  // Steps configuration
  protected readonly steps = computed((): StepDefinition[] => [
    {
      label: 'programs.general_information',
      title: 'programs.general_information',
      form: () => this.formGroup.controls.general_information,
      template: this._programGeneralInformationStepTmpl(),
      path: 'general_information',
    },
    {
      label: 'programs.ssm_status',
      title: 'programs.ssm_status',
      form: () => this.formGroup.controls.ssm_status,
      template: this._programSsmStepTmpl(),
      path: 'ssm_status',
    },
    {
      label: 'programs.program_selection',
      title: 'programs.program_selection',
      form: () => this.formGroup.controls.program_selection,
      template: this._programSelectionStepTmpl(),
      path: 'program_selection',
    },
    {
      label: 'programs.selected_programs',
      title: 'programs.selected_programs',
      form: () => this.formGroup.controls.selected_programs,
      template: this._programSelectedProgramsStepTmpl(),
      path: 'selected_programs',
    },
    {
      label: 'programs.confirmation',
      title: 'programs.confirmation',
      form: () => this.formGroup.controls.confirmation,
      template: this._programConfirmationStepTmpl(),
      path: 'confirmation',
    },
  ]);

  @HostListener('window:resize')
  onResize(): void {
    this.updateResponsiveState();
  }

  ngOnInit(): void {
    this.initializeFormData();
    this.initializeRouting();
    this.updateResponsiveState();
  }

  private initializeFormData(): void {
    const admissionData = this.admissionData();
    if (admissionData) {
      this.patchAdmission(admissionData);
    }

    const educationStatus = this.educationStatus();
    if (educationStatus) {
      this.formGroup.get('general_information')?.patchValue({
        education_level: educationStatus.level ?? null,
        education_level_id: educationStatus.levelId ?? null,
      });
    }
  }

  private initializeRouting(): void {
    if (!this.admissionData()) {
      if (!this.router.url.includes('/citizenship_selection')) {
        void this.router.navigate(['/registration/citizenship_selection']);
      }
      return;
    }

    // Set initial step based on route
    let routeSnapshot = this.activatedRoute.snapshot;
    while (routeSnapshot.firstChild) {
      routeSnapshot = routeSnapshot.firstChild;
    }

    const urlSegments = routeSnapshot.url;
    const stepPath = urlSegments.length ? urlSegments[urlSegments.length - 1].path : null;
    const idx = this.steps().findIndex((step) => step.path === stepPath);

    if (idx > 0 && this.isStepValid(idx - 1)) {
      this.currentStepIndex.set(idx);
    } else {
      this.currentStepIndex.set(0);
    }
  }

  private createFormGroup(): FormGroup {
    const user = this.authService.user();
    const isForeigner = user?.residential !== Citizenship.Georgian;

    const generalInformationControls: Record<string, FormControl> = {
      education: new FormControl(null, Validators.required),
      district_id: new FormControl(null, Validators.required),
      language: new FormControl(null, Validators.required),
      doc: new FormControl([]),
      spec_env: new FormControl([]),
      abroad_doc: new FormControl([]),
      ocu_doc: new FormControl([]),
      program_ids: new FormControl([]),
      education_level: new FormControl(),
      education_level_id: new FormControl(),
    };

    if (isForeigner) {
      generalInformationControls['complete_edu_abroad'] = new FormControl(false);
      generalInformationControls['complete_base_edu_abroad'] = new FormControl(false);
    }

    return new FormGroup({
      general_information: new FormGroup(generalInformationControls),
      ssm_status: new FormGroup({
        translate: new FormControl(),
        translate_select: new FormControl(),
        spec_edu: new FormControl(false),
        e_name: new FormControl(''),
        e_lastname: new FormControl(''),
        e_email: new FormControl('', Validators.email),
        e_phone: new FormControl('', georgianMobileValidator),
        spe_description: new FormControl(''),
        program_ids: new FormControl<number[]>([]),
      }),
      program_selection: new FormGroup({
        program_ids: new FormControl<number[]>([], Validators.required),
      }),
      selected_programs: new FormGroup({
        program_ids: new FormControl<number[]>([], Validators.required),
      }),
      confirmation: new FormGroup({
        program_ids: new FormControl<number[]>([]),
        status: new FormControl('registered'),
      }),
    });
  }

  private updateResponsiveState(): void {
    const width = window.innerWidth;
    const mobile = width < MOBILE_BREAKPOINT;
    const stepperPanelExpanded = width < STEPPER_PANEL_BREAKPOINT;

    this.isMobile.set(mobile);

    if (mobile) {
      this.stepperOrientation.set('horizontal');
      this.isExpanded.set(false);
    } else if (width < TABLET_BREAKPOINT) {
      this.stepperOrientation.set('vertical');
      this.isExpanded.set(false);
    } else {
      this.stepperOrientation.set('vertical');
      this.isExpanded.set(true);
    }

    this.stepType.set(stepperPanelExpanded ? 'indicator' : 'full');
  }

  private patchAdmission(data: AdmissionReq): void {
    const programIds = this.extractProgramIds(data.programs);
    const user = this.authService.user();
    const isForeigner = user?.residential !== Citizenship.Georgian;

    this.formGroup.patchValue({
      general_information: {
        education: data.education?.id ?? null,
        district_id: data.district?.id ?? null,
        language: data.language?.id ?? null,
        doc: data.doc ?? [],
        spec_env: data.spec_env ?? [],
        abroad_doc: data.abroad_doc ?? [],
        ocu_doc: data.ocu_doc ?? [],
        program_ids: programIds,
        education_level: data.education_level ?? null,
        education_level_id: data.education_level_id ?? null,
        ...(isForeigner && {
          complete_edu_abroad: data.complete_edu_abroad ?? false,
          complete_base_edu_abroad: data.complete_base_edu_abroad ?? false,
        }),
      },
      ssm_status: {
        translate: data.translate ?? null,
        translate_select: data.translate_select ?? null,
        spec_edu: data.spec_edu ?? false,
        e_name: data.e_name ?? '',
        e_lastname: data.e_lastname ?? '',
        e_email: data.e_email ?? '',
        e_phone: data.e_phone ?? null,
        spe_description: data.spe_description ?? '',
        program_ids: programIds,
      },
      program_selection: { program_ids: programIds },
      selected_programs: { program_ids: programIds },
      confirmation: { program_ids: programIds, status: 'registered' },
    });
  }

  private extractProgramIds(programs?: AdmissionReq['programs']): number[] {
    if (!programs) return [];
    return programs.map((p) => p.program?.program_id).filter((id): id is number => typeof id === 'number');
  }

  protected isStepValid(index: number): boolean {
    const step = this.steps()[index];
    return step?.form()?.valid ?? false;
  }

  protected onStepChange(event: StepperActivateEvent): void {
    if (this.isStepValid(this.currentStepIndex()) || event.index < this.currentStepIndex()) {
      this.currentStepIndex.set(event.index);
      this.navigateToStep(event.index);
    } else {
      event.preventDefault();
    }
  }

  protected onPreviousClick(): void {
    const currentIndex = this.currentStepIndex();
    if (currentIndex > 0) {
      this.currentStepIndex.set(currentIndex - 1);
      this.navigateToStep(currentIndex - 1);
    }
  }

  protected onNextClick(formGroupName: string): void {
    // Sync program selection to selected programs
    if (formGroupName === 'program_selection') {
      const programIds = this.formGroup.controls.program_selection.value.program_ids;
      this.formGroup.controls.selected_programs.patchValue({ program_ids: programIds });
    }

    if (!this.isStepValid(this.currentStepIndex())) {
      return;
    }

    const payload = this.preparePayload(formGroupName);
    const currentIndex = this.currentStepIndex();
    const isLastStep = currentIndex === this.steps().length - 1;

    if (!isLastStep) {
      this.currentStepIndex.set(currentIndex + 1);
    }

    this.emitUpdate(payload, formGroupName);
  }

  private preparePayload(formGroupName: string): AdmissionRequest {
    let value = this.formGroup.get(formGroupName)?.getRawValue();

    if (formGroupName === 'confirmation') {
      value = {
        ...value,
        status: 'registered',
        program_ids: this.formGroup.get('selected_programs')?.value.program_ids ?? [],
      };
    }

    return value as AdmissionRequest;
  }

  private emitUpdate(payload: AdmissionRequest, formGroupName: string): void {
    const admissionId = this.admissionId();

    if (admissionId) {
      this.updateAdmission.emit({
        step: this.steps()[this.currentStepIndex()].path,
        body: {
          id: admissionId,
          payload,
        },
      });
    } else {
      this.createAdmission.emit(payload);
    }
  }

  protected clearSelectedPrograms(): void {
    const emptyProgramIds: number[] = [];

    // Clear program IDs in all form groups
    ['general_information', 'ssm_status', 'program_selection', 'selected_programs', 'confirmation'].forEach((key) => {
      const control = this.formGroup.get(key);
      if (control) {
        const currentValue = control.value;
        control.patchValue({ ...currentValue, program_ids: emptyProgramIds });
      }
    });
  }

  protected onToggleExpansion(): void {
    if (!this.isMobile()) {
      this.isExpanded.update((value) => !value);
      this.stepType.set(this.isExpanded() ? 'full' : 'indicator');
    }
  }

  private navigateToStep(index: number): void {
    const stepPath = this.steps()[index].path;
    const admissionId = this.admissionId();

    if (admissionId) {
      void this.router.navigate([`long-term-programs/update-admission/${admissionId}/${stepPath}`]);
    } else {
      void this.router.navigate([`/registration/${stepPath}`]);
    }
  }
}
