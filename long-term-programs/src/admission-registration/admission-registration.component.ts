import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { type AdmissionRequest, AdmissionService } from '@vet/backend';
import { useConfirm } from '@vet/shared';
import { AdmissionWizardComponent } from '../admission-wizard/admission-wizard.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-admission-registration',
  template: `
    @if (!loading()) {
      <vet-admission-wizard
        [admissionId]="null"
        [educationStatus]="educationStatus()"
        (createAdmission)="onCreate($event)"
      />
    }
  `,
  imports: [AdmissionWizardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionRegistrationComponent implements OnInit {
  private admissionService = inject(AdmissionService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private confirm = useConfirm();

  loading = signal<boolean>(true);
  educationStatus = signal<{ level?: string; levelId?: number } | null>(null);

  ngOnInit() {
    this.admissionService
      .studentStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        if (!res.is_eligible) {
          this.confirm.info({
            title: 'programs.enrollmentStatus',
            content: 'shared.alreadyEnrolled',
            showYesNoButtons: false,
            singleTypeDialogActionText: 'programs.viewAdmissions',
            onConfirm: () => {
              this.router.navigate(['long-term-programs', 'list']);
            }
          });
        }
      });

    this.admissionService
      .educationStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.educationStatus.set(res);
        this.loading.set(false);
      });
  }

  onCreate(payload: AdmissionRequest) {
    this.admissionService
      .admission(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const newId = res.data?.id;
        if (newId) {
          this.router.navigate(['long-term-programs', 'update-admission', newId, 'ssm_status']);
        }
      });
  }
}
