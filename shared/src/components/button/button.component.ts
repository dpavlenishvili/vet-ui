import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { vetIcons } from '../../shared.icons';
import { ButtonMode, ButtonType, ButtonVariant, ButtonVersion } from './button.component.types';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { IconComponent } from '../icon';
import { IconSize } from '../icon/icon.component.types';

@Component({
  selector: 'vet-button',
  imports: [FormsModule, KENDO_BUTTON, IconComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ButtonComponent {
  type = input<ButtonType>('button');
  mode = input<ButtonMode>('solid');
  variant = input<ButtonVariant>('primary');
  version = input<ButtonVersion>('thin');
  leadingIcon = input<keyof typeof vetIcons>();
  trailingIcon = input<keyof typeof vetIcons>();
  iconSize = input<IconSize>();
  disabled = input(false);
  vetIcons = vetIcons;
}
