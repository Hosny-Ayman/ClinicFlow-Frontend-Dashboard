import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateAndEditDoctorWithUserequest } from '../models/requests/create-and-edit-doctor-with-user-request';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { GetDoctorFullInformationRequest } from '../models/responses/get-doctor-full-information';
import { CreateAndEditDoctorRequest } from '../models/requests/create-and-edit-doctor-request';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {
    private readonly htpp = inject(HttpClient);

    CreateDoctor(data: FormData): Observable<ApiResponse<CreateAndEditDoctorWithUserequest>> {
        return this.htpp.post<ApiResponse<CreateAndEditDoctorWithUserequest>>(`${environment.apiUrl}/Doctors`, data);
    }

    CreateDoctorSteps(data: FormData): Observable<ApiResponse<CreateAndEditDoctorRequest>> {
        return this.htpp.post<ApiResponse<CreateAndEditDoctorRequest>>(`${environment.apiUrl}/Doctors/steps`, data);
    }

    GetDoctor(doctorId: number): Observable<ApiResponse<GetDoctorFullInformationRequest>> {
        return this.htpp.get<ApiResponse<GetDoctorFullInformationRequest>>(`${environment.apiUrl}/Doctors/${doctorId}`);
    }

    UpdateDoctor(data: FormData): Observable<ApiResponse<CreateAndEditDoctorWithUserequest>> {
        return this.htpp.put<ApiResponse<CreateAndEditDoctorWithUserequest>>(`${environment.apiUrl}/Doctors`, data);
    }
}
