import { CreateClinicDtoRequest } from './Create-ClinicDto-Request';
import { CreateUserDtoRequest } from './Create-UserDto-Request ';

export interface CreateClinicRequest {
    clinic: CreateClinicDtoRequest;
    user: CreateUserDtoRequest;
}
