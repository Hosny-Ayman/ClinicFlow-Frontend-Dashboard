import { Routes } from '@angular/router';

export const ClinicWorkingHours: Routes = [{ path: '', loadComponent: () => import('./components/clinic-working-hour-form/clinic-working-hour-form').then((c) => c.ClinicWorkingHourForm) }];
