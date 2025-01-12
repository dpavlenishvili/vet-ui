import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { concatMap, map, Observable, of } from 'rxjs';
import { Page, PagesService } from '@vet/backend';
import { TranslocoModule } from '@jsverse/transloco';
import { AsyncPipe } from "@angular/common";

@Component({
  selector: 'vet-home-services',
  imports: [SVGIconModule, TranslocoModule, AsyncPipe],
  templateUrl: './home-services.component.html',
  styleUrl: './home-services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeServicesComponent {
  kendoIcons = kendoIcons;
  services$: Observable<Page[]>;
  columnClasses = ['blue-card', 'red-card', 'yellow-card', 'green-card'];
  icons = [
    this.kendoIcons.accessibilityIcon,
    this.kendoIcons.alignSelfStretchAltIcon,
    this.kendoIcons.mapMarkerIcon,
    this.kendoIcons.calendarIcon,
    this.kendoIcons.cameraIcon,
    this.kendoIcons.heartIcon,
    this.kendoIcons.homeIcon,
    this.kendoIcons.starIcon,
  ];

  constructor(private pagesService: PagesService) {
    // this.services$ = this.pagesService
    //     .getPagesList()
    //     .pipe(map((pagesRes) => pagesRes.data?.find((page) => page.slug === 'servisebi')));

    this.services$ = this.pagesService.getPagesList().pipe(
      map((pagesRes) => pagesRes.data?.find((page) => page.slug === 'servisebi')),
      concatMap((page) => (page?.children?.length ? of(page.children) : of([]))),
      map((children) => {
        const repeatedChildren = [...children];
        while (repeatedChildren.length < 8) {
          repeatedChildren.push(...children);
        }
        return repeatedChildren.slice(0, 8);
      }),
    );
  }

  getColumnClass(index: number): string {
    return this.columnClasses[index % this.columnClasses.length];
  }

  getColumnIcon(index: number) {
    return this.icons[index % this.icons.length];
  }
}
