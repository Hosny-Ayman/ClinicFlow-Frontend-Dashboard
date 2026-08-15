export interface GetAllPatientsResponse {
    id: number;
    fullName: string;
    phoneNumber?: string | null;
    nationalId?: string | null;
    gender: string;
    dateOfBirth: string;
    bloodType?: string | null;
    status: string;
}
