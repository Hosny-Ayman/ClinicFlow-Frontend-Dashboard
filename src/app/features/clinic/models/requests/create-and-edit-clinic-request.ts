export interface CreateAndEditClinicDtoRequest {
    name: string;
    phone: string;
    email: string;
    address: string;
    description?: string;
    logoUrl?: string;
    isImageDelted: boolean;
    createdAt?: string;
}
