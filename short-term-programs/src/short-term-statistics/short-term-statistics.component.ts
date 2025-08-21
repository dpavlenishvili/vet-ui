import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useShortStats } from '../short-term.resources';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'vet-short-term-statistics',
  imports: [KENDO_GRID, TranslocoPipe, RouterLink],
  templateUrl: './short-term-statistics.component.html',
  styleUrl: './short-term-statistics.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermStatisticsComponent {
  stats = useShortStats();

  get registeredSum() {
    return this.stats.value().reduce((sum, item) => {
      return sum + (item.registered_count || 0);
    }, 0);
  }
}
