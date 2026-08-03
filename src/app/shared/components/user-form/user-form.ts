import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateUserFormControls, CreateUserFormControls as CreateUserFormGroup } from '../../models/forms/create-user-form';
import { TextInput } from '../inputs/text-input/text-input';

@Component({
    selector: 'app-user-form',
    imports: [ReactiveFormsModule, TextInput],
    templateUrl: './user-form.html',
    styleUrl: './user-form.scss'
})
export class UserForm {
    userForm = input.required<FormGroup<CreateUserFormControls>>();
}
