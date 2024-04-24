import { Directive, effect, EmbeddedViewRef, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthenticationService } from '@vet/authentication';

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
    protected templateRef = inject(TemplateRef);
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
        if (!this.embeddedView) {
            this.viewContainerRef.clear();
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
