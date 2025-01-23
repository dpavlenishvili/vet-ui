import { ChangeDetectionStrategy, Component, input, type OnInit } from '@angular/core';
import { type ThemeName, ThemeService } from '@vet/shared';

@Component({
  selector: 'vet-theme-sidebar',
  standalone: true,
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
