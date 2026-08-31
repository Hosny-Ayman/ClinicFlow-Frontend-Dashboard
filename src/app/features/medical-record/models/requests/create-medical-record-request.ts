export interface CreateMedicalRecordRequest {
    appointmentId: number;
    diagnosis: string;
    symptoms?: string | null;
    treatmentPlan: string;
    notes?: string | null;
}
