export interface GetAllDoctorVacationInformationRequest {
    id: number;
    userId: number;
    startDate: string;
    endDate: string;
    reason?: string;
    status: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    specialty: string;
    experience: number;
    profileImage?: string;
}
