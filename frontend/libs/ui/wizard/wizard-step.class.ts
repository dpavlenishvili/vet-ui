import { EventEmitter, Signal, TemplateRef, WritableSignal } from '@angular/core';

export interface WizardStepContentContext {
    title?: string;
    titleTemplateRef?: TemplateRef<WizardStepTitleContext>;
    isValid: Signal<boolean>;
    active: boolean;
    goTo: (step: WizardStepId) => void;
    next: () => void;
    previous: () => void;
}

export interface WizardStepFooterContext {
    isValid: Signal<boolean>;
    active: boolean;
    goTo: (step: WizardStepId) => void;
    next: () => void;
    previous: () => void;
}

export interface WizardStepTitleContext {
    index: number;
    active: boolean;
}

export type WizardStepId = string | number | symbol;

export abstract class WizardStep {
    /** Wizard item identifier. Should be unique for the wizard instance */
    abstract id: WizardStepId;

    /** Title for the step */
    abstract title: string;

    /** Template for the step's title */
    abstract titleTemplateRef?: TemplateRef<WizardStepTitleContext>;

    /** Content for the step */
    abstract templateRef: TemplateRef<WizardStepContentContext>;

    /** Template for the step's footer */
    abstract footerTemplateRef: TemplateRef<WizardStepFooterContext>;

    /** Whether the step is disabled */
    abstract disabled?: boolean;

    /** Whether the step is valid and navigation to the next step is allowed */
    abstract isValid: WritableSignal<boolean>;

    /** Whether the step is active */
    abstract active: boolean;

    /** Event emitted when the step is activated */
    abstract activated: EventEmitter<void>;

    /** Event emitted when the step is deactivated */
    abstract deactivated: EventEmitter<void>;
}
