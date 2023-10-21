import { Component, ViewEncapsulation } from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
    standalone: true,
    imports: [
        RouterOutlet
    ],
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    template: `
        <router-outlet></router-outlet>
    `
})
export class AppComponent {}
