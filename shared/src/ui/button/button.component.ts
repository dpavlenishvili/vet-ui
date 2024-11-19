import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type ButtonSize = 'sm' | 'm' | 'l';

@Component({
  selector: 'button[vet-button]',
  standalone: true,
  template: ` <ng-content></ng-content> `,
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.vet-button]': 'true',
    '[class.vet-button--primary]': 'color === "primary"',
    '[class.vet-button--secondary]': 'color === "secondary"',
    '[class.vet-button--small]': 'size === "sm"',
    '[class.vet-button--medium]': 'size === "m"',
    '[class.vet-button--large]': 'size === "l"',
  },
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input() color: 'primary' | 'secondary' = 'primary';
  @Input() size: ButtonSize = 'm';
}
