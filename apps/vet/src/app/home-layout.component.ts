import { Component } from '@angular/core';
import { MainLayoutComponent } from './main-layout.component';

@Component({
  selector: 'vet-home-layout',
  imports: [MainLayoutComponent],
  template: `
    <vet-main-layout [disablePadding]="true" />
  `,
  styles: [
    `
      :host {
        --main-bg: #FFFFFF;
      }
    `,
  ],
  standalone: true,
})
export class HomeLayoutComponent {
}
