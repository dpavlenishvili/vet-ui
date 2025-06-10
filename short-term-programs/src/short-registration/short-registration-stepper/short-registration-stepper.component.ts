import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  StepperActivateEvent,
  StepperComponent,
  StepperIndicatorTemplateDirective,
  StepperLabelTemplateDirective
} from '@progress/kendo-angular-layout';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons, WizardStepDefinition } from '@vet/shared';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'vet-short-registration-stepper',
  imports: [
    ButtonComponent,
    StepperComponent,
    StepperIndicatorTemplateDirective,
    StepperLabelTemplateDirective,
    TooltipDirective,
    TranslocoPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './short-registration-stepper.component.html',
  styleUrl: './short-registration-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationStepperComponent {
  steps = input.required<WizardStepDefinition[]>();
  stepIndex = input.required<number>();
  stepIndexChange = output<number>();

  vetIcons = vetIcons;
  isExpanded = signal(true);
  currentStep = computed(() => this.steps()[this.stepIndex()]);

  onStepChange(event: StepperActivateEvent) {
    if (event.index > this.stepIndex() && !this.currentStep().form().valid) {
      event.preventDefault()
      return
    }

    this.stepIndexChange.emit(event.index);
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);
  }
}
