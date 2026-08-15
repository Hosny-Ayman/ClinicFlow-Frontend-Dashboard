import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const patient: Routes = [
    {
        path: 'create',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.PatientsCreate },
        loadComponent: () => import('./components/create-edit-patient/patient-form').then((m) => m.PatientForm)
    },
    {
        path: 'show',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.PatientsViewAll },
        loadComponent: () => import('./components/patients-show/patients-show').then((m) => m.PatientsShow)
    },
    {
        path: ':id/edit',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.PatientsUpdate },
        loadComponent: () => import('./components/create-edit-patient/patient-form').then((m) => m.PatientForm)
    },
    {
        path: ':id/details',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.PatientsView },
        loadComponent: () => import('./components/patient-details/patient-details').then((m) => m.PatientDetails)
    }
];
