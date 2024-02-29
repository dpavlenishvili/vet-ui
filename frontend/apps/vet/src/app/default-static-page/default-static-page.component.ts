import { Component, Input, OnInit } from '@angular/core';
import { Page } from '@vet/backend';

@Component({
    selector: 'app-default-static-page',
    template: `
        <h1>Default Static Page</h1>
        <p>This is the default static page.</p>
    `,
    standalone: true,
})
export class DefaultStaticPageComponent implements OnInit {
    @Input({ required: true }) page!: Page;

    ngOnInit() {
        console.log(this.page);
    }
}
