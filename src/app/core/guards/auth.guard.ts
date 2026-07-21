import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authServie = inject(AuthService);
    const router = inject(Router);

    const authService = inject(AuthService);
    console.log('Guard Start');
    console.log('Guard currentUser =', authService.currentUser());
    if (authServie.currentUser()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
};
