import { Routes } from '@angular/router';

export const doctorDashboard: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/doctor-dashboard/doctor-dashboard').then((m) => m.DoctorDashboardComponent)
    }
];
