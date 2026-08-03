import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { GetSpeciality } from '../models/get-Speciality';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SpecialityService {
    private readonly http = inject(HttpClient);

    GetAllSpecialities(): Observable<ApiResponse<GetSpeciality[]>> {
        return this.http.get<ApiResponse<GetSpeciality[]>>(`${environment.apiUrl}/Specialites`);
    }
}
