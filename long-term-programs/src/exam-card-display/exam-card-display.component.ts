import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExamCardComponent } from '@vet/programs-common';
import { useRouteParam } from '@vet/shared';

@Component({
  selector: 'vet-exam-card-display',
  imports: [ExamCardComponent],
  templateUrl: './exam-card-display.component.html',
  styleUrl: './exam-card-display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCardDisplayComponent {
  protected selectedPid = useRouteParam('pid');
}
