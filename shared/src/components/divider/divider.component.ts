import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vet-divider',
  imports: [],
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class DividerComponent {
}
