import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

let refreshRequest: Observable<void> | null = null;

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (req.url.includes('/Authentication/login') || req.url.includes('/Authentication/refresh') || req.url.includes('/Authentication/logout')) {
        return next(req);
    }

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
                return throwError(() => error);
            }

            if (!refreshRequest) {
                refreshRequest = authService.refresh().pipe(
                    finalize(() => {
                        refreshRequest = null;
                    }),

                    shareReplay(1)
                );
            }

            return refreshRequest.pipe(
                switchMap(() => next(req)),

                catchError((refreshError) => {
                    authService.currentUser.set(null);

                    router.navigate(['/auth/login']);

                    return throwError(() => refreshError);
                })
            );
        })
    );
};
