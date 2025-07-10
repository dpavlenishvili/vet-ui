import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ProgramDetailItem, ProgramPageComponent, ProgramSectionItem } from '@vet/programs-common';
import { LongProgramAdmissionComponent } from './long-program-admission/long-program-admission.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { trans, useRouteNumberParam } from '@vet/shared';
import { ProgramsService } from '@vet/backend';
import { map } from 'rxjs';

@Component({
  selector: 'vet-unauthorised-program-page',
  imports: [ProgramPageComponent, LongProgramAdmissionComponent],
  templateUrl: './unauthorised-program-page.component.html',
  styleUrl: './unauthorised-program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorisedProgramPageComponent {
  programId = input<number>(0);
  routeProgramId = useRouteNumberParam('programId', 0);

  programsService = inject(ProgramsService);

  program = rxResource({
    request: () => this.programId() ?? this.routeProgramId(),
    loader: ({ request: id }) => this.programsService.program(id).pipe(map((r) => r.data)),
  });

  details = computed<ProgramDetailItem[]>(() => {
    const program = this.program.value();

    if (!program) {
      return [];
    }

    return [
      { label: trans('programs.field'), value: '' },
      { label: trans('programs.program_code'), value: program.program_code },
      { label: trans('programs.level'), value: program.education_level as unknown as string },
      { label: trans('programs.form'), value: program.program_kind?.name },
      {
        label: trans('programs.program_duration'),
        value: trans('programs.duration_weeks', {
          duration: program.program_duration,
        }),
      },
      { label: trans('programs.duration_non_citizen'), value: program.program_duration_non_geo },
      { label: trans('programs.admission_prerequisite'), value: program.qualification_name },
      { label: trans('programs.allowed_min_age'), value: program.admission?.min_allowed_age },
      { label: trans('shorts.implementation_location'), value: program.address },
    ];
  });

  sections = computed<ProgramSectionItem[]>(() => {
    const program = this.program.value();

    if (!program) {
      return [];
    }

    return [
      { title: trans('programs.program_description'), content: program.description },
    ];
  });
}
