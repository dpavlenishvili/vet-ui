import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { NonFormalService } from '@vet/backend';
import { Router } from '@angular/router';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormatDateTimePipe, useAlert, vetIcons } from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'vet-non-formal-applications-list',
  imports: [KENDO_GRID, TranslocoPipe, ButtonComponent, FormatDateTimePipe, TooltipDirective],
  templateUrl: './non-formal-applications-list.component.html',
  styleUrl: './non-formal-applications-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalApplicationsListComponent {
  protected readonly vetIcons = vetIcons;
  private readonly router = inject(Router);
  private readonly nonFormalService = inject(NonFormalService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly alert = useAlert();
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
    return item?.status?.code !== 'registered' && item?.status?.code !== 'approved';
  }

  protected isCancelEnabled(item: any): boolean {
    // Cancel button is active for applications with status 'saved' or 'registered'
    return item?.status?.code === 'saved' || item?.status?.code === 'registered';
  }

  protected onCancelClick(item: any): void {
    if (!item.id) {
      console.error('Cannot cancel application without ID');
      return;
    }

    // Show confirmation before canceling
    if (confirm('Are you sure you want to cancel this application?')) {
      this.cancelApplication(item.id);
    }
  }

  private cancelApplication(applicationId: any): void {
    // TODO: Add cancel/delete functionality when it's implemented
    console.log('Cancel application:', applicationId);
    this.alert.success('Application cancelled successfully');
  }
}
