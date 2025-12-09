import { Component, computed, inject, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthenticationService } from '@vet/auth';
import { Page } from '@vet/backend';
import { AppFooterLinkComponent } from './app-footer-link/app-footer-link.component';

@Component({
  selector: 'vet-app-footer',
  imports: [SVGIconComponent, TranslocoPipe, AppFooterLinkComponent],
  templateUrl: './app-footer.component.html',
  styleUrl: './app-footer.component.scss',
  standalone: true,
})
export class AppFooterComponent {
  pages = input.required<Page[]>();
  footerPages = computed(() => {
    return this.pages()
      .filter((page) => {
        return page.menus?.some((menu) => {
          const lcName = menu.name.toLowerCase();

          return lcName.includes('footer');
        });
      })
      .slice(0, 3);
  });

  vetIcons = vetIcons;
  authenticated = inject(AuthenticationService).isAuthenticated;
}
