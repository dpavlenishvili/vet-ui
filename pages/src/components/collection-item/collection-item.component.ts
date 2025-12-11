import { DatePipe, NgOptimizedImage, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UploadedFileUriPipe } from '@vet/shared/pipes';
import type { CollectionItem, Page } from '@vet/backend';
import { PageContentComponent } from '../page-content/page-content.component';

@Component({
  selector: 'vet-collection-item',
  imports: [RouterLink, NgOptimizedImage, UploadedFileUriPipe, DatePipe, SlicePipe, PageContentComponent],
  templateUrl: './collection-item.component.html',
  styleUrl: './collection-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class CollectionItemComponent {
  item = input.required<CollectionItem>();
  parentPage = input.required<Page>();
}
