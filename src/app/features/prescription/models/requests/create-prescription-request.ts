export interface CreatePrescriptionItemRequest {
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
}

export interface CreatePrescriptionRequest {
    medicalRecordId: number;
    notes?: string | null;
    prescriptionItems: CreatePrescriptionItemRequest[];
}
