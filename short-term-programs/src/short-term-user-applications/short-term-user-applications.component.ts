import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { useShortTermUserApplications } from '../short-term.resources';
import { ButtonComponent, FormatDatePipe, IconButtonComponent, useAlert, useConfirm } from '@vet/shared';
import { ProgramsService, ShortProgramApplication } from '@vet/backend';
import { useProgramDialog } from '../short-term-programs.signals';
import { tap } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'vet-short-term-user-applications',
  imports: [KENDO_GRID, TranslocoPipe, FormatDatePipe, IconButtonComponent, ButtonComponent, RouterLink, TooltipDirective],
  templateUrl: './short-term-user-applications.component.html',
  styleUrl: './short-term-user-applications.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermUserApplicationsComponent {
  applications = useShortTermUserApplications();
  programsService = inject(ProgramsService);
  programDialog = useProgramDialog();
  confirm = useConfirm();
  alert = useAlert();

  onPreviewProgram(application: ShortProgramApplication) {
    const programId = application.programAdmission?.program?.id;

    if (programId != null) {
      this.programDialog.show({ programId });
    }
  }

  onDeleteProgram(application: ShortProgramApplication) {
    if (!application.can_delete) {
      return;
    }

    this.confirm.show({
      content: 'shorts.confirm_delete_application',
      variant: 'warning',
      onConfirm: () => {
        this.programsService
          .deleteShortProgramApplication(application.id as number)
          .pipe(
            tap({
              next: () => {
                this.alert.success('shorts.application_deleted_successfully')
                this.applications.reload();
              },
              error: () => {
                this.alert.error('shorts.application_deletion_failed');
              },
            }),
          )
          .subscribe();
      },
    });
  }
}
