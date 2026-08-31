import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/dashboard/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/features/notfound/not-found';
import { authGuard } from './app/core/guards/auth.guard';
import { permissionGuard } from './app/core/guards/permission.guard';
import { PublicLayout } from './app/layout/public/public-layout/public-layout';
import { Permission } from '@/app/core/enums/Permission';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: Dashboard
            },
            {
                path: 'doctor',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.DoctorsView },
                loadChildren: () => import('./app/features/doctor/doctor.routes').then((c) => c.doctor)
            },
            {
                path: 'doctorSchedule',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.DoctorSchedulesView },
                loadChildren: () => import('./app/features/doctor-shedule/doctor-shedule.routes').then((c) => c.doctorSchedule)
            },
            {
                path: 'doctorVacation',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.DoctorVacationsView },
                loadChildren: () => import('./app/features/doctor-Vacation/doctor-Vacation.routes').then((c) => c.doctorVacation)
            },
            {
                path: 'patient',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.PatientsView },
                loadChildren: () => import('./app/features/patient/patient.routes').then((c) => c.patient)
            },
            {
                path: 'clinic',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.ClinicsView },
                loadChildren: () => import('./app/features/clinic/clinic-form.routes').then((c) => c.ClinicForm)
            },
            {
                path: 'receptionist',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.ReceptionistsView },
                loadChildren: () => import('./app/features/user/user.routes').then((c) => c.user)
            },
            {
                path: 'appointment',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.AppointmentsView },
                loadChildren: () => import('./app/features/appointment/appointment.routes').then((c) => c.appointment)
            },
            {
                path: 'doctor-dashboard',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.AppointmentsView },
                loadChildren: () => import('./app/features/doctor-dashboard/doctor-dashboard.routes').then((c) => c.doctorDashboard)
            },
            {
                path: 'clinicWorkingHours',
                canActivate: [permissionGuard],
                data: { requiredPermission: Permission.ClinicsView },
                loadChildren: () => import('./app/features/clinic-working-hour/clinic-working-hour.routes').then((c) => c.ClinicWorkingHours)
            }
        ]
    },

    {
        path: 'home',
        component: PublicLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./app/features/public/home/home').then((c) => c.Home)
            }
        ]
    },
    {
        path: 'auth',
        loadChildren: () => import('./app/features/auth/auth.routes').then((m) => m.authRoutes)
    },
    {
        path: 'createClinic',
        loadChildren: () => import('./app/features/public/create-clinic/create-clinic.routes').then((c) => c.createClinic)
    },
    {
        path: 'notfound',
        component: Notfound
    },
    {
        path: '**',
        redirectTo: '/notfound'
    }
];
