export interface UpdatePrescriptionItemRequest {
    id: number;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
}

export interface UpdatePrescriptionRequest {
    id: number;
    notes?: string | null;
    prescriptionItems: UpdatePrescriptionItemRequest[];
}
