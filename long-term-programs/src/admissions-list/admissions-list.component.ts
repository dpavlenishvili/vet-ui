import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { filterNullValues, RouteParamsService, vetIcons } from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { AdmissionsListFilterComponent } from './admissions-list-filter/admissions-list-filter.component';
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
  selector: 'vet-admissions-list',
  imports: [KENDO_GRID, TranslocoPipe, ButtonComponent, AdmissionsListFilterComponent],
  templateUrl: './admissions-list.component.html',
  styleUrl: './admissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionsListComponent {
  admissionList$ = rxResource({
    request: () => ({ role: this._userRolesService.userRole(), filters: this.filters() }),
    loader: ({ request: { role, filters } }) =>
      this.admissionService.admissionList({
        role: role,
        ...filters,
      }),
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
    this.router.navigate(['long-term-programs', 'register-admission']);
  }

  onViewClick(item: AdmissionReq) {
    this.router.navigate(['long-term-programs', 'update-admission', item.id]);
  }

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  onFiltersChange(filters: AdmissionListFilter) {
    this.routeParamsService.update(filters);
    this.filters.set(filterNullValues(filters));
  }
}
