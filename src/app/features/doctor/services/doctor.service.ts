import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateAndEditDoctorWithUserequest } from '../models/requests/create-and-edit-doctor-with-user-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { GetDoctorFullInformationRequest } from '../models/responses/get-doctor-full-information-response';
import { CreateAndEditDoctorRequest } from '../models/requests/create-and-edit-doctor-request';
import { PagedResponse } from '../models/requests/paged-response';
import { GetAllDoctorsInformationsResponse } from '../models/requests/get-all-doctors-informations-response';
import { DoctorSearchRequest } from '../models/responses/doctor-search-response';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private readonly http = inject(HttpClient);

    CreateDoctor(data: FormData): Observable<ApiResponse<CreateAndEditDoctorWithUserequest>> {
        return this.http.post<ApiResponse<CreateAndEditDoctorWithUserequest>>(`${environment.apiUrl}/Doctors`, data);
    }

    CreateDoctorSteps(data: FormData): Observable<ApiResponse<CreateAndEditDoctorRequest>> {
        return this.http.post<ApiResponse<CreateAndEditDoctorRequest>>(`${environment.apiUrl}/Doctors/steps`, data);
    }

    GetDoctor(doctorId: number): Observable<ApiResponse<GetDoctorFullInformationRequest>> {
        return this.http.get<ApiResponse<GetDoctorFullInformationRequest>>(`${environment.apiUrl}/Doctors/${doctorId}`);
    }

    UpdateDoctor(data: FormData): Observable<ApiResponse<CreateAndEditDoctorWithUserequest>> {
        return this.http.put<ApiResponse<CreateAndEditDoctorWithUserequest>>(`${environment.apiUrl}/Doctors`, data);
    }

    GetAllDoctorsInformations(data: DoctorSearchRequest): Observable<ApiResponse<PagedResponse<GetAllDoctorsInformationsResponse>>> {
        return this.http.post<ApiResponse<PagedResponse<GetAllDoctorsInformationsResponse>>>(`${environment.apiUrl}/Doctors/GetAllDoctors`, data);
    }
}
