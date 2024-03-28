import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { SliderComponent } from '@vet/ui/slider';
import { ServiceCardColor, ServicesCardComponent } from '@vet/ui/card';
import {
    COLLEGE_EMPLOYMENT,
    NATIONAL_LANGUAGE_PREPARATION,
    NON_FORMAL_EDUCATION,
    ORIENTATING_SERVICE,
    PROFESSIONAL_PROGRAMS,
    TEACHERS_RETRAINING,
    TRAINING_RETRAINING,
} from '@vet/shared';
import { RouterLink } from '@angular/router';
import { MainSliderItemComponent } from '../main-slider/main-slider-item/main-slider-item.component';
import { MainSliderComponent } from '../main-slider/main-slider.component';
import { CollectionItem, CollectionService } from '@vet/backend';
import { map } from 'rxjs';

@Component({
    selector: 'lib-features-home',
    standalone: true,
    imports: [
        CommonModule,
        SliderComponent,
        SvgIconComponent,
        MainSliderItemComponent,
        MainSliderComponent,
        ServicesCardComponent,
        RouterLink,
    ],
    templateUrl: './features-home.component.html',
    styleUrl: './features-home.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class FeaturesHomeComponent implements OnInit {
    private collectionService = inject(CollectionService);

    posts: CollectionItem[] | undefined = [];

    serviceCards = [
        {
            title: 'პროფესიული პროგრამები',
            icon: PROFESSIONAL_PROGRAMS,
            color: ServiceCardColor.BLUE,
            link: '/authentication',
        },
        {
            title: 'მომზადება/გადამზადების პროგრამები',
            icon: TRAINING_RETRAINING,
            color: ServiceCardColor.YELLOW,
            link: '',
        },
        {
            title: 'არაფორმალური განათლების აღიარება',
            icon: NON_FORMAL_EDUCATION,
            color: ServiceCardColor.GREEN,
            link: '',
        },
        {
            title: 'საორიენტაციო სერვისი',
            icon: ORIENTATING_SERVICE,
            color: ServiceCardColor.PINK,
            link: '',
        },
        {
            title: 'სახელმწიფო ენის მომზადების პროგრამები',
            icon: NATIONAL_LANGUAGE_PREPARATION,
            color: ServiceCardColor.PINK,
            link: '',
        },
        {
            title: 'მასწავლებელთა გადამზადების პროგრამები',
            icon: TEACHERS_RETRAINING,
            color: ServiceCardColor.YELLOW,
            link: '',
        },
        {
            title: 'კოლეჯში დასაქმება',
            icon: COLLEGE_EMPLOYMENT,
            color: ServiceCardColor.BLUE,
            link: '',
        },
    ];

    ngOnInit() {
        this.collectionService
            .collectionsItems(6)
            .pipe(
                map((res) => {
                    res.data?.forEach((res) => {
                        res.image = 'https://dev-api-vet.emis.ge/uploads/' + res.image;
                    });

                    return res;
                }),
            )
            .subscribe((res) => {
                this.posts = res.data;
            });
    }
}
