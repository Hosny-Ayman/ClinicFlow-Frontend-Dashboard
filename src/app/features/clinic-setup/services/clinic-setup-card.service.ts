import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreateClinicSetup as CreateAndEditClinicSetup } from '../models/responses/create-And-Edit-clinic-setup';
import { Observable } from 'rxjs';
import { ApiResponse } from '@/app/core/models/api-response';
import { environment } from '@/environments/environment';
import { GetClinicSetupStatus } from '../models/requests/get-clinic-setup-status';

@Injectable({
    providedIn: 'root'
})
export class ClinicSetupCardService {
    private readonly htpp = inject(HttpClient);

    CreateClinicSetupCard(request: CreateAndEditClinicSetup): Observable<ApiResponse<CreateAndEditClinicSetup>> {
        return this.htpp.post<ApiResponse<CreateAndEditClinicSetup>>(`${environment.apiUrl}/ClinicSetups`, request);
    }

    GetClinicSetupCard(): Observable<ApiResponse<GetClinicSetupStatus>> {
        return this.htpp.get<ApiResponse<GetClinicSetupStatus>>(`${environment.apiUrl}/ClinicSetups`);
    }

    UpdateClinicSetupCard(request: CreateAndEditClinicSetup): Observable<ApiResponse<CreateAndEditClinicSetup>> {
        return this.htpp.put<ApiResponse<CreateAndEditClinicSetup>>(`${environment.apiUrl}/ClinicSetups`, request);
    }
}
