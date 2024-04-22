import { Component, Input, ViewEncapsulation } from '@angular/core';

export enum ServiceCardColor {
    BLUE = 'blue',
    YELLOW = 'yellow',
    GREEN = 'green',
    PINK = 'pink',
}

@Component({
    selector: 'v-ui-services-card',
    standalone: true,
    template: ` <ng-content></ng-content> `,
    styleUrls: ['./services-card.component.scss'],
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        '[class.v-ui-services-card]': 'true',
        '[class.v-ui-services-card__blue]': 'cardColor === "blue"',
        '[class.v-ui-services-card__yellow]': 'cardColor === "yellow"',
        '[class.v-ui-services-card__green]': 'cardColor === "green"',
        '[class.v-ui-services-card__pink]': 'cardColor === "pink"',
    },
    encapsulation: ViewEncapsulation.None,
    imports: [],
})
export class ServicesCardComponent {
    @Input() cardColor: 'blue' | 'yellow' | 'green' | 'pink' = 'blue';
}
