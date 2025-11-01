import { ChangeDetectionStrategy, Component, computed, inject, input, TemplateRef, viewChild } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { InfoComponent, trans, useRouteNumberParam, vetIcons } from '@vet/shared';
import { NonFormalService } from '@vet/backend';
import { AuthenticationService } from '@vet/auth';
import { NonFormalAnnouncementComponent } from './non-formal-announcement/non-formal-announcement.component';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { ProgramDetailItem, ProgramPageComponent, ProgramSectionItem } from '@vet/programs-common';
import { NonFormalGalleryComponent } from './non-formal-gallery/non-formal-gallery.component';

@Component({
  selector: 'vet-non-formal-program-page',
  standalone: true,
  imports: [
    TranslocoPipe,
    NonFormalAnnouncementComponent,
    InfoComponent,
    SVGIconComponent,
    ProgramPageComponent,
    NonFormalGalleryComponent,
  ],
  templateUrl: './non-formal-program-page.component.html',
  styleUrl: './non-formal-program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalProgramPageComponent {
  private readonly nonFormalsService = inject(NonFormalService);
  private readonly authService = inject(AuthenticationService);
  protected readonly vetIcons = vetIcons;
  protected readonly isNotAuthenticated = computed(() => !this.authService.user());

  programId = input<number>();
  showGallery = input<boolean>(true);
  showVideo = input<boolean>(true);
  routeProgramId = useRouteNumberParam('programId', 0);
  infoMessagesTemplate = viewChild<TemplateRef<unknown>>('infoMessages');
  programVideoTemplate = viewChild<TemplateRef<unknown>>('programVideo');
  consultationDocumentTemplate = viewChild<TemplateRef<unknown>>('consultationDocument');
  evidenceDocumentTemplate = viewChild<TemplateRef<unknown>>('evidenceDocument');

  program = rxResource({
    request: () => this.programId() ?? this.routeProgramId(),
    loader: ({ request: id }) => this.nonFormalsService.nonFormal(id).pipe(map((response) => response.data)),
  });

  details = computed<ProgramDetailItem[]>(() => {
    const program = this.program.value();

    if (!program) {
      return [];
    }

    return [
      { label: trans('non_formal.field'), value: program.isced },
      { label: trans('non_formal.isced_code'), value: program.isced_code },
      { label: trans('non_formal.recognition_result'), value: '' },
      { label: trans('non_formal.field_description'), value: program.note },
    ];
  });

  sections = computed<ProgramSectionItem[]>(() => {
    const program = this.program.value();
    const sections: ProgramSectionItem[] = [];

    if (this.hasAnnouncement() && program?.consultation?.document && this.consultationDocumentTemplate()) {
      sections.push({
        title: '',
        content: '',
        template: this.consultationDocumentTemplate(),
      });
    }

    if (this.hasAnnouncement() && program?.evidence?.document && this.evidenceDocumentTemplate()) {
      sections.push({
        title: '',
        content: '',
        template: this.evidenceDocumentTemplate(),
      });
    }

    if (this.hasAnnouncement() && this.infoMessagesTemplate()) {
      sections.push({
        title: '',
        content: '',
        template: this.infoMessagesTemplate(),
      });
    }

    if (this.showVideo() && program?.video_url) {
      sections.push({
        title: '',
        content: '',
        template: this.programVideoTemplate(),
      });
    }

    return sections;
  });

  hasAnnouncement = computed(() => {
    const prog = this.program.value();
    if (!prog) return false;
    return !!(prog.registration || prog.consultation || prog.evidence);
  });
}
