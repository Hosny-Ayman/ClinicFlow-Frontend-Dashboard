import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service'; // تأكد من مسار السيرفيس عندك
import { NotificationService } from '@/app/core/services/notification.service';
import { createUserFormGroup } from '@/app/shared/builders/user-form.builder';
import { UserForm } from '@/app/shared/components/user-form/user-form';

@Component({
    selector: 'app-receptionist-form',
    imports: [ReactiveFormsModule, UserForm],
    templateUrl: './receptionist-form.html',
    styleUrl: './receptionist-form.scss'
})
export class ReceptionistForm implements OnInit {
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);
    private readonly route = inject(ActivatedRoute);
    private readonly receptionistId = this.route.snapshot.paramMap.get('id');
    private readonly userService = inject(UserService);
    private readonly notificationService = inject(NotificationService);

    // استخدمنا نفس البيلدر بتاع اليوزر عشان نوحد الشغل
    receptionistForm = this.fb.group({
        user: createUserFormGroup(this.fb)
    });

    ngOnInit(): void {
        if (this.isEditMode) {
            // بنشيل الفاليديشن من الباسورد في حالة التعديل
            const passwordControl = this.receptionistForm.get('user.password');
            if (passwordControl) {
                passwordControl.clearValidators();
                passwordControl.updateValueAndValidity();
            }
            this.loadReceptionist();
        }
    }

    loadReceptionist() {
        this.userService.GetUser(Number(this.receptionistId)).subscribe({
            next: (res) => {
                this.receptionistForm.patchValue({
                    user: {
                        firstName: res.data.firstName,
                        lastName: res.data.lastName,
                        email: res.data.email,
                        phoneNumber: res.data.phoneNumber
                    }
                });
                this.cdr.detectChanges();
            },
            error: () => this.notificationService.error('حدث خطأ أثناء تحميل البيانات')
        });
    }

    onSubmit() {
        if (this.receptionistForm.invalid) {
            this.receptionistForm.markAllAsTouched();
            return;
        }

        const formValue = this.receptionistForm.getRawValue().user;

        // تجهيز الداتا عشان تتبعت للباك إند
        const requestPayload: any = {
            id: this.isEditMode ? Number(this.receptionistId) : null,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            email: formValue.email,
            phoneNumber: formValue.phoneNumber,
            password: formValue.password
        };

        if (this.isEditMode) {
            // لو بنعمل إيديت ومكتبش باسورد، بنمسحه من الـ payload عشان ميتبعتش فاضي
            if (!requestPayload.password) {
                delete requestPayload.password;
            }

            this.userService.UpdateUser(requestPayload).subscribe({
                next: () => this.notificationService.success('تم حفظ التعديلات بنجاح'),
                error: () => this.notificationService.error('حدث خطأ أثناء حفظ البيانات')
            });
        } else {
            this.userService.CreateReceptionists(requestPayload).subscribe({
                next: () => this.notificationService.success('تم إضافة موظف الاستقبال بنجاح'),
                error: () => this.notificationService.error('حدث خطأ أثناء حفظ البيانات')
            });
        }
    }

    get isEditMode(): boolean {
        return this.receptionistId !== null;
    }
}
