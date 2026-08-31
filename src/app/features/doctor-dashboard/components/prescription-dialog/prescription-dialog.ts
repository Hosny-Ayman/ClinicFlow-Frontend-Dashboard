import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

import { MedicalRecordService } from '@/app/features/medical-record/services/medical-record.service';
import { PrescriptionService } from '@/app/features/prescription/services/prescription.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { CreatePrescriptionRequest, CreatePrescriptionItemRequest } from '@/app/features/prescription/models/requests/create-prescription-request';
import { UpdatePrescriptionRequest, UpdatePrescriptionItemRequest } from '@/app/features/prescription/models/requests/update-prescription-request';

@Component({
    selector: 'app-prescription-dialog',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
    templateUrl: './prescription-dialog.html',
    styleUrl: './prescription-dialog.scss'
})
export class PrescriptionDialogComponent implements OnChanges {
    private readonly fb = inject(FormBuilder);
    private readonly medicalRecordService = inject(MedicalRecordService);
    private readonly prescriptionService = inject(PrescriptionService);
    private readonly notificationService = inject(NotificationService);
    private readonly cdr = inject(ChangeDetectorRef);

    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Input() appointmentId: number | null = null;
    @Input() patientName: string | null = null;
    @Output() saved = new EventEmitter<number>();

    isEditMode: boolean = false;
    medicalRecordId: number | null = null;
    prescriptionId: number | null = null;
    loading: boolean = false;
    saving: boolean = false;

    prescriptionForm: FormGroup = this.fb.group({
        notes: ['', [Validators.maxLength(2000)]],
        prescriptionItems: this.fb.array([])
    });

    get items(): FormArray {
        return this.prescriptionForm.get('prescriptionItems') as FormArray;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['visible']?.currentValue === true && this.appointmentId) {
            this.checkAndLoadPrescription();
        }
    }

    private createItemFormGroup(item?: Partial<UpdatePrescriptionItemRequest>): FormGroup {
        return this.fb.group({
            id: [item?.id || 0],
            medicationName: [item?.medicationName || '', [Validators.required, Validators.maxLength(200)]],
            dosage: [item?.dosage || '', [Validators.required, Validators.maxLength(100)]],
            frequency: [item?.frequency || '', [Validators.required, Validators.maxLength(100)]],
            duration: [item?.duration || '', [Validators.required, Validators.maxLength(100)]],
            instructions: [item?.instructions || '', [Validators.maxLength(1000)]]
        });
    }

    addItem(): void {
        this.items.push(this.createItemFormGroup());
        this.cdr.detectChanges();
    }

    removeItem(index: number): void {
        if (this.items.length <= 1) {
            this.notificationService.error('يجب أن تحتوي الوصفة على دواء واحد على الأقل');
            return;
        }
        this.items.removeAt(index);
        this.cdr.detectChanges();
    }

    checkAndLoadPrescription(): void {
        if (!this.appointmentId) return;

        this.loading = true;
        this.isEditMode = false;
        this.medicalRecordId = null;
        this.prescriptionId = null;
        this.prescriptionForm.reset();
        this.items.clear();
        this.cdr.detectChanges();

        // 1. Check if MedicalRecord exists first
        this.medicalRecordService.GetMedicalRecordByAppointmentId(this.appointmentId).subscribe({
            next: (recordRes) => {
                if (recordRes.data && recordRes.data.id) {
                    this.medicalRecordId = recordRes.data.id;
                    this.loadPrescriptionData(this.medicalRecordId);
                } else {
                    this.loading = false;
                    this.notificationService.error('يجب إضافة ملاحظة / تشخيص طبي للمريض أولاً قبل كتابة الوصفة');
                    this.close();
                    this.cdr.detectChanges();
                }
            },
            error: (err) => {
                this.loading = false;
                if (err?.status === 404) {
                    this.notificationService.error('يجب إضافة ملاحظة / تشخيص طبي للمريض أولاً قبل كتابة الوصفة');
                } else {
                    const errorMsg = err?.error?.errors?.[0] || 'فشل في التحقق من السجل الطبي للمريض';
                    this.notificationService.error(errorMsg);
                }
                this.close();
                this.cdr.detectChanges();
            }
        });
    }

    private loadPrescriptionData(medicalRecordId: number): void {
        this.prescriptionService.GetPrescriptionByMedicalRecordId(medicalRecordId).subscribe({
            next: (presRes) => {
                if (presRes.data) {
                    // EDIT MODE
                    this.isEditMode = true;
                    this.prescriptionId = presRes.data.id;
                    this.prescriptionForm.patchValue({
                        notes: presRes.data.notes || ''
                    });

                    this.items.clear();
                    if (presRes.data.prescriptionItems && presRes.data.prescriptionItems.length > 0) {
                        for (const item of presRes.data.prescriptionItems) {
                            this.items.push(
                                this.createItemFormGroup({
                                    id: item.id,
                                    medicationName: item.medicationName,
                                    dosage: item.dosage,
                                    frequency: item.frequency,
                                    duration: item.duration,
                                    instructions: item.instructions || ''
                                })
                            );
                        }
                    } else {
                        this.items.push(this.createItemFormGroup());
                    }
                }
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.loading = false;
                // 404 -> CREATE MODE
                if (err?.status === 404) {
                    this.isEditMode = false;
                    this.prescriptionId = null;
                    this.items.clear();
                    this.items.push(this.createItemFormGroup());
                } else {
                    const errorMsg = err?.error?.errors?.[0] || 'حدث خطأ أثناء فحص الوصفة الطبية';
                    this.notificationService.error(errorMsg);
                    this.close();
                }
                this.cdr.detectChanges();
            }
        });
    }

    close(): void {
        this.visible = false;
        this.visibleChange.emit(false);
        this.prescriptionForm.reset();
        this.items.clear();
        this.isEditMode = false;
        this.medicalRecordId = null;
        this.prescriptionId = null;
    }

    onSubmit(): void {
        if (this.prescriptionForm.invalid) {
            this.prescriptionForm.markAllAsTouched();
            return;
        }

        if (this.items.length === 0) {
            this.notificationService.error('يجب إضافة دواء واحد على الأقل في الوصفة الطبية');
            return;
        }

        if (!this.medicalRecordId && !this.isEditMode) {
            this.notificationService.error('رقم السجل الطبي غير متوفر');
            return;
        }

        this.saving = true;
        const formValues = this.prescriptionForm.value;

        if (this.isEditMode && this.prescriptionId) {
            const updatePayload: UpdatePrescriptionRequest = {
                id: this.prescriptionId,
                notes: formValues.notes?.trim() || null,
                prescriptionItems: formValues.prescriptionItems.map((item: any) => ({
                    id: item.id || 0,
                    medicationName: item.medicationName.trim(),
                    dosage: item.dosage.trim(),
                    frequency: item.frequency.trim(),
                    duration: item.duration.trim(),
                    instructions: item.instructions?.trim() || null
                }))
            };

            this.prescriptionService.UpdatePrescription(updatePayload).subscribe({
                next: () => {
                    this.saving = false;
                    this.notificationService.success('تم تحديث الوصفة الطبية بنجاح');
                    this.saved.emit(this.prescriptionId!);
                    this.close();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.saving = false;
                    const errorMsg = err?.error?.errors?.[0] || 'فشل في تحديث الوصفة الطبية';
                    this.notificationService.error(errorMsg);
                    this.cdr.detectChanges();
                }
            });
        } else {
            const createPayload: CreatePrescriptionRequest = {
                medicalRecordId: this.medicalRecordId!,
                notes: formValues.notes?.trim() || null,
                prescriptionItems: formValues.prescriptionItems.map((item: any) => ({
                    medicationName: item.medicationName.trim(),
                    dosage: item.dosage.trim(),
                    frequency: item.frequency.trim(),
                    duration: item.duration.trim(),
                    instructions: item.instructions?.trim() || null
                }))
            };

            this.prescriptionService.CreatePrescription(createPayload).subscribe({
                next: (res) => {
                    this.saving = false;
                    this.notificationService.success('تم إنشاء وإرسال الوصفة الطبية بنجاح');
                    this.saved.emit(res.data);
                    this.close();
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    this.saving = false;
                    const errorMsg = err?.error?.errors?.[0] || 'فشل في إنشاء الوصفة الطبية';
                    this.notificationService.error(errorMsg);
                    this.cdr.detectChanges();
                }
            });
        }
    }
}
