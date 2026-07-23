import { ApiResponse } from '@/app/core/models/api-response';
import { CurrentUser } from '@/app/features/auth/models/current-user';
import { LoginRequest } from '@/app/features/auth/models/login-request';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, firstValueFrom, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);

    readonly currentUser = signal<CurrentUser | null>(null);

    private readonly router = inject(Router);

    login(request: LoginRequest): Observable<ApiResponse<string>> {
        return this.http.post<ApiResponse<string>>(`${environment.apiUrl}/Authentication/login`, request);
    }

    loadCurrentUser(): Observable<ApiResponse<CurrentUser>> {
        return this.http.get<ApiResponse<CurrentUser>>(`${environment.apiUrl}/Users/me`).pipe(
            tap((response) => {
                console.log('Current user:', response.data);
                this.currentUser.set(response.data);
            }),
            catchError((error) => {
                if (error.status === 401) {
                    this.currentUser.set(null);
                }
                return throwError(() => error);
            })
        );
    }

    initializeAuth(): Promise<void> {
        console.log('Initializer Start');
        return firstValueFrom(
            this.loadCurrentUser().pipe(
                catchError(() => {
                    return of(null);
                })
            )
        ).then(() => {
            console.log('Signal value =', this.currentUser());
            console.log('Initializer End');
        });
    }

    refresh(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/Authentication/refresh`, null);
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/Authentication/logout`, null).pipe(
            tap(() => {
                this.currentUser.set(null);
                this.router.navigate(['/auth/login']);
            })
        );
    }
}
