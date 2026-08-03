export interface CreateAndEditDoctorRequest {
    SpecialtyId: number;
    ConsultationFee: number;
    Bio?: string;
    Gender: number;
    ExperienceYears: number;
    ProfileImage: File | null;
}
