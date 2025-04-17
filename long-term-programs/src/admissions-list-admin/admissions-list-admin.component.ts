import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { filterEmptyValues, FormatDatePipe, RouteParamsService, vetIcons } from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { AdmissionsListAdminFiltersComponent } from './admissions-list-admin-filters/admissions-list-admin-filters.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';

export type AdmissionListFilter = {
  number?: unknown | null;
  date?: unknown | null;
  status?: unknown | null;
  organisation?: unknown | null;
  role?: unknown | null;
};

@Component({
  selector: 'vet-admissions-list-admin',
  imports: [KENDO_GRID, TranslocoPipe, ButtonComponent, AdmissionsListAdminFiltersComponent, FormatDatePipe],
  templateUrl: './admissions-list-admin.component.html',
  styleUrl: './admissions-list-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionsListAdminComponent {
  admissionList$ = rxResource({
    request: () => ({ role: this._userRolesService.selectedRole(), filters: this.filters() }),
    loader: ({ request: { role, filters } }) =>
      this.admissionService.admissionList(filterEmptyValues({
        role: role,
        ...filters,
      })),
  });

  router = inject(Router);
  vetIcons = vetIcons;
  admissionService = inject(AdmissionService);
  routeParamsService = inject(RouteParamsService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  protected readonly filters = signal<AdmissionListFilter | undefined>(undefined);
  private readonly _userRolesService = inject(UserRolesService);

  onRegisterClick() {
    this.router.navigate(['long-term-programs', 'register-admission', 'general_information']);
  }

  onViewClick(item: AdmissionReq) {
    this.router.navigate(['long-term-programs', 'update-admission', item.id, 'general_information']);
  }

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  onFiltersChange(filters: AdmissionListFilter) {
    this.routeParamsService.update(filters);
    this.filters.set(filterEmptyValues(filters));
  }
}
