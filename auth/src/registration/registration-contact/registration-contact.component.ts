import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPhoneComponent } from '../registration-phone/registration-phone.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { IconComponent, InputComponent } from '@vet/shared/ui-components';

@Component({
  selector: 'vet-registration-contact',
  imports: [ReactiveFormsModule, RegistrationPhoneComponent, TranslocoPipe, InputComponent, IconComponent],
  templateUrl: './registration-contact.component.html',
  styleUrl: './registration-contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationContactComponent {
  form = input.required<FormGroup>();
}
