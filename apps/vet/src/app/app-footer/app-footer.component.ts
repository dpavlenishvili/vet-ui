import { Component, inject, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomAuthService } from '@vet/auth';

@Component({
  selector: 'vet-app-footer',
  imports: [SVGIconComponent, TranslocoPipe],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  standalone: true,
})
export class AppFooterComponent {
  divider = input(true)
  vetIcons = vetIcons;
  authenticated = inject(CustomAuthService).authenticated$;
}
