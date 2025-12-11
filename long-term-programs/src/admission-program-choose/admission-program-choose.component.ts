import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, InfoComponent } from '@vet/shared/ui-components';
import { AdmissionProgramGridComponent } from '../admission-program-grid/admission-program-grid.component';
import { RolePipe } from '@vet/auth';

@Component({
  selector: 'vet-admission-program-choose',
  imports: [
    GridModule,
    ButtonsModule,
    TranslocoPipe,
    InfoComponent,
    ButtonComponent,
    AdmissionProgramGridComponent,
    RolePipe,
  ],
  templateUrl: './admission-program-choose.component.html',
  styleUrl: './admission-program-choose.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdmissionProgramChooseComponent {
  private readonly router = inject(Router);

  onSave(): void {
    this.router.navigate(['dashboard', 'programs', 'long']);
  }
}
