import { Component, Input, OnInit } from '@angular/core';
import { ApplicationPage } from '../application-pages.service';

@Component({
    selector: 'vet-default-static-page',
    template: `
        <h1>Default Static Page</h1>
        <p>This is the default static page.</p>
    `,
    standalone: true,
})
export class DefaultStaticPageComponent implements OnInit {
    @Input({ required: true }) page!: ApplicationPage;

    ngOnInit() {
        console.log(this.page);
    }
}
