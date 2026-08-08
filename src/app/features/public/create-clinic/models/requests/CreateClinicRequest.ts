import { CreateAndEditUserRequest } from '@/app/features/user/models/requests/create-and-edit-user-request';
import { CreateAndEditClinicDtoRequest } from '../../../../clinic/models/requests/create-and-edit-clinic-request';

export interface CreateClinicRequest {
    clinic: CreateAndEditClinicDtoRequest;
    user: CreateAndEditUserRequest;
}
