import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
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
