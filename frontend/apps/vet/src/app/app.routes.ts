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
                redirectTo: 'home',
                pathMatch: 'full',
            },
            {
                path: 'home',
                loadChildren: () => import('@vet/features/home'),
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
    {
        path: 'pages',
        component: MainLayoutComponent,
        children: [],
    },
];
