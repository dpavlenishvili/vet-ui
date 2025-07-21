import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { UserRolesService } from '@vet/auth';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { filterEmptyValues, FormatDatePipe, RouteParamsService, vetIcons, IconButtonComponent } from '@vet/shared';
import { AdmissionFilterOrganisationComponent } from './admission-filter-organisation/admission-filter-organisation.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { catchError, of } from 'rxjs';

export type OrganisationAdmissionListFilter = {
  personal_number?: unknown | null;
  name?: unknown | null;
  surname?: unknown | null;
  institution?: unknown | null;
  status?: unknown | null;
  ssm_status?: unknown | null;
};

@Component({
  selector: 'vet-admission-list-organisation',
  imports: [KENDO_GRID, TranslocoPipe, AdmissionFilterOrganisationComponent, FormatDatePipe, IconButtonComponent],
  templateUrl: './admission-list-organisation.component.html',
  styleUrl: './admission-list-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionListOrganisationComponent {
  protected readonly vetIcons = vetIcons;
  protected readonly filters = signal<OrganisationAdmissionListFilter | undefined>(undefined);
  private readonly admissionService = inject(AdmissionService);
  private readonly routeParamsService = inject(RouteParamsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userRolesService = inject(UserRolesService);
  protected readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly admissionList$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filters: this.filters(),
    }),
    loader: ({ request: { organisation, filters } }) => {
      if (!organisation) {
        return of({ data: [], meta: { total: 0, per_page: 10 } });
      }

      const params = filterEmptyValues({
        organisation: organisation,
        role: 'Organisation',
        ...filters,
      });

      console.log(params);
      return this.admissionService.admissionList(params).pipe(
        catchError((error) => {
          console.error('Failed to load organisation admission list:', error);
          return of({ data: [], meta: { total: 0, per_page: 10 } });
        }),
      );
    },
  });

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  onFiltersChange(filters: OrganisationAdmissionListFilter) {
    this.routeParamsService.update(filters);
    this.filters.set(filterEmptyValues(filters));
  }

  // Action handlers
  onViewClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot navigate to admission without ID');
      return;
    }
    // Navigate to view page - read-only for organisation users
    console.log('View admission:', item.id);
  }

  onDocumentClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot access documents without admission ID');
      return;
    }
    // Open documents view/download
    console.log('View documents for admission:', item.id);
  }

  onEmailClick(item: AdmissionReq): void {
    if (!item.user?.email) {
      console.error('Cannot send email - no email address');
      return;
    }
    // Open email client or modal
    console.log('Send email to:', item.user.email);
  }
}
