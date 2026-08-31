export interface GetMedicalRecordResponse {
    id: number;
    appointmentId: number;
    patientId: number;
    doctorId: number;
    diagnosis: string;
    symptoms?: string | null;
    treatmentPlan: string;
    notes?: string | null;
    createdAt: string;
}
