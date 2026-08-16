export interface DoctorSchedule {
    id: number;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
}
