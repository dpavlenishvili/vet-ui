import { NgZone, Provider } from '@angular/core';
import { CldrIntlService, IntlService } from '@progress/kendo-angular-intl';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from '@progress/kendo-angular-l10n';

interface LanguageMappings {
  readonly locale: Record<string, string>;
  readonly shortCode: Record<string, string>;
}

interface DateInputsConfig {
  readonly calendar: {
    readonly type: string;
    readonly bottomView: string;
    readonly topView: string;
  };
  readonly dateInput: { readonly format: string };
  readonly datePicker: { readonly format: string };
  readonly dateTimePicker: { readonly format: string };
  readonly dateRangePicker: { readonly format: string };
  readonly timePicker: { readonly format: string };
}

type TranslationSet = Record<string, string>;

const DATE_FORMAT = 'dd/MM/yyyy';
const TIME_FORMAT = 'HH:mm';
const DATETIME_FORMAT = `${DATE_FORMAT} ${TIME_FORMAT}`;

const LANGUAGE_MAPPINGS: LanguageMappings = {
  locale: {
    ka: 'ka-GE',
    en: 'en-US',
  },
  shortCode: {
    ka: 'ka',
    en: 'en',
  },
};

const DATE_INPUTS_CONFIG: DateInputsConfig = {
  calendar: {
    type: 'classic',
    bottomView: 'month',
    topView: 'month',
  },
  dateInput: { format: DATE_FORMAT },
  datePicker: { format: DATE_FORMAT },
  dateTimePicker: { format: DATETIME_FORMAT },
  dateRangePicker: { format: DATE_FORMAT },
  timePicker: { format: TIME_FORMAT },
};

const TRANSLATIONS: Record<string, TranslationSet> = {
  ka: {
    'kendo.calendar.today': 'დღევანდელი',
    'kendo.datepicker.toggle': 'კალენდრის გადართვა',
    'kendo.datepicker.today': 'დღევანდელი',
    'kendo.dateinput.placeholder': 'დღე.თვე.წელი',
    'kendo.dateinput.today': 'დღევანდელი',
    'kendo.datetimepicker.placeholder': 'დღე.თვე.წელი HH:mm',
    'kendo.datetimepicker.date': 'თარიღი',
    'kendo.datetimepicker.time': 'დრო',
    'kendo.datetimepicker.today': 'დღევანდელი',
  },
  en: {
    'kendo.calendar.today': 'Today',
    'kendo.datepicker.toggle': 'Toggle Calendar',
    'kendo.datepicker.today': 'Today',
    'kendo.dateinput.placeholder': 'dd/mm/yyyy',
    'kendo.dateinput.today': 'Today',
    'kendo.datetimepicker.placeholder': 'dd/mm/yyyy HH:mm',
    'kendo.datetimepicker.date': 'Date',
    'kendo.datetimepicker.time': 'Time',
    'kendo.datetimepicker.today': 'Today',
  },
};

function getLanguageCode(lang: string): string {
  return lang === 'ka' ? 'ka' : 'en';
}

function getLocale(lang: string): string {
  const langCode = getLanguageCode(lang);
  return LANGUAGE_MAPPINGS.locale[langCode];
}

function createIntlServiceProvider(): Provider {
  return {
    provide: IntlService,
    useFactory: (translocoService: TranslocoService, zone: NgZone) => {
      const initialLang = translocoService.getActiveLang();
      const intlService = new CldrIntlService(getLocale(initialLang));

      translocoService.langChanges$.subscribe((lang) => {
        zone.run(() => {
          const newService = new CldrIntlService(getLocale(lang));
          updateIntlServiceProperties(intlService, newService);
          intlService.notify();
        });
      });

      return intlService;
    },
    deps: [TranslocoService, NgZone],
  };
}

function updateIntlServiceProperties(target: CldrIntlService, source: CldrIntlService): void {
  Object.getOwnPropertyNames(source)
    .filter((prop) => prop !== 'changes')
    .forEach((prop) => {
      const descriptor = Object.getOwnPropertyDescriptor(source, prop);
      if (descriptor && !descriptor.configurable) {
        return;
      }

      Object.defineProperty(target, prop, {
        value: source[prop as keyof typeof source],
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });
}

function createMessageServiceProvider(): Provider {
  return {
    provide: MessageService,
    useFactory: (translocoService: TranslocoService, zone: NgZone) => {
      const service = new MessageService();
      const originalGet = service.get.bind(service);
      let currentLang = getLanguageCode(translocoService.getActiveLang());

      service.get = (key: string): string => {
        const translations = TRANSLATIONS[currentLang] || {};
        const translation = translations[key];
        return translation !== undefined ? translation : originalGet(key) || '';
      };

      translocoService.langChanges$.subscribe((lang) => {
        zone.run(() => {
          currentLang = getLanguageCode(lang);
          service.notify();
        });
      });

      return service;
    },
    deps: [TranslocoService, NgZone],
  };
}

function createDateConfigProvider(): Provider {
  return {
    provide: 'KENDO_DATE_PICKER_FORMAT',
    useFactory: () => {
      return {
        format: DATE_FORMAT,
        calendarType: 'classic',
      };
    },
  };
}

export function provideKendoDateSettings(): Provider[] {
  return [
    createIntlServiceProvider(),
    createMessageServiceProvider(),
    createDateConfigProvider(),
  ];
}
