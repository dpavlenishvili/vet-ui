import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { authenticationRoutes } from '@vet/features/authentication';

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
                children: authenticationRoutes,
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
