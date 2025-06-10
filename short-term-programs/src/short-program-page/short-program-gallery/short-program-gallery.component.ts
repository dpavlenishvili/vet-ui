import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { useSanitizedUrl } from '@vet/shared';

@Component({
  selector: 'vet-short-program-gallery',
  imports: [],
  templateUrl: './short-program-gallery.component.html',
  styleUrl: './short-program-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramGalleryComponent {
  videoUrl = input.required<string | null | undefined>();

  sanitizedVideoUrl = useSanitizedUrl(() => this.videoUrl() ?? 'https://www.youtube.com/embed/eLVVkXOekRE');
}
