import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { PagedResponse } from '@/app/shared/models/responses/paged-response';
import { CreateAndEditPatientRequest } from '../models/requests/create-and-edit-patient-request';
import { PatientSearchRequest } from '../models/requests/patient-search-request';
import { GetAllPatientsResponse } from '../models/responses/get-all-patients-response';
import { GetPatientResponse } from '../models/responses/get-patient-response';

@Injectable({
    providedIn: 'root'
})
export class PatientService {
    private readonly http = inject(HttpClient);

    CreatePatient(data: CreateAndEditPatientRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/Patients`, data);
    }

    GetPatient(patientId: number): Observable<ApiResponse<GetPatientResponse>> {
        return this.http.get<ApiResponse<GetPatientResponse>>(`${environment.apiUrl}/Patients/${patientId}`);
    }

    UpdatePatient(data: CreateAndEditPatientRequest): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/Patients`, data);
    }

    GetAllPatients(data: PatientSearchRequest): Observable<ApiResponse<PagedResponse<GetAllPatientsResponse>>> {
        return this.http.post<ApiResponse<PagedResponse<GetAllPatientsResponse>>>(`${environment.apiUrl}/Patients/GetAllPatients`, data);
    }
}
