import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AdminAccountForm } from '../../models/forms/admin-account-form';
import { isInvalid } from '@/app/shared/utils/form.utils';
import { NumbersOnlyDirective } from '@/app/shared/directives/numbers-only.directive';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-account-step',
    standalone: true,
    imports: [ReactiveFormsModule, ButtonModule, InputTextModule, NumbersOnlyDirective, CommonModule],
    templateUrl: './admin-account-step.html',
    styleUrl: './admin-account-step.scss'
})
export class AdminAccountStep {
    @Input({ required: true })
    form!: FormGroup<AdminAccountForm>;

    @Output() submit = new EventEmitter<void>();
    @Output() previous = new EventEmitter<void>();

    protected readonly isInvalid = isInvalid;

    showPassword = false;
    showConfirmPassword = false;

    get f() {
        return this.form.controls;
    }

    get passwordMismatch(): boolean {
        const pwd = this.form.get('password')?.value;
        const confirmPwd = this.form.get('confirmPassword')?.value;
        return !!confirmPwd && pwd !== confirmPwd;
    }

    get isFormValid(): boolean {
        return this.form.valid && !this.passwordMismatch;
    }
}
