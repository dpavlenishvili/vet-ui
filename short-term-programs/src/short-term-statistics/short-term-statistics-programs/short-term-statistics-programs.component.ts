import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { FormatDateStringPipe } from '@vet/shared';
import { useShortStatsAddmission } from 'short-term-programs/src/short-term.resources';

@Component({
  selector: 'vet-short-term-statistics-programs',
  imports: [KENDO_GRID, TranslocoPipe, FormatDateStringPipe],
  templateUrl: './short-term-statistics-programs.component.html',
  styleUrl: './short-term-statistics-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermStatisticsProgramsComponent {
  private route = inject(ActivatedRoute);

  programId = this.route.snapshot.paramMap.get('programId');

  stats = useShortStatsAddmission(String(this.programId));
}
