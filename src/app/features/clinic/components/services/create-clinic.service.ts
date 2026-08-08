import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { ApiResponse } from '@/app/core/models/api-response';
import { CreateAndEditClinicDtoRequest } from '../../models/requests/create-and-edit-clinic-request';

@Injectable({
    providedIn: 'root'
})
export class CreateClinicService {
    private http = inject(HttpClient);

    createClinic(request: FormData): Observable<ApiResponse<CreateAndEditClinicDtoRequest>> {
        return this.http.post<ApiResponse<CreateAndEditClinicDtoRequest>>(`${environment.apiUrl}/Clinics`, request);
    }

    UpdateClinic(request: FormData): Observable<ApiResponse<CreateAndEditClinicDtoRequest>> {
        return this.http.put<ApiResponse<CreateAndEditClinicDtoRequest>>(`${environment.apiUrl}/Clinics`, request);
    }

    GetClinic(): Observable<ApiResponse<CreateAndEditClinicDtoRequest>> {
        return this.http.get<ApiResponse<CreateAndEditClinicDtoRequest>>(`${environment.apiUrl}/Clinics`);
    }
}
