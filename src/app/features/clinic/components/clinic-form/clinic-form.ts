import { Password } from 'primeng/password';
import { LoginRequest } from '@/app/features/auth/models/login-request';
import { UserForm } from '@/app/shared/components/user-form/user-form';
import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CreateClinicService } from '../services/create-clinic.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { isInvalid } from '@/app/shared/utils/form.utils';
import { createUserFormGroup } from '@/app/shared/builders/user-form.builder';
import { CreateClinicResponse } from '@/app/features/public/create-clinic/models/responses/CreateClinicResponse';
import { DataForm } from '../../models/form/formData';
import { TextInput } from '@/app/shared/components/inputs/text-input/text-input';
import { NumberInput } from '@/app/shared/components/inputs/number-input/number-input';

@Component({
    selector: 'app-clinic-form',
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, UserForm, NgClass, TextInput, NumberInput],
    templateUrl: './clinic-form.html',
    styleUrl: './clinic-form.scss'
})
export class ClinicForm {
    stepCompleted = output<void>();
    clinicDtaInfo = output<CreateClinicResponse>();
    loginDtaInfo = output<LoginRequest>();

    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);

    private readonly clinicId = this.route.snapshot.paramMap.get('id');

    private clinicService = inject(CreateClinicService);
    private notificationService = inject(NotificationService);

    selectedFileUrl: string | ArrayBuffer | null = null;
    protected readonly isInvalid = isInvalid;

    clinicForm = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(150)]],
        phone: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(20)]],
        email: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required, Validators.maxLength(300)]],
        description: [''],
        logoImage: [null as File | null],
        user: createUserFormGroup(this.fb)
    });

    get f() {
        return this.clinicForm.controls;
    }

    ngOnInit(): void {
        if (this.isEditMode) {
            const userGroup = this.clinicForm.get('user') as FormGroup;
            if (userGroup) {
                Object.keys(userGroup.controls).forEach((key) => {
                    const control = userGroup.get(key);
                    control?.clearValidators();
                    control?.updateValueAndValidity();
                });
            }
            this.loadClinicData();
        }
    }

    loadClinicData() {
        this.clinicService.GetClinic().subscribe({
            next: (res) => {
                if (res.data) {
                    this.clinicForm.patchValue({
                        name: res.data.name,
                        phone: res.data.phone,
                        email: res.data.email,
                        address: res.data.address,
                        description: res.data.description
                    });

                    this.selectedFileUrl = res.data.logoUrl ?? null;
                    this.cdr.detectChanges();
                }
            },
            error: () => this.notificationService.error('حدث خطأ أثناء تحميل بيانات العيادة')
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                this.notificationService.info('حجم الشعار يجب ألا يتخطى 2 ميجابايت');
                return;
            }

            this.clinicForm.patchValue({ logoImage: file });

            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedFileUrl = e.target?.result as string | ArrayBuffer;
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
            this.cdr.detectChanges();
        }
    }

    removeImage(event: Event) {
        event.stopPropagation();
        this.selectedFileUrl = null;
        this.clinicForm.patchValue({ logoImage: null });
        this.cdr.detectChanges();
    }

    onSubmit() {
        if (this.clinicForm.invalid) {
            this.clinicForm.markAllAsTouched();
            return;
        }

        const formValue = this.clinicForm.getRawValue();
        const formData = new FormData();

        if (this.isEditMode) {
            formData.append('Name', formValue.name ?? '');
            formData.append('Phone', formValue.phone ?? '');
            formData.append('Email', formValue.email ?? '');
            formData.append('Address', formValue.address ?? '');

            if (formValue.description) {
                formData.append('Description', formValue.description);
            }

            if (formValue.logoImage) {
                formData.append('LogoUrl', formValue.logoImage);
                formData.append('IsImageDelted', 'false');
            } else if (this.selectedFileUrl === null) {
                formData.append('IsImageDelted', 'true');
            } else {
                formData.append('IsImageDelted', 'false');
            }

            this.clinicService.UpdateClinic(formData as any).subscribe({
                next: () => {
                    this.notificationService.success('تم تحديث بيانات العيادة بنجاح');
                },
                error: () => this.notificationService.error('حدث خطأ أثناء حفظ التعديلات')
            });
        } else {
            formData.append('Clinic.Name', formValue.name ?? '');
            formData.append('Clinic.Phone', formValue.phone ?? '');
            formData.append('Clinic.Email', formValue.email ?? '');
            formData.append('Clinic.Address', formValue.address ?? '');

            if (formValue.description) {
                formData.append('Clinic.Description', formValue.description);
            }
            if (formValue.logoImage) {
                formData.append('Clinic.LogoUrl', formValue.logoImage);
            }

            formData.append('User.FirstName', formValue.user?.firstName ?? '');
            formData.append('User.LastName', formValue.user?.lastName ?? '');
            formData.append('User.Email', formValue.user?.email ?? '');
            formData.append('User.PhoneNumber', formValue.user?.phoneNumber ?? '');
            formData.append('User.Password', formValue.user?.password ?? '');

            this.clinicService.createClinic(formData as any).subscribe({
                next: (response) => {
                    this.notificationService.success('تم إنشاء العيادة والمدير بنجاح');
                    this.loginSendData(formValue);
                    this.clinicSendData(response.data);
                    this.stepCompleted.emit();
                },
                error: () => this.notificationService.error('حدث خطأ أثناء الإنشاء')
            });
        }
    }

    loginSendData(form: DataForm) {
        const data: LoginRequest = {
            email: form.user?.email,
            password: form.user.password
        };
        this.loginDtaInfo.emit(data);
    }

    clinicSendData(response: any) {
        const data: CreateClinicResponse = response;

        this.clinicDtaInfo.emit(data);
    }

    get isEditMode(): boolean {
        return this.clinicId !== null;
    }
}
