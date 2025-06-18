import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
  HostListener,
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
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

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
  readonly admissionId = input<string | null>(null);
  readonly admissionData = input<AdmissionReq | null>(null);
  readonly educationStatus = input<{ level?: string; levelId?: number } | null>(null);

  createAdmission = output<AdmissionRequest>();
  updateAdmission = output<StepBody<AdmissionRequest>>();

  protected isExpanded = signal(true);
  protected readonly vetIcons = vetIcons;
  protected readonly currentStepIndex = signal(0);
  protected currentStep = computed(() => this.steps()[this.currentStepIndex()]);

  // Responsive properties
  protected isMobile = signal(false);
  protected stepperOrientation = signal<'horizontal' | 'vertical'>('horizontal');
  protected stepType = signal<'indicator' | 'label' | 'full'>('full');

  protected steps = computed((): StepDefinition[] => [
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

  private _programGeneralInformationStepTmpl = viewChild.required('programGeneralInformationStepTmpl', {
    read: TemplateRef,
  });
  private _programSsmStepTmpl = viewChild.required('programSsmStepTmpl', { read: TemplateRef });
  private _programSelectionStepTmpl = viewChild.required('programSelectionStepTmpl', { read: TemplateRef });
  private _programSelectedProgramsStepTmpl = viewChild.required('programSelectedProgramsStepTmpl', {
    read: TemplateRef,
  });
  private _programConfirmationStepTmpl = viewChild.required('programConfirmationStepTmpl', { read: TemplateRef });

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private authService = inject(AuthenticationService);

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateResponsiveState();
  }

  readonly createFormGroup = computed(() => {
    const generalInformationControls: { [key: string]: FormControl } = {
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

    if (this.authService.user()?.residential !== Citizenship.Georgian) {
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
        e_email: new FormControl('', [Validators.email]),
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
  });

  protected readonly formGroup = this.createFormGroup();

  ngOnInit(): void {
    const admissionData = this.admissionData();
    if (admissionData) {
      this.patchAdmission(admissionData);
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

    const educationStatus = this.educationStatus();
    if (educationStatus) {
      this.formGroup.get('general_information')?.patchValue({
        education_level: educationStatus.level ?? null,
        education_level_id: educationStatus.levelId ?? null,
      });
    }

    this.updateResponsiveState();
  }

  private updateResponsiveState(): void {
    const width = window.innerWidth;
    const mobile = width < 768;
    const stepperPanelExpanded = width < 993;

    this.isMobile.set(mobile);

    if (mobile) {
      // Mobile: horizontal stepper at top, always collapsed
      this.stepperOrientation.set('horizontal');
      this.isExpanded.set(false);
    } else if (width < 992) {
      // Tablet: vertical stepper sidebar, collapsed by default
      this.stepperOrientation.set('vertical');
      this.isExpanded.set(false);
    } else {
      // Desktop: vertical stepper sidebar, expanded by default
      this.stepperOrientation.set('vertical');
      this.isExpanded.set(true);
    }

    if (stepperPanelExpanded) {
      this.stepType.set('indicator');
    } else {
      this.stepType.set('full');
    }
  }

  private patchAdmission(d: AdmissionReq): void {
    const programIds =
      (d.programs ?? []).map((p) => p.program?.program_id).filter((id): id is number => typeof id === 'number') || [];

    this.formGroup.patchValue({
      general_information: {
        education: d.education?.id ?? null,
        district_id: d.district?.id ?? null,
        language: d.language?.id ?? null,
        doc: d.doc ?? [],
        spec_env: d.spec_env ?? [],
        abroad_doc: d.abroad_doc ?? [],
        ocu_doc: d.ocu_doc ?? [],
        program_ids: programIds,
        education_level: d.education_level ?? null,
        education_level_id: d.education_level_id ?? null,
        complete_edu_abroad: d.complete_edu_abroad ?? false,
        complete_base_edu_abroad: d.complete_base_edu_abroad ?? false,
      },
      ssm_status: {
        translate: d.translate ?? null,
        translate_select: d.translate_select ?? null,
        spec_edu: d.spec_edu ?? false,
        e_name: d.e_name ?? '',
        e_lastname: d.e_lastname ?? '',
        e_email: d.e_email ?? '',
        e_phone: d.e_phone ?? null,
        spe_description: d.spe_description ?? '',
        program_ids: programIds,
      },
      program_selection: { program_ids: programIds },
      selected_programs: { program_ids: programIds },
      confirmation: { program_ids: programIds, status: 'registered' },
    });
  }

  protected isStepValid(index: number): boolean {
    return this.steps()[index].form().valid;
  }

  protected onStepChange(event: StepperActivateEvent) {
    if (this.isStepValid(this.currentStepIndex()) || event.index < this.currentStepIndex()) {
      this.currentStepIndex.set(event.index);
      void this.router.navigate([
        `long-term-programs/update-admission/${this.admissionId()}/${this.steps()[this.currentStepIndex()].path}`,
      ]);
    } else {
      event.preventDefault();
    }
  }

  protected onPreviousClick() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.set(this.currentStepIndex() - 1);
      void this.router.navigate([
        `long-term-programs/update-admission/${this.admissionId()}/${this.steps()[this.currentStepIndex()].path}`,
      ]);
    }
  }

  protected onNextClick(formGroupName: string) {
    if (formGroupName === 'program_selection') {
      this.formGroup.controls.selected_programs.patchValue(this.formGroup.controls.program_selection.getRawValue());
    }
    if (this.isStepValid(this.currentStepIndex())) {
      let value = this.formGroup.get(formGroupName)?.getRawValue();
      if (formGroupName === 'confirmation') {
        value = {
          ...value,
          status: 'registered',
          program_ids: this.formGroup.get('selected_programs')?.value.program_ids ?? [],
        };
      }
      const lastIndex = this.steps().length - 1;
      const isLast = this.currentStepIndex() === lastIndex;

      if (!isLast) {
        // go to next step
        const next = this.currentStepIndex() + 1;
        this.currentStepIndex.set(next);
        // void this.router.navigate([this.steps()[next].path], { relativeTo: this.router.routerState.root });
      }
      const admissionId = this.admissionId();
      if (admissionId) {
        this.updateAdmission.emit({
          step: this.steps()[this.currentStepIndex()].path,
          body: {
            id: admissionId,
            payload: value as AdmissionRequest,
          },
        });
      } else {
        this.createAdmission.emit(value as AdmissionRequest);
      }
    }
  }

  protected clearSelectedPrograms() {
    this.formGroup.patchValue({
      general_information: {
        ...this.formGroup.get('general_information')?.getRawValue(),
        program_ids: [],
      },
      ssm_status: {
        ...this.formGroup.get('ssm_status')?.getRawValue(),
        program_ids: [],
      },
      program_selection: {
        ...this.formGroup.get('program_selection')?.getRawValue(),
        program_ids: [],
      },
      selected_programs: {
        ...this.formGroup.get('selected_programs')?.getRawValue(),
        program_ids: [],
      },
      confirmation: {
        ...this.formGroup.get('confirmation')?.getRawValue(),
        program_ids: [],
      },
    });
  }

  protected onToggleExpansion() {
    // Only allow toggle on desktop/tablet, not mobile
    if (!this.isMobile()) {
      this.isExpanded.update((value) => !value);
      this.stepType.set(this.isExpanded() ? 'full' : 'indicator');
    }
  }
}
