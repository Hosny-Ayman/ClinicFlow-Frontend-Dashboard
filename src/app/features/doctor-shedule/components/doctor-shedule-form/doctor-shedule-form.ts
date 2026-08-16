import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToggleSwitch } from 'primeng/toggleswitch';

import { DoctorSheduleServices } from '../../services/doctor-shedule.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { ClinicWorkingHoursAndDaysService } from '@/app/features/clinic-working-hour/services/clinic-working-hours-and-days.service';

import { GetAllWorkingHoursAndDays } from '@/app/features/clinic-working-hour/models/requests/get-all-working-hours-and-days';
import { DoctorSchedule } from '../../models/DoctorSchedule';

interface DayScheduleUI {
    id: number;
    dayOfWeek: number;
    dayName: string;
    isAvailable: boolean;
    startTime: string;
    endTime: string;
    clinicOpenTime: string;
    clinicCloseTime: string;
    isClinicClosed: boolean;
}

@Component({
    selector: 'app-doctor-shedule-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ToggleSwitch],
    templateUrl: './doctor-shedule-form.html',
    styleUrl: './doctor-shedule-form.scss'
})
export class DoctorSheduleForm implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly scheduleService = inject(DoctorSheduleServices);
    private readonly clinicWorkingHourService = inject(ClinicWorkingHoursAndDaysService);
    private readonly notificationService = inject(NotificationService);
    private readonly cdr = inject(ChangeDetectorRef);

    userId: number | null = null;
    loading: boolean = true;

    daysArabic = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    schedules: DayScheduleUI[] = [];

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.userId = Number(idParam);
            this.loadClinicHoursAndSchedules();
        } else {
            this.loading = false;
        }
    }

    loadClinicHoursAndSchedules() {
        this.loading = true;
        this.cdr.detectChanges();

        this.clinicWorkingHourService.GetAllWorkingHoursAndDays().subscribe({
            next: (res: any) => {
                const clinicHours = res.data;
                this.initDefaultSchedules(clinicHours);
                this.loadDoctorSchedules();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء جلب مواعيد عمل العيادة الأساسية');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    initDefaultSchedules(clinicHours: GetAllWorkingHoursAndDays[]) {
        this.schedules = Array.from({ length: 7 }, (_, i) => {
            const clinicDay = clinicHours.find((c) => c.day === i);
            const isClosed = clinicDay ? clinicDay.isClosed : true;

            const open = clinicDay ? this.forceAmPm(clinicDay.openTime, 'start') : '09:00';
            const close = clinicDay ? this.forceAmPm(clinicDay.closeTime, 'end') : '17:00';

            return {
                id: 0,
                dayOfWeek: i,
                dayName: this.daysArabic[i],
                isAvailable: false,
                startTime: open,
                endTime: close,
                clinicOpenTime: open,
                clinicCloseTime: close,
                isClinicClosed: isClosed
            };
        });
    }

    loadDoctorSchedules() {
        this.scheduleService.GetDoctorSchedules(this.userId!).subscribe({
            next: (res: any) => {
                if (res.data && Array.isArray(res.data)) {
                    res.data.forEach((apiSchedule: DoctorSchedule) => {
                        const target = this.schedules.find((s) => s.dayOfWeek === apiSchedule.dayOfWeek);
                        if (target) {
                            target.id = apiSchedule.id;
                            target.isAvailable = target.isClinicClosed ? false : apiSchedule.isAvailable;

                            target.startTime = this.formatTimeForInput(apiSchedule.startTime);
                            target.endTime = this.formatTimeForInput(apiSchedule.endTime);
                        }
                    });
                }
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء جلب مواعيد الطبيب');
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit() {
        if (!this.userId) return;

        for (const day of this.schedules) {
            if (day.isAvailable) {
                if (day.isClinicClosed) {
                    this.notificationService.error(`يوم ${day.dayName} العيادة مغلقة، لا يمكنك تعيين مواعيد عمل فيه.`);
                    return;
                }

                if (day.startTime >= day.endTime) {
                    this.notificationService.error(`في يوم ${day.dayName}: وقت البدء يجب أن يكون قبل وقت الانتهاء.`);
                    return;
                }

                if (day.startTime < day.clinicOpenTime || day.endTime > day.clinicCloseTime) {
                    this.notificationService.error(`مواعيد يوم ${day.dayName} خارج أوقات العيادة (مسموح من ${this.formatTo12Hour(day.clinicOpenTime)} إلى ${this.formatTo12Hour(day.clinicCloseTime)}).`);
                    return;
                }
            }
        }

        const payload: DoctorSchedule[] = this.schedules.map((s) => ({
            id: s.id,
            dayOfWeek: s.dayOfWeek,
            isAvailable: s.isAvailable,
            startTime: this.formatTimeForApi(s.startTime),
            endTime: this.formatTimeForApi(s.endTime)
        }));

        this.scheduleService.UpdateDoctorSchedules(this.userId, payload).subscribe({
            next: () => {
                this.notificationService.success('تم تحديث جدول المواعيد بنجاح');
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء حفظ التعديلات');
            }
        });
    }

    resetForm() {
        this.loadClinicHoursAndSchedules();
        this.notificationService.info('تم التراجع عن التعديلات');
    }

    private forceAmPm(timeStr: string, type: 'start' | 'end'): string {
        if (!timeStr) return type === 'start' ? '09:00' : '17:00';

        const parts = timeStr.split(':');
        if (parts.length < 2) return type === 'start' ? '09:00' : '17:00';

        let h = parseInt(parts[0], 10);
        const m = parts[1];

        if (type === 'start') {
            if (h >= 12) h -= 12;
        } else if (type === 'end') {
            if (h < 12) h += 12;
        }

        const hh = h < 10 ? `0${h}` : `${h}`;
        return `${hh}:${m}`;
    }

    private formatTimeForInput(timeStr: string): string {
        return timeStr ? timeStr.substring(0, 5) : '00:00';
    }

    private formatTimeForApi(timeStr: string): string {
        return timeStr && timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    }

    formatTo12Hour(time24: string): string {
        let [hours, minutes] = time24.split(':');
        let h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'م' : 'ص';
        h = h % 12;
        h = h ? h : 12;
        return `${h}:${minutes} ${ampm}`;
    }
}
