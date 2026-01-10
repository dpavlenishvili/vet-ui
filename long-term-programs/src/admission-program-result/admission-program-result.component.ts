import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { TranslocoPipe } from '@jsverse/transloco';
import { RolePipe } from '@vet/auth';
import { AdmissionService } from '@vet/backend';
import { vetIcons } from '@vet/shared/icons';
import { ButtonComponent, InfoComponent } from '@vet/shared';
import { AdmissionProgramGridComponent } from '../admission-program-grid/admission-program-grid.component';

@Component({
  selector: 'vet-admission-program-result',
  imports: [
    GridModule,
    ButtonsModule,
    TranslocoPipe,
    InfoComponent,
    ButtonComponent,
    LoaderComponent,
    AdmissionProgramGridComponent,
    RolePipe,
  ],
  templateUrl: './admission-program-result.component.html',
  styleUrl: './admission-program-result.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionProgramResultComponent implements OnInit {
  protected readonly vetIcons = vetIcons;
  protected readonly admissionId = signal<string | null>(null);

  private readonly admissionService = inject(AdmissionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly programsList$ = rxResource({
    request: () => ({ admissionId: this.admissionId() }),
    loader: ({ request: { admissionId } }) => {
      if (!admissionId) {
        return of({ data: [] });
      }

      return this.admissionService.userResults(admissionId).pipe(
        catchError((error) => {
          console.error('Failed to load programs list:', error);
          return of({ data: [] });
        }),
      );
    },
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['dashboard', 'programs', 'long']);
      return;
    }

    this.admissionId.set(id);
  }

  onClose(): void {
    this.router.navigate(['dashboard', 'programs', 'long']);
  }
}
