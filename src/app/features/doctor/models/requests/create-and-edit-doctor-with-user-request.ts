import { CreateAndEditUserRequest } from '@/app/shared/models/requests/create-and-edit-user-request';
import { CreateAndEditDoctorRequest } from './create-and-edit-doctor-request';

export interface CreateAndEditDoctorWithUserequest {
    doctor: CreateAndEditDoctorRequest;
    user: CreateAndEditUserRequest;
}
