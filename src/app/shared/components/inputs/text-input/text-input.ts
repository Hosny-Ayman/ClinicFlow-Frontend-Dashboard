import { getValidationMessage } from '@/app/shared/utils/validation.utils';
import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-text-input',
    imports: [ReactiveFormsModule],
    templateUrl: './text-input.html',
    styleUrl: './text-input.scss'
})
export class TextInput {
    label = input.required<string>();

    control = input.required<FormControl>();

    type = input<'text' | 'email' | 'password'>('text');

    placeholder = input('');

    icon = input('pi pi-user');

    isPasswordVisible = false;

    get showError(): boolean {
        const control = this.control();

        return control.invalid && (control.touched || control.dirty);
    }

    get validationMessage(): string {
        return getValidationMessage(this.control(), this.label());
    }
}
