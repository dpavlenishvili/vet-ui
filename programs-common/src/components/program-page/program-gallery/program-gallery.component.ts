import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { useSanitizedUrl } from '@vet/shared';

@Component({
  selector: 'vet-program-gallery',
  imports: [],
  templateUrl: './program-gallery.component.html',
  styleUrl: './program-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramGalleryComponent {
  videoUrl = input.required<string | null | undefined>();

  sanitizedVideoUrl = useSanitizedUrl(() => {
    const rawUrl = this.videoUrl() ?? 'https://www.youtube.com/embed/eLVVkXOekRE';

    if (rawUrl.includes('watch?v=')) {
      const videoId = rawUrl.split('watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return rawUrl;
  });
}
