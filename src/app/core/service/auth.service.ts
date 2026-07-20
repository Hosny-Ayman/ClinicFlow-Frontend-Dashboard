import { ApiResponse } from '@/app/core/models/api-response';
import { CurrentUser } from '@/app/features/auth/models/current-user';
import { LoginRequest } from '@/app/features/auth/models/login-request';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);

    login(request: LoginRequest): Observable<ApiResponse<CurrentUser>> {
        return this.http.post<ApiResponse<CurrentUser>>(`${environment.apiUrl}/Authentication/login`, request);
    }
}
