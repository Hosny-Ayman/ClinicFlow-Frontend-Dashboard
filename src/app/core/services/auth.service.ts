import { ApiResponse } from '@/app/core/models/api-response';
import { CurrentUser } from '@/app/features/auth/models/current-user';
import { LoginRequest } from '@/app/features/auth/models/login-request';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);

    readonly currentUser = signal<CurrentUser | null>(null);

    login(request: LoginRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${environment.apiUrl}/Authentication/login`, request, { withCredentials: true });
    }

    loadCurrentUser(): Observable<ApiResponse<CurrentUser>> {
        return this.http.get<ApiResponse<CurrentUser>>(`${environment.apiUrl}/Users/me`, { withCredentials: true }).pipe(
            tap((response) => this.currentUser.set(response.data)),
            catchError((error) => {
                if (error.status === 401) {
                    this.currentUser.set(null);
                }
                return throwError(() => error);
            })
        );
    }

    initializeAuth(): void {
        this.loadCurrentUser().subscribe();
    }
}
