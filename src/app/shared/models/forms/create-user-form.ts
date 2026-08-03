import { FormControl } from '@angular/forms';

export interface CreateUserFormControls {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    phoneNumber: FormControl<string>;
}
