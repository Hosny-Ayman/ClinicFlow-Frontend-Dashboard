import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ClinicInformationForm } from '../models/forms/clinic-information-form';
import { AdminAccountForm } from '../models/forms/admin-account-form';

@Injectable({
    providedIn: 'root'
})
export class CreateClinicFormFactory {
    private readonly fb = inject(FormBuilder);

    createClinicInformationForm() {
        return this.fb.nonNullable.group<ClinicInformationForm>({
            name: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.maxLength(150)] }),

            email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),

            phone: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(11), Validators.maxLength(20)] }),

            address: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.maxLength(300)] }),

            description: this.fb.nonNullable.control('')
        });
    }

    createAdminAccountForm() {
        return this.fb.nonNullable.group<AdminAccountForm>({
            firstName: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.maxLength(100)] }),

            lastName: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.maxLength(100)] }),

            email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),

            phone: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(11), Validators.maxLength(20)] }),

            password: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)] }),

            confirmPassword: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.minLength(8), Validators.maxLength(100)] })
        });
    }
}
