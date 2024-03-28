import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./lib/features-home/features-home.component').then((m) => m.FeaturesHomeComponent),
    },
];

export default routes;
