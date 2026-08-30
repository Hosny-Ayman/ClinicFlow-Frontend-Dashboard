import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PaginatorModule } from 'primeng/paginator';

import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { DoctorService } from '@/app/features/doctor/services/doctor.service';

import { AppointmentSearchDtoRequest } from '../../models/requests/appointment-search-request';
import { GetAllAppointmentDtoResponse } from '../../models/responses/get-all-appointment-response';
import { GetAppointmentDashboardDtoResponse } from '../../models/responses/get-appointment-dashboard-response';

@Component({
    selector: 'app-appointment-show',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, TableModule, SelectModule, InputTextModule, DatePickerModule, MenuModule, PaginatorModule],
    providers: [DatePipe],
    templateUrl: './appointment-show.html',
    styleUrl: './appointment-show.scss'
})
export class AppointmentShowComponent implements OnInit {
    private appointmentService = inject(AppointmentService);
    private doctorService = inject(DoctorService);
    private notificationService = inject(NotificationService);
    private datePipe = inject(DatePipe);
    private cdr = inject(ChangeDetectorRef);

    appointments: GetAllAppointmentDtoResponse[] = [];
    totalRecords: number = 0;
    loading: boolean = false;

    dashboardData: GetAppointmentDashboardDtoResponse = {
        totalAppointments: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0
    };

    filterDate: Date | null = new Date();

    searchRequest: AppointmentSearchDtoRequest = {
        pageNumber: 1,
        pageSize: 10,
        fullNameOrPhoneNumberSearch: null,
        statusSearch: null,
        doctorIdSearch: null,
        dateSearch: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
    };

    doctors: any[] = [{ fullName: 'كل الأطباء', id: null }];

    statuses = [
        { label: 'الكل', value: null },
        { label: 'مجدول (محجوز)', value: 1 },
        { label: 'تم الحضور', value: 2 },
        { label: 'في الكشف', value: 3 },
        { label: 'مكتمل', value: 4 },
        { label: 'ملغي', value: 5 },
        { label: 'لم يحضر', value: 6 }
    ];

    actionMenuItems: MenuItem[] = [];
    selectedAppointmentForAction: GetAllAppointmentDtoResponse | null = null;

    ngOnInit(): void {
        this.loadDoctors();
        this.loadDashboard();
        this.loadAppointments();
    }

    loadDoctors(): void {
        this.doctorService.GetAllDoctorsInformations({ pageNumber: 1, pageSize: 1000 } as any).subscribe({
            next: (res) => {
                if (res.data && res.data.data) {
                    this.doctors = [{ fullName: 'كل الأطباء', id: null }, ...res.data.data];
                }
            }
        });
    }

    loadDashboard(): void {
        const dateStr = this.datePipe.transform(this.filterDate || new Date(), 'yyyy-MM-dd')!;
        this.appointmentService.GetAppointmentDashboard(dateStr).subscribe({
            next: (res) => {
                if (res.data) this.dashboardData = res.data;
            },
            error: (err) => {
                this.notificationService.error(this.extractErrorMessage(err, 'حدث خطأ أثناء جلب بيانات لوحة التحكم'));
            }
        });
    }

    loadAppointments(): void {
        this.loading = true;
        this.cdr.detectChanges();
        this.searchRequest.dateSearch = this.datePipe.transform(this.filterDate, 'yyyy-MM-dd');

        this.appointmentService.GetAllAppointment(this.searchRequest).subscribe({
            next: (res) => {
                if (res.data) {
                    this.appointments = res.data.data;
                    this.totalRecords = res.data.totalRecords;
                }
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.notificationService.error(this.extractErrorMessage(err, 'حدث خطأ أثناء جلب المواعيد'));
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    search(): void {
        this.searchRequest.pageNumber = 1;
        this.loadAppointments();
        this.loadDashboard();
    }

    clearFilters(): void {
        this.filterDate = new Date();
        this.searchRequest = {
            pageNumber: 1,
            pageSize: 10,
            fullNameOrPhoneNumberSearch: null,
            statusSearch: null,
            doctorIdSearch: null,
            dateSearch: this.datePipe.transform(new Date(), 'yyyy-MM-dd')
        };
        this.loadAppointments();
        this.loadDashboard();
    }

    onPageChange(event: any): void {
        this.searchRequest.pageNumber = event.page + 1;
        this.searchRequest.pageSize = event.rows;
        this.loadAppointments();
    }

    setupActionMenu(appointment: GetAllAppointmentDtoResponse): void {
        this.selectedAppointmentForAction = appointment;
        this.actionMenuItems = [
            {
                label: 'تأكيد الحضور',
                icon: 'pi pi-check-circle',
                command: () => this.updateStatus(appointment.appointmentId, 2),
                visible: appointment.status === 'Scheduled'
            },
            {
                label: 'دخول للكشف',
                icon: 'pi pi-sign-in',
                command: () => this.updateStatus(appointment.appointmentId, 3),
                visible: appointment.status === 'CheckedIn'
            },
            {
                label: 'إنهاء الموعد',
                icon: 'pi pi-check',
                command: () => this.updateStatus(appointment.appointmentId, 4),
                visible: appointment.status === 'InProgress'
            },
            {
                label: 'إلغاء الموعد',
                icon: 'pi pi-times-circle',
                command: () => this.updateStatus(appointment.appointmentId, 5),
                visible: appointment.status !== 'Completed' && appointment.status !== 'Cancelled'
            }
        ];
    }

    updateStatus(id: number, statusId: number): void {
        this.appointmentService.UpdateAppointmentStatus(id, statusId).subscribe({
            next: () => {
                this.notificationService.success('تم تحديث حالة الموعد بنجاح');
                this.loadAppointments();
                this.loadDashboard();
            },
            error: (err) => {
                this.notificationService.error(this.extractErrorMessage(err, 'فشل في تحديث حالة الموعد'));
            }
        });
    }

    formatTime(time: string): string {
        if (!time) return '';
        const [h, m] = time.split(':');
        let hours = parseInt(h, 10);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`;
    }

    private extractErrorMessage(err: any, defaultMessage: string): string {
        if (err && err.error) {
            if (typeof err.error === 'string') return err.error;
            if (err.error.message) return err.error.message;
            if (err.error.detail) return err.error.detail;
            if (err.error.errors) return err.error.errors[Object.keys(err.error.errors)[0]][0];
        }
        return defaultMessage;
    }
}
