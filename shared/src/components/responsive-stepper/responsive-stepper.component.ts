import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { AbstractControl, FormArray, FormGroup, FormsModule } from '@angular/forms';
import {
  StepperComponent,
  StepperIndicatorTemplateDirective,
  StepperLabelTemplateDirective,
} from '@progress/kendo-angular-layout';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { catchError, debounceTime, fromEvent, Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WA_WINDOW } from '@ng-web-apis/common';

import { PARENT_FORM_GROUP, STEP_FORM_GROUP } from '../../shared.tokens';
import { StepDefinition } from '../../shared.types';
import { ButtonComponent } from '../button';
import { vetIcons } from '../../shared.icons';
import { TransPipe } from '../../pipes/trans.pipe';
import { ExpandableSidebarComponent } from '../expandable-sidebar/expandable-sidebar.component';
import { useReactiveControl } from '../../shared.signals';

@Component({
  selector: 'vet-responsive-stepper',
  imports: [
    FormsModule,
    StepperComponent,
    NgComponentOutlet,
    StepperLabelTemplateDirective,
    StepperIndicatorTemplateDirective,
    ButtonComponent,
    TooltipDirective,
    TransPipe,
    ExpandableSidebarComponent,
  ],
  templateUrl: './responsive-stepper.component.html',
  styleUrl: './responsive-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ResponsiveStepperComponent<
  F extends {
    [K in keyof F]: AbstractControl;
  },
> {
  steps = input<StepDefinition[]>([]);
  currentStep = model<string>('');
  formGroup = input.required<FormGroup<F>>();
  isSubmitting = input<boolean>(false);
  submitForm = output<void>();

  injector = inject(Injector);
  private window = inject(WA_WINDOW);
  private destroyRef = inject(DestroyRef);
  stepInjector!: Injector;

  vetIcons = vetIcons;
  isExpanded = signal(true);
  stepperOrientation = signal<'horizontal' | 'vertical'>('vertical');
  isNextActionLoading = signal(false);
  currentActionIndices = signal<Map<string, number>>(new Map());
  modifiedSteps = signal<Set<string>>(new Set());
  stepConditionResults = signal<Map<string, boolean>>(new Map());
  actionConditionResults = signal<Map<string, Map<number, boolean>>>(new Map());

  stepType = computed<'indicator' | 'full'>(() => {
    return this.stepperOrientation() === 'horizontal' ? 'indicator' : 'full';
  });

  visibleSteps = computed(() => {
    const allSteps = this.steps();
    const conditionResults = this.stepConditionResults();

    return allSteps.filter((step) => {
      // Steps without condition are always visible
      if (!step.condition) {
        return true;
      }

      // Steps with condition are visible only if result is true
      return conditionResults.get(step.key) === true;
    });
  });

  visibleNextActions = (stepKey: string) => {
    return computed(() => {
      const step = this.steps().find((s) => s.key === stepKey);
      if (!step || !step.nextActions || step.nextActions.length === 0) {
        return [];
      }

      const conditionResults = this.actionConditionResults().get(stepKey);
      const visible = step.nextActions.filter((action, index) => {
        // Actions without condition are always visible
        if (!action.condition) {
          return true;
        }

        // Actions with condition are visible only if result is true
        const result = conditionResults?.get(index);
        return result === true;
      });

      // If all actions are filtered out, return array with last action (always show at least one)
      if (visible.length === 0 && step.nextActions.length > 0) {
        return [step.nextActions[step.nextActions.length - 1]];
      }

      return visible;
    });
  };

  currentStepIndex = computed(() => {
    const activeStepKey = this.currentStep();
    return this.visibleSteps().findIndex((s) => s.key === activeStepKey);
  });

  activeStep = computed(() => {
    const activeStepKey = this.currentStep();
    // Get from original steps array to ensure we have the full step definition
    return this.steps().find((s) => s.key === activeStepKey);
  });
  activeStepForm = computed(() => {
    const step = this.activeStep();

    if (!step) {
      return null;
    }

    return this.formGroup().get(step.key)
  });
  reactiveActiveStepForm = useReactiveControl(this.activeStepForm);
  activeStepComponent = computed(() => this.activeStep()?.component || null);

  private formValidityTrigger = signal(0);

  canGoBack = computed(() => {
    const index = this.currentStepIndex();
    return index > 0;
  });

  canGoNext = computed(() => {
    const step = this.activeStep();
    const stepForm = this.reactiveActiveStepForm();
    if (!step) return false;

    // Check step-level validator
    if (step.key && !step.validator && stepForm && !stepForm.valid) {
      return false;
    }

    if (step.validator && !step.validator()) {
      return false;
    }

    // Check current action validator if step has nextActions
    if (step.nextActions && step.nextActions.length > 0) {
      // Access actionConditionResults to make this computed reactive to action condition changes
      this.actionConditionResults();
      const visibleActions = this.visibleNextActions(step.key)();
      const currentActionIndex = this.currentActionIndices().get(step.key) ?? 0;
      const currentAction = visibleActions[currentActionIndex];

      if (currentAction?.validator && !currentAction.validator()) {
        return false;
      }
    }

    return true;
  });

  isLastStep = computed(() => {
    const index = this.currentStepIndex();
    const visible = this.visibleSteps();
    return index === visible.length - 1;
  });

  nextButtonLabel = computed(() => {
    const step = this.activeStep();
    if (!step) return this.isLastStep() ? 'shared.submit' : 'shared.next';

    // If step has nextActions, use current action's label from visible actions
    if (step.nextActions && step.nextActions.length > 0) {
      // Access actionConditionResults to make this computed reactive to action condition changes
      this.actionConditionResults();
      const visibleActions = this.visibleNextActions(step.key)();
      const currentActionIndex = this.currentActionIndices().get(step.key) ?? 0;
      const currentAction = visibleActions[currentActionIndex];
      if (currentAction) {
        return currentAction.label;
      }
    }

    return this.isLastStep() ? 'shared.submit' : 'shared.next';
  });

  previousButtonLabel = computed(() => {
    const step = this.activeStep();
    if (step?.previousButtonLabel) {
      return step.previousButtonLabel;
    }
    return 'shared.previous';
  });

  kendoSteps = computed(() => {
    const currentIndex = this.currentStepIndex();
    const visible = this.visibleSteps();
    return visible.map((step, index) => {
      let isDisabled = step.disabled ?? false;

      if (index > currentIndex) {
        for (let i = currentIndex; i < index; i++) {
          const prevStep = visible[i];
          const stepForm = this.formGroup().get(prevStep.key);

          if (stepForm && !stepForm.valid) {
            isDisabled = true;
            break;
          }

          if (prevStep.validator && !prevStep.validator()) {
            isDisabled = true;
            break;
          }
        }
      }

      return {
        label: step.label,
        disabled: isDisabled,
        iconClass: this.isStepComplete(step.key) ? 'k-i-check' : undefined,
      };
    });
  });

  constructor() {
    let previousStepKey: string | null = null;

    effect(() => {
      const step = this.activeStep();
      if (step?.key) {
        const stepForm = this.formGroup().get(step.key);
        this.stepInjector = Injector.create({
          parent: this.injector,
          providers: [
            { provide: STEP_FORM_GROUP, useValue: stepForm },
            { provide: PARENT_FORM_GROUP, useValue: this.formGroup() },
          ],
        });
      }
    });

    // Evaluate step conditions
    effect((onCleanup) => {
      const steps = this.steps();
      const formGroup = this.formGroup();
      const subscriptions: Array<{ unsubscribe: () => void }> = [];

      const evaluateStepConditions = () => {
        steps.forEach((step) => {
          if (!step.condition) {
            // Steps without condition are always visible (default to true)
            this.stepConditionResults.update((map) => {
              const newMap = new Map(map);
              newMap.set(step.key, true);
              return newMap;
            });
            return;
          }

          try {
            const result = step.condition(formGroup);

            if (result instanceof Observable) {
              // Handle async condition - subscribe and take first value
              const subscription = result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((conditionResult) => {
                this.stepConditionResults.update((map) => {
                  const newMap = new Map(map);
                  newMap.set(step.key, conditionResult);
                  return newMap;
                });
              });
              subscriptions.push(subscription);
            } else {
              // Handle sync condition
              this.stepConditionResults.update((map) => {
                const newMap = new Map(map);
                newMap.set(step.key, result);
                return newMap;
              });
            }
          } catch (error) {
            // If condition throws, default to false (step not visible)
            this.stepConditionResults.update((map) => {
              const newMap = new Map(map);
              newMap.set(step.key, false);
              return newMap;
            });
          }
        });
      };

      const evaluateActionConditions = () => {
        steps.forEach((step) => {
          if (!step.nextActions || step.nextActions.length === 0) {
            return;
          }

          const stepKey = step.key;
          const actionSubscriptions: Array<{ unsubscribe: () => void }> = [];

          step.nextActions.forEach((action, actionIndex) => {
            if (!action.condition) {
              // Actions without condition are always visible (default to true)
              this.actionConditionResults.update((map) => {
                const newMap = new Map(map);
                const stepResults = newMap.get(stepKey) || new Map<number, boolean>();
                stepResults.set(actionIndex, true);
                newMap.set(stepKey, stepResults);
                return newMap;
              });
              return;
            }

            try {
              const result = action.condition(formGroup);

              if (result instanceof Observable) {
                // Handle async condition - subscribe and take first value
                const subscription = result.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((conditionResult) => {
                  this.actionConditionResults.update((map) => {
                    const newMap = new Map(map);
                    const stepResults = newMap.get(stepKey) || new Map<number, boolean>();
                    stepResults.set(actionIndex, conditionResult);
                    newMap.set(stepKey, stepResults);
                    return newMap;
                  });
                });
                actionSubscriptions.push(subscription);
                subscriptions.push(...actionSubscriptions);
              } else {
                // Handle sync condition
                this.actionConditionResults.update((map) => {
                  const newMap = new Map(map);
                  const stepResults = newMap.get(stepKey) || new Map<number, boolean>();
                  stepResults.set(actionIndex, result);
                  newMap.set(stepKey, stepResults);
                  return newMap;
                });
              }
            } catch (error) {
              // If condition throws, default to false (action not visible)
              this.actionConditionResults.update((map) => {
                const newMap = new Map(map);
                const stepResults = newMap.get(stepKey) || new Map<number, boolean>();
                stepResults.set(actionIndex, false);
                newMap.set(stepKey, stepResults);
                return newMap;
              });
            }
          });
        });
      };

      // Initial evaluation
      evaluateStepConditions();
      evaluateActionConditions();

      // Re-evaluate conditions when form values change
      const formSubscription = formGroup.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        // Unsubscribe from previous async condition subscriptions
        subscriptions.forEach((sub) => sub.unsubscribe());
        subscriptions.length = 0;
        // Re-evaluate all conditions
        evaluateStepConditions();
        evaluateActionConditions();
      });

      onCleanup(() => {
        subscriptions.forEach((sub) => sub.unsubscribe());
        formSubscription.unsubscribe();
      });
    });

    // Handle current step becoming invisible - navigate back to previous valid step
    effect(() => {
      const currentStepKey = this.currentStep();
      const visible = this.visibleSteps();
      const currentStepVisible = visible.some((s) => s.key === currentStepKey);

      if (currentStepKey && !currentStepVisible) {
        // Check if the step exists in the original steps array
        const step = this.steps().find((s) => s.key === currentStepKey);

        // If step has no condition, it should always be visible
        // If it's not in visibleSteps, it might be because conditions haven't evaluated yet
        // In this case, don't navigate back - wait for conditions to evaluate
        if (step && !step.condition) {
          return;
        }

        // Also check if the step condition result is explicitly false
        // If it's undefined/null, it might just not be evaluated yet
        const conditionResult = this.stepConditionResults().get(currentStepKey);
        if (step && step.condition && conditionResult === undefined) {
          // Condition hasn't been evaluated yet - don't navigate back
          return;
        }

        // Current step is no longer visible and condition is evaluated, find previous valid step
        const currentIndex = this.steps().findIndex((s) => s.key === currentStepKey);

        // Look backwards through steps to find the first visible one
        for (let i = currentIndex - 1; i >= 0; i--) {
          const prevStep = this.steps()[i];
          const isVisible = visible.some((s) => s.key === prevStep.key);
          if (isVisible) {
            this.currentStep.set(prevStep.key);
            return;
          }
        }

        // If no previous visible step found, go to first visible step
        if (visible.length > 0) {
          this.currentStep.set(visible[0].key);
        }
      }
    });

    // Track form dirty state when leaving a step
    effect(() => {
      const currentStepKey = this.currentStep();

      if (previousStepKey && previousStepKey !== currentStepKey) {
        const previousStepForm = this.formGroup().get(previousStepKey);
        if (previousStepForm && previousStepForm.dirty) {
          const stepKeyToAdd = previousStepKey;
          this.modifiedSteps.update((set) => {
            const newSet = new Set(set);
            newSet.add(stepKeyToAdd);
            return newSet;
          });
        }
      }

      previousStepKey = currentStepKey;

      // Reset action index if previous steps were modified
      // Reset to first visible action (index 0 in visibleNextActions array)
      if (currentStepKey && this.shouldResetActionIndex(currentStepKey)) {
        this.currentActionIndices.update((map) => {
          const newMap = new Map(map);
          newMap.set(currentStepKey, 0);
          return newMap;
        });
      }
    });

    this.updateResponsiveState();
    fromEvent(this.window, 'resize')
      .pipe(debounceTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.updateResponsiveState());
  }

  private updateResponsiveState(): void {
    const width = this.window.innerWidth;

    if (width < 768) {
      this.stepperOrientation.set('horizontal');
      this.isExpanded.set(false);
    } else if (width < 992) {
      this.stepperOrientation.set('vertical');
      this.isExpanded.set(false);
    } else {
      this.stepperOrientation.set('vertical');
      this.isExpanded.set(true);
    }
  }

  handleStepChange(index: number) {
    const visible = this.visibleSteps();
    const targetStep = visible[index];
    if (!targetStep) return;

    const currentIndex = this.currentStepIndex();

    if (index < currentIndex) {
      this.currentStep.set(targetStep.key);
      return;
    }

    if (index === currentIndex) {
      return;
    }

    if (index > currentIndex) {
      let canNavigate = true;
      for (let i = currentIndex; i < index; i++) {
        const step = visible[i];
        const stepForm = this.formGroup().get(step.key);

        if (stepForm && !stepForm.valid) {
          canNavigate = false;
          break;
        }

        if (step.validator && !step.validator()) {
          canNavigate = false;
          break;
        }
      }

      if (canNavigate) {
        this.currentStep.set(targetStep.key);
      }
    }
  }

  back() {
    if (this.canGoBack()) {
      const visible = this.visibleSteps();
      const newIndex = this.currentStepIndex() - 1;
      if (visible[newIndex]) {
        this.currentStep.set(visible[newIndex].key);
      }
    }
  }

  next() {
    this.validateCurrentStep();

    if (!this.canGoNext() || this.isNextActionLoading()) return;

    const step = this.activeStep();
    if (!step) return;

    // Handle sequential nextActions
    if (step.nextActions && step.nextActions.length > 0) {
      const visibleActions = this.visibleNextActions(step.key)();
      const currentActionIndex = this.currentActionIndices().get(step.key) ?? 0;
      const currentAction = visibleActions[currentActionIndex];
      const isLastAction = currentActionIndex === visibleActions.length - 1;

      if (currentAction?.action) {
        // Execute action callback
        this.isNextActionLoading.set(true);

        currentAction
          .action()
          .pipe(
            catchError(() => of(false)),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe((shouldProceed: boolean) => {
            this.isNextActionLoading.set(false);

            if (shouldProceed) {
              // Re-evaluate visible actions as they might have changed during the action
              const newVisibleActions = this.visibleNextActions(step.key)();
              const stillVisibleIndex = newVisibleActions.indexOf(currentAction);

              if (stillVisibleIndex !== -1) {
                // Action is still visible
                if (stillVisibleIndex === newVisibleActions.length - 1) {
                  this.proceedToNext();
                } else {
                  this.setActionIndex(step.key, stillVisibleIndex + 1);
                }
              } else {
                // Action is no longer visible (it was hidden by the action itself)
                // We check if the current index is still within bounds of the new list
                if (currentActionIndex < newVisibleActions.length) {
                  // Stay at the current index, which now points to the next action
                  // No need to update index, but we might want to ensure the UI reflects this
                  // (The computed properties will update automatically based on the new visible actions)
                } else {
                  // We ran out of actions, proceed to next step
                  this.proceedToNext();
                }
              }
            }
            // On failure, stay on current action (user can retry)
          });
      } else {
        // No action callback - just advance or navigate
        if (isLastAction) {
          // Last action - navigate to next step
          this.proceedToNext();
        } else {
          // Advance to next action in visible actions array
          this.setActionIndex(step.key, currentActionIndex + 1);
        }
      }
    } else {
      // No nextActions - default behavior
      this.proceedToNext();
    }
  }

  private setActionIndex(stepKey: string, index: number) {
    this.currentActionIndices.update((map) => {
      const newMap = new Map(map);
      newMap.set(stepKey, index);
      return newMap;
    });
  }

  private proceedToNext() {
    if (this.isLastStep()) {
      this.submitForm.emit();
    } else {
      const visible = this.visibleSteps();
      const newIndex = this.currentStepIndex() + 1;
      if (visible[newIndex]) {
        this.currentStep.set(visible[newIndex].key);
      }
    }
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);
  }

  private validateCurrentStep(): void {
    const step = this.activeStep();
    if (step?.key) {
      const stepForm = this.formGroup().get(step.key);
      if (stepForm) {
        // Mark all controls as touched to trigger validation
        this.markFormGroupTouched(stepForm);
      }
    }
  }

  private markFormGroupTouched(formGroup: AbstractControl): void {
    if (formGroup instanceof FormGroup) {
      Object.keys(formGroup.controls).forEach((key) => {
        const control = formGroup.get(key);
        if (control) {
          this.markFormGroupTouched(control);
        }
      });
    } else if (formGroup instanceof FormArray) {
      formGroup.controls.forEach((control) => {
        this.markFormGroupTouched(control);
      });
    } else {
      formGroup.markAsTouched();
    }
  }

  private isStepComplete(stepKey: string): boolean {
    const currentIndex = this.currentStepIndex();
    const visible = this.visibleSteps();
    const stepIndex = visible.findIndex((s) => s.key === stepKey);

    if (stepIndex < 0 || stepIndex >= currentIndex) return false;

    const stepForm = this.formGroup().get(stepKey);
    return stepForm?.valid && stepForm?.touched ? true : false;
  }

  private shouldResetActionIndex(_stepKey: string): boolean {
    const currentStepIndex = this.currentStepIndex();
    const modifiedStepsSet = this.modifiedSteps();
    const visible = this.visibleSteps();

    // Check if any previous visible step (indices < current) was modified
    for (let i = 0; i < currentStepIndex; i++) {
      const previousStep = visible[i];
      if (previousStep.key && modifiedStepsSet.has(previousStep.key)) {
        return true;
      }
    }

    return false;
  }
}
