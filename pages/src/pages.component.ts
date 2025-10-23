import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useMatchedPage, usePageMetadataUpdater } from './pages.signals';
import { Meta } from '@angular/platform-browser';
import { StaticPageComponent } from './components/static-page/static-page.component';
import { CollectionPageComponent } from './components/collection-page/collection-page.component';
import { TabPageComponent } from './components/tab-page/tab-page.component';
import { SidebarPageComponent } from './components/sidebar-page/sidebar-page.component';
import { OrganisationsComponent } from '@vet/organisations';
import { NavigationPageComponent } from './components/navigation-page/navigation-page.component';

@Component({
  selector: 'vet-pages',
  imports: [
    StaticPageComponent,
    CollectionPageComponent,
    TabPageComponent,
    SidebarPageComponent,
    OrganisationsComponent,
    NavigationPageComponent,
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PagesComponent {
  page = useMatchedPage();

  constructor(meta: Meta) {
    usePageMetadataUpdater(meta, this.page);
  }
}
