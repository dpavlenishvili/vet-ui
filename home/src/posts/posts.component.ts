import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UploadedFileUriPipe } from '@vet/shared/pipes';
import { usePageCollection, usePages } from '@vet/pages';
import { DatePipe, SlicePipe } from '@angular/common';
import { PageContentComponent } from '../../../pages/src/components/page-content/page-content.component';
import { Router } from '@angular/router';
import { CollectionItem } from '@vet/backend';
import { IconComponent } from '@vet/shared/ui-components';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-posts',
  standalone: true,
  imports: [UploadedFileUriPipe, DatePipe, PageContentComponent, IconComponent, TranslocoPipe],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostsComponent {
  private readonly _router = inject(Router);

  pages = usePages();
  collectionId = computed(
    () =>
      this.pages
        .value()
        .flatMap((page) => page.collection ?? [])
        .find((collection) => collection.type === 'articles')?.id,
  );
  items = usePageCollection(this.collectionId);
  pinnedItems = computed(() => this.items.value().filter((item) => !!item.pin));
  activeIndex = signal(0);
  activeItem = computed(() => this.pinnedItems()[this.activeIndex()] ?? this.pinnedItems()[0]);

  navigateToArticle(item: CollectionItem): void {
    const parentPage = this.pages.value().find((page) => page.collection?.some((c) => c.type === 'articles'));

    this._router.navigate(['/article', item.id], {
      state: {
        parentPageSlug: parentPage?.slug,
        parentPageTitle: parentPage?.title,
      },
    });
  }

  onActiveIndexChange(idx: number): void {
    const total = this.pinnedItems().length;
    if (total === 0) return;
    const safeIndex = (idx + total) % total;
    this.activeIndex.set(safeIndex);
  }

  next(): void {
    const total = this.pinnedItems().length;
    if (!total) return;
    this.onActiveIndexChange(this.activeIndex() + 1);
  }

  prev(): void {
    const total = this.pinnedItems().length;
    if (!total) return;
    this.onActiveIndexChange(this.activeIndex() - 1);
  }

  goToIndex(idx: number): void {
    this.onActiveIndexChange(idx);
  }
}
