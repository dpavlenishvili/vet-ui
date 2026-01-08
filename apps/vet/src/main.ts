/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import * as Sentry from "@sentry/angular";
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import '@progress/kendo-angular-intl/locales/ka/all';
import '@progress/kendo-angular-intl/locales/en/all';
import {environment} from "./environments/environment";

Sentry.init({
  dsn: "https://511d3fb1b636fdb722033dff565fc0ec@sentry.emis.ge/59",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.captureConsoleIntegration(),
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.globalHandlersIntegration()
  ],
  environment: environment.production ? 'production' : 'development',
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
