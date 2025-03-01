import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GeneralAdmissionStepperFlowComponent
} from '../general-admission-stepper-flow/general-admission-stepper-flow.component';

@Component({
  selector: 'vet-admission-registration',
  imports: [GeneralAdmissionStepperFlowComponent],
  templateUrl: './admission-registration.component.html',
  styleUrl: './admission-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionRegistrationComponent {}
