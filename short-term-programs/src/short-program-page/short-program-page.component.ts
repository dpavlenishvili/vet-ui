import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { useRouteNumberParam, vetIcons } from '@vet/shared';
import { ProgramsService } from '@vet/backend';
import { map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { rxResource } from '@angular/core/rxjs-interop';
import { ShortProgramContactInfoComponent } from './short-program-contact-info/short-program-contact-info.component';
import { ShortProgramISCEDListComponent } from './short-program-isced-list/short-program-isced-list.component';
import { ShortProgramSectionComponent } from './short-program-section/short-program-section.component';
import { ShortProgramGalleryComponent } from './short-program-gallery/short-program-gallery.component';
import { ShortProgramHeaderComponent } from './short-program-header/short-program-header.component';

@Component({
  selector: 'vet-short-program-page',
  imports: [
    TranslocoPipe,
    ShortProgramContactInfoComponent,
    ShortProgramISCEDListComponent,
    ShortProgramSectionComponent,
    ShortProgramGalleryComponent,
    ShortProgramHeaderComponent,
  ],
  templateUrl: './short-program-page.component.html',
  styleUrl: './short-program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramPageComponent {
  programId = input<number>();

  readonly programsService = inject(ProgramsService);

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  routeProgramId = useRouteNumberParam('programId', 0);

  program$ = rxResource({
    request: () => this.programId() ?? this.routeProgramId(),
    loader: ({ request: id }) => this.programsService.programShort(id).pipe(map((r) => r.data)),
  });
}
