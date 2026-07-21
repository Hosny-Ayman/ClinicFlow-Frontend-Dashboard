import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {
    const authServie = inject(AuthService);
    const router = inject(Router);

    if (authServie.currentUser()) {
        return true;
    }

    return router.createUrlTree(['/auth/login']);
};
