import { ApiResponse } from '@/app/core/models/api-response';
import { CreateAndEditUserRequest } from '@/app/features/user/models/requests/create-and-edit-user-request';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReceptionistsSearchRequest } from '../models/requests/receptionists-search-request';
import { PagedResponse } from '../../../shared/models/responses/paged-response';
import { GetAllReceptionistsResponse } from '../models/responses/get-all-receptionists-response';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly http = inject(HttpClient);

    CreateReceptionists(request: CreateAndEditUserRequest): Observable<ApiResponse<CreateAndEditUserRequest>> {
        return this.http.post<ApiResponse<CreateAndEditUserRequest>>(`${environment.apiUrl}/Users/CreateReceptionists`, request);
    }

    GetUser(userId: number): Observable<ApiResponse<CreateAndEditUserRequest>> {
        return this.http.get<ApiResponse<CreateAndEditUserRequest>>(`${environment.apiUrl}/Users/${userId}`);
    }

    UpdateUser(request: CreateAndEditUserRequest): Observable<ApiResponse<CreateAndEditUserRequest>> {
        return this.http.put<ApiResponse<CreateAndEditUserRequest>>(`${environment.apiUrl}/Users/UpdateUsers`, request);
    }

    ToggleUserStatus(userId: number): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/Users/ToggleUserStatus?userId=${userId}`, null);
    }

    GetAllReceptionistsformations(data: ReceptionistsSearchRequest): Observable<ApiResponse<PagedResponse<GetAllReceptionistsResponse>>> {
        return this.http.post<ApiResponse<PagedResponse<GetAllReceptionistsResponse>>>(`${environment.apiUrl}/Users/GetAllReceptionistsformations`, data);
    }
}
