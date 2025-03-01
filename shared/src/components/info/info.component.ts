import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { NgClass } from '@angular/common';

@Component({
  selector: 'vet-info',
  imports: [
    SVGIconComponent,
    NgClass
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class InfoComponent {
  text = input('');
  variant = input<'info' | 'warning'>('info');

  vetIcons = vetIcons;
  containerClass = computed(() => ({
    info: 'vet-info-info k-border-primary-extra-light k-color-primary-extra-light',
    warning: 'vet-info-warning k-border-warning k-color-warning',
  })[this.variant()])
  icon = computed(() => ({
    info: vetIcons.info,
    warning: vetIcons.infoWarning,
  })[this.variant()])
}
