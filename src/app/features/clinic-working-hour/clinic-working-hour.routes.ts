import { Permission } from '@/app/core/enums/Permission';
import { permissionGuard } from '@/app/core/guards/permission.guard';
import { Routes } from '@angular/router';

export const ClinicWorkingHours: Routes = [
    {
        path: '',
        canActivate: [permissionGuard],
        data: { requiredPermission: [Permission.ClinicsCreate, Permission.ClinicsUpdate] },
        loadComponent: () => import('./components/clinic-working-hour-form/clinic-working-hour-form').then((c) => c.ClinicWorkingHourForm)
    }
];
