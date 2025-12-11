import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  effect,
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
import { WizardStepDefinition } from '@vet/shared';
import { vetIcons } from '@vet/shared/icons';
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
  isViewMode = input<boolean>(false);

  vetIcons = vetIcons;
  isExpanded = signal(true);
  currentStep = computed(() => this.steps()[this.stepIndex()]);

  private readonly window = inject(WA_WINDOW);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  isMobile = signal(false);

  orientation = computed<'horizontal' | 'vertical'>(() => (this.isMobile() ? 'horizontal' : 'vertical'));
  stepType = computed<'indicator' | 'full'>(() => (this.isMobile() || !this.isExpanded() ? 'indicator' : 'full'));

  constructor() {
    fromEvent(this.window, 'resize')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.updateResponsiveState();
      });

    // Force change detection when stepIndex changes
    // This ensures the Kendo Stepper updates its active state properly
    effect(() => {
      this.stepIndex(); // Track changes to stepIndex
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.updateResponsiveState();
  }

  onStepChange(event: StepperActivateEvent) {
    if (this.isViewMode()) {
      this.stepIndexChange.emit(event.index);
    } else {
      // Allow backward navigation OR forward if current step valid
      if (event.index < this.stepIndex() || this.currentStep().form().valid) {
        this.stepIndexChange.emit(event.index);
      } else {
        event.preventDefault();
      }
    }
  }

  onToggleExpansion() {
    if (this.isViewMode()) return;

    if (!this.isMobile()) {
      this.isExpanded.update((value) => !value);
    }
  }

  private updateResponsiveState(): void {
    const width = this.window.innerWidth;
    const mobile = width < MOBILE_BREAKPOINT;
    this.isMobile.set(mobile);

    if (mobile) {
      this.isExpanded.set(false);
    } else if (width < TABLET_BREAKPOINT) {
      this.isExpanded.set(false);
    } else {
      this.isExpanded.set(true);
    }
  }
}
