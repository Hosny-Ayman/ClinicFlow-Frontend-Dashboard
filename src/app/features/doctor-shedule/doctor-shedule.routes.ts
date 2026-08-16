import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const DoctorSchedule: Routes = [
    {
        path: 'show',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorSchedulesView },
        loadComponent: () => import('./components/doctor-shedule-form/doctor-shedule-form').then((m) => m.DoctorSheduleForm)
    },

    {
        path: ':id/edit',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.DoctorSchedulesUpdate },
        loadComponent: () => import('./components/doctor-shedule-form/doctor-shedule-form').then((m) => m.DoctorSheduleForm)
    }
];
