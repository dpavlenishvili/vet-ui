import { inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { WA_LOCAL_STORAGE, WA_WINDOW } from '@ng-web-apis/common';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly rootElement: HTMLElement;
  private readonly themeKey = 'preferred-theme';
  private readonly storage = inject(WA_LOCAL_STORAGE);
  private router = inject(Router);

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    const _document = inject(WA_WINDOW).document;
    this.rootElement = _document.documentElement;
    this.initTheme();
  }

  /**
   * Initialize the theme from Local Storage (if present)
   */
  private initTheme(): void {
    const storedTheme = this.storage.getItem(this.themeKey);
    if (storedTheme) {
      this.setTheme(storedTheme as ThemeName);
    }
  }

  /**
   * Returns the current theme name (from Local Storage or fallback).
   */
  getCurrentTheme(): ThemeName {
    return (this.storage.getItem(this.themeKey) as ThemeName) || 'default-theme';
  }

  /**
   * Set or switch the theme using Renderer2
   */
  setTheme(theme: ThemeName): void {
    this.clearTheme();
    if (theme !== 'default-theme') {
      this.renderer.addClass(this.rootElement, theme);
      this.removeHomePageStyle();
    }
    this.storage.setItem(this.themeKey, theme);
  }

  /**
   * Restore Home Page Background using Renderer2
   */
  applyHomePageStyle(): void {
    this.renderer.addClass(this.rootElement, 'home-page');
  }

  /**
   * Remove Home Page Styling using Renderer2
   */
  removeHomePageStyle(): void {
    this.renderer.removeClass(this.rootElement, 'home-page');
  }

  /**
   * Increase or decrease global font size
   */
  adjustFontSize(action: 'zoomIn' | 'zoomOut'): void {
    const currentFontSize = parseFloat(getComputedStyle(this.rootElement).fontSize);

    const step = 2; // how many px to step up/down
    const newFontSize = action === 'zoomIn' ? currentFontSize + step : currentFontSize - step;

    if (newFontSize >= 16 && newFontSize <= 64) {
      this.renderer.setStyle(this.rootElement, 'font-size', `${newFontSize}px`);
    }
  }

  /**
   * Remove any existing theme classes from the root element
   */
  private clearTheme(): void {
    const themes: ThemeName[] = ['theme-v1', 'theme-v2', 'theme-v3'];
    themes.forEach((theme) => this.renderer.removeClass(this.rootElement, theme));
  }

  /**
   * Check if the current route is Home Page
   */
  private isHomePage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/' || currentUrl === '/home';
  }
}

export type ThemeName = 'default-theme' | 'theme-v1' | 'theme-v2' | 'theme-v3';
