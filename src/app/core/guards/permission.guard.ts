import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

export const permissionGuard: CanActivateFn = (route, state) => {
    const permissionService = inject(PermissionService);

    const router = inject(Router);

    const requiredPermission = route.data?.['requiredPermission'];

    if (!requiredPermission || permissionService.hasPermission(requiredPermission)) {
        return true;
    }

    return router.parseUrl('/auth/access');
};
