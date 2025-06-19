import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionReq, type AdmissionRequest, AdmissionService } from '@vet/backend';
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
  private readonly admissionService = inject(AdmissionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userRolesService = inject(UserRolesService);

  protected readonly admissionId = signal(this.route.snapshot.paramMap.get('admissionId'));
  protected readonly admissionData = signal<AdmissionReq | null>(null);
  protected readonly educationStatus = signal<{ level?: string; levelId?: number } | null>(null);

  ngOnInit(): void {
    const id = this.admissionId();
    if (!id) {
      this.router.navigate(['long-term-programs', 'list']);
      return;
    }

    this.loadAdmissionData(id);
    this.loadEducationStatus();
  }

  private loadAdmissionData(id: string): void {
    this.admissionService
      .admissionList({
        role: this.userRolesService.selectedRole(),
        number: id,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        const admission = response.data?.[0] ?? null;
        if (!admission) {
          this.router.navigate(['long-term-programs', 'list']);
          return;
        }
        this.admissionData.set(admission);
      });
  }

  private loadEducationStatus(): void {
    this.admissionService
      .educationStatus()
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        this.educationStatus.set(response);
      });
  }

  protected onUpdate(event: StepBody<AdmissionRequest>): void {
    const admissionId = this.admissionId();
    if (!admissionId) {
      return;
    }

    this.admissionService
      .editAdmission(admissionId, event.body.payload)
      .pipe(
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }

        if (event.step === 'confirmation' && event.body.payload.status === 'registered') {
          this.router.navigate(['long-term-programs', 'list']);
        } else {
          void this.router.navigate([`long-term-programs/update-admission/${admissionId}/${event.step}`]);
        }
      });
  }
}
