import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { GridModule } from '@progress/kendo-angular-grid';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionService } from '@vet/backend';
import { InfoComponent, vetIcons } from '@vet/shared';
import { catchError, of } from 'rxjs';
import { LoaderComponent } from '@progress/kendo-angular-indicators';

@Component({
  selector: 'vet-admission-program-result',
  imports: [GridModule, TranslocoPipe, InfoComponent, LoaderComponent],
  templateUrl: './admission-program-result.component.html',
  styleUrl: './admission-program-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionProgramResultComponent implements OnInit {
  private admissionService = inject(AdmissionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly vetIcons = vetIcons;
  protected readonly admissionId = signal<string | null>(null);

  protected readonly programsList$ = rxResource({
    request: () => ({ admissionId: this.admissionId() }),
    loader: ({ request: { admissionId } }) => {
      if (!admissionId) {
        return of({ data: [] });
      }

      return this.admissionService.admissionProgramList(admissionId).pipe(
        catchError((error) => {
          console.error('Failed to load programs list:', error);
          return of({ data: [] });
        }),
      );
    },
  });

  protected readonly selectedPrograms = computed(() => {
    const programs = this.programsList$.value()?.data || [];
    return programs.filter((program) => program.select === true);
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['dashboard', 'programs', 'long']);
      return;
    }

    this.admissionId.set(id);
  }
}
