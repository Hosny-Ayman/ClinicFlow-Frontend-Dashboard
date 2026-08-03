export interface GetDoctorInforamtionRequst {
    id: number;
    specialtieName: string;
    consultationFee: number;
    bio?: string;
    gender: string;
    experienceYears: number;
    profileImageUrl: string;
}
