import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const doctorVacation: Routes = [
    {
        path: '',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorVacationsViewAll },
        loadComponent: () => import('./components/doctor-vacation-show/doctor-vacation-show').then((m) => m.DoctorVacationShow)
    },

    {
        path: 'create',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorVacationsCreate },
        loadComponent: () => import('./components/doctor-vaction-form/doctor-vaction-form').then((m) => m.DoctorVactionForm)
    },

    {
        path: ':userId/:vacationId/edit',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorVacationsUpdate },
        loadComponent: () => import('./components/doctor-vaction-form/doctor-vaction-form').then((m) => m.DoctorVactionForm)
    }
];
