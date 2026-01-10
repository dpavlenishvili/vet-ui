import { AfterViewInit, ChangeDetectionStrategy, Component, inject, input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'vet-map',
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements AfterViewInit {
  latitude = input.required<number | null | undefined>();
  longitude = input.required<number | null | undefined>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private map: any;
  private platformId = inject(PLATFORM_ID);

  async ngAfterViewInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');

      const coordinates: [number, number] = [Number(this.latitude()), Number(this.longitude())];

      this.map = L.map('map').setView(coordinates, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(this.map);

      L.marker(coordinates).addTo(this.map);

      // Optional: if we need popup on pin in future
      // const marker = L.marker(coordinates).addTo(this.map);
      // marker.bindPopup('popup content');
    }
  }
}
