import { CreateClinicResponse } from './../models/responses/CreateClinicResponse';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@/environments/environment';
import { CreateClinicRequest } from '../models/requests/CreateClinicRequest';
import { ApiResponse } from '@/app/core/models/api-response';

@Injectable({
    providedIn: 'root'
})
export class CreateClinicService {
    private http = inject(HttpClient);

    createClinic(request: CreateClinicRequest): Observable<ApiResponse<CreateClinicResponse>> {
        return this.http.post<ApiResponse<CreateClinicResponse>>(`${environment.apiUrl}/Clinics`, request);
    }
}
