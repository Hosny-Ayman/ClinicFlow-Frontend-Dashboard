import { Validators } from '@angular/forms';
import { noWhitespaceValidator } from '../utils/validation.utils';

export const UserValidators = {
    firstName: [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)],

    lastName: [Validators.required, noWhitespaceValidator(), Validators.maxLength(150)],

    email: [Validators.required, noWhitespaceValidator(), Validators.email],

    phoneNumber: [Validators.required, noWhitespaceValidator(), Validators.minLength(11), Validators.maxLength(20), Validators.pattern(/^\d+$/)],

    password: [Validators.required, noWhitespaceValidator(), Validators.minLength(8), Validators.maxLength(100)],

    required: [Validators.required, noWhitespaceValidator()]
};
