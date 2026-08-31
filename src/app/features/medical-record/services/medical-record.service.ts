import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { CreateMedicalRecordRequest } from '../models/requests/create-medical-record-request';
import { UpdateMedicalRecordRequest } from '../models/requests/update-medical-record-request';
import { GetMedicalRecordResponse } from '../models/responses/get-medical-record-response';

@Injectable({
    providedIn: 'root'
})
export class MedicalRecordService {
    private readonly http = inject(HttpClient);

    CreateMedicalRecord(data: CreateMedicalRecordRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/MedicalRecords`, data);
    }

    GetMedicalRecordById(id: number): Observable<ApiResponse<GetMedicalRecordResponse>> {
        return this.http.get<ApiResponse<GetMedicalRecordResponse>>(`${environment.apiUrl}/MedicalRecords/${id}`);
    }

    GetMedicalRecordByAppointmentId(appointmentId: number): Observable<ApiResponse<GetMedicalRecordResponse>> {
        return this.http.get<ApiResponse<GetMedicalRecordResponse>>(`${environment.apiUrl}/MedicalRecords/ByAppointment/${appointmentId}`);
    }

    UpdateMedicalRecord(data: UpdateMedicalRecordRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/MedicalRecords`, data);
    }
}
