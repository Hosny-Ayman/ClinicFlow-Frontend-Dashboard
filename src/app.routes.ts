import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/dashboard/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/features/notfound/not-found';
import { authGuard } from './app/core/guards/auth.guard';
import { PublicLayout } from './app/layout/public/public-layout/public-layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: PublicLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('./app/features/public/home/home').then((c) => c.Home)
            }
        ]
    },

    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                component: Dashboard
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
        path: 'doctor',
        loadChildren: () => import('./app/features/doctor/doctor.routes').then((c) => c.doctor)
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
