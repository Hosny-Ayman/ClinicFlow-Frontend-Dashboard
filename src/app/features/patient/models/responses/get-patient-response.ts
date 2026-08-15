export interface GetPatientResponse {
    id: number;
    firstName: string;
    lastName: string;
    email?: string | null;
    phoneNumber?: string | null;
    dateOfBirth: string;
    gender: string;
    notes?: string | null;
    address?: string | null;
    bloodType?: string | null;
    nationalId?: string | null;
    emergencyContactName?: string | null;
    emergencyContactPhone?: string | null;
    status?: string;
}
