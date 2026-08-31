import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';

import { AppointmentService } from '@/app/features/appointment/services/appointment.service';
import { DoctorService } from '@/app/features/doctor/services/doctor.service';
import { PatientService } from '@/app/features/patient/services/patient.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';

import { GetAppointmentDashboardDtoResponse } from '@/app/features/appointment/models/responses/get-appointment-dashboard-response';
import { GetAllDoctorsInformationsResponse } from '@/app/features/doctor/models/responses/get-all-doctors-informations-response';
import { AppointmentSearchDtoRequest } from '@/app/features/appointment/models/requests/appointment-search-request';
import { GetAllAppointmentDtoResponse } from '@/app/features/appointment/models/responses/get-all-appointment-response';
import { GetPatientResponse } from '@/app/features/patient/models/responses/get-patient-response';
import { MedicalRecordDialogComponent } from '../medical-record-dialog/medical-record-dialog';
import { PrescriptionDialogComponent } from '../prescription-dialog/prescription-dialog';

export interface DoctorHeaderInfo {
    fullName: string;
    specialty: string;
    image?: string | null;
}

@Component({
    selector: 'app-doctor-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, DatePickerModule, SelectModule, ButtonModule, TableModule, PaginatorModule, MedicalRecordDialogComponent, PrescriptionDialogComponent],
    providers: [DatePipe],
    templateUrl: './doctor-dashboard.html',
    styleUrl: './doctor-dashboard.scss'
})
export class DoctorDashboardComponent implements OnInit {
    private readonly appointmentService = inject(AppointmentService);
    private readonly doctorService = inject(DoctorService);
    private readonly patientService = inject(PatientService);
    public readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);
    private readonly datePipe = inject(DatePipe);
    private readonly cdr = inject(ChangeDetectorRef);

    // State
    today: Date = new Date();
    minDate: Date = new Date();
    selectedDate: Date = new Date();

    doctors: GetAllDoctorsInformationsResponse[] = [];
    selectedDoctorId: number | null = null;
    currentDoctorInfo: DoctorHeaderInfo | null = null;

    loadingDashboard: boolean = false;
    dashboardData: GetAppointmentDashboardDtoResponse = {
        totalAppointments: 0,
        todayAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0
    };

    // Table & Status Filters
    loadingAppointments: boolean = false;
    appointments: GetAllAppointmentDtoResponse[] = [];
    totalRecords: number = 0;
    selectedAppointment: GetAllAppointmentDtoResponse | null = null;

    selectedStatusTab: number | null = null;
    statusTabs = [
        { label: 'الكل', value: null },
        { label: 'مجدول', value: 1 }, // Scheduled
        { label: 'في الانتظار', value: 2 }, // CheckedIn
        { label: 'في الكشف', value: 3 }, // InProgress
        { label: 'مكتمل', value: 4 }, // Completed
        { label: 'ملغي', value: 5 }, // Cancelled
        { label: 'لم يحضر', value: 6 } // NoShow
    ];

    searchRequest: AppointmentSearchDtoRequest = {
        pageNumber: 1,
        pageSize: 6,
        fullNameOrPhoneNumberSearch: null,
        statusSearch: null,
        doctorIdSearch: null,
        dateSearch: null,
        sortField: 'time',
        sortOrder: 1
    };

    // Waiting Queue State
    loadingQueue: boolean = false;
    waitingQueue: GetAllAppointmentDtoResponse[] = [];
    callingNext: boolean = false;

    // Current Patient State
    loadingPatient: boolean = false;
    patientData: GetPatientResponse | null = null;
    actionInProgress: boolean = false;

    // Dialogs
    showMedicalRecordModal: boolean = false;
    showPrescriptionModal: boolean = false;

    get isDoctorUser(): boolean {
        const user = this.authService.currentUser();
        return !!user?.roles?.includes('Doctor');
    }

    get isPreviousDisabled(): boolean {
        if (!this.selectedDate) return true;
        const currentSelected = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate());
        const todayDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
        return currentSelected <= todayDate;
    }

    get canStartExamination(): boolean {
        return this.selectedAppointment?.status === 'CheckedIn';
    }

    get canFinishExamination(): boolean {
        return this.selectedAppointment?.status === 'InProgress';
    }

    ngOnInit(): void {
        this.today = new Date();
        this.minDate = new Date();
        this.selectedDate = new Date();
        this.initializeDoctorContext();
    }

    private initializeDoctorContext(): void {
        if (this.isDoctorUser) {
            this.loadCurrentDoctorByUserId();
        } else {
            this.loadDoctorsForAdmin();
        }
    }

    private refreshDashboardData(): void {
        this.loadDashboard();
        this.loadAppointments();
        this.loadWaitingQueue();
    }

    private loadCurrentDoctorByUserId(): void {
        const currentUser = this.authService.currentUser();
        if (!currentUser || !currentUser.id) {
            this.notificationService.error('لم يتم العثور على بيانات الطبيب الحالي 1');
            return;
        }

        this.doctorService.GetDoctorByUserId(currentUser.id).subscribe({
            next: (res) => {
                if (res.data) {
                    this.selectedDoctorId = res.data.id;

                    const docName = currentUser.fullName || 'طبيب';

                    this.currentDoctorInfo = {
                        fullName: docName,
                        specialty: res.data.specialtieName,
                        image: res.data.profileImageUrl
                    };

                    this.refreshDashboardData();
                } else {
                    this.notificationService.error('لم يتم العثور على بيانات الطبيب الحالي 2');
                }
            },
            error: (err) => {
                const errorMsg = err?.error?.errors?.[0] || 'لم يتم العثور على بيانات الطبيب الحالي 3';
                this.notificationService.error(errorMsg);
            }
        });
    }

    private loadDoctorsForAdmin(): void {
        this.doctorService.GetAllDoctorsInformations({ pageNumber: 1, pageSize: 1000 } as any).subscribe({
            next: (res) => {
                if (res.data && res.data.data && res.data.data.length > 0) {
                    this.doctors = res.data.data;
                    this.selectedDoctorId = this.doctors[0].id;
                    this.currentDoctorInfo = {
                        fullName: this.doctors[0].fullName,
                        specialty: this.doctors[0].specialty,
                        image: this.doctors[0].image
                    };
                    this.refreshDashboardData();
                }
            },
            error: () => {
                this.notificationService.error('فشل في تحميل قائمة الأطباء');
            }
        });
    }

    onDoctorChange(): void {
        const doc = this.doctors.find((d) => d.id === this.selectedDoctorId);
        if (doc) {
            this.currentDoctorInfo = {
                fullName: doc.fullName,
                specialty: doc.specialty,
                image: doc.image
            };
        }
        this.searchRequest.pageNumber = 1;
        this.selectedAppointment = null;
        this.patientData = null;
        this.refreshDashboardData();
    }

    onDateChange(): void {
        if (!this.selectedDate) {
            this.selectedDate = new Date();
        }
        const currentSelected = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), this.selectedDate.getDate());
        const todayDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
        if (currentSelected < todayDate) {
            this.selectedDate = new Date();
            this.notificationService.error('لا يمكن اختيار تاريخ يسبق اليوم');
        }
        this.searchRequest.pageNumber = 1;
        this.selectedAppointment = null;
        this.patientData = null;
        this.refreshDashboardData();
    }

    previousDay(): void {
        if (this.isPreviousDisabled) return;
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        this.selectedDate = newDate;
        this.onDateChange();
    }

    nextDay(): void {
        const newDate = new Date(this.selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        this.selectedDate = newDate;
        this.onDateChange();
    }

    goToToday(): void {
        this.selectedDate = new Date();
        this.onDateChange();
    }

    selectStatusTab(status: number | null): void {
        this.selectedStatusTab = status;
        this.searchRequest.statusSearch = status;
        this.searchRequest.pageNumber = 1;
        this.loadAppointments();
    }

    selectAppointment(appointment: GetAllAppointmentDtoResponse): void {
        if (this.selectedAppointment?.appointmentId === appointment.appointmentId && this.patientData) {
            return;
        }
        this.selectedAppointment = appointment;
        this.loadPatientDetails(appointment);
    }

    private loadPatientDetails(appointment: GetAllAppointmentDtoResponse): void {
        this.loadingPatient = true;
        this.patientData = null;
        this.cdr.detectChanges();

        this.appointmentService
            .GetPatientInformationForAppointment({
                name: appointment.patientFullName,
                phoneNumber: appointment.patientPhoneNumber
            })
            .subscribe({
                next: (res) => {
                    if (res.data && res.data.id) {
                        this.patientService.GetPatient(res.data.id).subscribe({
                            next: (patientRes) => {
                                if (patientRes.data) {
                                    this.patientData = patientRes.data;
                                }
                                this.loadingPatient = false;
                                this.cdr.detectChanges();
                            },
                            error: () => {
                                this.loadingPatient = false;
                                this.cdr.detectChanges();
                            }
                        });
                    } else {
                        this.loadingPatient = false;
                        this.cdr.detectChanges();
                    }
                },
                error: () => {
                    this.loadingPatient = false;
                    this.cdr.detectChanges();
                }
            });
    }

    onPageChange(event: any): void {
        this.searchRequest.pageNumber = event.page + 1;
        this.searchRequest.pageSize = event.rows;
        this.loadAppointments();
    }

    loadDashboard(): void {
        if (!this.selectedDoctorId) return;

        const dateStr = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!;
        this.loadingDashboard = true;
        this.cdr.detectChanges();

        this.appointmentService.GetDoctorAppointmentDashboard(this.selectedDoctorId, dateStr).subscribe({
            next: (res) => {
                if (res.data) {
                    this.dashboardData = res.data;
                }
                this.loadingDashboard = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loadingDashboard = false;
                const errorMsg = err?.error?.errors?.[0] || 'حدث خطأ أثناء جلب بيانات لوحة التحكم';
                this.notificationService.error(errorMsg);
                this.cdr.detectChanges();
            }
        });
    }

    loadAppointments(): void {
        if (!this.selectedDoctorId) return;

        this.loadingAppointments = true;
        this.searchRequest.doctorIdSearch = this.selectedDoctorId;
        this.searchRequest.dateSearch = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');
        this.searchRequest.statusSearch = this.selectedStatusTab;
        this.cdr.detectChanges();

        this.appointmentService.GetAllAppointment(this.searchRequest).subscribe({
            next: (res) => {
                if (res.data) {
                    this.appointments = res.data.data;
                    this.totalRecords = res.data.totalRecords;
                    if (this.appointments.length > 0 && !this.selectedAppointment) {
                        this.selectAppointment(this.appointments[0]);
                    }
                }
                this.loadingAppointments = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loadingAppointments = false;
                const errorMsg = err?.error?.errors?.[0] || 'حدث خطأ أثناء جلب المواعيد';
                this.notificationService.error(errorMsg);
                this.cdr.detectChanges();
            }
        });
    }

    loadWaitingQueue(): void {
        if (!this.selectedDoctorId) return;

        this.loadingQueue = true;
        const dateStr = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd');

        const queueRequest: AppointmentSearchDtoRequest = {
            pageNumber: 1,
            pageSize: 50,
            doctorIdSearch: this.selectedDoctorId,
            dateSearch: dateStr,
            statusSearch: 2, // CheckedIn
            sortField: 'time',
            sortOrder: 1 // Ascending queue order
        };

        this.appointmentService.GetAllAppointment(queueRequest).subscribe({
            next: (res) => {
                if (res.data) {
                    this.waitingQueue = res.data.data;
                }
                this.loadingQueue = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.loadingQueue = false;
                this.cdr.detectChanges();
            }
        });
    }

    callNextPatient(): void {
        if (this.waitingQueue.length === 0) {
            this.notificationService.error('لا يوجد مرضى في قائمة الانتظار');
            return;
        }

        const nextPatient = this.waitingQueue[0];
        this.callingNext = true;
        this.cdr.detectChanges();

        // Valid transition: CheckedIn (2) -> InProgress (3)
        this.appointmentService.UpdateAppointmentStatus(nextPatient.appointmentId, 3).subscribe({
            next: () => {
                this.callingNext = false;
                this.notificationService.success(`تم استدعاء المريض ${nextPatient.patientFullName} لغرفة الكشف بنجاح`);
                this.selectedAppointment = nextPatient;
                this.selectedAppointment.status = 'InProgress';
                this.loadPatientDetails(nextPatient);
                this.refreshDashboardData();
            },
            error: (err) => {
                this.callingNext = false;
                const errorMsg = err?.error?.errors?.[0] || 'فشل في استدعاء المريض';
                this.notificationService.error(errorMsg);
                this.cdr.detectChanges();
            }
        });
    }

    startExamination(): void {
        if (!this.selectedAppointment || this.selectedAppointment.status !== 'CheckedIn') return;

        this.actionInProgress = true;
        this.cdr.detectChanges();

        // Transition: CheckedIn (2) -> InProgress (3)
        this.appointmentService.UpdateAppointmentStatus(this.selectedAppointment.appointmentId, 3).subscribe({
            next: () => {
                this.actionInProgress = false;
                this.notificationService.success('تم بدء الكشف بنجاح');
                if (this.selectedAppointment) {
                    this.selectedAppointment.status = 'InProgress';
                }
                this.refreshDashboardData();
            },
            error: (err) => {
                this.actionInProgress = false;
                const errorMsg = err?.error?.errors?.[0] || 'فشل في بدء الكشف';
                this.notificationService.error(errorMsg);
                this.cdr.detectChanges();
            }
        });
    }

    finishExamination(): void {
        if (!this.selectedAppointment || this.selectedAppointment.status !== 'InProgress') return;

        this.actionInProgress = true;
        this.cdr.detectChanges();

        // Transition: InProgress (3) -> Completed (4)
        this.appointmentService.UpdateAppointmentStatus(this.selectedAppointment.appointmentId, 4).subscribe({
            next: () => {
                this.actionInProgress = false;
                this.notificationService.success('تم إنهاء الكشف بنجاح');
                if (this.selectedAppointment) {
                    this.selectedAppointment.status = 'Completed';
                }
                this.refreshDashboardData();
            },
            error: (err) => {
                this.actionInProgress = false;
                const errorMsg = err?.error?.errors?.[0] || 'فشل في إنهاء الكشف';
                this.notificationService.error(errorMsg);
                this.cdr.detectChanges();
            }
        });
    }

    openMedicalRecordModal(): void {
        if (!this.selectedAppointment) return;
        this.showMedicalRecordModal = true;
    }

    handleMedicalRecordSaved(recordId: number): void {
        // Medical Record saved successfully
    }

    openPrescriptionModal(): void {
        if (!this.selectedAppointment) return;
        this.showPrescriptionModal = true;
    }

    handlePrescriptionSaved(prescriptionId: number): void {
        // Prescription saved successfully
    }

    calculateAge(dob: string | undefined | null): number | null {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 0 ? age : null;
    }

    formatTime(timeStr: string): string {
        if (!timeStr) return '—';
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            let hour = parseInt(parts[0], 10);
            const minute = parts[1];
            const ampm = hour >= 12 ? 'م' : 'ص';
            hour = hour % 12;
            hour = hour ? hour : 12;
            const hourStr = hour < 10 ? '0' + hour : hour.toString();
            return `${hourStr}:${minute} ${ampm}`;
        }
        return timeStr;
    }
}
