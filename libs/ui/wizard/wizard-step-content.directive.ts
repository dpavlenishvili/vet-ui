import { Directive, TemplateRef } from '@angular/core';
import { WizardStepContentContext } from './wizard-step.class';

@Directive({
    selector: '[vUiWizardStepContent]',
    standalone: true,
})
export class WizardStepContentDirective {
    constructor(readonly templateRef: TemplateRef<WizardStepContentContext>) {}

    static ngTemplateContextGuard(dir: WizardStepContentDirective, ctx: unknown): ctx is WizardStepContentContext {
        return true;
    }
}
