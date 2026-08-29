import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';

import { NotificationService } from '@/app/core/services/notification.service';
import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '@/app/features/doctor/services/doctor.service';
import { PatientForm } from '@/app/features/patient/components/create-edit-patient/patient-form';

import { GetPatientAppointmentResponse } from '../../models/responses/get-patient-appointment-response';
import { GetAllDoctorsInformationsResponse } from '@/app/features/doctor/models/responses/get-all-doctors-informations-response';
import { SlotResponse } from '../../models/responses/slot-response';
import { CreateAndEditAppointmentRequest } from '../../models/requests/create-and-edit-appointment-request';
import { SpecialityService } from '@/app/core/services/speciality.service';
import { GetSpeciality } from '@/app/core/models/get-Speciality';

@Component({
    selector: 'app-add-appointment',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, SelectModule, RadioButtonModule, InputTextModule, DatePickerModule, DialogModule, PatientForm],
    providers: [DatePipe],
    templateUrl: './add-appointment.html',
    styleUrl: './add-appointment.scss'
})
export class AddAppointment implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly appointmentService = inject(AppointmentService);
    private readonly doctorService = inject(DoctorService);
    private readonly specialityService = inject(SpecialityService);
    private readonly notificationService = inject(NotificationService);
    private readonly datePipe = inject(DatePipe);

    patientType: 'existing' | 'new' = 'existing';
    showNewPatientModal = false;

    appointmentStatus: number = 1;

    specialities: GetSpeciality[] = [];
    selectedSpecialty: GetSpeciality | null = null;

    doctors: GetAllDoctorsInformationsResponse[] = [];
    availableSlots: SlotResponse[] = [];

    selectedPatient: GetPatientAppointmentResponse | null = null;
    selectedDoctor: GetAllDoctorsInformationsResponse | null = null;
    selectedDate: Date | null = null;
    selectedSlot: SlotResponse | null = null;

    searchForm: FormGroup = this.fb.group({
        name: ['', Validators.required],
        phone: ['', [Validators.required, Validators.minLength(11)]]
    });

    ngOnInit(): void {
        this.loadSpecialities();
    }

    loadSpecialities(): void {
        this.specialityService.GetAllSpecialities().subscribe({
            next: (res) => {
                this.specialities = res.data;
            },
            error: (err) => {
                this.notificationService.error(this.extractErrorMessage(err, 'فشل في تحميل التخصصات'));
            }
        });
    }

    fetchAvailableSlots(): void {
        this.availableSlots = [];
        this.selectedSlot = null;

        if (!this.selectedDoctor || !this.selectedDate) return;

        const formattedDate = this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!;

        const request = {
            doctorId: this.selectedDoctor.id,
            appointmentDate: formattedDate
        };

        this.appointmentService.GetDoctorAvailableSlots(request).subscribe({
            next: (res) => {
                this.availableSlots = res.data;
            },
            error: (err) => {
                this.notificationService.error(this.extractErrorMessage(err, 'حدث خطأ أثناء جلب المواعيد'));
            }
        });
    }

    searchPatient(): void {
        if (this.searchForm.invalid) return;

        const request = {
            name: this.searchForm.value.name,
            phoneNumber: this.searchForm.value.phone
        };

        this.appointmentService.GetPatientInformationForAppointment(request).subscribe({
            next: (res) => {
                if (res.data) {
                    this.selectedPatient = res.data;
                    this.notificationService.success('تم العثور على المريض بنجاح');
                    this.fetchAvailableSlots();
                }
            },
            error: (err) => {
                this.selectedPatient = null;
                this.notificationService.info(this.extractErrorMessage(err, 'لم يتم العثور على مريض بهذه البيانات'));
            }
        });
    }

    onPatientTypeChange(): void {
        if (this.patientType === 'new') {
            this.showNewPatientModal = true;
        }
    }

    handleNewPatientSaved(patientData: any): void {
        this.showNewPatientModal = false;
        this.patientType = 'existing';

        this.searchForm.patchValue({
            name: patientData.firstName,
            phone: patientData.phoneNumber
        });

        this.selectedPatient = {
            id: patientData.id,
            fullName: `${patientData.firstName} ${patientData.lastName}`,
            phoneNumber: patientData.phoneNumber,
            gender: patientData.gender.toString()
        };

        this.fetchAvailableSlots();
    }

    onSpecialtyChange(): void {
        this.selectedDoctor = null;
        this.selectedDate = null;
        this.availableSlots = [];
        this.selectedSlot = null;

        if (!this.selectedSpecialty) return;

        this.doctorService.GetAllDoctorsBySpecialty(this.selectedSpecialty.id).subscribe({
            next: (res) => {
                this.doctors = res.data;
            },
            error: (err) => {
                this.notificationService.error(this.extractErrorMessage(err, 'فشل في تحميل الأطباء'));
            }
        });
    }

    onDoctorChange(): void {
        this.selectedSlot = null;
        if (!this.selectedDate) {
            this.selectedDate = new Date();
        }
        this.fetchAvailableSlots();
    }

    onDateSelect(): void {
        this.fetchAvailableSlots();
    }

    selectSlot(slot: SlotResponse): void {
        if (slot.status === 2 || slot.status === ('Available' as any)) {
            if (this.selectedSlot === slot) {
                this.selectedSlot = null;
            } else {
                this.selectedSlot = slot;
            }
        }
    }

    formatTime(time: string | undefined): string {
        if (!time) return '';
        const [h, m] = time.split(':');
        let hours = parseInt(h, 10);
        const ampm = hours >= 12 ? 'م' : 'ص';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${hours}:${m} ${ampm}`;
    }

    bookAppointment(): void {
        if (!this.selectedPatient || !this.selectedDoctor || !this.selectedDate || !this.selectedSlot) {
            this.notificationService.error('يرجى استكمال جميع البيانات قبل تأكيد الحجز');
            return;
        }

        const payload: CreateAndEditAppointmentRequest = {
            patientId: this.selectedPatient.id,
            doctorId: this.selectedDoctor.id,
            appointmentDate: this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd')!,
            startTime: this.selectedSlot.startTime,
            endTime: this.selectedSlot.endTime,
            status: this.appointmentStatus
        };

        this.appointmentService.CreateAppointment(payload).subscribe({
            next: (res) => {
                this.notificationService.success('تم تأكيد الحجز بنجاح!');
                this.resetForm();
            },
            error: (err) => {
                const msg = this.extractErrorMessage(err, 'حدث خطأ أثناء تأكيد الحجز');
                this.notificationService.error(msg);
            }
        });
    }

    resetForm(): void {
        this.selectedPatient = null;
        this.selectedDoctor = null;
        this.selectedSpecialty = null;
        this.selectedDate = null;
        this.selectedSlot = null;
        this.availableSlots = [];
        this.appointmentStatus = 1;
        this.searchForm.reset();
    }

    private extractErrorMessage(err: any, defaultMessage: string): string {
        if (err && err.error) {
            if (typeof err.error === 'string') {
                return err.error;
            }
            if (err.error.message) {
                return err.error.message;
            }
            if (err.error.detail) {
                return err.error.detail;
            }
            if (err.error.title) {
                return err.error.title;
            }
            if (err.error.errors) {
                const firstErrorKey = Object.keys(err.error.errors)[0];
                return err.error.errors[firstErrorKey][0];
            }
        }
        return defaultMessage;
    }
}
