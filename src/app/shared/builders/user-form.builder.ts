import { FormBuilder, Validators } from '@angular/forms';
import { CreateUserFormControls } from '../models/forms/create-user-form';
import { UserValidators } from '../validators/user.validators';

export function createUserFormGroup(fb: FormBuilder) {
    return fb.nonNullable.group<CreateUserFormControls>({
        firstName: fb.nonNullable.control('', UserValidators.firstName),

        lastName: fb.nonNullable.control('', UserValidators.lastName),

        email: fb.nonNullable.control('', UserValidators.email),

        phoneNumber: fb.nonNullable.control('', UserValidators.phoneNumber),

        password: fb.nonNullable.control('', UserValidators.password)
    });
}
