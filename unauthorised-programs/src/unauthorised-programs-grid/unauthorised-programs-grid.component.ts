import { ProgramCardComponent } from '@vet/programs-common';
import { ChangeDetectionStrategy, Component, input, output, ResourceRef } from '@angular/core';
import { LongTerm } from '@vet/backend';
import { PaginatedGridResult } from '@vet/shared';
import { PagerComponent } from '@progress/kendo-angular-pager';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'vet-unauthorised-programs-grid',
  imports: [ProgramCardComponent, PagerComponent],
  templateUrl: './unauthorised-programs-grid.component.html',
  styleUrl: './unauthorised-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorisedProgramsGridComponent {
  data = input.required<ResourceRef<PaginatedGridResult<LongTerm>>>();
  pageChange = output<number>();

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event.skip / event.take + 1);
  }
}
