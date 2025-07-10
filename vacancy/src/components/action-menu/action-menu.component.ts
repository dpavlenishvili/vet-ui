import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_MENUS } from '@progress/kendo-angular-menu';

@Component({
  selector: 'vet-vacancy-action-menu',
  imports: [KENDO_MENUS, SVGIconComponent, FormsModule, TranslocoPipe],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  id = input.required<number>();
  editAction = output<number>();
  deleteAction = output<number>();
  icons = vetIcons;
}
