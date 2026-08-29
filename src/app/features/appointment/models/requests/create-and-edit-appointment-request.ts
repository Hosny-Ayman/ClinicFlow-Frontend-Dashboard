export interface CreateAndEditAppointmentRequest {
    id?: number | null;
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    startTime: string;
    endTime: string;
    status: number;
    notes?: string | null;
}
