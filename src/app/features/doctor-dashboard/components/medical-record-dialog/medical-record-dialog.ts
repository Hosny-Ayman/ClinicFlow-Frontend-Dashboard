import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { MedicalRecordService } from '@/app/features/medical-record/services/medical-record.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { CreateMedicalRecordRequest } from '@/app/features/medical-record/models/requests/create-medical-record-request';
import { UpdateMedicalRecordRequest } from '@/app/features/medical-record/models/requests/update-medical-record-request';

@Component({
    selector: 'app-medical-record-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
    templateUrl: './medical-record-dialog.html',
    styleUrl: './medical-record-dialog.scss'
})
export class MedicalRecordDialogComponent implements OnChanges {
    private readonly fb = inject(FormBuilder);
    private readonly medicalRecordService = inject(MedicalRecordService);
    private readonly notificationService = inject(NotificationService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() appointmentId: number | null = null;
    @Input() patientName: string | null = null;
    @Output() saved = new EventEmitter<number>();

    isEditMode: boolean = false;
    medicalRecordId: number | null = null;
    loading: boolean = false;
    saving: boolean = false;

    recordForm: FormGroup = this.fb.group({
        diagnosis: ['', [Validators.required, Validators.maxLength(1000)]],
        symptoms: ['', [Validators.maxLength(2000)]],
        treatmentPlan: ['', [Validators.required, Validators.maxLength(1000)]],
        notes: ['', [Validators.maxLength(3000)]]
    });

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true && this.appointmentId) {
            this.loadMedicalRecord();
        }
    }

    loadMedicalRecord(): void {
        if (!this.appointmentId) return;

        this.loading = true;
        this.isEditMode = false;
        this.medicalRecordId = null;
        this.recordForm.reset();
        this.cdr.detectChanges();

        this.medicalRecordService.GetMedicalRecordByAppointmentId(this.appointmentId).subscribe({
            next: (res) => {
                if (res.data) {
                    this.isEditMode = true;
                    this.medicalRecordId = res.data.id;
                    this.recordForm.patchValue({
                        diagnosis: res.data.diagnosis,
                        symptoms: res.data.symptoms || '',
                        treatmentPlan: res.data.treatmentPlan,
                        notes: res.data.notes || ''
                    });
                }
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;
                if (err?.status === 404) {
                    this.isEditMode = false;
                    this.medicalRecordId = null;
                } else {
                    const errorMsg = err?.error?.errors?.[0] || 'حدث خطأ أثناء فحص السجل الطبي';
                    this.notificationService.error(errorMsg);
                }
                this.cdr.detectChanges();
            }
        });
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.recordForm.reset();
        this.isEditMode = false;
        this.medicalRecordId = null;
    }

    onSubmit(): void {
        if (this.recordForm.invalid) {
            this.recordForm.markAllAsTouched();
            return;
        }

        if (!this.appointmentId) {
            this.notificationService.error('رقم الموعد غير متوفر');
            return;
        }

        this.saving = true;
        const formValues = this.recordForm.value;

        if (this.isEditMode && this.medicalRecordId) {
            const updatePayload: UpdateMedicalRecordRequest = {
                id: this.medicalRecordId,
                diagnosis: formValues.diagnosis.trim(),
                symptoms: formValues.symptoms?.trim() || null,
                treatmentPlan: formValues.treatmentPlan.trim(),
                notes: formValues.notes?.trim() || null
            };

            this.medicalRecordService.UpdateMedicalRecord(updatePayload).subscribe({
                next: () => {
                    this.saving = false;
                    this.notificationService.success('تم تحديث السجل الطبي بنجاح');
                    this.saved.emit(this.medicalRecordId!);
                    this.close();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.saving = false;
                    const errorMsg = err?.error?.errors?.[0] || 'فشل في تحديث السجل الطبي';
                    this.notificationService.error(errorMsg);
                    this.cdr.detectChanges();
                }
            });
        } else {
            const createPayload: CreateMedicalRecordRequest = {
                appointmentId: this.appointmentId,
                diagnosis: formValues.diagnosis.trim(),
                symptoms: formValues.symptoms?.trim() || null,
                treatmentPlan: formValues.treatmentPlan.trim(),
                notes: formValues.notes?.trim() || null
            };

            this.medicalRecordService.CreateMedicalRecord(createPayload).subscribe({
                next: (res) => {
                    this.saving = false;
                    this.notificationService.success('تم إضافة السجل الطبي بنجاح');
                    this.saved.emit(res.data);
                    this.close();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.saving = false;
                    const errorMsg = err?.error?.errors?.[0] || 'فشل في إضافة السجل الطبي';
                    this.notificationService.error(errorMsg);
                    this.cdr.detectChanges();
                }
            });
        }
    }
}
