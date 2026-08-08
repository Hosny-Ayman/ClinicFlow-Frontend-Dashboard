import { ApiResponse } from '@/app/core/models/api-response';
import { CreateAndEditUserRequest } from '@/app/features/user/models/requests/create-and-edit-user-request';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly htpp = inject(HttpClient);

    CreateReceptionists(request: CreateAndEditUserRequest): Observable<ApiResponse<CreateAndEditUserRequest>> {
        return this.htpp.post<ApiResponse<CreateAndEditUserRequest>>(`${environment.apiUrl}/Users/CreateReceptionists`, request);
    }

    GetUser(userId: number): Observable<ApiResponse<CreateAndEditUserRequest>> {
        return this.htpp.get<ApiResponse<CreateAndEditUserRequest>>(`${environment.apiUrl}/Users/${userId}`);
    }

    UpdateUser(request: CreateAndEditUserRequest): Observable<ApiResponse<CreateAndEditUserRequest>> {
        return this.htpp.put<ApiResponse<CreateAndEditUserRequest>>(`${environment.apiUrl}/Users/UpdateUsers`, request);
    }
}
