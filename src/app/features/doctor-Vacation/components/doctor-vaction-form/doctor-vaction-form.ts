import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { SelectModule } from 'primeng/select';

import { DoctorVacationService } from '../../services/doctor-vacation.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { AuthService } from '@/app/core/services/auth.service';

@Component({
    selector: 'app-doctor-vaction-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule],
    templateUrl: './doctor-vaction-form.html',
    styleUrl: './doctor-vaction-form.scss'
})
export class DoctorVactionForm implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly vacationService = inject(DoctorVacationService);
    private readonly notificationService = inject(NotificationService);
    private readonly authService = inject(AuthService);

    userId: number | null = null;
    vacationId: number | null = null;
    isEditMode: boolean = false;
    loading: boolean = false;

    statuses = [
        { label: 'قادم', value: 1 },
        { label: 'نشط (في الإجازة)', value: 2 },
        { label: 'منتهي', value: 3 },
        { label: 'ملغي', value: 4 }
    ];

    vacationForm: FormGroup = this.fb.group({
        startDate: [null, Validators.required],
        endDate: [null, Validators.required],
        reason: ['', Validators.maxLength(500)],
        status: [1, Validators.required]
    });

    ngOnInit(): void {
        const userIdParam = this.route.snapshot.paramMap.get('userId');
        const idParam = this.route.snapshot.paramMap.get('vacationId');

        if (userIdParam && idParam) {
            this.userId = Number(userIdParam);
            this.vacationId = Number(idParam);
            this.checkAndLoadVacation();
        } else {
            this.isEditMode = false;
            this.loading = false;

            const currentUser = this.authService.currentUser();
            if (currentUser) {
                this.userId = currentUser.id;
            }
        }
    }

    checkAndLoadVacation() {
        this.loading = true;
        this.vacationService.GetDoctorVacationInformation(this.userId!, this.vacationId!).subscribe({
            next: (res) => {
                if (res.data) {
                    this.isEditMode = true;
                    this.vacationForm.patchValue({
                        startDate: res.data.startDate,
                        endDate: res.data.endDate,
                        reason: res.data.reason || '',
                        status: res.data.status
                    });
                }
                this.loading = false;
            },
            error: (err) => {
                if (err.status === 404) {
                    this.isEditMode = false;
                } else {
                    this.notificationService.error('حدث خطأ أثناء جلب بيانات الإجازة');
                }
                this.loading = false;
            }
        });
    }

    get vacationDuration(): string {
        const start = this.vacationForm.get('startDate')?.value;
        const end = this.vacationForm.get('endDate')?.value;

        if (start && end) {
            const startDate = new Date(start);
            const endDate = new Date(end);

            if (startDate <= endDate) {
                const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                return `${diffDays} أيام`;
            } else {
                return 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
            }
        }
        return 'سيتم حسابها تلقائياً بعد اختيار التواريخ';
    }

    onSubmit() {
        if (this.vacationForm.invalid) {
            this.vacationForm.markAllAsTouched();
            return;
        }

        if (!this.userId) {
            this.notificationService.error('لا يمكن حفظ الإجازة: معرف الطبيب غير متوفر');
            return;
        }

        const formValue = this.vacationForm.getRawValue();

        if (new Date(formValue.startDate) > new Date(formValue.endDate)) {
            this.notificationService.error('لا يمكن أن يكون تاريخ النهاية قبل تاريخ البداية');
            return;
        }

        const payload = {
            userId: this.userId,
            startDate: formValue.startDate,
            endDate: formValue.endDate,
            reason: formValue.reason,
            status: formValue.status,
            id: this.isEditMode ? this.vacationId : undefined
        };

        this.loading = true;

        if (this.isEditMode) {
            this.vacationService.UpdateDoctorVacation(payload).subscribe({
                next: () => {
                    this.notificationService.success('تم تحديث بيانات الإجازة بنجاح');
                    this.router.navigate(['/doctorVacation']);
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء التحديث');
                    this.loading = false;
                }
            });
        } else {
            this.vacationService.CreateDoctorVacation(payload).subscribe({
                next: () => {
                    this.notificationService.success('تم تسجيل الإجازة بنجاح');
                    this.router.navigate(['/doctorVacation']);
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء تسجيل الإجازة');
                    this.loading = false;
                }
            });
        }
    }

    cancel() {
        window.history.back();
    }
}
