import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UploadedFileUriPipe } from '@vet/shared';

import { CollectionItem } from 'backend';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'article[vet-ui-collection-item]',
  imports: [RouterLink, NgOptimizedImage, UploadedFileUriPipe, DatePipe],
  templateUrl: './collection-item.component.html',
  styleUrl: './collection-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class CollectionItemComponent {
  collectionItem = input.required<CollectionItem>();
  anchorEl = viewChild.required('anchor', { read: ElementRef });
  itemUrl = computed(() => `${this.collectionItem().slug}---${this.collectionItem().id}`);

  @HostListener('click')
  onClick() {
    this.anchorEl().nativeElement.click();
  }
}
