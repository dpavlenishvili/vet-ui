import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[vUiNavbarLogo]',
  standalone: true,
})
export class NavbarLogoDirective {
  constructor(
    protected viewContainerRef: ViewContainerRef,
    readonly templateRef: TemplateRef<void>,
  ) {}
}
