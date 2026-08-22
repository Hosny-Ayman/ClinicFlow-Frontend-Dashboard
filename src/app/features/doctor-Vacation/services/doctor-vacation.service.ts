import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetCreateUpdateDoctorVacation } from '../models/get-create-update-doctor-vacation';
import { GetAllDoctorVacationInformationRequest } from '../models/requests/get-all-doctor-vacation-information-request';
import { DoctorVacationSearchRespons } from '../models/responses/doctor-vacation-search-response';
import { PagedResponse } from '@/app/shared/models/responses/paged-response';
import { GetDoctorVacationDashboardInformationRequest } from '../models/requests/get-doctor-vacation-dashboard-information-request';

@Injectable({
    providedIn: 'root'
})
export class DoctorVacationService {
    private readonly http = inject(HttpClient);

    CreateDoctorVacation(data: GetCreateUpdateDoctorVacation): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/DoctorVacations`, data);
    }

    GetDoctorVacationInformation(userId: number, vacationId: number): Observable<ApiResponse<GetCreateUpdateDoctorVacation>> {
        return this.http.get<ApiResponse<GetCreateUpdateDoctorVacation>>(`${environment.apiUrl}/DoctorVacations/${userId}/${vacationId}`);
    }

    GetAllDoctorVacationInformation(data: DoctorVacationSearchRespons): Observable<ApiResponse<PagedResponse<GetAllDoctorVacationInformationRequest>>> {
        return this.http.post<ApiResponse<PagedResponse<GetAllDoctorVacationInformationRequest>>>(`${environment.apiUrl}/DoctorVacations/GetAllDoctorVacation`, data);
    }

    UpdateDoctorVacation(data: GetCreateUpdateDoctorVacation): Observable<ApiResponse<boolean>> {
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/DoctorVacations`, data);
    }

    GetDoctorVacationDashboardInformation(): Observable<ApiResponse<GetDoctorVacationDashboardInformationRequest>> {
        return this.http.get<ApiResponse<GetDoctorVacationDashboardInformationRequest>>(`${environment.apiUrl}/DoctorVacations/GetDoctorVacationDashboardInformation`);
    }
}
