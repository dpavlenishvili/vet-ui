import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { breakOnCommas, trans, useRouteNumberParam, vetIcons } from '@vet/shared';
import { ShortProgramsService } from '@vet/backend';
import { map } from 'rxjs';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProgramDetailItem, ProgramPageComponent, ProgramSectionItem } from '@vet/programs-common';
import { ShortProgramAdmissionsComponent } from './short-program-admissions/short-program-admissions.component';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import dayjs from 'dayjs';

@Component({
  selector: 'vet-short-program-page',
  imports: [ProgramPageComponent, ShortProgramAdmissionsComponent, SVGIconComponent, TranslocoPipe],
  templateUrl: './short-program-page.component.html',
  styleUrl: './short-program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramPageComponent {
  programId = input<number>();
  showGallery = input<boolean>(true);

  readonly programsService = inject(ShortProgramsService);
  readonly translocoService = inject(TranslocoService);

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  routeProgramId = useRouteNumberParam('programId', 0);

  program = rxResource({
    request: () => this.programId() ?? this.routeProgramId(),
    loader: ({ request: id }) => this.programsService.programShort(id).pipe(map((r) => r.data)),
  });

  details = computed<ProgramDetailItem[]>(() => {
    const program = this.program.value();

    if (!program) {
      return [];
    }

    const requirements = program.requirements || {};
    const parts: string[] = [];

    if (requirements.min_age != null) {
      parts.push(this.translocoService.translate('shorts.prerequisite_min_age', { age: requirements.min_age }));
    }

    if (requirements.min_allowed_education != null) {
      parts.push(
        this.translocoService.translate('shorts.prerequisite_min_allowed_education', {
          education: requirements.min_allowed_education,
        }),
      );
    }

    if (requirements.other_requirements?.trim()) {
      parts.push(
        this.translocoService.translate('shorts.prerequisite_other_requirements', {
          age: requirements.other_requirements,
        }),
      );
    }

    const admissionPrerequisite = parts.length > 0 ? breakOnCommas(parts.join(', '), 50) : '';

    return [
      { label: trans('shorts.field'), value: '' },
      { label: trans('shorts.program_code'), value: program.program_code },
      { label: trans('shorts.qualification_level'), value: program.education_level as unknown as string },
      { label: trans('shorts.program_kind'), value: program.program_kind?.name },
      {
        label: trans('shorts.program_duration'),
        value: trans('shorts.duration_weeks', {
          duration: program.program_duration,
        }),
      },
      { label: trans('shorts.admission_type'), value: '' },
      { label: trans('shorts.admission_prerequisite'), value: admissionPrerequisite },
      { label: trans('shorts.implementation_location'), value: program.address },
    ];
  });

  sections = computed<ProgramSectionItem[]>(() => {
    const program = this.program.value();

    if (!program) {
      return [];
    }

    return [
      { title: trans('shorts.program_description'), content: program.description },
      { title: trans('shorts.program_goal'), content: program.goal },
    ];
  });

  activeAdmissions = computed(() => {
    const program = this.program.value();

    if (!program?.admissions) {
      return [];
    }

    return program.admissions.filter((admission) => {
      const registrationStartDate = admission.registration_start_date
        ? dayjs(admission.registration_start_date).toDate().getTime()
        : null;
      const registrationEndDate = admission.registration_end_date
        ? dayjs(admission.registration_end_date).toDate().getTime()
        : null;

      if (registrationEndDate != null) {
        return registrationEndDate > Date.now();
      }

      return registrationStartDate != null && registrationStartDate > Date.now();
    });
  });
}
