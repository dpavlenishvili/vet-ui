import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemingService } from '@vet/theming';

@Component({
    standalone: true,
    imports: [RouterOutlet],
    selector: 'app-root',
    template: ` <router-outlet></router-outlet> `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
        `,
    ],
})
export class AppComponent {
    constructor(protected themingService: ThemingService) {}
}
