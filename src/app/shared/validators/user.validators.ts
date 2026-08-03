import { Validators } from '@angular/forms';

export const UserValidators = {
    firstName: [Validators.required, Validators.maxLength(150)],

    lastName: [Validators.required, Validators.maxLength(150)],

    email: [Validators.required, Validators.email],

    phoneNumber: [Validators.required, Validators.minLength(11), Validators.maxLength(20)],

    password: [Validators.required, Validators.minLength(8), Validators.maxLength(100)],

    required: [Validators.required]
};
