import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }
        const isWhitespace = (control.value + '').trim().length === 0;
        return isWhitespace ? { whitespace: true } : null;
    };
}

export function getValidationMessage(control: AbstractControl | null, label: string): string {
    if (!control?.errors) {
        return '';
    }

    if (control.hasError('required')) {
        return `${label} مطلوب.`;
    }

    if (control.hasError('whitespace')) {
        return `${label} لا يمكن أن يحتوي على مسافات فقط.`;
    }

    if (control.hasError('email')) {
        return 'يرجى إدخال بريد إلكتروني صحيح.';
    }

    if (control.hasError('pattern')) {
        return `${label} غير صحيح.`;
    }

    if (control.hasError('maxlength')) {
        const requiredLength = control.getError('maxlength').requiredLength;

        return `${label} يجب ألا يزيد عن ${requiredLength} حرفًا.`;
    }

    if (control.hasError('minlength')) {
        const requiredLength = control.getError('minlength').requiredLength;

        return `${label} يجب ألا يقل عن ${requiredLength} أحرف.`;
    }

    return 'القيمة المدخلة غير صحيحة.';
}
