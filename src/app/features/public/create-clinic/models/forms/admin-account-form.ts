import { FormControl } from '@angular/forms';

export interface AdminAccountForm {
    firstName: FormControl<string>;

    lastName: FormControl<string>;

    email: FormControl<string>;

    phone: FormControl<string>;

    password: FormControl<string>;

    confirmPassword: FormControl<string>;
}
