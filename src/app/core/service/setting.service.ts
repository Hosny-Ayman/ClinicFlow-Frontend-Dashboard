import { SystemLogo } from '@/app/features/SystemSetting/models/sytem-logo';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, single } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SettingService {
    private readonly http = inject(HttpClient);

    readonly logo = signal<SystemLogo | null>(null);

    loadLogo(): void {
        this.http.get<ApiResponse<SystemLogo>>(`${environment.apiUrl}/SysteamSettings/Logo`).subscribe((respons) => {
            this.logo.set(respons.data);
        });
    }
}
