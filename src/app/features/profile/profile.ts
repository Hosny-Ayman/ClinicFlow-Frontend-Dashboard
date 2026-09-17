import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { UserService } from '@/app/features/user/services/user.service';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { UserValidators } from '@/app/shared/validators/user.validators';
import { TextInput } from '@/app/shared/components/inputs/text-input/text-input';
import { NumberInput } from '@/app/shared/components/inputs/number-input/number-input';
import { UpdateMyInformationRequest } from '@/app/features/user/models/requests/update-my-information-request';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        AvatarModule,
        ButtonModule,
        TextInput,
        NumberInput
    ],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class Profile implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly userService = inject(UserService);
    readonly authService = inject(AuthService);
    private readonly notificationService = inject(NotificationService);
    private readonly cdr = inject(ChangeDetectorRef);

    readonly isLoading = signal(true);
    readonly isSaving = signal(false);

    originalData: UpdateMyInformationRequest | null = null;

    profileForm = this.fb.nonNullable.group({
        firstName: ['', UserValidators.firstName],
        lastName: ['', UserValidators.lastName],
        email: ['', UserValidators.email],
        phoneNumber: ['', UserValidators.phoneNumber]
    });

    ngOnInit(): void {
        this.loadProfile();
    }

    loadProfile(): void {
        this.isLoading.set(true);
        this.userService.GetMyInformation().subscribe({
            next: (res) => {
                if (res.isSuccess && res.data) {
                    const data = res.data;
                    const firstName = data.firstName ?? (data.fullName ? data.fullName.split(' ')[0] : '');
                    const lastName = data.lastName ?? (data.fullName ? data.fullName.split(' ').slice(1).join(' ') : '');
                    const email = data.email ?? '';
                    const phoneNumber = data.phoneNumber ?? '';

                    this.originalData = { firstName, lastName, email, phoneNumber };

                    this.profileForm.setValue({
                        firstName,
                        lastName,
                        email,
                        phoneNumber
                    });
                    this.profileForm.markAsPristine();
                }
                this.isLoading.set(false);
                this.cdr.markForCheck();
            },
            error: () => {
                this.isLoading.set(false);
                this.notificationService.error('فشل تحميل بيانات الملف الشخصي');
                this.cdr.markForCheck();
            }
        });
    }

    resetForm(): void {
        if (this.originalData) {
            this.profileForm.setValue(this.originalData);
            this.profileForm.markAsPristine();
            this.profileForm.markAsUntouched();
        }
    }

    onSubmit(): void {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        const raw = this.profileForm.getRawValue();
        const payload: UpdateMyInformationRequest = {
            firstName: raw.firstName.trim(),
            lastName: raw.lastName.trim(),
            email: raw.email.trim(),
            phoneNumber: raw.phoneNumber.trim()
        };

        if (
            this.originalData &&
            payload.firstName === this.originalData.firstName &&
            payload.lastName === this.originalData.lastName &&
            payload.email === this.originalData.email &&
            payload.phoneNumber === this.originalData.phoneNumber
        ) {
            this.notificationService.info('لم تقم بإجراء أي تغييرات على البيانات');
            return;
        }

        this.isSaving.set(true);
        this.userService.UpdateMyInformation(payload).subscribe({
            next: (res) => {
                this.isSaving.set(false);
                if (res.isSuccess) {
                    this.notificationService.success('تم حفظ بياناتك الشخصية بنجاح');
                    this.originalData = { ...payload };
                    this.profileForm.markAsPristine();
                    this.profileForm.markAsUntouched();

                    // Update auth state so topbar reflects updated name and initials immediately
                    this.authService.updateCurrentUser({
                        firstName: payload.firstName,
                        lastName: payload.lastName,
                        fullName: `${payload.firstName} ${payload.lastName}`,
                        email: payload.email,
                        phoneNumber: payload.phoneNumber
                    });
                } else {
                    const msg = res.errors && res.errors.length > 0 ? res.errors[0] : 'حدث خطأ أثناء حفظ البيانات';
                    this.notificationService.error(msg);
                }
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.isSaving.set(false);
                const errorDetail = err?.error?.errors?.[0] || err?.error?.message || 'حدث خطأ أثناء حفظ البيانات';
                this.notificationService.error(errorDetail);
                this.cdr.markForCheck();
            }
        });
    }
}
