import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { AdmissionService, NonFormalService } from '@vet/backend';
import { Router } from '@angular/router';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { useAlert, useConfirm } from '@vet/shared/dialogs';
import { FormatDateTimePipe } from '@vet/shared/pipes';
import { ButtonComponent as VetButtonComponent, IconButtonComponent } from '@vet/shared/ui-components';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { catchError, map, of, tap } from 'rxjs';

@Component({
  selector: 'vet-non-formal-applications-list',
  imports: [KENDO_GRID, TranslocoPipe, VetButtonComponent, FormatDateTimePipe, TooltipDirective, IconButtonComponent],
  templateUrl: './non-formal-applications-list.component.html',
  styleUrl: './non-formal-applications-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalApplicationsListComponent {
  private readonly router = inject(Router);
  private readonly nonFormalService = inject(NonFormalService);
  private readonly admissionService = inject(AdmissionService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly alert = useAlert();
  private readonly confirm = useConfirm();
  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly applicationsList$ = rxResource({
    loader: () => {
      return this.nonFormalService.nonFormalsApplications().pipe(
        catchError((error) => {
          console.error('Failed to load non-formal applications:', error);
          return of({ data: [], meta: { total: 0, per_page: 10 } });
        }),
      );
    },
  });

  protected readonly educations$ = rxResource({
    loader: () =>
      this.admissionService.educationStatus().pipe(
        map((educationStatuses) => {
          return educationStatuses ?? [];
        }),
      ),
  });

  protected getEducationName = computed(() => {
    const educations = this.educations$.value();
    return (educationId: number | string | null | undefined): string => {
      if (!educationId || !educations) {
        return '-';
      }
      const education = educations.find((edu) => Number(edu.levelId) === Number(educationId));
      return education?.level || '-';
    };
  });

  private showCancelConfirmation = signal(false);
  private cancelingApplicationId: any = null;

  protected onRegisterClick(): void {
    void this.router.navigate(['/programs/non-formal/register-application/field-selection']);
  }

  protected onEditClick(item: any): void {
    if (!item.id) {
      console.error('Cannot navigate to application without ID');
      return;
    }
    void this.router.navigate(['/programs/non-formal/update-application', item.id, 'field-selection']);
  }

  protected onViewClick(item: any): void {
    if (!item.id) {
      console.error('Cannot navigate to application without ID');
      return;
    }
    void this.router.navigate(['/programs/non-formal/view-application', item.id, 'field-selection']);
  }

  protected isEditEnabled(item: any): boolean {
    // Edit button is active during application submission period
    // This check can be expanded based on actual business logic from the backend
    return true;
  }

  protected onCancelClick(item: any): void {
    if (!item.id) {
      this.alert.show({
        variant: 'error',
        text: 'non_formal.cannot_cancel',
      });
      return;
    }

    this.confirm.show({
      content: item.status.id === '1' ? 'non_formal.sent_application_delete' : 'non_formal.draft_application_delete',
      onConfirm: () => {
        this.cancelApplication(item.id);
      },
    });
  }

  private cancelApplication(applicationId: number): void {
    this.nonFormalService
      .deleteNonFormalApplication(applicationId)
      .pipe(
        tap({
          next: () => {
            this.alert.success('non_formal.delete_success');
            this.applicationsList$.reload();
          },
        }),
      )
      .subscribe();
  }
}
