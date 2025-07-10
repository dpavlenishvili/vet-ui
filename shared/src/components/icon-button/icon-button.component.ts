import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { vetIcons } from '../../shared.icons';
import {
  IconButtonMode,
  IconButtonIconSize,
  IconButtonType,
  IconButtonVariant,
  InputButtonVersion
} from './icon-button.component.types';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';

@Component({
  selector: 'vet-icon-button',
  imports: [FormsModule, KENDO_BUTTON],
  templateUrl: './icon-button.component.html',
  styleUrl: './icon-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class IconButtonComponent {
  icon = input.required<keyof typeof vetIcons>();
  type = input<IconButtonType>('button');
  mode = input<IconButtonMode>('outline');
  iconSize = input<IconButtonIconSize>('small');
  variant = input<IconButtonVariant>('primary');
  version = input<InputButtonVersion>('normal');
  disabled = input(false);
  vetIcons = vetIcons;
}
