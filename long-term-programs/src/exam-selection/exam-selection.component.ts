import {ExamSelectionFiltersComponent} from './exam-selection-filters/exam-selection-filters.component';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';
import {KENDO_BUTTON} from '@progress/kendo-angular-buttons';
import {GridDataResult, KENDO_GRID} from '@progress/kendo-angular-grid';
import {KENDO_CARD} from '@progress/kendo-angular-layout';
import {rxResource} from '@angular/core/rxjs-interop';
import {UserRolesService} from '@vet/auth';
import {Schedule, SchedulesService, Selection} from '@vet/backend';
import {DividerComponent, filterNullValues, RouteParamsService, vetIcons} from '@vet/shared';
import {KENDO_LABEL} from '@progress/kendo-angular-label';
import {ExamSelectionDialogComponent} from './exam-selection-dialog/exam-selection-dialog.component';
import {KENDO_SVGICON} from '@progress/kendo-angular-icons';
import {KENDO_TOOLTIP} from '@progress/kendo-angular-tooltip';

export type SchedulesFilters = {
  program?: string | null;
  pid?: string | null;
  organisation?: number | null;
  spec?: string | null;
  fullname?: string | null;
};

@Component({
  selector: 'vet-exam-selection',
  imports: [
    KENDO_CARD,
    KENDO_GRID,
    KENDO_BUTTON,
    KENDO_LABEL,
    KENDO_SVGICON,
    KENDO_TOOLTIP,
    TranslocoPipe,
    DividerComponent,
    DividerComponent,
    ExamSelectionDialogComponent,
    ExamSelectionFiltersComponent,
  ],
  templateUrl: './exam-selection.component.html',
  styleUrl: './exam-selection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSelectionComponent {
  userRolesService = inject(UserRolesService);
  schedulesService = inject(SchedulesService);
  routeParamsService = inject(RouteParamsService);

  vetIcons = vetIcons;
  isSchedulesDialogOpen = signal(false);
  selectionMethods: Selection[] = [];
  selectedExamId = '';
  dialogMode = signal<'dates' | 'results'>('dates');

  protected filters = signal<string | undefined>(undefined);

  schedules$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filter: this.filters(),
    }),
    loader: ({ request }) => {
      return this.schedulesService.schedules(request);
    },
  });

  readonly gridData = computed(() => {
    const val = this.schedules$.value();
    return { data: val?.data || [], total: val?.meta?.total || 0 } as GridDataResult;
  });

  openSchedulesDialog(item: Schedule, dialogMode: 'dates' | 'results') {
    this.selectionMethods = item.program?.admission?.selection ?? [];
    this.selectedExamId = String(item.id);
    this.dialogMode.set(dialogMode);
    this.isSchedulesDialogOpen.set(true);
  }

  onFiltersChange(filterValue: SchedulesFilters) {
    const filterString = JSON.stringify(filterNullValues(filterValue));
    this.filters.set(filterString);
  }

  reloadTableData() {
    this.schedules$.reload();
  }

  closeSchedulesDialog() {
    this.isSchedulesDialogOpen.set(false);
  }
}
