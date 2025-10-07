import { ChangeDetectionStrategy, Component, input, output, ResourceRef } from '@angular/core';
import { NonFormal } from '@vet/backend';
import { PaginatedGridResult } from '@vet/shared';
import { PagerComponent } from '@progress/kendo-angular-pager';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { NonFormalProgramCardComponent } from './non-formal-program-card/non-formal-program-card.component';

@Component({
  selector: 'vet-non-formal-programs-grid',
  imports: [NonFormalProgramCardComponent, PagerComponent],
  templateUrl: './non-formal-programs-grid.component.html',
  styleUrl: './non-formal-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalProgramsGridComponent {
  data = input.required<ResourceRef<PaginatedGridResult<NonFormal>>>();
  pageChange = output<number>();

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event.skip / event.take + 1);
  }
}
