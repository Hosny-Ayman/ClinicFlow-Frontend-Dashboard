export interface AppointmentStatusBreakdownDto {
    status: string;
    count: number;
}

export interface AppointmentTimeBreakdownDto {
    timePeriod: string;
    count: number;
}

export interface TopDoctorDto {
    doctorName: string;
    specialty: string;
    imageUrl?: string | null;
    appointmentCount: number;
}

export interface GetAdminDashboardStatisticsDtoResponse {
    totalAppointments: number;
    totalAppointmentsDiff: number;
    attendedAppointments: number;
    attendedAppointmentsDiff: number;
    waitingAppointments: number;
    waitingAppointmentsDiff: number;
    cancelledAppointments: number;
    cancelledAppointmentsDiff: number;
    appointmentsByStatus: AppointmentStatusBreakdownDto[];
    appointmentsByTimePeriod: AppointmentTimeBreakdownDto[];
    topDoctors: TopDoctorDto[];
}
