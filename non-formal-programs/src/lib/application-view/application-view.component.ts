import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NonFormalService } from '@vet/backend';
import { useAlert } from '@vet/shared/dialogs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ApplicationWizardComponent,
  type NonFormalApplicationData,
} from '../application-wizard/application-wizard.component';

@Component({
  selector: 'vet-application-view',
  standalone: true,
  template: `
    @if (applicationData()) {
      <vet-application-wizard
        [applicationId]="applicationId()"
        [applicationData]="applicationData()"
        [isViewMode]="true"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ApplicationWizardComponent],
})
export class ApplicationViewComponent implements OnInit {
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
