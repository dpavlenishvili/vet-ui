import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Page } from '@vet/backend';
import { PageContentComponent } from '../page-content/page-content.component';
import { NgOptimizedImage } from '@angular/common';
import { UploadedFileUriPipe } from '@vet/shared';

@Component({
  selector: 'vet-static-page',
  imports: [PageContentComponent, NgOptimizedImage, UploadedFileUriPipe],
  templateUrl: './static-page.component.html',
  styleUrl: './static-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class StaticPageComponent {
  page = input.required<Page>();
}
