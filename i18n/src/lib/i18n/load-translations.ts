import { Translation } from "@jsverse/transloco";

const translations: Record<'ka' | 'en', () => Promise<Translation>> = {
  ka: () => import('./ka.json') as Promise<Translation>,
  en: () => import('./en.json') as Promise<Translation>
};

export const loadTranslations = (lang: 'ka' | 'en') => translations[lang]();
