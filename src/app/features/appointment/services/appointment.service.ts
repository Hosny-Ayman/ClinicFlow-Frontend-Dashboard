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
}
