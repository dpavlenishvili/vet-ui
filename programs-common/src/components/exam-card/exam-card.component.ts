import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '@vet/backend';
import { vetIcons } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { rxResource } from '@angular/core/rxjs-interop';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { DatePipe } from '@angular/common';
import { of } from 'rxjs';

@Component({
  selector: 'vet-exam-card',
  imports: [TranslocoPipe, KENDO_SVGICON, KENDO_GRID, DatePipe],
  templateUrl: './exam-card.component.html',
  styleUrl: './exam-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCardComponent {
  pid = input<any>();

  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);

  vetIcons = vetIcons;

  examCard$ = rxResource({
    request: () => {
      const pidFromInput = this.pid();
      const pidFromRoute = this.route.snapshot.paramMap.get('pid');
      const finalPid = pidFromInput || pidFromRoute;

      return finalPid ? { pid: finalPid } : null;
    },
    loader: ({ request }) => {
      if (!request) {
        return of(null);
      }
      return this.cardService.examCard({ pid: request.pid });
    },
  });
}
