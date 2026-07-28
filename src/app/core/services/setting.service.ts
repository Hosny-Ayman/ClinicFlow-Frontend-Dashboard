import { SystemLogo } from '@/app/features/SystemSetting/models/sytem-logo';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { ApiResponse } from '../models/api-response';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private readonly http = inject(HttpClient);

    readonly logo = signal<SystemLogo | null>(null);
    readonly SystemImage = signal<SystemLogo | null>(null);

    loadLogo(imageKey: string): void {
        this.http
            .get<ApiResponse<SystemLogo>>(`${environment.apiUrl}/SysteamSettings/Image`, {
                params: {
                    imageKey
                }
            })
            .subscribe((response) => {
                this.logo.set(response.data);
            });
    }

    loadImage(imageKey: string): void {
        this.http
            .get<ApiResponse<SystemLogo>>(`${environment.apiUrl}/SysteamSettings/Image`, {
                params: {
                    imageKey
                }
            })
            .subscribe((response) => {
                this.SystemImage.set(response.data);
            });
    }
}
