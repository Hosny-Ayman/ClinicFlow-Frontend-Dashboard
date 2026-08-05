import { DayOfWeek } from '@/app/shared/enums/DayOfWeek';

export interface UpdateClinicWorkingHoursAndDays {
    id: number;
    day: DayOfWeek;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
    appointmentDurationInMinutes: number;
}
