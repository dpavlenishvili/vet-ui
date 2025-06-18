import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { AdmissionReq, AdmissionService } from '@vet/backend';
import { Router } from '@angular/router';
import { UserRolesService } from '@vet/auth';
import { CellClickEvent, GridComponent, KENDO_GRID, PageChangeEvent } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { filterNullValues, FormatDateTimePipe, RouteParamsService, vetIcons } from '@vet/shared';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { AdmissionsListFilterComponent } from './admissions-list-filter/admissions-list-filter.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { isPlatformBrowser } from '@angular/common';
import { AdmissionSelectedProgramsComponent } from '../admission-selected-programs/admission-selected-programs.component';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

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
  admissionList$ = rxResource({
    request: () => ({ role: this._userRolesService.selectedRole(), filters: this.filters() }),
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
  @ViewChild(GridComponent) grid!: GridComponent;

  // Expandable rows functionality
  public expandedDetailKeys: number[] = [];

  public expandDetailsBy = (dataItem: AdmissionReq): any => {
    return dataItem ? dataItem.id : 80;
  };

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
    this.filters.set(filterNullValues(filters));
  }

  // Handle row click for expand/collapse
  onRowClick(event: any) {
    console.log(event);
  }


  onCellClick(event: CellClickEvent) {
    console.log(event);

    // Don't expand if clicking on action buttons column
    if (event.column && !event.column.field) {
      return;
    }

    // Use the existing toggleRowExpansion method
    this.toggleRowExpansion(event.dataItem);
    console.log(this.expandedDetailKeys);
  }

  toggleRowExpansion(dataItem: AdmissionReq) {
    // Check if using ID-based expansion or data item-based expansion
    // Adjust based on your expandDetailsBy function
    const expandKey = dataItem.id; // or just dataItem if expandDetailsBy expects the full object

    const index = this.expandedDetailKeys.findIndex(key =>
      typeof key === 'object' ? key === dataItem.id : key === dataItem.id
    );



    if (index >= 0) {
      this.expandedDetailKeys.splice(index, 1);
      this.grid.collapseRow(0);
    } else {
      this.grid.expandRow(0);
      this.expandedDetailKeys.push(expandKey as number);
    }
  }
}
