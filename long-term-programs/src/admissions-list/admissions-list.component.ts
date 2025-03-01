import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AdmissionService } from '@vet/backend';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'vet-admissions-list',
  imports: [AsyncPipe],
  templateUrl: './admissions-list.component.html',
  styleUrl: './admissions-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionsListComponent {
  admissionList = inject(AdmissionService).admissionList({
    role: 'Default User',
  });
  admissionService = inject(AdmissionService);

  router = inject(Router);

  updateAdmission(id: number | undefined) {
    console.log(id);
    // this.admissionService.admissionList({
    //   role: 'Default User',
    //   number: id,
    // }).subscribe(admission => {console.log(admission)})
    this.router.navigate(['long-term-programs','update-admission', id]);
  }
}
