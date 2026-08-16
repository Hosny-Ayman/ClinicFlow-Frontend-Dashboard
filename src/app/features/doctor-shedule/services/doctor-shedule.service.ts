import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorSchedule } from '../models/DoctorSchedule';

@Injectable({
    providedIn: 'root'
})
export class DoctorSheduleServices {
    private readonly http = inject(HttpClient);

    GetDoctorSchedules(userId: number): Observable<ApiResponse<DoctorSchedule>> {
        return this.http.get<ApiResponse<DoctorSchedule>>(`${environment.apiUrl}/DoctorSchedules/${userId}`);
    }

    UpdateDoctorSchedules(userId: number, schedules: DoctorSchedule[]): Observable<ApiResponse<DoctorSchedule[]>> {
        return this.http.put<ApiResponse<DoctorSchedule[]>>(`${environment.apiUrl}/DoctorSchedules/${userId}`, schedules);
    }
}
