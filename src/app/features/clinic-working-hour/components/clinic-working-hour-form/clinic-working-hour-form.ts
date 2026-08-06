import { ChangeDetectorRef, Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { NotificationService } from '@/app/core/services/notification.service';
import { ClinicWorkingHoursAndDaysService } from '../../services/clinic-working-hours-and-days.service';
import { DayOfWeek } from '@/app/shared/enums/DayOfWeek';

@Component({
    selector: 'app-clinic-working-hour-form',
    imports: [ReactiveFormsModule, SelectModule, DatePickerModule, NgClass],
    templateUrl: './clinic-working-hour-form.html',
    styleUrl: './clinic-working-hour-form.scss'
})
export class ClinicWorkingHourForm implements OnInit {
    stepCompleted = output<void>();
    private readonly fb = inject(FormBuilder);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly workingHoursService = inject(ClinicWorkingHoursAndDaysService);
    private readonly notificationService = inject(NotificationService);

    isEditMode = false;

    daysList = [
        { id: 0, day: DayOfWeek.Saturday, label: 'السبت', isSelected: false },
        { id: 0, day: DayOfWeek.Sunday, label: 'الاحد', isSelected: false },
        { id: 0, day: DayOfWeek.Monday, label: 'الاثنين', isSelected: false },
        { id: 0, day: DayOfWeek.Tuesday, label: 'الثلاثاء', isSelected: false },
        { id: 0, day: DayOfWeek.Wednesday, label: 'الاربعاء', isSelected: false },
        { id: 0, day: DayOfWeek.Thursday, label: 'الخميس', isSelected: false },
        { id: 0, day: DayOfWeek.Friday, label: 'الجمعة', isSelected: false }
    ];

    durations = [
        { label: '15 دقيقة', value: 15 },
        { label: '20 دقيقة', value: 20 },
        { label: '30 دقيقة', value: 30 },
        { label: '45 دقيقة', value: 45 },
        { label: '60 دقيقة', value: 60 }
    ];

    workingHoursForm = this.fb.group({
        openTime: this.fb.control<Date | null>(null, Validators.required),
        closeTime: this.fb.control<Date | null>(null, Validators.required),
        appointmentDurationInMinutes: this.fb.control<number | null>(null, Validators.required)
    });

    ngOnInit(): void {
        this.loadData();
    }

    toggleDay(index: number) {
        this.daysList[index].isSelected = !this.daysList[index].isSelected;
    }

    loadData() {
        this.workingHoursService.GetAllWorkingHoursAndDays().subscribe({
            next: (res) => {
                if (res.data && res.data.length > 0) {
                    this.isEditMode = true;

                    let timePatched = false;

                    res.data.forEach((dbDay) => {
                        const dayIndex = this.daysList.findIndex((d) => d.day === dbDay.day);
                        if (dayIndex !== -1) {
                            this.daysList[dayIndex].id = dbDay.id;
                            this.daysList[dayIndex].isSelected = !dbDay.isClosed;

                            if (!dbDay.isClosed && !timePatched) {
                                this.workingHoursForm.patchValue({
                                    openTime: this.parseTimeStringToDate(dbDay.openTime),
                                    closeTime: this.parseTimeStringToDate(dbDay.closeTime),
                                    appointmentDurationInMinutes: dbDay.appointmentDurationInMinutes
                                });
                                timePatched = true;
                            }
                        }
                    });

                    this.cdr.detectChanges();
                }
            },
            error: (err) => {
                if (err.status === 404) {
                    this.isEditMode = false;
                } else {
                    this.notificationService.error('حدث خطأ أثناء تحميل أوقات العمل');
                }
            }
        });
    }

    onSubmit() {
        if (this.workingHoursForm.invalid) {
            this.workingHoursForm.markAllAsTouched();
            this.notificationService.info('برجاء إدخال أوقات العمل ومدة الحجز');
            return;
        }

        const hasSelectedDays = this.daysList.some((d) => d.isSelected);
        if (!hasSelectedDays) {
            this.notificationService.info('برجاء اختيار يوم عمل واحد على الأقل');
            return;
        }

        const formValue = this.workingHoursForm.getRawValue();
        const openTimeStr = this.formatDateToTimeString(formValue.openTime!);
        const closeTimeStr = this.formatDateToTimeString(formValue.closeTime!);

        const payload: any[] = this.daysList
            .filter((d) => d.isSelected || d.id > 0)
            .map((d) => ({
                id: d.id,
                day: d.day,
                openTime: openTimeStr,
                closeTime: closeTimeStr,
                isClosed: !d.isSelected,
                appointmentDurationInMinutes: formValue.appointmentDurationInMinutes
            }));

        if (this.isEditMode) {
            this.workingHoursService.UpdateClinicWorkingHoursAndDays(payload).subscribe({
                next: () => {
                    this.notificationService.success('تم تحديث أوقات العمل بنجاح');

                    this.loadData();
                },
                error: () => this.notificationService.error('حدث خطأ أثناء حفظ التعديلات')
            });
        } else {
            this.workingHoursService.CreateClinicWorkingHour(payload as any).subscribe({
                next: () => {
                    this.notificationService.success('تم إعداد أوقات العمل بنجاح');
                    this.stepCompleted.emit();
                    this.isEditMode = true;
                    this.loadData();
                },
                error: () => this.notificationService.error('حدث خطأ أثناء الحفظ')
            });
        }
    }

    private parseTimeStringToDate(timeString: string): Date {
        if (!timeString) return new Date();
        const [hours, minutes, seconds] = timeString.split(':');
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), Number(seconds || 0), 0);
        return date;
    }

    private formatDateToTimeString(date: Date): string {
        const h = date.getHours().toString().padStart(2, '0');
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }
}
