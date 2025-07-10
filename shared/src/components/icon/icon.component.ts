import { ChangeDetectionStrategy, Component, input, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { vetIcons } from '../../shared.icons';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { IconSize } from './icon.component.types';
import {
  PopoverAnchorDirective,
  PopoverBodyTemplateDirective,
  PopoverComponent,
  TooltipDirective,
} from '@progress/kendo-angular-tooltip';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'vet-icon',
  imports: [
    FormsModule,
    SVGIconComponent,
    PopoverAnchorDirective,
    NgTemplateOutlet,
    PopoverBodyTemplateDirective,
    PopoverComponent,
    TooltipDirective,
  ],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class IconComponent {
  icon = input.required<keyof typeof vetIcons>();
  size = input<IconSize>('medium');
  popover = input<TemplateRef<unknown> | null>(null);
  tooltip = input<string>();
  class = input<string>();
  vetIcons = vetIcons;
}
