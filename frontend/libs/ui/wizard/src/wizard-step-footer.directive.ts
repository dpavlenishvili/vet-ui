import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { WizardStepFooterContext } from './wizard-step.class';

@Directive({
    selector: '[vUiWizardStepFooter]',
    standalone: true,
})
export class WizardStepFooterDirective {
    constructor(
        readonly templateRef: TemplateRef<WizardStepFooterContext>,
        protected viewContainerRef: ViewContainerRef,
    ) {}

    static ngTemplateContextGuard(dir: WizardStepFooterDirective, ctx: unknown): ctx is WizardStepFooterContext {
        return true;
    }
}
