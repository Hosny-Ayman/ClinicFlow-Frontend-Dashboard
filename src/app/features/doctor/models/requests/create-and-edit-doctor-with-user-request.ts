import { CreateAndEditUserRequest } from '@/app/features/user/models/requests/create-and-edit-user-request';
import { CreateAndEditDoctorRequest } from './create-and-edit-doctor-request';

export interface CreateAndEditDoctorWithUserequest {
    doctor: CreateAndEditDoctorRequest;
    user: CreateAndEditUserRequest;
}
