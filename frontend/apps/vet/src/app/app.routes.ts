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
                redirectTo: 'registration',
                pathMatch: 'full',
            },
            {
                path: 'registration',
                loadChildren: () => import('@vet/features/registration'),
            },
        ],
    },
];
