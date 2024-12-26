import { Route } from '@angular/router';
import { ProgramsComponent } from './programs.component';
import { ProgramComponent } from './program/program.component';
import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const programsRoutes: Route[] = [
    {
        path: '',
        component: ProgramsComponent,
        pathMatch: 'full',
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/programs', text: 'shared.programs' },
        ]),
    },
    {
        path: ':programId',
        component: ProgramComponent,
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/programs', text: 'shared.programs' },
            { path: '/programs/123', text: 'shared.program' },
        ]),
    },
];
