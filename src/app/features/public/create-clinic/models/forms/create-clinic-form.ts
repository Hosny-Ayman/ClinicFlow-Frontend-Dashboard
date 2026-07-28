import { FormControl } from '@angular/forms';

export interface CreateClinicForm {
    name: FormControl<string>;

    email: FormControl<string>;

    phone: FormControl<string>;

    address: FormControl<string>;

    description: FormControl<string>;
}
