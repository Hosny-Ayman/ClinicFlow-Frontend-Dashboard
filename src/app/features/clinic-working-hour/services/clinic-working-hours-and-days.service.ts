import { ApiResponse } from '@/app/core/models/api-response';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateClinicWorkingHour } from '../models/responses/create-clinic-working-hour';
import { environment } from '@/environments/environment';
import { UpdateClinicWorkingHoursAndDays } from '../models/responses/update-clinic-working-hours-and-days';
import { GetAllWorkingHoursAndDays } from '../models/requests/get-all-working-hours-and-days';

@Injectable({
    providedIn: 'root'
})
export class ClinicWorkingHoursAndDaysService {
    private readonly htpp = inject(HttpClient);

    CreateClinicWorkingHour(request: CreateClinicWorkingHour): Observable<ApiResponse<CreateClinicWorkingHour>> {
        return this.htpp.post<ApiResponse<CreateClinicWorkingHour>>(`${environment.apiUrl}/ClinicWorkingHours`, request);
    }

    GetAllWorkingHoursAndDays(): Observable<ApiResponse<GetAllWorkingHoursAndDays[]>> {
        return this.htpp.get<ApiResponse<GetAllWorkingHoursAndDays[]>>(`${environment.apiUrl}/ClinicWorkingHours`);
    }

    UpdateClinicWorkingHoursAndDays(request: UpdateClinicWorkingHoursAndDays[]): Observable<ApiResponse<UpdateClinicWorkingHoursAndDays[]>> {
        return this.htpp.put<ApiResponse<UpdateClinicWorkingHoursAndDays[]>>(`${environment.apiUrl}/ClinicWorkingHours`, request);
    }
}
