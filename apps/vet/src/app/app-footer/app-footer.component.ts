import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-app-footer',
  standalone: true,
  imports: [CommonModule, SVGIconComponent, TranslocoPipe],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
})
export class AppFooterComponent {
  vetIcons = vetIcons;
}
