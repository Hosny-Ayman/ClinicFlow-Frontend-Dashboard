import { AuthService } from '@/app/core/services/auth.service';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Password } from 'primeng/password';
import { Button } from 'primeng/button';
import { SettingService } from '@/app/core/services/setting.service';
import { finalize, switchMap } from 'rxjs';
import { NotificationService } from '@/app/core/services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, Password, Button],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    private readonly fb = inject(NonNullableFormBuilder);
    private readonly authService = inject(AuthService);
    private readonly settingService = inject(SettingService);
    readonly isLoading = signal(false);
    readonly logo = this.settingService.logo;
    private readonly notification = inject(NotificationService);
    private readonly router = inject(Router);

    readonly loginForm = this.fb.group({
        email: this.fb.control('', {
            validators: [Validators.required, Validators.email]
        }),
        password: this.fb.control('', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)] })
    });

    printEmailControl() {
        console.log(this.loginForm.controls.email);
    }

    get email() {
        return this.loginForm.controls.email;
    }

    get password() {
        return this.loginForm.controls.password;
    }

    onSubmit(): void {
        if (this.loginForm.invalid) {
            this.loginForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

        this.authService
            .login(this.loginForm.getRawValue())
            .pipe(
                switchMap(() => this.authService.loadCurrentUser()),
                finalize(() => this.isLoading.set(false))
            )

            .subscribe({
                next: (response) => {
                    this.router.navigate(['/dashboard']);
                    this.notification.success('تم تسجيل الدخول بنجاح');
                },

                error: (error) => {
                    this.notification.error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
                }
            });
    }
}
