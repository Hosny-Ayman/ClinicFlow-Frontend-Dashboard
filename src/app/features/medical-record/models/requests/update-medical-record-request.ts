export interface UpdateMedicalRecordRequest {
    id: number;
    diagnosis: string;
    symptoms?: string | null;
    treatmentPlan: string;
    notes?: string | null;
}
