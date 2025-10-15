import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NonFormalService } from '@vet/backend';
import { useAlert } from '@vet/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  type ApplicationRequest,
  ApplicationWizardComponent,
  type NonFormalApplicationData,
  type StepBody,
} from '../application-wizard/application-wizard.component';

@Component({
  selector: 'vet-application-update',
  standalone: true,
  template: `
    @if (applicationData()) {
      <vet-application-wizard
        [applicationId]="applicationId()"
        [applicationData]="applicationData()"
        (updateApplication)="onUpdate($event)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationWizardComponent],
})
export class ApplicationUpdateComponent implements OnInit {
  protected readonly applicationData = signal<NonFormalApplicationData | null>(null);
  private readonly nonFormalService = inject(NonFormalService);
  private readonly route = inject(ActivatedRoute);
  protected readonly applicationId = signal(this.route.snapshot.paramMap.get('applicationId'));
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alert = useAlert();

  ngOnInit(): void {
    const id = this.applicationId();
    if (!id) {
      this.router.navigate(['dashboard', 'programs', 'non-formal']);
      return;
    }

    this.loadApplicationData(id);
  }

  protected onUpdate(event: StepBody<ApplicationRequest>): void {
    const applicationId = this.applicationId();
    if (!applicationId) {
      return;
    }

    const numericId = parseInt(applicationId, 10);

    // Handle different step updates
    switch (event.step) {
      case 'field-selection':
      case 'selected-fields':
        this.handleFieldSelectionUpdate(event.body.payload, applicationId);
        break;

      case 'questionnaire':
        this.nonFormalService
          .nonFormalsSurvey(numericId, event.body.payload as any)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              void this.router.navigate([`/programs/non-formal/update-application/${applicationId}/documents`]);
            },
            error: () => {
              this.alert.error('non_formal.survey_save_error');
            },
          });
        break;

      case 'documents':
        this.nonFormalService
          .nonFormalsRegistrationDocuments(numericId, event.body.payload as any)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              void this.router.navigate([`/programs/non-formal/update-application/${applicationId}/confirmation`]);
            },
            error: () => {
              this.alert.error('non_formal.documents_upload_error');
            },
          });
        break;

      case 'confirmation':
        this.nonFormalService
          .nonFormalsSubmit(numericId)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.alert.success('non_formal.application_submitted_successfully');
              this.router.navigate(['dashboard', 'programs', 'non-formal']);
            },
            error: () => {
              this.alert.error('non_formal.application_submit_error');
            },
          });
        break;
    }
  }

  private handleFieldSelectionUpdate(payload: ApplicationRequest, applicationId: string): void {
    const currentData = this.applicationData();
    const originalNonFormalId = currentData?.non_formal_id;
    const newNonFormalId = payload.non_formal_id;

    // Check if the selected program has changed
    if (newNonFormalId && originalNonFormalId !== newNonFormalId) {
      // Program changed - create new application with the new program
      // Note: This creates a NEW application (old one is abandoned)
      this.nonFormalService
        .nonFormalsRegistrationCreate({ non_formal_id: newNonFormalId })
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res) => {
            const newId = res.data?.id;
            if (newId) {
              // Update application ID for subsequent API calls
              this.applicationId.set(String(newId));

              // Load the newly created application data
              // This updates applicationData signal, but does NOT trigger onUpdate again
              // onUpdate only fires on explicit user button clicks (Next/Submit)
              this.loadApplicationData(String(newId));

              // Navigate to selected-fields step with new application ID
              // Navigation happens after data load to ensure wizard shows correct data
              void this.router.navigate([`/programs/non-formal/update-application/${newId}/selected-fields`]);
            }
          },
          error: () => {
            this.alert.error('non_formal.program_update_error');
          },
        });
    } else {
      // Program not changed - just navigate to next step
      void this.router.navigate([`/programs/non-formal/update-application/${applicationId}/selected-fields`]);
    }
  }

  private loadApplicationData(id: string): void {
    const numericId = parseInt(id, 10);

    this.nonFormalService
      .nonFormalsApplicationsShow(numericId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          if (!response) {
            this.router.navigate(['dashboard', 'programs', 'non-formal']);
            return;
          }
          this.applicationData.set(response.data as NonFormalApplicationData);
        },
        error: () => {
          this.alert.error('non_formal.failed_to_load_registration');
          this.router.navigate(['dashboard', 'programs', 'non-formal']);
        },
      });
  }
}
