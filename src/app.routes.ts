import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/features/notfound/not-found';
import { authGuardGuard } from './app/core/guards/auth.guard-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuardGuard],
        children: [{ path: '', component: Dashboard }]
    },

    {
        path: 'auth',
        loadChildren: () => import('./app/features/auth/auth.routes').then((m) => m.authRoutes)
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
