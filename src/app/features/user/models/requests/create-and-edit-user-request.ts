export interface CreateAndEditUserRequest {
    id: number | null;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber: string;
}
