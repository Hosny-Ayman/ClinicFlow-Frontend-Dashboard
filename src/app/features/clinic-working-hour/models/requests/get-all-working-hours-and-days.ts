import { DayOfWeek } from '@/app/shared/enums/DayOfWeek';

export interface GetAllWorkingHoursAndDays {
    id: number;
    day: DayOfWeek;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
    appointmentDurationInMinutes: number;
}
