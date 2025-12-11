import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent } from '@vet/shared/heavy-components';
import { NavbarComponent } from '@vet/shared/ui-components';
import { AppFooterComponent } from '../../../../apps/vet/src/app/app-footer/app-footer.component';
import { MainLayoutComponent } from '../../../../apps/vet/src/app/layouts/main-layout/main-layout.component';

@Component({
  selector: 'vet-page-layout',
  imports: [RouterOutlet, AppFooterComponent, BreadcrumbComponent, NavbarComponent, AppFooterComponent],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageLayoutComponent extends MainLayoutComponent {}
