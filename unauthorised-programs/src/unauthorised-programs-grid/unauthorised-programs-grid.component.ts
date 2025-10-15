/* eslint-disable no-restricted-globals */
import { ProgramCardComponent } from '@vet/programs-common';
import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { LongTerm } from '@vet/backend';
import { vetIcons } from '@vet/shared';
import { usePrograms } from '../unauthorised-programs.resources';
import { Router } from '@angular/router';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-unauthorised-programs-grid',
  imports: [ProgramCardComponent, LoaderComponent, TranslocoPipe],
  templateUrl: './unauthorised-programs-grid.component.html',
  styleUrl: './unauthorised-programs-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorisedProgramsGridComponent implements OnDestroy {
  page = signal(1);
  perPage = 5;
  vetIcons = vetIcons;

  unAuthorisedPrograms = usePrograms(this.page, this.perPage);
  allPrograms = signal<LongTerm[]>([]);

  private scrollHandler = () => this.onScroll();

  private router = inject(Router);

  constructor() {
    effect(() => {
      const res = this.unAuthorisedPrograms?.value?.();
      if (!res?.data) return;

      this.allPrograms.update((prev) => {
        if (this.page() === 1) return res.data!;
        return [...prev, ...res.data!];
      });
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
    const meta = this.unAuthorisedPrograms?.value?.()?.meta;
    if (meta && meta.current_page! < meta.last_page!) {
      this.page.update((p) => p + 1);
    }
  }

  onOrganisationClick(id: number) {
    this.router.navigate(['/organisations', id]);
  }
}
