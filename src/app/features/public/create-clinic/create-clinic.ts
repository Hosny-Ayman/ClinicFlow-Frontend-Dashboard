import { Component, inject, signal } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ClinicInformationStep } from './components/clinic-information-step/clinic-information-step';
import { AdminAccountStep } from './components/admin-account-step/admin-account-step';
import { CreateClinicFormFactory } from './factories/create-clinic-form.factory';
import { ClinicStepper } from './components/clinic-stepper/clinic-stepper';
import { CreateClinicService } from './services/create-clinic.service';
import { CreateClinicRequest } from './models/requests/CreateClinicRequest';
import { CreateClinicResponse } from './models/responses/CreateClinicResponse';
import { SuccessStep } from './components/success-step/success-step';
import { NotificationService } from '@/app/core/services/notification.service';
import { AuthService } from '@/app/core/services/auth.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-create-clinic',
    imports: [StepperModule, ClinicInformationStep, AdminAccountStep, SuccessStep, ClinicStepper],
    standalone: true,
    templateUrl: './create-clinic.html',
    styleUrl: './create-clinic.scss'
})
export class CreateClinic {
    private readonly formFactory = inject(CreateClinicFormFactory);
    private readonly createClinicService = inject(CreateClinicService);
    private readonly notificationService = inject(NotificationService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

    readonly activeStep = signal(1);
    clinicResponse!: CreateClinicResponse;

    readonly clinicForm = this.formFactory.createClinicInformationForm();
    readonly adminForm = this.formFactory.createAdminAccountForm();

    constructor() {
        console.log(`Creat: ${this.clinicForm}`);
    }

    previousStep(): void {
        this.activeStep.update((step) => step - 1);
    }

    nextStep(): void {
        if (this.activeStep() === 1) {
            this.clinicForm.markAllAsTouched();
            if (this.clinicForm.invalid) {
                return;
            }
        }

        if (this.activeStep() === 2) {
            this.adminForm.markAllAsTouched();
            if (this.adminForm.invalid) {
                return;
            }
        }

        this.activeStep.update((step) => step + 1);
    }

    private buildRequest(): CreateClinicRequest {
        const clinic = this.clinicForm.getRawValue();
        const admin = this.adminForm.getRawValue();

        return {
            clinic: {
                ...clinic
            },
            user: {
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phoneNumber: admin.phone,
                password: admin.password
            }
        };
    }

    createClinic(): void {
        this.adminForm.markAllAsTouched();

        if (this.adminForm.invalid) {
            return;
        }

        const request = this.buildRequest();

        this.createClinicService.createClinic(request).subscribe({
            next: (response) => {
                if (response && response.isSuccess === false) {
                    this.handleBackendErrors(response.errors!);
                    return;
                }

                console.log(response);
                this.clinicResponse = response.data;
                this.activeStep.set(3);
                this.notificationService.success('تم إنشاء العيادة بنجاح!');
            },
            error: (err) => {
                console.log(err);
                if (err.error && err.error.errors) {
                    this.handleBackendErrors(err.error.errors);
                } else {
                    this.notificationService.error('حدث خطأ في الاتصال بالخادم، يرجى المحاولة لاحقاً.');
                }
            }
        });
    }

    private handleBackendErrors(errors: any[]) {
        errors.forEach((e) => {
            let errorMsg = e.messeage || 'حدث خطأ غير معروف';

            if (errorMsg.toLowerCase().includes('email')) {
                errorMsg = 'هذا البريد الإلكتروني مسجل بالفعل.';
            } else if (errorMsg.toLowerCase().includes('phone')) {
                errorMsg = 'رقم الهاتف مسجل بالفعل.';
            }

            this.notificationService.error(errorMsg);
        });
    }

    autoLogin(): void {
        const adminData = this.adminForm.getRawValue();

        this.authService
            .login({ email: adminData.email, password: adminData.password })
            .pipe(switchMap(() => this.authService.loadCurrentUser()))
            .subscribe({
                next: () => {
                    this.router.navigate(['/dashboard']);
                    this.notificationService.success('تم تسجيل الدخول بنجاح، أهلاً بك!');
                },
                error: () => {
                    this.notificationService.error('حدث خطأ أثناء تسجيل الدخول التلقائي. يرجى تسجيل الدخول يدوياً.');
                    this.router.navigate(['/auth/login']);
                }
            });
    }
}
