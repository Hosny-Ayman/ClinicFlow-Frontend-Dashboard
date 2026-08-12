import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const user: Routes = [
    {
        path: 'create',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.ReceptionistsCreate },
        loadComponent: () => import('./components/receptionist-form/receptionist-form').then((m) => m.ReceptionistForm)
    },
    {
        path: ':id/edit',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.ReceptionistsUpdate },
        loadComponent: () => import('./components/receptionist-form/receptionist-form').then((m) => m.ReceptionistForm)
    },
    {
        path: 'show',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.ReceptionistsViewAll },
        loadComponent: () => import('./components/receptionists-show/receptionists-show').then((m) => m.ReceptionistsShow)
    },

    {
        path: ':id/details',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.ReceptionistsView },
        loadComponent: () => import('./components/receptionist-details/receptionist-details').then((m) => m.ReceptionistDetails)
    }
];
