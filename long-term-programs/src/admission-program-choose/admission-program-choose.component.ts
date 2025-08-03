import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { GridModule, RowArgs, SelectableSettings } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionPrograms, AdmissionService } from '@vet/backend';
import { InfoComponent, useConfirm } from '@vet/shared';
import { catchError, finalize, of } from 'rxjs';
import { SelectionEvent } from '@progress/kendo-angular-grid/selection/types';
import { LoaderComponent } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'vet-admission-program-choose',
  imports: [GridModule, TranslocoPipe, InfoComponent, LoaderComponent],
  templateUrl: './admission-program-choose.component.html',
  styleUrl: './admission-program-choose.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionProgramChooseComponent implements OnInit {
  private readonly admissionService = inject(AdmissionService);
  private readonly confirm = useConfirm();
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly admissionId = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly selectedProgramKeys = signal<number[]>([]);

  protected readonly selectableSettings: SelectableSettings = {
    enabled: true,
    mode: 'multiple',
    checkboxOnly: true,
  };

  protected readonly programsList$ = rxResource({
    request: () => ({ admissionId: this.admissionId() }),
    loader: ({ request: { admissionId } }) => {
      if (!admissionId) {
        return of({ data: [] });
      }

      return this.admissionService.admissionProgramList(admissionId).pipe(
        catchError((error) => {
          console.error('Failed to load programs list:', error);
          return of({ data: [] });
        }),
      );
    },
  });

  protected readonly selectionKey = (context: RowArgs): number => {
    const program = context.dataItem as AdmissionPrograms;
    return program.program?.id || 0;
  };

  private readonly initializeSelections = effect(() => {
    const programs = this.programsList$.value()?.data || [];
    if (programs.length > 0) {
      const selectedIds = programs
        .filter((program) => program.select === true)
        .map((program) => program.program?.id)
        .filter(Boolean) as number[];

      this.selectedProgramKeys.set(selectedIds);
    }
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['dashboard', 'programs', 'long']);
      return;
    }

    this.admissionId.set(id);
  }

  onSelectionChange(event: SelectionEvent): void {
    event.selectedRows?.forEach((row) => {
      const program = row.dataItem as AdmissionPrograms;
      const programId = program.program?.id;
      if (programId) {
        this.showConfirmation(programId, program, true);
      }
    });

    event.deselectedRows?.forEach((row) => {
      const program = row.dataItem as AdmissionPrograms;
      const programId = program.program?.id;
      if (programId) {
        this.showConfirmation(programId, program, false);
      }
    });
  }

  private showConfirmation(programId: number, program: AdmissionPrograms, isSelection: boolean): void {
    const title = isSelection ? 'programs.confirm_program_selection' : 'programs.confirm_program_unselection';
    const content = program.program?.program_name;

    this.confirm.show({
      title,
      content,
      onConfirm: () => this.executeSelectionChange(programId, isSelection),
      onDismiss: () => {
        this.selectedProgramKeys.set([...this.selectedProgramKeys()]);
      },
    });
  }

  private executeSelectionChange(programId: number, isSelection: boolean): void {
    const admissionId = this.admissionId();
    if (!admissionId) return;

    this.isLoading.set(true);

    this.admissionService
      .selectProgramAdmission(admissionId, programId)
      .pipe(
        catchError((error) => {
          console.error(`Error ${isSelection ? 'selecting' : 'deselecting'} program:`, error);
          return of({ status: false });
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((response) => {
        if (response.status !== false) {
          this.updateSelectedKeys(programId, isSelection);
          this.programsList$.reload();
        }
      });
  }

  private updateSelectedKeys(programId: number, isSelection: boolean): void {
    const currentSelected = this.selectedProgramKeys();

    if (isSelection) {
      if (!currentSelected.includes(programId)) {
        this.selectedProgramKeys.set([...currentSelected, programId]);
      }
    } else {
      this.selectedProgramKeys.set(currentSelected.filter((id) => id !== programId));
    }
  }
}
