export interface CreateAndEditPatientRequest {
    id?: number | null;

    // Person Fields
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;

    // Patient Fields
    dateOfBirth: string | Date;
    gender: number;
    notes?: string | null;
    address?: string | null;
    bloodType?: number | null;
    nationalId?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
}
