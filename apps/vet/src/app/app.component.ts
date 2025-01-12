import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogContainerDirective } from '@progress/kendo-angular-dialog';

@Component({
  imports: [RouterOutlet, DialogContainerDirective],
  selector: 'vet-root',
  template: ` <router-outlet></router-outlet>
    <div kendoDialogContainer></div>`,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent {}
