import { Component, computed, inject } from '@angular/core';
import { BreadcrumbComponent } from '@vet/shared/ui-components';
import { NavbarComponent } from '@vet/shared/ui-components';
import { RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@vet/auth';
import { AppFooterComponent } from '../../app-footer/app-footer.component';
import { usePages } from '@vet/pages';

@Component({
  selector: 'vet-main-layout',
  imports: [RouterOutlet, NavbarComponent, BreadcrumbComponent, AppFooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  protected readonly pages$ = usePages();
  protected readonly user = computed(() => this.authenticationService.user());
  protected authenticationService = inject(AuthenticationService);

  protected logout() {
    this.authenticationService.logout();
  }
}
