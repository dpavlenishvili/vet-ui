import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProgramContactInfoComponent } from './program-contact-info/program-contact-info.component';
import { ProgramGalleryComponent } from './program-gallery/program-gallery.component';
import { ProgramHeaderComponent } from './program-header/program-header.component';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TransPipe, vetIcons } from '@vet/shared';
import { LongTerm, ShortProgramShow } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProgramSectionComponent } from './program-section/program-section.component';
import { ProgramIscedListComponent } from './program-isced-list/program-isced-list.component';
import { ProgramDetailItem, ProgramSectionItem } from '../../programs.types';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'vet-program-page',
  imports: [
    ProgramContactInfoComponent,
    ProgramGalleryComponent,
    ProgramHeaderComponent,
    ProgramIscedListComponent,
    ProgramSectionComponent,
    TranslocoPipe,
    TransPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './program-page.component.html',
  styleUrl: './program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramPageComponent {
  programId = input<number>();
  showGallery = input<boolean>(true);
  program = input.required<ShortProgramShow | LongTerm | undefined>();
  isLoading = input<boolean>();
  details = input<ProgramDetailItem[]>([]);
  sections = input<ProgramSectionItem[]>([]);

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
}
