import { ExamSelectionFiltersComponent } from './exam-selection-filters/exam-selection-filters.component';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { GridDataResult, KENDO_GRID } from '@progress/kendo-angular-grid';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserRolesService } from '@vet/auth';
import { Schedule, SchedulesService, Selection } from '@vet/backend';
import {
  DividerComponent,
  RouteParamsService,
  useAlert,
  useConfirm,
  useFilters,
  useFiltersUpdater,
  vetIcons,
} from '@vet/shared';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { ExamSelectionDialogComponent } from './exam-selection-dialog/exam-selection-dialog.component';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { tap } from 'rxjs';

export type SchedulesFilters = {
  program?: string | null;
  pid?: string | null;
  organisation?: number | null;
  spec?: string | null;
  fullname?: string | null;
  status?: string | null;
};

export type ScheduleItem = {
  ocu_doc?: string[];
  abroad_doc?: string[];
  complete_base_edu_abroad?: boolean;
  complete_edu_abroad?: boolean;
  spec_edu?: boolean;
};

@Component({
  selector: 'vet-exam-selection',
  imports: [
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
  translocoService = inject(TranslocoService);

  vetIcons = vetIcons;
  isSchedulesDialogOpen = signal(false);
  selectionMethods: Selection[] = [];
  selectedExamId = '';
  dialogMode = signal<'dates' | 'results'>('dates');

  filters = useFilters<SchedulesFilters>();
  updateFilters = useFiltersUpdater<SchedulesFilters>();

  private alert = useAlert();
  private confirm = useConfirm();

  schedules$ = rxResource({
    request: () => ({
      organisation: this.userRolesService.getOrganisation(),
      filter: this.filters(),
    }),
    loader: ({ request: { organisation, filter } }) => {
      return this.schedulesService.schedules({ organisation, filter: JSON.stringify(filter) });
    },
  });

  readonly gridData = computed(() => {
    const val = this.schedules$.value();
    return { data: val?.data || [], total: val?.meta?.total || 0 } as GridDataResult;
  });

  hasSpecialStatus(item: ScheduleItem): boolean {
    return (
      !!item?.ocu_doc?.length ||
      !!item?.abroad_doc?.length ||
      !!item?.complete_base_edu_abroad ||
      !!item?.complete_edu_abroad
    );
  }

  getSpecialStatusTooltip(item: ScheduleItem): string {
    const lines = [];
    if (item?.ocu_doc?.length) {
      lines.push(this.translocoService.translate('programs.status_occupied_teritory_institution'));
    }
    if (item?.abroad_doc?.length) {
      lines.push(this.translocoService.translate('programs.status_foreign_citizen'));
    }
    if (item?.complete_base_edu_abroad) {
      lines.push(this.translocoService.translate('programs.status_foreign_institution'));
    }
    if (item?.complete_edu_abroad) {
      lines.push(this.translocoService.translate('programs.status_foreign_institution'));
    }
    return lines.join('\n');
  }

  openSchedulesDialog(item: Schedule, dialogMode: 'dates' | 'results') {
    this.selectionMethods = item.program?.admission?.selection ?? [];
    this.selectedExamId = String(item.id);
    this.dialogMode.set(dialogMode);
    this.isSchedulesDialogOpen.set(true);
  }

  onAcceptanceChange(item: Schedule, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const scheduleId = String(item.id);

    const proceed = () => {
      this.schedulesService
        .schedulesGrant(scheduleId, checked)
        .pipe(
          tap({
            next: () => {
              this.alert.show({
                text: 'shared.operation_success',
                variant: 'success',
              });
              this.reloadTableData();
            },
            error: () => {
              this.alert.show({
                text: 'shared.operation_fail',
                variant: 'error',
              });
            },
          }),
        )
        .subscribe();
    };

    if (!checked) {
      this.confirm.show({
        content: 'shared.confirm_action',
        onConfirm: proceed,
      });
    } else {
      proceed();
    }
  }

  onFiltersChange(filters: SchedulesFilters) {
    this.updateFilters(filters);
  }

  reloadTableData() {
    this.schedules$.reload();
  }

  closeSchedulesDialog() {
    this.isSchedulesDialogOpen.set(false);
  }
}
