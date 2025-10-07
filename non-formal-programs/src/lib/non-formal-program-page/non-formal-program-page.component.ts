import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { FormatDatePipe, InfoComponent, useRouteNumberParam, vetIcons } from '@vet/shared';
import { NonFormalService } from '@vet/backend';
import { NonFormalHeaderComponent } from './non-formal-header/non-formal-header.component';
import { NonFormalAnnouncementComponent } from './non-formal-announcement/non-formal-announcement.component';
import { NonFormalContactComponent } from './non-formal-contact/non-formal-contact.component';
import { NonFormalGalleryComponent } from './non-formal-gallery/non-formal-gallery.component';
import { SVGIconComponent } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-non-formal-program-page',
  standalone: true,
  imports: [
    TranslocoPipe,
    LoaderComponent,
    NonFormalHeaderComponent,
    NonFormalAnnouncementComponent,
    NonFormalContactComponent,
    NonFormalGalleryComponent,
    InfoComponent,
    SVGIconComponent,
  ],
  templateUrl: './non-formal-program-page.component.html',
  styleUrl: './non-formal-program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalProgramPageComponent {
  private readonly nonFormalsService = inject(NonFormalService);
  protected readonly vetIcons = vetIcons;
  programId = input<number>();
  routeProgramId = useRouteNumberParam('programId', 0);

  program = rxResource({
    request: () => this.programId() ?? this.routeProgramId(),
    loader: ({ request: id }) => this.nonFormalsService.nonFormal(id).pipe(map((response) => response.data)),
  });

  hasAnnouncement = computed(() => {
    const prog = this.program.value();
    if (!prog) return false;
    return !!(prog.registration || prog.consultation || prog.evidence);
  });

  dsada(dsada: any) {
    console.log(dsada);
  }
}
