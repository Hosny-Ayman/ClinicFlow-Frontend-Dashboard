import { CreateClinicDtoRequest } from './Create-ClinicCto-Request';
import { CreateUserDtoRequest } from './Create-UserDto-Request ';

export interface CreateClinicRequest {
    clinic: CreateClinicDtoRequest;
    user: CreateUserDtoRequest;
}
