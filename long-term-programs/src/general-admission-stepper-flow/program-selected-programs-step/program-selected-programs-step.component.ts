import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ConfirmationDialogService, vetIcons } from '@vet/shared';

export type ProgramSelectedProgramsStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-selected-programs-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
  ],
  templateUrl: './program-selected-programs-step.component.html',
  styleUrl: './program-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProgramSelectedProgramsStepComponent {
  nextClick = output();
  previousClick = output();

  form = input<ProgramSelectedProgramsStepFormGroup>();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  selectedPrograms = [
    {
      id: 1,
      path: '/programs/engineering',
      program_name: 'ბაკალავრიატი საინჟინრო დარგში',
      implementation_form: 'მოდულური',
      level: '3',
      institution_name: 'სსიპ კოლეჯი ინფორმაციული ტექნოლოგიების აკადემია',
      implementation_location: 'თბილისი, გლდანი-ნაძალადევი, ილია ვეკუას ქუჩა, 44'
    },
    {
      id: 2,
      path: '/programs/engineering',
      program_name: 'ბაკალავრიატი საინჟინრო დარგში',
      implementation_form: 'დუალური',
      level: '2',
      institution_name: 'კოლეჯი ,,მერმისი "',
      implementation_location: 'თბილისი, გლდანი-ნაძალადევი, ილია ვეკუას ქუჩა, 44'
    }
  ];

  constructor(private confirmationDialogService: ConfirmationDialogService) {
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  onViewClick(item: any) {
  }

  onDeleteClick(item: any) {
    this.confirmationDialogService.show({
      content: 'programs.confirm_program_selection_delete',
      onConfirm: () => {

      }
    });
  }
}
