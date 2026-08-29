import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private authService = inject(AuthService);

    hasPermission(permission: bigint): boolean {
        const user = this.authService.currentUser();

        if (!user || !user.permissions) return false;

        const userPerms = BigInt(user.permissions);

        return (userPerms & permission) === permission;
    }
}
