import { Routes } from '@angular/router';

export const ClinicForm: Routes = [
    { path: 'create', loadComponent: () => import('./components/clinic-form/clinic-form').then((c) => c.ClinicForm) },
    { path: ':id/edit', loadComponent: () => import('./components/clinic-form/clinic-form').then((c) => c.ClinicForm) }
];
