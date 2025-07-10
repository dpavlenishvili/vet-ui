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

  sanitizedVideoUrl = useSanitizedUrl(() => this.videoUrl() ?? 'https://www.youtube.com/embed/eLVVkXOekRE');
}
