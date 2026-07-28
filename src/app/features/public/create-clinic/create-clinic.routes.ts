import { Routes } from '@angular/router';

export const createClinic: Routes = [
    {
        path: '',
        loadComponent: () => import('./create-clinic').then((m) => m.CreateClinic)
    }
];
