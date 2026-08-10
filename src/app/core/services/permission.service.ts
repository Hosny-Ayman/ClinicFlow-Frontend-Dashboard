import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Permission } from '../enums/Permission';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private authService = inject(AuthService);

    hasPermission(permission: Permission): boolean {
        const user = this.authService.currentUser();

        if (!user) return false;

        return (user.permissions & permission) === permission;
    }
}
