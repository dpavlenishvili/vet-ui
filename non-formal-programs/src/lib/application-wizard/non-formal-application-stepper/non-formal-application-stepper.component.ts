import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  StepperActivateEvent,
  StepperComponent,
  StepperIndicatorTemplateDirective,
  StepperLabelTemplateDirective,
} from '@progress/kendo-angular-layout';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons, WizardStepDefinition } from '@vet/shared';
import { NgTemplateOutlet } from '@angular/common';
import { fromEvent } from 'rxjs';
import { WA_WINDOW } from '@ng-web-apis/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 992;

@Component({
  selector: 'vet-non-formal-application-stepper',
  imports: [
    ButtonComponent,
    StepperComponent,
    StepperIndicatorTemplateDirective,
    StepperLabelTemplateDirective,
    TooltipDirective,
    TranslocoPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './non-formal-application-stepper.component.html',
  styleUrl: './non-formal-application-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalApplicationStepperComponent implements OnInit {
  steps = input.required<WizardStepDefinition[]>();
  stepIndex = input.required<number>();
  stepIndexChange = output<number>();

  vetIcons = vetIcons;
  isExpanded = signal(true);
  currentStep = computed(() => this.steps()[this.stepIndex()]);

  private readonly window = inject(WA_WINDOW);
  private readonly destroyRef = inject(DestroyRef);

  isMobile = signal(false);
  isTablet = signal(false);

  orientation = computed<'horizontal' | 'vertical'>(() => (this.isMobile() ? 'horizontal' : 'vertical'));
  stepType = computed<'indicator' | 'full'>(() => (this.isMobile() ? 'indicator' : 'full'));

  constructor() {
    fromEvent(this.window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateResponsiveState();
      });
  }

  ngOnInit(): void {
    this.updateResponsiveState();
  }

  onStepChange(event: StepperActivateEvent) {
    if (event.index > this.stepIndex() && !this.currentStep().form().valid) {
      event.preventDefault();
      return;
    }

    this.stepIndexChange.emit(event.index);
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);
    // if (this.isViewMode()) return;

    if (!this.isMobile()) {
      this.isExpanded.update((value) => !value);
      // this.stepType.set(this.isExpanded() ? 'full' : 'indicator');
    }
  }

  private updateResponsiveState(): void {
    const width = this.window.innerWidth;
    const mobile = width < MOBILE_BREAKPOINT;
    const tablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
    this.isMobile.set(mobile);
    this.isTablet.set(tablet);

    this.isMobile.set(mobile);

    if (mobile) {
      // this.stepperOrientation.set('horizontal');
      this.isExpanded.set(false);
    } else if (width < TABLET_BREAKPOINT) {
      // this.stepperOrientation.set('vertical');
      this.isExpanded.set(false);
    } else {
      // this.stepperOrientation.set('vertical');
      this.isExpanded.set(true);
    }
  }
}
