import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GeneralAdmissionStepperFlowComponent
} from '../general-admission-stepper-flow/general-admission-stepper-flow.component';

@Component({
  selector: 'vet-admission-update',
  imports: [GeneralAdmissionStepperFlowComponent],
  templateUrl: './admission-update.component.html',
  styleUrl: './admission-update.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionUpdateComponent {
  activatedRoute = inject(ActivatedRoute);
  admissionId = computed(() => {
    return this.activatedRoute.snapshot.paramMap.get('admissionId');
  });
}
