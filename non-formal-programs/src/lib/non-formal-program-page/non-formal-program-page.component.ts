import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { FormatDatePipe, useRouteNumberParam, vetIcons } from '@vet/shared';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NonFormalService } from '@vet/backend';

@Component({
  selector: 'vet-non-formal-program-page',
  standalone: true,
  imports: [TranslocoPipe, LoaderComponent, FormatDatePipe, SVGIconComponent],
  templateUrl: './non-formal-program-page.component.html',
  styleUrl: './non-formal-program-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalProgramPageComponent {
  private readonly nonFormalsService = inject(NonFormalService);
  private readonly sanitizer = inject(DomSanitizer);

  programId = input<number>();
  routeProgramId = useRouteNumberParam('programId', 0);
  vetIcons = vetIcons;

  program = rxResource({
    request: () => this.programId() ?? this.routeProgramId(),
    loader: ({ request: id }) => this.nonFormalsService.nonFormal(id).pipe(map((response) => response.data)),
  });

  hasAnnouncement = computed(() => {
    const prog = this.program.value();
    if (!prog) return false;
    return !!(prog.registration || prog.consultation || prog.evidence);
  });

  videoUrl = computed<SafeResourceUrl | null>(() => {
    const prog = this.program.value();
    if (!prog?.video_url) return null;

    // Convert YouTube watch URL to embed URL
    let embedUrl = prog.video_url;
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
