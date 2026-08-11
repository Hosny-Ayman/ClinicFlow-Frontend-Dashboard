import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const doctor: Routes = [
    {
        path: 'create',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorsCreate },
        loadComponent: () => import('./components/create-edit-doctor/doctor-form').then((m) => m.DoctorForm)
    },

    {
        path: ':id/edit',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorsUpdate },
        loadComponent: () => import('./components/create-edit-doctor/doctor-form').then((m) => m.DoctorForm)
    },

    {
        path: 'show',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorsViewAll },
        loadComponent: () => import('./components/doctor-show/doctor-show').then((m) => m.DoctorShow)
    },

    {
        path: ':id/details',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorsView },
        loadComponent: () => import('./components/doctor-details/doctor-details').then((m) => m.DoctorDetails)
    }
];
