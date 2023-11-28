import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChildren,
    inject,
    Input,
    QueryList,
    signal,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStep, WizardStepContentContext, WizardStepFooterContext, WizardStepId } from '../wizard-step.class';
import { map, startWith } from 'rxjs';

@Component({
    selector: 'v-ui-wizard',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./wizard.component.scss'],
    template: `
        <ul class="v-ui-wizard__list">
            <ng-container *ngFor="let step of steps; let index = index; let last = last">
                <li
                    class="v-ui-wizard__list-item"
                    [class.v-ui-wizard__list-item--active]="step.active"
                    [class.v-ui-wizard__list-item--disabled]="step.disabled"
                    role="link"
                    (click)="activateItem(step.id)"
                >
                    <ng-container *ngIf="step.title">
                        <span class="v-ui-wizard__list-item-index" role="presentation">
                            {{ index + 1 }}
                        </span>
                        {{ step.title }}
                    </ng-container>
                    <ng-container *ngIf="step.titleTemplateRef">
                        <ng-template
                            [ngTemplateOutlet]="step.titleTemplateRef"
                            [ngTemplateOutletContext]="{ active: step.active, index: index }"
                        >
                        </ng-template>
                    </ng-container>
                </li>
                <li *ngIf="!last" class="v-ui-wizard__list-item-separator" aria-hidden="true"></li>
            </ng-container>
        </ul>
        <section class="v-ui-wizard__step">
            <ng-container *ngIf="activeStep() as step">
                <div class="v-ui-wizard__step-content">
                    <ng-template [ngTemplateOutlet]="step.templateRef" [ngTemplateOutletContext]="stepContext(step)">
                    </ng-template>
                </div>
                <div class="v-ui-wizard__step-footer">
                    <ng-template
                        [ngTemplateOutlet]="step.footerTemplateRef"
                        [ngTemplateOutletContext]="footerContext(step)"
                    ></ng-template>
                </div>
            </ng-container>
        </section>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '[class.v-ui-wizard]': 'true',
        '[class.v-ui-wizard--horizontal]': 'horizontal',
    },
    encapsulation: ViewEncapsulation.None,
})
export class WizardComponent implements AfterViewInit {
    @Input()
    horizontal = false;

    @ContentChildren(WizardStep)
    steps!: QueryList<WizardStep>;

    activeStep = signal<WizardStep | null>(null);

    protected _cdr = inject(ChangeDetectorRef);

    constructor() {
        this.activateItem = this.activateItem.bind(this);
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
    }

    ngAfterViewInit() {
        this.steps.changes
            .pipe(
                startWith(this.steps),
                map((steps: QueryList<WizardStep>) => steps.toArray()),
            )
            .subscribe((steps: WizardStep[]) => {
                // Check if all the ids are unique and warn if not
                const ids = steps.map((step) => step.id);
                const uniqueIds = new Set(ids);
                if (ids.length !== uniqueIds.size) {
                    console.warn('Wizard steps should have unique ids');
                }

                // Activate first step if no step is active
                const activeStep = steps.find((step) => step.active);
                if (!activeStep) {
                    this.activateItem(steps[0].id);
                } else {
                    this.activateItem(activeStep.id);
                }
                this._cdr.detectChanges();
            });
    }

    activateItem(stepId: WizardStepId) {
        const currentActiveStep = this.activeStep();
        const step = this.steps.find(({ id }) => id === stepId);
        if (step && step.isValid() && !step.disabled) {
            this.steps.forEach((s) => (s.active = false));
            step.active = true;
            this.activeStep.set(step);
            if (currentActiveStep) {
                currentActiveStep.deactivated.emit();
            }
            step.activated.emit();
        }
    }

    next() {
        const index = this.steps.toArray().findIndex(({ id }) => id === this.activeStep()?.id);
        if (index !== -1) {
            const nextStep = this.steps.toArray()[index + 1];
            nextStep && this.activateItem(nextStep.id);
        }
    }

    previous() {
        const index = this.steps.toArray().findIndex(({ id }) => id === this.activeStep()?.id);
        if (index !== -1) {
            const prevStep = this.steps.toArray()[index - 1];
            prevStep && this.activateItem(prevStep.id);
        }
    }

    stepContext(step: WizardStep): WizardStepContentContext {
        return {
            ...step,
            goTo: this.activateItem,
            next: this.next,
            previous: this.previous,
        };
    }

    footerContext(step: WizardStep): WizardStepFooterContext {
        return {
            ...step,
            goTo: this.activateItem,
            next: this.next,
            previous: this.previous,
        };
    }
}
