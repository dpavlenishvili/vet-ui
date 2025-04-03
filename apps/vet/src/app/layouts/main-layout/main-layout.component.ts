import { Component, computed, inject } from '@angular/core';
import { BreadcrumbComponent, NavbarComponent } from '@vet/shared';
import { RouterOutlet } from '@angular/router';
import { ApplicationPagesService } from '@vet/dynamic-pages';
import { AuthenticationService } from '@vet/auth';
import { take } from 'rxjs';
import { AppFooterComponent } from '../../app-footer/app-footer.component';

@Component({
  selector: 'vet-main-layout',
  imports: [RouterOutlet, NavbarComponent, BreadcrumbComponent, AppFooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  protected readonly pages$ = inject(ApplicationPagesService).headerMenuPages$;
  protected readonly user = computed(() => this.authenticationService.user());
  protected authenticationService = inject(AuthenticationService);

  protected logout() {
    this.authenticationService.logout().pipe(take(1)).subscribe();
  }
}
