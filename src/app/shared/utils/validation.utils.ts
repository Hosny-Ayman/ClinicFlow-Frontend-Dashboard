import { AbstractControl } from '@angular/forms';

export function getValidationMessage(control: AbstractControl | null, label: string): string {
    if (!control?.errors) {
        return '';
    }

    if (control.hasError('required')) {
        return `${label} مطلوب.`;
    }

    if (control.hasError('email')) {
        return 'يرجى إدخال بريد إلكتروني صحيح.';
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
