/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import '@progress/kendo-angular-intl/locales/ka/all';
import '@progress/kendo-angular-intl/locales/en/all';

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
