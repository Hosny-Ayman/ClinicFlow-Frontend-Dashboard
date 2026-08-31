export interface GetPrescriptionItemResponse {
    id: number;
    prescriptionId: number;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
}

export interface GetPrescriptionResponse {
    id: number;
    medicalRecordId: number;
    doctorId: number;
    issuedAt: string;
    notes?: string | null;
    prescriptionItems: GetPrescriptionItemResponse[];
}
