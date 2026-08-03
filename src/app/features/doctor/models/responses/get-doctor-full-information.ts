import { CreateAndEditUserRequest } from '@/app/shared/models/requests/create-and-edit-user-request';
import { GetDoctorInforamtionRequst } from './get-doctor-information';

export interface GetDoctorFullInformationRequest {
    doctor: GetDoctorInforamtionRequst;
    user: CreateAndEditUserRequest;
}
