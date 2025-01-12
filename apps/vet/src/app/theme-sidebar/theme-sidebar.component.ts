import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { ThemeName, ThemeService } from '@vet/shared';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-theme-sidebar',
  standalone: true,
  imports: [KENDO_ICONS],
  templateUrl: './theme-sidebar.component.html',
  styleUrl: './theme-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSidebarComponent implements OnInit {
  open = input(false);
  currentTheme: ThemeName = 'default-theme';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.currentTheme = this.themeService.getCurrentTheme();
  }

  onThemeChange(event: Event): void {
    const selectEl = event.target as HTMLSelectElement;
    const theme = selectEl.value as ThemeName;
    this.themeService.setTheme(theme);
    this.currentTheme = theme;
  }

  zoomIn(): void {
    this.themeService.adjustFontSize('zoomIn');
  }

  zoomOut(): void {
    this.themeService.adjustFontSize('zoomOut');
  }
}
