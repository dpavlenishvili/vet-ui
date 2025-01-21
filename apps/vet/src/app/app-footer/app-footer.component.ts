import { Component } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-app-footer',
  imports: [SVGIconComponent, TranslocoPipe],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  standalone: true
})
export class AppFooterComponent {
  vetIcons = vetIcons;
}
