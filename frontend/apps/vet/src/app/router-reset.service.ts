import { inject, Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Page, PagesData } from '@vet/shared/interfaces';
import { MainLayoutComponent } from './main-layout.component';

@Injectable({ providedIn: 'root' })
export class RouterResetService {
    private router = inject(Router);
    private routes: Routes = [];

    resetRouterConfig(pagesData: PagesData) {
        pagesData.data.forEach((page) => {
            this.getRoutes(page);
        });

        this.router.resetConfig([
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
                    ...this.routes,
                ],
            },
        ]);
    }

    getRoutes(page: Page) {
        if (page.children.length > 0) {
            page.children.forEach((childPage) => {
                this.getRoutes(childPage);
            });
        }

        // TODO temporary implementation
        this.routes.push({ path: `${page.slug}`, loadChildren: () => import('@vet/features/registration') });
    }
}
