import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

import { TextInput } from '@/app/shared/components/inputs/text-input/text-input';
import { NumberInput } from '@/app/shared/components/inputs/number-input/number-input';
import { UserValidators } from '@/app/shared/validators/user.validators';
import { NotificationService } from '@/app/core/services/notification.service';
import { PatientService } from '../../services/patient.service';
import { CreateAndEditPatientRequest } from '../../models/requests/create-and-edit-patient-request';

@Component({
    selector: 'app-patient-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink, SelectModule, RadioButtonModule, InputTextModule, TextareaModule, TextInput, NumberInput],
    templateUrl: './patient-form.html',
    styleUrl: './patient-form.scss'
})
export class PatientForm implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly patientService = inject(PatientService);
    private readonly notificationService = inject(NotificationService);

    private readonly patientId = this.route.snapshot.paramMap.get('id');

    patientForm = this.fb.group({
        firstName: this.fb.nonNullable.control('', UserValidators.firstName),
        lastName: this.fb.nonNullable.control('', UserValidators.lastName),
        email: this.fb.control<string | null>(null, [Validators.email]),
        phoneNumber: this.fb.control<string | null>(null, [Validators.minLength(11), Validators.maxLength(20)]),
        dateOfBirth: this.fb.nonNullable.control<string>('', UserValidators.required),
        gender: this.fb.nonNullable.control<number>(1, UserValidators.required),
        nationalId: this.fb.control<string | null>(null, [Validators.maxLength(20)]),
        bloodType: this.fb.control<number | null>(null),
        emergencyContactName: this.fb.control<string | null>(null, [Validators.maxLength(150)]),
        emergencyContactPhone: this.fb.control<string | null>(null, [Validators.minLength(11), Validators.maxLength(20)]),
        address: this.fb.control<string | null>(null, [Validators.maxLength(250)]),
        notes: this.fb.control<string | null>(null, [Validators.maxLength(500)])
    });

    bloodTypes = [
        { label: 'اختر فصيلة الدم', value: null },
        { label: 'A+', value: 1 },
        { label: 'A-', value: 2 },
        { label: 'B+', value: 3 },
        { label: 'B-', value: 4 },
        { label: 'AB+', value: 5 },
        { label: 'AB-', value: 6 },
        { label: 'O+', value: 7 },
        { label: 'O-', value: 8 }
    ];

    ngOnInit(): void {
        if (this.isEditMode) {
            this.loadPatient();
        }
    }

    loadPatient(): void {
        this.patientService.GetPatient(Number(this.patientId)).subscribe({
            next: (res) => {
                const data = res.data;
                let formattedDate = '';
                if (data.dateOfBirth) {
                    formattedDate = typeof data.dateOfBirth === 'string' ? data.dateOfBirth.split('T')[0] : '';
                }

                let genderValue = 1;
                if (data.gender !== undefined && data.gender !== null) {
                    if (typeof data.gender === 'number') {
                        genderValue = data.gender;
                    } else {
                        genderValue = String(data.gender).toLowerCase() === 'female' ? 2 : 1;
                    }
                }

                let bloodTypeValue: number | null = null;
                if (data.bloodType !== undefined && data.bloodType !== null) {
                    if (typeof data.bloodType === 'number') {
                        bloodTypeValue = data.bloodType;
                    } else {
                        const btStr = String(data.bloodType).toLowerCase().trim();
                        const map: { [k: string]: number } = {
                            'a+': 1, 'apositive': 1, 'a_positive': 1,
                            'a-': 2, 'anegative': 2, 'a_negative': 2,
                            'b+': 3, 'bpositive': 3, 'b_positive': 3,
                            'b-': 4, 'bnegative': 4, 'b_negative': 4,
                            'ab+': 5, 'abpositive': 5, 'ab_positive': 5,
                            'ab-': 6, 'abnegative': 6, 'ab_negative': 6,
                            'o+': 7, 'opositive': 7, 'o_positive': 7,
                            'o-': 8, 'onegative': 8, 'o_negative': 8
                        };
                        bloodTypeValue = map[btStr] ?? null;
                    }
                }

                this.patientForm.patchValue({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email || null,
                    phoneNumber: data.phoneNumber || null,
                    dateOfBirth: formattedDate,
                    gender: genderValue,
                    nationalId: data.nationalId || null,
                    bloodType: bloodTypeValue,
                    emergencyContactName: data.emergencyContactName || null,
                    emergencyContactPhone: data.emergencyContactPhone || null,
                    address: data.address || null,
                    notes: data.notes || null
                });

                this.cdr.detectChanges();
            },
            error: () => {
                this.notificationService.error('حدث خطأ أثناء تحميل بيانات المريض');
            }
        });
    }

    onSubmit(): void {
        if (this.patientForm.invalid) {
            this.patientForm.markAllAsTouched();
            return;
        }

        const formValue = this.patientForm.getRawValue();

        const payload: CreateAndEditPatientRequest = {
            id: this.isEditMode ? Number(this.patientId) : null,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email || null,
            phoneNumber: formValue.phoneNumber || null,
            dateOfBirth: formValue.dateOfBirth,
            gender: Number(formValue.gender),
            nationalId: formValue.nationalId || null,
            bloodType: formValue.bloodType ? Number(formValue.bloodType) : null,
            emergencyContactName: formValue.emergencyContactName || null,
            emergencyContactPhone: formValue.emergencyContactPhone || null,
            address: formValue.address || null,
            notes: formValue.notes || null
        };

        if (this.isEditMode) {
            this.patientService.UpdatePatient(payload).subscribe({
                next: () => {
                    this.notificationService.success('تم حفظ التعديلات بنجاح');
                    this.router.navigate(['/patient/show']);
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء حفظ البيانات');
                }
            });
        } else {
            this.patientService.CreatePatient(payload).subscribe({
                next: () => {
                    this.notificationService.success('تم إضافة المريض بنجاح');
                    this.router.navigate(['/patient/show']);
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء إضافة المريض');
                }
            });
        }
    }

    get isEditMode(): boolean {
        return this.patientId !== null;
    }
}
