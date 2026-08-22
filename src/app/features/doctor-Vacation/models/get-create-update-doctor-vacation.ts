export interface GetCreateUpdateDoctorVacation {
    userId: number;
    startDate: string;
    endDate: string;
    reason?: string | null;
    status: number;
}
