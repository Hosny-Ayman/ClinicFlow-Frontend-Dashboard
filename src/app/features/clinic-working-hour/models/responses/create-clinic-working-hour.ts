import { DayOfWeek } from '@/app/shared/enums/DayOfWeek';

export interface CreateClinicWorkingHour {
    day: DayOfWeek;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
    appointmentDurationInMinutes: number;
}
