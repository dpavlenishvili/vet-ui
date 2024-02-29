import { Component, Input, OnInit } from '@angular/core';
import { Page } from '@vet/backend';

@Component({
    selector: 'app-collection-page',
    template: ``,
    standalone: true,
})
export class DefaultCollectionPageComponent implements OnInit {
    @Input({ required: true }) page!: Page;

    ngOnInit() {
        console.log(this.page);
    }
}
