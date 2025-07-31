import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import { KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  filterEmptyValues,
  FormatDatePipe,
  IconButtonComponent,
  RouteParamsService,
  useFilters,
  useFiltersUpdater,
  vetIcons,
} from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { rxResource } from '@angular/core/rxjs-interop';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AdmissionFilterOrganisationComponent } from './admission-filter-organisation/admission-filter-organisation.component';
import { catchError, of } from 'rxjs';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { AdmissionListFilterParams } from '../long-term-programs.types';

@Component({
  selector: 'vet-admission-list-organisation',
  imports: [
    KENDO_GRID,
    TranslocoPipe,
    ButtonComponent,
    AdmissionFilterOrganisationComponent,
    FormatDatePipe,
    TooltipDirective,
    IconButtonComponent,
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
  filters = useFilters<AdmissionListFilterParams>();
  updateFilters = useFiltersUpdater<AdmissionListFilterParams>();
  private readonly _userRolesService = inject(UserRolesService);
  private readonly document = inject(DOCUMENT);

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
    this.router.navigate(['long-term-programs', 'last-choose', item.user.pid]);
  }

  onResultClick(item: AdmissionReq): void {
    if (!item.user?.pid) {
      console.error('Cannot navigate to exam card without user PID');
      return;
    }
    this.router.navigate(['long-term-programs', 'last-result', item.user.pid]);
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
