import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { TranslocoPipe } from '@jsverse/transloco';
import { NonFormal } from '@vet/backend';
import { vetIcons } from '@vet/shared/icons';
import { useNonFormals } from '../non-formal.resources';
import { NonFormalProgramCardComponent } from './non-formal-program-card/non-formal-program-card.component';

@Component({
  selector: 'vet-non-formal-programs-grid',
  imports: [NonFormalProgramCardComponent, KENDO_LOADER, TranslocoPipe],
  templateUrl: './non-formal-programs-grid.component.html',
  styleUrl: './non-formal-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalProgramsGridComponent {
  page = signal(1);
  perPage = 5;
  vetIcons = vetIcons;

  nonFormals = useNonFormals(this.page, this.perPage);
  allPrograms = signal<NonFormal[]>([]);
  totalPrograms = signal<number>(0);
  isLoadingMore = signal(false);
  scrollThreshold = 100;

  document = inject(DOCUMENT);
  router = inject(Router);

  constructor() {
    effect(() => {
      const res = this.nonFormals?.value?.();
      if (!res?.data) return;

      this.allPrograms.update((prev) => {
        if (this.page() === 1) return res.data!;
        return [...prev, ...res.data!];
      });

      this.totalPrograms.set(res.meta?.total ?? 0);
      this.isLoadingMore.set(false);
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.isLoadingMore() || !this.document.documentElement) return;

    const { scrollTop, scrollHeight, clientHeight } = this.document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - this.scrollThreshold) {
      this.loadNextPage();
    }
  }

  private loadNextPage(): void {
    if (this.isLoadingMore()) return;

    const meta = this.nonFormals?.value?.()?.meta;
    if (!meta || meta.current_page! >= meta.last_page!) return;

    this.isLoadingMore.set(true);
    this.page.update((p) => p + 1);
  }
}
