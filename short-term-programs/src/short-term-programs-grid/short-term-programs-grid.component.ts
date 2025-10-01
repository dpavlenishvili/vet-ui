import { ChangeDetectionStrategy, Component, input, output, ResourceRef } from '@angular/core';
import { PaginatedGridResult, vetIcons } from '@vet/shared';
import { ShortProgram } from '@vet/backend';
import { PagerComponent } from '@progress/kendo-angular-pager';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { ProgramCardComponent } from '@vet/programs-common';

@Component({
  selector: 'vet-short-term-programs-grid',
  imports: [ProgramCardComponent, PagerComponent],
  templateUrl: './short-term-programs-grid.component.html',
  styleUrl: './short-term-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsGridComponent {
  data = input.required<ResourceRef<PaginatedGridResult<ShortProgram>>>();
  pageChange = output<number>();

  vetIcons = vetIcons;

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event.skip / event.take + 1);
  } 
}
