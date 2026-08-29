export interface GetAllDoctorsInformationsResponse {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    specialty: string;
    experience: number;
    status: string;
    image?: string | null;
    consultationFee?: number;
}
