import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionReq, type AdmissionRequest, AdmissionService } from '@vet/backend';
import { useAlert } from '@vet/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdmissionWizardComponent } from '../admission-wizard/admission-wizard.component';
import { UserRolesService } from '@vet/auth';
import { StepBody } from '../long-term-programs.types';

@Component({
  selector: 'vet-admission-update',
  standalone: true,
  template: `
    @if (admissionData()) {
      <vet-admission-wizard
        [admissionId]="admissionId()"
        [admissionData]="admissionData()"
        [educationStatus]="educationStatus()"
        (updateAdmission)="onUpdate($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdmissionWizardComponent],
})
export class AdmissionUpdateComponent implements OnInit {
  private admissionService = inject(AdmissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private userRolesService = inject(UserRolesService);
  private alert = useAlert();

  admissionId = signal(this.route.snapshot.paramMap.get('admissionId'));
  admissionData = signal<AdmissionReq | null>(null);
  educationStatus = signal<{ level?: string; levelId?: number } | null>(null);

  ngOnInit() {
    const id = this.admissionId();
    this.admissionService
      .admissionList({
        role: this.userRolesService.selectedRole(),
        number: id,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        const first = res.data?.[0] ?? null;
        this.admissionData.set(first);
      });

    this.admissionService
      .educationStatus()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.educationStatus.set(res);
      });
  }

  onUpdate(e: StepBody<AdmissionRequest>) {
    this.admissionService
      .editAdmission(e.body.id, e.body.payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (e.step === 'confirmation' && e.body.payload.status === 'registered') {
          this.alert.show({ text: 'programs.program_updated_successfully', variant: 'success' });
          this.router.navigate(['long-term-programs', 'list']);
        } else {
          void this.router.navigate([
            `long-term-programs/update-admission/${this.admissionId()}/${e.step}`,
          ]);
        }
      });
  }
}
