import {ChangeDetectionStrategy, Component, computed, inject, input} from '@angular/core';
import {KENDO_ICONS} from '@progress/kendo-angular-icons';
import {vetCoerceNumberProperty, vetIcons} from '@vet/shared';
import {LongTerm, ProgramsService} from '@vet/backend';
import {map, of} from 'rxjs';
import {TranslocoPipe} from '@jsverse/transloco';
import * as kendoIcons from '@progress/kendo-svg-icons';
import {rxResource} from "@angular/core/rxjs-interop";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Organisation {
  name?: string;
}

@Component({
  selector: 'vet-program',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './program.component.html',
  styleUrl: './program.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramComponent {
  readonly eligibleProgram = input<LongTerm | null>();
  readonly programId = input(null, {transform: vetCoerceNumberProperty});

  private sanitizer = inject(DomSanitizer);

  protected programsService = inject(ProgramsService);

  kendoIcons = kendoIcons;

  vetIcons = vetIcons;
  admission = true;

  protected readonly program$ = rxResource({
    request: () => ({programId: this.programId()}),
    loader: ({request: {programId}}) => {
      if (programId) {
        return this.programsService.program(programId).pipe(map((response) => response.data));
      }
      return of(undefined);
    },
  });

  protected loading = computed(() => {
    const programId = this.programId();
    const programLoading = this.program$.isLoading();
    if (!programId) {
      return true;
    }
    return programLoading;
  });

  protected program = computed((): LongTerm | null => {
    const program = this.program$.value();
    const eligibleProgram = this.eligibleProgram();
    const programId = this.programId();
    if (programId) {
      return program || null;
    }
    return eligibleProgram || null;
  });

  getOrganisation(program: LongTerm | null): Organisation {
    return program?.organisation as Organisation;
  }

  getVideoUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
