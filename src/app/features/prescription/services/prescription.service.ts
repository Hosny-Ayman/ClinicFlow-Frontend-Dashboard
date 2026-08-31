import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { CreatePrescriptionRequest } from '../models/requests/create-prescription-request';
import { UpdatePrescriptionRequest } from '../models/requests/update-prescription-request';
import { GetPrescriptionResponse } from '../models/responses/get-prescription-response';

@Injectable({
    providedIn: 'root'
})
export class PrescriptionService {
    private readonly http = inject(HttpClient);

    CreatePrescription(data: CreatePrescriptionRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/Prescriptions`, data);
    }

    GetPrescriptionById(id: number): Observable<ApiResponse<GetPrescriptionResponse>> {
        return this.http.get<ApiResponse<GetPrescriptionResponse>>(`${environment.apiUrl}/Prescriptions/${id}`);
    }

    GetPrescriptionByMedicalRecordId(medicalRecordId: number): Observable<ApiResponse<GetPrescriptionResponse>> {
        return this.http.get<ApiResponse<GetPrescriptionResponse>>(`${environment.apiUrl}/Prescriptions/ByMedicalRecord/${medicalRecordId}`);
    }

    UpdatePrescription(data: UpdatePrescriptionRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/Prescriptions`, data);
    }
}
