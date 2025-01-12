import { loadTranslations } from './load-translations';

const availableLanguages = ['ka', 'en'] as const;

const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object') {
      return { ...acc, ...flattenObject(value, fullKey) };
    }
    return { ...acc, [fullKey]: value };
  }, {});
};

describe('loadTranslations', () => {
  it.each(availableLanguages)('should load translations for %s', async (lang) => {
    const translations = await loadTranslations(lang);
    expect(translations).toBeDefined();
  });
  it('should have equal keys', async () => {
    const translations = await Promise.all(availableLanguages.map(loadTranslations));
    const translationKeys = translations.reduce(
      (acc: Partial<Record<(typeof availableLanguages)[number], string[]>>, t, index) => {
        const flatObj = flattenObject(t);
        const lang = availableLanguages[index];
        acc[lang] = Object.keys(flatObj);
        return acc;
      },
      {},
    );
    // Compare every language keys with the every other language keys and expect them to exist in both
    for (const lang of availableLanguages) {
      const keys = new Set(translationKeys[lang] || []);
      const otherLanguages = availableLanguages.filter((l) => l !== lang);
      for (const otherLang of otherLanguages) {
        const otherKeys = new Set(translationKeys[otherLang] || []);
        const missingKeys = [];

        for (const key of keys) {
          if (!otherKeys.has(key)) {
            missingKeys.push(key);
          }
        }
        if (missingKeys.length) {
          console.error(`Missing keys of '${lang}' in '${otherLang}':`, missingKeys);
        }
        expect(missingKeys.length).toEqual(0);
      }
    }
  });
});
