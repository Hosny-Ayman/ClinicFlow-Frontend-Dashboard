export interface GetAllAppointmentDtoResponse {
    appointmentId: number;
    time: string;
    patientFullName: string;
    patientPhoneNumber: string;
    doctorFullName: string;
    doctorSpecialtie: string;
    status: string;
    consultationFee: number;
    paymentstatus: string;
}
