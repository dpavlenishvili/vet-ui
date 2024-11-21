import { Directive, effect, EmbeddedViewRef, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from './authentication.service';

/**
 * Directive to show or hide elements based on the authentication state of the user.
 */
@Directive({
    selector: '[vetAuthenticated]',
    standalone: true,
})
export class AuthenticatedDirective {
    @Input()
    vetAuthenticatedElse: TemplateRef<unknown> | undefined = undefined;

    // Inject TemplateRef optionally (use `null` if no template is present)
    protected templateRef: TemplateRef<unknown> | null = inject(TemplateRef, {
        optional: true,
    });
    protected viewContainerRef = inject(ViewContainerRef);
    protected authenticationService = inject(AuthenticationService);
    protected embeddedView?: EmbeddedViewRef<unknown>;
    protected elseViewRef?: EmbeddedViewRef<unknown>;

    constructor() {
        effect(() => {
            if (this.authenticationService.authenticated$()) {
                this.show();
            } else {
                this.hide();
            }
        });
    }

    show() {
        this.viewContainerRef.clear();
        if (this.templateRef) {
            this.embeddedView = this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
        this.elseViewRef?.destroy();
    }

    hide() {
        this.viewContainerRef.clear();
        this.embeddedView?.destroy();
        this.embeddedView = undefined;
        if (this.vetAuthenticatedElse) {
            this.elseViewRef = this.viewContainerRef.createEmbeddedView(this.vetAuthenticatedElse);
        }
    }
}
