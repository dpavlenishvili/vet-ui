import { ChangeDetectionStrategy, Component } from '@angular/core';
import { useRouteNumberParam } from '@vet/shared';
import { UploadedFileUriPipe } from '@vet/shared/pipes';
import { usePageCollectionItem } from '@vet/pages';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { PageContentComponent } from '../page-content/page-content.component';

@Component({
  selector: 'vet-article-page',
  imports: [DatePipe, NgOptimizedImage, UploadedFileUriPipe, PageContentComponent],
  templateUrl: './article-page.component.html',
  styleUrl: './article-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ArticlePageComponent {
  itemId = useRouteNumberParam('id');
  item = usePageCollectionItem(this.itemId);
}
