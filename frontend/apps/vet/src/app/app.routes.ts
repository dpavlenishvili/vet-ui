import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

export const appRoutes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                // Temporary redirect to registration page
                path: '',
                redirectTo: 'authentication',
                pathMatch: 'full',
            },
            {
                path: 'authentication',
                loadChildren: () => import('@vet/features/authentication'),
            },
            {
                path: 'registration',
                loadChildren: () => import('@vet/features/registration'),
            },
        ],
    },
];
