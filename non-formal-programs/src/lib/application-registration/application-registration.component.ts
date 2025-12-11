import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NonFormalService } from '@vet/backend';
import { useAlert } from '@vet/shared/dialogs';
import {
  type ApplicationRequest,
  ApplicationWizardComponent,
  type NonFormalApplicationData,
  type StepBody,
} from '../application-wizard/application-wizard.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-application-registration',
  template: `
    @if (applicationData()) {
      <vet-application-wizard
        [applicationId]="applicationId()"
        [applicationData]="applicationData()"
        (updateApplication)="onUpdate($event)"
        (reloadApplicationData)="onReloadApplicationData()"
      />
    }
  `,
  imports: [ApplicationWizardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationRegistrationComponent implements OnInit {
  protected readonly applicationId = signal<string | null>(null);
  protected readonly applicationData = signal<NonFormalApplicationData | null>(null);
  private readonly nonFormalService = inject(NonFormalService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly alert = useAlert();

  ngOnInit(): void {
    // Initialize with empty data for new registration
    // After first step, we switch to update-application mode
    this.applicationData.set({});
  }

  protected onUpdate(event: StepBody<ApplicationRequest>): void {
    // Registration component only handles field-selection step
    // After creating application, it switches to update mode
    if (event.step === 'field-selection' || event.step === 'selected-fields') {
      this.handleFieldSelection(event.body.payload);
    }
  }

  protected onReloadApplicationData(): void {
    // Registration component doesn't handle reload
    // By the time documents are uploaded, we're in update mode
    // This method is here to satisfy the template binding
  }

  private handleFieldSelection(payload: ApplicationRequest): void {
    if (!payload.non_formal_id) {
      this.alert.error('non_formal.please_select_program');
      return;
    }

    // Create new application and switch to update mode
    // Pass application_id: null to indicate this is a new application (first time creation)
    this.nonFormalService
      .nonFormalsRegistrationCreate({
        non_formal_id: payload.non_formal_id,
        application_id: null, // FIRST TIME: explicitly pass null for new application
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const newId = res.data?.id;
          if (newId) {
            // Switch to update-application route with the new ID
            // This moves from registration mode to update mode
            this.router.navigate(['/programs/non-formal/update-application', newId, 'selected-fields']);
          }
        },
        error: () => {
          this.alert.error('non_formal.registration_creation_error');
        },
      });
  }
}
