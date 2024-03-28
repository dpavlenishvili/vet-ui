import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    DestroyRef,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnDestroy,
    Output,
    PLATFORM_ID,
    QueryList,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { AbstractSliderItem } from './abstract-slider-item.class';
import { BehaviorSubject, combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { isPlatformBrowser, NgClass, NgTemplateOutlet } from '@angular/common';
import KeenSlider, { KeenSliderInstance, KeenSliderOptions } from 'keen-slider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractSliderClass } from './abstract-slider.class';

@Component({
    selector: 'v-ui-slider',
    templateUrl: './slider.component.html',
    styleUrls: ['./slider.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgTemplateOutlet, NgClass],
    providers: [
        {
            provide: AbstractSliderClass,
            useExisting: SliderComponent,
        },
    ],
})
export class SliderComponent implements AfterViewInit, OnDestroy, AbstractSliderClass {
    @ViewChild('sliderRef') sliderRef!: ElementRef<HTMLElement>;
    @ContentChildren(AbstractSliderItem) items!: QueryList<AbstractSliderItem>;

    slider!: KeenSliderInstance;

    @Input()
    sliderClass = '';

    @Input()
    set loop(v: boolean) {
        this.loop$.next(v);
    }

    @Input()
    set gap(v: number) {
        this.gap$.next(v);
    }

    @Input()
    set maxVisibleItems(v: number) {
        this.maxVisibleItems$.next(v);
    }

    @Input()
    set breakpoints(v: KeenSliderOptions['breakpoints']) {
        this.breakpoints$.next(v);
    }

    @Output()
    visibleItemChange = new EventEmitter<number>();

    private maxVisibleItems$ = new BehaviorSubject<number>(1);
    private breakpoints$ = new BehaviorSubject<KeenSliderOptions['breakpoints']>({});

    private gap$ = new BehaviorSubject<number>(16);
    private loop$ = new BehaviorSubject<boolean>(false);
    private destroyRef: DestroyRef = inject(DestroyRef);
    private platformId = inject(PLATFORM_ID);

    goToPrev = () => this.slider.prev();

    goToNext = () => this.slider.next();

    goToIndex = (i: number) => this.slider.moveToIdx(i);

    ngAfterViewInit() {
        combineLatest([
            this.maxVisibleItems$,
            this.loop$,
            this.breakpoints$,
            this.gap$,
            this.items.changes.pipe(
                startWith(this.items),
                map((items) => items.toArray()),
            ) as Observable<AbstractSliderItem[]>,
        ])
            .pipe(
                map(([maxVisibleItems, loop, breakpoints, gap, items]) => {
                    return {
                        origin: 'center',
                        loop,
                        slides: {
                            perView: maxVisibleItems,
                            spacing: gap,
                        },
                        breakpoints,
                        initial: (() => {
                            const activeIndex = items.findIndex((item) => item.active);
                            return activeIndex > -1 ? activeIndex + 1 : 0;
                        })(),
                    } as KeenSliderOptions;
                }),
                tap((options) => {
                    if (isPlatformBrowser(this.platformId)) {
                        if (this.slider) {
                            this.slider.update(options);
                        } else {
                            this.slider = new KeenSlider(this.sliderRef.nativeElement, options, [
                                (slider) => {
                                    slider.on('slideChanged', (e) => {
                                        return this.visibleItemChange.emit(e.track.details.rel);
                                    });
                                },
                            ]);
                        }
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    ngOnDestroy() {
        if (this.slider) this.slider.destroy();
    }
}
