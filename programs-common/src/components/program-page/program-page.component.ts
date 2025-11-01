import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProgramContactInfoComponent } from './program-contact-info/program-contact-info.component';
import { ProgramGalleryComponent } from './program-gallery/program-gallery.component';
import { ProgramHeaderComponent } from './program-header/program-header.component';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TransPipe, vetIcons } from '@vet/shared';
import { LongTerm, NonFormalShow, ShortProgramShow } from '@vet/backend';
import { ProgramSectionComponent } from './program-section/program-section.component';
import { ProgramIscedListComponent } from './program-isced-list/program-isced-list.component';
import { ProgramDetailItem, ProgramSectionItem, ProgramWithEmploysArea } from '../../programs.types';
import { NgTemplateOutlet } from '@angular/common';
import { LoaderComponent } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'vet-program-page',
  imports: [
    ProgramContactInfoComponent,
    ProgramGalleryComponent,
    ProgramHeaderComponent,
    ProgramIscedListComponent,
    ProgramSectionComponent,
    TransPipe,
    NgTemplateOutlet,
    LoaderComponent,
  ],
  templateUrl: './program-page.component.html',
  styleUrl: './program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramPageComponent {
  programId = input<number>();
  showGallery = input<boolean>(true);
  showPartners = input<boolean>(true);
  showIscedList = input<boolean>(true);
  program = input.required<ShortProgramShow | LongTerm | NonFormalShow | undefined>();
  isLoading = input<boolean>();
  details = input<ProgramDetailItem[]>([]);
  sections = input<ProgramSectionItem[]>([]);

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  iscedDescription = computed(() => {
    const prog = this.program();
    if (!prog) return undefined;

    // NonFormalShow doesn't have employs_area or isced_description
    if ('isced' in prog) {
      return undefined;
    }

    // ShortProgramShow and LongTerm have employs_area and isced_description
    const typedProg = prog as ProgramWithEmploysArea;

    return typedProg.employs_area;
  });
}
