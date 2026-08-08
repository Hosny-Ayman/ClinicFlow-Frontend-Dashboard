import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const authService = inject(AuthService);
    console.log('Guard Start');
    console.log('Guard currentUser =', authService.currentUser());
    if (authService.currentUser()) {
        return true;
    }

    return router.createUrlTree(['home']);
};
