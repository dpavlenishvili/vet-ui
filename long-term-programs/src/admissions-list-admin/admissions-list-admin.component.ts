import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { RolePipe, UserRolesService } from '@vet/auth';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  filterEmptyValues,
  useFilters,
  useFiltersUpdater,
} from '@vet/shared/utils';
import { vetIcons } from '@vet/shared/icons';
import { FormatDatePipe } from '@vet/shared/pipes';
import { RouteParamsService } from '@vet/shared/services';
import { IconButtonComponent } from '@vet/shared/ui-components';
import { AdmissionsListAdminFiltersComponent } from './admissions-list-admin-filters/admissions-list-admin-filters.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AdmissionListFilterParams } from '../long-term-programs.types';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'vet-admissions-list-admin',
  imports: [
    KENDO_GRID,
    TranslocoPipe,
    AdmissionsListAdminFiltersComponent,
    FormatDatePipe,
    IconButtonComponent,
    TooltipDirective,
    RolePipe,
  ],
  templateUrl: './admissions-list-admin.component.html',
  styleUrl: './admissions-list-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionsListAdminComponent {
  admissionList$ = rxResource({
    request: () => ({ role: this._userRolesService.selectedRole(), filters: this.filters() }),
    loader: ({ request: { role, filters } }) =>
      this.admissionService.admissionList(
        filterEmptyValues({
          role: role,
          ...filters,
        }),
      ),
  });

  router = inject(Router);
  vetIcons = vetIcons;
  admissionService = inject(AdmissionService);
  routeParamsService = inject(RouteParamsService);
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  filters = useFilters<AdmissionListFilterParams>();
  updateFilters = useFiltersUpdater<AdmissionListFilterParams>();
  private readonly _userRolesService = inject(UserRolesService);
  private readonly document = inject(DOCUMENT);

  onViewClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot navigate to admission without ID');
      return;
    }
    this.router.navigate(['programs/long', 'view-admission', item.id, 'general_information']);
  }

  onExamCardClick(item: AdmissionReq): void {
    if (!item.user?.pid) {
      console.error('Cannot navigate to exam card without user PID');
      return;
    }
    this.router.navigate(['programs/long', 'exam-card', item.user.pid]);
  }

  onChooseClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot navigate to choose without admission ID');
      return;
    }

    this.router.navigate(['programs/long', 'last-choose', item.id]);
  }

  onResultClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot navigate to result without admission ID');
      return;
    }

    this.router.navigate(['programs/long', 'last-result', item.id]);
  }

  handlePageChange(event: PageChangeEvent) {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  onFiltersChange(filters: AdmissionListFilterParams) {
    this.updateFilters(filters);
  }

  downloadDocument(doc: any): void {
    if (!doc || !doc.download_url) {
      console.error('Document or download URL not available', doc);
      return;
    }

    this.document.defaultView?.open(doc.download_url, '_blank');
  }
}
