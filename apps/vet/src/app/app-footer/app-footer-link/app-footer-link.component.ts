import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Page } from '@vet/backend';
import { AppFooterSublinksComponent } from '../app-footer-sublinks/app-footer-sublinks.component';

@Component({
  selector: 'vet-app-footer-link',
  imports: [RouterLink, AppFooterSublinksComponent],
  templateUrl: './app-footer-link.component.html',
  styleUrl: './app-footer-link.component.scss',
  standalone: true,
})
export class AppFooterLinkComponent {
  page = input.required<Page>();

  isNavigationPage() {
    const page = this.page();
    const collections = page?.collection;

    if (!collections || collections.length < 2) {
      return false;
    }

    return collections.every((collection) => collection.type === 'tabs');
  }
}
