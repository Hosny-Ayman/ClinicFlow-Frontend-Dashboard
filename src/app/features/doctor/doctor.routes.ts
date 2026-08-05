import { Routes } from '@angular/router';

export const doctor: Routes = [
    {
        path: 'create',
        loadComponent: () => import('./components/create-edit-doctor/doctor-form').then((m) => m.DoctorForm)
    },

    {
        path: 'edit',
        loadComponent: () => import('./components/create-edit-doctor/doctor-form').then((m) => m.DoctorForm)
    }
];
