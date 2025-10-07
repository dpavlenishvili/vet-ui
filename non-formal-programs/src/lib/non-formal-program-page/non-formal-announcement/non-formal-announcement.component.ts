import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormatDatePipe, vetIcons } from '@vet/shared';
import { NonFormalShow } from '@vet/backend';

@Component({
  selector: 'vet-non-formal-announcement',
  standalone: true,
  imports: [TranslocoPipe, FormatDatePipe],
  templateUrl: './non-formal-announcement.component.html',
  styleUrl: './non-formal-announcement.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalAnnouncementComponent {
  program = input.required<NonFormalShow>();
  vetIcons = vetIcons;
}
