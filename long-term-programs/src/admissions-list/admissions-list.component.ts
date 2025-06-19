import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import { CellClickEvent, GridComponent, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { filterNullValues, FormatDateTimePipe, RouteParamsService, vetIcons } from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { AdmissionSelectedProgramsComponent } from '../admission-selected-programs/admission-selected-programs.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { catchError, of } from 'rxjs';

export type AdmissionListFilter = {
  search?: unknown | null;
  number?: unknown | null;
  date?: unknown | null;
  status?: unknown | null;
  organisation?: unknown | null;
  role?: unknown | null;
};

@Component({
  selector: 'vet-admissions-list',
  imports: [
    KENDO_GRID,
    TranslocoPipe,
    ButtonComponent,
    FormatDateTimePipe,
    AdmissionSelectedProgramsComponent,
    TooltipDirective,
  ],
  templateUrl: './admissions-list.component.html',
  styleUrl: './admissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionsListComponent {
  @ViewChild(GridComponent) grid!: GridComponent;

  private readonly router = inject(Router);
  private readonly admissionService = inject(AdmissionService);
  private readonly routeParamsService = inject(RouteParamsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly userRolesService = inject(UserRolesService);

  protected readonly vetIcons = vetIcons;
  protected readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly filters = signal<AdmissionListFilter | undefined>(undefined);

  // Expandable rows functionality
  protected expandedDetailKeys: number[] = [];

  protected readonly admissionList$ = rxResource({
    request: () => ({
      role: this.userRolesService.selectedRole(),
      filters: this.filters()
    }),
    loader: ({ request: { role, filters } }) => {
      const params = {
        role: role,
        ...filters,
      };

      return this.admissionService.admissionList(params).pipe(
        catchError((error) => {
          console.error('Failed to load admissions list:', error);
          return of({ data: [], meta: { total: 0, per_page: 10 } });
        })
      );
    },
  });

  protected expandDetailsBy = (dataItem: AdmissionReq): number => {
    return dataItem?.id || 0;
  };

  protected onRegisterClick(): void {
    this.router.navigate(['long-term-programs', 'register-admission', 'general_information']);
  }

  protected onViewClick(item: AdmissionReq): void {
    if (!item.id) {
      console.error('Cannot navigate to admission without ID');
      return;
    }
    this.router.navigate(['long-term-programs', 'update-admission', item.id, 'general_information']);
  }

  protected handlePageChange(event: PageChangeEvent): void {
    this.routeParamsService.update({
      page: event.skip / event.take + 1,
    });
  }

  protected onFiltersChange(filters: AdmissionListFilter): void {
    this.routeParamsService.update(filters);
    this.filters.set(filterNullValues(filters));
  }

  protected onCellClick(event: CellClickEvent): void {
    // Don't expand if clicking on action buttons column
    if (event.column && !event.column.field) {
      return;
    }

    // Toggle row expansion
    this.toggleRowExpansion(event.dataItem);
  }

  protected toggleRowExpansion(dataItem: AdmissionReq): void {
    if (!dataItem?.id || !this.grid) {
      return;
    }

    const expandKey = dataItem.id;
    const admissionData = this.admissionList$.value()?.data;

    if (!admissionData) {
      return;
    }

    const rowIndex = admissionData.findIndex((item) => item.id === dataItem.id);
    if (rowIndex === -1) {
      return;
    }

    const expandedIndex = this.expandedDetailKeys.findIndex((key) => key === expandKey);

    if (expandedIndex >= 0) {
      // Collapse row
      this.expandedDetailKeys.splice(expandedIndex, 1);
      this.grid.collapseRow(rowIndex);
    } else {
      // Expand row
      this.expandedDetailKeys.push(expandKey);
      this.grid.expandRow(rowIndex);
    }
  }
}
