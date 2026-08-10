import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const ClinicForm: Routes = [
    {
        path: 'create',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.ClinicsCreate },
        loadComponent: () => import('./components/clinic-form/clinic-form').then((c) => c.ClinicForm)
    },
    {
        path: ':id/edit',
        canActivate: [permissionGuard],
        data: { requiredPermission: Permission.ClinicsUpdate },
        loadComponent: () => import('./components/clinic-form/clinic-form').then((c) => c.ClinicForm)
    }
];
