import { Component, inject, signal } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { ClinicStepper } from './components/clinic-stepper/clinic-stepper';
import { CreateClinicResponse } from './models/responses/CreateClinicResponse';
import { SuccessStep } from './components/success-step/success-step';
import { NotificationService } from '@/app/core/services/notification.service';
import { AuthService } from '@/app/core/services/auth.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../../auth/models/login-request';
import { ClinicForm } from '../../clinic/components/clinic-form/clinic-form';

@Component({
    selector: 'app-create-clinic',
    imports: [StepperModule, SuccessStep, ClinicStepper, ClinicForm],
    standalone: true,
    templateUrl: './create-clinic.html',
    styleUrl: './create-clinic.scss'
})
export class CreateClinic {
    private readonly notificationService = inject(NotificationService);
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private loginInfo: LoginRequest = {
        email: '',
        password: ''
    };

    readonly activeStep = signal(1);
    clinicResponse!: CreateClinicResponse;

    nextStep(): void {
        this.activeStep.update((step) => step + 1);
    }

    loginDataInfo(data: LoginRequest) {
        this.loginInfo = data;
    }

    clinicDataInfo(data: CreateClinicResponse) {
        this.clinicResponse = data;
    }

    autoLogin(): void {
        this.authService
            .login({ email: this.loginInfo.email, password: this.loginInfo.password })
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
