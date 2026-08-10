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
    }
];
