import { Route } from '@angular/router';
import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const vacancyRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./vacancy.component').then((c) => c.VacancyComponent),
    children: [
      {
        path: 'vacancy-list',
        loadComponent: () => import('./pages/vacancy-list/vacancy-list.component').then((c) => c.VacancyListComponent),
        data: breadcrumb([...baseBreadcrumbItems, { path: null, text: 'vacancy.vacancy-list' }]),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('./pages/favorite-vacancies/favorite-vacancies.component').then((c) => c.FavoriteVacancyComponent),
        data: breadcrumb([...baseBreadcrumbItems, { path: null, text: 'vacancy.favorites' }]),
      },
      {
        path: 'add-vacancy',
        loadComponent: () => import('./pages/add-vacancy/add-vacancy.component').then((c) => c.AddVacancyComponent),
        data: breadcrumb([...baseBreadcrumbItems, { path: null, text: 'vacancy.add-vacancy' }]),
      },
      {
        path: 'details/:id',
        loadComponent: () =>
          import('./pages/vacancy-details/vacancy-details.component').then((c) => c.VacancyDetailsComponent),
        data: breadcrumb([...baseBreadcrumbItems, { path: null, text: 'vacancy.vacancy-details' }]),
      },
      // this pages are not ready for dev yet just component created
      // {
      //   path: 'my-applications',
      //   loadComponent: () => import('./pages/applications/applications.component').then((c) => c.ApplicationsComponent),
      // data: breadcrumb([
      //   ...baseBreadcrumbItems,
      //   { path: null, text: 'programs.applications' },
      // ]),
      // },
      // {
      //   path: 'job-seeker',
      //   loadComponent: () => import('./pages/job-seeker/job-seeker.component').then((c) => c.JobSeekerComponent),
      // data: breadcrumb([
      //   ...baseBreadcrumbItems,
      //   { path: null, text: 'vacancy.job-seekers' },
      // ]),
      // },
    ],
  },
];
