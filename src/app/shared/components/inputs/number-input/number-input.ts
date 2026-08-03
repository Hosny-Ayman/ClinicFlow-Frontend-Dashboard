import { getValidationMessage } from '@/app/shared/utils/validation.utils';
import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NumbersOnlyDirective } from '@/app/shared/directives/numbers-only.directive';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-number-input',
    imports: [ReactiveFormsModule, InputTextModule, NumbersOnlyDirective],
    templateUrl: './number-input.html',
    styleUrl: './number-input.scss'
})
export class NumberInput {
    label = input.required<string>();
    control = input.required<FormControl>();
    placeholder = input('');

    suffixText = input('');

    get showError(): boolean {
        const control = this.control();
        return control.invalid && (control.touched || control.dirty);
    }

    get validationMessage(): string {
        return getValidationMessage(this.control(), this.label());
    }
}
