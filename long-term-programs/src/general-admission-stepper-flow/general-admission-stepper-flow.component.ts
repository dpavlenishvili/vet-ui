import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
  viewChild
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_LAYOUT, StepperActivateEvent } from '@progress/kendo-angular-layout';
import { ProgramGeneralInformationStepComponent } from './program-general-information-step/program-general-information-step.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProgramSelectionStepComponent } from './program-selection-step/program-selection-step.component';
import { ProgramSelectedProgramsStepComponent } from './program-selected-programs-step/program-selected-programs-step.component';
import { ProgramConfirmationStepComponent } from './program-confirmation-step/program-confirmation-step.component';
import { NgTemplateOutlet } from '@angular/common';
import { ProgramSsmStepComponent } from './program-ssm-step/program-ssm-step.component';
import { AdmissionRes, AdmissionService, AdmissionsRes } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
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
  private _programSsmStepTmpl = viewChild.required('programSsmStepTmpl', {
    read: TemplateRef,
  });
  private _programSelectionStepTmpl = viewChild.required('programSelectionStepTmpl', { read: TemplateRef });
  private _programSelectedProgramsStepTmpl = viewChild.required('programSelectedProgramsStepTmpl', {
    read: TemplateRef,
  });
  private _programConfirmationStepTmpl = viewChild.required('programConfirmationStepTmpl', { read: TemplateRef });

  private dialogService = inject(DialogService);
  private router = inject(Router);
  private admissionService = inject(AdmissionService);
  tokenUser$ = inject(CustomAuthService).tokenUser$;
  createFormGroup = computed(() => {
    const generalInformationControls: { [key: string]: FormControl } = {
      education: new FormControl('', Validators.required),
      district_id: new FormControl(null, Validators.required),
      language: new FormControl('', Validators.required),
      doc: new FormControl([]),
      spec_env: new FormControl([], Validators.required),
      abroad_doc: new FormControl([]),
      ocu_doc: new FormControl([]),
      program_ids: new FormControl([]),
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
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  protected isStepValid(stepIndex: number): boolean {
    const step = this.steps()[stepIndex];

    return step && !!step.form()?.valid;
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
      if (this.currentStepIndex() === this.steps.length - 1) {
        value = {
          ...value,
          status: 'registered',
        };
      }
      if (this.admissionId()) {
        console.log('test');
        this.admissionService.editAdmission(this.admissionId() as string, value).subscribe();
      } else {
        this.admissionService
          .admission(value)
          .pipe(
            tap((res: AdmissionRes) => {
              this.router.navigate(['/update-admission', res.data?.id]);
            }),
          )
          .subscribe();
      }
      this.currentStepIndex.set(this.currentStepIndex() + 1);
    }
  }

  ngOnInit(): void {
    this.admissionService.admissionList({
      role: 'Default User',
      number: this.admissionId(),
    }).pipe(
      tap((res: AdmissionsRes) => {
        console.log(res);
        console.log(res.data?.[0]?.programs ? res.data?.[0]?.programs.filter(p => p?.program?.program_id) : []);

        const patchValue: any = {
          general_information: {
            education: res.data?.[0]?.education,
            district_id: res.data?.[0].district_id,
            language: res.data?.[0].language,
            spec_env: res.data?.[0].spec_env ? res.data?.[0].spec_env : [],
            program_ids: res.data?.[0]?.programs ? res.data?.[0]?.programs.filter(p => p?.program?.program_id) : [],
          },
          ssm_status: {
            spec_edu: res.data?.[0].spec_edu,
            e_name: res.data?.[0].e_name,
            e_lastname: res.data?.[0].e_lastname,
            e_email: res.data?.[0].e_email,
            e_phone: res.data?.[0].e_phone,
            spe_description: res.data?.[0].spe_description,
            program_ids: res.data?.[0]?.programs ? res.data?.[0]?.programs.filter(p => p?.program?.program_id) : [],
            language: res.data?.[0].language && res.data?.[0].language !== '0' ? res.data?.[0].language : '',
          },
          program_selection: {
            program_ids: res.data?.[0]?.programs ? res.data?.[0]?.programs.filter(p => p?.program?.program_id) : [],
          },
          selected_programs: {
            program_ids: res.data?.[0]?.programs ? res.data?.[0]?.programs.filter(p => p?.program?.program_id) : [],
          },
        };

        this.formGroup.patchValue(patchValue);
        this.formGroup.updateValueAndValidity();
        this.cdr.detectChanges();

      })
    ).subscribe();
    this.admissionService
      .studentStatus()
      .pipe(
        tap((res) => {
          if (!res.is_eligible) {
            const dialog: DialogRef = this.dialogService.open({
              title: '',
              content: 'თქვენ უკვე ჩარიცხული ხართ სხვა პროგრამაზე',
              actions: [{ text: 'გავეცანი', themeColor: 'primary' }],
            });

            dialog.result.subscribe((result) => {
              if (result) {
                this.router.navigate(['/home']);
              }
            });
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onSubmit() {
  }
}
