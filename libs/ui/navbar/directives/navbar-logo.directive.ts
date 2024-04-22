import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[vUiNavbarLogo]',
    standalone: true,
})
export class NavbarLogoDirective {
    constructor(
        protected viewContainerRef: ViewContainerRef,
        readonly templateRef: TemplateRef<void>,
    ) {}
}
