import { FormControl } from '@angular/forms';

export interface ClinicInformationForm {
    name: FormControl<string>;

    email: FormControl<string>;

    phone: FormControl<string>;

    address: FormControl<string>;

    description: FormControl<string>;
}
