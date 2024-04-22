import { computed, inject, Injectable, RendererFactory2 } from '@angular/core';
import { LocalStorageService } from '@vet/shared';

const availableThemes = ['light', 'hc'] as const;
const defaultTheme = 'light';
const themeStorageKey = 'vet_theme';

export type Theme = (typeof availableThemes)[number];

@Injectable({
    providedIn: 'root',
})
export class ThemingService {
    protected _htmlTag = inject(RendererFactory2)
        .createRenderer(null, null)
        .selectRootElement('html', true) as HTMLElement;
    protected _localStorageService = inject(LocalStorageService);
    protected _currentTheme = this._localStorageService.getValueSignal<Theme>(themeStorageKey, defaultTheme);

    constructor() {
        this._localStorageService.preload(themeStorageKey);
        this.useTheme(this._currentTheme());
    }

    useTheme(theme: Theme) {
        if (!availableThemes.includes(theme)) {
            console.warn(`Theme ${theme} is not available. Using default theme.`);
            theme = defaultTheme;
        }
        this._htmlTag.setAttribute('data-theme', this._currentTheme());
        this._localStorageService.setValue(themeStorageKey, theme);
    }

    currentTheme = computed(() => this._currentTheme());
}
