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
import { AdmissionPrograms, AdmissionRes, AdmissionService, AdmissionsRes } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap, tap } from 'rxjs';
import { DialogRef, DialogResult, DialogService } from '@progress/kendo-angular-dialog';
import { Router } from '@angular/router';
import { CustomAuthService } from '@vet/auth';

interface StepDefinition {
  label: string;
  title: string;
  form: () => FormGroup;
  template: TemplateRef<void>;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
    },
    {
      label: 'programs.ssm_status',
      title: 'programs.ssm_status',
      form: () => this.formGroup.controls.ssm_status,
      template: this._programSsmStepTmpl(),
    },
    {
      label: 'programs.program_selection',
      title: 'programs.program_selection',
      form: () => this.formGroup.controls.program_selection,
      template: this._programSelectionStepTmpl(),
    },
    {
      label: 'programs.selected_programs',
      title: 'programs.selected_programs',
      form: () => this.formGroup.controls.selected_programs,
      template: this._programSelectedProgramsStepTmpl(),
    },
    {
      label: 'programs.confirmation',
      title: 'programs.confirmation',
      form: () => this.formGroup.controls.confirmation,
      template: this._programConfirmationStepTmpl(),
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
  private admissionService = inject(AdmissionService);
  private translocoService = inject(TranslocoService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(CustomAuthService);

  tokenUser$ = this.authService.tokenUser$;
  userRole$ = this.authService.userRole$;

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

    if (this.tokenUser$()?.residential !== 'GEO') {
      generalInformationControls['complete_edu_abroad'] = new FormControl(false);
      generalInformationControls['complete_base_edu_abroad'] = new FormControl(false);
    }
    return new FormGroup({
      general_information: new FormGroup(generalInformationControls),
      ssm_status: new FormGroup({
        ssm_translator_requirement: new FormControl(false),
        language: new FormControl(''),

        spec_edu: new FormControl(false),
        e_name: new FormControl(''),
        e_lastname: new FormControl(''),
        e_email: new FormControl(''),
        e_phone: new FormControl(''),
        spe_description: new FormControl(''),
        program_ids: new FormControl([]),
      }),
      program_selection: new FormGroup({
        program_ids: new FormControl([]),
      }),
      selected_programs: new FormGroup({
        program_ids: new FormControl([]),
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
    } else {
      event.preventDefault();
    }
  }

  protected onPreviousClick() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.set(this.currentStepIndex() - 1);
    }
  }

  protected onNextClick(formGroupName: string) {
    if (this.isStepValid(this.currentStepIndex())) {
      let value = this.formGroup.get(formGroupName)?.getRawValue();
      if (this.currentStepIndex() === this.steps().length - 1) {
        value = { ...value, status: 'registered' };
      }
      if (this.admissionId()) {
        this.admissionService.editAdmission(this.admissionId() as string, value).subscribe();
      } else {
        this.admissionService
          .admission(value)
          .pipe(
            tap((res: AdmissionRes) => {
              this.router.navigate(['long-term-programs', 'update-admission', res.data?.id]);
            }),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe();
      }
      this.currentStepIndex.set(this.currentStepIndex() + 1);
    }
  }

  ngOnInit(): void {
    if (this.admissionId()) {
      this.admissionService
        .admissionList({
          role: this.userRole$(),
          number: this.admissionId(),
        })
        .pipe(
          tap((res: AdmissionsRes) => {
            const admissionData = res.data?.[0];
            if (!admissionData) {
              return;
            }
            const filteredPrograms = (data: AdmissionPrograms[] | undefined) =>
              data ? data.filter((p) => p?.program?.program_id) : [];
            console.log(admissionData);
            const patchValue = {
              general_information: {
                education: admissionData.education?.id,
                district_id: admissionData.district?.id,
                language: admissionData.language?.id,
                spec_env: admissionData.spec_env || [],
                program_ids: filteredPrograms(admissionData.programs),
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
                program_ids: filteredPrograms(admissionData.programs),
                language: admissionData.language && Number(admissionData.language.id) !== Number('0') ? admissionData.language.id : '',
              },
              program_selection: {
                program_ids: filteredPrograms(admissionData.programs),
              },
              selected_programs: {
                program_ids: filteredPrograms(admissionData.programs),
              },
            };

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            this.formGroup.patchValue(patchValue);
            this.formGroup.updateValueAndValidity();
            this.cdr.detectChanges();
          }),
          switchMap((res: AdmissionsRes) => {
            console.log(res);
            if (!(res.data?.[0]?.education_level && res.data?.[0]?.education_level_id)) {
              return this.admissionService.educationStatus().pipe(
                tap((res: { level?: string; levelId?: number }) => {
                  this.formGroup.get('general_information')?.patchValue({
                    education_level: res.level,
                    education_level_id: res.levelId,
                  });
                }),
                takeUntilDestroyed(this.destroyRef),
              );
            } else {
              return of(null);
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
  }

  onSubmit() {}
}
