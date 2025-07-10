import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardSidebarComponent } from '../dashboard-sidebar/dashboard-sidebar.component';
import { isPlatformBrowser } from '@angular/common';
import { AppFooterComponent } from '../../../apps/vet/src/app/app-footer/app-footer.component';
import { BreadcrumbComponent, NavbarComponent } from '@vet/shared';
import { MainLayoutComponent } from '../../../apps/vet/src/app/layouts/main-layout/main-layout.component';

@Component({
  selector: 'vet-dashboard-layout',
  imports: [RouterOutlet, DashboardSidebarComponent, AppFooterComponent, BreadcrumbComponent, NavbarComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent extends MainLayoutComponent {
  platformId = inject(PLATFORM_ID);

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }
}
