import { createUserFormGroup } from '@/app/shared/builders/user-form.builder';
import { UserForm } from '@/app/shared/components/user-form/user-form';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextModule } from 'primeng/inputtext';
import { NumberInput } from '@/app/shared/components/inputs/number-input/number-input';
import { UserValidators } from '@/app/shared/validators/user.validators';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctor.service';
import { SpecialityService } from '@/app/core/services/speciality.service';
import { NotificationService } from '@/app/core/services/notification.service';

@Component({
    selector: 'app-doctor-form',
    imports: [UserForm, ReactiveFormsModule, SelectModule, TextareaModule, RadioButtonModule, InputTextModule, NumberInput],
    templateUrl: './doctor-form.html',
    styleUrl: './doctor-form.scss'
})
export class DoctorForm implements OnInit {
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly doctorId = this.route.snapshot.paramMap.get('id');
    private readonly doctorService = inject(DoctorService);
    private readonly specialityService = inject(SpecialityService);
    private userId: number | null = null;
    private readonly notificationService = inject(NotificationService);

    doctorForm = this.fb.group({
        user: createUserFormGroup(this.fb),
        specialtieName: this.fb.nonNullable.control('', UserValidators.required),
        consultationFee: this.fb.nonNullable.control<number>(0, UserValidators.required),
        bio: this.fb.control(''),
        gender: this.fb.nonNullable.control<number>(1, UserValidators.required),
        experienceYears: this.fb.nonNullable.control<number>(0, UserValidators.required),
        profileImage: this.fb.control<File | null>(null)
    });

    specialties: any[] = [];
    selectedFileUrl: string | ArrayBuffer | null = null;

    ngOnInit(): void {
        this.loadSpecialities();

        if (this.isEditMode) {
            const passwordControl = this.doctorForm.get('user.password');
            if (passwordControl) {
                passwordControl.clearValidators();
                passwordControl.updateValueAndValidity();
            }
            this.loadDoctor();
        }
    }

    loadSpecialities() {
        this.specialityService.GetAllSpecialities().subscribe({
            next: (res) => {
                this.specialties = res.data.map((s: any) => ({
                    label: s.name,
                    value: s.name,
                    id: s.id
                }));
                this.cdr.detectChanges();
            }
        });
    }

    loadDoctor() {
        this.doctorService.GetDoctor(Number(this.doctorId)).subscribe({
            next: (res) => {
                this.doctorForm.patchValue({
                    user: {
                        firstName: res.data.user.firstName,
                        lastName: res.data.user.lastName,
                        email: res.data.user.email,
                        phoneNumber: res.data.user.phoneNumber
                    },
                    specialtieName: res.data.doctor.specialtieName,
                    consultationFee: Number(res.data.doctor.consultationFee),
                    experienceYears: Number(res.data.doctor.experienceYears),
                    gender: String(res.data.doctor.gender).toLowerCase() === 'female' ? 2 : 1,
                    bio: res.data.doctor.bio
                });

                this.userId = res.data.user.id;
                this.selectedFileUrl = res.data.doctor.profileImageUrl;
                this.cdr.detectChanges();
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                this.notificationService.info('حجم الصورة يجب ألا يتخطى 2 ميجابايت');
                return;
            }

            this.doctorForm.patchValue({ profileImage: file });

            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedFileUrl = e.target?.result as string | ArrayBuffer;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(event: Event) {
        event.stopPropagation();
        this.selectedFileUrl = null;
        this.doctorForm.patchValue({ profileImage: null });
        this.cdr.detectChanges();
    }

    onSubmit() {
        if (this.doctorForm.invalid) {
            this.doctorForm.markAllAsTouched();
            return;
        }

        const formValue = this.doctorForm.getRawValue();
        const formData = new FormData();

        formData.append('User.FirstName', formValue.user.firstName);
        formData.append('User.LastName', formValue.user.lastName);
        formData.append('User.Email', formValue.user.email);
        formData.append('User.PhoneNumber', formValue.user.phoneNumber);

        if (!this.isEditMode && formValue.user.password) {
            formData.append('User.Password', formValue.user.password);
        }

        if (this.isEditMode && this.doctorId) {
            formData.append('User.Id', this.userId!.toString());
            formData.append('Doctor.Id', this.doctorId);
        }

        const selectedSpecialty = this.specialties.find((s) => s.value === formValue.specialtieName);
        const specialtyId = selectedSpecialty ? selectedSpecialty.id : 0;

        formData.append('Doctor.SpecialtyId', specialtyId.toString());
        formData.append('Doctor.ConsultationFee', formValue.consultationFee.toString());
        formData.append('Doctor.Gender', formValue.gender.toString());
        formData.append('Doctor.ExperienceYears', formValue.experienceYears.toString());

        if (formValue.bio) {
            formData.append('Doctor.Bio', formValue.bio);
        }

        if (formValue.profileImage) {
            formData.append('Doctor.ProfileImage', formValue.profileImage);

            if (this.isEditMode) {
                formData.append('Doctor.ProfileImageUrl', formValue.profileImage);
            }
        } else if (this.isEditMode && this.selectedFileUrl === null) {
            formData.append('Doctor.IsImageDeleted', 'true');
        }

        if (this.isEditMode) {
            this.doctorService.UpdateDoctor(formData as any).subscribe({
                next: () => this.notificationService.success('تم حفظ التعديلات بنجاح'),
                error: () => this.notificationService.error('حدث خطاء اثناء حفظ البينات')
            });
        } else {
            this.doctorService.CreateDoctor(formData as any).subscribe({
                next: () => this.notificationService.success('تم إضافة الطبيب بنجاح'),
                error: () => this.notificationService.error('حدث خطاء اثناء حفظ البينات')
            });
        }
    }

    get isEditMode(): boolean {
        return this.doctorId !== null;
    }
}
