import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_LAYOUT, StepperActivateEvent } from '@progress/kendo-angular-layout';
import { ProgramGeneralInformationStepComponent } from './program-general-information-step/program-general-information-step.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ProgramSelectionStepComponent } from './program-selection-step/program-selection-step.component';
import { ProgramSelectedProgramsStepComponent } from './program-selected-programs-step/program-selected-programs-step.component';
import { ProgramConfirmationStepComponent } from './program-confirmation-step/program-confirmation-step.component';
import { NgTemplateOutlet } from '@angular/common';
import { ProgramSsmStepComponent } from './program-ssm-step/program-ssm-step.component';
import { AdmissionRes, AdmissionService, AdmissionsRes } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DialogRef, DialogResult, DialogService } from '@progress/kendo-angular-dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserRolesService } from '@vet/auth';
import { Citizenship, georgianMobileValidator, ToastService } from '@vet/shared';

interface StepDefinition {
  label: string;
  title: string;
  form: () => FormGroup;
  template: TemplateRef<void>;
  path: string;
}

@Component({
  selector: 'vet-general-admission-stepper-flow',
  imports: [
    KENDO_LAYOUT,
    ReactiveFormsModule,
    ProgramGeneralInformationStepComponent,
    TranslocoPipe,
    ProgramSelectionStepComponent,
    ProgramSelectedProgramsStepComponent,
    ProgramConfirmationStepComponent,
    NgTemplateOutlet,
    ProgramSsmStepComponent,
  ],
  templateUrl: './general-admission-stepper-flow.component.html',
  styleUrl: './general-admission-stepper-flow.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralAdmissionStepperFlowComponent implements OnInit {
  admissionId = input<string | null>(null);
  protected readonly currentStepIndex = signal(0);
  protected currentStep = computed(() => this.steps()[this.currentStepIndex()]);
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

  private dialogService = inject(DialogService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private admissionService = inject(AdmissionService);
  private translocoService = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthenticationService);
  private userRolesService = inject(UserRolesService);
  private toastService = inject(ToastService);

  createFormGroup = computed(() => {
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
        e_name: new FormControl('', Validators.required),
        e_lastname: new FormControl('', Validators.required),
        e_email: new FormControl(
          '',
          [
            Validators.email
          ]
        ),
        e_phone: new FormControl(null, [Validators.required, georgianMobileValidator]),
        spe_description: new FormControl(''),
        program_ids: new FormControl([]),
      }),
      program_selection: new FormGroup({
        program_ids: new FormControl([], Validators.required),
      }),
      selected_programs: new FormGroup({
        program_ids: new FormControl([], Validators.required),
      }),
      confirmation: new FormGroup({
        status: new FormControl('registered'),
      }),
    });
  });

  protected readonly formGroup = this.createFormGroup();

  protected isStepValid(stepIndex: number): boolean {
    const step = this.steps()[stepIndex];
    return !!(step && step.form()?.valid);
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
    if (this.isStepValid(this.currentStepIndex())) {
      let value = this.formGroup.get(formGroupName)?.getRawValue();
      if (this.currentStepIndex() === this.steps().length) {
        value = {
          ...value,
          status: 'registered',
          program_ids: this.formGroup.get('selected_programs')?.value.program_ids ?? [],
        };
      }
      if (this.admissionId()) {
        this.admissionService
          .editAdmission(this.admissionId() as string, value)
          .pipe(
            tap({
              next: () => {
                if (this.currentStepIndex() === this.steps().length) {
                  this.toastService.success('programs.program_updated_successfully');
                  void this.router.navigate(['long-term-programs', 'list']);
                }
              },
              error: () => this.toastService.error('programs.program_update_failed'),
            }),
          )
          .subscribe();
      } else {
        this.admissionService
          .admission(value)
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            tap({
              next: (res: AdmissionRes) => {
                this.toastService.success('programs.program_created_successfully');
                void this.router.navigate(['long-term-programs', 'update-admission', res.data?.id, 'ssm_status']);
              },
              error: () => this.toastService.error('programs.program_creation_failed'),
            }),
          )
          .subscribe();
      }

      if (this.currentStepIndex() < this.steps().length - 1) {
        this.currentStepIndex.set(this.currentStepIndex() + 1);
      }
    }
  }

  ngOnInit() {
    if (this.admissionId()) {
      this.admissionService
        .admissionList({
          role: this.userRolesService.selectedRole(),
          number: this.admissionId(),
        })
        .pipe(
          tap((res: AdmissionsRes) => {
            const admissionData = res.data?.[0];
            if (!admissionData) {
              return;
            }

            const programs = admissionData.programs ?? [];
            const programIds = programs.map((p) => p.program?.program_id).filter((id) => !!id);

            const patchValue = {
              general_information: {
                education: admissionData.education?.id,
                district_id: admissionData.district?.id,
                language: admissionData.language?.id,
                spec_env: admissionData.spec_env || [],
                program_ids: programIds,
                doc: admissionData.doc,
                abroad_doc: admissionData.abroad_doc,
                ocu_doc: admissionData.ocu_doc,
                education_level: admissionData.education_level,
                education_level_id: admissionData.education_level_id,
              },
              ssm_status: {
                spec_edu: admissionData.spec_edu,
                e_name: admissionData.e_name,
                e_lastname: admissionData.e_lastname,
                e_email: admissionData.e_email,
                e_phone: admissionData.e_phone,
                spe_description: admissionData.spe_description,
                program_ids: programIds,
                translate: admissionData.translate,
                translate_select: admissionData.translate_select,
              },
              program_selection: {
                program_ids: admissionData.programs?.map((program) => program?.program?.program_id) ?? [],
              },
              selected_programs: {
                program_ids: admissionData.programs?.map((program) => program?.program?.program_id) ?? [],
              },
            };

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.formGroup.patchValue(patchValue);
            this.formGroup.updateValueAndValidity();
            this.cdr.detectChanges();
          }),
          tap(() => {
            let routeSnapshot = this.activatedRoute.snapshot;
            while (routeSnapshot.firstChild) {
              routeSnapshot = routeSnapshot.firstChild;
            }
            const urlSegments = routeSnapshot.url;
            const stepPath = urlSegments.length ? urlSegments[urlSegments.length - 1].path : null;
            const idx = this.steps().findIndex((step) => step.path === stepPath);
            if (idx >= 0 && this.isStepValid(idx)) {
              this.currentStepIndex.set(idx);
            } else {
              this.currentStepIndex.set(0);
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else {
      this.admissionService
        .studentStatus()
        .pipe(
          tap((res) => {
            if (!res.is_eligible) {
              const dialog: DialogRef = this.dialogService.open({
                title: '',
                content: this.translocoService.translate('shared.alreadyEnrolled'),
                actions: [{ text: this.translocoService.translate('shared.met'), themeColor: 'primary' }],
                preventAction: (ev: DialogResult) => {
                  if ('text' in ev) {
                    return !ev.text;
                  }
                  return true;
                },
              });
              dialog.result.subscribe((result) => {
                if (result) {
                  this.router.navigate(['long-term-programs', 'list']);
                }
              });
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
    this.admissionService
      .educationStatus()
      .pipe(
        tap((res: { level?: string; levelId?: number }) => {
          this.formGroup.get('general_information')?.patchValue({
            education_level: res?.level,
            education_level_id: res?.levelId,
          });
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
