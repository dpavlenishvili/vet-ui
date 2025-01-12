import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { Page } from 'backend';

@Component({
  selector: 'vet-static-page',
  imports: [CommonModule],
  templateUrl: './static-page.component.html',
  styleUrl: './static-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticPageComponent {
  page = input.required<Page>();
}
