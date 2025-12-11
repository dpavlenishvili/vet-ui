/* eslint-disable no-restricted-globals */
import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, output, signal } from '@angular/core';
import { vetIcons } from '@vet/shared/icons';
import { ShortProgram } from '@vet/backend';
import { ProgramCardComponent } from '@vet/programs-common';
import { useShorts } from '../short-term.resources';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-short-term-programs-grid',
  imports: [ProgramCardComponent, KENDO_LOADER, TranslocoPipe],
  templateUrl: './short-term-programs-grid.component.html',
  styleUrl: './short-term-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsGridComponent implements OnDestroy {
  page = signal(1);
  perPage = 5;
  vetIcons = vetIcons;

  shortPrograms = useShorts(this.page, this.perPage);
  allPrograms = signal<ShortProgram[]>([]);
  totalPrograms = signal<number>(0);

  private scrollHandler = () => this.onScroll();

  private router = inject(Router);

  constructor() {
    effect(() => {
      const res = this.shortPrograms?.value?.();
      if (!res?.data) return;

      this.allPrograms.update((prev) => {
        if (this.page() === 1) return res.data!;
        return [...prev, ...res.data!];
      });

      this.totalPrograms.update(() => res.meta?.total ?? 0);
    });

    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  private onScroll() {
    const scrollTop = window.scrollY;
    const innerHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + innerHeight >= scrollHeight - 100) {
      this.loadNextPage();
    }
  }

  private loadNextPage() {
    const meta = this.shortPrograms?.value?.()?.meta;
    if (meta && meta.current_page! < meta.last_page!) {
      this.page.update((p) => p + 1);
    }
  }

  onOrganisationClick(id: number) {
    this.router.navigate(['/organisations', id]);
  }
}
