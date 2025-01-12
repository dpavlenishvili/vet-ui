import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly rootElement: HTMLElement;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.rootElement = document.documentElement;
  }

  setTheme(theme: 'default-theme' | 'theme-v1' | 'theme-v2' | 'theme-v3'): void {
    this.clearTheme();
    if (theme !== 'default-theme') {
      this.renderer.addClass(this.rootElement, theme);
    }
  }

  adjustFontSize(action: 'zoomIn' | 'zoomOut'): void {
    const currentFontSize = parseFloat(getComputedStyle(this.rootElement).getPropertyValue('--font-size')) || 16;
    const newFontSize = action === 'zoomIn' ? currentFontSize + 2 : currentFontSize - 2;
    if (newFontSize >= 12 && newFontSize <= 32) {
      this.renderer.setStyle(this.rootElement, '--font-size', `${newFontSize}px`);
    }
  }

  private clearTheme(): void {
    const themes = ['theme-v1', 'theme-v2', 'theme-v3'];
    themes.forEach((theme) => this.renderer.removeClass(this.rootElement, theme));
  }
}
