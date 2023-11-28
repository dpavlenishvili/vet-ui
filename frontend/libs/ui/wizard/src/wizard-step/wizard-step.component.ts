import {
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    EventEmitter,
    Input,
    Output,
    signal,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    WizardStep,
    WizardStepContentContext,
    WizardStepFooterContext,
    WizardStepId,
    WizardStepTitleContext,
} from '../wizard-step.class';
import { WizardStepContentDirective } from '../wizard-step-content.directive';
import { WizardStepFooterDirective } from '../wizard-step-footer.directive';

@Component({
    selector: 'v-ui-wizard-step',
    standalone: true,
    imports: [CommonModule],
    template: `
        <ng-template #contentTemplate>
            <ng-content></ng-content>
        </ng-template>
        <ng-template #footerTemplate let-next="next">
            <ng-container *ngIf="isValid()">
                <div>
                    <button (click)="next()">Go to next step</button>
                </div>
            </ng-container>
        </ng-template>
    `,
    providers: [
        {
            provide: WizardStep,
            useExisting: WizardStepComponent,
        },
    ],
    styleUrls: ['./wizard-step.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class WizardStepComponent extends WizardStep {
    @Input({ required: true }) id!: WizardStepId;
    @Input() active = false;
    @Input() disabled = false;
    @Input() title = '';
    @Output()
    activated = new EventEmitter<void>();
    @Output()
    deactivated = new EventEmitter<void>();

    get templateRef(): TemplateRef<WizardStepContentContext> {
        if (this._contentDirective) {
            return this._contentDirective.templateRef;
        }
        return this._templateRef;
    }

    get footerTemplateRef(): TemplateRef<WizardStepContentContext> {
        if (this._footerDirective) {
            return this._footerDirective.templateRef;
        }
        return this._footerTemplateRef;
    }

    @ViewChild('contentTemplate')
    _templateRef!: TemplateRef<WizardStepContentContext>;

    @ViewChild('footerTemplate')
    _footerTemplateRef!: TemplateRef<WizardStepFooterContext>;

    @ContentChild(WizardStepContentDirective)
    _contentDirective?: WizardStepContentDirective;

    @ContentChild(WizardStepFooterDirective)
    _footerDirective?: WizardStepFooterDirective;

    isValid = signal<boolean>(true);
    titleTemplateRef?: TemplateRef<WizardStepTitleContext> | undefined;
}
