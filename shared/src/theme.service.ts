import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly rootElement: HTMLElement;
  private readonly themeKey = 'preferred-theme';
  private readonly storage = inject(WA_LOCAL_STORAGE);


  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const _document = inject(WA_WINDOW).document;
    this.rootElement = _document.documentElement;
    this.initTheme();
  }

  
  private initTheme(): void {
    const storedTheme = this.storage.getItem(this.themeKey);
    if (storedTheme) {
      this.setTheme(storedTheme as ThemeName);
    }
  }

  
  getCurrentTheme(): ThemeName {
    return (this.storage.getItem(this.themeKey) as ThemeName) || 'default-theme';
  }

  
  setTheme(theme: ThemeName): void {
    this.clearTheme();
    if (theme !== 'default-theme') {
      this.renderer.addClass(this.rootElement, theme);
      this.removeHomePageStyle();
    }
    this.storage.setItem(this.themeKey, theme);
  }

  
  applyHomePageStyle(): void {
    this.renderer.addClass(this.rootElement, 'home-page');
  }

  
  removeHomePageStyle(): void {
    this.renderer.removeClass(this.rootElement, 'home-page');
  }

  
  adjustFontSize(action: 'zoomIn' | 'zoomOut'): void {
    const currentFontSize = parseFloat(getComputedStyle(this.rootElement).fontSize);

    const step = 2; 
    const newFontSize = action === 'zoomIn' ? currentFontSize + step : currentFontSize - step;

    if (newFontSize >= 16 && newFontSize <= 64) {
      this.renderer.setStyle(this.rootElement, 'font-size', `${newFontSize}px`);
    }
  }

  
  private clearTheme(): void {
    const themes: ThemeName[] = ['theme-v1', 'theme-v2', 'theme-v3'];
    themes.forEach((theme) => this.renderer.removeClass(this.rootElement, theme));
  }
}

export type ThemeName = 'default-theme' | 'theme-v1' | 'theme-v2' | 'theme-v3';
