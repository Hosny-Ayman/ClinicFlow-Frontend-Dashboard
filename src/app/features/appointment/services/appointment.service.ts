import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { PatientAppointmentSearchRequest } from '../models/requests/patient-appointment-search-request';
import { DoctorAvailableSlotsRequest } from '../models/requests/doctor-available-slots-request';
import { CreateAndEditAppointmentRequest } from '../models/requests/create-and-edit-appointment-request';
import { GetPatientAppointmentResponse } from '../models/responses/get-patient-appointment-response';
import { SlotResponse } from '../models/responses/slot-response';
import { AppointmentSearchDtoRequest } from '../models/requests/appointment-search-request';
import { PagedResponse } from '@/app/shared/models/responses/paged-response';
import { GetAllAppointmentDtoResponse } from '../models/responses/get-all-appointment-response';
import { GetAppointmentDashboardDtoResponse } from '../models/responses/get-appointment-dashboard-response';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {
    private readonly http = inject(HttpClient);

    GetPatientInformationForAppointment(search: PatientAppointmentSearchRequest): Observable<ApiResponse<GetPatientAppointmentResponse>> {
        let params = new HttpParams().set('Name', search.name).set('PhoneNumber', search.phoneNumber);

        return this.http.get<ApiResponse<GetPatientAppointmentResponse>>(`${environment.apiUrl}/Patients/GetPatientInformationForAppointment`, { params });
    }

    GetDoctorAvailableSlots(request: DoctorAvailableSlotsRequest): Observable<ApiResponse<SlotResponse[]>> {
        let params = new HttpParams().set('doctorId', request.doctorId.toString()).set('appointmentDate', request.appointmentDate);

        return this.http.get<ApiResponse<SlotResponse[]>>(`${environment.apiUrl}/Appointments/GetDoctorAvailableSlots`, { params });
    }

    CreateAppointment(data: CreateAndEditAppointmentRequest): Observable<ApiResponse<number>> {
        return this.http.post<ApiResponse<number>>(`${environment.apiUrl}/Appointments/CreateAppointment`, data);
    }

    GetAllAppointment(request: AppointmentSearchDtoRequest): Observable<ApiResponse<PagedResponse<GetAllAppointmentDtoResponse>>> {
        return this.http.post<ApiResponse<PagedResponse<GetAllAppointmentDtoResponse>>>(`${environment.apiUrl}/Appointments/GetAllAppointment`, request);
    }

    GetAppointmentDashboard(date: string): Observable<ApiResponse<GetAppointmentDashboardDtoResponse>> {
        let params = new HttpParams().set('date', date);
        return this.http.get<ApiResponse<GetAppointmentDashboardDtoResponse>>(`${environment.apiUrl}/Appointments/GetAppointmentDashboard`, { params });
    }

    UpdateAppointmentStatus(appointmentId: number, status: number): Observable<ApiResponse<boolean>> {
        let params = new HttpParams().set('appointmentId', appointmentId.toString()).set('status', status.toString());
        return this.http.put<ApiResponse<boolean>>(`${environment.apiUrl}/Appointments/UpdateAppointmentStatus`, null, { params });
    }
}
