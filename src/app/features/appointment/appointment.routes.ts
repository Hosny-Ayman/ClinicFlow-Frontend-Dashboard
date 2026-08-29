import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const appointment: Routes = [
    {
        path: 'create',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.AppointmentsCreate },
        loadComponent: () => import('./components/add-appointment/add-appointment').then((m) => m.AddAppointment)
    }
];
