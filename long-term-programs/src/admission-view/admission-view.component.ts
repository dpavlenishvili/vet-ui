import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AdmissionWizardComponent } from '../admission-wizard/admission-wizard.component';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-admission-view',
  standalone: true,
  template: `
    @if (admissionData()) {
      <vet-admission-wizard [admissionId]="admissionId()" [admissionData]="admissionData()" [isViewMode]="true" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AdmissionWizardComponent],
})
export class AdmissionViewComponent implements OnInit {
  protected readonly admissionData = signal<AdmissionReq | null>(null);
  private readonly admissionService = inject(AdmissionService);
  private readonly route = inject(ActivatedRoute);
  protected readonly admissionId = signal(this.route.snapshot.paramMap.get('admissionId'));
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly userRolesService = inject(UserRolesService);

  ngOnInit(): void {
    const id = this.admissionId();
    if (!id) {
      this.router.navigate(['dashboard', 'programs', 'long']);
      return;
    }

    // this.loadAdmissionData(id);
    // რაღაც ზოგადი პრობლემა არის userRolesService, რის გამოც აგვიანებს ინიციალიზებას ყველაფერი.
    setTimeout(() => {
      this.loadAdmissionData(id);
    }, 500);
  }

  private loadAdmissionData(id: string): void {
    this.admissionService
      .admissionList({
        role: this.userRolesService.selectedAccount()?.organisation ? '' : this.userRolesService.selectedRole(),
        organisation: this.userRolesService.selectedAccount()?.organisation || '',
        number: id,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        const admission = response.data?.[0] ?? null;
        if (!admission) {
          this.router.navigate(['dashboard', 'programs', 'long']);
          return;
        }
        this.admissionData.set(admission);
      });
  }
}
