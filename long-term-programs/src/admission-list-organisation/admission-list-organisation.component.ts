import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  filterEmptyValues,
  FormatDatePipe,
  RouteParamsService,
  useFilters,
  useFiltersUpdater,
  vetIcons,
} from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { AdmissionFilterOrganisationComponent } from './admission-filter-organisation/admission-filter-organisation.component';
import { catchError, of } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

export type OrganisationAdmissionListFilter = {
  personal_number?: string | null;
  name?: string | null;
  surname?: string | null;
  organisation_name?: string | null;
  status?: string | null;
  ssm_status?: boolean | null;
};

@Component({
  selector: 'vet-admission-list-organisation',
  imports: [
    KENDO_GRID,
    TranslocoPipe,
    ButtonComponent,
    AdmissionFilterOrganisationComponent,
    FormatDatePipe,
    TooltipDirective,
  ],
  templateUrl: './admission-list-organisation.component.html',
  styleUrl: './admission-list-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionListOrganisationComponent {
  admissionList$ = rxResource({
    request: () => ({
      organisation: this._userRolesService.selectedAccount()?.organisation,
      filters: this.filters(),
    }),
    loader: ({ request: { organisation, filters } }) =>
      this.admissionService
        .admissionList(
          filterEmptyValues({
            organisation: organisation,
            role: '',
            ...filters,
          }),
        )
        .pipe(
          catchError((error) => {
            console.error('Failed to load admissions list for organisation:', error);
            return of({ data: [], meta: { total: 0, per_page: 10 } });
          }),
        ),
  });

  router = inject(Router);
  vetIcons = vetIcons;
  admissionService = inject(AdmissionService);
  routeParamsService = inject(RouteParamsService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  filters = useFilters<OrganisationAdmissionListFilter>();
  updateFilters = useFiltersUpdater<OrganisationAdmissionListFilter>();
  private readonly _userRolesService = inject(UserRolesService);

  onViewClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot navigate to admission without ID');
      return;
    }
    this.router.navigate(['long-term-programs', 'view-admission', item.id, 'general_information']);
  }

  onExamCardClick(item: AdmissionReq): void {
    if (!item.user?.pid) {
      console.error('Cannot navigate to exam card without user PID');
      return;
    }
    this.router.navigate(['long-term-programs', 'exam-card', item.user.pid]);
  }

  onChooseClick(item: AdmissionReq): void {
    if (!item.user?.pid) {
      console.error('Cannot navigate to exam card without user PID');
      return;
    }
    // this.router.navigate(['long-term-programs', 'exam-card', item.user.pid]);
  }

  onResultClick(item: AdmissionReq): void {
    if (!item.user?.pid) {
      console.error('Cannot navigate to exam card without user PID');
      return;
    }
    // this.router.navigate(['long-term-programs', 'exam-card', item.user.pid]);
  }

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  onFiltersChange(filters: OrganisationAdmissionListFilter) {
    this.updateFilters(filters);
  }
}
