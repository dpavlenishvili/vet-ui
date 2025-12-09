import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Collection, Page } from '@vet/backend';
import { usePageCollection } from '@vet/pages';

@Component({
  selector: 'vet-app-footer-sublinks',
  imports: [RouterLink],
  templateUrl: './app-footer-sublinks.component.html',
  styleUrl: './app-footer-sublinks.component.scss',
  standalone: true,
})
export class AppFooterSublinksComponent {
  page = input.required<Page>();
  collection = input.required<Collection>();
  isNavigationPage = input(false);

  collectionId = computed(() => this.collection().id);
  items = usePageCollection(this.collectionId);
}
