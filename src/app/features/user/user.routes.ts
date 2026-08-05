import { Routes } from '@angular/router';

export const user: Routes = [
    {
        path: 'create',
        loadComponent: () => import('./components/receptionist-form/receptionist-form').then((m) => m.ReceptionistForm)
    },
    {
        path: ':id/edit',
        loadComponent: () => import('./components/receptionist-form/receptionist-form').then((m) => m.ReceptionistForm)
    }
];
