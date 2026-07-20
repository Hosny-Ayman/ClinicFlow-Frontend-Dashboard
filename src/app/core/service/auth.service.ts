import { ApiResponse } from '@/app/core/models/api-response';
import { CurrentUser } from '@/app/features/auth/models/current-user';
import { LoginRequest } from '@/app/features/auth/models/login-request';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);

    readonly currentUser = signal<CurrentUser | null>(null);

    login(request: LoginRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${environment.apiUrl}/Authentication/login`, request);
    }

    loadCurrentUser(): void {
        this.http.get<ApiResponse<CurrentUser>>(`${environment.apiUrl}/Users/me`).subscribe({
            next: (response) => {
                this.currentUser.set(response.data);
            },
            error: () => {
                this.currentUser.set(null);
            }
        });
    }
}
