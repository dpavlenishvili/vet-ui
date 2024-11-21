import { CommonModule, NgOptimizedImage } from '@angular/common';
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

import { CollectionItem } from 'backend';
import { UploadedFileUriPipe } from 'shared/src';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'article[vet-ui-collection-item]',
    standalone: true,
    imports: [CommonModule, RouterLink, NgOptimizedImage, UploadedFileUriPipe],
    templateUrl: './collection-item.component.html',
    styleUrl: './collection-item.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
