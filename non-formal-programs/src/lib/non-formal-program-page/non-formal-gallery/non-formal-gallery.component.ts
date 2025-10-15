import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'vet-non-formal-gallery',
  standalone: true,
  imports: [],
  templateUrl: './non-formal-gallery.component.html',
  styleUrl: './non-formal-gallery.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalGalleryComponent {
  private readonly sanitizer = inject(DomSanitizer);

  videoUrl = input<string | null>();

  safeVideoUrl = computed<SafeResourceUrl | null>(() => {
    const url = this.videoUrl();
    if (!url) return null;

    // Convert YouTube watch URL to embed URL
    let embedUrl = url;
    if (embedUrl.includes('youtube.com/watch')) {
      const videoId = embedUrl.split('v=')[1]?.split('&')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (embedUrl.includes('youtu.be/')) {
      const videoId = embedUrl.split('youtu.be/')[1];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  });
}
