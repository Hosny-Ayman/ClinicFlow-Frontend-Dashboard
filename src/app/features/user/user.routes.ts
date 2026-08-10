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
    }
];
