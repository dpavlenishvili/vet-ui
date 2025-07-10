import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { CardModule } from '@progress/kendo-angular-layout';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { passwordChangeForm } from './user-password-change-form';
import { UserProfileSection } from '../user-profile-section';
import { UserReq } from '@vet/backend';
import { ButtonComponent, InputComponent } from '@vet/shared';

@Component({
  selector: 'vet-user-password-change',
  imports: [
    CardModule,
    ButtonModule,
    InputsModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './user-password-change.component.html',
  styleUrl: './user-password-change.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordChangeComponent extends UserProfileSection {
  kendoIcons = kendoIcons;
  save = output();

  allowedKeys = new Set(['backspace', 'delete', 'arrowleft', 'arrowright', 'tab', 'enter']);

  form = passwordChangeForm();

  restrictInput(event: KeyboardEvent) {
    const key = event.key.toLowerCase();

    const unicodeLetter = /[\p{L}]/u;
    const englishLetter = /^[a-zA-Z]$/;

    if (this.allowedKeys.has(key)) {
      return;
    }

    if (unicodeLetter.test(key) && !englishLetter.test(key)) {
      event.preventDefault();
    }
  }

  handleSave() {
    this.updateUser(this.form.value as UserReq);
  }
}
