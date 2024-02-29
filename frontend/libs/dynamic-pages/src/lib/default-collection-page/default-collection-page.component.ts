import { Component, Input, OnInit } from '@angular/core';
import { ApplicationPage } from '../application-pages.service';

@Component({
    selector: 'vet-collection-page',
    template: ``,
    standalone: true,
})
export class DefaultCollectionPageComponent implements OnInit {
    @Input({ required: true }) page!: ApplicationPage;

    ngOnInit() {
        console.log(this.page);
    }
}
